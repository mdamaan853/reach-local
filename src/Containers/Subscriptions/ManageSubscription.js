import React from 'react';
import PageTitle from '../../Components/Helmet';
import {makePayment,approveSubs,subscriptionGetAll,cancelSubs,rejectSubs} from '../../Services/subscriptions-service';
import { ToastsStore,ToastsContainerPosition, ToastsContainer } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import PackageDetail from '../../Components/ServicePackage/ManagePackageDetail';
import Popup from '../../Components/Popup/Popup';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

export default class ManageSubscription extends React.Component{

    constructor(props){
        super(props);
        this.state={
            list:[],
            listArr:[],
            submitLoader:false,
            openPopup: false,
            detail:[],
            walletBalance:'',
            walletPage:false
        }
        this.subscriptionList = this.subscriptionList.bind(this);
        this.detailList = this.detailList.bind(this);
        this.makePayment = this.makePayment.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.actionHandler = this.actionHandler.bind(this);
        this.subscriptionCancel = this.subscriptionCancel.bind(this);
        this.subscriptionRejection = this.subscriptionRejection.bind(this);
        this.subscriptionApproval = this.subscriptionApproval.bind(this);
    }

    componentDidMount(){
        let user = JSON.parse(localStorage.getItem("userInfo"));
        this.setState({
            walletBalance: user.walletInfo.amount
        });
        this.subscriptionList();    
    }

    togglePopup(){
        this.setState({
            openPopup: !this.state.openPopup
        });
    }

    subscriptionList(){
        let body={
            maxResults: 50,
            start: 0
        }
        subscriptionGetAll(body)
        .then( response => response.json())
        .then( data=>{      
            if(data.success){
                this.setState({
                    list: data.subscriptionDTOs,
                    submitLoader: false
                })
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            console.log(error);
            this.setState({
                submitLoader: true
            })
            ToastsStore.error("Something went wrong, Please try again later.!!!");
        })     
    }
    
    detailList(id){
        let temp = this.state.list;
        let detailArr=[]; 
        for(let i=0;i<= temp.length; i++){     
            if(temp[i].code === id){
                detailArr.push(temp[i].subscriptionServiceMappings);
                this.setState({
                    listArr: temp[i]
                })
                
                break;
            }
        }      
        // this.setState({
        //     detail:detailArr,
        //     listArr:listAr
        // })
        // return;
    }

    subscriptionCancel(id){
        let body={
            subscriptionCode:id
        }
        cancelSubs(body)
        .then(response => response.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    submitLoader:false
                })
                ToastsStore.success(data.message);
                window.location.reload();
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            this.setState({
                submitLoader:true
            })
        })
    }
    
    subscriptionRejection(id){
        let body={
            subscriptionCode:id
        }
        rejectSubs(body)
        .then(response => response.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    submitLoader:false
                })
                ToastsStore.success(data.message);
                window.location.reload();
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            this.setState({
                submitLoader:true
            })
        })
    }
   
    subscriptionApproval(id){
        let body={
            subscriptionCode:id
        }
        approveSubs(body)
        .then(response => response.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    submitLoader:false
                })
                ToastsStore.success(data.message);
                window.location.reload();
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            this.setState({
                submitLoader:true
            })
        })
    }

    makePayment(id,amt){
        let body={
            subscriptionCode:id,
            amount:amt
        }
        makePayment(body)
        .then(response => response.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    submitLoader:false
                })
                ToastsStore.success(data.message);
                window.location.reload();
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            this.setState({
                submitLoader:true
            })
        })
    }

    actionHandler(item,id,price){    
        if(item === 'view'){
            this.detailList(id);
            this.togglePopup();
        }
        if(item === 'cancel'){
            this.subscriptionCancel(id);
        }
        if(item === 'reject'){
            this.subscriptionRejection(id);
        }
        if(item === 'accept'){
            this.subscriptionApproval(id);
        }
        if(item === 'buy'){  // Remaiing: comparison with the walet balance with the available total price  
            let wb=parseInt(this.state.walletBalance);
            let amt =parseInt(price);
            // this.setState({
            //     submitLoader:true
            // })
            if(amt<=wb){
                this.makePayment(id,price);
            }
            else if(!amt && amt>wb){
                this.setState({
                    walletPage:true
                })
            }
        }
    }

    render(){
        return(
            <main className="wrapper-container">
                <PageTitle title="Manage Subscription" description="Welcome to Manage Subscription"/>
                <section className="card-custom pad--half">
                    <h4 className="ui header">Manage Subscription</h4>
                </section>
                <section className="card-custom pad--half leads-table-wrapper" style = {{maxHeight: "70vh"}}>                   
                     <table className="client">
                        <thead>
                            <tr>
                                <th>Sl.No.</th>
                                <th>Price</th>
                                <th>Subscription Id</th>
                                <th colspan="2">Service Package Detail</th>
                                <th>ServicePackageId</th>
                                <th colspan="2">Client Detail</th>
                                <th>View Detail</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                                {    
                                this.state.list && this.state.list.length>0 && this.state.list.map((item,index) =>{      
                                    return(
                                    <tr key={index}>
                                        <td>{index}</td>
                                        <td>{item.totalPrice}</td>
                                        <td>{item.code}</td>
                                        <td>{item.servicePackageName}</td>
                                        <td>{item.servicePackageDesc}</td>
                                        <td>{item.servicePackageCode}</td>
                                        <td>{item.businessMinDTO.name}</td>
                                        <td>{item.businessMinDTO.email}</td>
                                        <td>
                                            <div className={"flex flex-direction--col"}>
                                            {
                                                item.allowedActions.map((subitem)=>{
                                                    let btnClass = classNames({
                                                        'btn': true,
                                                        'btn-fill': true, 
                                                        'btn-blue': subitem === 'view',  
                                                        'btn-green': subitem === 'accept' || subitem === 'buy',
                                                        'btn-warning':subitem ==='reject',
                                                        'btn-success':subitem ==='subscribe',
                                                        'btn-danger':subitem === 'cancel',
                                                        });
                                                    return( 
                                                        <React.Fragment>
                                                            {
                                                                !this.state.walletPage &&
                                                                    <button style={{fontSize:"12px", padding:"0px",margin:"0.5px"}} onClick={()=>{this.actionHandler(subitem,item.code,item.totalPrice)}} className={btnClass}>{subitem}</button>                                                     
                                                            }             
                                            
                                                            {
                                                                this.state.walletPage && 
                                                                <Link to="/buycredits">
                                                                    <button style={{fontSize:"12px", padding:"0.5px",margin:"0.5px"}} onClick={()=>{this.actionHandler(subitem,item.code,item.totalPrice)}} className={btnClass}>{subitem}</button>                                                
                                                                </Link>
                                                            }
                                                        </React.Fragment>
                                                        );
                                                }) 
                                            } 
                                            </div> 
                                            {/* <button onClick={()=>this.viewDetail(item.code)} className="btn btn-fill margin-left--auto">DETAIL</button> */}
                                        </td> 
                                        <td>
                                            {item.status}
                                        </td> 
                                    </tr>                          
                                    );
                                })                         
                                }     
                        </tbody>
                    </table>
                </section>
                {
                    this.state.openPopup && 
                    <Popup title="Services" togglePopup={this.togglePopup} maxWidth="900px">
                        <PackageDetail
                            listArr={this.state.listArr}
                            detail={this.state.detail}
                            togglePopup={this.togglePopup}
                        />
                    </Popup>
                }       
                {
                    this.state.submitLoader && 
                    <div className="margin-top--double">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
               <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
            </main>
        );
    }
}