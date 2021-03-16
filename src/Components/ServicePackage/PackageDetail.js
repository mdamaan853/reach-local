import React from 'react';
import {Link} from 'react-router-dom';
import utils from '../../Services/utility-service';
import {submitPackage,requestPackage,getUpdatedWallet,makePayment} from '../../Services/subscriptions-service';
import { ToastsStore,ToastsContainerPosition, ToastsContainer } from 'react-toasts';

const initialState = {
    count:0,
    wb:null,
    ta:0,
    info:null,
    bought: false,
    notMin: false
}
export default class Services extends React.Component{
    
    constructor(props){
        super(props);
        this.state = initialState;
        this.state.info = this.props.info;
    }

    componentDidMount(){
        getUpdatedWallet({})
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
                this.setState({
                    wb: data.walletInfo.usableCredits
                },()=>{
                    this.calculate();
                })                              
            } 
        })
        .catch(error => {
              console.log(error);
        })     
    }

    handleChange = (event,index) => {
        const val = event.target.value;
        let temp = this.state.info;
        temp.services[index].val = val;
        this.setState({
            info: temp
        },()=>{
            this.calculate();
        })
    }

    calculate(){
        let tam = 0;
        this.state.info.services.forEach(e => {
             if(e.creditUnitType === 'price'){
                tam+= parseFloat(e.val);
             }else{
                tam+= parseFloat(e.val * e.pricePerUnit);
             }  
        });
        this.setState({
            ta: tam
        })
    }

    purchaseAg(){
        this.setState({
            bought: false
        })
    }

    addCredits(){
        this.makePurchase();
    }

    makePurchase(){
        if(this.checkForMinValue()){
            let body = {
                servicePackageCode: this.state.info.code,
                services: this.getServicesForReq(this.state.info.services)
            }
            submitPackage(body)
            .then( response => response.json())
            .then( data => {
                if(data.success){
                    ToastsStore.success(data.message);
                    this.makePaymen(data.subscriptionDTO);
                }
                else{
                    ToastsStore.error(data.message);
                }
            }) 
            .catch( error =>{
               ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            })
        } 
    }

    makePaymen(data){
        let body={
            subscriptionCode: data.code,
            amount: data.totalPrice
        }
        
        makePayment(body)
        .then( r => r.json())
        .then( data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    bought: true
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( error =>{
            // console.log("welcome to make payement error zone");
            ToastsStore.error("Payment not Successful. Please Try Again Later.!!!");
        })
    }

    checkForMinValue(){
        let isValid = true;
        let temp = this.state.info;
        temp.services.forEach(e => {
            if(e.val < e.minCredit){
                e.isMin = true;
                isValid = false
            }else{
                e.isMin = false;
            }
        });
        this.setState({
            info: temp,
            notMin: !isValid
        })
        return isValid;
    }

    makePurchaseReq(){
        let body = {
            servicePackageCode: this.state.info.code,
            services: this.getServicesForReq(this.state.info.services)
        }
        requestPackage(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    bought: true
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        }) 
        .catch( error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
        })
    }

    getServicesForReq(data){
        let temp = [];
        data.forEach(e=>{
            let obj = {
                "code": e.code,
                "creditUnitType": e.creditUnitType,
                "requestedCredit": e.val
            }
            temp.push(obj);
        })
        return temp;
    }

    getTotalPrice(pkg){
        let prc = this.state.ta;
        let tp = 0;
        let wb = this.state.wb;
        if( pkg.discountType==='price' && pkg.discount !== null){
            if(prc<pkg.discount){
                prc= 0;
            }else{
                prc = prc-pkg.discount;
            }
        }
        if(pkg.discountType==='perc' && pkg.discount !== null){
            prc = prc-(prc*pkg.discount/100);
        }
        if(pkg.taxMultiplier !== null){
            tp = prc + prc*pkg.taxMultiplier;
        }
        let tax = tp - prc;
        let diff = wb - tp;
        wb = (diff >= 0);
        tax = tax.toFixed(2);
        tp = tp.toFixed(2);
        return {tax,tp,wb,diff};      
    }

    render(){
        let pkg = this.state.info;
        let {tax,tp,wb,diff} = this.getTotalPrice(pkg);
        return(
            <React.Fragment>
                {
                    !this.state.bought &&
                <React.Fragment>
                <div onClick={()=>this.props.back()} className="margin-btm--half"><button className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></div>   
                <div className="margin-top col-13">
                    <h4 class="ui dividing header">Services in: <span style={{color: 'rgb(65, 131, 196)'}}>{pkg.name}</span></h4>
                </div>
                <div className={`${utils.isMobile ? "flex flex-direction--col flex-wrap col-20 padding-top":"flex flex-direction--row flex-wrap col-20 padding-top"}`}>
                    <div className={`${utils.isMobile ? "col-20": "col-13"} flex flex-direction--col flex-wrap`}>
                        <div className="col-20 flex flex-wrap leadDetail-card pad">
                            <table className="ui celled table">
                                <thead className="">
                                    <tr className="text--center">
                                        <th className="">Service Name</th>
                                        <th className="">Quantity/Price</th>
                                        <th className="">Payable Amount</th>
                                    </tr> 
                                </thead> 
                                <tbody className="">                     
                                    {
                                        pkg.services && pkg.services.length>0 && pkg.services.map((item,index)=>{
                                            return(
                                                <tr key={index} className="text--center">
                                                    <td className=""><b>{item.name}</b></td>
                                                    <td className="">
                                                        <div className="col-16 margin-left--auto margin-right--auto">
                                                            <label>{`${item.creditUnitType === "price" ? 'Enter Amount in Rs' : 'Enter Quantity'}`}</label>
                                                            <input  type="number"
                                                                className="form-control"
                                                                name="val"
                                                                value={item.val}
                                                                onChange={(event)=>this.handleChange(event,index)}
                                                                style={{width:'100%'}}
                                                                placeholder={item.creditUnitType === "price" ? "Enter Amount" : "Enter Quantity"}
                                                            />
                                                        </div>
                                                        {/* {
                                                            item.creditUnitType === "count" && */}
                                                            <div className="text-intent margin-top--quar" style={{fontSize:'12px'}}>Per Unit Price is &#8377;{item.pricePerUnit}</div>
                                                        {/* } */}
                                                    </td>
                                                    {
                                                        item.creditUnitType === "price" &&
                                                        <td>
                                                            <div className="text--center text--bold">&#8377; {item.val}</div>
                                                            {
                                                                item.isMin &&
                                                                <div className="text--center form-error">Minimum Amount to be Purchased &#8377; {item.minCredit}</div>
                                                            }
                                                        </td>   
                                                    }
                                                    {
                                                        item.creditUnitType === "count" &&
                                                        <td>
                                                            <div className="text--center"> <span>{item.val}</span> x <span>&#8377;{item.pricePerUnit}</span> = <span className="text--bold">&#8377;{(item.val * item.pricePerUnit).toFixed(2)}</span></div>
                                                            {
                                                                item.isMin &&
                                                                <div className="text--center form-error">Minimum Quantity to be Purchased {item.minCredit}</div>
                                                            }
                                                        </td>   
                                                    }
                                                </tr>
                                            );
                                        })       
                                    }                        
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`${utils.isMobile ? "col-20 margin-top-five": "col-6 margin-left"} flex flex-direction--col flex-wrap leadDetail-card`}>
                        <div className="bdr-btm col-20 flex pad">
                            <h3>Order Summary</h3>
                        </div>
                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                            <div className="text--bold text--darker">Total Amount</div>
                                <div className="text--bold text--darker">&#8377; {(this.state.ta).toFixed(2)}</div>
                        </div>
                        {
                            (pkg.discountType === 'price' && pkg.discount !== null) && this.state.ta > 0 &&
                            <div className="col-20 flex pad bdr-btm flex-space--btw">
                                <div className="text--bold text--darker">Discount</div>
                                    <div className="text--bold text--darker">- &#8377; {(pkg.discount).toFixed(2)}</div>
                            </div>
                        }
                        {
                            (pkg.discountType === 'perc' && pkg.discount !== null) && this.state.ta > 0 &&
                            <div className="col-20 flex pad bdr-btm flex-space--btw">
                                <div className="text--bold text--darker">Discount</div>
                                    <div className="text--bold text--darker">- &#8377; {(this.state.ta*pkg.discount/100).toFixed(2)}</div>
                            </div>
                        }
                        {
                            this.state.ta > 0 && pkg.taxMultiplier &&
                            <div className="col-20 flex pad bdr-btm flex-space--btw">
                                <div className="text--bold text--darker">Tax</div>
                                    <div className="text--bold text--darker"> &#8377; {tax}</div>
                            </div>
                        }
                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                                <div className="text--bold text--darker">Payable Amount</div>
                                    <div className="text--bold text--darker"> &#8377; {tp}</div>
                            </div>
                        <div className="col-20 flex pad flex-space--btw text-intent">
                            <div>Wallet Balance</div>
                            <div>&#8377; {this.state.wb}</div>
                        </div>
                        {
                            wb && !this.state.bought &&
                            <React.Fragment>
                                {
                                    this.state.notMin &&
                                    <div className="margin-top--quar margin-btm--quar form-error">Cannot Purchase less than specified minimum Quantity</div>
                                }
                                <button onClick={()=>this.makePurchase()} className="ui big green button" style={{width:'100%'}}> Purchase </button>
                            </React.Fragment>
                        }
                        {
                            !wb && !this.state.bought &&
                            <React.Fragment>
                                <div className="col-20 form-error padding-btm paddint-top--half text--center">
                                    <div>Your Wallet balance is not sufficient to make purchase.</div>
                                </div>
                                <Link to={`/buycredits?prfl=${diff}`}>
                                    <button onClick={()=>this.addCredits()} className="ui big teal button" style={{width:'100%'}}> Go To Wallet </button>
                                </Link>
                            </React.Fragment>
                        }
                           
                    </div>
                    <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
                </div>
                </React.Fragment>
            } 
            {
                this.state.bought &&
                <article className="login-wrapper flex flex-direction--col pad" style={{maxWidth:"40%",fontSize:"medium"}}>
                    <b className="text--center" style={{textAlign:'justify',fontSize:'1.3em',lineHeight:'1.3em',margin:'1.5em 0 2em'}}>Thank you for purchasing package.</b>
                    <div className="margin-btm--half flex align-space-between">
                        <button onClick={()=>this.purchaseAg()} className="btn btn-fill btn-success">Purchase Again </button>   
                        <Link to="/manage/subscriptions"> 
                            <button className="btn btn-fill btn-info">View Subscriptions </button>
                        </Link>
                    </div>
                </article>
            }             
            </React.Fragment>
        );
    }
}


                        