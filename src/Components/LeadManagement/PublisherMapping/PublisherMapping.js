import React from 'react';
import {getPublisherUpdateTable,getPublisherVendor,getPublisherUpdate,getLeadCampaign} from '../../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../circular-loader/circular-loader';
import MappingProcess from '../PublisherMapping/PublisherMapProcess';
import {Link} from 'react-router-dom';
import utils from '../../../Services/utility-service';
import SvgIcon from '../../Svg-icon/Svg-icon';

export default class PublisherMapping extends React.Component{

    constructor(props){
        super(props);
        this.state={
           clientName:[],
           campaigns:[],
           mapping:[],
           campaignName:[],
           submitLoader: true,
           publisher:"",
           key:{
            client:{
                id: "",
            },
            publisher:{
                id:""
            },
            campaign:{
                id:""
            }
        }
        }
        this.changeHandlerMultiselect = this.changeHandlerMultiselect.bind(this);
        this.leadMapping = this.leadMapping.bind(this);
        this.changeHandler = this.changeHandler.bind(this);  
        this.deleteData = this.deleteData.bind(this);
    }

    componentDidMount(){      
        this.fetchPublisherClient(); 
        this.fetchleadCampaign(); 
        this.updatePublisherTable();     
    }

    fetchPublisherClient(){
        let body={}
        getPublisherVendor(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader:false,
                    clientName: data.clients
                });
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

    fetchleadCampaign(){
        let body={}
        getLeadCampaign(body)
        .then( response => response.json())
        .then( data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader: false,
                    campaigns : data.campaigns
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( error => {
            this.setState({
                submitLoader: true
            })
        })
    }

    deleteData(id){
        const body = {
            id:id,
            businessUid: this.state.key.client.id ? this.state.key.client.id: null,
            publisherId :  parseInt(this.state.key.publisher.id),
            campaignIds: this.state.key.campaign.id ? this.state.key.campaign.id:null,
            remove : true
        }
        
        getPublisherUpdate(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.updatePublisherTable()
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!");
        })
    }

    fetchCampaignName(data){
        let arr = [];
        if(data && data.length>0){
            data.forEach(e=> {
                let obj = {
                    "value": e.id, 
                    "label": e.name 
                }
                arr.push(obj);
            });  
        }
        return arr;
    }

    updatePublisherTable(){
        const body = 
        {
            start : parseInt(0),
            maxResults : parseInt(100)
        }
        getPublisherUpdateTable(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    mapping:data.mapping,
                    submitLoader: false
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!");
            this.setState({
                submitLoader:true
            });
        })
       
    }

    updatePublisher(){
        const body={
        businessUid : this.state.key.client.id,
        //campaignIds : "100021,100001",
        campaignIds: this.state.key.campaign.id ? this.state.key.campaign.id: null,
        publisherId :  parseInt(this.state.key.publisher.id),
        id : null,
        remove : false
        }
        getPublisherUpdate(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.updatePublisherTable()
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!");
        })
    }

    leadMapping(event){
        event.preventDefault();
        this.updatePublisher();
    }

    changeHandlerMultiselect(event){ 
        let id ;
        let arr=[];
        if(event && event.length>0){
            event.forEach(e=> {
                    id= e.value;
                arr.push(id);
            });  
        }
        this.setState({
                    key: {
                        ...this.state.key,
                        campaign: {
                        id: arr
                        }
                    }
            });
    }
     
    changeHandler(event){
        let valu=event.target.value;
        let name=event.target.name;
      this.setState({
          key:{
              ...this.state.key,
              [name]:{
                  id: valu,
              }
          }
      })  
    }

    render(){
        return(
        <main className="wrapper-container">  
        <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>        
            <article className="card-custom  pad">
                <h4 className="ui header">PUBLISHER MAPPING</h4>
            </article>
            <MappingProcess
                changeHandlerMultiselect = {this.changeHandlerMultiselect}
                campaignArray={this.fetchCampaignName(this.state.campaigns)}
                changeHandler={this.changeHandler}
                key={this.state.key}
                clientName={this.state.clientName}
                leadMapping={this.leadMapping}
            />
            <article className="card-custom margin-top leads-table-wrapper" 
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >
                <table className="client">
                    <thead>
                        <tr className="text--center">
                            <th>ID</th>
                            <th>Client</th>
                            <th>Publisher ID</th>
                            <th>Campaign</th>
                            <th>Action</th>
                        </tr> 
                    </thead> 
                    <tbody>                    
                            {
                            this.state.mapping && this.state.mapping.length>0 && this.state.mapping.map((item,index) =>{
                                return(
                                    <tr key={index} className="text--center">
                                        <td>{item.id ? item.id : "--"}</td>
                                        <td>{item.businessName ?  item.businessName : "--"}</td>
                                        <td>{item.publisherId ? item.publisherId : "--"}</td>
                                        <td>{item.campaignIds ? item.campaignIds : "--"}</td>
                                        {
                                            item.id ? (<td><SvgIcon icon="delete" classes={'svg--lg'} onClick={()=>{this.deleteData(item.id)}}></SvgIcon></td>) : (<td>--</td>)
                                        }
                                        
                                        {/* <button className="btn btn-fill btn-expletus margin-left--auto" >Delete</button> */}
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