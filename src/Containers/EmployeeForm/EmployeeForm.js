import React from 'react';
import DatePicker from "react-datepicker";
import Popup from '../../Components/Popup/Popup';
import {leadSendOtpBetaCura,submitLeadData} from '../../Services/user-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import './EmployeeForm.css';


const initialState ={
    page:"form",
    parentUrl:"",
    opnPopup: false,
    // timeChange:{
    //     timeMM:{
    //         value:"",
    //     },
    //     timeHH:{
    //         value:'',
    //     },
    //     clockType:{
    //         value:"AM"
    //     },
    // }, 
    formControls:{
        email:{
            value:'',
            error:''
        },
        name:{
            value:'',
            error:''
        },
        employeeID:{
            value:'',
            error:''
        },  
        phoneNumber:{
            value:'',
            error:''
        },
        secondaryPhone:{
            value:'',
            error:''
        },
       
        testName:{
            value:'',
            error:''
        },
        city:{
            value:'',
            error:''
        },
        homeAddress:{
            value:'',
            error:''
        },
        collectionDateTime:{
            value:'',
            error:''
        },
       
        collectionTime:{
            value:"",
            error:""
        },
        pincode:{
            value:'',
            error:''
        },   
        otp:{
            value:'',
            error:''
        },
        paidType :{
            value:"",
            error:""
        },
        sourceType:{
            value: "betacura"
        },
        partner:{
            value:"aditya-birla"
        }
    }
}
export default class EmployeeFrom extends React.Component{

    constructor(props){
        super(props);
        this.state=initialState;
     //   this.getTimee = this.getTimee.bind(this);        
        this.resendOTP=this.resendOTP.bind(this);
        this.dobChange =this.dobChange.bind(this);
       // this.timecheck = this.timecheck.bind(this);
        this.submitOTP = this.submitOTP.bind(this);
        this.submitData = this.submitData.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.prefillData = this.prefillData.bind(this);        
        this.changeHandler = this.changeHandler.bind(this);         
       // this.clickedHandler= this.clickedHandler.bind(this);
      //  this.timeChangeHandler = this.timeChangeHandler.bind(this);
      // this.getDateFormatDDMMYY = this.getDateFormatDDMMYY.bind(this);
    }

    componentDidMount(){
        this.setState({
            parentUrl: document.referrer,
           
        },this.prefillData);
       
    }

    // timeChangeHandler(event){
    //     let name=event.target.name;
    //     let value=event.target.value;

    //     this.setState(state=>{
    //         return{
    //         timeChange:{
    //             ...state.timeChange,
    //             [name]:{
    //                 ...state.timeChange.name,
    //                 value:value
    //             }
    //         }
    //     }
    //     })
    // }

    changeHandler = event => {

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
  
    resendOTP(event){
        event.preventDefault();
        this.setState({
            submitLoader: true,
        })
        
        var qp = this.state.parentUrl.split('?')[1];
        let body = '?' + (qp ? qp : '') + '&' + "sourceType"+ "=" + "betacura" + '&' + "partner"+ "=" + "aditya-birla" + '&' + "mobile" + "=" + this.state.formControls.phoneNumber.value
        leadSendOtpBetaCura(body)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                // this.submitData();
                this.setState({
                    submitLoader: false,
                    opnPopup: false,
                    page:"otp"                    
                })
                ToastsStore.success(data.message);
            } 
            if(!data.success) {
                this.setState({
                    page: 'form' 
                });
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({
                submitLoader:false
            });
            ToastsStore.error("Something Went Wrong!!! Please Try Again");
        })

    }

    // getDateFormatDDMMYY(){
        
    //     let longDate = this.state.formControls && this.state.formControls.collectionDateTime && this.state.formControls.collectionDateTime.value;
      
    //     let date = longDate.getTime();
    //     let temp = this.state.formControls;
    //     temp.collectionDateTime.value = date;
    //     this.setState({
    //         formControls: temp   
    //     })
    // }

    getFormData(){
        // this.getDateFormatDDMMYY();
        let queryString = "";
        Object.entries(this.state.formControls).forEach(e => {
            queryString+= '&' + e[0] + '=' + e[1].value    
        })
        return queryString;
    }

    dobChange(event){
        let value=event;
        this.setState({
            formControls: {
                ...this.state.formControls,
                collectionDateTime: {
                ...this.state.formControls.collectionDateTime,
                value
                }
            }
        });   
    }
   
    prefillData(){
        try{
            let str = this.state.parentUrl;
            // console.dir(str);
            str = str.split('?')[1];
            let prefillParams = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            let temp = this.state.formControls;
            Object.entries(prefillParams).forEach(e => {
                Object.entries(temp).forEach(f => {
                    if(e[0] === f[0]){
                        f[1].value = e[1];
                    }
                })
            })
            this.setState({
                formControls: temp,
            })
        }catch(e){
            console.log(e);
        }
    }
  
    submitData(event){
        event.preventDefault();
        let temp = this.state.formControls;
        if(!this.state.formControls.otp.value){
            temp.otp.error = "Please enter valid OTP";
            this.setState({
                formControls: temp
            })
            return;
        }else{
            temp.otp.error = "";
            this.setState({
                formControls: temp
            })
        }
        // console.log(window.location);
        this.setState({
            submitLoader: true,
        });
        var qp = this.state.parentUrl.split('?')[1];
        var body = '?' + (qp ? qp : '') + this.getFormData();
        
        submitLeadData(body)
        .then(response => response.json())
        .then(data => {
            
            if(data.success){
                this.setState({
                    submitLoader: false,
                    page: 'thank'                    
                })
                ToastsStore.success(data.message);
            }else{
                ToastsStore.error(data.message);
                let temp2 = this.state.formControls;
                temp2.otp.error = data.message;
                this.setState({
                    submitLoader: false,
                    page: "error",
                    formControls:temp2                 
                })
                
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something Went Wrong!!! Please Try Again");
            this.setState({
                submitLoader: false,
                view: 'thank'                    
            })
        })
    }
      
    submitOTP(){
        // this.timecheck();
        let temp=this.state.formControls;
        for(let ele in temp){
                      
            if(ele !== "otp"){
                if(temp[ele].value){
                    temp[ele].error = ""; 
                    this.setState({
                        formControls: temp
                    })      
                }
                else{
                    temp[ele].error = `${ele} field is manadatory`; 
                    ToastsStore.error(`${ele} field is manadatory`) ;
                    let sc = document.querySelector(`[name=${ele}]`);
                    sc.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.setState({
                        formControls: temp
                    })
                    return;
                }    
            }      
        }
 
        this.setState({
            submitLoader: true,
        });
        var qp = this.state.parentUrl.split('?')[1];
        let body = '?' + (qp ? qp : '') + '&' + "sourceType"+ "=" + "betacura" + '&' + "partner"+ "=" + "aditya-birla" + '&' + "mobile" + "=" + this.state.formControls.phoneNumber.value
             
        leadSendOtpBetaCura(body)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                this.setState({
                    submitLoader: false,
                    page: 'otp'                    
                })
                ToastsStore.success(data.message);
            } 
            if(!data.success) {
                this.setState({
                    submitLoader: false
                });
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({
                submitLoader:false
            });
            ToastsStore.error("Something Went Wrong!!! Please Try Again");
        })
    }
    

    render(){
        let logo = window.localStorage.getItem('logoUrl');
        return(
            <React.Fragment>
                <figure className="text--center">
                    <img src ={logo} alt="Company Logo" style={{marginTop: '18px',width: '60%',height:'250px',objectFit:'cover'}}/>
                </figure>    
                {
                    this.state.page === "form" &&
                    <section>        
                {/* <h1>${landingPageConfig.h1Title}</h1>
                <p>${landingPageConfig.h1Desc}</p> */}
                
                    <h1 className="text--center" onClick={this.getDateFormatDDMMYY}>ABHI  Employee Information Form  AHC</h1>
                    <p className="text--center" style={{fontSize: "large"}}>Please fill in the details to ensure your samples are collected accurately on time.<br/>
                        BetaCura Health Solutions Pvt Ltd will be facilitating the health screening  from your residences on your chosen time &amp; date for your AHC.
                    </p>
                    <hr/>
                    <article className="card-custom  pad--half  bakgrnd-grad">
                        <div className="col-12 flex flex-direction--col margin-right--auto margin-left--auto"> 
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Email address *</div>
                            <input  type="text"
                                className="form-control"
                                name="email"
                                placeholder="Your Email"
                                value={this.state.formControls && this.state.formControls.email && this.state.formControls.email.value}
                                onChange={this.changeHandler}
                                >
                            </input>
                            {
                                this.state.formControls && this.state.formControls.email && this.state.formControls.email.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.email && this.state.formControls.email.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom ">
                            <div className="label">Your Full Name *</div>
                            <input  type="text"
                                className="form-control"
                                name="name"
                                placeholder="Your Name"
                                value={this.state.formControls && this.state.formControls.name && this.state.formControls.name.value}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.formControls && this.state.formControls.name && this.state.formControls.name.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.name && this.state.formControls.name.error}</div>  
                            }
                        </div>
                        
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Employee ID *</div>
                            <input  type="text"
                                className="form-control"
                                name="employeeID"
                                placeholder="Type Here"
                                value={this.state.formControls && this.state.formControls.employeeID && this.state.formControls.employeeID.value}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.formControls && this.state.formControls.employeeID && this.state.formControls.employeeID.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.employeeID && this.state.formControls.employeeID.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Your Primary Phone Number *</div>
                            <input  type="text"
                                className="form-control"
                                name="phoneNumber"
                                placeholder="This phone number will be used for OTP purpose"
                                value={this.state.formControls && this.state.formControls.phoneNumber && this.state.formControls.phoneNumber.value}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.formControls && this.state.formControls.phoneNumber && this.state.formControls.phoneNumber.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.phoneNumber && this.state.formControls.phoneNumber.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Your Secondary Phone Number *</div>
                            <input  type="text"
                                className="form-control"
                                name="secondaryPhone"
                                placeholder="Type Here"
                                value={this.state.formControls && this.state.formControls.secondaryPhone && this.state.formControls.secondaryPhone.value}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.formControls && this.state.formControls.secondaryPhone && this.state.formControls.secondaryPhone.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.secondaryPhone && this.state.formControls.secondaryPhone.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Select the Test Type *</div>
                            <select className="form-control" name="testName" 
                            value={this.state.formControls && this.state.formControls.testName && this.state.formControls.testName.value} 
                            onChange={this.changeHandler}
                            style={{width:"90%"}}
                            >                                  
                                    <option defaultValue hidden >-Select Test Type-</option>
                                    <option value="Annual Health Checkup (Male)-Rs 2800" >Annual Health Checkup (Male)-Rs 2800</option>
                                    <option value="Annual Health Checkup (Female)-Rs 2800" >Annual Health Checkup (Female)-Rs 2800</option>
                                    <option value="Annual Health Checkup + Stress Test (Male &amp; Female)-Rs 3600" >Annual Health Checkup + Stress Test (Male &amp; Female)-Rs 3600</option>
                                    <option value="Annual Health Checkup (Female) + Mammography (Above 35 yrs)-Rs 5000"> Annual Health Checkup (Female) + Mammography (Above 35 yrs)-Rs 5000</option>
                                    {/* <option value="PRELIMINARY TEST" >PRELIMINARY TEST</option> 
                                    <option value="DIABETIC CHECK UP" >DIABETIC CHECK UP</option>
                                    <option value="KIDNEY PROFILE" >KIDNEY PROFILE</option>
                                    <option value="LIVER PROFILE" >LIVER PROFILE</option>
                                    <option value="LIPID PROFILE" >LIPID PROFILE</option>
                                    <option value="THYROID PROFILE" >THYROID PROFILE</option>
                                    <option value="USG(Abdomen &amp; Pelvis)" >USG(Abdomen &amp; Pelvis)</option>
                                    <option value="Chest X-ray" >Chest X-ray</option>
                                    <option value="Pulmonary Function Test" >Pulmonary Function Test</option>
                                    <option value="Physician Examination with BP, BMI" >Physician Examination with BP, BMI</option>
                                    <option value="Vit D 25 Hydroxy" >Vit D 25 Hydroxy</option>
                                    <option value="Vit.B12" >Vit.B12</option>
                                    <option value="PSA (Above 40 years)" >PSA (Above 40 years)</option>
                                    <option value="Stress test" >Stress test</option>
                                    <option value="Post Prandial Sugar" >Post Prandial Sugar</option>
                                    <option value="Mammography (Above 35 yrs)" >Mammography (Above 35 yrs)</option> */}
                                    
                            </select>
                            {
                                this.state.formControls && this.state.formControls.testName && this.state.formControls.testName.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.testName && this.state.formControls.testName.error}</div>  
                            }
                        </div>
                      
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Select your City of residence *</div>
                            <select className="form-control" name="city"
                            name="city"
                            placeholder="Type Here" 
                            value={this.state.formControls && this.state.formControls.city && this.state.formControls.city.value} 
                            onChange={this.changeHandler}
                            style={{width:"90%"}}
                            >                                  
                                    <option defaultValue hidden >-Select City-</option>
                                    <option value="Delhi/NCR">Delhi/NCR</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Bengaluru">Bengaluru</option>
                            </select>
                            {
                                this.state.formControls && this.state.formControls.city && this.state.formControls.city.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.city && this.state.formControls.city.error}</div>  
                            }
                        </div>
                        
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Your Complete Address for Sample Collection *</div>
                            <input  type="text"
                                className="form-control"
                                name="homeAddress"
                                placeholder="Type Here"
                                value={this.state.formControls && this.state.formControls.homeAddress && this.state.formControls.homeAddress.value}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.formControls && this.state.formControls.homeAddress && this.state.formControls.homeAddress.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.homeAddress && this.state.formControls.homeAddress.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Your Pin Code *</div>
                            <input  type="text"
                                className="form-control"
                                name="pincode"
                                placeholder="Type Here"
                                value={this.state.formControls && this.state.formControls.pincode && this.state.formControls.pincode.value}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.formControls && this.state.formControls.pincode && this.state.formControls.pincode.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.pincode && this.state.formControls.pincode.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Please select the preferred day for the sample collection. *</div>
                            <DatePicker
                                    selected={this.state.formControls && this.state.formControls.collectionDateTime && this.state.formControls.collectionDateTime.value}
                                    placeholderText="Click to select Date"
                                //   minDate={d}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={this.dobChange}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"      
                                    name="collectionDateTime"
                                    style={{width: "95%"}}
                            />
                            {
                                this.state.formControls && this.state.formControls.collectionDateTime && this.state.formControls.collectionDateTime.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.collectionDateTime && this.state.formControls.collectionDateTime.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Please select the preferred time for the sample collection. *</div>
                            <select className="form-control" name="collectionTime" 
                            value={this.state.formControls && this.state.formControls.collectionTime && this.state.formControls.collectionTime.value} 
                            onChange={this.changeHandler}
                            style={{width:"90%"}}
                            >
                                <option value="" defaultValue>-Select Time Period-</option>
                                <option value="06 AM to 07 AM">06 AM - 07 AM</option>
                                <option value="07 AM to 08 AM">07 AM - 08 AM </option>
                                <option value="08 AM to 09 AM">08 AM - 09 AM </option>
                                <option value="09 AM to 10 AM">09 AM - 10 AM</option>
                                <option value="10 AM to 11 AM">10 AM - 11 AM</option>
                                <option value="11 AM to 12 Noon">11 AM - 12 Noon</option>
                                <option value="12 PM to 01 PM">12 PM - 01 PM</option>
                                <option value="01 PM to 02 PM">01 PM - 02 PM </option>
                                <option value="2 PM to 3 PM">02 PM - 03 PM </option>
                                <option value="3 PM to 4 PM">03 PM - 04 PM </option>
                                <option value="4 PM to 5 PM">04 PM - 05 PM </option>
                                <option value="5 PM to 6 PM">05 PM - 06 PM </option>
                                <option value="6 PM to 7 PM">06 PM - 07 PM</option>
                                <option value="7 PM to 8 PM">07 PM - 08 PM </option>
                            </select>
                                                  
                            {
                                this.state.formControls && this.state.formControls.collectionTime && this.state.formControls.collectionTime.error &&
                                <div className="form-error text--center">{this.state.formControls.collectionTime.error}</div>  
                            }
                        </div>
                        <div className="col-20 padding-all-12 card-custom">
                            <div className="label">Preferred Payment Mode *</div>
                            <select className="form-control" name="paidType"
                            style={{width:"90%"}} 
                             value={this.state.formControls && this.state.formControls.paidType && this.state.formControls.paidType.value} 
                             onChange={this.changeHandler}
                            >                                  
                                    <option defaultValue hidden >-Select Payment Mode-</option>
                                    <option value="COD" >COD</option>
                                    <option value="PrePaid" >PrePaid</option>
                            </select>
                            {
                                this.state.formControls && this.state.formControls.paidType && this.state.formControls.paidType.error &&
                                <div className="form-error text--center">{this.state.formControls && this.state.formControls.paidType && this.state.formControls.paidType.error}</div>  
                            }
                        </div>
                        <article className="dialog-footer pad margin-top col-20">                                                      
                            <button onClick={this.submitOTP}     
                            className="BetaCuraSubmit">SUBMIT DETAILS</button>                                                                                                                                                                
                        </article> 
                    </div>
                </article>  
            </section>
                }
                
                {
                    this.state.page === "otp" &&
                    <article className="bakgrnd-grad" style={{paddingBottom:"20%"}}>
                         <div className="login-wrapper flex flex-direction--col flex-wrap pad card-custom margin-right--auto margin-left--auto" style={{minWidht:"55%", maxWidth:"55%",overflowX: "auto"}}>
                            <p style={{fontSize: "large", paddingTop:"10%"}}>OTP Sent to your mobile {this.state.formControls && this.state.formControls.phoneNumber && this.state.formControls.phoneNumber.value}.<br/>
                            Please submit the OTP (One Time Password).</p>
                            <input  type="text"
                                    className="form-control"
                                    name="otp"
                                    placeholder="Type Here"
                                    value={this.state.formControls && this.state.formControls.otp && this.state.formControls.otp.value}
                                    onChange={this.changeHandler}
                                />
                                {
                                    this.state.formControls && this.state.formControls.otp && this.state.formControls.otp.error &&
                                    <div className="form-error text--center">{this.state.formControls && this.state.formControls.otp && this.state.formControls.otp.error}</div>  
                                }
                                <article className="dialog-footer pad margin-top col-20">                                                                                                                                                                                                                       
                                    <button onClick={this.submitData}                                                                                                                                                                                                                                                    
                                    className="btn btn-fill btn-green margin-left--half dialog--cta pointer">SUBMIT OTP</button>                                                                                                                                                                      
                                </article> 
                                <div style={{textAlign:'left',fontSize:"medium"}}> 
                                    <i className="mobile icon"></i>  
                                    <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>this.setState({opnPopup:true})}>Change Phone Number ?</span>   
                                </div>
                        </div>
                       
                    </article>
                }
                {
                    this.state.opnPopup &&
                    <Popup title="Resend OTP on new phone number" togglePopup={()=>this.setState(state=>{return{opnPopup:!state.opnPopup}})}>
                        <div className="senderId-modal--wrapper">
                            <div className="label">Change phone number ?</div>
                            <input  type="text"
                                className="form-control"
                                name="phoneNumber"
                                placeholder="New Phone Number"
                                value={this.state.formControls.phoneNumber.value}
                                onChange={this.changeHandler}
                            />
                        </div> 
                        <article className="dialog-footer pad margin-top col-20">
                            <button onClick={this.resendOTP} className="btn btn-fill btn-blue dialog--cta pointer">Resend OTP</button>           
                        </article>
                    </Popup>
                }
                {
                    this.state.page === "error" &&
                    <article className="bakgrnd-grad" style={{paddingBottom:"20%"}}>
                        <div className="login-wrapper flex flex-direction--col flex-wrap pad card-custom margin-right--auto margin-left--auto" style={{minWidht:"55%", maxWidth:"55%"}}>
                            <p style={{fontSize: "large",paddingTop:"10%"}}>{this.state.formControls.otp.error}</p>
                            <div className="dialog-footer pad margin-top col-20">                                                                 
                                <button onClick={this.resendOTP}     
                                className="btn btn-fill btn-green margin-left--half dialog--cta pointer">Resend OTP Again</button>                                                                                                                                                                
                            </div>
                            <div style={{textAlign:'left',fontSize:"medium"}}>  
                                <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>this.setState({page:"form"})}>Back to Employee Infomation form</span>                                                                                                                                       
                            </div> 
                        </div>
                            
                    </article>
                }
                {
                    this.state.page === "thank" &&
                    <article className="bakgrnd-grad" style={{paddingBottom:"50%"}}>
                        <div className="login-wrapper flex flex-direction--col flex-wrap pad card-custom margin-right--auto margin-left--auto" style={{minWidht:"55%", maxWidth:"55%",height:"330px"}}>
                            <div style={{fontSize: "large",fontWeight:"bold", padding:"20px 0"}} class="text--center">Thank you for the submission.<br/>Betacura team will reach out to you soon to co-ordinate further.</div>
                            {/* <div style={{fontWeight:'700',fontSize:'14px',fontStyle:'normal',marginTop:'8px'}}>An Aditys Birla representative will reach out to you.</div> */}
                        </div>
                    </article>
                }
                { 
                    this.state.submitLoader &&
                    <div className="flex col-2 margin-left--auto margin-right--auto">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
                 <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} /> 
            </React.Fragment>
            
        );

    }
}