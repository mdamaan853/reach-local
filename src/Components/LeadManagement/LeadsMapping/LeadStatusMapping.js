import React from 'react';
import {getLeadStatus,getLeadStatusClient,getLeadBucket,getLeadFunnel,leadStatusFunnelBucketMapping} from '../../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../circular-loader/circular-loader';
import LeadsMapping from './LeadsMapping';
import {Link} from 'react-router-dom';
import utils from '../../../Services/utility-service';

export default class LeadStatusMapping extends React.Component{
    constructor(props){
        super(props);
        this.state={
            leadStatus:[],
            bucket:[],
            submitLoader: true,
            leadFunnel:[],
            leadStatusMapping:[],
            key:{
                statusKey:{
                    value: "",
                    unMapped:""
                },
                bucketKey:{
                    value:"",
                    unMapped:""
                },
                leadFunnel:{
                    value:"",
                    unMapped:""
                }
            }
        }
        this.leadMapping = this.leadMapping.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchBucketStatus = this.fetchBucketStatus.bind(this);
        this.fetchLeadStatus = this.fetchLeadStatus.bind(this);
    }

    componentDidMount(){
        this.fetchLeadStatus();
        this.fetchBucketStatus();
        this.fetchLeadFunnel();
        this.fetchleadStatusFunnelBucketTable();
    }

    fetchleadStatusFunnelBucketMapping(id){
        let body = {
            statusId: this.state.key.statusKey.value,
            bucketId: this.state.key.bucketKey.value,
            funnelId: this.state.key.leadFunnel.value,
            remove:false,
            id:null
        }
        if(id){
            body.id = id;
            body.remove = true;
        }
        leadStatusFunnelBucketMapping(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){              
                this.fetchleadStatusFunnelBucketTable();
                ToastsStore.success(data.message);
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
        })
    }

    fetchleadStatusFunnelBucketTable(){      
        let body={
            start:0,
            maxResults: 30,
            businessUid: null
        }
        getLeadStatus(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader: false,
                    leadStatusMapping: data.leadStatus
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

    fetchLeadStatus(){       
        let body ={
            start: null,
            maxResults: null,
            businessUid:null,
            unMapped:true
        }
        if(this.state.key.statusKey.unMapped){
            body["unMapped"]= this.state.key.statusKey.unMapped;
        }
        getLeadStatusClient(body)
        .then( response => response.json())
        .then( data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    leadStatus: data.status,
                    submitLoader: false
                })
                if(this.state.leadStatus.length && this.state.leadStatus.length === null){
                    ToastsStore.success("First create lead status");
                }
            }
        })
        .catch(error => {
            this.setState({
                submitLoader: true
            })
        })
    }

    fetchLeadFunnel(){
        let body ={}     
        getLeadFunnel(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader:false,
                    leadFunnel:data.leadFunnels
                });

            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            this.setState({
                submitLoader: true          
            });
            ToastsStore.success("Something went wrong. Please Try Again Later !!");
        })
    }

    fetchBucketStatus(){
        let body ={
            start: null,
            maxResults: null,
            businessUid:null
        }
        // if(this.state.key.bucketKey.unMapped){
        //     //console.log(this.state.key.bucketKey.unMapped);
        //     body["unMapped"]= this.state.key.bucketKey.unMapped;
        // }
        getLeadBucket(body)
        .then( response => response.json())
        .then( data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    bucket: data.buckets,
                    submitLoader: false
                })
                if(this.state.bucket.length && this.state.bucket.length === null){
                    ToastsStore.success("First create bucket");
                }
            }
        })
        .catch(error => {
            this.setState({
                submitLoader: true
            })
        })
    }

    handleChange(event){
        let valu=event.target.value;
        let name=event.target.name;
      this.setState({
          key:{
              ...this.state.key,
              [name]:{
                  ...this.state.key.name,
                  value: valu,
                  unMapped: true
              }
          }
      })    
     
    }

    leadMapping(event){
        event.preventDefault();
        this.fetchLeadStatus();
        this.fetchleadStatusFunnelBucketMapping();      
    }
    
    render(){
        return(
            <main className="wrapper-container">
                <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
                <article className="card-custom pad--half">
                    <h4 className="ui header">LEAD STATUS MAPPING</h4>        
                </article>
              <LeadsMapping
                handleChange={this.handleChange}
                key={this.state.key}
                leadStatus={this.state.leadStatus}
                bucket={this.state.bucket}
                leadFunnel={this.state.leadFunnel}
                leadMapping={this.leadMapping} 
              />
              
              <article className="margin-top card-custom leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
                >
                <table className="client">
                    <thead> 
                        <tr>
                            <th>Lead Status</th>   
                            <th>Bucket</th>
                            <th>Lead Funnel</th>
                            <th>Action</th>
                        </tr> 
                    </thead>
                    <tbody>
                            {
                            this.state.leadStatusMapping.map((item,index) =>{
                                return(
                                    <tr key={index}>
                                        <td>{item.disposition}</td>
                                        <td>{item.clientBucket}</td>
                                        <td>{item.funnel}</td>
                                        <td>
                                            <button className="btn btn-fill btn-expletus margin-left--auto"  onClick={()=>{this.fetchleadStatusFunnelBucketMapping(item.id)}}>DELETE</button>
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