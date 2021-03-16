import React from 'react';
import {getUpdatedStatusGroupTable,getLeadStatus,getupdateStatusGroupMapping} from '../../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../circular-loader/circular-loader';
import {Link} from 'react-router-dom';
import SvgIcon from '../../Svg-icon/Svg-icon';
import utils from '../../../Services/utility-service';

export default class StatusMapping extends React.Component{

    constructor(props){
        super(props);
        this.state={
            leadStatus: [],
            submitLoader: false,
            formControl:{
                leadStatus:{
                    value:""
                },
            },
            statusGr:[],
            statusGrName:"",
            statusGrId:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.updateStatusGroupMapping = this.updateStatusGroupMapping.bind(this);
    }

    componentDidMount(){
        let tempName = localStorage.getItem("statusGroupName");
        let tempId = localStorage.getItem("statusGroupId");
        if(tempName && tempId){
            this.setState({
                statusGrName : JSON.parse(tempName),
                statusGrId: JSON.parse(tempId)
            }, ()=>{this.fetchleadStatus()
                this.fetchUpdatedStatusGroupTable()})
        } 
    }

    fetchUpdatedStatusGroupTable(){
        const body ={
            start : parseInt(0),
            maxResults : parseInt(100),
            statusGroupId : this.state.statusGrId,
        }
        getUpdatedStatusGroupTable(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    statusGr:data.leadStatus,
                    submitLoader:false
                })               
            }
            else {
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!");
        })
    }

    handleChange(event){
        let name= event.target.name;
        let value=event.target.value;
        this.setState({
            formControl:{
                ...this.state.formControl,
                [name]:{
                    value:value
                }
            } 
        }
        );
    }

    fetchleadStatus(){       
        let body={
            start:null,
            maxResults: null,
            businessUid: null,
            statusGroupUnMapped: true,
            statusGroupId : this.state.statusGrId,
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

    updateStatusGroupMapping(){
        this.fetchleadStatus();
        const body ={
            statusId : parseInt(this.state.formControl.leadStatus.value),
            statusGroupId : this.state.statusGrId,
            remove : false
        }
        getupdateStatusGroupMapping(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.fetchUpdatedStatusGroupTable();
                this.setState({
                    submitLoader:false
                });
            }
            else{
                ToastsStore.error(data.message);
                this.setState({
                    submitLoader:true
                })
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
        })
    }
   
    render(){
        return(
        <main className="wrapper-container">
            <Link to="/leads/status/group/name"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
            <article className="card-custom pad--half">
                    <h4 className="ui header">STATUS ASSIGNMENT of {this.state.statusGrName} </h4>
            </article> 
            <article className="card-custom pad">
                <div className="ui divided three column grid">
                    <div className="row text--center">
                        <div className="column ">
                            <h4 className="ui header">STATUS GROUP</h4>
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
                            {this.state.statusGrName}
                        </div>
                        <div className="column text--center">
                            <select 
                                onChange={this.handleChange}
                                className="form-control"
                                value={this.state.id}
                                name="leadStatus"
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
                            <button  className="btn btn-fill margin-left--auto" onClick={this.updateStatusGroupMapping}>UPDATE</button>
                        </div>                       
                    </div>                              
                </div>
            </article>
            <article className="card-custom margin-top leads-table-wrapper" 
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >
                <table className="client">
                    <thead>
                        <tr>
                            <th>Lead Status Group Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                        <tbody>
                         {    
                            this.state.statusGr && this.state.statusGr.length>0 && this.state.statusGr.map((item,index) =>{
                                return(
                                <tr key={index}>
                                    <td>{item.disposition}</td>          
                                    <td></td>
                                    <td>
                                        <div onClick={()=>this.togglePopupFunnel(item.statusGroup)}><SvgIcon icon={"funnel"} classes={'svg--lg'}></SvgIcon></div>
                                    </td>
                                </tr>                    
                                );
                            })                         
                        }     
                    </tbody>
                </table>
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