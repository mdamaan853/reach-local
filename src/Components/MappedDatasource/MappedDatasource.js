import React, { Component } from 'react';
import SvgIcon from '../Svg-icon/Svg-icon';
import Popup from '../../Components/Popup/Popup';
import utils from '../../Services/utility-service';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import {getAudienceMediumMapping,getDatasource,addUpdateAudienceMediumMapping} from '../../Services/datasource-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {Link} from 'react-router-dom';


const initialState = {
    mediumId:"",
    mediumName:"",
    dataSources:[],
    mappedDataSources:[],
    actions: ["delete"],
    addDataSourceLoader:false,
    confirmationLoader:false,
    itemToremove:null
}

export default class MappedDatasource extends Component{
  constructor(props){
      super(props);
      this.state = initialState;
  }
  componentDidMount() {
    let mediumIdt = window.location.search.split("=")[1].split(",")[0];
    let mediumNamet = window.location.search.split("=")[1].split(",")[1];
    if(mediumIdt && mediumIdt.length>0 && mediumNamet && mediumNamet.length>0){
      this.setState({
        mediumId: mediumIdt,
        mediumName: mediumNamet 
      },()=>this.fetchAudienceMediumMapping())
    }
    this.fetchAllDatasources();
  }
  fetchAudienceMediumMapping(){
    let body = {
      mediumId: parseInt(this.state.mediumId)
    }
    getAudienceMediumMapping(body)
    .then(response => response.json())
    .then(data => {
      //let data = { "success": true, "message": "Success", "allowedActions": [ "all" ], "audienceGroups": [ { "agId": 14, "ammId": 5, "bamId": 1, "name": "new-datas-1", "price": 500, "minCreditToBuy": 1, "source": null, "createdBy": 7, "allowedSubActions": [ "all" ] }, { "agId": 13, "ammId": 4, "bamId": null, "name": "new-datas", "price": 100, "minCreditToBuy": 1, "source": "AMM", "createdBy": 5, "allowedSubActions": [] } ] };
      if (data.success) { 
        this.setState({
          mappedDataSources: data.audienceGroups, 
        })
      }
    })
    .catch(error => {
      console.log(error);
    })
  }
  fetchAllDatasources(){
   let body = {
      "start" : 0,
      "maxResults" : 50
    };
    getDatasource(body)
    .then(response => response.json())
    .then(data => {
      //let data = { "success": true, "message": "Success", "allowedActions": [], "audienceMediumMapping": [ { "agId": 13, "bamId": null, "ammId": 4, "mediumName": "SMS", "agName": "new-datas", "sgName": null, "pricePerCredit": 100, "minCreditPerCampaign": 1, "minCreditToBuy": 1, "billingOn": null, "status": "Active", "createdBy": 5, "mediumId": 1 }, { "agId": 16, "bamId": null, "ammId": 9, "mediumName": "SMS", "agName": "testing-DS-1", "sgName": null, "pricePerCredit": 200, "minCreditPerCampaign": 10, "minCreditToBuy": 10, "billingOn": "SENT", "status": "active", "createdBy": 7, "mediumId": 1 } ] };
      if (data.success) { 
        this.setState({
          dataSources: data.audienceGroupDetails, 
        })
      }
    })
    .catch(error => {
      console.log(error);
    })
  }
  addNewDatasource(){
    if(!document.getElementById("datasources").value){
      ToastsStore.error("Please Choose Datasource");
    }
    let val = document.getElementById("datasources").value.split(",");
    let body = {
      "audienceGroupId" : val[0],
      "pricePerCredit" : val[1],
      "minCreditToBuy" : val[2],
      "mediumId" : this.state.mediumId,
      "minCampaignCount" :val[3],
      "status" : val[4],
      "billingType" : val[5],
      "remove": false
    }
    this.setState({
      addDataSourceLoader: true
    })
    addUpdateAudienceMediumMapping(body)
    .then(response => response.json())
    .then(data => {
        ToastsStore.success(data.message);
        this.setState({
          addDataSourceLoader: false
        })
        this.fetchAudienceMediumMapping();
    })
    .catch(error => {
      this.setState({
        addDataSourceLoader: false
      })
      console.log(error);
    })
  }
  deleteDatasourceMapping(){
    this.setState({
      confirmationLoader:true
    })
    let body = {
      "audienceGroupId" : this.state.itemToremove.agId,
      "audienceMediumMappingId": this.state.itemToremove.ammId,
      "pricePerCredit" : this.state.itemToremove.pricePerCredit,
      "minCreditToBuy" : this.state.itemToremove.minCreditToBuy,
      "mediumId" : this.state.mediumId,
      "minCampaignCount" : this.state.itemToremove.minCreditPerCampaign,
      "status" : this.state.itemToremove.status,
      "billingType" : this.state.itemToremove.billingOn,
      "remove": true
    }
    addUpdateAudienceMediumMapping(body)
    .then(response => response.json())
    .then(data => {
        if(data.success){
          this.closeAction();
          this.fetchAudienceMediumMapping();
        }
        ToastsStore.success(data.message);
        this.setState({
          confirmationLoader: false
        })
    })
    .catch(error => {
      this.setState({
        confirmationLoader: false
      })
      console.log(error);
    })
  }
  toggleAction(index,action){
    if(action === "delete"){
      this.setState({
        itemToremove : this.state.mappedDataSources[index],
        confirmationModal:true
      })
    }
  }
  closeAction(){
    this.setState({
      confirmationModal:false
    })
  }
  render(){
      return(
        <main className="sender-id--wrapper">
            <div className="section-title">Medium: {this.state.mediumName}, Mapped Datasources:</div>
               <section className="margin-btm--half margin-top flex flex-wrap">
                  <div className="senderId-action--wrapper margin-btm margin-top col-1">
                      <Link to="/mediums"><button className="btn btn-fill btn-success">Back</button></Link>
                  </div>
                  {/* <div className="col-9 margin-left--auto margin-top">
                      <select id="datasources" className="form-control">
                          <option hidden value="">Choose</option>
                          {
                            this.state.dataSources.map((item,index)=>{
                              return(
                                <option key={index} value={item.agId+","+item.pricePerCredit+","+item.minCreditToBuy+","+item.minCreditPerCampaign+","+item.status+","+item.billingOn}>{item.agName}</option>
                              )
                            })
                          }
                      </select>
                  </div>
                  <div className="senderId-action--wrapper margin-btm margin-top">
                      {
                        this.state.addDataSourceLoader &&
                        <div>
                              <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                        </div>
                      }
                      {
                        !this.state.addDataSourceLoader && 
                        <button onClick={()=>this.addNewDatasource()} className="btn btn-fill btn-success margin-left--auto">Add</button>
                      }
                  </div> */}
               </section>
               <section className="card-custom leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>           
                <table className="client">
                    <tbody>
                        <tr>
                            <th>Datasource Name</th>
                            <th>Price Per Credit</th>
                            <th>Min Credit To Buy</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                         {    
                            this.state.mappedDataSources.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.minCreditToBuy}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        { 
                                            item.allowedSubActions[0] === "all" &&
                                            this.state.actions.map((item,subIndex) => {
                                                return(
                                                    <span key={subIndex} className="margin-left pointer" onClick={() => this.toggleAction(index,item)}><SvgIcon icon={item} classes={'svg--lg'}></SvgIcon></span>
                                                );
                                            })
                                        } 
                                    </td>                                   
                                </tr>                                                            
                                );                               
                             }) 
                         } 
                    </tbody>
                </table>
              </section> 
              {
                this.state.confirmationModal &&
                <Popup title={''} togglePopup={this.closeAction.bind(this)}>
                    <ConfirmationModal
                        submitCta={"Confirm"}
                        confirmationString={"Are you sure you want to remove this Datasource"}
                        confirmationLoader={this.state.confirmationLoader}
                        submitData={this.deleteDatasourceMapping.bind(this)}
                        togglePopup={this.closeAction.bind(this)}>
                    </ConfirmationModal> 
                </Popup>
              }
              <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
          </main>
      );
  }
};