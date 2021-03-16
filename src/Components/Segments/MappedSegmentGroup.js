import React, { Component } from 'react';
import Popup from '../../Components/Popup/Popup';
import CircularLoader from '../circular-loader/circular-loader';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {Link} from 'react-router-dom';
import {getSelectSegment} from '../../Services/datasource-service';
import {mapNewSegment,getSegmentGMappingDetails} from "../../Services/segment-service";

const initialState = {
    segmentGroup:null,
    segments:[],
    mapSegmentLoader:false,
    segmentDetails:[],
    segmentGroupAsgmId:'',
    segmentGroupId:'',
    segmentGroupBasgmId:'',
    segmentName:'',
    formControls:{
        segmentId:{
            value:""
        },
        subcriptionType:{
            value:''
        },
        price:{
            value:"0"
        },
    }
}

export default class MappedSegmentGroup extends Component{
  constructor(props){
      super(props);
      this.state = initialState;
      this.returnNull = this.returnNull.bind(this);
  }
  componentDidMount() {
    let data = JSON.parse(localStorage.getItem("segmentGroup"));
    if(data){
        this.setState({
            segmentGroupId: data.sgId,
            segmentGroupAsgmId: data.asgmId,
            segmentGroupBasgmId: data.basgmId,
            segmentName: data.sgName
        },()=>{this.fetchSegmentMappingDetails();this.fetchAllSegments();})
    }else{
        ToastsStore.error("Something went wrong, Please try again later !");
    }
    
  }
  fetchAllSegments(){
    let body = {
        asgmId: this.state.segmentGroupAsgmId,
        basgmId: this.state.segmentGroupBasgmId,
        agUnmapped:true,
    };
    getSelectSegment(body)
    .then(response => response.json())
    .then(data=>{
    //let data = { "success": true, "message": "Success", "allowedActions": [ "all" ], "segmentList": [ { "id": 1, "icon": "abc", "displayTitle": "Segment-1", "type": "RNG", "name": "segment-name-1", "dataCode": null, "status": "active", "allowedSubActions": [ "all" ] }, { "id": 2, "icon": "abc", "displayTitle": "Segment-1", "type": "RNG", "name": "segment-name-1", "dataCode": null, "status": "active", "allowedSubActions": [ "all" ] } ] };  
    if (data.success){
        this.setState({
          segments: data.segmentList        
        });
      } 
    })
    .catch(error => {
      console.log(error);
    })
  }
  closeAction(){
    this.setState({
      confirmationModal:false
    })
  }
  mapNewSegmentGroup(){
    let body = {
        "segmentGroupId" : this.state.segmentGroupId,
        "segmentId" : this.state.formControls.segmentId.value,
        "subcriptionType" : this.state.formControls.subcriptionType.value,
        "price" : this.state.formControls.price.value,
        "remove" : false,
        "asgmId" : this.state.segmentGroupAsgmId,
        "basgmId": this.state.segmentGroupBasgmId
    }
    this.setState({
        mapSegmentLoader:true
    })
    mapNewSegment(body)
    .then(response => response.json())
    .then(data=>{
            //let data = { "success": true, "message": "Success", "allowedActions": [] };
            if (data.success){
                this.fetchSegmentMappingDetails();    
            }else{
                this.setState({
                    mapSegmentLoader:false
                })
            } 
            ToastsStore.success(data.message)
        })
        .catch(error => {
            this.setState({
                mapSegmentLoader:false
            })
            console.log(error);
        })
  }
  fetchSegmentMappingDetails(){
      let body = {
        asgmId : this.state.segmentGroupAsgmId
      }
      getSegmentGMappingDetails(body)
      .then(response => response.json())
        .then(data=>{
        //let data = { "success": true, "message": "Success", "allowedActions": [], "segmentDetails": [ { "segmentName": "null", "icon": "abc", "price": 500, "subscriptionType": "basic", "values": { "minValue": 0, "maxValue": 10, "segmentValuesList": [{ "id": 1, "value": "Y" }, { "id": 2, "value": "No" }] }, "segmentType": "RNG", "asmId": 1 },{ "segmentName": "null", "icon": "abc", "price": 500, "subscriptionType": "basic", "values": { "minValue": 0, "maxValue": 10, "segmentValuesList": [{ "id": 1, "value": "Y" }, { "id": 2, "value": "No" }] }, "segmentType": "RDO", "asmId": 1 } ] };
            if (data.success){
                this.setState({
                    segmentDetails : data.segmentDetails
                })
            } 
            ToastsStore.success(data.message)
            this.setState({
                mapSegmentLoader:false
            })
        })
        .catch(error => {
            this.setState({
                mapSegmentLoader:false
            })
            console.log(error);
        })
  }
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    // console.log(this.state.formControls.subcriptionType.value);
    // if(this.state.formControls.subcriptionType.value === "basic" || this.state.formControls.subcriptionType.value === "Basic"){
    //     this.setState({
    //         formControls:{
    //             price:{
    //                 value:"43"
    //             }
    //         }
    //     }); 
    // }

  
        this.setState({
            formControls: {
                  ...this.state.formControls,
                  [name]: {
                  ...this.state.formControls[name],
                  value
                  }
            }
      })
      console.log(this.state.formControls);
    
   
  }
  statusChangeHandler = event => {
    const index = event.target.name.split(",")[1];
    const value = event.target.value;  
    let temp = this.state.segmentDetails;
    temp[index].status = value
    this.setState({
        segmentDetails: temp
    })
  }
  subscriptionChangeHandler = event => {
    const index = event.target.name.split(",")[1];
    const value = event.target.value;  
    let temp = this.state.segmentDetails;
    temp[index].subscriptionType = value
    this.setState({
        segmentDetails: temp
    })
  }
  priceChangeHandler = event => {
    const index = event.target.name.split(",")[1];
    const value = event.target.value;  
    let temp = this.state.segmentDetails;
    temp[index].price = value
    this.setState({
        segmentDetails: temp
    })
  }
  updateSegmentMapping(index){
    let data = this.state.segmentDetails[index];
    let body = {
        "segmentGroupId" : this.state.segmentGroupId,
        "segmentId" : data.segmentId,
        "asmId" : data.asmId,
        "subcriptionType" : data.subscriptionType,
        "price" : data.price,
        "remove" : false
    }
    this.setState({
        updateSegmentGLoader:true
    })
    mapNewSegment(body)
    .then(response => response.json())
    .then(data=>{
            //let data = { "success": true, "message": "Success", "allowedActions": [] };
            if (data.success){
                this.fetchSegmentMappingDetails();    
            }else{
                this.setState({
                    updateSegmentGLoader:false
                })
            } 
            ToastsStore.success(data.message)
        })
        .catch(error => {
            this.setState({
                updateSegmentGLoader:false
            })
            console.log(error);
        })
  } 
  deleteSegmentMapping(index){
    let data = this.state.segmentDetails[index];
    let body = {
        "segmentGroupId" : this.state.segmentGroupId,
        "segmentId" : data.segmentId,
        "asmId" : data.asmId,
        "subcriptionType" : data.subscriptionType,
        "price" : data.price,
        "remove" : true
    }
    this.setState({
        updateSegmentGLoader:true
    })
    mapNewSegment(body)
    .then(response => response.json())
    .then(data=>{
            //let data = { "success": true, "message": "Success", "allowedActions": [] };
            if (data.success){
                this.fetchSegmentMappingDetails();    
            }else{
                this.setState({
                    updateSegmentGLoader:false
                })
            } 
            ToastsStore.success(data.message)
        })
        .catch(error => {
            this.setState({
                updateSegmentGLoader:false
            })
            console.log(error);
        })
  }
  getSegmentType(type){
    switch(type) {
        case 'TXT':
          return 'Text'
        case 'MUL':
            return 'Multi-Select'
        case 'RDO':
            return 'Single-Select'
        case 'RNG':
            return 'Range'
        default:
            return null;    
      }
  }
  
  returnNull(){
   this.setState({
    formControls:{
        ...this.state.formControls,
        price:{
            value:0
        }
    }
  })  
  }

  render(){
      return(
        <main className="wrapper-container">
            <div className="card-custom pad">
                <div className="section-title">Segment Group: {this.state.segmentName}</div>
               <section className="margin-btm--half margin-top flex flex-wrap">
                  <div className="senderId-action--wrapper margin-btm margin-top col-1">
                      <Link to="/segment-group"><button className="btn btn-fill btn-success">Back</button></Link>
                  </div>
               </section>
               <section>           
                    <div className="flex">
                        <div className="col-9 margin-left--auto">
                               <div className="label">Segment</div>
                               <select className="form-control" 
                                       name="segmentId"
                                       value={this.state.formControls.segmentId.value}
                                       onChange={this.changeHandler}> 
                                     <option value="" hidden>-Choose-</option>
                                     {
                                         this.state.segments.map((item,index) => {
                                             return(
                                                 <option key={index} value={item.id}>{item.displayTitle}</option>
                                             );
                                         })
                                     }
                               </select>
                       </div>
                        <div className="col-9 margin-left--auto">
                               <div className="label">Segment Type</div>
                               <select className="form-control" 
                                       name="subcriptionType"
                                       value={this.state.formControls.subcriptionType.value}
                                      onChange={this.changeHandler}> 
                                      <option value="choose" selected>--Chhose--</option>            
                                     <option value="basic">Basic</option>
                                     <option value="Premium">Premium</option>
                               </select>
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Segment Premium Rate</div>
                               <input  type="text"
                                       className="form-control"
                                       name="price"
                                       value={this.state.formControls.price.value} 
                                       onChange={this.state.formControls.subcriptionType.value==="basic"? this.returnNull : this.changeHandler}> 
                                       {/* onChange={this.changeHandler} > */}
                               </input>
                       </div>
                       <div className="senderId-action--wrapper margin-btm margin-top">
                            {
                                this.state.mapSegmentLoader &&
                                <div>
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                </div>
                            }
                            {
                                !this.state.mapSegmentLoader && 
                                <button onClick={()=>this.mapNewSegmentGroup()} className="btn btn-fill btn-success margin-left--auto margin-top--quar">Add</button>
                            }
                        </div>
                    </div>
               </section> 
            </div>
               <section className="margin-top">
                   {
                       this.state.segmentDetails.map((item,index) => {
                           return(
                            <div key={index} className="card-custom flex flex-direction--col margin-btm pad--half" style={{border: '1px solid #eeeeee',borderRadius: '12px',alignItems:'center'}}>
                                <div className="col-20 flex" style={{alignItems:'center'}}>
                                    <div className="col-3 padding-top--half" style={{textAlign:'center'}}>
                                        <div className="padding-btm--quar truncate" style={{fontWeight:'bold'}}>
                                            {
                                                item.icon &&
                                                <span>
                                                    <i aria-hidden="true" className={`${item.icon} icon`}></i>
                                                </span>
                                            }
                                            {item.title}
                                        </div>
                                        <div style={{fontSize:'smaller'}}>Type : {this.getSegmentType(item.segmentType)}</div>
                                    </div>
                                    <div className="col-13 flex flex-direction--row"> 
                                        <div className="col-8">
                                                <select className="form-control" 
                                                        name={"status,"+index}
                                                        value={item.status} 
                                                        onChange={this.statusChangeHandler} >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                </select>
                                        </div>
                                        <div className="col-8">
                                                <select className="form-control" 
                                                        name={"subType,"+index}
                                                        value={item.subscriptionType} 
                                                        onChange={this.subscriptionChangeHandler} >
                                                        <option value="basic">Basic</option>
                                                        <option value="premium">Premium</option>
                                                </select>
                                        </div>
                                        <div className="col-8">
                                                <input  type="text"
                                                        className="form-control"
                                                        name={"price,"+index}
                                                        value={item.price} 
                                                        onChange={item.subscriptionType==="basic"? null: this.priceChangeHandler}>  
                                                        {/* // onChange={this.priceChangeHandler} > */}
                                                </input>
                                        </div>
                                    </div>
                                    <div className="margin-left">
                                    <div className="col-20">   
                                            {
                                                    !this.updateSegmentGLoader && 
                                                    <div className="flex flex-direction--row">
                                                        <button onClick={() => this.updateSegmentMapping(index)} className="btn btn-success btn-fill pointer">Update</button>                    
                                                        <button onClick={() => this.deleteSegmentMapping(index)} className="btn btn-expletus btn-fill margin-left--half pointer">Delete</button>
                                                    </div>
                                            }
                                            {
                                                    this.updateSegmentGLoader &&
                                                    <div>
                                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                    </div>
                                            }                                                                                                                                              
                                    </div>  
                                    </div>
                                </div>
                                <div className="col-19 flex margin-top--half">
                                    {
                                        item.segmentType === "RNG" && 
                                        <div className="col-20 pad--half" style={{fontSize:'14px',textAlign:'center',background:'#eeeeee',borderRadius:'10px'}}>
                                            <span>Min value: {item.values.minValue}</span> &nbsp;
                                            <span>Min value: {item.values.maxValue}</span>                                        
                                        </div>
                                    }
                                    {
                                        (item.segmentType === "RDO" || item.segmentType === "MUL") &&
                                        <div className="col-20 flex flex-wrap pad--half" style={{fontSize:'14px',textAlign:'center',background:'#eeeeee',borderRadius:'10px',justifyContent: 'center'}}>
                                            {
                                                item.values && item.values.segmentValuesList && item.values.segmentValuesList.map((subItem,index)=>{
                                                    return(
                                                        <span key={index}>{subItem.value}
                                                            {
                                                                index !== (item.values.segmentValuesList.length - 1) &&
                                                                <span>,&nbsp;</span>
                                                            }
                                                        </span>
                                                    );
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                           );
                       })
                   }
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