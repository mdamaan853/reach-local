import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet'; 
import SenderTable from '../../Components/SenderTable/SenderTable';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import { getSenderIds, submitSenderIds, getAcceptStatus,getRejectStatus,getDeleteStatus } from '../../Services/senderId-service';
import { getMediums } from '../../Services/medium-service';
import { getAudienceMediumMapping } from '../../Services/datasource-service';
import NewSenderId from '../../Components/ModalSenderId/NewSenderId';
import PopUp from '../../Components/Popup/Popup';
import utils from '../../Services/utility-service';
import {fetchRoles} from '../../Services/roles-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import './SenderIds.css';
import { Icon, Popup } from 'semantic-ui-react';
import path from '../../Constants/img/sender-id-img.png';
import Pagination from '../../Components/Pagination/Pagination';
import Youtube from '../../Components/Youtube/Youtube';

const initialState = {
  senderDTO: [],
  datasources: [],
  submitCta: 'Save',
  openPopup: false,
  rolesFetched:false,
  accessDenied:false,
  submitIdLoader: false,
  tableDataLoader: true,
  id:'',
  start: 0,
  loader: false,
  hasNext:true,
  error:'',
  howTo: false
}

class SenderIds extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.actionHandler =  this.actionHandler.bind(this);
  }
  componentDidMount() {
    if(utils.isAdmin){
      this.fetchSenderIds();
      this.getAllMedium();
    }else{
      this.getRequiredRoles();
    }
  }
  getRequiredRoles(){
    fetchRoles('SenderIds')
    .then(response => response.json())
    .then(data =>{
        if(data.success && data.subRoles && data.subRoles.length>0){
            utils.roles = data.subRoles;
            this.fetchSenderIds();
            this.getAllMedium();
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
  getAllMedium(){
    let body = {};
    getMediums(body)
    .then(response => response.json())
    .then(data => {
        if (data.success && data.mediumList && data.mediumList.length > 0) {
          data.mediumList.forEach((item) => {
            if(item.name === 'SMS'){
                this.fetchDatasourcesByMedium(item.id)
            }
          }) 
        }
    })
    .catch(error => {
    console.log(error);
    })
  }

  fetchDatasourcesByMedium(id){
    let body = {
      mediumId: id
    }
    getAudienceMediumMapping(body)
    .then(response => response.json())
    .then(data => {
        if (data.success) { 
          this.setState({
             datasources: data.audienceGroups, 
          })
        }
    })
    .catch(error => {
    console.log(error);
    })
  }

  actionHandler(action,id){
    
    if(action === "accept"){
      this.fetchAcceptStatus(id);
    }
    if(action === "reject"){
      this.fetchRejectStatus(id);
    }
    if(action === "delete"){
      this.fetchDeleteStatus(id);
    }
  }

  fetchDeleteStatus(itemId){
    const body={
      senderId:itemId
    }
    
    getDeleteStatus(body)
    .then(response=>response.json())
    .then(data=>{
      if(data.success){
        ToastsStore.success(data.message);
        this.fetchSenderIds();
      }
      else{
        ToastsStore.error(data.message);
      }
    })
    .catch(error=>{console.log("ERROR");} )      
  }

  fetchRejectStatus(id){ 
    const body={
      senderId:id
    }
    getRejectStatus(body)
    .then(response=>response.json())
    .then(data=>{
      if(data.success){
        ToastsStore.success(data.message);
        this.fetchSenderIds();
      }
      else{
        ToastsStore.error(data.message);
        // console.log("not successful");
      }
    })
    .catch(error=>{
      console.log("ERROR");
    })   
    }
    
  fetchAcceptStatus(id){
    const body={
      senderId:id
    }
    getAcceptStatus(body) 
    .then(response=>response.json())
    .then(data=>{
      if(data.success){
        // console.log(data);
        ToastsStore.success(data.message);
        this.fetchSenderIds();
      }
      else{
        ToastsStore.error(data.message);
      }
    })
    .catch(error=>{
      console.log("Error");
    })
  }

  fetchSenderIds() {
    this.setState({
      rolesFetched: true,
      loader: true
    })
    let body = {
      start: this.state.start,
      maxResults: 30,
    }
    getSenderIds(body)
      .then(response => response.json())
      .then(data => {
        if(data.success){
          if(data.senderIds && data.senderIds.length > 0){
              this.setState({
                  senderDTO: data.senderIds,
                  hasNext: (data.senderIds.length === 30)
              })
          }else{
             // ToastsStore.error("No Sender Ids Found");
              this.setState({
                  hasNext: false
              })
          }
        } else {
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
  togglePopup() {
    this.setState({
      openPopup: !this.state.openPopup
    })
  }
  submitSenderId(data) {
    
    if(!data.senderCode.value || (data.senderCode.value && data.senderCode.value.length !== 6)){
      this.setState({
        error: "Sender Code has to be of 6 Characters"
      })    
      return;
    }else{
      this.setState({
        error: ""
      })
    }
    const body = {
      // ammId: data.datasource.value.split(",")[0] !== 'null' ? data.datasource.value.split(",")[0] : null,
	    // bamId: data.datasource.value.split(",")[1] !== 'null' ? data.datasource.value.split(",")[1] : null,
      mediumId: 1,
      sampleMessage: data.sampleMessage.value,
      senderCode: data.senderCode.value
    }
    this.setState({
      submitIdLoader: true
    })
    submitSenderIds(body)
      .then(response => response.json())
      .then(data => {
        this.setState({
          submitIdLoader: false
        })
        if (data.success) {
          this.togglePopup();
          this.fetchSenderIds();
          ToastsStore.success("Sender Id Submitted Successfully !");
        } else {
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        }
      }).catch(error => {
        console.log(error);
        this.setState({
          submitIdLoader: false
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      })
  }

  navSenderIds(type){
    if(type === 'previous'){
        if(this.state.start > 0){
          this.setState({
              start: this.state.start - 30,
          },()=>{
              this.fetchSenderIds();
          })
        }
    }else if(type === 'next'){
        if(this.state.hasNext){
            this.setState({
                start: this.state.start + 30,
            },()=>{
                this.fetchSenderIds();
            })
        }
    }
  }

  showVideo(){
    this.setState({
        howTo: !this.state.howTo
    })
}
  
  render() {
  const style = {
    borderRadius: 0,
    opacity: 0.85,
    padding: '1em',
  }
    return (
      <React.Fragment>
        <PageTitle title="Sender Ids" description="Welcome to Sender Ids"/>
        {
          this.state.rolesFetched &&
          <main className="wrapper-container">
            <div style={{textAlign:'end'}}>
                <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'end'}} onClick={()=>{this.showVideo()}}>How to Create a New Sender Id ?</span>
            </div>
            {
                this.state.howTo && 
                <PopUp title={'How to Create a New Sender Id ?'} togglePopup={this.showVideo.bind(this)}>
                    <Youtube url={'-AIxbK0sZ0s'}/>
                </PopUp>
            }
            <div className="card-custom flex flex-direction--row flex-wrap pad--half">
              <div>
              <div className="section-title">Sender IDs&nbsp;
                  <Popup
                          trigger={<Icon name='info circle' color="blue"/>}
                          position='right center'
                          style={style}
                          inverted
                          flowing 
                          hoverable
                  >
                  <Popup.Content>
                          <img src={path} alt="sender id sample"/>
                  </Popup.Content>
                  </Popup>
              </div>
                
                <div>
                  <SvgIcon icon="information" classes="svg--lg" ></SvgIcon>
                  <span className="margin-left--quar text-small">In case of SMS medium, you need to create a Sender ID first.</span>
                </div>
              </div>
              <section className="margin-left--auto margin-right--quar">
                {
                  utils.hasRole('sender_id_create') &&
                  <div className="senderId-action--wrapper margin-btm margin-top">
                    <button onClick={() => this.togglePopup()} className="btn btn-fill btn-success margin-left--auto">New Sender Id</button>
                  </div>
                }
              </section>
            </div>

            {
              utils.hasRole('sender_id_view') &&
              <section className="card-custom pad">
                <div className="margin-top">
                  <Pagination
                      getData={this.navSenderIds.bind(this)}
                      start={this.state.start}
                      hasNext={this.state.hasNext}
                      data={this.state.senderDTO}
                      loader={this.state.loader} 
                  />
                </div>
                <SenderTable
                  senderDTO={this.state.senderDTO} 
                  actionHandler={this.actionHandler}/>  
                <section className="margin-top--double pad--half sender-note" style={{fontSize:'14px'}}>
                  <div className="margin-btm--half">* It takes 2 - 4 business days to get the sender id approved.</div>
                </section>
                <Pagination
                    getData={this.navSenderIds.bind(this)}
                    start={this.state.start}
                    hasNext={this.state.hasNext}
                    data={this.state.senderDTO}
                    loader={this.state.loader} 
                />
              </section>
            }

            {this.state.openPopup &&
              <PopUp title={'New Sender Id'} togglePopup={this.togglePopup.bind(this)}>
                <NewSenderId
                  datasources={this.state.datasources}
                  submitData={this.submitSenderId.bind(this)}
                  submitCta={this.state.submitCta}
                  submitIdLoader={this.state.submitIdLoader}
                  error={this.state.error}
                  togglePopup={this.togglePopup.bind(this)}>
                </NewSenderId>
              </PopUp>
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

export default SenderIds;