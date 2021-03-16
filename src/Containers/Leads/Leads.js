import React from 'react';
import PageTitle from '../../Components/Helmet';
import {getLeadSummary,getLeadFilter,getLeadStatus,leadPushBySheet} from '../../Services/lead-service';
import {fetchRoles} from '../../Services/roles-service';
import LeadFilter from '../../Components/Lead/LeadFilter';
import PopUp from '../../Components/Popup/Popup';
import classNames from 'classnames';
import utils from '../../Services/utility-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import { Icon,Popup } from 'semantic-ui-react';
import './Leads.css'

const style = {
    borderRadius: 0,
    opacity: 0.85,
    padding: '1em',
}
export default class Leads extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            fileFormat:null,
            propspectus:[],
            filterPopup:false,
            filtersApplied:false,
            leadType:[],
            status:[],
            campaignName:[],
            utmSource:[],
            leadStatus:[],
            leadFunnels:[],
            buckets:[],
            rolesFetched:false,
            accessDenied:false,
            publisherIds:[],
            openPopup: false,
            campaigns:[],
            publIds:[],
            file: null,
            confirmationLoader: false,
            error:"",
            vendors: [],
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
                campaignName:{
                    value:''
                },
                leadFunnels:{
                    value:''
                },
                buckets:{
                    value:''
                },
                leadStatus:{
                    value:''
                },
                publisherIds:{
                    value:''
                },
                mobile:{
                    value:''
                },
                leadId:{
                    value:''
                }
            },
        }
    }

    componentDidMount(){
        if(utils.isAdmin){
            this.checkForSavedFilters();
            // this.fetchLeadStatus();
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

    radioChangeHandler(event,params){
     
            this.setState({
                fileFormat: event.target.value
            })
           
        
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

    getRequiredRoles(){
        fetchRoles('Leads')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
                this.checkForSavedFilters();
            }else if(data.success && data.subRoles && data.subRoles.length === 0){
                this.setState({
                    accessDenied:true
                })
            }else{
                ToastsStore.error("Something went wrong, Please Try Again Later!!!");
            }
        })
        .catch(error =>{
             console.error(error);
             ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    checkForSavedFilters(){
        this.setState({
            rolesFetched: true
        })
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
            if(filters.campaignName){
                temp.campaignName.value = filters.campaignName;
            }
            if(filters.leadStatus){
                temp.leadStatus.value = filters.leadStatus;
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
            if(filters.from){
                temp.from.value = new Date(filters.from);
            }
            if(filters.to){
                temp.to.value = new Date(filters.to);
            }
            if(filters.mobile){
                temp.mobile.value = filters.mobile;
            }
            if(filters.leadId){
                temp.leadId.value = filters.leadId;
            }
            this.setState({
                formControls: temp,
                filtersApplied: true
            },()=>{
                this.getSummaryData();
            })
        }else{
            this.getSummaryData();
        }
    }

    handleCardClick(index){
        utils.tempCache['bucketId']=this.state.propspectus[index].bucketId;
        utils.tempCache['bucketName']=this.state.propspectus[index].bucketType;
        this.props.history.push("/leads");
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
        if(this.state.formControls.leadFunnels.value){
            obj['leadFunnels'] = this.state.formControls.leadFunnels.value;
        }
        if(this.state.formControls.leadStatus.value){
            obj['leadStatus'] = this.state.formControls.leadStatus.value;
        }      
        if(this.state.formControls.publisherIds.value){
            obj['publisherIds'] = this.state.formControls.publisherIds.value;
        }
        if(this.state.formControls.leadType.value){
            obj['leadType'] = this.state.formControls.leadType.value;
        }
        if(this.state.formControls.from.value){
            obj['from'] = this.state.formControls.from.value;
        }
        if(this.state.formControls.to.value){
            obj['to'] = this.state.formControls.to.value;
        }
        if(this.state.formControls.mobile.value){
            obj['mobile'] = this.state.formControls.mobile.value;
        }
        if(this.state.formControls.leadId.value){
            obj['leadId'] = this.state.formControls.leadId.value;
        }
        localStorage.setItem("leadFilters",JSON.stringify(obj));
        this.getSummaryData();
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
    
    fetchFilters(){
        const body={};
        getLeadFilter(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    status:data.status,
                    //campaignName:data.campaignName,
                    campaignName:data.campaigns,
                    utmSource:data.utmSource,
                    leadFunnels:data.leadFunnels,
                    buckets:data.buckets,
                    publisherIds:data.publisherIds,
                    leadType:data.leadTypes,
                    campaigns: data.campaigns,
                    publIds: data.publishers
                },()=>{
                    utils.campns = data.campaigns;
                    utils.publIds = data.publishers;
                })
            }
        })
        .catch(error =>{
             console.log(error);
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

    // parseMulSelectData(data){
    //     let arr = [];
    //     if(data && data.length>0){
    //         data.forEach(e=> {
    //             arr.push(e.value);
    //         });
    //     }
    //     return arr;
    // }

    handleChange(event,name) {   
        let temp = this.state.formControls;
        temp[name].value = event;
        this.setState({
            formControls: temp
        },()=>{this.conditionalLeadStatus()})
    }

    conditionalLeadStatus(){
        if (this.state.formControls.campaignName.value.value){
            this.fetchLeadStatus();
        }
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
                this.getSummaryData();
                localStorage.removeItem("leadFilters");
            })
        }
    }

    getSummaryData(){
        let body = {};
        // if(this.state.formControls.pageuids.value){
        //     body['pageuuids'] = this.parseMulSelectData(this.state.formControls.pageuids.value);
        // }
        // if(this.state.formControls.utmSource.value){
        //     body['pageuuids'] = this.state.formControls.utmSource.value;
        // }
        // if(this.state.formControls.utmMedium.value){
        //     body['pageuuids'] = this.state.formControls.utmSource.value;
        // }
        if(this.state.formControls.utmSource.value){
            body['utmSource'] = this.state.formControls.utmSource.value;
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
            body['leadStatusId'] = this.state.formControls.leadStatus.value.value;
        }      
        if(this.state.formControls.publisherIds.value){
            body['publisherIds'] = this.state.formControls.publisherIds.value.value;
        }
        if(this.state.formControls.leadType.value){
            body['leadType'] = this.state.formControls.leadType.value.value;
        }
        if(this.state.formControls.from.value){
            body['startDate'] = new Date(this.state.formControls.from.value);
        }
        if(this.state.formControls.to.value){
            body['endDate'] = new Date(this.state.formControls.to.value);
        }
        if(this.state.formControls.leadId.value){
            body['leadId'] = this.state.formControls.leadId.value;
        }
        if(this.state.formControls.mobile.value){
            body['mobile'] = this.state.formControls.mobile.value;
        }
        
        getLeadSummary(body)
        .then(response => response.json())
        .then(data =>{
         //let data={ "success": true, "message": null, "allowedActions": [], "counts": [ { "bucketType": "Prospecting", "count": 162, "bucketId": 1 }, { "bucketType": "Discovery", "count": 978, "bucketId": 2 }, { "bucketType": "Evaluation/Intent", "count": 724, "bucketId": 3 }, { "bucketType": "Purchased", "count": 157, "bucketId": 4 }, { "bucketType": "Dropped", "count": 728, "bucketId": 5 }] };
            if(data.success){
                this.setState({
                    propspectus:data.counts,
                });
                if(this.state.filtersApplied){
                    ToastsStore.success("Filters Applied.");
                }else{
                    ToastsStore.success(data.message);
                }
            }else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
             console.log(error);
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
   
    changeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
                formControls: {
                    ...this.state.formControls,
                    [name]: {
                    ...this.state.formControls[name],
                    value
                    }
                }
        });
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

    // fetchVendorsList(){
    //     getPublisherVendor({})
    //     .then( response => response.json())
    //     .then( data => {
    //         if(data.success){
    //             this.setState({
    //                 vendors: data.clients
    //             });
    //         }
    //         else{
    //             ToastsStore.error(data.message); 
    //         }
    //     })
    //     .catch( error => {
    //         console.log(error);
    //     })
    // }

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
        let val2 = document.getElementById("vendorId").value;
        // if(!val || !this.state.file || this.state.fileFormat){
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
        
    }

    render(){
        let url =  this.getDownloadUrl(); 
        return(
            <React.Fragment>
                <PageTitle title="Lead Summary" description="Welcome to Lead Summary"/>
                {   this.state.rolesFetched &&
                    <main className="wrapper-container">
                        <div className="flex margin-btm--double">
                            <div className="col-11" style={{color:'rgba(0,0,0,.87)',fontSize:'1.28em',lineHeight:'27px',fontWeight:'bold'}}>Lead Summary</div>
                            <div className={`${utils.isMobile ? "margin-left-ten":"margin-left-fourfour"} col-15 flex margin-left-fourfour margin-right`} style={{overflowX:"auto"}}> 
                            <a href={`/lead/export-leads${url}`} download="leads.csv">
                                <button className='ui tiny icon button'>Download Leads&nbsp;<i aria-hidden="true" className="download icon"></i></button>
                            </a>                 
                                {
                                    this.state.filtersApplied &&
                                    <button onClick={() => this.clearFilters()} className="ui tiny grey button margin-right--half">Clear Filters</button>                            
                                }
                                <button onClick={() => this.togglePopup('filter')} className="ui tiny teal button margin-left--half">Filter</button>
                                <button onClick={() => {return(this.togglePopup('upload'),this.setState({fileFormat:null}))}} className="ui tiny green button margin-left--half">Upload Leads</button>            
                            </div>
                        </div>
                        <div className="ui cards">
                            {
                                utils.hasRole('lead_stats') && this.state.propspectus && this.state.propspectus.length>0 && this.state.propspectus.map((item,index) => {
                                    let colorClass = classNames({
                                        'text-dropped' : item.bucketType === 'Dropped',
                                        'text-purchased' : item.bucketType === 'Prospecting' || item.bucketType === 'Purchased' ,
                                        'text-intent' : item.bucketType === 'Discovery'
                                    });
                                    return(
                                        <div key={index} className="ui card" onClick={()=>this.handleCardClick(index)} style={{width:'18em',cursor:'pointer'}}>
                                            <div className="content" style={{padding:'1.5em 1em 0.8em 1em'}}>
                                                <div className={`header ${colorClass}`}>{item.count}</div>
                                                <div className={`summary ${colorClass}`} style={{padding:'3px 0'}}>{item.bucketType}</div>
                                                <div className="right floated" style={{fontSize:'12px',color:'#7391b8'}}>
                                                    View Details&nbsp;<i aria-hidden="true" className="right arrow icon"></i>
                                                </div>  
                                            </div>
                                        </div>
                                    );              
                                })
                            }
                        </div>
                        { 
                            this.state.filterPopup &&
                            <PopUp title={'Lead Filter'} togglePopup={this.closePopup.bind(this)} >
                            <LeadFilter
                                publisherID={this.state.publisherIds}
                                publisherIdsObjArray={this.formatMulSelectData(this.state.publisherIds)}
                                leadTypeObjArray={this.formatMulSelectData(this.state.leadType)}
                                //utmSourceObjArray={this.formatMulSelectData(this.state.utmSource)}
                                //utmMediumObjArray={this.formatMulSelectData(this.state.utmMedium)}
                                campaignNameObjArray={this.formatMulSelectDataCampaign(this.state.campaignName)}
                                leadFunnelObjArray={this.formatMulSelectData(this.state.leadFunnels)}
                                bucketObjArray={this.formatMulSelectData(this.state.buckets)}
                                changeHandler={this.changeHandler.bind(this)}
                                formControls={this.state.formControls}
                                submitData={this.submitFilter.bind(this)}
                                selectChange={this.handleChange.bind(this)}
                                textHandleChange={this.changeHandler.bind(this)}
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
                                    <div className="label margin-top">Vendor/Publisher&nbsp;
                                        <Popup
                                            trigger={<Icon name='info circle' color="blue"/>}
                                            content='Publisher of which Leads need to be Pushed'
                                            position='bottom left'
                                            style={style}
                                            inverted
                                        />
                                    </div>
                                    <select id="vendorId" className="form-control" >
                                        <option value="" hidden>--Choose Vendor--</option>
                                        {
                                            this.state.publIds.map((item,index) => {
                                                return(
                                                    <option key={index} value={item.businessUid}>{item.businessName}&nbsp;{!!item.publisherId ? ' - '+item.publisherId: ''}</option>
                                                );
                                            })
                                        }
                                    </select>
                                    {
                                       
                                    
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
                                    }
                                    {
                                        this.state.fileFormat &&
                                        <div className="col-19 margin-top" style={{border:"1px solid rgba(204, 204, 204,0.5)",borderRadius: "5px",padding:"12px"}}>
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
                                    <div className="form-error margin-left--auto margin-right--auto">{this.state.error}</div>
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
