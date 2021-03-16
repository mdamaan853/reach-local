import React from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import utils from '../../../Services/utility-service';
import {getDetailCampaign} from '../../../Services/campaign-service';
import Popup from '../../Popup/Popup';
//import { getTemplates } from '../../../Services/template-service';
//import SMSPopup from '../../../Containers/LeadDetail/SMSPopup';
import CustomSMSTemplate from '../CustomSMSTemplate';
import { getAudienceData } from '../../../Services/common-service';
import EmailPopup from '../../../Containers/LeadDetail/EmailPopup';
import CircularLoader from '../../circular-loader/circular-loader';
import {smsDropdown,getAllEmail,smsJourney} from '../../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

export class RetargettingSMSPro extends React.Component{

    constructor(props){
        super(props);
        this.state={
            tempDs: '',
        //    templates:[],
            showDsChangeConf: false,
            showLangChangeConf: false,
            messageNum:0,
            audienceData:[],
            submissionLoader: false,
            smsTemplateId: null,
            emailTemplateId:null,
            smsTemplates: null,
            specificTemplates:null,
            specificEmailTemplates: null,
            emailTemplates:[],
            date:null,
            delay:null,
            delayUnit: null,
            type:"delay",
            eventType: null,
            notification:null,
            formControls:{
                SMStype: {
                    value: "simpleSMS",
                    error: ""
                },
                audienceGrId: {
                    value: "",
                    error: ""
                },
                language:{
                    value:"en",
                    error:""
                },
                template:{
                    value:"",
                    error:""
                },
                longurl: {
                    value: ""
                },
                templateCont:{
                    value:'',
                    error:''
                },
                scheduleNow:{
                    value: false
                },
              targetAudienceCount:{
                value:"",
                error:""
          },
            }
        }  
        this.loadData = this.loadData.bind(this);
        this.eventType = this.eventType.bind(this);
        this.resetRadio =this.resetRadio.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.smsDropdown = this.smsDropdown.bind(this); 
        this.selectChange =this.selectChange.bind(this);
    //    this.handleChange = this.handleChange.bind(this);
        this.calculateDelay = this.calculateDelay.bind(this);
        this.sendNotification=this.sendNotification.bind(this);
        this.notificationNull = this.notificationNull.bind(this);   
        this.handleChangeDelay = this.handleChangeDelay.bind(this);
        this.delayChangeHandler =this.delayChangeHandler.bind(this);
        this.radioChangeHandler = this.radioChangeHandler.bind(this);
        this.fetchDetailCampaign = this.fetchDetailCampaign.bind(this);
        this.compareNotification = this.compareNotification.bind(this);
        this.emailIDChangeHandler = this.emailIDChangeHandler.bind(this);
        this.selectChangeNotification = this.selectChangeNotification.bind(this);
        
    }

    radioChangeHandler(event){
        let value = event.target.value;
        this.setState({
            type:value
        },this.resetRadio())
    }
    
    resetRadio(d){
        
        let dat = this.state.date;
        let del = this.state.delay;
        if(this.state.type === "delay"){
            dat = "";
            this.setState({
                date: dat,
            })

        }
        else if(this.state.type === "date"){
            del = 0;
            this.setState({
                delay: del
            })
        }
        else if( this.state.type === "immediately"){
            dat = "";
            del=0;
            this.setState({
                date: dat,
                delay: del
            })
        }
        if(d==="date"){

            return this.state.date;
        }
        else if(d === "delay"){

            return this.state.delay;
        }
    }

    calculateDelay(){
        
        let d = this.state.delay;
        let delay = this.resetRadio("delay");
        if(delay !== 0){
            if(this.state.delayUnit === "sec"){
                delay = d
            }
            else if (this.state.delayUnit === "min"){
                delay = 60*d;
            }
            else if(this.state.delayUnit === "hour"){
                delay = 3600*d;
            }
            else if(this.state.delayUnit === "day"){
                delay = 24*3600*d;
            }
            else{
                ToastsStore.error("Please Select Delay Unit!!!");
                return;
            }
        }
   
        return delay;
    }

    delayChangeHandler(event){
       let value=event.target.value;
       this.setState({
        delayUnit: value
       })
    }

    eventType(data){
        let arr = [];
        if(data && data.length>0){
            data.forEach(e=> {
                let obj = {
                    "value": e, 
                    "label": e 
                }
                arr.push(obj);
            });   
        }
        return arr;
    }

    selectChange(event){
        this.setState({
            eventType: event.value
        })
    }

    selectChangeNotification(event){
        let v = event.value;
        this.setState({
            notification:v
    },this.compareNotification)}
        
    compareNotification(){
        if(this.state.notification === "SMS"){
            this.smsDropdown();
            this.fetchDetailCampaign();
        }
        else if(this.state.notification === "EMAIL"){
            this.fetchAllEmail();
        } 
    }   

    fetchAllEmail(){
        let body={
            start: 0,
            maxResult: 100
        }
        this.setState({
            submissionLoader: true
        })
        getAllEmail(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    emailTemplates: this.formatEmailTempl(data.emailTemplates),
                    submissionLoader: false   
                })
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        // .catch(e=>{
        //     //ToastsStore.error("Something Went Wrong.!!! Please Try Again Later.");
        //     ToastsStore.error("Ye kya h?.");
        //     this.setState({
        //         submissionLoader: false
        //     })
        // })
    }

    formatEmailTempl(email){
        email.forEach(e => {e.error = "";});        
        return email;
    }

    emailIDChangeHandler(event){
        this.setState({
            emailTemplateId: event.target.value
        },this.particularEmailTemplate.bind(this))  
    }

    emailBodyChanegHandler(event){
        let t = this.state.specificEmailTemplates;
        t=[{name:"email",subjectTemplate:"",bodyTemplate:""}];
        let name=event.target.name;
         t[name] = event.target.value;
        this.setState({
            specificEmailTemplates: {
                ...this.state.specificEmailTemplates,
                [name]:event.target.value
            }
        })
    }

    handleChangeDelay(event){
        const value = event.target.value;
        this.setState({
            delay: value
        })

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

    fetchDetailCampaign(){
        let code = JSON.parse(localStorage.getItem("code"));
        const body={
            code: code,
        }
        getDetailCampaign(body)
        .then(response=>response.json())
        .then((data)=>{
            if(data.success){     
                this.setState(state=>{
                    return{
                       // detailCampaign: data.audienceGroupId,
                        formControls:{
                            ...state.formControls,
                            audienceGrId:{
                                ...state.formControls.audienceGrId,
                                value:data.audienceGroupId
                            }
                        }
                    }
                   // type: (this.props.location.pathname === '/update-stats-campaign') ? 'update' : 'view'
                });
                //this.loadData();
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

//     fetchTemplates() {
//         const body = {
//               businessUid: this.state.businessUid
//         }
//         getTemplates(body)
//               .then(response => response.json())
//               .then(data => {
//                     //let data = { "success": true, "message": "Success", "allowedActions": [], "smsTemplates": [ { "smsTemplateId": 2, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" }, { "smsTemplateId": 3, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" } ] };
//                     if (data.success) {
//                           this.setState({
//                                 templates: data.smsTemplates,
//                           })
//                     }
//               })
//               .catch(error => {
//                     console.log(error);
//                     this.setState({
//                           loadingData: false
//                     })
//               })
//   }

    langChangeHandle = (event) => {
        let temp1 = this.state.formControls;
        if(!!temp1.language.value){
            this.setState({
                    tempDs: event.target.value,
                    showLangChangeConf: true
            })
            return;
        }
        temp1.language.value = event.target.value;
        temp1.template.value = "";
        temp1.templateCont.value = "";
        this.setState({
            formControls: temp1,
            messageNum: 0
        })
    }

    clearLangData = () => {
        let temp1 = this.state.formControls;
        temp1.language.value = this.state.tempDs;
        temp1.template.value = "";
        temp1.templateCont.value = "";
        this.setState({
            formControls: temp1,
            messageNum: 0,
            showLangChangeConf: false
        })
    }

    loadData() {
        const body = {
              audienceGroupId: this.state.formControls.audienceGrId.value
        };
        if (!this.state.formControls.audienceGrId.value) {
              // ToastsStore.error("Please Select Audience or Upload Audience First");
              return;
        }
        getAudienceData(body)
              .then(response => response.json())
              .then(data => {
                    if (data.success) {
                          this.setState({
                                audienceData: data.audienceColumnNames
                          })
                          ToastsStore.success(data.message);
                    } else {
                          ToastsStore.error(data.message);
                    }

              }).catch(error => {
                    console.log(error);
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                    
              })
    }
 
    // specificTemplates(){
    //     let id = this.state.smsTemplateId;
    //     let specificTem = this.state.smsTemplates.filter( item => {
    //             return item.smsTemplateId === parseInt(id);
    //         }
    //     )
       
    //     if(specificTem[0] && specificTem[0].templateBody){
    //         this.setState({
    //             specificTemplates:specificTem[0].templateBody
    //         });      
    //     }else if(specificTem[0] && !specificTem[0].templateBody){
    //         this.setState({
    //             specificTemplates:"."
    //         })
    //     }
    //     else{        
    //         this.setState({
    //             specificTemplates: null
    //         })    
    //     }
    // }

    verifyEmailDetails(){
        let t=this.state.specificEmailTemplates;
        if(!t){
            ToastsStore.error("Please Select Email Template. If Email Template is unavailable, than please specify body.");
            return;
        }
        if(!this.state.specificEmailTemplates.bodyTemplate){
            t.error = "Email Content is mandatory";
            ToastsStore.error("Email Content is mandatory");
            this.setState({
                specificEmailTemplates: t
            })
            return;
        }
        else if(!t.subjectTemplate){
            t.error = "Subject is mandatory";
            ToastsStore.error("Subject is mandatory");
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
        this.verifyDetails();
    }

    // handleChange(event){     
    //     this.setState({
    //         smsTemplateId:event.target.value,
    //         specificTemplates:null
    //     },()=>this.specificTemplates())          
    // }

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

    smsBodyChanegHandler(event){
        this.setState({
            specificTemplates: event.target.value
        })
    }

    // smsContentChanegHandler(event){
    //     let value = event.target.value;
    //     let id = this.state.smsTemplateId;
    //     let smsTem = this.state.smsTemplates
    //     smsTem.forEach(sms=>{
    //         if(parseInt(sms.smsTemplateId) === parseInt(id)){
    //             sms.templateBody =value; 
    //         }
    //     })

    //     this.setState({
    //         smsTemplates: smsTem
    //     },()=>this.specificTemplates())   
    // }

    notificationNull() {                                                                                 
        this.setState({
            notification: null,
        })
    }

    dateChange = val => {
        this.setState({
            date: val
        })
    }

    clickHandler() {
        //let finalStr = this.state.formControls.templateCont.value.concat("${"+this.state.formControls.colmnElement.value)+"}"
        let finalStr = this.state.formControls.templateCont.value.concat(" ${" + this.state.formControls.colmnElement.value + "}");
        this.setState(state => {
              return {
                    formControls: {
                          ...state.formControls, templateCont: {
                                ...state.formControls.templateCont, value: finalStr
                          }
                    }
              }
        })
    }

    checkedHandler(event){
        let value=event.target.checked;
       
           this.setState( state =>{
                 return{
                       formControls:{
                             ...state.formControls,scheduleNow:{
                                   ...state.formControls.scheduleNow,value
                             }  
                       }    
                 }
           })
    }

    verifyDetails(){
    
        let date =  this.resetRadio("date");
        let delay = this.resetRadio("delay");
        if(!this.state.eventType){
            ToastsStore.error("Event Type is mandatory!!!");
            return;
        }
        else if(!date && !delay && this.state.type !== "immediately"){
            ToastsStore.error("Either provide delay or schedule time/date for event");
            return;
        }
        else if(this.state.type === "date" && !date){
            ToastsStore.error("Please provide schedule time/date for event");
            return;
        }
        else if(this.state.type === "delay" && !delay){
            ToastsStore.error("Delay Field shoud not be empty!!!");
        }
        else if(!this.state.formControls.templateCont.value && !this.state.specificEmailTemplates.bodyTemplate){
            ToastsStore.error(this.state.notification+" body/content should not be empty");
            return;
        }
        
        this.sendNotification();
    }

    sendNotification(){
        if(this.state.type === "delay"){
            if(!this.state.delayUnit){
                ToastsStore.error("Please Select Delay Unit");
                return;
            }
        }
        this.setState({
            submissionLoader: true
        })
      
        let code = JSON.parse(localStorage.getItem("code"));
        const body ={
                campaignCode: code,
                eventType: this.state.eventType ? this.state.eventType: null,
                delay: {
                    // delayReferenceType: "CAMPAIGN_CODE",
                    delayReferenceType: null,
                    delaySeconds: this.state.delay ? this.calculateDelay() : null,
                },
                type: this.state.type ? this.state.type : null,
                scheduledTime: this.state.date ? this.resetRadio("date") : null,
                notifications: [
                    {
                        subject: this.state.notification === "EMAIL" ? this.state.specificEmailTemplates && this.state.specificEmailTemplates.subjectTemplate : null,
                        content: this.state.notification === "SMS" ? this.state.formControls.templateCont.value : this.state.specificEmailTemplates.bodyTemplate,  
                        notificationType: this.state.notification ? this.state.notification: null,     
                        templateId: this.state.notification === "SMS" ? this.state.smsTemplateId :  this.state.emailTemplateId,
                        lang: this.state.formControls.language.value ? this.state.formControls.language.value : null,
                        longUrl: this.state.formControls.longurl.value ? this.state.formControls.longurl.value : null
                    }
                ],
                parentJourneyCode: null
        }           
        smsJourney(body)
        .then(response => response.json())
        .then( data =>{
            // this.props.submit(); 
            this.setState({
                submissionLoader: false
            })
            if(data.success){
                ToastsStore.success(data.message);
                this.props.submit();       
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

    smsChangeHandler = (event) => {
        const value = event.target.value;
        let temp1 = this.state.formControls;
        temp1.template.value = value;
        temp1.templateCont.value = this.getTemplate(value);
        let num = 0;
        if (temp1.templateCont.value.length !== 0) {
              if (temp1.language.value === "en") {
                    temp1.templateCont.value = temp1.templateCont.value.substring(0, 300);
                    num = (temp1.templateCont.value.length - 160 > 0) ? 1 + Math.ceil((temp1.templateCont.value.length - 160) / 140) : 1;
              } else {
                    temp1.templateCont.value = temp1.templateCont.value.substring(0, 120);
                    num = (temp1.templateCont.value.length - 70 > 0) ? 1 + Math.ceil((temp1.templateCont.value.length - 70) / 50) : 1;
              }
        }
        this.setState({
              formControls: temp1,
              messageNum: num,
              smsTemplateId: value
        });
    }

    getTemplate(value) {
        let temp = "";
        this.state.smsTemplates.forEach(e => {
            if (String(e.smsTemplateId) === String(value)) {
                temp = e.templateBody;
            }
        })
        
        return temp;
    }

    contentHandler = (event) => {
        const value = event.target.value;
        let temp1 = this.state.formControls;
        temp1.templateCont.value = value;
        let num = 0;
        if (value.length !== 0) {
            if (temp1.language.value === "en") {
                    num = (value.length - 160 > 0) ? 1 + Math.ceil((value.length - 160) / 140) : 1;
            } else {
                    num = (value.length - 70 > 0) ? 1 + Math.ceil((value.length - 70) / 50) : 1;
            }
        }
        this.setState({
            formControls: temp1,
            messageNum: num
        })
    }

    canTestSms() {
        this.setState({
            canTestSms: true
        })
    }

    closeConf() {
        this.setState({
              canTestSms: false,
              showDsChangeConf: false,
              showLangChangeConf: false,
              canTestSmsCr: false    
        })
    }

    addURL() {
        let finalUrl = this.state.formControls.templateCont.value.concat(" ${" + "clickUrlWithTracking" + "}");
        this.setState(state => {
            return {
                    formControls: {
                        ...state.formControls, templateCont: {
                                ...state.formControls.templateCont, value: finalUrl
                        }
                    }
            }
        })
    }
  
    render(){
        return(
            <section className="popUp-modal--wrapper">
                <div className="col-19 margin-btm">
                    <div className="label">Event Type</div>
                    <Select                                    
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        placeholder="Select or Search.."
                        name="eventType"
                       // value={this.state.formControls.eventType}
                        onChange={event => {this.selectChange(event)}}
                        options={this.eventType(["Sms Delivered","Short URL Clicked","Short Url Not Clicked","Sms Not Delivered"])}
                    />
                </div>
                <div className="flex flex-direction--row margin-btm">
                    <label for="delay" className="radioBtn">
                        <input type="radio" name="type" checked={this.state.type === "delay"} 
                        value="delay" id="delay" 
                        onClick={this.radioChangeHandler}/>Delay
                        <span className="checkmark1"></span>
                    </label>
                    <label for="schedule" className="radioBtn">
                        <input type="radio" name="type" checked={this.state.type === "date"} 
                        id="schedule" value="date" onClick={this.radioChangeHandler} 
                       />Schedule
                        <span className="checkmark1"></span>
                    </label>
                    {
                        (this.state.eventType === "Sms Delivered" || this.state.eventType === "Short URL Clicked") &&
                        <label for="immedia" className="radioBtn">
                            <input type="radio" name="type" checked={this.state.type === "immediately"} 
                            id="immedia" value="immediately" onClick={this.radioChangeHandler} 
                            disabled={this.state.eventType === "Short Url Not Clicked" ? true : this.state.eventType ==="Sms Not Delivered" ? true : false}
                            />Immediately
                            <span className="checkmark1"></span>
                        </label>
                    }
                 
                </div> 
                <div className="col-19 margin-btm">
                    <div className="ui segment" style={{border: '1.2px solid rgba(0,0,0,0.1)'}}>
                        <div className="ui stackable very relaxed two column grid">
                            <div className="middle aligned column">
                                <div className="label">Delay in 
                                    <select onChange={this.delayChangeHandler} className="inline-select-form-control">
                                        <option value ="null">Select</option>
                                        <option value="day">day</option>
                                        <option value="hour">hour</option>
                                        <option value="min">min</option>
                                        <option value="sec">sec</option>
                                    </select>
                                </div>
                                <input type="number" className="form-control"
                                 onChange={this.handleChangeDelay}
                                 value={this.state.delay}
                                 disabled={this.state.type==="date" ? true: ((this.state.type==="immediately")? true: false)}/>
                            </div>
                            {
                                utils.isMobile &&
                                    <div className= "ui horizontal divider">Or</div>
                            }
                            <div className="column">
                                <div className="label">Schedule Date</div>
                                <DatePicker
                                    inline = {this.state.type ==="delay"  ? false: (this.state.type==="immediately" ? false : true)}
                                    disabled={this.state.type=== "delay"? true: ((this.state.type==="immediately")? true: false)}
                                    selected={this.state.date}
                                    placeholderText="Click to select Date"
                                    minDate={new Date()}
                                    onChange={this.dateChange}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="col-20"
                                    name="date"                                
                                    dateFormat="dd/MM/yyyy"
                                />                                     
                                <div className="label">Schedule Time</div>
                                <DatePicker
                                    selected={this.state.date}
                                    onChange={this.dateChange}
                                    showTimeSelect
                                    disabled={this.state.type==="delay" ? true: ((this.state.type==="immediately")? true: false)}
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                />
                            </div>        
                        </div>
                        {!utils.isMobile &&
                            <div className="ui vertical divider">Or</div>
                        }
                    </div>     
                </div>
               
                <div className="col-19 margin-btm">
                    <div className="label">Notification Type</div>
                    <Select                                    
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        placeholder="Select or Search.."
                        // value={this.state.formControls.notification}
                        onChange={event => {this.selectChangeNotification(event)}}
                        options={this.eventType(["SMS","EMAIL"])}
                    />
                </div>
               
                {
                    this.state.notification === "SMS" &&
                    <React.Fragment>
                        <CustomSMSTemplate 
                            formControls = {this.state.formControls}
                            changeHandler = {this.changeHandler.bind(this)}
                            loadData = {this.loadData}
                            audienceGrId = {this.state.formControls.audienceGrId.value}
                            langChangeHandle = {this.langChangeHandle.bind(this)}
                            templates = {this.state.smsTemplates}
                            smsChangeHandler={this.smsChangeHandler.bind(this)}
                            addURL={this.addURL.bind(this)}
                            contentHandler = {this.contentHandler.bind(this)}
                            messageNum={this.state.messageNum}
                            canTestSms={this.canTestSms.bind(this)}
                            checkedHandler = {this.checkedHandler.bind(this)}
                            audienceData={this.state.audienceData}
                            clickHandler={this.clickHandler.bind(this)}
                            display = "none"
                            displayTestSMS = "none"
                        />
                        <div className="dialog-footer pad">   
                            {
                                !this.state.submissionLoader && 
                                <div>
                                    <button className="btn btn-fill dialog--cta pointer" onClick={this.notificationNull}>
                                            BACK
                                    </button>                    
                                    <button className="btn btn-fill btn-success margin-left--half dialog--cta pointer" onClick={this.verifyDetails.bind(this) }>SUBMIT</button>
                                </div>
                            }
                            { 
                            this.state.submissionLoader && 
                                <div>
                                    <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                </div>
                            } 
                        </div>
                        {
                            this.state.showLangChangeConf &&
                            <Popup title={''} togglePopup={this.closeConf.bind(this)}>
                                <div className="pad text--bold text--center" style={{fontSize:'14px'}}>
                                        <div>SMS Content Section will become blank on changing Language.</div>
                                        <div>Do you still want to change the language ?</div>
                                </div>
                                <div className="col-20 flex flex-horz-center flex-wrap pad">
                                        <div className="col-4">
                                            <button className="ui grey button" style={{width:'100%'}} onClick={()=>this.closeConf()}> Back </button>
                                        </div>
                                        <div className="margin-left">
                                            <button className="ui green button" style={{width:'100%'}} onClick={()=>this.clearLangData()}> Yes </button>
                                        </div>
                                </div>
                            </Popup>
                        }
                    </React.Fragment>
                }
                {
                    this.state.notification === "EMAIL" && this.state.emailTemplates && this.state.emailTemplates.length >0 &&
                        <EmailPopup
                            handleChange={this.emailIDChangeHandler}
                            handleChangeEmail={this.emailChangeHandler.bind(this)}
                            specificTemplates={this.state.specificEmailTemplates}
                            emailTemplates={this.state.emailTemplates && this.state.emailTemplates}
                            toggleEmail={this.notificationNull}
                            sendEmail = {this.verifyEmailDetails.bind(this)}
                            confirmationLoader={this.state.submissionLoader}
                        />
                }  
                {
                    this.state.notification === "EMAIL" && this.state.emailTemplates && this.state.emailTemplates.length === 0 &&
                        <React.Fragment>
                            <label className="label">{this.state.notification}</label>
                            {
                                this.state.notification === "EMAIL" && 
                                <React.Fragment>
                                    <div className="col-19 margin-btm--half">
                                        <div className="label">Subject</div>
                                        <input type="text" className="form-control"
                                        name="subjectTemplate"
                                        onChange={this.emailBodyChanegHandler.bind(this)}
                                        />
                                    </div>
                                </React.Fragment>
                            }
                            <div className="col-20 pad--half">
                                <div className="label">Body</div>
                                <textarea  name="bodyTemplate" rows="5" cols={`${utils.isMobile ? "30" :"40" }`} value={this.state.notification === "SMS" ? this.state.specificTemplates: this.state.specificEmailTemplates && this.state.specificEmailTemplates.bodyTemplate} onChange={this.state.notification === "SMS" ? this.smsBodyChanegHandler.bind(this): this.emailBodyChanegHandler.bind(this)}></textarea> 
                            </div>
                            <div className="dialog-footer pad">   
                                {
                                    !this.state.submissionLoader && 
                                    <div>
                                        <button className="btn btn-fill dialog--cta pointer" onClick={this.notificationNull}>
                                                BACK
                                        </button>                    
                                        <button className="btn btn-fill btn-success margin-left--half dialog--cta pointer" onClick={this.state.notification === "SMS" ? this.verifyDetails.bind(this) : this.verifyEmailDetails.bind(this) }>SUBMIT</button>
                                    </div>
                                }
                                { 
                                    this.state.submissionLoader && 
                                    <div>
                                        <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                } 
                            </div>                                             
                        </React.Fragment>    
                    }  
              <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} /> 
            </section>
        )
    }
}