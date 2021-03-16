import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import {fetchRoles} from '../../Services/roles-service';
import utils from '../../Services/utility-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {getMediums} from '../../Services/medium-service';
import {getAudienceMediumMapping} from '../../Services/datasource-service';
import {getCampaign}from '../../Services/campaign-service';
import {getAllClients} from '../../Services/clients-service';
import {unPaidSubs,makePayment,getUpdatedWallet} from '../../Services/subscriptions-service';
import {getAllServicePackages} from '../../Services/subscriptions-service';
import './BuyCredit.css';
import Revenue from '../../Components/Revenue/Revenue';
import {Link} from 'react-router-dom';
import PopUp from '../../Components/Popup/Popup';
import TransactionHistory from '../../Components/TransactionHistory/TransactionHistory';
import {updateManualTxn} from '../../Services/subscriptions-service';
import DatePicker from "react-datepicker";
import { Icon, Popup } from 'semantic-ui-react';
import Youtube from '../../Components/Youtube/Youtube';
import Packages from '../Subscriptions/ServicePackages';

const initialState = {
    formControls: {
        amount: {
          value: '1000'
        },
        bId: {
            value: '',
        },
        tId: {
            value: '',
        },
        pmtMode: {
            value: '',
        },
        amt: {
            value: '',
        },
        invoice:{
            value:""
        },
        // url: {
        //     value: '',
        // },
        date: {
            value: '',
        },
        remarks:{
            error:'',
            value:''
        },
        client:{
            value:'',
        }
    },
    datasources:[{id:'1',name:'sample 1'},{id:'2',name:'sample 2'},{id:'3',name:'sample 3'}],
    detailOpen:'SMS',
    error: "",
    rolesFetched:false,
    accessDenied:false,
    active:6,
    userInfo:{
        walletInfo: {
            amount: 0,
            walletId: 0
        }
    },
    list:[],
    mediums:[],
    segments:[],
    servicePackages:[],
    clients:[],
    showSegments:false,
    loader:false,
    howTo: false
}

class BuyCredits extends Component {
    constructor(props){
        super(props);
        this.state = initialState;
    }

    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
                formControls: {
                    ...this.state.formControls,
                    [name]: {
                    ...this.state.formControls[name],
                    value
                    }
                }
        });
        
    }
    getAllServicePackages(){
        let body={}
        getAllServicePackages(body)
        .then( response => response.json())
        .then( data=>{
            if(data.success){
                this.setState({
                    servicePackages: data.servicePackages
                })
                // ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            console.log(error);
            ToastsStore.error("Something Went Wrong, Please Try Again Later.!!!");
        })     
    }

    showDetail(item){
        this.setState({
            detailOpen:item
        })
    }

    componentDidMount(){
        if(utils.isAdmin){
            this.afterDidMount();
        }else{
            this.getRequiredRoles();
        }
    }

    getRequiredRoles(){
        fetchRoles('Credits')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
                // console.log(data.subRoles);
                this.afterDidMount();
            }else if(data.success && data.subRoles && data.subRoles.length === 0){
                this.setState({
                    accessDenied:true
                })
            }else{
                ToastsStore.error("Something went wrong, Please Try Again Later ");
            }
        })
        .catch(error =>{
             console.log(error);
             ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    afterDidMount(){
        this.setState({
            rolesFetched: true

        },()=>{
            let qp = utils.getQueryParams();
            if(qp && qp.prfl){
                this.setState({
                    active: 2
                },()=>{
                    document.getElementById("input-amount").value = (1-(parseFloat(qp.prfl))).toFixed(2);
                })
            }else{
                this.changeTab(0);
            }
            if(qp && qp.success){
                ToastsStore.success(qp.message,3000);
            }else if(qp && !qp.success && qp.message){
                ToastsStore.error(qp.message,3000);
            }
        })
        let userInfo = localStorage.getItem("userInfo");
        if(userInfo){
            let info = JSON.parse(userInfo);
            if(info.walletInfo){
                this.setState({
                    userInfo: info
                })
            }
        }
        this.fetchUpdatedWalletBalance();
    }

    fetchUpdatedWalletBalance(){
        getUpdatedWallet({})
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
                let temp = this.state.userInfo;
                temp.walletInfo.amount = data.walletInfo.amount;
                this.setState({
                    userInfo: temp
                });                              
            } 
        })
        .catch(error => {
              console.log(error);
        })
    }

    checkWallet(){
        let body={
            maxResults: 50,
            start: 0
        }
        unPaidSubs(body)
        .then( response => response.json())
        .then( data=>{      
            if(data.success){
                this.setState({
                    list: data.subscriptionDTOs,
                })
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

    submitPaymentForm(){
        let form = document.getElementById("paymentForm");
        let amount = document.getElementById("input-amount").value;
        if(!amount || (amount && amount < 1)){
            this.setState({
                error: "Please enter a valid amount"
            })
            return;
        }else{
            this.setState({
                error: ""
            })
        }
        document.getElementById("form-amount").value = parseInt(amount);
        form.submit();
    }

    buyNow(index){
        let body = {
            "amount": this.state.list[index].totalPrice,
            "subscriptionCode": this.state.list[index].code
        }
        makePayment(body)
        .then( response => response.json())
        .then( data=>{      
            if(data.success){
                ToastsStore.success(data.message);
                let body={
                    maxResults: 50,
                    start: 0
                }
                unPaidSubs(body)
                .then( response => response.json())
                .then( data=>{      
                    if(data.success){
                        this.setState({
                            list: data.subscriptionDTOs,
                        })
                    }
                })
                .catch(error =>{
                    console.log(error);
                    this.setState({
                        submitLoader: true
                    })
                    ToastsStore.error("Something went wrong, Please try again later.!!!");
                })
            }else{
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

    changeTab(tab){
        this.setState({
            active: tab
        },()=>{
            if(tab === 6){
                this.fetchMediums();
            }else if(tab === 1){
                this.checkWallet();
            }
            else if(tab === 4){
                this.fetchClients();
            }
        })
    }

    fetchMediums(){
        const body={}
        getMediums(body)
        .then(response => response.json())
        .then(data => {
              if (data.success) { 
                    this.setState({
                          mediums: this.formatMediums(data.mediumList), 
                    },()=>{
                        for(let i=0;i<this.state.mediums.length;i++){
                            this.fetchDatasourcesByMedium(i);
                        }
                    });                              
              } 
        })
        .catch(error => {
              console.log(error);
        })
    }

    formatMediums(data){
        if(data && data.length>0){
            data.forEach(el => {
                el['audienceGroups'] = [];
                el['ammId'] = "";
                el['rc'] = "";
                el['rpc'] = "";
                el['tax'] = 0;
                el['minRc'] = 0;
                el['ta'] = 0;
                el['error'] = "";
            });
        }
        return data;
    }

    fetchDatasourcesByMedium(index){
        let body = {
              mediumId: this.state.mediums[index].id                
        }
        getAudienceMediumMapping(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let temp = this.state.mediums;
                temp[index].audienceGroups = data.audienceGroups; 
                this.setState({
                    mediums: temp     
                });                 
            }
        })
        .catch(error => {
              console.log(error);
        })
    }
  
    payNow(index){
        let temp = this.state.mediums;
        let medium = temp[index];
        if(!medium.ammId){
            temp[index].error = "Please choose Datasource to proceed";
        }else if(medium.rc < medium.minRc){
            temp[index].error = "Minimum "+medium.minRc+" credits has to be bought";
        }else{
            temp[index].error=""
        }
        this.setState({
            mediums: temp
        })
        if(!temp[index].error){
            let form = document.getElementById("paymentForm");
            document.getElementById("form-amount").value = parseFloat((medium.ta).toFixed(2));
            form.submit();
        }
    }

    handleDsChange(event,index){
        let val = event.target.value;
        let temp = this.state.mediums;
        let ag = temp[index].audienceGroups[parseInt(val)];
        temp[index].ammId = val;
        temp[index].rc = ag.minCampaignCount;
        temp[index].rpc = ag.price;
        let prc = (ag.price*ag.minCampaignCount);
        temp[index].tax = (prc*0.18);
        temp[index].minRc = ag.minCampaignCount;
        temp[index].ta = prc+(prc*0.18);
        this.setState({
            mediums: temp   
        });
    }

    handleChange(event,index){
        let val = event.target.value;
        let temp = this.state.mediums;
        let ag = temp[index].audienceGroups[parseInt(temp[index].ammId)];
        temp[index].rc = val;
        let prc = (ag.price*val);
        temp[index].tax = (prc*0.18);
        temp[index].ta = prc+(prc*0.18);
        this.setState({
            mediums: temp   
        });
    }

    showSegments(index){
        this.setState({
            showSegments: true,
            segments: []
        })
        let temp = this.state.mediums;
        let ag = temp[index].audienceGroups[parseInt(temp[index].ammId)];
        const body={
            ammId: parseInt(ag.ammId),
            bamId: parseInt(ag.bamId)
        }
        getCampaign(body)
        .then((response)=> response.json())
        .then((data)=> {
            //let data = {"success":true,"message":null,"allowedActions":[],"segmentDetails":[{"segmentName":"city","title":"City","desc":null,"icon":"fas fa-map-marked","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":128,"basmId":null,"segmentId":52},{"segmentName":"mobile_bill","title":"Mobile Bill Per Month (ARPU)","desc":null,"icon":"fa fa-mobile","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Upto Rs. 200"},{"id":3,"value":"Rs. 201 to 500"},{"id":4,"value":"Rs. 501 to 1000"},{"id":5,"value":"Rs. 1001+"}]},"segmentType":"MUL","asmId":129,"basmId":null,"segmentId":6},{"segmentName":"pincode","title":"Pincode","desc":null,"icon":"fas fa-thumbtack","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":130,"basmId":null,"segmentId":50},{"segmentName":"handset_name","title":"Handset Name","desc":null,"icon":"fa fa-font","price":0.05,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Acer"},{"id":2,"value":"Apple"},{"id":3,"value":"Asus"},{"id":4,"value":"Blackberry"},{"id":5,"value":"Celkon"},{"id":6,"value":"Gionee"},{"id":7,"value":"Google"},{"id":8,"value":"HTC"},{"id":9,"value":"Huawei"},{"id":10,"value":"Intex"},{"id":11,"value":"Jolla"},{"id":12,"value":"Karbonn"},{"id":13,"value":"LAVA"},{"id":14,"value":"LeEco"},{"id":15,"value":"Lenovo"},{"id":16,"value":"LG"},{"id":17,"value":"Meizu"},{"id":18,"value":"Micromax"},{"id":19,"value":"Motorola"},{"id":20,"value":"Nokia"},{"id":21,"value":"OnePlus"},{"id":22,"value":"Oppo"},{"id":23,"value":"Panasonic"},{"id":24,"value":"Philips"},{"id":25,"value":"Sagem"},{"id":26,"value":"Samsung"},{"id":27,"value":"Sony"},{"id":28,"value":"Sony Ericson"},{"id":29,"value":"Spice"},{"id":30,"value":"Vertu"},{"id":31,"value":"Vivo"},{"id":32,"value":"Vodofone"},{"id":33,"value":"Xiaomi"},{"id":34,"value":"Xolo"},{"id":35,"value":"ZTE"}]},"segmentType":"MUL","asmId":131,"basmId":null,"segmentId":13},{"segmentName":"ageSlider2","title":"Age","desc":"","icon":"","price":0.0,"subscriptionType":"basic","values":{"minValue":15,"maxValue":75,"segmentValuesList":null},"segmentType":"RNG","asmId":132,"basmId":null,"segmentId":1},{"segmentName":"handset_cost","title":"Handset Cost","desc":null,"icon":"fas fa-hand-holding-usd","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Less than INR 1500"},{"id":2,"value":"INR 1500 - 3000"},{"id":3,"value":"INR 3001 - 5000"},{"id":4,"value":"INR 5K - 10K"},{"id":5,"value":"INR 10K - 15K"},{"id":6,"value":"INR 15K - 20K"},{"id":7,"value":"INR 20K - 30K"},{"id":8,"value":"INR 30K - 40K"},{"id":9,"value":"INR 40K+"}]},"segmentType":"MUL","asmId":133,"basmId":null,"segmentId":16},{"segmentName":"data_user","title":"Data User","desc":null,"icon":"fa fa-user-lock","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":134,"basmId":null,"segmentId":8},{"segmentName":"national_roaming","title":"National Roaming","desc":null,"icon":"fa fa-broadcast-tower","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":135,"basmId":null,"segmentId":7},{"segmentName":"payment_model","title":"Payment Model","desc":null,"icon":"fa fa-money-bill-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Prepaid"},{"id":3,"value":"Postpaid"}]},"segmentType":"RDO","asmId":136,"basmId":null,"segmentId":10},{"segmentName":"handsetOS_category","title":"Handset OS Category","desc":null,"icon":"fab fa-opera","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Android"},{"id":2,"value":"iOS"},{"id":3,"value":"Windows"}]},"segmentType":"MUL","asmId":137,"basmId":null,"segmentId":17},{"segmentName":"handset_type","title":"Handset Type","desc":null,"icon":"fa fa-mobile-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Feature Phone"},{"id":3,"value":"Smart Phone"}]},"segmentType":"RDO","asmId":138,"basmId":null,"segmentId":12},{"segmentName":"ageof_device","title":"Age of Device","desc":null,"icon":"fas fa-clock","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"1-3 Months"},{"id":2,"value":"3-6 Months"},{"id":3,"value":"6-12 Months"},{"id":4,"value":"1 Year +"}]},"segmentType":"MUL","asmId":139,"basmId":null,"segmentId":18},{"segmentName":"customer_BusinessCat","title":"Customer Business Category","desc":null,"icon":"fas fa-user-tie","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"SME"},{"id":2,"value":"Enterprise"}]},"segmentType":"MUL","asmId":140,"basmId":null,"segmentId":22},{"segmentName":"gender","title":"Gender","desc":"gender","icon":"fa fa-user","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Male"},{"id":3,"value":"Female"}]},"segmentType":"RDO","asmId":141,"basmId":null,"segmentId":4},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":235,"basmId":null,"segmentId":2},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":236,"basmId":null,"segmentId":2}]} 
            if(data.success){
                this.setState({
                    segments: data.segmentDetails    
                });
            }else{
                ToastsStore.error(data.message);
            }
        })
        .catch( error =>{
                console.log(error);
                ToastsStore.error("Something went wrong, Please Try Again Later ");
        }) 
    }
    
    closeAction(){
        this.setState({
            showSegments: false
        })
    }

    dobChange = val => {
        let temp1 = this.state.formControls;
        temp1.date.value = val;
        this.setState({
            formControls: temp1
        })
    }

    fetchClients(){
        let body={}
        getAllClients(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    clients: data.clients
                })
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            ToastsStore.error("Something went wrong. Please try again later !!!");
        })
    }

    submitManualTxn(){
        let t = this.state.formControls;
        // if(!t.tId.value || !t.pmtMode.value || !t.amt.value || !t.url.value || !t.date.value || !t.remarks.value || !this.state.formControls.client.value){
            if(!t.tId.value || !t.pmtMode.value || !t.amt.value || !t.date.value || !t.remarks.value || !this.state.formControls.client.value || !t.invoice.value){   
        t.remarks.error = "Please fill all details correctly";
            this.setState({
                formControls: t
            })
            return;
        }else{
            t.remarks.error = "";
            this.setState({
                formControls: t,
                loader: true
            })
        }
        let bId;
        try{
            bId = JSON.parse(localStorage.getItem('bInfo'));
        }catch(e){
            ToastsStore.error(e);
        }
        let body = {
            businessUid: this.state.formControls.client.value,
            txnId: t.tId.value,
            paymentMode: t.pmtMode.value,
            amount: parseFloat(t.amt.value),
            invoice:t.invoice.value,
            // url: t.url.value,
            paymentDate: new Date(t.date.value),
            remarks: t.remarks.value,
        }
        //body = "?" + utils.jsonToQueryString(body);
        updateManualTxn(body)
        .then((response)=> response.json())
        .then((data)=> {
            if(data.success){
                ToastsStore.success(data.message);
                this.clearManualDetails();
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                loader: false
            })
        })
        .catch( error =>{
                console.log(error);
                this.setState({
                    loader: false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    clearManualDetails(){
        let temp = this.state.formControls;
        temp.tId.value = 0;
        temp.pmtMode.value="";
        temp.client.value="";
        temp.amt.value=0;
        temp.date.value=null;
        temp.remarks.value="";
        this.setState({
            formControls: temp
        })
    }

    showVideo(){
        this.setState({
            howTo: !this.state.howTo
        })
    }

    render(){
        const style = {
            borderRadius: 0,
            opacity: 0.85,
            padding: '1em',
            maxWidth:'26%',
        }

        return(
            <React.Fragment>
                <PageTitle title="Buy Credits" description="Welcome to Buy Credits"/>
                {
                    this.state.rolesFetched && utils.hasRole('wallet_mgmt') &&
                    <div className="wrapper-container">  
                        <div className=  { utils.isMobile ? "ui pointing secondary menu overflowX-auto" : "ui pointing secondary menu"}>    
                            <div className={`${this.state.active === 0 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(0)}>Package Details</div>                  
                            <div className={`${this.state.active === 6 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(6)}>Campaign Price Estimate</div>
                            {
                                utils.isSuAdmin &&       
                                <div className={`${this.state.active === 1 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(1)}>Subscriptions <span className="text-intent">(Payment Pending)</span></div>
                            }
                            <div className={`${this.state.active === 2 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(2)}>Wallet&nbsp;<span className="text-intent">(Balance &#8377; {this.state.userInfo.walletInfo.amount})</span></div>
                            <div className={`${this.state.active === 3 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(3)}>Transaction History</div>
                            {
                                (utils.isSuAdmin || (this.props.userType && this.props.userType ==="AGENCY")) &&
                                <div className={`${this.state.active === 5 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(5)}>Revenues</div>
                            }
                            {
                                // (utils.isSuAdmin || utils.hasRole('wallet_mnl_txn')) &&
                                utils.isSuAdmin &&
                                <div className={`${this.state.active === 4 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(4)}>Manual Transaction</div>
                            }
                        </div>
                        <div className="ui segment">
                            {
                                this.state.active === 6 &&
                                <React.Fragment>
                                    <div className="margin-btm--half">
                                       <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                                        <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'end'}} onClick={()=>{this.showVideo()}}>How to Buy Credits and Recharge Wallet ?</span>
                                    </div>
                                    {
                                        this.state.howTo && 
                                        <PopUp title={'How to Buy Credits and Recharge Wallet'} togglePopup={this.showVideo.bind(this)}>
                                            <Youtube url={'OydbieOThvE'}/>
                                        </PopUp>
                                    }
                                    <section className="ui cards">
                                        {
                                            this.state.mediums.map((item,index) =>{
                                                return(
                                                    <div key={index} class="card text--center" style={{margin:'1.5em'}}>
                                                        <Popup
                                                            trigger={<Icon name='question circle' color="blue" style={{fontSize:'1.5em', margin:'0.25rem 0 0 18.5rem'}}/>}
                                                            position='Top Left'
                                                            style={style}
                                                            inverted
                                                            flowing
                                                            hoverable>
                                                                <Popup.Content>
                                                                    <p style={{textAlign:'justify'}}>Datasource are the various sources of the data which is used to run the campaign. Each Datasource has relevant filters/segments that enable you to reach out to the pinpoint targeted audience via {item.name}</p> 
                                                                    {/* <p style={{textAlign:'justify'}}>Datasource are the various sources of the <br/> data which is used to run the campaign.<br/>Each Datasource has relevant filters/segments <br/>that enable you to reach out to the pinpoint<br/> targeted audience via {item.name}</p>  */}
                                                                </Popup.Content>
                                                        </Popup>
                                                        <div className="content" style={{padding:'2.5em',borderTop:'0px'}}>
                                                            <div className="header padding-btm--half" style={{color:'#4183c4',fontSize:'2em'}}>
                                                                {item.name}
                                                            </div>    
                                                        
                                                        <div className="col-20 margin-top--half">
                                                            <div className="label">Choose Datasource&nbsp;&nbsp;
                                                                {
                                                                    !!item.ammId &&
                                                                    <i aria-hidden="true" onClick={()=>{this.showSegments(index)}} className="blue info circle icon"></i>
                                                                }
                                                            </div>
                                                            <select className="form-control"
                                                            name="ammId"
                                                            value={item.ammId} 
                                                            onChange={event => {this.handleDsChange(event,index)}}>                                  
                                                                    <option defaultValue>-Select Datasource-</option>
                                                                    {
                                                                        item.audienceGroups.map((item,index)=>{    
                                                                        return(
                                                                                <option key={index} value={index}>{item.name}</option>                                       
                                                                        );                               
                                                                        })                      
                                                                    }  
                                                            </select>
                                                        </div>
                                                        <div className="col-20 margin-top">
                                                            <div className="label">Requested Credits</div>
                                                            <input  type="text"
                                                                    className="form-control"
                                                                    name="rc"
                                                                    value={item.rc} 
                                                                    disabled={!item.ammId}
                                                                    style={{width:'95%'}}
                                                                    onChange={event => {this.handleChange(event,index)}}>
                                                            </input>
                                                        </div>
                                                        {
                                                            !!item.ammId &&
                                                            <div className="text--center margin-btm--half margin-top--half" style={{fontSize:'12px'}}>Minimum {item.minRc} credits has to be bought</div>
                                                        }
                                                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                                                            <div className="text--bold text--darker">Rate Per Credit</div>
                                                            <div className="text--bold text--darker">&#8377; {item.rpc}</div>
                                                        </div>
                                                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                                                            <div className="text--bold text--darker">GST Amount(18%)</div>
                                                            <div className="text--bold text--darker">&#8377; {(item.tax).toFixed(2)}</div>
                                                        </div>
                                                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                                                            <div className="text--bold text--darker">Total Amount</div>
                                                            <div className="text--bold text--darker">&#8377; {(item.ta).toFixed(2)}</div>
                                                        </div>
                                                        {
                                                            item.error &&
                                                            <span className="form-error">{item.error}</span>
                                                        }
                                                        <div className="col-20 flex flex-directrion--row flex-wrap margin-top">
                                                            <div className="col-20">
                                                                <button className="ui green button" onClick={()=>this.payNow(index)} style={{width:'100%',borderRadius:'0'}}>Recharge Wallet</button>
                                                            </div>
                                                        </div>                         
                                                    </div>
                                                </div>
                                            ); 
                                        })
                                    }       
                                    </section>
                                    {
                                        this.state.showSegments && 
                                        <PopUp title={'Segments Available'} togglePopup={this.closeAction.bind(this)}>
                                            <div className="col-20 flex flex-direction--col flex-horz-center flex-align--center">
                                                {
                                                    this.state.segments.map((item,index)=>{
                                                        return(
                                                            <div id={index} className="bdr-btm col-12 margin-btm--half margin-top--half text--center">
                                                                {
                                                                    item.icon &&
                                                                    <span className="margin-right--quar">
                                                                        <i aria-hidden="true" className={`${item.icon} icon`}></i>
                                                                    </span>
                                                                } 
                                                                {item.title}
                                                            </div>  
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.segments.length === 0 &&
                                                    <div className="global-loader col-1">
                                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                    </div>
                                                }
                                            </div>
                                        </PopUp>
                                    }
                                </React.Fragment>
                            }
                            {
                                this.state.active === 1 &&
                                utils.isSuAdmin &&
                                <React.Fragment>
                                    {
                                        this.state.list && this.state.list.length>0 &&
                                        <section className="ui cards">
                                            {
                                                this.state.list.map((item,index) =>{
                                                    return(
                                                        <div key={index} class="card text--center" style={{margin:'1.5em'}}>
                                                            <div className="content" style={{padding:'2.5em'}}>
                                                                <div className="header padding-btm--half" style={{color:'#4183c4',fontSize:'2em'}}>
                                                                    {item.servicePackageName}
                                                                </div>    
                                                            </div>
                                                            <div className="description pad">
                                                                <div className="">
                                                                    &#8377;{item.totalPrice}
                                                                </div>
                                                                <div>{item.servicePackageDesc}</div>
                                                            </div>
                                                            <div className="flex col-20 flex-directrion--row flex-wrap">
                                                                <div className="col-10">
                                                                    <Link to="/manage/subscriptions">
                                                                        <button className="ui grey button" style={{width:'100%',borderRadius:'0'}}>View Details</button>
                                                                    </Link>
                                                                </div>
                                                                <div className="col-10">
                                                                    <button className="ui green button" onClick={()=>this.payNow(index)} style={{width:'100%',borderRadius:'0'}}>Pay Now</button>
                                                                </div>
                                                            </div>                              
                                                        </div>
                                                    );
                                                }) 
                                            }       
                                        </section>
                                    }
                                    {/*
                                        this.state.list && this.state.list.length === 0 &&
                                        <section className="text--center pad">
                                            <span>You Don't have any Subscriptions</span>
                                        </section>
                                    */}
                                </React.Fragment>
                            }
                            {
                                this.state.active === 2 &&
                                <React.Fragment>    
                                    <div className="flex flex-direction--col flex-wrap card-custom wallet-card-wrapper">
                                        <div className="wallet-bg">&nbsp;</div>
                                        <div className="margin-left margin-right padding-btm--quar padding-top wallet-balance">
                                            <span style={{color:'#666'}}>Wallet Balance : </span> <span style={{fontWeight: 'bold'}}> &#8377; {this.state.userInfo.walletInfo.amount}</span> 
                                        </div>
                                        {   !!this.state.userInfo.walletInfo.maxAllowedDebit && this.state.userInfo.walletInfo.maxAllowedDebit > 0 &&
                                            <div className="margin-left margin-right padding-btm">
                                                <span style={{color:'#666'}}>Max Allowed Debit Limit: </span> <span style={{fontWeight: 'bold'}}> &#8377; {this.state.userInfo.walletInfo.maxAllowedDebit}</span> 
                                            </div>
                                        }
                                        <div className="add-money-nav flex flex-wrap margin-left margin-right">
                                            <div className="pad add-money-nav-item">Add Money</div>
                                        </div>
                                        <div className="mar">
                                            <input type="number" className="form-control" id="input-amount" placeholder="Amount" style={{width:'100%'}}/>
                                            {
                                                !!this.state.error &&
                                                <span className="form-error">{this.state.error}</span>
                                            }
                                        </div>
                                        <button onClick={()=>this.submitPaymentForm()} className="btn btn-fill btn-success margin-left margin-right">Proceed To Pay</button>
                                    </div>
                                </React.Fragment>
                            }
                            {
                                this.state.active === 3 &&
                                <React.Fragment>
                                    <div className="margin-btm--half">
                                       <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                                        <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'end'}} onClick={()=>{this.showVideo()}}>Understanding Transaction History.</span>
                                    </div>
                                    {
                                        this.state.howTo && 
                                        <PopUp title={'Understanding Transaction History'} togglePopup={this.showVideo.bind(this)}>
                                            <Youtube url={'FYp97GIkYvs'}/>
                                        </PopUp>
                                    }
                                    <TransactionHistory userType={this.props.userType}/>
                                </React.Fragment>
                            }
                            {
                                this.state.active === 4 &&
                                   utils.isSuAdmin &&
                                
                                <section className="ui centered cards">
                                    <div class="card" style={{margin:'1.5em'}}>
                                        <div className="content">
                                            <div className="col-20">
                                                <div className="label">Transaction Id</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="tId"
                                                        value={this.state.formControls.tId.value}
                                                        style={{width:'100%'}}
                                                        onChange={this.changeHandler}
                                                        >
                                                </input>
                                            </div>
                                            <div className="col-20">
                                                <div className="label">Invoice</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="invoice"
                                                        value={this.state.formControls.invoice.value}
                                                        style={{width:'100%'}}
                                                        onChange={this.changeHandler}
                                                        >
                                                </input>
                                            </div>
                                            <div className="col-20 margin-top">
                                                <div className="label">Payment Mode</div>
                                                <select className="form-control"
                                                    name="pmtMode"
                                                    style={{width:'100%'}}
                                                    value={this.state.formControls.pmtMode.value}
                                                    onChange={this.changeHandler}
                                                    >
                                                        <option value="" defaultValue hidden>-Choose Payment Mode-</option>
                                                        <option value="NEFT" >NEFT</option> 
                                                        <option value="IMPS" >IMPS</option>
                                                        <option value="CASH" >Cash</option>
                                                        <option value="OTHERS" >Others</option>
                                                </select>
                                            </div>
                                            <div className="col-20 margin-top">
                                                <div className="label">Clients</div> 
                                                <select className="form-control"
                                                   name="client" 
                                                   style={{width:'100%'}}
                                                   value={this.state.formControls.client.value}
                                                   onChange={this.changeHandler}>
                                                       <option value="" defaultValue hidden>-Choose Client-</option>
                                                       {
                                                           this.state.clients && this.state.clients.map(item =>{
                                                                return(
                                                                    
                                                                    <option value={item.uid}>{item.name}</option>
                                                                )
                                                           })
                                                       }
                                                   </select>
                                            </div>
                                            <div className="col-20 margin-top">
                                                <div className="label">Amount</div>
                                                <input  type="number"
                                                        className="form-control"
                                                        style={{width:'100%'}}
                                                        name="amt"
                                                        value={this.state.formControls.amt.value}
                                                        onChange={this.changeHandler}
                                                        >
                                                </input>
                                            </div>
                                            {/* <div className="col-20 margin-top">
                                                <div className="label">Url</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        style={{width:'100%'}}
                                                        name="url"
                                                        value={this.state.formControls.url.value}
                                                        onChange={this.changeHandler}
                                                        >
                                                </input>
                                            </div> */}
                                            <div className="margin-top" style={{width:'117%'}}>
                                                <label className="label col-5" style={{marginBottom:'0px'}}>Payment Date</label>
                                                <DatePicker
                                                selected={this.state.formControls.date.value}
                                                onChange={this.dobChange}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                placeholderText="Click to select Date"
                                                dropdownMode="select"
                                                />
                                            </div>
                                            <div className="col-20 margin-top">
                                                <label className="label">Remarks</label>
                                                <textarea className="form-control" 
                                                    name="remarks" 
                                                    maxLength="300"
                                                    value={this.state.formControls.remarks.value}
                                                    onChange={this.changeHandler} style={{height:'85px',resize:'none',width:'100%'}}/>
                                            </div>
                                            {
                                                this.state.formControls.remarks.error &&
                                                <div className="form-error margin-top text--center">{this.state.formControls.remarks.error}</div>
                                            }
                                            <div className="col-20 margin-top">
                                                {
                                                    !this.state.loader &&
                                                    <div className="col-20 margin-top">
                                                        <button className="ui green button" onClick={()=>this.submitManualTxn()} style={{width:'100%',borderRadius:'0'}}>Submit Details</button>
                                                    </div>
                                                }
                                                {
                                                    this.state.loader &&
                                                    <div className="col-20 margin-top">
                                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                    </div>
                                                }
                                            </div>                         
                                        </div>
                                    </div>
                                </section>
                            }
                            {   (utils.isSuAdmin || (this.props.userType && this.props.userType ==="AGENCY")) &&
                                this.state.active === 5 &&
                                <Revenue userType={this.props.userType}/>
                            }
                            {
                               this.state.active === 0 &&
                               <Packages showHeading="false"/>
                            }
                        </div>
                    </div>
                }
                {
                    !this.state.rolesFetched && !this.state.accessDenied &&
                    <div className="global-loader col-1">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
                {
                    this.state.accessDenied &&
                    <div className="global-loader col-2">
                        <div>Access Denied.</div>
                    </div>
                }
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} /> 
                <form action="/payment/make" method="post" id="paymentForm">
                    <input type="hidden" name="source" value="PAYTM"/>
                    <input type="hidden" id="form-amount" name="amount" value=""/>
                    <input type="hidden" name="walletId" value={this.state.userInfo.walletInfo.walletId}/>
                </form>
            </React.Fragment>
        );
    }
}

export default BuyCredits;