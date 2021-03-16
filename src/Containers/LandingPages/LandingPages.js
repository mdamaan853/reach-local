import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import LandingPagesTable from './LandingPagesTable';
import Popup from '../../Components/Popup/Popup';
import CreateMapping from './CreateMapping';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {getAllLandingPages,addLandingPages} from '../../Services/landingPage-service';
import Pagination from '../../Components/Pagination/Pagination';
import {getclients} from '../../Services/datasource-service';
//import {getSelectSegment} from '../../Services/datasource-service';
export default class LandingPages extends Component{
    constructor(props){
        super(props);
        this.state = {   
            start: 0,    
            pageList: [],
            clients: [],
            openPopup: false,
            submitCta: 'Save',
            actions:["eye","delete"],
            formControls:{
                client:{
                    value:"",
                    error:""
                },
                campaignId:{
                    value:"",
                    error:""
                },
                url:{
                    value:"",
                    error:""
                }
            },
            loader: false,
            hasNext:true,
            confirmationModal: false,
            saveLoader:false,  
            confirmationLoader: false,
            indexToDelete: null,
        }
    }
    componentDidMount(){
      this.fetchAllPage();
      this.fetchClients();
    }

    getPages(type){
      if(type === 'previous'){
          if(this.state.start > 0){
              this.setState({
                  start: this.state.start - 30,
              },()=>{
                  this.fetchAllPage();
              })
          }
      }else if(type === 'next'){
          if(this.state.hasNext){
              this.setState({
                  start: this.state.start + 30,
              },()=>{
                  this.fetchAllPage();
              })
          }
      }
    }

    fetchAllPage(){
      let body = {
        start: this.state.start,
        maxResults: 30
      };
      getAllLandingPages(body)
        .then(response => response.json())
        .then(data=>{
        //let data = { "success": true, "message": "Success", "allowedActions": [], "dtos": [ { "ccId": 1, "name": "qwerty", "email": null, "campaignId": "cc123", "landingPage": "lanfing-page", allowedSubActions: ["all"] } ] }
            if (data.success && data.dtos && data.dtos.length > 0){
                this.setState({
                    pageList: data.dtos,
                    hasNext: (data.dtos.length === 30)        
                });
            }else{
              this.setState({
                  hasNext: false
              })
            }  
        })
        .catch(error => {
          console.log(error);
        })
    }
    fetchClients(){
        let body = {}
        getclients(body)
        .then(response => response.json())
        .then(data => {
          //let data = { "success": true, "message": "Success", "allowedActions": [], "clients": [ { "uid": "70005000401", "name": "qwerty" }, { "uid": "70005000568", "name": "qweqweq" }, { "uid": "70002000610", "name": "213213213" }, { "uid": "70005000789", "name": "213123" }, { "uid": "70007000859", "name": "123123123" }, { "uid": "70006000948", "name": "qweqwe" }, { "uid": "70009001083", "name": "wrewerwer" } ] };
          if (data.success) { 
            this.setState({
              clients: this.formatClientData(data.clients), 
            })
          }
        })
        .catch(error => {
            console.log(error);
        })
    }
    formatClientData(data){
        let clients = [];
        if(data && data.length>0){
            data.forEach((item) => {
                let obj = {
                    "value": item.uid, 
                    "label": item.name 
                }
                clients.push(obj);
            })
        }
        return clients;
    }
    togglePopup() {
      this.setState({
        openPopup: !this.state.openPopup
      });
    }
    createNewMapping(){
      let data = this.state.formControls;
      if(!data.client.value){
          data.client.error = "Please choose client";
          this.setState({
            formControls: data
          })
        return;
      }else{
          data.client.error = "";
          this.setState({
            formControls: data
          })
      }
      if(!data.campaignId.value){
        data.campaignId.error = "Please enter a valid Campaign Id";
        this.setState({
            formControls: data
        })
        return;
      }else{
        data.campaignId.error = "";
        this.setState({
            formControls: data
        })
      }
     if(!data.url.value){
        data.url.error = "Please enter a valid Url";
        this.setState({
            formControls: data
        })
        return;
     }else{
        data.url.error = "";
        this.setState({
            formControls: data
        })
    }  
      this.setState({
        saveLoader:true
      })
      let body = {
        "ccId" : null,
        "campaignId" : data.campaignId.value,
        "buid" : data.client.value.value,
        "landingPage" : data.url.value
      }
      addLandingPages(body)
      .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.success) {
            this.togglePopup();
            this.fetchAllPage();
            ToastsStore.success("Landing Page mapped Successfully !");
          } else {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
          }
          this.setState({
            saveLoader: false
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            saveLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    tableAction(index,action){
      if(action === "delete"){
        this.setState({
            indexToDelete: index,
            confirmationModal: true
        })
      }else if (action === "eye"){
        
      }
    }
    deleteMapping(){
        this.setState({
            confirmationLoader:true
          })
          let data = this.state.pageList[this.state.indexToDelete];
          let body = {
            "ilccId" : data.ilccId,
            "remove" : true,
          }
          addLandingPages(body)
          .then(response => response.json())
            .then(data => {
              if (data.success) {
                this.closeAction();
                this.fetchAllPage();
                ToastsStore.success("Landing Page removed Successfully !");
              } else {
                ToastsStore.error("Something went wrong, Please Try Again Later ");
              }
              this.setState({
                confirmationLoader: false
              });
            }).catch(error => {
              console.log(error);
              this.setState({
                confirmationLoader: false
              });
              ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
    }
    closeAction(){
      if(this.state.confirmationModal){
        this.setState({
            confirmationModal:false
        })
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
    handleChange = val => {
        const name = 'client';
        const value = val;
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
            <PageTitle title="Landing Pages" description="Welcome to Landing Pages"/>
              <div className="card-custom flex flex-direction--row flex-wrap pad--half">
                <div className="section-title">Landing Pages</div>
                <section className="margin-left--auto margin-right--quar">
                    <div className="senderId-action--wrapper">
                    <button onClick={() => this.togglePopup()} className="btn btn-fill btn-success margin-left--auto">Create New</button>
                    </div>
                </section>
              </div>
              <section className="card-custom pad">
              <div className="margin-top">
                  <Pagination
                      getData={this.getPages.bind(this)}
                      start={this.state.start}
                      hasNext={this.state.hasNext}
                      data={this.state.pageList}
                      loader={this.state.loader} 
                      />
                  </div>
                  <LandingPagesTable 
                    pageList={this.state.pageList}
                    tableAction={this.tableAction.bind(this)}
                    actions={this.state.actions}/>
                  <Pagination
                      getData={this.getPages.bind(this)}
                      start={this.state.start}
                      hasNext={this.state.hasNext}
                      data={this.state.pageList}
                      loader={this.state.loader} 
                  />
              </section>
            { this.state.openPopup &&
              <Popup title={'Create New Landing Page'} togglePopup={this.togglePopup.bind(this)} >
                <CreateMapping
                  clients={this.state.clients}
                  handleChange={this.handleChange.bind(this)}
                  changeHandler={this.changeHandler.bind(this)}
                  submitData={this.createNewMapping.bind(this)}
                  formControls={this.state.formControls}
                  saveLoader={this.state.saveLoader}
                  submitCta={"Save"}
                  togglePopup={this.togglePopup.bind(this)}>
                </CreateMapping>
              </Popup>
            }
            {
                this.state.confirmationModal &&
                <Popup title={''} togglePopup={this.closeAction.bind(this)}>
                    <ConfirmationModal
                        submitCta={"Confirm"}
                        confirmationString={"Are you sure you want to Delete this Mapping"}
                        confirmationLoader={this.state.confirmationLoader}
                        submitData={this.deleteMapping.bind(this)}
                        togglePopup={this.closeAction.bind(this)}>
                    </ConfirmationModal> 
                </Popup>
              }
            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
          </main>
        );
    }
}