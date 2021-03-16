import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet'; 
import DatasourceTable from '../../Components/Datasource/DatasourceTable';
import Popup from '../../Components/Popup/Popup';
import CreateDatasource from '../../Components/Datasource/CreateDatasource';
import { getDatasource, createEditDatasource} from '../../Services/datasource-service';
import { getMediums } from '../../Services/medium-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import utils from '../../Services/utility-service';
import Youtube from '../../Components/Youtube/Youtube';
import {fetchRoles} from '../../Services/roles-service';
import Pagination from '../../Components/Pagination/Pagination';

export default class Datasource extends Component{
    constructor(){
      super();
        this.state = {       
          datasources:[],
          howTo:false,
          openPopup: false,
          submitCta: 'Submit', 
          submitIdLoader: false,
          tableDataLoader: true, 
          start:0,
          mediums:[],
          saveDataSourceLoader:false,
          openEditDatasource:false,
          rolesFetched:false,
          accessDenied:false,
          loader: false,
          hasNext:true,
          error:"",
          formControls:{
            mediumName:{
              value:""
            },
            datasourceName:{
              value:""
            },
            billingOn:{
              value:""
            },
            pricePrCrdt:{
              value:""
            },
            minCrdtCampgn:{
              value:""
            },
            minCrdtToBut:{
              value:""
            },
            vendorEmail:{
              value:""
            },
            phoneNumber:{
              value:""
            },
            status:{
              value:""
            },
            ammId:{
              value:""
            },
            bamId:{
              value:""
            },
            source:{
              value:""
            },
            bct:{
              value:""
            },
            sType:{
              value:""
            },
            cos:{
              value:""
            },
            mp:{
              value:""
            }
          }
        }  
    }
    componentDidMount() {
      if(utils.isAdmin){
        this.fetchDatasources(); 
        this.fetchMediums();
      }else{
        this.getRequiredRoles();
      }
    }
    getRequiredRoles(){
        fetchRoles('Datasource')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length){
                utils.roles = data.subRoles;
                this.fetchDatasources(); 
                this.fetchMediums();
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
    togglePopup() {
      this.setState({
        openPopup: !this.state.openPopup
      });
    }
    openPopupC(){
      let temp1 = this.state.formControls;
      temp1.mediumName.value = "";
      temp1.datasourceName.value = "";
      temp1.billingOn.value = "";
      temp1.pricePrCrdt.value = ""; 
      temp1.minCrdtCampgn.value = "";
      temp1.minCrdtToBut.value = 0;
      temp1.vendorEmail.value = "";
      temp1.phoneNumber.value = "";
      temp1.status.value = "";
      temp1.ammId.value = "";
      temp1.bamId.value = "";
      temp1.source.value = "";
      temp1.bct.value = "";
      temp1.sType.value = "";
      temp1.cos.value = "";
      temp1.mp.value = "";
      this.setState({
        openPopup: !this.state.openPopup,
        formControls: temp1
      });
    }
    closeAction(){
      if(this.state.openPopup){
        this.setState({
          openPopup:false
        })
      }else if(this.state.openEditDatasource){
        this.setState({
          openEditDatasource:false
        })
      }
    }
    showVideo(){
      this.setState({
          howTo: !this.state.howTo
      })
    }
    fetchMediums() {
      let body = {}
      getMediums(body)
        .then(response => response.json())
        .then(data => {
        if (data.success) { 
            this.setState({
              mediums: data.mediumList, 
            })
          }
        })
        .catch(error => {
        console.log(error);
        })
    }
    fetchDatasources(){
      let body = {
        "start" : this.state.start,
        "maxResults" : 200
      }
      this.setState({
        rolesFetched: true,
        loader: true
      });
      getDatasource(body)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if(data.audienceGroupDetails && data.audienceGroupDetails.length > 0){
              this.setState({
                  datasources: data.audienceGroupDetails,
                  hasNext: (data.audienceGroupDetails.length === 200)
              })
          }else{
              ToastsStore.error("No Datasource Found");
              this.setState({
                  hasNext: false
              })
          }
        }else{
          ToastsStore.error(data.message);
        }
        this.setState({
            loader: false
        })
      })
      .catch(error => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
        this.setState({
            loader: false
        })
      })
    }
    createNewDataSource(){
      let data = this.state.formControls;
      if(!data.mediumName.value){
        ToastsStore.error("Please Select Medium");
      }
      if(!data.minCrdtCampgn.value){
        ToastsStore.error("Please provide Min Credits Per Campaign Value.");
        return;
      }
      if(!this.validate()){
        return;
      }
      this.setState({
        saveDataSourceLoader:true
      })
      let body = {
        "mediumId" : data.mediumName.value,
        "agName" : data.datasourceName.value,
        "billingOn" : data.billingOn.value,
        "price" : data.pricePrCrdt.value,
        "minCreditPerCampaign" : data.minCrdtCampgn.value,
        "minCreditToBuy" : 0,
        "vendorEmail" : data.vendorEmail.value,
        "phoneNumber" : data.phoneNumber.value,
        "ammId" : null,
        "bamId" : null,
        "source" : null,
        "status" : data.status.value,
        "billingCreditType": data.bct.value,
        "sharingType": data.sType.value,
        "costOrShare": data.cos.value,
        "minPrice": data.mp.value
      }
      createEditDatasource(body)
      .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.closeAction();
            this.fetchDatasources();
            ToastsStore.success("Datasource created Successfully !");
          } else {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
          }
          this.setState({
            saveDataSourceLoader: false
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            saveDataSourceLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    tableAction(index,action){     
      let data = this.state.datasources[index];
      if(action === "database-edit"){
          this.populateFormControls(data);
          this.setState({
            openEditDatasource:true
          })
      }else if(action === "account-plus"){
          localStorage.setItem("datasource",JSON.stringify(data));
          this.props.history.push("/mapped-clients");
      }else if(action === "funnel"){
          localStorage.setItem("datasource",JSON.stringify(data));
          this.props.history.push("/mapped-segments");
      }
    }
    populateFormControls(data){    
      let temp1 = this.state.formControls;
      temp1.mediumName.value = data.mediumId;
      temp1.datasourceName.value = data.agName;
      temp1.billingOn.value = data.billingOn;
      temp1.pricePrCrdt.value = data.pricePerCredit; 
      temp1.minCrdtCampgn.value = data.minCreditPerCampaign;
      temp1.minCrdtToBut.value = data.minCreditToBuy;
      temp1.vendorEmail.value = "";
      temp1.phoneNumber.value = "";
      temp1.status.value = data.status;
      temp1.ammId.value = data.ammId;
      temp1.bamId.value = data.bamId;
      temp1.source.value = data.source;
      temp1.bct.value = data.billingCreditType;
      temp1.sType.value = data.sharingType;
      temp1.cos.value = data.costOrShare;
      temp1.mp.value = data.minPrice;
      this.setState({
        formControls:temp1
      })
    }
    editDataSource(){
      if(!this.validate()){
        return;
      }
      let data = this.state.formControls;
      if(!data.minCrdtCampgn.value){
        ToastsStore.error("Please provide Min Credits Per Campaign Value.");
        return;
      }
      this.setState({
        saveDataSourceLoader:true
      })
      let body = {
        "mediumId" : data.mediumName.value,
        "agName" : data.datasourceName.value,
        "billingOn" : data.billingOn.value,
        "price" : data.pricePrCrdt.value,
        "minCreditPerCampaign" : data.minCrdtCampgn.value,
        "minCreditToBuy" : 0,
        "vendorEmail" : data.vendorEmail.value,
        "phoneNumber" : data.phoneNumber.value,
        "ammId" : data.ammId.value,
        "bamId" : data.bamId.value,
        "source" : data.source.value,
        "status" : data.status.value,
        "billingCreditType": data.bct.value,
        "sharingType": data.sType.value,
        "costOrShare": data.cos.value,
        "minPrice": data.mp.value
      }
      createEditDatasource(body)
      .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.closeAction();
            this.fetchDatasources();
            ToastsStore.success("Datasource Edited Successfully !");
          } else {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
          }
          this.setState({
            saveDataSourceLoader: false
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            saveDataSourceLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
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
    
    getAccessibleTableActions(){
      let temp = [];
      if(utils.hasRole('datasource_map_client')){
        temp.push('map-B-AG');
        temp.push('unmap-B-AG');
      }
      if(utils.hasRole('datasource_map_sgmnt')){
        temp.push('map-S-AG');
      }
      if(utils.hasRole('datasource_edit')){
        temp.push('edit-AG');
      }
      return temp;
    }

    navDatasources(type){
      if(type === 'previous'){
          if(this.state.start > 0){
            this.setState({
                start: this.state.start - 200,
            },()=>{
                this.fetchDatasources();
            })
          }
      }else if(type === 'next'){
          if(this.state.hasNext){
              this.setState({
                  start: this.state.start + 200,
              },()=>{
                  this.fetchDatasources();
              })
          }
      }
    }

    validate(){
      let isValid = true;
      let data = this.state.formControls;
      if(!data.pricePrCrdt.value || !data.mp.value || !data.cos.value){
        this.setState({
          error: "Please Provide Pricing Details."
        })
        return false;
      }
      if(!data.sType.value){
        this.setState({
          error: "Please Provide Sharing Type."
        })
        return false;
      }
      if(data.pricePrCrdt.value < data.mp.value){
        this.setState({
          error: "Price cannot be less than Minimum Price."
        })
        return false;
      }
      if(data.sType.value === 'C2B'){
        if(data.mp.value < data.cos.value){
          this.setState({
            error: "Minimum Price cannot be less than Cost Or Share."
          })
          return false;
        }
      }else{
        if(data.cos.value < 0 || data.cos.value > 100){
          this.setState({
            error: "Invalid Cost Or Share Value."
          })
          return false;
        }
        if(data.mp.value < (data.mp.value - (data.mp.value*data.cos.value*0.01)) ){
          this.setState({
            error: "Minimum Price cannot be less than Cost Or Share."
          })
          return false;
        }
      }
      this.setState({
        error: ""
      })
      return isValid;
    }

    render(){
        return(
          <React.Fragment>
            <PageTitle title="Datasource" description="Welcome to Datasource"/>
          {
            this.state.rolesFetched &&
            <main className="wrapper-container">
              <div style={{textAlign:'left'}}>
                    <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                    <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>{this.showVideo()}}>Understanding Datasource and Agency Revenue Model</span>
                </div>
                {
                    this.state.howTo && 
                    <Popup title={'Understanding Datasource and Agency Revenue Model'} togglePopup={this.showVideo.bind(this)}>
                        <Youtube url={'44vXPuieh18'}/>
                    </Popup>
                }
                <div className="card-custom flex flex-direction--row flex-wrap pad--half">
                    <h4 className="ui header">Datasource</h4>
                    <section className="margin-left--auto margin-right--quar">
                        {
                            utils.hasRole('datasource_create') && this.props.userType !=="AGENCY" &&
                            <div className="senderId-action--wrapper">
                              <button onClick={() => this.openPopupC()} className="btn btn-fill btn-success margin-left--auto">New Datasource</button>
                            </div>
                        }
                    </section>
                </div>
               
                <section className="card-custom pad">
                {
                  !utils.isMobile && 
                  <div className="margin-top">
                    <Pagination
                        getData={this.navDatasources.bind(this)}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.datasources}
                        loader={this.state.loader} 
                    />
                  </div>
                }
                  
                  <DatasourceTable 
                    datasources={this.state.datasources}
                    source={'Agency'}
                    allowedSubActions={this.getAccessibleTableActions()}
                    userType={this.props.userType}
                    tableAction={this.tableAction.bind(this)}/>  
                  <Pagination
                      getData={this.navDatasources.bind(this)}
                      start={this.state.start}
                      hasNext={this.state.hasNext}
                      data={this.state.datasources}
                      loader={this.state.loader} 
                  />
                </section>
                { this.state.openPopup &&
                  <Popup title={'Create New Datasource'} togglePopup={this.closeAction.bind(this)} maxWidth="600px" >
                    <CreateDatasource
                      togglePopup={this.closeAction.bind(this)}
                      mediums={this.state.mediums}
                      submitCta={"Save"}
                      saveDataSourceLoader={this.state.saveDataSourceLoader}
                      submitData={this.createNewDataSource.bind(this)}
                      changeHandler={this.changeHandler.bind(this)}
                      error={this.state.error}
                      formControls={this.state.formControls}>
                    </CreateDatasource>
                  </Popup>
                }
                {
                    this.state.openEditDatasource && 
                        <Popup title="Edit Datasource" togglePopup = {this.closeAction.bind(this)}>
                            <CreateDatasource
                                togglePopup={this.closeAction.bind(this)}
                                mediums={this.state.mediums}
                                submitCta={"Save"}
                                saveDataSourceLoader={this.state.saveDataSourceLoader}
                                submitData={this.editDataSource.bind(this)}
                                changeHandler={this.changeHandler.bind(this)}
                                error={this.state.error}
                                formControls={this.state.formControls}>
                            </CreateDatasource>
                        </Popup>
                }
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
            </main>
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
          </React.Fragment>
        );
    }
}
