import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import MediumTable from '../../Components/MediumTable/MediumTable';
import Popup from '../../Components/Popup/Popup';
import NewMedium from '../../Components/NewMedium/NewMedium';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import {getMediums,submitMediums} from '../../Services/medium-service';
import utils from '../../Services/utility-service';
import {fetchRoles} from '../../Services/roles-service';

const initialState = {
  mediums: [],
  openPopup: false,
  openActionEditMedium: false,
  mediumToEdit: null,
  submitCta: 'Submit',
  start: 0,
  submitMediumLoader: false,
  rolesFetched:false,
  accessDenied:false,
  allowedActions:[],
  formControls: {
    mediumName: {
      value: ''
    },
    shortName:{
          value:''
    },
    status: {
      value: 'active'
    },
    mediumId:{
      value:""
    }
  }    
}
export default class Mediums extends Component{
    constructor(props){
        super(props);
        this.state = initialState;
    }
    componentDidMount() {
      if(utils.isAdmin){
        this.fetchMediums();
      }else{
        this.getRequiredRoles();
      }
    }
    getRequiredRoles(){
        fetchRoles('Mediums')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length){
                utils.roles = data.subRoles;
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
    toggleAction(index,actionName){
      if(actionName==="datasource"){
        let url = "/medium/mapped-datasource?medium=" + this.state.mediums[index].id + "," + this.state.mediums[index].name;
        //window.location.href = window.location.origin + url;
        this.props.history.push(url);
      }else if(actionName==="edit"){ 
          this.setState({
              mediumToEdit: index
          },()=>this.populateMediumFromControls())
      }
    }
    fetchMediums() {
      const body = {
        start : this.state.start,
        maxResult : 20,
        all:true
      }
      this.setState({
        rolesFetched: true
      })
      if(!utils.hasRole('medium_mgmt')){
        return;
      }
      getMediums(body)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            let temp = [];
            if(utils.hasRole('medium_create')){
              temp.push('edit');
            }
            if(utils.hasRole('medium_map_datasourc')){
              temp.push('map');
            } 
            this.setState({
              mediums: data.mediumList, 
              allowedActions: temp,
            })
          }
        })
        .catch(error => {
        console.log(error);
        })
    }
    submitMediums() {
      if(!this.state.formControls.mediumName.value){
        ToastsStore.error("Medium Name Cannot be empty");
        return;
      }else if(!this.state.formControls.shortName.value){
        ToastsStore.error("Short Name Cannot be empty");
        return;
      }else if(this.state.formControls.shortName.value.length > 5){
        ToastsStore.error("Maximum 5 Characters Allowed in Short Name");
        return;
      }
      this.setState({
        submitMediumLoader: true
      });
      const body = {
        name: this.state.formControls.mediumName.value,
        status: this.state.formControls.status.value,
        code: this.state.formControls.shortName.value
      }
      if(this.state.formControls.mediumId.value){
        body.id = this.state.formControls.mediumId.value
      }
      submitMediums(body)
        .then(response => response.json())
        .then(data => {
          this.setState({
            submitMediumLoader: false
          });
          if (data.success) {
            this.closeAction();
            this.fetchMediums();
            ToastsStore.success("Medium is created Successfully !");
          } else {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
          } 
        }).catch(error => {
          console.log(error);
          this.setState({
            submitMediumLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    populateMediumFromControls(){
      let temp1 = this.state.formControls;
      temp1.mediumName.value = this.state.mediums[this.state.mediumToEdit].name;
      temp1.shortName.value = this.state.mediums[this.state.mediumToEdit].code;
      temp1.status.value = this.state.mediums[this.state.mediumToEdit].status;
      temp1.mediumId.value = this.state.mediums[this.state.mediumToEdit].id;    
      this.setState({
        formControls: temp1,
        openActionEditMedium: !this.state.openActionEditMedium,
      });
      // console.log(this.state.formControls);
    }
    clearFormControls(){
      let temp1 = this.state.formControls;
      temp1.mediumName.value = "";
      temp1.shortName.value = "";
      temp1.status.value = "";
      temp1.mediumId.value = "";
      this.setState({
        formControls: temp1
      })
    }
    closeAction(){
        if(this.state.openActionEditMedium){
          this.clearFormControls();
          this.setState({
            openActionEditMedium: false
          })
        }else if(this.state.openPopup){
          this.clearFormControls();
          this.setState({
            openPopup: false
          });    
        }  

    }
    togglePopup() {
      this.setState({
        openPopup: !this.state.openPopup
      });
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
          <React.Fragment>
            <PageTitle title="Medium" description="Welcome to Medium"/>
            {
              this.state.rolesFetched &&
              <main className="wrapper-container">
                <div className="card-custom flex flex-direction--row flex-wrap pad--half">
                <h4 className="ui header">MEDIUM</h4>
                  <section className="margin-left--auto">
                    <div className="senderId-action--wrapper margin-right--quar">
                      {
                        utils.hasRole('medium_create') &&
                        <button onClick={() => this.togglePopup()} className="btn btn-fill btn-success margin-left--auto">New Medium</button>
                      }
                    </div>
                  </section>
                </div>
                <MediumTable 
                  mediums={this.state.mediums}
                  toggleAction={this.toggleAction.bind(this)}
                  allowedActions={this.state.allowedActions}/>
                {this.state.openPopup &&
                  <Popup title={'Create New Medium'} togglePopup={this.closeAction.bind(this)} maxWidth="600px">
                    <NewMedium
                      submitCta={this.state.submitCta}
                      submitMediumLoader={this.state.submitMediumLoader}
                      submitData={this.submitMediums.bind(this)}
                      formControls={this.state.formControls}
                      changeHandler={this.changeHandler.bind(this)}
                      togglePopup={this.closeAction.bind(this)}>
                    </NewMedium>
                  </Popup>
                }
                {
                    this.state.openActionEditMedium &&
                    <Popup title={'Edit Medium'} togglePopup={this.closeAction.bind(this)}>
                        <NewMedium
                            formControls={this.state.formControls}
                            submitCta={this.state.submitCta}
                            submitMediumLoader={this.state.submitMediumLoader}
                            submitData={this.submitMediums.bind(this)}
                            changeHandler={this.changeHandler.bind(this)}
                            togglePopup={this.closeAction.bind(this)}>
                        </NewMedium> 
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