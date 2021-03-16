import React,{ Component } from 'react';
import { rejectCampaigns, executeCampaigns, approveCampaigns,getDetailCampaign,getSmsPrice,editCampaign } from '../../Services/campaign-service';
//import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import RemarksModal from '../RemarksModal/RemarksModal';
import Popup from '../Popup/Popup';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../circular-loader/circular-loader';
import { Dropdown } from 'semantic-ui-react';
import SmsProBilling from './SmsProBilling';
import utils from '../../Services/utility-service';

export default class CampaignTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            actionLoader: false,
            indexForLoader: null,
            actionType:null,
            confirmationModal:false,
            confirmationString:false,
            remarksModal:false,
            confirmationLoader:false,
            remarks:"",
            submitCta:'',
            code:'',
            popup: false,
            submitLoader: false,
            pricePerUnit: 0,
            taxMultiplier: 0,
            campSubmitErr: "",
            detail: null
        }
    }

    action(code,type,index,name){
    
        localStorage.setItem("code",JSON.stringify(code));
        switch(type) {  //Expected a default case
            case 'view':
                //window.location.href = window.location.origin + '/view-campaign';
                this.props.history.push('/view-campaign');             
                break;
            case 'stats-update':
                //window.location.href = window.location.origin + '/update-stats-campaign';             
                this.props.history.push('/update-stats-campaign');
                break;
            case 'edit':
                //window.location.href = window.location.origin + '/edit-campaign';
                this.props.history.push('/edit-campaign');
                break;
            case 'clone':
                //window.location.href = window.location.origin + '/clone-campaign';
                this.props.history.push('/clone-campaign');
                break;
            case 'pay':
                if(name){
                    this.props.history.push('/edit-campaign?p=true');
                }else{
                    this.getPriceInfo(code);
                }
                break;
            case 'journey':
                //window.location.href = window.location.origin + '/clone-campaign';
                this.props.history.push('/campaign/journey/designer');
                break;            
            case 'reject':
                this.setState({
                    indexForLoader:index,
                    actionType:'reject',
                    confirmationLoader:false,
                    submitCta:'reject',
                    code:code,
                    remarks:'',
                    remarksModal:true
                })
                break;
            case 'accept':
                this.setState({
                    indexForLoader:index,
                    actionType:'accept',
                    confirmationLoader:false,
                    submitCta:'accept',
                    code:code,
                    remarks:'',
                    remarksModal:true
                })
                break;    
            case 'execute':
                this.setState({
                    indexForLoader:index,
                    actionType:'execute',
                    confirmationLoader:false,
                    submitCta:'execute',
                    code:code,
                    remarks:'',
                    remarksModal:true
                })
                break;  
            default:
                console.log("unhandled action")
                break;      
        }
    }
    getPriceInfo(code){
        const body = {
            code: code
        }
        this.setState({
            loader: true,
            popup: true,
            campSubmitErr: ""
        })
        getDetailCampaign(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({
                    detail: data
                })
                let body = {
                    "audienceGroupId": data.audienceGroupId,
                    "campaignType": "SMS",
                    "content": data.content.content,
                    "custom": data.custom,
                    "lang": data.lang,
                    "targetCount": data.targetCount
                }
                getSmsPrice(body)
                .then(response => response.json())
                .then(data => {
                        if (data.success) {
                            this.setState({
                                loader: false,
                                pricePerUnit: data,
                                taxMultiplier: data.taxMultiplier 
                            })
                        } else {
                            ToastsStore.error(data.message,4000);
                            this.setState({
                                loader: false,
                                popup: false
                            })
                        }
                })
            } else {
                ToastsStore.error(data.message,4000);
                this.setState({
                    loader: false,
                    popup: false
                })
            }
        })
        .catch(error => {
                console.log(error);
                this.setState({
                    loader: false,
                    popup: false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    rejectCampaign(code){
        let body = {
            code : code,
            remark: this.state.remarks
        }
        this.setState({
            confirmationLoader:true,
        })
        rejectCampaigns(body)
        .then((response)=>response.json())
        .then(data=>{
            if(data.success){
                ToastsStore.success(data.message);    
                this.closeAction();
                this.props.fetchCampaigns();               
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                confirmationLoader:false,
            })
        })
        .catch(error=>{
            console.log(error);
            this.setState({
                confirmationLoader:false,
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    executeCampaign(code){
        let body = {
            code : code,
            remark: this.state.remarks
        }
        this.setState({
            confirmationLoader:true,
        })
        executeCampaigns(body)
        .then((response)=>response.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    campaigns: data.campaigns,                       
                })  
                this.closeAction();
                this.props.fetchCampaigns();  
                ToastsStore.success(data.message);                  
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                confirmationLoader:false,
            })
        })
        .catch(error=>{
            this.setState({
                confirmationLoader:false,
            })
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    approveCampaign(code){
        let body = {
            code : code,
            remark: this.state.remarks
        }
        this.setState({
            confirmationLoader:true,
        })
        approveCampaigns(body)
        .then((response)=>response.json())
        .then(data=>{
            if(data.success){
                ToastsStore.success(data.message);  
                this.closeAction();
                this.props.fetchCampaigns();                  
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                confirmationLoader:false,
            })
        })
        .catch(error=>{
            console.log(error);
            this.setState({
                confirmationLoader:false,
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    closeAction(){
        if(this.state.confirmationModal){
            this.setState({
                confirmationModal:false,
            })
        }else if(this.state.remarksModal){
            this.setState({
                remarksModal:false,
                remarks:''
            })
        }else if(this.state.popup){
            this.setState({
                popup: false
          })
        }
    }
    remarksCallback(){
        if(this.state.actionType === 'reject'){
            this.rejectCampaign(this.state.code);
        }else if(this.state.actionType === 'accept'){
            this.approveCampaign(this.state.code);
        }else if(this.state.actionType === 'execute'){
            this.executeCampaign(this.state.code)
        }
    }
    changeHandler = event => {
        const value = event.target.value;
        this.setState({
             remarks:value   
        });
    }

    getActions(data){
        let actions = [];
        if(data && data.length > 0){
            data.forEach(e => {
                switch(e){
                    case 'view':
                        actions.push({
                            icon:"eye",
                            key:"view",
                            text:"View Details"
                        });
                        break;
                    case 'accept':
                        actions.push({
                            icon:"checkmark",
                            key:"accept",
                            text:"Accept"
                        })
                        break;
                    case 'edit':
                        actions.push({
                            icon:"edit",
                            key:"edit",
                            text:"Edit Campaign"
                        })
                        break;
                    case 'reject':
                        actions.push({
                            icon:"cancel",
                            key:"reject",
                            text:"Reject Campaign"
                        })
                        break;
                    case 'cancel':
                        actions.push({
                            icon:"cancel",
                            key:"cancel",
                            text:"Cancel"
                        })
                        break;
                    case 'clone':
                        actions.push({
                            icon:"copy outline",
                            key:"clone",
                            text:"Clone Campaign"
                        })
                        break;
                    case 'execute':
                        actions.push({
                            icon:"cogs",
                            key:"execute",
                            text:"Execute Campaign"
                        })
                        break;
                    case 'stats-update':
                        actions.push({
                            icon:"edit",
                            key:"stats-update",
                            text:"Stats Update"
                        })
                        break;        
                    case 'pay':
                        actions.push({
                            icon:"money bill alternate outline",
                            key:"pay",
                            text:"Make Payment"
                        })
                        break;
                    case 'journey':
                        actions.push({
                            icon:"truck icon",
                            key:"journey",
                            text:"Journey"
                        })
                        break;           
                    default:    
                        console.log("unhandled type");
                        break;    
                }
            });
        }
        return actions;
    }

    submitData() {
        this.setState({
              submitLoader: true
        })
        const body = {
            "ammId": null,
            "bamId": null,
            "campaignDesc": this.state.detail.campaignDesc,
            "campaignName": this.state.detail.campaignName,
            "lang": this.state.detail.lang,
            "mediumId": this.state.detail.mediumId,
            "saveAsDraft": false,
            "scheduleDate": this.state.detail.scheduleDate,
            "scheduleTime": this.state.detail.scheduleTime,
            "segments": null,
            "sgId": null,
            "businessUid": null,
            "scheduleNow": null,
            "campaignType": "SMS",
            "audienceGroupId": this.state.detail.audienceGroupId,
            "isCustom": this.state.detail.custom,
            "shortUrl": this.state.detail.shortUrl,
            "longUrl": this.state.detail.longUrl,
            "submit": true,
            "targetCount": this.state.detail.targetCount,
            "templateId": this.state.detail.content.templateId,
            "uniqueTrackingEnabled": this.state.detail.uniqueTrackingEnabled,
            "senderId": this.state.detail.senderId,
            "content": {
                  "content": this.state.detail.content.content,
                  "lang": this.state.detail.content.lang
            },
            "code": this.state.detail.code
        }
        editCampaign(body)
              .then(response => response.json())
              .then(data => {
                    this.setState({
                          submitLoader: false
                    })
                    if (data.success) {
                          ToastsStore.success(data.message);
                          this.props.history.push("/campaigns");
                    } else {
                          ToastsStore.error(data.message);
                    }
              }).catch(error => {
                    console.log(error);
                    this.setState({
                          submitLoader: false
                    });
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
              })
    }

    payAndSubmit(amt) {
        this.setState({
              submitLoader: true
        })
        const body = {
            "ammId": null,
            "bamId": null,
            "campaignDesc": this.state.detail.campaignDesc,
            "campaignName": this.state.detail.campaignName,
            "lang": this.state.detail.lang,
            "mediumId": this.state.detail.mediumId,
            "saveAsDraft": false,
            "scheduleDate": this.state.detail.scheduleDate,
            "scheduleTime": this.state.detail.scheduleTime,
            "segments": null,
            "sgId": null,
            "businessUid": null,
            "scheduleNow": null,
            "campaignType": "SMS",
            "audienceGroupId": this.state.detail.audienceGroupId,
            "isCustom": this.state.detail.custom,
            "shortUrl": this.state.detail.shortUrl,
            "longUrl": this.state.detail.longUrl,
            "submit": true,
            "targetCount": this.state.detail.targetCount,
            "templateId": this.state.detail.content.templateId,
            "uniqueTrackingEnabled": this.state.detail.uniqueTrackingEnabled,
            "senderId": this.state.detail.senderId,
            "content": {
                  "content": this.state.detail.content.content,
                  "lang": this.state.detail.content.lang
            },
            "code": this.state.detail.code
        }
        editCampaign(body)
        .then(response => response.json())
        .then(data => {
            this.setState({
                    submitLoader: false
            })
            if (data.success) {
                    this.pay(amt);
            } else {
                    ToastsStore.error(data.message);
                    this.setState({
                        submitLoader: false,
                        campSubmitErr: data.message
                    })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                    submitLoader: false
            });
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    pay(amt) {
        let form = document.getElementById("paymentForm");
        document.getElementById("form-amount").value = parseFloat(amt.toFixed(2));
        let user = JSON.parse(localStorage.getItem("userInfo"))
        document.getElementById("form-walletId").value = user.walletInfo.walletId;
        document.getElementById("form-refCode").value = this.state.detail.code;
        form.submit();
    }

    render(){
        return(
            <section className="padding-top leads-table-wrapper"   
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >
            <table className="client">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Medium</th>
                            <th>Name</th>               
                            <th>Description</th>
                            {
                                (this.props.showClientDetails===true && 
                                <th>Client</th>)
                            }
                            <th>Target Count </th>
                            <th style={{minWidth:"98px"}}>Date</th>
                            <th style={{minWidth:"98px"}}>Time</th>
                            <th>Status</th>
                            <th style={{minWidth:"90px"}}>Action</th>
                        </tr>
                    </thead>    
                    <tbody>
                    {   this.props.campaigns.length>0 &&
                        this.props.campaigns.map((item,index)=>{
                            
                            return(
                                <tr key={index}>
                                    <td>{item.code ? item.code : "--"}</td>
                                    <td>{item.mediumName ? item.mediumName : "--"}</td>
                                    <td>{item.campaignName ? item.campaignName : "--"}</td>               
                                    <td style={{wordBreak:'break-all'}}>{item.desc ? item.desc : "--"}</td>       
                                    { this.props.showClientDetails===true && 
                                      (item.businessMinDTO ? <td>{item.businessMinDTO.name}</td> : <td>--</td>)
                                    }                                
                                    <td>{item.targetCount ? item.targetCount : "--"} </td>
                                    <td>{item.scheduleDate ? item.scheduleDate : "--"}</td>
                                    <td>{item.scheduleTime ? item.scheduleTime : "--"}</td>
                                    <td>{item.status ? item.status : "--"}</td>                                  
                                    <td style={{position:'relative'}}>
                                        <div className="flex flex-direction--col">
                                            {
                                                (this.state.actionLoader && this.state.indexForLoader === index) && 
                                                <div style={{position:'absolute',top:'33%',left:'28%'}}>
                                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                </div>
                                            }
                                            <div className={"flex" + ((this.state.actionLoader && this.state.indexForLoader === index) ? 'rl-hidden' : '')}>
                                                <Dropdown text='Actions' direction='left'>
                                                    <Dropdown.Menu>
                                                        {
                                                            this.getActions(item.allowedActions).map((subItem) => {
                                                                return(
                                                                    <React.Fragment>
                                                                        <Dropdown.Item icon={subItem.icon} text={subItem.text} onClick={()=>{this.action(item.code,subItem.key,index,item.mediumName)}}/>
                                                                        <Dropdown.Divider />
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </td>                                               
                                </tr> 
                            );
                        })
                    }
                </tbody>
            </table>
            {
                this.props.campaigns.length === 0 && <div className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>No Campaigns</div>
            }
            {
                this.state.remarksModal &&
                <Popup title={'Add Remarks'} togglePopup={this.closeAction.bind(this)}>
                    <RemarksModal
                        submitCta={this.state.submitCta}
                        remarks={this.state.remarks}
                        changeHandler={this.changeHandler.bind(this)}
                        confirmationLoader={this.state.confirmationLoader}
                        submitData={this.remarksCallback.bind(this)}
                        togglePopup={this.closeAction.bind(this)}>
                    </RemarksModal> 
                </Popup>
            }
            {
                    this.state.popup &&
                    <Popup title={'Billing Details'} togglePopup={this.closeAction.bind(this)}>
                        {
                            this.state.loader &&
                            <div className="flex flex-horz-center" style={{minHeight:'100px',alignItems:'center'}}>
                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                            </div>
                        }    
                        {
                            !this.state.loader &&
                            <SmsProBilling
                                pricePerUnit={this.state.pricePerUnit}
                                taxMultiplier={this.state.taxMultiplier}
                                back={this.closeAction.bind(this)}
                                submit={this.submitData.bind(this)}
                                pay={this.payAndSubmit.bind(this)}
                                campSubmitErr={this.state.campSubmitErr}
                                submitLoader={this.state.submitLoader}
                            >
                            </SmsProBilling>
                        }        
                    </Popup>
            }
            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
            <form action="/payment/make" method="post" id="paymentForm" style={{display:'none'}}>
                <input type="hidden" name="source" value="PAYTM"/>
                <input type="hidden" id="form-amount" name="amount" value=""/>
                <input type="hidden" id="form-walletId" name="walletId" value=""/>
                <input type="hidden" id="form-refCode" name="refCode" value=""/>
                <input type="hidden" id="form-refType" name="refType" value="CAMPAIGN_CODE"/>
            </form>   
        </section>      
        );
    }
}
