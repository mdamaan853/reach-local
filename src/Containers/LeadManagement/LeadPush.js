import React,{Component} from 'react';
import {Link} from 'react-router-dom'; 
import LeadFilter from '../../Components/Lead/LeadFilter';
import {getCount, getLeadFilter, getLeadStatus, pushLeadsApi} from '../../Services/lead-service';
import utils from '../../Services/utility-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';
// import { Icon,Popup } from 'semantic-ui-react';


// const style = {
//     borderRadius: 0,
//     opacity: 0.85,
//     padding: '1em',
// }

class LeadPush extends Component{

    constructor(props){
        super(props);
        this.state={
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
            count: 0,
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
        this.fetchFilters();
        this.fetchLeadStatus();
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

    fetchFilters(){
        const body={};
        getLeadFilter(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    status:data.status,
                    campaignName:data.campaigns,
                    utmSource:data.utmSource,
                    leadFunnels:data.leadFunnels,
                    buckets:data.buckets,
                    publisherIds:data.publisherIds,
                    leadType:data.leadTypes,
                    campaigns: data.campaigns ? data.campaigns : [],
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

    submitFilter(){
        let body = {};
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
        getCount(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    count: data.leadCount
                })
                ToastsStore.success(data.message);
            }else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
             console.log(error);
        })
    }

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
        }
    }

    pushLeadsSubmit(){
        let val = document.getElementById("lpCampId").value;
        if(!val){
            this.setState({
                error: "Please choose Campaign to which Lead will be pushed."
            })
            return;
        }else{
            this.setState({
                error: "",
                confirmationLoader: true
            })
            let body = {
                dsCampaignId: val
            };
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
            pushLeadsApi(body)
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    ToastsStore.success(data.totalPushed + " Leads pushed successfully.",4000);
                    this.clearFilters();
                    this.setState({
                        count: 0
                    })
                }else{
                    ToastsStore.error(data.message);
                }
                this.setState({
                    confirmationLoader: false
                })
            })
            .catch(error =>{
                 console.log(error);
            })
        }    
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

    render(){
        return(
                    <React.Fragment>
                        <Link to="/leads/management" className="margin-btm--half">
                            <button className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                        </Link>
                        <div className="ui placeholder segment">
                            <div className="ui stackable very relaxed two column grid">
                                <div className="column">
                                    <div className="margin-top--half text--bold text--center text-intent" style={{fontSize:'17px',marginBottom:'-8px'}}>
                                        Select Leads by Applying Filters
                                    </div>
                                    <LeadFilter
                                        publisherID={this.state.publisherIds}
                                        publisherIdsObjArray={this.formatMulSelectData(this.state.publisherIds)}
                                        leadTypeObjArray={this.formatMulSelectData(this.state.leadType)}
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
                                        togglePopup={""}
                                        leadStatusObjArray={this.state.leadStatus}>
                                    </LeadFilter>
                                </div>
                                <div className="middle aligned column">
                                    <div className="text--center">
                                        <div className="margin-btm margin-top">
                                            <span style={{fontSize: '24px'}}>Leads Count:</span>&nbsp;
                                            <span style={{fontSize: '18px'}} className="text-purchased">{this.state.count}</span>
                                        </div>
                                        <div className="col-10 margin-btm margin-left--auto margin-right--auto">
                                            <div className="label" style={{textAlign:'left'}}>Campaign to which Lead will be Pushed&nbsp;</div>
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
                                        {
                                            this.state.error &&
                                            <div className="form-error">{this.state.error}</div>
                                        }
                                        </div>
                                        {
                                            this.state.confirmationLoader &&
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        }
                                        {
                                            !this.state.confirmationLoader &&
                                            <button className="ui green button" disabled={this.state.count === 0} onClick={()=>this.pushLeadsSubmit()}>Push Leads</button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="ui vertical divider"></div>
                        </div>
                        <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
                    </React.Fragment>
        );
    }
}
export default LeadPush;
