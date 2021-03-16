import React from 'react';
import PageTitle from '../../Components/Helmet';
import {getLeadUpload,getPublisherClient,getLeadCampaign} from '../../Services/lead-service';
import {fetchRoles} from '../../Services/roles-service';
import utils from '../../Services/utility-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';

class LeadReportUpload extends React.Component{

    constructor(props){
        super(props);
        this.state={
            file:"",
            fileFormat:"",
            sheetType:"",
            businessUID:"",
            campaignID:"",
            rolesFetched:false,
            accessDenied:false,
            submitLoader: false,
            clientName:[],
            campaigns:[]
        }
        this.fileUploadChangeHandler = this.fileUploadChangeHandler.bind(this);
        this.businessSelectChange = this.businessSelectChange.bind(this);
        this.fetchleadCampaign = this.fetchleadCampaign.bind(this);
    }

    // componentDidMount(){     
    //     if(utils.isAdmin){
    //         this.fetchPublisherClient();            
    //         this.setState({
    //             rolesFetched: true
    //         })
    //     }else{
    componentDidMount(){
        // if(utils.isAdmin){
        //     this.setState({
        //         rolesFetched: true
        //     })
        // }else{
            this.getRequiredRoles();
        //}
    }

    fetchleadCampaign(id){    
        let body={
            businessUID:id
        }
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

    fetchPublisherClient(){
        let body={}
        getPublisherClient(body)
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

    radioChangeHandler(event,params){
       
            this.setState({
                fileFormat: event.target.value
            })
        
    }

    getRequiredRoles(){
        fetchRoles('LeadReportUpload')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
                this.setState({
                    rolesFetched: true
                });
                this.fetchPublisherClient();
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

    fileUploadChangeHandler(event){
        this.setState({
            file: event.target.files
        });  
    }

    uploadHandler(){
        this.setState({
            submitLoader: true
        })
        var formData = new FormData();
       formData.append("lead",this.state.file[0]);
       formData.append("sheetType",this.state.sheetType);
       formData.append("businessUid",this.state.businessUID);
       formData.append("campaignId",this.state.campaignID);
       formData.append("fileType",this.state.fileFormat.toUpperCase());
       getLeadUpload(formData)
       .then(response=>response.json())
       .then(data=>{        
           if(data.success){
            ToastsStore.success(data.message);
            let str = (data.processed > 1) ? data.processed+" rows processed" : data.processed+" row processed";
                ToastsStore.success(str);
           }
           else{
            ToastsStore.success(data.message);
           }
           this.setState({
            submitLoader: false
           })
       })
       .catch(error=>{
            console.log(error);
            this.setState({
            submitLoader: false
           })
           ToastsStore.error("Something went wrong, Please Try Again Later ");
       })
    }

    sheetSelectChange(event){        
        this.setState({
            sheetType:event.target.value
        });
    }

    businessSelectChange(event){
        this.setState({
            businessUID:event.target.value
        },()=>this.fetchleadCampaign(this.state.businessUID));
        console.log(this.state.businessUID);
    }

    campaignSelectChange(event){
        this.setState({
            campaignID:event.target.value
        }); 
        console.log(this.state.campaignID);
    }

    chooseAgain(){
        this.setState({
            file:null
        })
    }
    render(){
        return(
            <React.Fragment>
                <PageTitle title="Lead Report Upload" description="Welcome to Lead Report Upload"/>
                {
                    this.state.rolesFetched && utils.hasRole('lead_report_upload') &&
                    <main className="wrapper-container">
                        <div className="flex flex-wrap">
                            <div className="col-11" style={{color:'rgba(0,0,0,.87)',fontSize:'1.28em',lineHeight:'27px',fontWeight:'bold'}}>Lead Report Upload</div>
                        </div>
                        <div className="ui segment">
                            <form className="ui form">
                                <div className="equal width fields">
                                    <div className="required field">
                                        <label>Sheet Type</label>
                                        <div className="ui input">
                                            <select className="form-control" 
                                                name="sheetType"
                                                value={this.state.sheetType}
                                                onChange={this.sheetSelectChange.bind(this)}>
                                                    <option value="" hidden>-Choose-</option>
                                                    <option  value="Daily Report">Daily Report</option> 
                                                    <option value="Weekly Report">Weekly Report</option>         
                                                    <option  value="Monthly Report">Monthly Report</option>     
                                            </select> 
                                        </div>
                                    </div>
                                    <div className="required field">
                                        <label>Client</label>
                                        <div className="ui input">
                                            <select className="form-control" 
                                                name="businessUID"
                                                value={this.state.businessUID}
                                                onChange={this.businessSelectChange}>
                                                    <option value="" hidden>-Choose-</option>
                                                    {
                                                         this.state.clientName && this.state.clientName.map((item,index)=>{
                                                             return(
                                                                <option value={item.uid}>{item.name}</option> 
                                                             );
                                                         })
                                                         
                                                    }
                                                              
                                            </select> 
                                        </div>
                                    </div>
                                    {
                                        this.state.businessUID &&

                                        <div className="required field">
                                        <label>Campaign Id</label>
                                        <div className="ui input">
                                            <select className="form-control" name="campaignID"
                                                value={this.state.campaignID}
                                                onChange={this.campaignSelectChange.bind(this)}>
                                                    <option value="" hidden>-Choose-</option>
                                                    {
                                                        this.state.campaigns && this.state.campaigns.map((item,index)=>{
                                                            return(
                                                                <option value={item.id}>{item.name}</option> 
                                                            );
                                                        })        
                                                    }                                  
                                            </select>  
                                        </div>
                                    </div>   
                                    }
                                </div>
                                {
                                    this.state.campaignID &&
                                    <article className="margin-btm--half">            
                                        <div><b>Please select format</b></div>
                                        <form className="flex align-space-between" style={{border:"1px solid rgba(204, 204, 204,0.5)",borderRadius: "5px",padding:"5px" }}>
                                            <span>
                                                <input type="radio" id=".xls" value=".xls" name=".xls" checked={this.state.fileFormat === ".xls"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                                <label for=".xls">XLS</label>
                                                <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/lead/LeadReport_Sample_XLS.xls" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xls Template</u></b></a></div>
                                            </span>
                                            <span>
                                                <input type="radio" id=".xlsx" value=".xlsx" name=".xlsx" checked={this.state.fileFormat === ".xlsx"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                                <label for=".xlsx">XLSX</label>
                                                <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/lead/LeadReport_Sample_XLSX.xlsx" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xlsx Template</u></b></a></div>
                                            </span>
                                            <span>
                                                <input type="radio" id=".csv" value=".csv" name=".csv" checked={this.state.fileFormat === ".csv"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                                <label for=".csv">CSV</label>
                                                <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/lead/LeadReport_Sample_CSV.csv" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download csv Template</u></b></a></div>
                                            </span>
                                        </form>
                                    </article>  
                                }
                                {this.state.fileFormat &&
                                    <div className="required field">
                                        <label>Lead Report Upload</label>  
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
                                {
                                    !this.state.submitLoader && 
                                    <button className="btn btn-fill btn-success margin-auto margin-top" onClick={()=>this.uploadHandler()}>Submit</button>
                                }
                                {
                                    this.state.submitLoader && 
                                    <div className="margin-top--double col-2">
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </form>
                        </div>                                                  
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

export default LeadReportUpload;
