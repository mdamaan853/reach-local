import React from 'react';
import PopUp from '../Popup/Popup';
import { Icon, Popup } from 'semantic-ui-react';
import CircularLoader from '../circular-loader/circular-loader';
import {fileUpload} from '../../Services/common-service';
import DatePicker from "react-datepicker";
import utils from '../../Services/utility-service';
import SMSProMobile from '../Campaign/SMSProMobile';
import CustomSMSTemplate from '../Campaign/CustomSMSTemplate';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

export default class CreateNewCampaignHeaderSMS extends React.Component{

      constructor(props){
            super(props);
            this.state={
                  file:null,
                  colmnElement:"",
                  openPopup:false,
                  submitIdLoader:false,
                  audienceGrId:null,
                  inValidNum:[],
                  showAudience: false,
                  errorMsg:"",
                  showMPopup: false,
                  fileFormat:"",
                  gpUpdate: null, 
                  operation:"",
                  formControls:{
                    file:{
                        value:null
                    },
                    gpName:{
                        value:null
                    }
                    
                },
            }  
            this.showBtn = this.showBtn.bind(this);
            this.validateMobileNumber =  this.validateMobileNumber.bind(this);
            this.handleUploadMobile = this.handleUploadMobile.bind(this);
            this.changeHandler =this.changeHandler.bind(this);        
            this.chooseAgain = this.chooseAgain.bind(this);
            this.handleUpload = this.handleUpload.bind(this);
            this.togglePopup = this.togglePopup.bind(this);
            this.toggleMobilePopup = this.toggleMobilePopup.bind(this);
      }

    validateMobileNumber(){
        const mobileList = this.props.formControls.mobileList.value.split(",");
        let validNum=[];
        let validCount=0;
        const numRegex = RegExp(/\d/g);
        let nonValidNum = [];
        let npnValidCount =0;
        mobileList.forEach((mob,index)=>{                 
            let mobile = mob.trim();   
          if(!numRegex.test(mobile)){ 
                nonValidNum[npnValidCount] = mobile+" ,";
                npnValidCount = npnValidCount+1;       
          }    
         else if((mobile.length !== 10) || (mobile.match(numRegex).length !== 10) || ((mobile.length !== 10) && mobile.match(numRegex).length !==10)){
                nonValidNum[npnValidCount] = mobile+" ,";
                npnValidCount = npnValidCount+1;
              }
              else{
                validNum[validCount]=mobile;
                validCount =validCount+1;
              }
        })
        this.setState({
            inValidNum: nonValidNum
        })  
        return validNum;
    }

    clickHandler() {
        //let finalStr = this.state.formControls.templateCont.value.concat("${"+this.state.formControls.colmnElement.value)+"}"
        let finalStr = this.state.formControls.templateCont.value.concat(" ${" + this.state.formControls.colmnElement.value + "}");
        this.setState(state => {
              return {
                    formControls: {
                          ...state.formControls, templateCont: {
                                ...state.formControls.templateCont, value: finalStr
                          }
                    }
              }
        })
    }

    handleUploadMobile(){
        const mobileList =this.validateMobileNumber();
        
         // const mobileList = this.props.formControls.mobileList.value.split(",");
          const audienceName = this.props.formControls.audienceGrName.value;
          if(!audienceName){
            ToastsStore.error("Group Name is required");
            return;
          }
          var formData = new FormData();
          formData.append("mobileList",mobileList);
          formData.append("audienceName",audienceName);
            fileUpload(formData)
            .then(response => response.json())
            .then(data => {
                this.toggleMobilePopup();
                this.props.fetchGroupNames("upload");
                this.setState({
                    submitIdLoader: false
                })
                if (data.success) {
                    ToastsStore.success(data.message);
                    this.setState({
                        audienceGrId: data.audienceGroupId
                    })
                } else {
                    ToastsStore.error(data.message);     
                }
            }).catch(error => {
                console.error(error);
                this.setState({
                  submitIdLoader:false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
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
        
    }

      chooseAgain(){
            this.setState({
                file:null
            })
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

    //   handleUpload(){
    //         var formData = new FormData();

    //               const groupName = document.getElementById('groupName').value;
    //               const checked = document.getElementById('remember').checked;
    //               if(!groupName){
    //                   ToastsStore.error("Group Name is required");
    //                   return;
    //               }
    //               this.setState({
    //                   submitIdLoader:true
    //               });
                  
    //               formData.append("audiences",this.state.file[0]);
    //               formData.append("encoded",checked);
    //               formData.append("audienceName",groupName);           
    //         fileUpload(formData)
    //         .then(response => response.json())
    //         .then(data => {
    //             this.props.fetchGroupNames("upload");
    //             this.setState({
    //                 submitIdLoader: false
    //             })
    //             if (data.success) {
    //                 ToastsStore.success(data.message);
    //                 let str = (data.rowProcessed > 1) ? data.rowProcessed+" rows processed" : data.rowProcessed+" row processed";
    //                 ToastsStore.success(str);
    //                 this.setState({
    //                     audienceGrId: data.audienceGroupId
    //                 })  
    //                 this.togglePopup();  
    //             } else {
    //                 ToastsStore.error(data.message);  
    //             }
    //         }).catch(error => {
    //             this.setState({
    //               submitIdLoader:false
    //             })
    //             ToastsStore.error("Something went wrong, Please Try Again Later ");
    //         })
    //   }

      togglePopup(){
          this.setState(state=>{
                return{
                  openPopup: !state.openPopup,
                }     
          })
      }

    showBtn(){
        if(this.props.formControls.audienceGrName.value){
            this.setState({showAudience: true})
        }else{
            this.setState({errorMsg: "Please Enter Group Name", showAudience: false})
        }
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
    
    toggleMobilePopup(){
        this.setState( state =>
            {
                return{
                    showMPopup: !state.showMPopup
                }
            })
    }
    
    render(){
    const style = {
        borderRadius: 0,
        opacity: 0.85,
        padding: '1em',
        
    } 
        return(
            <section className="card-custom pad--half" >
                <article>
                    <div className="ui segment" style={{border: '1.2px solid rgba(0,0,0,0.1)'}}>
            <div className="ui stackable very relaxed three column grid">
                  <div className="middle aligned column">
                        <div className="label">Select Audience Group</div>
                        <select name="audienceGrId" className="form-control" value={ this.props.formControls.audienceGrId.value ? this.props.formControls.audienceGrId.value: this.state.audienceGrId} 
                        style={{width:'80%'}} onChange={this.props.audienceChangeHandler}> 
                              <option defaultValue>-Choose-</option>
                              {
                                    this.props.groupNameList && this.props.groupNameList.map((item,index)=>{
                                        return(
                                            <option key={index} value={item.agId}>{item.name}</option>
                                        );
                                    })
                              }
                        </select>
                        {
                            this.props.formControls.validMobile.value && 
                            <div className="margin-top" style={{color:'#4CAF50'}}><b>No.of Valid Mobile is {this.props.formControls.validMobile.value}</b></div>
                        } 
                        
                  </div>
                  
                  <div className="column">
                        
                        <div className="label">Mobile Number</div> 
                        
                        <textarea className="form-control" 
                                          name="mobileList" 
                                          placeholder="Please place comma after each 10 digit mobile number and please don't precede with country code.."
                                          type="number"
                                          onClick={this.toggleMobilePopup} 
                                        //   onChange={()=>{this.setState({showMPopup: true}); console.log(this.state.showMPopup)}} 
                                          style={{height:'85px',width:'90%',resize:'none'}}/>       
                        {
                            this.state.showMPopup &&

                            <PopUp title="Enter Mobile Number" togglePopup={this.toggleMobilePopup}>
                                <SMSProMobile
                                    formControls={this.props.formControls}
                                    changeHandler={this.props.changeHandler}
                                    showBtn={this.showBtn}
                                    inValidNum={this.state.inValidNum}
                                    showAudience={this.state.showAudience}
                                    errorMsg={this.state.errorMsg}
                                />
                                <div className="dialog-footer pad">                        
                                    <div>
                                        <button 
                                            className="ui button" 
                                            onClick={this.toggleMobilePopup}>
                                                    Close
                                        </button>
                                        {   this.state.showAudience && 
                                            <button className="ui green button" 
                                                // style={{marginTop:'3%', width:'90%'}} 
                                                onClick={this.handleUploadMobile}>ADD </button>
                                        }
                                    </div>                                           
                                </div>                          
                            </PopUp>      
                        }  
                                                  
                  </div>
                        <div style={{left:'30%'}} className="ui vertical divider">Or</div>
                  <div className="middle aligned column">
                        <button onClick={this.togglePopup} style={{marginLeft:'22px'}} class="ui icon left labeled blue big button">
                            <i aria-hidden="true" class="upload icon"></i>Upload Audience
                        </button>
                 </div>
            </div>
            <div style={{left:'67%'}} className="ui vertical divider">Or</div>

            {
            this.state.openPopup &&                    
                  <PopUp title={'Upload Audience'} togglePopup={this.togglePopup}>
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
                                        <input type="checkbox" name="remember" value="1" id="remember" />
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
                                    !this.state.formControls.file.value && this.state.fileFormat &&
                                    
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
                                    this.state.formControls.file.value && 
                                    <div className="label">{this.state.formControls.file.value[0].name}</div>
                                }
                                {
                                    this.state.submitIdLoader &&
                                    <div>
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                                {
                                    !this.state.submitIdLoader && this.state.formControls.file.value && 
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
                                        this.props.groupNameList.map((item,index)=>{
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
                                            </div>                           
                                    </form>
                                }
                                {
                                    this.state.formControls.file.value && 
                                    <div className="label">{this.state.formControls.file.value[0].name}</div>
                                }
                                {
                                    this.state.submitIdLoader &&
                                    <div>
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                 }
                                {
                                    this.state.gpUpdate && this.state.formControls.file.value && 
                                    <div className="margin-top--half">
                                        <button className="btn btn-fill btn-primary" onClick={()=>this.chooseAgain()}>Choose Again</button>
                                        <button className="btn btn-fill btn-green margin-left--half" onClick={()=>this.handleUpload("update")}>UPDATE</button>
                                    </div>
                                }
                            
                            </article>
                        }
                  </PopUp>
            }      
      </div>
            </article>


            <CustomSMSTemplate 
               formControls = {this.props.formControls}
               changeHandler = {this.props.changeHandler}
               loadData = {this.props.loadData}
               audienceGrId = {this.state.audienceGrId}
               langChangeHandle = {this.props.langChangeHandle}
               templates = {this.props.templates}
               smsChangeHandler={this.props.smsChangeHandler}
               addURL={this.props.addURL}
               contentHandler = {this.props.contentHandler}
               messageNum={this.props.messageNum}
               canTestSms={this.props.canTestSms}
               checkedHandler = {this.props.checkedHandler.bind(this)}
               audienceData={this.props.audienceData}
               clickHandler={this.props.clickHandler}
            />
                
            <div className="flex flex-direction--row col-20">
                <div className="col-9 padding-all-12">
                        <div className="label">Target Audience Count</div>
                        <input  type="number"
                                className="form-control"
                                name="targetAudienceCount"
                                value={this.props.formControls.targetAudienceCount.value}
                                onChange={this.props.changeHandler}>
                        </input>
                        {
                            this.props.formControls.targetAudienceCount.error &&
                            <span className="form-error">{this.props.formControls.targetAudienceCount.error}</span>
                        }
                </div>
            </div> 
            <article className="flex flex-direction--row">
                <div className="col-9 padding-all-12">
                    <div className="label">Schedule Date &nbsp;
                        <Popup
                            trigger={<Icon name='info circle' color="blue" style={{verticalAlign: 'super'}}/>}
                            content='The date on which the campaign needs to be executed.'
                            position='top center'
                            style={style}
                            inverted
                        /></div>
                    <DatePicker
                    selected={this.props.formControls.date.value}
                    placeholderText="Click to select Date"
                    minDate={new Date()}
                    onChange={this.props.dobChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="col-20"
                    name="date"
                    />
                    {
                        this.props.formControls.date.error &&
                        <span className="form-error">{this.props.formControls.date.error}</span>
                    }
                    </div>  
                    <div className="col-9 margin-left--auto padding-all-12 ">
                        <div className="label">Schedule Time&nbsp;
                                <Popup
                                    trigger={<Icon name='info circle' color="blue" style={{verticalAlign: 'super'}}/>}
                                    content='The time at which the campaign needs to be executed.'
                                    position='top center'
                                    style={style}
                                    inverted
                                /></div>
                        <select name="time" className="form-control" required="" value={this.props.formControls.time.value} onChange={this.props.changeHandler}>
                                <option value="" defaultValue hidden>Select Time</option>
                                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                <option value="11:00 AM - 13:00 PM">11:00 AM - 13:00 PM</option>
                                <option value="13:00 PM - 15:00 PM">13:00 PM - 15:00 PM</option>
                                <option value="15:00 PM - 17:00 PM">15:00 PM - 17:00 PM</option>
                                <option value="17:00 PM - 19:00 PM">17:00 PM - 19:00 PM</option>
                                <option value="19:00 PM - 21:00 PM">19:00 PM - 21:00 PM</option>
                        </select>
                        {
                                this.props.formControls.time.error &&
                                <span className="form-error">{this.props.formControls.time.error}</span>
                        }
                </div>
            </article>
                  
             
             <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/> 

              </section>
           
        );
    }
}