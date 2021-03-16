import React from 'react';
import {getLeadStatus,getLeadTypeUpdate,getUpdatedLeadTypeTable} from '../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../circular-loader/circular-loader';
import {Link} from 'react-router-dom';
import utils from '../../Services/utility-service';

export default class LeadTypeAssignment extends React.Component{
    constructor(props){
        super(props);
        this.state={
            leadStatus:[],
            submitLoader: true,
            leadStatusMapping:[],
            key:{
                statusFresh:{
                    id: ""
                },
                statusDuplicate:{
                    id: ""
                },
                statusJunk:{
                    id: ""
                }
            }
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.fetchLeadTypeTable();
        this.fetchleadStatus();
    } 

    fetchleadTypeUpdate(type){
        let leadStatusId
        if (type === "2"){
            leadStatusId = this.state.key.statusFresh.id;
        }
        if(type === "1"){
            leadStatusId = this.state.key.statusDuplicate.id;
        }
        if(type === "3"){
            leadStatusId = this.state.key.statusJunk.id;
        }
        
        let body = {
               leadTypeId: parseInt(type),
               leadStatusId : parseInt(leadStatusId),
               id : null,
               remove : false
        }
        
        getLeadTypeUpdate(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){              
                ToastsStore.success(data.message);
                this.fetchLeadTypeTable();
                this.setState({
                    submitLoader: false
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( error=>{
            ToastsStore.error("Something went wrong. Please Try Again Later !!");
            this.setState({
                submitLoader: true
            })
        })
    }

    fetchLeadTypeTable(){
        let body={
            businessUid : null
        }
        getUpdatedLeadTypeTable(body)
        .then(response => response.json())
        .then (data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    leadStatusMapping: data.mappings,
                    submitLoader: false
                });
                
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            ToastsStore.error("Something went wrong, Please try again later !!");
            this.setState({
                submitLoader: true
            })
        })
    }

    fetchleadStatus(){
        
        let body={
            start:null,
            maxResults: null,
            businessUid: null
        }
        getLeadStatus(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader: false,
                    leadStatus: data.leadStatus
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( error => {
            ToastsStore.error("Something went wrong. Please Try Again Later !!");
            this.setState({
                submitLoader: true
            })
        })
    } 

    handleChange(event){
        let id=event.target.value;
        let naam = event.target.name;
      this.setState({
          key:{
              ...this.state.key,
            [naam]: {
                id: id
            }
          }
      })    
    }

    render(){
        return(
            <main className="wrapper-container">
                <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
                <article className="card-custom pad">
                    <h4 className="ui header">LEAD TYPE ASSIGNMENT</h4>
                </article>
                <article className="card-custom pad">
                <div className="ui divided three column grid">
                    <div className="row text--center">
                        <div className="column ">
                            <h4 className="ui header">LEAD TYPE</h4>
                        </div>
                        <div className="column">
                            <h4 className="ui header ">LEAD STATUS</h4>
                        </div>
                        <div className="column">
                            <h4 className="ui header">ACTION</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column text--center">
                            Fresh
                        </div>
                        <div className="column text--center">
                            <select 
                                onChange={this.handleChange}
                                className="form-control"
                                value={this.state.key.statusFresh.value}
                                name="statusFresh"
                                >
                                    <option default>--Choose Status--</option>
                                {    
                                    this.state.leadStatus && this.state.leadStatus.length>0 && this.state.leadStatus.map((item,index) =>{
                                        return(                                     
                                                <option  key={index} value={item.id}>{item.disposition}</option>                                     
                                            );                                 
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div className="column text--center">  
                            <button  className="btn btn-fill margin-left--auto" onClick={()=>this.fetchleadTypeUpdate("2")}>UPDATE</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column text--center">
                            Duplicate
                        </div>
                        <div className="column text--center">
                            <select 
                                    className="form-control"
                                    onChange={this.handleChange}
                                    value={this.state.key.statusDuplicate.value}
                                    name="statusDuplicate"
                                    >
                                        <option default>--Choose Status--</option>
                                {    
                                    this.state.leadStatus && this.state.leadStatus.length>0 && this.state.leadStatus.map((item,index) =>{
                                        return(                                     
                                                <option  key={index} value={item.id}>{item.disposition}</option>                                     
                                            );                                 
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div className="column text--center">
                            <button  className="btn btn-fill margin-left--auto" onClick={()=>this.fetchleadTypeUpdate("1")}>UPDATE</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column text--center">
                            Junk
                        </div>
                        <div className="column text--center">
                            <select 
                                    onChange={this.handleChange}
                                    value={this.state.key.statusJunk.value}
                                    className="form-control"
                                    name="statusJunk"
                                    >
                                        <option default>--Choose Status--</option>
                                {    
                                    this.state.leadStatus && this.state.leadStatus.length>0 && this.state.leadStatus.map((item,index) =>{
                                        return(                                     
                                                <option  key={index} value={item.id}>{item.disposition}</option>                                     
                                            );                                 
                                        }
                                    )
                                }
                            </select>
                        </div>                       
                        <div className="column text--center">
                            <button  className="btn btn-fill margin-left--auto" onClick={()=>this.fetchleadTypeUpdate("3")}>UPDATE</button>
                        </div>
                    </div>
                </div>
                </article>

                <article className="card-custom pad leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
                >
                    {/* <div className="margin-top leads-table-wrapper"> */}
                        <table className="client">
                                <thead>
                                    <th>Lead Type</th>            
                                    <th>Lead Status</th>             
                                </thead>
                                <tbody>
                                    {this.state.leadStatusMapping && this.state.leadStatusMapping.length>0 && this.state.leadStatusMapping.map((item,index)=>{
                                        return(
                                            <tr key={index} className="">              
                                                <td >{item.leadType}</td>                                 
                                                <td >{item.leadStatus}</td>
                                            </tr>                              
                                            );
                                    })}
                                </tbody>
                            </table>
                        {/* </div> */}
                </article>
                
                {
                    this.state.submitLoader && 
                    <div className="margin-top--double">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
                       
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
            </main>
        );
    }
}