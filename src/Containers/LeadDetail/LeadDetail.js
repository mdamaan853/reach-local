import React, { Component } from 'react';
import Moment from 'react-moment';
import AssignOwnerLead from '../LeadDetail/AssignOwnerLead';
import LeadTaskStatus from '../LeadDetail/LeadTaskStatus';
import {getCallDetail} from '../../Services/ivr-services';
import {smsDropdown,sendEmail,getAllEmail,getTaskType,sendMessage,makeCall,getLeads,getLeadBucketStatus,getCommentHistory,saveDisposition,leadPushById,getOwnerAssign,pushDetailsToOwner,getScheduleTask} from '../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import PopUp from '../../Components/Popup/Popup';
import { Icon,Popup } from 'semantic-ui-react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import CallPopup from './CallPopup';
import SMSPopup from './SMSPopup';
import EmailPopup from './EmailPopup';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import utils from '../../Services/utility-service';
import './LeadDetail.css';


const style = {
    borderRadius: 0,
    opacity: 0.85,
    padding: '1em',
}
// const validEmailRegex = 
//   RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
const initialState = {
    submissionLoader: false,
    showChangeStatus: false,
    commentHistory:[],
    status:[],
    viewActivities: true,
    users: [],
    emailTemplates:[],
    userTaskMappings:[],
    leadDetail:[],
    callDetails:[],
    smsTemplates:[],
    opnEmail: false,
    opnAssignOwner: false,
    opnAssignField: false,
    opnCallPopup:false,
    smsTemplateId:"",
    emailTemplateId:"",
    index:"",
    back:"",
    specificEmailTemplates: null,
    specificTemplates:null,
    leadPushPopup:false,
    confirmationLoader: false,
    campaigns: [],
    task:[],
    error: "",
    // email:{
    //     to:"",
    //     subject:"",
    //     content:""
    // },
    formControls:{
        userUid:{
            value:""
        },
        taskId:{
            value:""
        },
        leadDetailId:{
            value:"" 
        },
        scheduleStart:{
            value:"",
            error:""
        }
    }
}

class LeadDetail extends Component{

    constructor(props){
        super(props);
        
        this.state = initialState;  
        
        this.emailIDChangeHandler = this.emailIDChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.returnFunction = this.returnFunction.bind(this);      
        this.verifyDetails = this.verifyDetails.bind(this);
        this.fetchTaskType = this.fetchTaskType.bind(this);
        this.scheduleTask = this.scheduleTask.bind(this);         
        this.callDetails = this.callDetails.bind(this);
        this.smsDropdown = this.smsDropdown.bind(this);  
        this.toggleCall = this.toggleCall.bind(this);
        this.toggleSMS = this.toggleSMS.bind(this);
        this.makeCall = this.makeCall.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchAllEmail = this.fetchAllEmail.bind(this);
        this.getUsertoAssign = this.getUsertoAssign.bind(this);
        this.formatEmailTempl = this.formatEmailTempl.bind(this);
        this.specificTemplates = this.specificTemplates.bind(this); 
        this.submitDetailsToOwner = this.submitDetailsToOwner.bind(this);    
    }

    componentDidMount(){

        // this.fetchLeadStatus();
        this.fetchLeadBucketStatus();
        this.fetchCommentHistory(); 
        this.fetchLeadDetail();
        let c = utils.campns;
        if(c && c.length>0){
            this.setState({
                campaigns: c
            })
        }
    }

    getKeyValueList(){
        let list = [];
        for (let [key, value] of Object.entries(this.state.leadDetail)) {
            let obj = {
                key: key || "",
                value: value || ""
            }
            list.push(obj);
        }
        return list;
    }

    fetchLeadBucketStatus(){
        let body={
            leadId: parseInt(this.props.leadData.id)           
        }
        getLeadBucketStatus(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                this.setState({
                    status: data.leadStatus
                })
            }
        }) 
        .catch(error =>{
            console.error(error);
       }) 
    }

    fetchTaskType(){
        let body ={
            "bUid": null,
            "taskType": "LEAD"
        }
        getTaskType(body)
        .then(r => r.json())
        .then( data =>{
            if (data.success){
                this.setState({
                    task:data.tasks
                })
            }
        })
    }

    setIndex(i){
        this.setState({
            index:i
        });
    }

    toggleEmail(){
        this.setState((state)=>{
            return{
                opnEmail: !state.opnEmail
            }   
        })
    }

    callDetails(id,index) {
       this.setIndex(index);
        let body={
            id: id ? id:null,
            start: 0,
            maxResults: parseInt(10),
            businessUid: null,
            startDate: null,
            endDate: null,    
            refType:  parseInt(2),
            callerMobile: null,
            receiverMobile: null,
            refId: null
        }
        getCallDetail(body)
        .then(response => response.json())
        .then( data =>{
            if(data.success){
                this.setState({
                    callDetails:data.callingDetails,
                    submitLoader: false,
                    // showButton: false
                })

                ToastsStore.success(data.message);    
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something went wrong, Please try again later.!!!");
            this.setState({
                submitLoader: true
            })
        })
    }

    dateChange(event){
        
        let temp = this.state.formControls;
        temp.scheduleStart.value = event;
        this.setState({
            scheduleStart: temp
        })

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

    fetchLeadDetail(){
        if(this.props.leadData){
            const body={        
                leadId:parseInt(this.props.leadData.id)
            }
            getLeads(body)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    this.setState({
                        leadDetail: data.leadDetails,
                    });
                    ToastsStore.success(data.message);    
                }
                else{
                    ToastsStore.error(data.message);
                }
            })
            .catch(error =>{
                ToastsStore.error("Something went wrong. Please try again later.!!!");
            })
        } 
    }

    scheduleTask(){
        if(this.props.leadData && this.props.leadData.id){
            let body={
                "leadId":parseInt(this.props.leadData.id)
            }
            this.setState({
                confirmationLoader: true
            })
           // getLeads(body)
            getScheduleTask(body)
            .then(res => res.json())
            .then(data =>{
                if(!!data.success){
                    
                    this.setState({
                        confirmationLoader: false,
                        userTaskMappings: data.userTaskMappings
                    })
                    ToastsStore.success(data.message);      
                }
                else{
                    ToastsStore.error(data.message);
                }
            })
            .catch(error =>{
                ToastsStore.error("Something Went Wrong. Please Try Again Later!!!");
                this.setState({
                    confirmationLoader: false
                })
            })
        }
    }

    getUsertoAssign(Fuser){
        if(this.props.leadData && this.props.leadData.id){
            let body={
                "leadDetailId":parseInt(this.props.leadData.id)
            }
            if(Fuser){
                body.userType=Fuser;
            }
            getOwnerAssign(body)
            .then(r =>  r.json())
            .then(data =>{
                if(data.success){
                    this.setState({
                        users: data.users
                    }) 
                    this.scheduleTask();
                    ToastsStore.success(data.message);  
                }
                else{
                    ToastsStore.error(data.message);
                }
            })
            .catch(error =>{
                ToastsStore.error("Something Went Wrong. Please Try Again Later !!!");
            })
        }
    }

    fetchCommentHistory(){
        if(this.props.leadData && this.props.leadData.id){
            let body = {
                leadId: this.props.leadData.id
            };
            getCommentHistory(body)
            .then(response => response.json())
            .then(data =>{
                //let data = { "success": true, "message": "Success", "allowedActions": [], "leadHistory": [ { "createdBy": "Anand Kumar Verma", "createdOn": 1588618167000, "activityType": "STC", "comment": "from Follow Up for Payment to Follow Up for Payment" }, { "createdBy": "Anand Kumar Verma", "createdOn": 1588618325000, "activityType": "CMT", "comment": "A nice Comment" }, { "createdBy": "Anand Kumar Verma", "createdOn": 1588618361000, "activityType": "CMT", "comment": "A nice Comment" }, { "createdBy": "Anand Kumar Verma", "createdOn": 1588618838000, "activityType": "STC", "comment": "from 'Language Barrier' to 'Language Barrier'" }, { "createdBy": "Anand Kumar Verma", "createdOn": 1588618838000, "activityType": "CMT", "comment": "A nice Comment" } ] };
                if(data.success){
                    this.setState({
                        commentHistory: data.leadHistory
                    },()=>{
                        // this.callDetails();
                        document.querySelector('.comment-history').scrollTo(0,document.querySelector('.comment-history').scrollHeight);
                    })
                }
            })
            .catch(error =>{
                 console.log(error);
            })
        }
    }

    submitDisposition(type){
        if(type === 'status'){
            if(!document.getElementById("leadStatus").value){
                ToastsStore.error("Please Choose Status");
                return;
            }
            let body={
                "leadId" : this.props.leadData.id,
                "leadStatusId": document.getElementById("leadStatus").value.split(",")[0],    
            }
            saveDisposition(body)
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    ToastsStore.success(data.message);
                    this.props.updateCurrentStatus(document.getElementById("leadStatus").value.split(",")[1]);
                    this.setState({
                        showChangeStatus: false
                    });
                    this.fetchCommentHistory();
                }else{
                    ToastsStore.error(data.message);
                }

            })
            .catch(error =>{
                ToastsStore.error("Something went wrong. Please try again later !")
                 console.log(error);
            })
        }else{
            if(!document.getElementById("comment").value){
                ToastsStore.error("Comment cannot be empty.");
                return;
            }
            let body={
                "leadId" : this.props.leadData.id, 
                "comment": document.getElementById("comment").value,    
            }
            saveDisposition(body)
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    ToastsStore.success(data.message);
                    this.fetchCommentHistory();
                }else{
                    ToastsStore.error(data.message);
                }
            })
            .catch(error =>{
                ToastsStore.error("Something went wrong. Please try again later !")
                 console.log(error);
            })
        }
    }

    verifyDetails(par){
        let temp = this.state.formControls;
        if(!this.state.formControls.userUid.value){
            temp.scheduleStart.error = `User field is manadatory`; 
            this.setState({
                formControls: temp
            })
            return
        }
        else{
            temp.scheduleStart.error = "" ;
            this.setState({
                formControls: temp
            })
        }
        this.submitDetailsToOwner(par);
    }

    submitDetailsToOwner(par){
        if(this.props.leadData && this.props.leadData.id){
            let temp = this.state && this.state.formControls; 
            let body={
                userUid: temp.userUid.value,
                taskId:temp.taskId.value,
                leadDetailId:parseInt(this.props.leadData.id),   
                scheduleStart: temp.scheduleStart.value
            }
            pushDetailsToOwner(body)
            .then(response => response.json())
                .then(data =>{
                    if(data.success){
                        ToastsStore.success(data.message);
                        this.scheduleTask();
                        if(par === "assign"){
                            this.setState({
                                opnAssignOwner: false
                            });
                        }
                        else if (par === "FieldAssign"){
                            this.setState({
                                opnAssignField: false
                            })
                        }
                       
                    }else{
                        ToastsStore.error(data.message);
                    }
                })
                .catch(error =>{
                    ToastsStore.error("Something went wrong. Please try again later !")
                     console.log(error);
                })
        } 
    }

    changeStatus(){
        this.setState({
            showChangeStatus: true
        })
    }

    makeCall(){
        this.setState({
            submissionLoader:true
        })
        const body={
            id:this.props.leadData.id,
            type:"LEAD",
            source:"LD",
            receiverNumber: null
        }
        makeCall(body)
        .then(response => response.json())
        .then( data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submissionLoader: false
                });
                this.toggleCall();        
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error=>{
            ToastsStore.error("Something went wrong.Please try again later.!!!");
            this.setState({
                submissionLoader:false
            })
        }) 
    }

    fetchAllEmail(){
        let body={
            start: 0,
            maxResult: 100
        }
        this.setState({
            confirmationLoader: true
        })
        getAllEmail(body)
        .then(r => r.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    emailTemplates: this.formatEmailTempl(data.emailTemplates),
                    confirmationLoader: false   
                })
                this.toggleEmail(); 
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e=>{
            ToastsStore.error("Something Went Wrong.!!! Please Try Again Later.");
            this.setState({
                confirmationLoader: false
            })
        })
    }

    formatEmailTempl(email){
        email.forEach(e => {e.error = "";});        
        return email;
    }

    verifyEmailDetails(){
       
        let t=this.state.specificEmailTemplates
        if(!this.state.specificEmailTemplates.bodyTemplate){
            t.error = "Email Content is mandatory";
            // ToastsStore.error("Email Content is mandatory");
            this.setState({
                specificEmailTemplates: t
            })
            return;
        }
        else if(!t.subjectTemplate){
            t.error = "Subject is mandatory";
            // ToastsStore.error("Subject is mandatory");
            this.setState({
                specificEmailTemplates: t
            })
            return;
        }
        else{
            t.error = null;
            this.setState({
                specificEmailTemplates: t
            })
        }
        this.sendEmail();
    }

    sendEmail(){
        this.setState({
            submissionLoader: true
        })
        const body ={
            content: this.state.specificEmailTemplates.bodyTemplate,    
            subject: this.state.specificEmailTemplates.subjectTemplate,   
            id : this.props.leadData.id,
            type : "LEAD", // type for ID
            source : "LD", // panel. Lead Detail
            receiverEmail : this.state.specificEmailTemplates.to ? this.state.specificEmailTemplates.to: null, // when agent enters a particular email
            emailTemplateId: this.state.emailTemplateId, // or will be picked from campaign config
        }
       
        sendEmail(body)
        .then(response => response.json())
        .then( data =>{
            this.setState({
                submissionLoader: false
            })
            if(data.success){
                ToastsStore.success(data.message);
                this.toggleEmail();       
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error=>{
            ToastsStore.error("Something went wrong.Please try again later.!!!");
            this.setState({
                submissionLoader:false
            })
        }) 
    }

    smsDropdown(){
        const body={
            start : parseInt(0),
            maxResult : parseInt(100)
        }
        smsDropdown(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    smsTemplates:data.smsTemplates
                });
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            this.setState({
                submissionLoader:false 
            })
            ToastsStore.error("Somethig went wrong, please try again later !!!");
        })
    }

    sendMessage(){    
        const body={
            id : this.props.leadData.id,
            type : "LEAD",
            source : "LD",
            receiverNumber : null,
            smsTemplateId : this.state.smsTemplateId,
            content : this.state.specificTemplates ? this.state.specificTemplates : null
        }
        // console.log(body);
        sendMessage(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submissionLoader: false
                });  
                this.toggleSMS();      
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error=>{
            ToastsStore.error("Somethig went wrong, please try again later !!!");
            this.setState({
                submissionLoader:false
            })
        })      
    }

    smsContentChanegHandler(event){
        let value = event.target.value;
        let id = this.state.smsTemplateId;
        let smsTem = this.state.smsTemplates
        smsTem.forEach(sms=>{
            if(parseInt(sms.smsTemplateId) === parseInt(id)){
                sms.templateBody =value; 
            }
        })

        this.setState({
            smsTemplates: smsTem
        },()=>this.specificTemplates())   
    }

    handleChange(event){     
        this.setState({
            smsTemplateId:event.target.value,
            specificTemplates:null
        },()=>this.specificTemplates())          
    }

    emailIDChangeHandler(event){
        this.setState({
            emailTemplateId: event.target.value
        },this.particularEmailTemplate.bind(this))  
    }

    particularEmailTemplate(){
        let emailTemplate = this.state.emailTemplates && this.state.emailTemplates.filter(item=>{
            return parseInt(item.templateId) === parseInt(this.state.emailTemplateId)
        })                
        this.storeParticularTemplate(emailTemplate[0]);
    }

    storeParticularTemplate(email){
        this.setState({
            specificEmailTemplates: email
        })
    }

    emailChangeHandler(event){
        let eTempl = this.state.specificEmailTemplates;
        let name = event.target.name;
        for(let p in eTempl){
            if(name === p){       
                eTempl[p] = event.target.value;
            }
        }
        this.setState({
            specificEmailTemplates: eTempl
        })
    }
 
    specificTemplates(){
        let id = this.state.smsTemplateId;
        let specificTem = this.state.smsTemplates.filter( item => {
                return item.smsTemplateId === parseInt(id);
            }
        )
       
        if(specificTem[0] && specificTem[0].templateBody){
            // console.log(specificTem[0].templateBody); here specificTem[0].templateBody have values    
            this.setState({
                specificTemplates:specificTem[0].templateBody
            });      
            // console.log(this.state.specificTemplates);  But here its value is null...dont know Y
        }else if(specificTem[0] && !specificTem[0].templateBody){
            this.setState({
                specificTemplates:"."
            })
        }
        else{        
            this.setState({
                specificTemplates: null
            })    
        }
    }

    returnFunction(){
        if(this.props.back === "task"){
            this.props.switchPage("page");
        }
        else if(this.props.back === "leadTable"){
            this.props.switchLeadView('lead',0);
        }
    }

    toggleCall(){
        this.setState({
            opnCallPopup: !this.state.opnCallPopup
        })
    }

    toggleSMS(){
        this.setState({
            opnSMSPopup: !this.state.opnSMSPopup
        }) 
        this.smsDropdown();      
    }

    closePopup(){
        this.setState({
            opnSMSPopup: !this.state.opnSMSPopup,
            specificTemplates:null
        })
    }

    pushLead(){
        this.setState({
            leadPushPopup: true
        })
    }

    closeLeadPush(){
        this.setState({
            leadPushPopup: false
        })
    }
    
    leadDataPush(){
        let val = document.getElementById("lpCampId").value;
        if(!val){
            this.setState({
                error: "Please choose Campaign to which Lead will be pushed."
            })
            return;
        }else{
            this.setState({
                error: "",
                confirmationLoader: true
            })
            let body = {
                "dsCampaignId" : val,
                "leadIds" : [this.props.leadData.id]
            }
            leadPushById(body)
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    ToastsStore.success(data.message,4000);  
                    this.closeLeadPush();      
                }
                else{
                    ToastsStore.error(data.message,4000);
                }
                this.setState({
                    confirmationLoader: false
                });
            })
            .catch(error=>{
                ToastsStore.error("Somethig went wrong, please try again later !!!");
                this.setState({
                    confirmationLoader:false
                })
            })  
        }
    }

    render(){
        return(
            <div>
                <div 
                onClick={this.returnFunction}
                className="margin-btm--half"><button className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></div>
                
                <section className={utils.isMobile ? "lead-panel-mobile" : "lead-panel-desktop"}>
                    <article className={`${utils.isMobile ? "col-20" : "col-5"} flex flex-direction--col flex-wrap`}>
                        <div className="flex-20 pad leadDetail-card">
                            <div className="margin-auto profile-image-wrapper">
                                <div className="name-initials">{this.props.leadData && this.props.leadData.name ? this.props.leadData.name.charAt(0) : 'A'}</div>
                            </div>
                            <div className="userName text--bold text--center margin-top--double margin-btm--quar">{ this.props.leadData && this.props.leadData.name ? this.props.leadData.name : 'N/A'}</div>
                            <div className="text--center userName">{this.props.leadData && this.props.leadData.city}</div>
                        </div>
                        <div className="flex-20 pad leadDetail-card margin-top">
                            <div className="ui grid">
                                <span className="twenty wide column" onClick={this.toggleCall}><SvgIcon icon={"call"} classes={'svg--lg pointer'}></SvgIcon></span>
                                <span className="twenty wide column" onClick={this.toggleSMS}><SvgIcon icon={"sms-outline"} classes={'svg--lg pointer'}></SvgIcon></span>
                                <span className="twenty wide column" onClick={this.fetchAllEmail}><SvgIcon  icon={"email"} classes={'svg--lg pointer'} ></SvgIcon></span>
                                <span className="twenty wide column" onClick={()=>this.pushLead()}>
                                    <Popup
                                        trigger={<SvgIcon icon={"upload"} classes={'svg--lg pointer'} ></SvgIcon>}
                                        content='Push Lead'
                                        inverted
                                    />
                                </span>
                                <span className="twenty wide column" onClick={()=>ToastsStore.error("Access Denied")}><SvgIcon icon={"whatsapp"} classes={'svg--lg pointer'} ></SvgIcon></span>
                            </div>        
                        </div>
                        {
                            !!this.state.opnEmail &&
                            <PopUp title="Email" togglePopup={this.toggleEmail.bind(this)}>
                                <EmailPopup
                                    handleChange={this.emailIDChangeHandler}
                                    handleChangeEmail={this.emailChangeHandler.bind(this)}
                                    specificTemplates={this.state.specificEmailTemplates}
                                    emailTemplates={this.state.emailTemplates && this.state.emailTemplates}
                                    toggleEmail={this.toggleEmail.bind(this)}
                                    sendEmail = {this.verifyEmailDetails.bind(this)}
                                    confirmationLoader={this.state.submissionLoader}
                                />
                            </PopUp>
                        }
                        {
                            utils.hasRole("lead_assign_employee") &&

                        <div className="flex-20 pad margin-top leadDetail-card">
                            <div className="">
                                <label className="text--capitalize text--bold changeStatus-cta margin-top--half pointer text--center" 
                                onClick={()=>{
                                    return(
                                        this.setState({opnAssignOwner: true }),
                                        this.getUsertoAssign(), 
                                        this.fetchTaskType()        
                                    )
                                    }}
                                >Assign Agent</label>                    
                            </div>
                            {
                                this.state.opnAssignOwner && this.props.leadData &&
                                <PopUp title="Assign Agent" togglePopup={()=>{this.setState(state=>{return{opnAssignOwner: !state.opnAssignOwner}})}}>
                                    <AssignOwnerLead 
                                        users={this.state.users}
                                        task = {this.state.task}
                                        dateChange = {this.dateChange.bind(this)}
                                        formControls={this.state.formControls}
                                        leadDetailId={this.props.leadData.id} 
                                        changeHandler={this.changeHandler.bind(this)}                 
                                    />
                                     <div className="dialog-footer margin-top" style={{padding:'30px'}}>    
                                        <div>
                                            <button className="btn btn-fill dialog--cta pointer" 
                                            onClick={()=>{this.setState({opnAssignOwner: false})}}>
                                                Back
                                            </button>                      
                                            <button  onClick={()=>this.verifyDetails("assign")} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Assign</button>
                                        </div>      
                                    </div>  
                                </PopUp>
                            }
                        </div>
                        }
                        {
                            utils.hasRole("lead_assign_field_agents") &&
                        
                        <div className="flex-20 pad margin-top leadDetail-card">
                            <div className="">
                                <label className="text--capitalize text--bold changeStatus-cta margin-top--half pointer text--center" 
                                onClick={()=>{
                                    return(
                                        this.setState({opnAssignField: true }),
                                        this.getUsertoAssign("FIELD_AGENTS"),
                                        this.fetchTaskType()         
                                    )
                                    }}
                                >Assign Field Agent</label>                    
                            </div>
                        
                        {
                            this.state.opnAssignField && this.props.leadData &&
                            <PopUp title="Assign Field Agent" togglePopup={()=>{this.setState(state=>{return{opnAssignField: !state.opnAssignField}})}}>
                                <AssignOwnerLead 
                                    users={this.state.users}
                                    task = {this.state.task}
                                    dateChange = {this.dateChange.bind(this)}
                                    formControls={this.state.formControls}
                                    leadDetailId={this.props.leadData.id} 
                                    changeHandler={this.changeHandler.bind(this)}                 
                                />
                                <div className="dialog-footer margin-top" style={{padding:'30px'}}>    
                                    <div>
                                        <button className="btn btn-fill dialog--cta pointer" 
                                        onClick={()=>{this.setState({opnAssignField: false})}}>
                                            Back
                                        </button>                      
                                        <button  onClick={()=>this.verifyDetails("FieldAssign")} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Assign</button>
                                    </div>      
                                </div>  
                            </PopUp>
                        }
                        </div>
                       }
                        <div className="flex-20 leadDetail-card pad margin-top leadDetail-card">
                            <div className="">
                                <label className="text--capitalize text--bold">Status</label>
                            </div>  
                            {
                                utils.hasRole("lead_change_status") && !this.state.showChangeStatus &&
                                    <div>
                                        <div onClick={()=>this.changeStatus()} className="changeStatus-cta margin-top--half pointer text-small">Change Status</div>
                                    </div>
                            }
                            {
                                this.state.showChangeStatus && 
                                <div className="flex-20">
                                    <div className="flex-20 margin-top margin-btm--half">
                                        <select id="leadStatus" className="form-control" >
                                            <option value="" hidden>--Choose Status--</option>
                                            {
                                                this.state.status.map((item,index) => {
                                                    return(
                                                        <option key={index} value={item.id+","+item.disposition}>{item.disposition}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-5 margin-auto">
                                        <button onClick={()=>this.submitDisposition('status')} className="ui teal tiny button">Submit</button>
                                    </div>    
                                </div>
                            }
                        </div>
                    </article>
                    <article className={`${utils.isMobile ? "col-20 margin-top" : "col-15"} flex flex-direction--col flex-wrap`}>
                        <div className={`${utils.isMobile ? "" : "margin-left"} col-20 flex flex-wrap leadDetail-card`}>
                            <div className="flex flex-wrap col-20" style={{maxHeight:'16em',overflowY:'auto'}}>
                                {
                                    this.getKeyValueList().map((item,index) => {
                                        return(
                                            <div key={index} className={`pad ${ (item.key === 'url' || item.key === 'pageuuid' || item.key === 'tid' || item.key === 'page_url' || item.key === 'tags') ? 'col-10' : 'col-5' }`}>
                                                <label className="text--bold" style={{textTransform:'capitalize'}}>{item.key}</label>
                                                <div className="text-light text-break--all">{item.value}</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>    
                                                                    
                        <div style={{backgroundColor:'#d0cbcb'}} className={ `${utils.isMobile ? "margin-left-O" : "margin-left"} col-20 flex flex-wrap leadDetail-card margin-top`}>
                                <div className={`${!!this.state.viewActivities ? 'bdr-btm-2 text--bold' : null} pad pointer`} onClick={()=> this.setState({viewActivities: true})}>Activities</div>
                                <div className={`${!this.state.viewActivities ? 'bdr-btm-2 text--bold' : null} pad pointer`} onClick={
                                    ()=> {
                                        return(
                                            this.scheduleTask(),
                                            this.setState({viewActivities: false})
                                        )      
                                    }
                                } >Task Status</div>
                        </div>
                        <div  style={ utils.isMobile ? {marginLeft:'0px'} : {marginLeft: "16px"} } className= "col-20 flex flex-wrap leadDetail-card pad">
                            {      
                                !!this.state.viewActivities &&
                                <React.Fragment>
                            <div className="col-20 comment-history">
                                {
                                    this.state.commentHistory.map((item,index) => {   
                                        return(
                                            <div key={index} className="comment-card col-18 pad--half flex flex-direction--row">
                                                <span className="mar--half">
                                                    <div className="comment-detail text--bold">{item.comment}</div>
                                                    <div className="text-intent" style={{fontSize:'12px'}}>{item.createdBy} | <Moment format="YYYY/MM/DD hh:mm:ss a">{item.createdOn}</Moment></div>
                                                </span>              
                                                <span style={{padding:'10px 0'}} >
                                                   
                                                        {  item.activityType === "LC" &&    
                                                        <Popup
                                                            content='View Recording'
                                                            trigger={
                                                                <button className="ui teal tiny button" style={{marginLeft:'480px'}}  onClick={()=>this.callDetails(item.activityId,index)}> 
                                                                    <SvgIcon icon={"play-circle-outline"} classes={'svg--lg pointer'}></SvgIcon>
                                                                </button>
                                                            }
                                                        >
                                                        </Popup>                                            
                                                        }     
     
                                                        {  
                                                            item.activityType === "LC" && 
                                                            this.state.callDetails.map((subitem,subindex) =>{
                                                                if(index === this.state.index){
                                                                    // this.setBoolean();
                                                                    return(
                                                                        <span className="mar--half pad--quar" style={{float:"right", border:"1px solid #d0cbcb"}}>
                                                                            <audio controls key={subindex}>
                                                                                <source src={subitem.callRecordingUrl} type="audio/wav"/>
                                                                            </audio>
                                                                        </span>
                                                                    
                                                                    );
                                                                }else{
                                                                    return(
                                                                        <React.Fragment></React.Fragment>
                                                                    );
                                                                }      
                                                            })
                                                        } 
                                          
                                                </span>                
                                            </div>
                                        );
                                    })
                                }  
                            </div>
                            
                            <div className="col-20 comment-input flex flex-wrap margin-top">
                                <input type="text" id="comment" className="form-control margin-right--half col-16" placeholder="Type here..."></input>
                                <button onClick={()=>this.submitDisposition('comment')} className="ui teal tiny button">Submit</button>
                            </div>
                            </React.Fragment>
                            }
                        </div> 
                        {                    
                            !this.state.viewActivities &&
                            <LeadTaskStatus 
                                userTaskMappings={this.state.userTaskMappings} 
                                scheduleTask = {this.scheduleTask}
                            />
                        } 
                    {
                        this.state.opnSMSPopup && 
                        <PopUp title="SMS/Message" togglePopup={this.closePopup.bind(this)}>
                           <SMSPopup
                             handleChange={this.handleChange}
                             smsContentChanegHandler ={this.smsContentChanegHandler.bind(this)}
                             specificTemplates={this.state.specificTemplates}
                             toggleSMS={this.toggleSMS}
                             sendMessage={this.sendMessage}
                             smsTemplates={this.state.smsTemplates}
                             smsTemplateId={this.state.smsTemplateId}
                             confirmationLoader={this.state.submissionLoader}
                           />
                        </PopUp>
                    }    
                    {
                        this.state.opnCallPopup && this.props.leadData &&
                        <PopUp title="Are you sure?" togglePopup={this.toggleCall}>
                           <CallPopup
                             makeCall={this.makeCall}
                             confirmationLoader={this.state.submissionLoader}
                             toggleCall={this.toggleCall}
                             leadData = {this.props.leadData}
                           />
                        </PopUp>
                    }
                    {
                        this.state.leadPushPopup && 
                        <PopUp title="Push Lead" togglePopup={this.closeLeadPush.bind(this)}>
                            <div className="senderId-modal--wrapper pad">                      
                                <div className="label">Campaign&nbsp;
                                    <Popup
                                        trigger={<Icon name='info circle' color="blue"/>}
                                        content='Campaign to which Lead will be Pushed'
                                        position='bottom left'
                                        style={style}
                                        inverted
                                    />
                                </div>
                                <select id="lpCampId" className="form-control" >
                                    <option value="" hidden>--Choose Campaign--</option>
                                    {
                                        this.state.campaigns.map((item,index) => {
                                            return(
                                                <option key={index} value={item.id}>{item.name}</option>
                                            );
                                        })
                                    }
                                </select>
                                {
                                    this.state.error &&
                                    <div className="form-error">{this.state.error}</div>
                                }
                            </div> 
                            <div className="dialog-footer pad">   
                                {
                                    !this.state.confirmationLoader && 
                                    <div>
                                        <button className="ui button" onClick={()=>this.closeLeadPush()}>
                                            Back
                                        </button>                    
                                        <button onClick={()=>this.leadDataPush()} className="ui green button">Push Lead</button>
                                    </div>
                                }
                                {
                                    this.state.confirmationLoader &&
                                    <div>
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </div>  
                        </PopUp>
                    }
                    </article>  
                </section>
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
            </div>
        );
    }
}

export default LeadDetail;