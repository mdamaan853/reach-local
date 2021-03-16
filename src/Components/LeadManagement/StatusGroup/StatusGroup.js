import React from 'react';
import Popup from '../../Popup/Popup';
import NewStatusGroup from './NewLeadStatusGr'; 
import {getLeadStatusGroup,updateLeadStatusGroup,getLeadCampaign} from '../../../Services/lead-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../circular-loader/circular-loader';
import SvgIcon from '../../Svg-icon/Svg-icon';
import {Link} from 'react-router-dom';
import utils from '../../../Services/utility-service';

export default class StatusGroup extends React.Component{
    constructor(props){
        super(props);
        this.state={
            opnNwLeadStatusGr:false,
            opnStatusMapping:false,
            statusGrName:"",
            id:"",
            campaigns:[],
            campaignPrefill:[],
            leadStatusGroups:[],
            submitLoader:false,
            campaignId:[]   
        }
        this.clearFilter = this.clearFilter.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitData = this.submitData.bind(this);
        this.tableAction = this.tableAction.bind(this);
        this.fetchleadCampaign = this.fetchleadCampaign.bind(this);
        this.prefillState = this.prefillState.bind(this);
    }

    componentDidMount(){
        this.fetchStatusGrTable();
        this.fetchleadCampaign();
    }

    fetchStatusGrTable(){
        const body = {
            start : parseInt(0),
            maxResults : parseInt(100),
        }
        getLeadStatusGroup(body)
        .then(response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader:false,
                    leadStatusGroups: data.leadStatusGroups
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong.Please Try Again Later !!!");
            this.setState({
                submitLoader: true
            })
        })
    }

    prefillState(index,item){
        let campnBackndArr = this.getCampaignName(item.campaignIds,"arr");
        let campnSelectedArr=this.fetchCampaignName(campnBackndArr);
        let tempStatuGr = this.state.leadStatusGroups[index].statusGroup;
        let tempStatusId= this.state.leadStatusGroups[index].id;
        this.setState({
            statusGrName:tempStatuGr,
            id:tempStatusId,
            campaignPrefill:campnSelectedArr
         })
        this.togglePopup();
    }

    togglePopup(){       
        const opnPopup = this.state.opnNwLeadStatusGr; 
        this.setState({
            opnNwLeadStatusGr: !opnPopup
        }) 
    }

    changeHandlerMultiselect(event){     
        this.setState({
            campaignId:event
        });
    }
    
    handleChange(event){
        let value=event.target.value;
        this.setState({
            statusGrName:value
        });   
    }
    
    getIds(data){
        let temp = [];
        if(data && data.length > 0){
            data.forEach(e => {
                temp.push(e.value);
            })
        }
        return temp;
    }

    getCampaignName(item,parameter){       
        let nameArr=[];
        let campnSelectedArr=[];
        let campn = [];
        campn=this.state.campaigns;        
        
        for (let i=0;i<campn.length;i++){ 
            item.forEach(e => {
                if(campn[i].id===e){
                    nameArr.push(campn[i].name);
                    campnSelectedArr.push(campn[i]);
                }
            })               
        }
        if(parameter === "name"){
            return nameArr;
        }
        else if(parameter === "arr"){
            return campnSelectedArr;
        }        
    }

    submitData(id,del,gr,camId){
        const body={
            statusGroup : this.state.statusGrName,
            id: null,
            remove : false,
            campaignIds: this.getIds(this.state.campaignId)
        }
        if(id){
            body.id=id;
        }
        if(del === "delete"){
            body.statusGroup = gr;
            body.remove = true;
            body.campaignIds = camId;
        }
        updateLeadStatusGroup(body)
        .then(response => response.json())
        .then( data=>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader: false
                });
                this.fetchStatusGrTable();
                if (del === "delete"){
                    return;
                }
                this.togglePopup();          
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something went wrong. Please Add New Status Group Name Later !!!");
            this.setState({
                submitLoader: true
            })
        })
    }

    tableAction(name,id){
        localStorage.setItem("statusGroupName",JSON.stringify(name));
        localStorage.setItem("statusGroupId",JSON.stringify(id));
        window.location.href = window.location.origin + "/leads/status/group/name/mapping";
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
                    campaigns: data.campaigns
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

    clearFilter(){
        this.setState({
            id:"",
            statusGrName:"",
            campaignPrefill:[]
        })
        this.togglePopup();
    }
 
    fetchCampaignName(data){ 
        let arr =[];            
        if(data && data.length>0){
            data.forEach(e => {         
                let obj = {
                    "value": e.id, 
                    "label": e.name 
                }
                // console.log(obj);
                arr.push(obj);
            });  
        }
        return arr;     
    }

    render(){
        return(
            <main className="wrapper-container">
                <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
                <article className="card-custom flex flex-direction--row flex-wrap pad--half">
                    <h4 className="ui header">STATUS GROUP</h4>
                    <button className="btn btn-fill btn-success margin-left--auto"  onClick={this.clearFilter}>New Status Group</button>
                </article>
                
                <article className="margin-top card-custom leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
                >
                <table className="client">
                    <thead>
                        <th>Lead Status Group Name</th>
                        <th>Campaign id</th>
                        <th>Action</th>
                    </thead>
                    <tbody>   
                         {    
                            this.state.leadStatusGroups && this.state.leadStatusGroups.length>0 && this.state.leadStatusGroups.map((item,index) =>{
                                return(
                                <tr key={index} className="text--center">
                                    <td>{item.statusGroup}</td>  
                                    <td>{this.getCampaignName(item.campaignIds,"name")+", "}</td>        
                                    <td>
                                        <span className="mar pointer" onClick={()=>this.prefillState(index,item)}><SvgIcon icon={"edit"} classes={'svg--lg'}></SvgIcon></span> 
                                        <span className="mar pointer" onClick={()=>this.tableAction(item.statusGroup,parseInt(item.id))}><SvgIcon icon={"funnel"} classes={'svg--lg'}></SvgIcon></span>
                                        <span className="mar pointer" onClick={()=>{this.submitData(parseInt(item.id),"delete",item.statusGroup,item.campaignIds)}}><SvgIcon icon={"delete"} classes={'svg--lg'}></SvgIcon></span>                                   
                                    </td>
                                </tr>                    
                                );
                            })                         
                        }     
                    </tbody>
                </table>
              </article>
                
                {
                   this.state.opnNwLeadStatusGr &&
                   <Popup title={"New Status Group"} togglePopup={this.togglePopup}>
                        <NewStatusGroup
                            togglePopup={this.togglePopup}
                            changeHandler={this.handleChange}
                            submitData={this.submitData}
                            submitLoader={this.state.submitLoader}
                            changeHandlerMultiselect={this.changeHandlerMultiselect.bind(this)}
                            statusGroup={this.state.statusGrName}
                            campaignName={this.state.campaignId}
                            campaignArray = {this.fetchCampaignName(this.state.campaigns)}
                            id={this.state.id}
                            prefillArray={this.state.campaignPrefill}
                        />
                   </Popup>
                }
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