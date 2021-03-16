import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';
import {getSelectSegment,getDatasourceMapSegment,addAudienceSegmentMapping} from '../../Services/datasource-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {Link} from 'react-router-dom';
import utils from '../../Services/utility-service';

class DatasourceMapSegment extends Component{
    constructor(props){
        super(props);
        this.state = {
            segmentList:[],
            addRemoveClients:[],
            start:0,
            datasource:null,
            addSegmentLoader:false,
            segment: {
              value: ''
            }     
        }   
    }
    changeHandler = event => {
        this.setState({
            segment: {
                value: event.target.value
              }
        });
    }
    componentDidMount() {
      let temp = localStorage.getItem("datasource");
        if(temp){
            this.setState({
                datasource : JSON.parse(temp)
            },()=>this.fetchDatasourceMapSegment())
        } 
        this.fetchSelectSegment(); 
      }
    fetchSelectSegment(){
      let body = {};
        getSelectSegment(body)
        .then(response => response.json())
        .then(data=>{
        //let data = { "success": true, "message": "Success", "allowedActions": [ "all" ], "segmentList": [ { "id": 1, "icon": "abc", "displayTitle": "Segment-1", "type": "RNG", "name": "segment-name-1", "dataCode": null, "status": "active", "allowedSubActions": [ "all" ] }, { "id": 2, "icon": "abc", "displayTitle": "Segment-1", "type": "RNG", "name": "segment-name-1", "dataCode": null, "status": "active", "allowedSubActions": [ "all" ] } ] };  
        if (data.success){
            this.setState({
                segmentList: data.segmentList        
            });
          } 
        })
        .catch(error => {
          console.log(error);
        })
      }
     fetchDatasourceMapSegment(){
        let body = {
          "start" : this.state.start,
          "agId" : this.state.datasource.agId,
          "maxResults": 20
        }
        getDatasourceMapSegment(body)
        .then(response => response.json())
        .then(data =>{
        //let data = { "success": true, "message": "Success", "allowedActions": [], "segmentMinDTOs": [ { "segmentId": 1, "segmentTitle": "Segment-1", "segmentName": "segment-name-1", "segmentType": "RNG", "status": "active" }, { "segmentId": 2, "segmentTitle": "Segment-1", "segmentName": "segment-name-1", "segmentType": "RNG", "status": "active" } ] };
          if (data.success){
            this.setState({
                addRemoveClients: data.segmentMinDTOs        
            });
          } 
        })
        .catch(error => {
            console.log(error);
        })
     }
     addNewSegment(){
        if(!this.state.segment.value){
          ToastsStore.error("Please Choose Segment");
          return;
        }
        let body = {
          "segmentId" : this.state.segment.value,
          "audienceGroupId" : this.state.datasource.agId,
          "remove" : false
        }
        this.setState({
          addSegmentLoader: true
        })
        addAudienceSegmentMapping(body)
        .then(response => response.json())
        .then(data => {
            ToastsStore.success(data.message);
            this.fetchDatasourceMapSegment();
            this.setState({
              addSegmentLoader: false
            })
        })
        .catch(error => {
            this.setState({
              addSegmentLoader: false
            })
            console.log(error);
        })
     }

    render(){
        return(
          <main className="sender-id--wrapper">
            <div className="section-title">Datasource {this.state.datasource ? this.state.datasource.agName : ''}, Mapped Segments:</div>
               <section className="flex margin-btm--half margin-top">
                  <span className="senderId-action--wrapper margin-btm margin-top col-1">
                    <Link to="/datasource"><button className="btn btn-fill btn-success">Back</button></Link>
                  </span>
                  <span className="senderId-action--wrapper margin-btm margin-top margin-left--auto col-6">
                        <div className="col-20">
                              <select className="form-control"
                                      name="segment"
                                      value={this.state.segment.value} 
                                      onChange={this.changeHandler} >                                  
                                    <option value="" hidden>-SELECT SEGMENT-</option>
                                    {
                                          this.state.segmentList.map((item,index)=>{
                                                return (
                                                      <option key={index} value={item.id}>{item.name}</option>
                                                );
                                          })
                                    }
                              </select>
                       </div>
                  </span>
                  <div className="senderId-action--wrapper margin-btm margin-top">
                      {
                        this.state.addSegmentLoader &&
                        <div>
                              <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                        </div>
                      }
                      {
                        !this.state.addSegmentLoader && 
                        <button onClick={()=>this.addNewSegment()} className="btn btn-fill btn-success margin-left--auto">Add</button>
                      }
                  </div>
               </section>
               <section className="margin-top leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
               >           
                <table className="client">
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                         {    
                            this.state.addRemoveClients.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.segmentId}</td>
                                    <td>{item.segmentName}</td>
                                    <td>{item.segmentType}</td>
                                    <td>{item.status}</td>                                 
                                </tr>                                                            
                                );                               
                             }) 
                         } 
                    </tbody>
                </table>
              </section> 
              <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
          </main>         
        );
    }  
}

export default DatasourceMapSegment;
