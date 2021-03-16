import React, { Component } from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import {leadSendOtp,submitLeadData} from '../../Services/user-service';
import './LandingPage.css';

const initialState = {
    //   formControls: {
    //     otp:{
    //         value:'',
    //         error:''
    //     }
    // },
    submitLoader: false,
    view: 'form',
    showMobile: true,
    resendDisable:true,
    parentUrl:'',
    formControls:{
        name:{
            value:'',
            error:''
        },
        phone_number:{
            value:'',
            error:''
        },
        city:{
            value:'',
            error:''
        },
        pincode:{
            value:'',
            error:''
        },
        keyword1:{
            value:'',
            error:''
        },
        otp:{
            value:'',
            error:''
        }
    }
}
class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state=initialState;
    }

    componentDidMount(){
        document.getElementsByTagName('body')[0].style.background = "rgba(234,250,255,1)";
        this.setState({
            parentUrl: document.referrer
        },()=>this.prefillData());
    }

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

    sendOtp(event){
        event.preventDefault();
        let temp = this.state.formControls;
        if(this.state.formControls.pincode.value.length !== 6){
            temp.pincode.error = "Please enter 6 digit Pincode";
            this.setState({
                formControls: temp
            })
            return;
        }else{
            temp.pincode.error = "";
            this.setState({
                formControls: temp,
                submitLoader: true
            })
        }
        leadSendOtp(this.state.formControls.phone_number.value)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.success) {
                this.setState({
                    submitLoader: false,
                    view: 'otp'                    
                })
            } else {
                this.setState({
                    submitLoader: false
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                submitLoader:false
            })
        })
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
        // console.log(this.state.formControls);
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
                    view: 'thank'                    
                })
            }else{
                let temp2 = this.state.formControls;
                temp2.otp.error = data.message;
                this.setState({
                    submitLoader: false,
                    formControls: temp2                    
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                submitLoader: false,
                view: 'thank'                    
            })
        })
    }

    getFormData(){
        let queryString = "";
        Object.entries(this.state.formControls).forEach(e => {
            queryString+= '&' + e[0] + '=' + e[1].value    
        })
        return queryString;
    }

    prefillData(){
        try{
            let str = this.state.parentUrl;
            console.dir(str);
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

    backToForm(){
        let temp3 = this.state.formControls;
        temp3.otp.error = "";
        this.setState({
            view:'form',
            formControls:temp3
        })
    }

    render(){
        return(
                <section className="pad medlife">
                    {
                        this.state.view === 'form' &&
                        <React.Fragment>
                            <form id="data-form" className="ui form" onSubmit={this.sendOtp.bind(this)}>
                                <div className="medlife header">
                                    <div className="medlife header text">Book Your Test</div>
                                </div>
                                <div className="margin-btm">
                                    <div className="required field">
                                        <label>Name</label>
                                        <div className="ui input">
                                            <input type="text" 
                                                className="iframe-input" 
                                                name="name"
                                                onChange={this.changeHandler}
                                                value={this.state.formControls.name.value}
                                                placeholder="Enter Your Name" required/>
                                        </div>
                                        {
                                            this.state.formControls.name.error &&
                                            <div className="form-error text--center">{this.state.formControls.name.error}</div>
                                        }
                                    </div>
                                    <div className="required field">
                                        <label>Phone Number</label>
                                        <div className="ui input">
                                            <input type="number" className="iframe-input" inputMode="numeric" pattern="[0-9]*" name="phone_number" value={this.state.formControls.phone_number.value} onChange={this.changeHandler} id="username" placeholder="Enter Phone Number"/>
                                        </div>
                                        {
                                            this.state.formControls.phone_number.error &&
                                            <div className="form-error text--center">{this.state.formControls.phone_number.error}</div>
                                        }
                                    </div>
                                    <div className="required field">
                                        <label>City</label>
                                        <select id="city" name="city" class="form-control" value={this.state.formControls.city.value} onChange={this.changeHandler}>
                                            <option value="" hidden selected>Select a City</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Kolkata">Kolkata</option>
                                            <option value="Delhi NCR">Delhi NCR</option>
                                            <option value="Ahmedabad">Ahmedabad</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                            <option value="Pune">Pune</option>
                                            <option value="Chennai">Chennai</option>
                                            <option value="Lucknow">Lucknow</option>
                                            <option value="Jaipur">Jaipur</option>
                                            <option value="Kanpur">Kanpur</option>
                                            <option value="Surat">Surat</option>
                                            <option value="Vadodara">Vadodara</option>
                                            <option value="Nashik">Nashik</option>
                                            <option value="Patna">Patna</option>
                                        </select>
                                        {
                                            this.state.formControls.city.error &&
                                            <div className="form-error text--center">{this.state.formControls.city.error}</div>
                                        }
                                    </div>
                                    <div className="required field">
                                        <label>Pincode</label>
                                        <div className="ui input">
                                            <input 
                                                type="number" inputMode="numeric" pattern="[0-9]*"
                                                className="iframe-input"
                                                name="pincode"
                                                onChange={this.changeHandler}
                                                value={this.state.formControls.pincode.value}
                                                placeholder="Pincode" required/>
                                        </div>
                                        {
                                            this.state.formControls.pincode.error &&
                                            <div className="form-error text--center">{this.state.formControls.pincode.error}</div>
                                        }
                                    </div>
                                    <div className="required field">
                                        <label>Select Test</label>
                                        <select id="keyword1" name="keyword1" class="form-control" required="" value={this.state.formControls.keyword1.value} onChange={this.changeHandler}>
                                            <option value="" hidden selected>Select a Health Checkup</option>
                                            <option value="Advanced Full Body Checkup - ₹899">Advanced Full Body Checkup - ₹899</option>
                                            <option value="Comprehensive Full Body Checkup with Vitamin D &amp; B12 - ₹1999">Comprehensive Full Body Checkup with Vitamin D &amp; B12 - ₹1999</option>
                                            <option value="Comprehensive Full Body Checkup  - ₹1299">Comprehensive Full Body Checkup - ₹1299</option>
                                            <option value="Master Full Body Checkup with Cancer &amp; Arthritis Screening (Female)  - ₹2249">Master Full Body Checkup with Cancer &amp; Arthritis Screening (Female) - ₹2249</option>
                                            <option value="Master Full Body Checkup with Cancer &amp; Arthritis Screening (Male)  - ₹2249">Master Full Body Checkup with Cancer &amp; Arthritis Screening (Male) - ₹2249</option>
                                            <option value="Comprehensive Full Body Checkup with Vitamin D - ₹1599">Comprehensive Full Body Checkup with Vitamin D - ₹1599</option> 
                                        </select>
                                        {
                                            this.state.formControls.keyword1.error &&
                                            <div className="form-error text--center">{this.state.formControls.keyword1.error}</div>
                                        }
                                    </div>
                                </div>
                                {
                                    !this.state.submitLoader &&
                                    <input type="submit" className="medlife form-submit-btm" value="Book Now"/>
                                }
                                {
                                    this.state.submitLoader && 
                                    <div className="margin-top--quar">
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </form>
                        </React.Fragment>
                    }
                    {
                        this.state.view === 'otp' &&
                        <form id="data-form" className="ui form" onSubmit={this.submitData.bind(this)}>
                            <div className="required field margin-btm">
                                <label>Submit OTP</label>
                                <div style={{fontSize:'12.3px'}}>OTP sent to your Phone Number <span style={{color:'#0c73a5'}}>{this.state.formControls.phone_number.value}</span></div>
                                <div className="ui input">
                                    <input type="number" inputMode="numeric" pattern="[0-9]*" name="otp" value={this.state.formControls.otp.value} onChange={this.changeHandler}/>
                                </div>
                                {
                                    this.state.formControls.otp.error &&
                                    <div className="form-error text--center">{this.state.formControls.otp.error}</div>
                                }
                            </div>
                            {
                                !this.state.submitLoader &&
                                <React.Fragment>
                                    <input type="submit" className="medlife form-submit-btm" value="Submit OTP"/>
                                    <div onClick={()=>this.backToForm()} className="margin-top--half" style={{color:'#0c73a5',cursor:'pointer'}}>
                                        <span>Change Phone Number</span>
                                    </div>
                                </React.Fragment>
                            }
                            {
                                this.state.submitLoader && 
                                <div className="margin-top--quar">
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                </div>
                            }
                        </form>
                    }
                    {
                        this.state.view === 'thank' && 
                            <div id="data-form">
                                <div style={{fontWeight:'700',fontSize:'32px',color:'rgb(12, 115, 165)'}} class="text--center">Your Order has been booked.</div>
                                <div style={{fontWeight:'700',fontSize:'14px',fontStyle:'normal',marginTop:'8px'}}>A medlife representative will reach out to you.</div>
                            </div>
                    }       
                </section>
        );
    }
}

export default LandingPage;