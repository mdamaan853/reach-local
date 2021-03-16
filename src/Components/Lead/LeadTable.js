import React from 'react';
import Moment from 'react-moment';
import classNames from 'classnames';
import {getLead,getLeadFilter,getLeadStatus,leadPushBySheet,getLeadAssign} from '../../Services/lead-service';
import {fetchRoles} from '../../Services/roles-service';
import LeadDetail from '../../Containers/LeadDetail/LeadDetail';
import CircularLoader from '../circular-loader/circular-loader';
import LeadFilter from './LeadFilter';
import PopUp from '../Popup/Popup';
import utils from '../../Services/utility-service';
import {addLead} from '../../Services/lead-service';
import { Icon,Popup } from 'semantic-ui-react';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import './LeadTable.css';
import AddLead from './AddLead';
// import {Link} from 'react-router-dom';

const style = {
    borderRadius: 0,
    opacity: 0.85,
    padding: '1em',
}
export default class LeadTable extends React.Component{
  
    constructor(props){
        super(props);
        this.state={
            fileFormat: null,
            leads:[],
            addLead:{error:null,name:null,mobile:null,pubId:null,campaignId: null},
            start:0,
            openLead:false,
            maxResult:50,
            hasNext:false,
            loader:false,
            filterPopup:false,
            filtersApplied:false,
            isDownloading:false,
            rolesFetched:false,
            accessDenied:false,
            leadType:[],
            leadStatus:[],
            campaignName:[],
            utmSource:[],
            leadFunnels:[],
            buckets:[],
            publisherIds:[],
            indexToEdit:0,
            isDetailView:false,
            openPopup: false,
            campaigns:[],
            publIds:[],
            file: null,
            confirmationLoader: false,
            error:"",
            formControls:{
                utmSource:{
                    value:''
                },
                utmMedium:{
                    value:''
                },
                from:{
                    value:''
                },
                to:{
                    value:''
                },
                leadType:{
                    value:''
                },
                leadStatus:{
                    value:''
                },
                campaignName:{
                    value:''
                },
                mobile:{
                    value:''
                },
                leadFunnels:{
                    value:''
                },
                buckets:{
                    value:''
                },
                publisherIds:{
                    value:''
                },
                leadId:{
                    value:''
                }
            }
        };
    }

    componentDidMount(){    
        if(utils.isAdmin){
            this.fetchFilters(true);
            this.checkForSavedFilters();
        }else{
            this.getRequiredRoles();
        }
    }

    fetchLeadStatus(){
        let body={
            campaignId: this.state.formControls.campaignName.value.value             
        }
        getLeadStatus(body)
        .then( response => response.json())
        .then( data => {
            if(data.success){
                this.setState({
                    leadStatus: this.formatMulSelectLeadStatus(data.leadStatus)
                })
            }
        })  
    }

    submitLead(){
        const body = this.state.addLead;
        addLead(body)
        .then(r => r.json())
        .then(data => {
            if(data.success){
                ToastsStore.success("Lead is added Successfully");
                this.setState({
                    openLead: false
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch((e)=>{
            console.error(e);
            ToastsStore.error("Something Went Wrong. Lead cannot be added. Please Try Again Later!!!");
        })
    }


    // getArray(data){
    //     let arr =[];
    //     if (data){
    //         data.forEach(item=>{
    //             let disposition = item.disposition;     
    //             arr.push(disposition);  
    //         })            
    //     }
    //     return arr;
    // }

    getRequiredRoles(){
        fetchRoles('Leads')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
                this.fetchFilters(true);
                this.checkForSavedFilters();
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

    radioChangeHandler(event,params){
     
        this.setState({
            fileFormat: event.target.value
        })      
    }

    checkForSavedFilters(){
        let filters = localStorage.getItem("leadFilters");
        if(filters){
            filters = JSON.parse(filters);
            let temp = this.state.formControls;
            if(filters.utmSource){
                temp.utmSource.value = filters.utmSource;
            }
            if(filters.utmMedium){
                temp.utmMedium.value = filters.utmMedium;
            }
            if(filters.mobile){
                temp.mobile.value = filters.mobile;
            }
            if(filters.leadId){
                temp.leadId.value = filters.leadId;
            }
            if(filters.campaignName){
                temp.campaignName.value = filters.campaignName;
            }
            if(filters.leadFunnels){
                temp.leadFunnels.value = filters.leadFunnels;
            }      
            if(filters.publisherIds){
                temp.publisherIds.value = filters.publisherIds;
            }
            if(filters.leadType){
                temp.leadType.value = filters.leadType;
            }
            if(filters.leadStatus){
                temp.leadStatus.value = filters.leadStatus;
            }
            if(filters.from){
                temp.from.value = new Date(filters.from);
            }
            if(filters.to){
                temp.to.value = new Date(filters.to);
            }
            this.setState({
                formControls: temp,
                filtersApplied: true
            },()=>{
                if(utils.tempCache && utils.tempCache.bucketId){
                    this.fetchLeads(utils.tempCache.bucketId);
                }else{
                    this.fetchLeads();
                }
            })
        }else{
            if(utils.tempCache && utils.tempCache.bucketId){
                this.fetchLeads(utils.tempCache.bucketId);
            }else{
                this.fetchLeads();
            }
        }
    }

    getLeads(type){
        if(type === 'previous'){
            if(this.state.start > 0){
                this.setState({
                    start: this.state.start - 50,
                },()=>{
                    this.fetchLeads();
                })
            }
        }else if(type === 'next'){
            if(this.state.hasNext){
                this.setState({
                    start: this.state.start + 50,
                },()=>{
                    this.fetchLeads();
                })
            }
        }
    }
    
    saveFilters(){
        let obj = {};
        if(this.state.formControls.utmSource.value){
            obj['utmSource'] = this.state.formControls.utmSource.value;
        }
        if(this.state.formControls.utmMedium.value){
            obj['utmMedium'] = this.state.formControls.utmMedium.value;
        }
        if(this.state.formControls.campaignName.value){
            obj['campaignName'] = this.state.formControls.campaignName.value;
        }
        if(this.state.formControls.mobile.value){
            obj['mobile'] = this.state.formControls.mobile.value;
        }
        if(this.state.formControls.leadId.value){
            obj['leadId'] = this.state.formControls.leadId.value;
        }
        if(this.state.formControls.leadFunnels.value){
            obj['leadFunnels'] = this.state.formControls.leadFunnels.value;
        }      
        if(this.state.formControls.publisherIds.value){
            obj['publisherIds'] = this.state.formControls.publisherIds.value;
        }
        if(this.state.formControls.leadType.value){
            obj['leadType'] = this.state.formControls.leadType.value;
        }
        if(this.state.formControls.leadStatus.value){
            obj['leadStatus'] = this.state.formControls.leadStatus.value;
        }
        if(this.state.formControls.from.value){
            obj['from'] = this.state.formControls.from.value;
        }
        if(this.state.formControls.to.value){
            obj['to'] = this.state.formControls.to.value;
        }
        localStorage.setItem("leadFilters",JSON.stringify(obj));
        this.fetchLeads();
    }

    fetchLeads(bucketId){
        let body={
          start:parseInt(this.state.start),
          maxResult:parseInt(this.state.maxResult),
        }
        if(bucketId){
            body['bucketId'] = bucketId;
        }
                    // if(this.state.formControls.utmSource.value){
                    //     body['pageuuids'] = this.state.formControls.utmSource.value;
                    // }
                    // if(this.state.formControls.utmMedium.value){
                    //     body['pageuuids'] = this.state.formControls.utmSource.value;
                    // }
        if(this.state.formControls.utmSource.value){
            body['utmSource'] = this.state.formControls.utmSource.value;
        }
        if(this.state.formControls.mobile.value){
            body['mobile'] = this.state.formControls.mobile.value;
        }
        if(this.state.formControls.utmMedium.value){
            body['utmMedium'] = this.state.formControls.utmMedium.value;
        }
        if(this.state.formControls.campaignName.value){
            body['campaignName'] = this.state.formControls.campaignName.value.value;
        }
        if(this.state.formControls.leadId.value){
            body['leadId'] = this.state.formControls.leadId.value;
        }
        if(this.state.formControls.leadFunnels.value){
            body['leadFunnels'] = this.state.formControls.leadFunnels.value.value;
        }      
        if(this.state.formControls.publisherIds.value){
            body['publisherIds'] = this.state.formControls.publisherIds.value.value;
        }
        if(this.state.formControls.leadType.value){
            body['leadType'] = this.state.formControls.leadType.value.value;
        }
       
        if(this.state.formControls.leadStatus.value){
            body['leadStatusId'] = this.state.formControls.leadStatus.value.value;
        }
        if(this.state.formControls.from.value){
            body['startDate'] = new Date(this.state.formControls.from.value);
        }
        if(this.state.formControls.to.value){
            body['endDate'] = new Date(this.state.formControls.to.value);
        } 
   
        this.setState({
            rolesFetched: true
        })
        if( !!this.props.leadAssign){
            getLeadAssign(body)
            .then(r => r.json())
            .then( data => {
                if(data.success){
                    this.setState({
                        leads: data.leads,
                        hasNext: data.hasNext, 
                     });
                     if(this.state.filtersApplied){
                         ToastsStore.success("Filters Applied.");
                     }else{
                         ToastsStore.success(data.message);
                     }
                }else{
                    ToastsStore.error(data.message);
                }
                this.setState({
                    loader: false
                })
                // console.log(this.state.leads);
            })
            .catch(error =>{
                // console.log(error);
                this.setState({
                    loader: false, 
                })
            })
        }
        else{  
        
        getLead(body)
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                this.setState({
                    leads: data.leads,
                    hasNext: data.hasNext, 
                 });
                 if(this.state.filtersApplied){
                     ToastsStore.success("Filters Applied.");
                 }else{
                     ToastsStore.success(data.message);
                 }
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                loader: false
            })
            // console.log(this.state.leads);
        })
        .catch(error =>{
            // console.log(error);
            this.setState({
                loader: false, 
            })
        })
    }
}

    checkForAppliedFilters(){
        if(utils.tempCache && utils.tempCache.bucketName && this.state.leadFunnels && this.state.leadFunnels.length>0){
            this.state.leadFunnels.forEach(e => {
                if(e === utils.tempCache.bucketName){
                    let temp = this.state.formControls;
                    temp.leadFunnels.value = {"value": e, "label": e };
                    this.setState({
                        formControls: temp,
                        filtersApplied: true
                    })
                }
            });  
        } 
    }

    closePopup(){
        if(this.state.filterPopup){
            this.setState({
                filterPopup:false
            })
        }
    }

    togglePopup(type){
        if(type==='filter'){
            this.setState({
                filterPopup:true
            },()=>{
                if(!this.state.filtersApplied){
                    this.clearFilters(true);
                }
                this.fetchFilters();
            })
        }else{
            this.openLeadPush();
            let c = utils.campns;
            let p = utils.publIds;
            if(c && c.length > 0 && p && p.length >0){
                this.setState({
                    campaigns: c,
                    publIds: p
                })
            } else {
                this.fetchFilters();
            }    
        }
    }

    fetchFilters(isForCheck){
        if(isForCheck){
            this.setState({
                rolesFetched: true
            })
        }
        const body={};
        getLeadFilter(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    // pageuids:data.pageuids,
                    leadType:data.leadTypes,
                    // campaignName:data.campaignName,
                    campaignName:data.campaigns,
                    leadFunnels:data.leadFunnels,
                    buckets:data.buckets,
                    publisherIds:data.publisherIds,
                    campaigns: data.campaigns,
                    publIds: data.publishers
                },()=>{
                    if(isForCheck){
                        this.checkForAppliedFilters();
                    }
                    utils.campns = data.campaigns;
                    utils.publIds = data.publishers;
                })
            }
        })
       
        .catch(error =>{
             console.error(error);
        })
    }

    submitFilter(){
        this.setState({
            filterPopup:false,
            filtersApplied:true
        },()=>{
            this.saveFilters();
        })
    }
    
    formatMulSelectData(data){
        let arr = [];
        if(data && data.length>0){
            data.forEach(e=> {
                let obj = {
                    "value": e, 
                    "label": e 
                }
                arr.push(obj);
            });   
        }
        return arr;
    }

    formatMulSelectDataCampaign(data){
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

    formatMulSelectLeadStatus(data){
        let arr = [];
        if(data && data.length>0){
            data.forEach(e=> {
                let obj = {
                    "value": e.id, 
                    "label": e.disposition 
                }
                arr.push(obj);
            });    
        }
        return arr;
    }

    clearFilters(onlyFormControls){
        let temp = this.state.formControls;
        temp.utmSource.value = "";
        temp.utmMedium.value = "";
        temp.leadType.value = "";
        temp.from.value = "";
        temp.to.value = "";
        temp.mobile.value="";
        temp.leadId.value = "";
        temp.campaignName.value="";
        temp.leadFunnels.value="";
        temp.leadStatus.value="";
        temp.buckets.value="";
        temp.publisherIds.value="";
        if(onlyFormControls){
            this.setState({
                formControls: temp
            })
        }else{
            this.setState({
                formControls:temp,
                filterPopup:false,
                filtersApplied:false
            },()=>{
                this.fetchLeads();
                localStorage.removeItem("leadFilters");
            })
        }
    }

    getDownloadUrl(){
        let body = {};
        if(this.state.filtersApplied){
            // if(this.state.formControls.pageuids.value){
            //     body['pageuuids'] = this.parseMulSelectData(this.state.formControls.pageuids.value);
            // }
            // if(this.state.formControls.utmSource.value){
            //     body['pageuuids'] = this.state.formControls.utmSource.value;
            // }
            // if(this.state.formControls.utmMedium.value){
            //     body['pageuuids'] = this.state.formControls.utmSource.value;
            // }
            if(this.state.formControls.leadType.value){
                body['leadTypes'] = this.state.formControls.leadType.value.value;
            }
            if(this.state.formControls.utmSource.value){
                body['utmSource'] = this.state.formControls.utmSource.value;
            }
            if(this.state.formControls.mobile.value){
                body['mobile'] = this.state.formControls.mobile.value;
            }
            if(this.state.formControls.utmMedium.value){
                body['utmMedium'] = this.state.formControls.utmMedium.value;
            }
            if(this.state.formControls.campaignName.value){
                body['campaignName'] = this.state.formControls.campaignName.value.value;
            }
            if(this.state.formControls.leadFunnels.value){
                body['leadFunnels'] = this.state.formControls.leadFunnels.value.value;
            }
            
            if(this.state.formControls.leadStatus.value){
                body['leadStatus'] = this.state.formControls.leadStatus.value.value;
            }
            if(this.state.formControls.buckets.value){
                body['buckets'] = this.state.formControls.buckets.value;
            }
            if(this.state.formControls.publisherIds.value){
                body['publisherIds'] = this.state.formControls.publisherIds.value.value;
            }
            if(this.state.formControls.from.value){
                body['startDate'] = new Date(this.state.formControls.from.value);
            }
            if(this.state.formControls.to.value){
                body['endDate'] = new Date(this.state.formControls.to.value);
            }    
            if(this.state.formControls.leadId.value){
                body['leadId'] = new Date(this.state.formControls.leadId.value);
            }
            let url = "?"+utils.jsonToQueryString(body);
            return url;
        }else{
            return "";
        }
    }
    
    switchLeadView(type,index){
        if(type === 'detail'){
            this.setState({         
                    isDetailView: true,
                    indexToEdit: index            
               // indexToEdit: index+this.state.start
            })
        }else{
            this.setState({
                isDetailView: false,
                indexToEdit: 0
            })
        }
    }

    handleChange(event,name) {
        let temp = this.state.formControls;
        temp[name].value = event;
        this.setState({
            formControls: temp
        },()=>{this.conditionalLeadStatus()}
        );       
    }
    
    conditionalLeadStatus(){
        if (this.state.formControls.campaignName.value.value){
            this.fetchLeadStatus();
        }
    }

    updateCurrentStatus(status){  
        let temp = this.state.leads;
        temp[this.state.indexToEdit].status = status;
        this.setState({
            leads:temp
        })
    }

    textHandleChange(event){
        const name=event.target.name;
        const value=event.target.value;
        this.setState({
            formControls:{
                ...this.state.formControls,
                [name]: {
                    ...this.state.formControls[name],
                    value
                }
            }
        })
    }

    dateChange(event,name){
        let temp = this.state.formControls;
        if(name === 'from'){
            temp.from.value = event;
        }else{
            temp.to.value = event;
        }
        this.setState({
            formControls:temp
        })
    }

    openLeadPush(){
        this.setState({
            openPopup: true
        })
    }

    closeLeadPush(){
        this.setState({
            openPopup: false
        })
    }

    fileUploadChangeHandler = (event) => {
        this.setState({
            file: event.target.files
        });  
    }

    verifyError(){
        let val = document.getElementById("lpCampId").value;
        if(!val){
            this.setState({
                error: "Please select Campaign."
            })
            return;
        }
        else if(!this.state.fileFormat){
            this.setState({
                error: "Please select file format."
            })
            return;
        }
        else if(!this.state.file){
            this.setState({
                error: "Please select file."
            }) 
            return;
        }
        else{
            this.setState({
                error: null
            }) 
        }

        if(!this.state.error){
            this.leadDataPush(); 
        }
    }
      
    leadDataPush(){
        let val = document.getElementById("lpCampId").value;
        let val2 = document.getElementById("publId").value;
        // if(!val || !val2 || !this.state.file){
        //     this.setState({
        //         error: "All Fields are mandatory."
        //     })
        //     return;
        // }else{
        //     this.setState({
        //         error: "",
        //         confirmationLoader: true
        //     })
            let data = new FormData();
            data.append("leads",this.state.file[0]);
            data.append("campaignId",val);
            data.append("vendorUid",val2);
            data.append("fileFormat",this.state.fileFormat.toUpperCase());
            leadPushBySheet(data)
            .then(response => response.json())
            .then(data =>{                
                if(data.success){
                    let msg = data.pushedLeads + " Leads pushed successfully."
                    ToastsStore.success(msg,4000);  
                    this.closeLeadPush();      
                }
                else{
                    ToastsStore.error(data.message,4000);
                }
                this.setState({
                    confirmationLoader: false
                });
            })
            .catch(error=>{
                ToastsStore.error("Something went wrong, please try again later !!!");
                this.setState({
                    confirmationLoader:false
                })
            })  
        // }
    }
    verifyAddLead(){
        const leadArr = this.state.addLead;     
        for(let fields in leadArr){
            if((fields === "name") || (fields === "mobile") || (fields === "campaignId") || (fields === "pubId")){
                if(!leadArr[fields]){
                    ToastsStore.error(`${fields} is mandatory`);
                    leadArr.error=`${fields === "pubId" ? "Publisher Id" : fields} is mandatory`;
                    this.setState({
                        addLead: leadArr
                    })
                    return;
                }
                else{
                    leadArr.error= null;
                    this.setState({
                        addLead: leadArr
                    })
                }
            }
        }
        this.submitLead();
    }

    leadChangeHandler(event){
        const name = event.target.name;
        const value = event.target.value;
        const leadArr = this.state.addLead;
        leadArr[name] = value;
        this.setState({
            addLead: leadArr
        })
    }

    render(){
        let btnClassP = classNames({
            'ui small right floated icon left labeled button': true,
            'disabled' : this.state.start === 0
        });
        let btnClassN = classNames({
            'ui small right floated icon right labeled button': true,
            'disabled' : !this.state.hasNext
        });
        let url =  this.getDownloadUrl(); 
      return(
          <React.Fragment>
            {
                this.state.rolesFetched &&
                <section className="wrapper-container">
                    {
                        this.state.isDetailView &&
                            <LeadDetail history={this.props.history}  updateCurrentStatus={this.updateCurrentStatus.bind(this)} switchLeadView={this.switchLeadView.bind(this)}  back="leadTable" leadData={this.state.leads[this.state.indexToEdit]}></LeadDetail>  
                    }
                    {/* {
                        this.props.task && this.props.task === "view" &&
                        <LeadDetail leadData={this.state.leads[this.props.id]} />
                    } */}
                    {
                        !this.state.isDetailView &&
                        <div>
                            <div className="flex flex-space--btw">
                                <div className="col-11" style={{color:'rgba(0,0,0,.87)',fontSize:'1.28em',lineHeight:'27px',fontWeight:'bold'}}>Leads</div>
                                <div>
                                {/* <div className={`${utils.isMobile ? "margin-left-one":"margin-left-fifty"} col-15 flex margin-left-fourfour margin-right`} style={{overflowX:"auto"}}> */}
                                        <button onClick={()=>this.setState({openLead: true})} className="ui tiny blue button margin-left--half">Add Lead</button>
                                        {
                                            utils.hasRole('lead_download') &&
                                            <a href={`/lead/export-leads${url}`} download="leads.csv">
                                                <button className='ui tiny icon button'>Download Leads&nbsp;<i aria-hidden="true" className="download icon"></i></button>
                                            </a>
                                        }
                                        {
                                            this.state.filtersApplied &&
                                            <button onClick={() => this.clearFilters()} className="ui tiny grey button margin-right--half">Clear Filters</button>                            
                                        }    
                                        <button onClick={() => this.togglePopup('filter')} className="ui tiny teal button margin-left--half">Filter</button>
                                        <button onClick={() => this.togglePopup('upload')} className="ui tiny green button margin-left--half">Upload Leads</button>
                                </div>
                            </div>
                            {/* <div className={`${utils.isMobile ? "table-height-mobile" : "table-height-desktop"} margin-top leads-table-wrapper`}> */}
                            <div className="margin-top leads-table-wrapper" 
                                style = { utils.isMobile ? {maxHeight: "65vh"} : {maxHeight: "70vh"}}
                            >
                            <table className="client">
                                <thead>
                                    <tr style={{textAlign:'center'}}>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Campaign Name</th>
                                        <th>Personal Details</th>
                                        <th>Contact Details</th>
                                        <th>Source</th>                           
                                        <th>Lead Type</th>
                                        <th>Lead Funnel</th>
                                        <th>Lead Status</th>
                                        <th>Publisher ID</th>
                                        <th>Bucket</th>
                                        <th>Campaign</th>
                                        <th>Medium</th>                         
                                        <th>S1</th>
                                        <th>S2</th>
                                        <th>S3</th>
                                        <th>Action</th>             
                                    </tr>
                                </thead>
                                    <tbody>    
                                        {this.state.leads.map((item,index)=>{
                                            return(
                                                <tr key={index}>
                                                    {
                                                        item.created ?
                                                            (<React.Fragment>
                                                                <td className="one wide" style={{width:'9%'}}><Moment format="YYYY/MM/DD">{item.created}</Moment></td>
                                                                <td className="one wide" style={{minWidth:'6em'}}><Moment format="HH:mm a z">{item.created}</Moment></td> 
                                                            </React.Fragment>) 
                                                            : 
                                                            (<React.Fragment> 
                                                                <td>--</td>
                                                                <td>--</td>
                                                            </React.Fragment>)
                                                    }
                                                    <td>{item.campaignName ? item.campaignName : "--"}</td>
                                                    <td>
                                                        <h4 className="ui image header">
                                                            <div className="content">
                                                                {item.name ? item.name : "--"} 
                                                                <div className="sub header">
                                                                    { item.gender && 
                                                                    <div style={{paddingTop:'4px'}}>{item.gender} <br/></div>              
                                                                    }
                                                                    <div style={{paddingTop:'4px'}}>{item.city}&nbsp;{item.pincode}</div>
                                                                </div>
                                                            </div>
                                                        </h4>
                                                    </td>
                                                    <td>
                                                        <h4 className="ui image header">
                                                            <div className="content">
                                                                {item.mobile} 
                                                                <div className="sub header" style={{wordBreak:'break-all',paddingTop:'4px'}}>
                                                                    {item.email}
                                                                </div>
                                                            </div>
                                                        </h4>
                                                    </td>
                                                    <td className="one wide" style={{width:'10%',wordBreak:'break-all'}}>{item.utmSource ? item.utmSource : "--"}</td> 
                                                    <td>{item.leadType ? item.leadType : "--"}</td>
                                                    <td>{item.leadFunnel ? item.leadFunnel : "--"}</td>
                                                    <td>{item.status ? item.status:"--"}</td>
                                                    <td>{item.publisherId ? item.publisherId : "--"}</td>
                                                    <td>{item.bucket ? item.bucket : "--"}</td> 
                                                    <td>{item.utmCampaign ? item.utmCampaign : "--"}</td>
                                                    <td>{item.utmMedium ? item.utmMedium : "--"}</td> 
                                                    <td>{item.index1 ? item.index1 : "--"}</td>
                                                    <td>{item.index2 ? item.index2 : "--"}</td>
                                                    <td>{item.index3 ? item.index3 : "--"}</td> 
                                                    <td> 
                                                        <button onClick={()=>this.switchLeadView('detail',index)} className="ui icon right labeled tiny button">
                                                            <i aria-hidden="true" className="right arrow icon"></i>
                                                            View Details
                                                        </button>
                                                    </td>                                 
                                                </tr>                              
                                                );
                                        })}
                                    </tbody>
                                    <tfoot className={`${utils.isMobile ? 'left-thirty': 'leftTwoTen'} full-width leads-table-footer`}>
                                        {
                                            !utils.isMobile &&
                                            <tr  style={{width:'100%',display:'block'}}>
                                                <th colSpan="2" className="col-4">
                                                    {
                                                        this.state.leads && this.state.leads.length > 0 &&
                                                        <div style={{fontSize:'13px'}}>Showing results from <span>{this.state.start + 1}</span> to <span>{this.state.start + this.state.leads.length}</span> </div>
                                                    }
                                                </th>
                                                <th colSpan="11" className="col-2" style={{borderLeft:'none'}}>
                                                    {
                                                        !this.state.loader && 
                                                        <button className={btnClassN} onClick={()=>this.getLeads('next')}>Next<i aria-hidden="true" className="chevron right icon"></i></button>
                                                    }
                                                    {
                                                        !this.state.loader && 
                                                        <button className={btnClassP} onClick={()=>this.getLeads('previous')}><i aria-hidden="true" className="chevron left icon"></i>Previous</button>
                                                    }
                                                    {
                                                        this.state.loader &&
                                                        <div className="col-1 floated margin-left--auto margin-right right ui">
                                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                        </div>
                                                    }
                                                </th>
                                            </tr>
                                        }
                                        {
                                          !!utils.isMobile &&
                                          <React.Fragment>
                                            <tr  style={{width:'100%',display:'block'}} className="text--center">
                                                {
                                                    this.state.leads && this.state.leads.length > 0 &&
                                                    <div style={{fontSize:'13px'}}>Showing results from <span>{this.state.start + 1}</span> to <span>{this.state.start + this.state.leads.length}</span> </div>
                                                }
                                            </tr> 
                                            <tr style={{width:'100%',display:'block',borderLeft:'none'}}  className="margin-left--auto margin-right--auto">
                                                {
                                                    !this.state.loader && 
                                                    <button className={btnClassN} onClick={()=>this.getLeads('next')}>Next<i aria-hidden="true" className="chevron right icon"></i></button>
                                                }
                                                {
                                                    !this.state.loader && 
                                                    <button className={btnClassP} onClick={()=>this.getLeads('previous')}><i aria-hidden="true" className="chevron left icon"></i>Previous</button>
                                                }
                                                {
                                                    this.state.loader &&
                                                    <div className="col-1 floated margin-left--auto margin-right right ui">
                                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                    </div>
                                                }
                                            </tr>
                                        </React.Fragment>
                                        }

                                    </tfoot>
                                </table>
                            </div>  
                            {
                                !!this.state.openLead &&
                                <PopUp maxHeight={utils.isMobile ? "650px":"620px"} title="Add Lead" togglePopup={()=>this.setState({openLead: false})}>
                                    <AddLead  
                                        submitLead={this.verifyAddLead.bind(this)} 
                                        togglePopup={()=>this.setState({openLead: false})}
                                        changeHandler={this.leadChangeHandler.bind(this)}
                                        leadArr={this.state.addLead}
                                    />
                                </PopUp>
                            }
                            { 
                                this.state.filterPopup &&
                                <PopUp title={'Lead Filter'} togglePopup={this.closePopup.bind(this)} >
                                    <LeadFilter
                                        // pageuids={this.formatMulSelectData(this.state.pageuids)}
                                        publisherID={this.state.publisherIds} 
                                        publisherIdsObjArray={this.formatMulSelectData(this.state.publisherIds)}
                                        leadTypeObjArray={this.formatMulSelectData(this.state.leadType)}
                                        // utmSourceObjArray={this.formatMulSelectData(this.state.utmSource)}
                                        // utmMediumObjArray={this.formatMulSelectData(this.state.utmMedium)}
                                        //campaignNameObjArray={this.formatMulSelectData(this.state.campaignName)}                                       
                                        campaignNameObjArray={this.formatMulSelectDataCampaign(this.state.campaignName)}
                                        leadFunnelObjArray={this.formatMulSelectData(this.state.leadFunnels)}
                                        bucketObjArray={this.formatMulSelectData(this.state.buckets)}
                                        // changeHandler={this.changeHandler.bind(this)}
                                        formControls={this.state.formControls}
                                        selectChange={this.handleChange.bind(this)}
                                        textHandleChange={this.textHandleChange.bind(this)}
                                        submitData={this.submitFilter.bind(this)}
                                        dobChange={this.dateChange.bind(this)}
                                        clear={this.clearFilters.bind(this)}
                                        togglePopup={this.closePopup.bind(this)}
                                        leadStatusObjArray={this.state.leadStatus}>
                                    </LeadFilter>
                                </PopUp>
                            }
                            {
                                this.state.openPopup &&
                                <PopUp title="Upload Leads" togglePopup={this.closeLeadPush.bind(this)}>
                                    <div className="senderId-modal--wrapper pad">                      
                                        <div className="label">Campaign&nbsp;
                                            <Popup
                                                trigger={<Icon name='info circle' color="blue"/>}
                                                content='Campaign to which Lead will be Pushed'
                                                position='bottom left'
                                                style={style}
                                                inverted
                                            />
                                        </div>
                                        <select id="lpCampId" className="form-control" >
                                            <option value="" hidden>--Choose Campaign--</option>
                                            {
                                                this.state.campaigns.map((item,index) => {
                                                    return(
                                                        <option key={index} value={item.id}>{item.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                        <div className="label margin-top">Vendor&nbsp;
                                            <Popup
                                                trigger={<Icon name='info circle' color="blue"/>}
                                                content='Vendor of which Leads need to be Pushed'
                                                position='bottom left'
                                                style={style}
                                                inverted
                                            />
                                        </div>
                                        <select id="publId" className="form-control" >
                                            <option value="" hidden>--Choose Vendor--</option>
                                            {
                                                this.state.publIds.map((item,index) => {
                                                    return(
                                                        <option key={index} value={item.businessUid}>{item.businessName}&nbsp;{!!item.publisherId ? ' - '+item.publisherId: ''}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                        <article className="margin-top">            
                                            <div><b>Please select format</b></div>
                                            <form className="flex align-space-between" style={{border:"1px solid rgba(204, 204, 204,0.5)",borderRadius: "5px",padding:"5px", width:"125%"}}>
                                                <span>
                                                    <input type="radio" id=".xls" value=".xls" name=".xls" checked={this.state.fileFormat === ".xls"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                                    <label for=".xls">XLS</label>
                                                    <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/lead/Lead_Sample_XLS.xls" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xls Template</u></b></a></div>
                                                </span>
                                                <span>
                                                    <input type="radio" id=".xlsx" value=".xlsx" name=".xlsx" checked={this.state.fileFormat === ".xlsx"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                                    <label for=".xlsx">XLSX</label>
                                                    <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/lead/Lead_Sample_XLSX.xlsx" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xlsx Template</u></b></a></div>
                                                </span>
                                                <span>
                                                    <input type="radio" id=".csv" value=".csv" name=".csv" checked={this.state.fileFormat === ".csv"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                                    <label for=".csv">CSV</label>
                                                    <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/lead/Lead_Sample_CSV.csv" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download csv Template</u></b></a></div>
                                                </span>
                                            </form>
                                        </article>
                                    {
                                        this.state.fileFormat &&
                                        <div className="col-20 margin-top" style={{border:"1px solid rgba(204, 204, 204,0.5)",borderRadius: "5px",padding:"12px"}}>
                                            <input type="file" 
                                                className="ui input"
                                                accept={`${this.state.fileFormat}`} 
                                                name="file" 
                                                id="file"
                                                onChange={this.fileUploadChangeHandler}
                                                required
                                                />
                                                <p style={{color:"green"}}>Please upload {`${this.state.fileFormat}`} file only</p>
                                        </div>
                                    }
                                        
                                    </div> 
                                    {
                                        this.state.error &&
                                        <div className="form-error margin-top">{this.state.error}</div>
                                    }
                                    <div className="dialog-footer pad">   
                                        {
                                            !this.state.confirmationLoader && 
                                            <div>
                                                <button className="ui button" onClick={()=>this.closeLeadPush()}>
                                                    Back
                                                </button>                    
                                                <button onClick={()=>this.verifyError()} className="ui green button">Upload Leads</button>
                                            </div>
                                        }
                                        {
                                            this.state.confirmationLoader &&
                                            <div>
                                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                            </div>
                                        }
                                    </div>  
                                </PopUp>
                            }
                        </div>
                    }   
                    <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />    
                </section>
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