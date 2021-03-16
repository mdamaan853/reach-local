import React, { Component } from 'react';
import PageTitle from '../Helmet';
import CircularLoader from '../circular-loader/circular-loader';
import Moment from 'react-moment';
import {fileUpload,getAudienceGroup,getAudienceData} from '../../Services/common-service';
import Popup from '../Popup/Popup';
import utils from '../../Services/utility-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import './FileUpload.css';

const initialState = {
    formControls:{
        file:{
            value:null
        },
        gpName:{
            value:null
        }
        
    },
    operation: "fileUpload",
    fileFormat:null,
    gpUpdate: null,  
    submitIdLoader:false,
    openPopup: false,
    groupNameList:[],
    audienceData:[],
    audienceGroupId: null,
    fetchingData:false
}

class FileUpload extends Component {
    constructor(){
        super();
        this.state = initialState;
        this.radioChangeHandler = this.radioChangeHandler.bind(this);
    }
    componentDidMount(){
        this.fetchGroupNames();
    }

    fetchGroupNames(){
        const body = {
            "maxResults": 20,
            "start": 0
        }
        getAudienceGroup(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({
                    groupNameList:data.audienceGroups
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    changeHandler = event => {
        this.setState({
              formControls: {
                    file:{
                        value: event.target.files 
                    }
              }
        });

       console.log(this.state.formControls.file.value);
    }

    radioChangeHandler(event,params){

        let v = event.target.value;
        if(params === "operation"){
            this.setState(state=>{
                return{                   
                    formControls:{
                        ...state.formControls,
                        file:{
                            ...state.formControls.file,
                            value:null
                        }
                    },
                    operation: v,
                    fileFormat: null,
                }
            })
        }
        else if(params === "fileFormat"){
            this.setState({
                fileFormat: event.target.value
            })
        } 
    }

    togglePopup() {
        this.setState({
            openPopup: !this.state.openPopup
        })
    }
    
    chooseAgain(){
        this.setState({
            formControls: initialState.formControls
        })
    }
    loadData(event){
        const body = {
            audienceGroupId: event.target.value
        };
        this.setState({
            fetchingData:true,
            audienceGroupId: event.target.value,
            audienceData: []
        })
        getAudienceData(body)
        .then(response => response.json())
        .then(data => {
            if (data.success && parseInt(data.audience.length) > 0 ) {
                this.setState({
                    audienceData:data.audience,   
                })
                ToastsStore.success(data.message);
            }
            else if(parseInt(data.audience) === (null || [])){
                this.setState({
                    audienceData: [],   
                })
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
            this.setState({
                fetchingData:false
            })
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
            this.setState({
                fetchingData:false,
                audienceData: null
            })
        })
    }

    
    handleUpload(task){
        if(task === "update"){
            let audienceId = this.state.gpUpdate;
            let audiences = this.state.formControls.file.value[0];
            //const groupName = document.getElementById('gNameUpdate').value; 
            this.setState({
                submitIdLoader:true
            });
            var formData = new FormData();
            formData.append("audiences",audiences); 
            formData.append("agId",audienceId);
            formData.append("fileFormat",this.state.fileFormat.toUpperCase());
        }
        else if(task === "fileUpload"){
            const groupName = document.getElementById('groupName').value;
            console.log(document.getElementById('groupName'));
            //let groupId = this.state.gpUpdate;
            const checked = document.getElementById('remember').checked;
            if(!groupName){
                ToastsStore.error("Group Name is required");
                return;
            }
            this.setState({
                submitIdLoader:true
            });
            var formData = new FormData();
            formData.append("audiences",this.state.formControls.file.value[0]);
            formData.append("encoded",checked);
            formData.append("fileFormat",this.state.fileFormat.toUpperCase());
            formData.append("audienceName",groupName);  
            // formData.append("audienceId",groupId); 
        }             
        fileUpload(formData)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            this.setState({
                submitIdLoader: false
            })
            if (data.success) {
                ToastsStore.success(data.message);
                let str = (data.rowProcessed > 1) ? data.rowProcessed+" rows processed" : data.rowProcessed+" row processed";
                ToastsStore.success(str);
                this.togglePopup();
                this.fetchGroupNames();
            } else {
                ToastsStore.error(data.message);
            }
            this.setState({
                submitIdLoader:false
            })
        }).catch(error => {
            console.log(error);
            this.setState({
                submitIdLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    render() {
      return (
                <div className="wrapper-container h-25">
                    <PageTitle title="Upload" description="Welcome to Upload"/>
                    <div className="card-custom flex flex-direction--row flex-wrap pad--half ">
                    <div className="col-20 flex flex-direction--row flex-wrap margin-btm margin-top senderId-action--wrapper">
                        <div className="col-5">
                            <div className="label">Group Name</div>
                            <select className="form-control" name="gpName" onChange={(e)=>this.loadData(e)}>
                                <option>Choose...</option>
                                {
                                    this.state.groupNameList.map((item,index)=>{
                                        return(
                                            <option key={index} value={item.agId}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <button onClick={()=>{return(this.togglePopup(),this.setState(state =>{
                            return{ formControls:{
                                    ...state.formControls,
                                    file:{
                                        ...state.formControls.file,
                                        value:null
                                    }
                                },
                                fileFormat:null}}))}} className="btn-fill btn-success margin-left--auto h-50">Upload/Update Audience</button>
                    </div>
                    </div>
                    <div className="card-custom padding-btm--half leads-table-wrapper"
                        style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
                    >          
                        <table className="client">
                            <thead>
                                <tr>
                                    <th>Audience Group Id</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>City</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Pincode</th>
                                    <th>State</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {   
                                    this.state.audienceData && this.state.audienceData !== (null || []) && this.state.audienceData.map((item,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td>{this.state.audienceGroupId ? this.state.audienceGroupId : "--"}</td>
                                            {(!item.namePrefix && !item.firstName && !item.middleName && !item.lastName) ? <td>--</td> :<td> {item.namePrefix} {item.firstName} {item.middleName} {item.lastName}</td>}
                                            <td>{item.gender ? item.gender : "--"}</td>
                                            <td>{item.city ? item.city : "--"}</td>
                                            <td>{item.email ? item.email : "--"}</td>
                                            <td>{item.mobile ? item.mobile :"--"}</td>
                                            <td>{item.pincode ? item.pincode :"--"}</td>
                                            <td>{item.state ? item.state : "--"}</td>          
                                            <td><Moment format="DD-MM-YYYY">{item.created ? item.created:"--" }</Moment></td>
                                            <td><Moment format="DD-MM-YYYY">{item.updated ? item.updated : "--"}</Moment></td>
                                        </tr>                              
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            this.state.audienceData.length === 0 &&
                            <div className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>
                                Choose Group Name to view Data
                            </div>
                        }
                        {
                            this.state.fetchingData &&
                            <div className="margin-btm margin-top">
                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                            </div>
                        }
                    </div>
                    {this.state.openPopup &&                    
                        <Popup title={'Upload/Update Audience'} togglePopup={this.togglePopup.bind(this)}>

            <article className="padding-all-12 col-20">
                <div className="label">Please select one of the operation</div>
                <label for="fileUpload" className="radioBtn">
                    <input type="radio" name="fileUpload" checked={this.state.operation === "fileUpload"} 
                      value="fileUpload"
                      id="fileUpload" 
                      onChange={(e)=>{this.radioChangeHandler(e,"operation")}}/>Add New Audience
                    <span className="checkmark1"></span>
                </label>
                <label for="fileUpdate" className="radioBtn">
                    <input type="radio" name="fileUpdate" checked={this.state.operation === "fileUpdate"} 
                    id="fileUpdate" 
                    value="fileUpdate" onChange={(e)=>{this.radioChangeHandler(e,"operation")}}
                    // onClick={props.loadData}
                    // disabled ={(props.formControls.audienceGrId.value || props.audienceGrId) ? false: true}
                    />Update Audience
                    
                    <span className="checkmark1"></span>
                </label>
            </article> 

                        {
                            this.state.operation === "fileUpload" &&
                            <div className="file-upload--card pad--half flex flex-direction--col">
                                 <div className="section-title">File Upload</div>
                                <div className="col-20 margin-top--half margin-btm--half">
                                    <div className="label">Group Name</div>
                                    <input type="text" className="form-control" id="groupName" style={{width:"100%"}}/>
                                    <div className="margin-top--half">
                                        <input type="checkbox" name="remember" value="1" id="remember"/>
                                        <span className="label" style={{verticalAlign:'text-top'}}>SHA Encryption Required</span>
                                    </div>
                                </div>
                               
                                <article className="margin-btm--half">            
                                    <div><b>Please select format</b></div>
                                    <form className="flex align-space-between" style={{border:"1px solid rgb(204, 204, 204)",borderRadius: "5px",padding:"5px" }}>
                                        <span>
                                            <input type="radio" id=".xls" value=".xls" name=".xls" checked={this.state.fileFormat === ".xls"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                            <label for=".xls">XLS</label>
                                            <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/AudienceXLS.xls" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xls Template</u></b></a></div>
                                        </span>
                                        <span>
                                            <input type="radio" id=".xlsx" value=".xlsx" name=".xlsx" checked={this.state.fileFormat === ".xlsx"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                            <label for=".xlsx">XLSX</label>
                                            <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_XLSX.xlsx" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xlsx Template</u></b></a></div>
                                        </span>
                                        <span>
                                            <input type="radio" id=".csv" value=".csv" name=".csv" checked={this.state.fileFormat === ".csv"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                            <label for=".csv">CSV</label>
                                            <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_CSV.csv" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download csv Template</u></b></a></div>
                                        </span>
                                    </form>
                                </article> 
                                {
                                    this.state.formControls &&  this.state.formControls.file && !this.state.formControls.file.value && this.state.fileFormat &&
                                    
                                        <form>
                                            <input type="file" 
                                                accept={`${this.state.fileFormat}`}
                                                className="form-control" 
                                                name="file" 
                                                id="file"
                                                style={{width:"100%"}}
                                                onChange={this.changeHandler.bind(this)} /> 
                                                <div className="col-20">
                                                    <p style={{color:"green"}}>Please upload {`${this.state.fileFormat}`} file only</p> 
                                                    {/* <a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_CSV.csv" className=""><b><u>Download csv Template</u></b></a> */}
                                                </div>                            
                                        </form>
                                }                                
                                {
                                    this.state.formControls &&  this.state.formControls.file && this.state.formControls.file.value && 
                                    <div className="label">{this.state.formControls.file.value[0].name}</div>
                                }
                                {
                                    this.state.submitIdLoader &&
                                    <div>
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                                {
                                    !this.state.submitIdLoader && this.state.formControls &&  this.state.formControls.file && this.state.formControls.file.value &&
                                    <div className="margin-top--half">
                                        <button className="btn btn-fill btn-primary" onClick={()=>this.chooseAgain()}>Choose Again</button>
                                        <button className="btn btn-fill btn-success margin-left--half" onClick={()=>this.handleUpload("fileUpload")}>Upload</button>
                                    </div>
                                }
                            </div>
                        }
                        {
                            this.state.operation === "fileUpdate" &&
                            <article className="file-upload--card pad--half flex flex-direction--col">                    
                            <div className="col-14 margin-btm--half">
                                <div className="label">Group Name</div>
                                <select className="form-control" style={utils.isMobile ? {width: "300%"}: {width:"125%"}} name="gpUpdate" onChange={(e)=>this.setState({gpUpdate: e.target.value})} id="gNameUpdate">
                                    <option>Choose...</option>
                                    {
                                        this.state.groupNameList.map((item,index)=>{
                                            return(
                                                <option key={index} value={item.agId}>{item.name}</option>
                                            );
                                        })
                                    }
                                </select>                               
                            </div>
                            { this.state.gpUpdate &&
                            <article className="margin-btm--half">            
                                <div><b>Please select format</b></div>
                                <form className="flex align-space-between" style={{border:"1px solid rgb(204, 204, 204)",borderRadius: "5px",padding:"5px" }}>
                                    <span>
                                        <input type="radio" id=".xls" value=".xls" name=".xls" checked={this.state.fileFormat === ".xls"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                        <label for=".xls">XLS</label>
                                        <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/AudienceXLS.xls" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xls Template</u></b></a></div>
                                    </span>
                                    <span>
                                        <input type="radio" id=".xlsx" value=".xlsx" name=".xlsx" checked={this.state.fileFormat === ".xlsx"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                        <label for=".xlsx">XLSX</label>
                                        <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_XLSX.xlsx" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download xlsx Template</u></b></a></div>
                                    </span>
                                    <span>
                                        <input type="radio" id=".csv" value=".csv" name=".csv" checked={this.state.fileFormat === ".csv"} onChange={(e)=>{this.radioChangeHandler(e,"fileFormat")}} style={{marginRight:"5px"}}/>
                                        <label for=".csv">CSV</label>
                                        <div><a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_CSV.csv" target="_blank" rel="noopener noreferrer" className=" "><b><u>Download csv Template</u></b></a></div>
                                    </span>
                                </form>
                            </article> 
                            }
                                {
                                    !this.state.formControls.file.value && this.state.fileFormat &&
                                    <form>
                                        <input type="file" 
                                            accept={`${this.state.fileFormat}`} 
                                            className="form-control" 
                                            name="file" 
                                            id="file"
                                            onChange={this.changeHandler.bind(this)}
                                            style={{width:"100%"}} />  
                                             <div className="col-20">
                                                <p style={{color:"green"}}>Please upload {`${this.state.fileFormat}`} file only</p> 
                                                {/* <a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/AudienceXLS.xls" className=""><b><u>Download Template</u></b></a> */}
                                            </div>                           
                                    </form>
                                }
                                {
                                    this.state.formControls &&  this.state.formControls.file && this.state.formControls.file.value && 
                                    <div className="label">{this.state.formControls.file.value[0].name}</div>
                                }
                                {
                                    this.state.submitIdLoader &&
                                    <div>
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                                {
                                    this.state.gpUpdate && this.state.formControls &&  this.state.formControls.file && this.state.formControls.file.value && 
                                    <div className="margin-top--half">
                                        <button className="btn btn-fill btn-primary" onClick={()=>this.chooseAgain()}>Choose Again</button>
                                        <button className="btn btn-fill btn-green margin-left--half" onClick={()=>this.handleUpload("update")}>UPDATE</button>
                                    </div>
                                }
                            
                            </article>
                        }
                               
                        </Popup>
                    }
                    <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
                </div>
                
              );
    }
  }
  
  export default FileUpload;