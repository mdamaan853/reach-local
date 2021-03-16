import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import TemplatesTable from './TemplatesTable';
import Popup from '../../Components/Popup/Popup';
import CreateTemplate from './CreateTemplate';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { getSenderIds } from '../../Services/senderId-service';
import {getTemplates,addUpdateTemplate} from '../../Services/template-service';
import Pagination from '../../Components/Pagination/Pagination';
import {getBusinessDetails} from '../../Services/user-service'; 
const initialState = {
  templates: [],
  senderIds:[],
  openPopup: false,
  start: 0,
  loader: false,
  hasNext:true,
  openActionViewTemplate: false,
  openActionEditTemplate: false,
  openActionCreateTemplate: false,
  templateToEdit: null,
  submitTemplateLoader: false,
  businessUid: null,
  body: null,
  title: null,
  loadingData: false,
  formControls: {
    templateName: {
      value: ''
    },
    type:{
      value:'PRML'
    },
    dhb: {
      value: 'true'
    },
    dsc:{
      value:"true"
    },
    si:{
      value:""
    },
    url:{
      value:""
    },
    body:{
      value:""
    },
    id:{
      value:""
    }
  }    
}
export default class Templates extends Component{
    constructor(props){
        super(props);
        this.state = initialState;
    }
    componentDidMount() {
      this.fetchBusinessDetails();
      this.fetchSenderIds();
    }
    fetchBusinessDetails(){
        getBusinessDetails()
        .then(response => response.json())
        .then(data => {
           if (data.success && !!data.uid) {
              this.setState({
                  businessUid: data.uid
              },()=>this.fetchTemplates()); 
           }
        }).catch(error => {
           console.log(error);
        })
    }
    getAllPages(type){
      if(type === 'previous'){
          if(this.state.start > 0){
              this.setState({
                  start: this.state.start - 30,
              },()=>{
                  this.fetchTemplates();
              })
          }
      }else if(type === 'next'){
          if(this.state.hasNext){
              this.setState({
                  start: this.state.start + 30,
              },()=>{
                  this.fetchTemplates();
              })
          }
      }
    }
    fetchTemplates() {
      const body = {
        businessUid: this.state.businessUid,
        start: this.state.start,
        maxResults: 30
      }
      this.setState({
        loadingData: true
      })
      getTemplates(body)
        .then(response => response.json())
        .then(data => {
        //let data = { "success": true, "message": "Success", "allowedActions": [], "smsTemplates": [ { "smsTemplateId": 2, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" }, { "smsTemplateId": 3, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" } ] };
          if (data.success && data.smsTemplates && data.smsTemplates.length > 0) { 
            this.setState({
              templates: data.smsTemplates, 
              hasNext: (data.smsTemplates.length === 30)        
            });
          }else{
            this.setState({
              hasNext: false
            })
          } 
          this.setState({
            loadingData: false
          })
        })
        .catch(error => {
          console.log(error);
          this.setState({
            loadingData: false
          })
        })
    }
    fetchSenderIds() {
        getSenderIds()
          .then(response => response.json())
          .then(data => {
          //let data = { "allowedActions": [ "string" ], "message": "string", "senderIds": [ { "created": 0, "dataSource": "string", "medium": "string", "senderCode": "string", "status": true } ], "success": true }
            if (data.success) {
              this.setState({
                senderIds: data.senderIds,
              })
            }
         })
          .catch(error => {
          console.log(error);
          })
    }
    submitTemplate(){
      if(!this.state.formControls.templateName.value){
        ToastsStore.error("Template Name Cannot be empty");
        return;
      }else if(!this.state.formControls.si.value){
        ToastsStore.error("Please choose Sender-Id");
        return;
      }
      // else if(!this.state.formControls.url.value){
      //   ToastsStore.error("Url cannot be empty");
      //   return;
      // }
      else if(!this.state.formControls.body.value){
        ToastsStore.error("Template body cannot be empty");
        return;
      }
      this.setState({
        submitTemplateLoader: true
      });
      const body = {
        templateBody: this.state.formControls.body.value,
        smsType : this.state.formControls.type.value,
        smsChannelId : 1,
        name : this.state.formControls.templateName.value,
        dndHourBlockingEnabled : this.state.formControls.dhb.value === 'true' ? true : false,
        dndScrubbingOn : this.state.formControls.dsc.value === 'true' ? true : false,
        senderId : this.state.formControls.si.value,
        businessUid : this.state.businessUid,
        lang : "EN",
        url : this.state.formControls.url.value
      }
      addUpdateTemplate(body)
        .then(response => response.json())
        .then(data => {
          this.setState({
            submitTemplateLoader: false
          });
          if (data.success) {
            this.closeAction();
            this.fetchTemplates();
            ToastsStore.success("Template created Successfully !");
          } else {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
          }
        }).catch(error => {
          console.log(error);
          this.setState({
            submitTemplateLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    editTemplate(){
        if(!this.state.formControls.templateName.value){
            ToastsStore.error("Template Name Cannot be empty");
            return;
          }else if(!this.state.formControls.si.value){
            ToastsStore.error("Please choose Sender-Id");
            return;
          }
          // else if(!this.state.formControls.url.value){
          //   ToastsStore.error("Url cannot be empty");
          //   return;
          // }
          else if(!this.state.formControls.body.value){
            ToastsStore.error("Template body cannot be empty");
            return;
          }
          this.setState({
            submitTemplateLoader: true
          });
          const body = {
            templateBody: this.state.formControls.body.value,
            smsType : this.state.formControls.type.value,
            smsChannelId : 1,
            name : this.state.formControls.templateName.value,
            dndHourBlockingEnabled : this.state.formControls.dhb.value === 'true' ? true : false,
            dndScrubbingOn : this.state.formControls.dsc.value === 'true' ? true : false,
            senderId : this.state.formControls.si.value,
            businessUid : this.state.businessUid,
            lang : "EN",
            url : this.state.formControls.url.value,
            smsTemplateId: this.state.formControls.id.value
          }
          addUpdateTemplate(body)
            .then(response => response.json())
            .then(data => {
              this.setState({
                submitTemplateLoader: false
              });
              if (data.success) {
                this.closeAction();
                this.fetchTemplates();
                ToastsStore.success("Changes saved Successfully !");
              } else {
                ToastsStore.error("Something went wrong, Please Try Again Later ");
              }
            }).catch(error => {
              console.log(error);
              this.setState({
                submitTemplateLoader: false
              });
              ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
    }
    populateTemplateFromControls(){
      let temp1 = this.state.formControls;
      temp1.templateName.value = this.state.templates[this.state.templateToEdit].name;
      temp1.type.value = this.state.templates[this.state.templateToEdit].smsType;
      temp1.dhb.value = "" + this.state.templates[this.state.templateToEdit].dndHourBlockingEnabled;
      temp1.dsc.value = "" + this.state.templates[this.state.templateToEdit].dndScrubbingOn;
      temp1.si.value = this.state.templates[this.state.templateToEdit].senderId;
      temp1.url.value = this.state.templates[this.state.templateToEdit].url;
      temp1.body.value = this.state.templates[this.state.templateToEdit].templateBody;
      temp1.id.value = this.state.templates[this.state.templateToEdit].smsTemplateId;
      this.setState({
        formControls: temp1,
        openActionEditTemplate: true,
      })
    }
    clearFormControls(){
      let temp1 = this.state.formControls;
      temp1.templateName.value = "";
      temp1.si.value = "";
      temp1.url.value = "";
      temp1.body.value = "";
      temp1.id.value = "";
      this.setState({
        formControls: temp1
      })
    }
    toggleAction(index,actionName){
        if(actionName==="edit"){
            this.setState({
                templateToEdit: index
            },()=>this.populateTemplateFromControls())
        }else if(actionName==="new"){ 
            this.setState({
                openActionCreateTemplate: true
            });
        }else if(actionName==="view"){
            let body = this.state.templates[index].templateBody;
            let t = this.state.templates[index].name;
            this.setState({
                body: body,
                title: t,
                openActionViewTemplate: true
            });
        }
    }
    closeAction(){
        if(this.state.openActionEditTemplate){
            this.clearFormControls();
            this.setState({
            openActionEditTemplate: false
            })
        }else if(this.state.openActionCreateTemplate){
            this.setState({
            openActionCreateTemplate: false
            });    
        }else if(this.state.openActionViewTemplate){
            this.setState({
                openActionViewTemplate: false
            });    
        }
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
    render(){
        return(
          <main className="wrapper-container">
            <PageTitle title="SMS Templates" description="Welcome to SMS Templates"/>
                <div className="card-custom flex flex-direction--row flex-wrap pad--half">
                    <h4 className="ui header">SMS Templates</h4>
                    <div className="senderId-action--wrapper margin-left--auto">
                      <button onClick={() => this.toggleAction(0,'new')} className="btn btn-fill btn-success margin-left--auto">New Template</button>
                    </div>
                </div>

                <section className="card-custom pad">
                  <div className="margin-top margin-btm">
                    <Pagination
                        getData={this.getAllPages.bind(this)}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.templates}
                        loader={this.state.loader} 
                        />
                  </div>
                  <TemplatesTable 
                    templates={this.state.templates}
                    loadingData={this.state.loadingData}
                    toggleAction={this.toggleAction.bind(this)}/>
                  <Pagination
                      getData={this.getAllPages.bind(this)}
                      start={this.state.start}
                      hasNext={this.state.hasNext}
                      data={this.state.templates}
                      loader={this.state.loader} 
                  />
                </section>            
            {this.state.openActionCreateTemplate &&
              <Popup title={'Create New Template'} togglePopup={this.closeAction.bind(this)} >
                <CreateTemplate
                  submitCta={"Save"}
                  submitTemplateLoader={this.state.submitTemplateLoader}
                  submitData={this.submitTemplate.bind(this)}
                  formControls={this.state.formControls}
                  changeHandler={this.changeHandler.bind(this)}
                  senderIds={this.state.senderIds}
                  togglePopup={this.closeAction.bind(this)}>
                </CreateTemplate>
              </Popup>
            }
            {
                this.state.openActionEditTemplate &&
                <Popup title={'Edit Template'} togglePopup={this.closeAction.bind(this)}>
                    <CreateTemplate
                        formControls={this.state.formControls}
                        submitCta={'Save Changes'}
                        submitTemplateLoader={this.state.submitTemplateLoader}
                        submitData={this.editTemplate.bind(this)}
                        changeHandler={this.changeHandler.bind(this)}
                        senderIds={this.state.senderIds}
                        togglePopup={this.closeAction.bind(this)}>
                    </CreateTemplate> 
                </Popup>
            }
            {
                this.state.openActionViewTemplate &&
                <Popup title={this.state.title} togglePopup={this.closeAction.bind(this)}>
                    <section>
                        <div className="pad">{this.state.body}</div>
                        <div className="dialog-footer pad">   
                            <div>
                                <button className="anchor-btn dialog--cta pointer" onClick={()=>this.closeAction()}>
                                        Back
                                </button>                    
                            </div>
                        </div>     
                    </section>
                </Popup>
            } 
            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
          </main>
        );
    }
}