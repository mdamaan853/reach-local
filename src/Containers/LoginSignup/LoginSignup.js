import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {login,register,sendOTP,sendResetEmail} from '../../Services/user-service';
import './LoginSignup.css';

const initialState = {
    passwordConfirm:"",
    finalPassword:"",  
      formControls: {
        username: {
          value: '',
          error:''
        },
        password: {
            value: '',
            error:''
        },
        password_confirm: {
            value: '',
            error:''
        },
        email:{
            value: '',
            error:''
        },
        title:{
            value: 'Mr.'
        },
        name:{
            value: '',
            error:''
        },
        otp:{
            value:''
        },
        companyName:{
            value: '',
            error:''
        }
    },
    submitLoader: false,
    showMobile: true,
    resendDisable:true,
    resendTime:30,
    registerStep:'1',
    showPswrdMsg:false,
}
const validEmailRegex = 
  RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

class LoginSignup extends Component {
      constructor(props){
            super(props);
            this.state=initialState;
            this.changeHandlerConfrm = this.changeHandlerConfrm.bind(this);
      }

      changeHandlerConfrm(event){          
        this.setState({
            passwordConfirm: event.target.value
        },this.conditionalPassword.bind(this));           
      }

      conditionalPassword(){                    
            const passTrim = this.state.formControls.password.value;
            const passwordConfirm= this.state.passwordConfirm;
            this.setState({
                ...this.state.formControls,
                password:{
                    value:passTrim.trim()
                },
                passwordConfirm:passwordConfirm.trim()
            })
            // console.log(this.state+"print all state");  
            if(this.state.formControls.password.value){
                if(this.state.passwordConfirm.length === this.state.formControls.password.value.length){
                    if(this.state.passwordConfirm !== this.state.formControls.password.value){               
                        ToastsStore.error("Password do not match, Please retype again ! ");
                    }
                    else if(this.state.passwordConfirm === this.state.formControls.password.value){
                        ToastsStore.success("Password match");
                        this.setState({
                            finalPassword: this.state.passwordConfirm
                        })
                    }     
                } 
            }
            else{
                ToastsStore.error("please enter password field first");
            }            
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
      loginUser(event){       
            event.preventDefault();
          if(!this.state.formControls.email.value.trim()){
            ToastsStore.error("Please enter a valid email.");
            return;                                            
          } else if(!validEmailRegex.test(this.state.formControls.email.value.trim())){
            ToastsStore.error("Please enter a valid Email");
            return;
          } else if(!this.state.formControls.password.value                                 ){
            ToastsStore.error("Password cannot be empty ");
            return;
          }
          const body = {
              email: this.state.formControls.email.value.trim(),
              password: this.state.formControls.password.value.trim()
          }
          this.setState({
            submitLoader:true,
          })
          login(body)
          .then(response => response.json())   //there are three cases: 1. if false response 2. if true response 3. no response from the server. 
            .then(data => {
                     //to be changed
                this.setState({
                    submitLoader: false
                })
                if (data.success) {
                    window.location.reload();
                } else { //suppose we receieve some response but again that response is false.
                    // ToastsStore.error(data.message);
                    ToastsStore.error("Invalid Password");
                }
            }).catch(error => { 
                console.log(error);
                this.setState({
                submitLoader:false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
      }
      loginUsingOtp(event){
        event.preventDefault();
        if(!this.state.formControls.username.value.trim()){
            ToastsStore.error("Mobile number cannot be empty ");
            return;
        }else if(!this.state.formControls.otp.value){
            ToastsStore.error("OTP cannot be empty ");
            return;
        }
        const body = {
            "phoneNumber": this.state.formControls.username.value.trim(),
            "otp": this.state.formControls.otp.value,
        }
        this.setState({
            submitLoader:true,
        })
        login(body)
        .then(response => response.json())
        .then(data => {
                //to be changed
            this.setState({
                submitLoader: false
            })
            if (data.success) {
                window.location.reload();
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            this.setState({
            submitLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
      }
      isValidUser(){
          var isValid = true;
          var temp = this.state.formControls;
          var step = this.state.registerStep;
          if(!temp.name.value.trim()){
            temp.name.error = "Please enter a valid Name.";
            isValid = false;
            step = "1";
          }else if(!!temp.name.value){
            temp.name.error = "";
          } 
          if(!temp.companyName.value.trim()){
            temp.companyName.error = "Please enter Company Name";  
            isValid = false;
            step = "1";
          }else if(temp.companyName.value.trim()){
            temp.companyName.error = "";  
          }
          if(!temp.username.value.trim() || temp.username.value.trim().length !== 10 ){
            temp.username.error = "Please enter a valid Number.";
            isValid = false;
            step = "1";
          }else if(!!temp.username.value.trim() && temp.username.value.trim().length === 10){
            temp.username.error = "";
          }
          if(!validEmailRegex.test(temp.email.value.trim())){
            temp.email.error = "Please enter a valid Email.";
            isValid = false;
          }else if(validEmailRegex.test(temp.email.value.trim())){
            temp.email.error = "";
          }
          if(!temp.password.value){
            temp.password.error = "Please enter a valid password.";
            isValid = false;
          }else if(this.state.passwordConfirm !== temp.password.value){
              temp.password.error = "Passwords didn't matched !";
              isValid = false;
          }else if(this.state.passwordConfirm === temp.password.value){
            temp.password.error = ""
          }
          this.setState({
              formControls: temp,
              registerStep: step
          })   
          return isValid;
      }
      registerUser(event){
        event.preventDefault();
        if(!this.isValidUser()){
            return;
        }    
        const body = {
            email: this.state.formControls.email.value.trim(),
            firstName: this.state.formControls.name.value.trim(),
            lastName: "",
            middleName: "",
            mobile: this.state.formControls.username.value,
            password: this.state.passwordConfirm,
            title: this.state.formControls.title.value,
            companyName: this.state.formControls.companyName.value,
            type: (window.location.pathname && window.location.pathname !== "/login") ? window.location.pathname.split("/")[1].split("-")[0] : '',
          }
        this.setState({
          submitLoader:true,
        })
        register(body)
        .then(response => response.json())
          .then(data => {
              
              this.setState({
                  submitLoader: false
              })
              if (data.existsByMobile || data.existsByEmail) {
                ToastsStore.error(data.message,4000);
              } else if(data.success) {
                ToastsStore.success("Registerd Successfully.Please login using email");
                this.props.toggleLogin('login');
               
              } else {
                  ToastsStore.error(data.message);
              }
          }).catch(error => {
              console.log(error);
              this.setState({
              submitLoader:false
              })
              ToastsStore.error("Something went wrong, Please Try Again Later ");
          })
      }
   
      sendReset(){
        this.props.toggleLogin('passwrdMsg');
          const body ={
            "email" : this.state.formControls.email.value
          }
          sendResetEmail(body)
          .then(response => response.json())
          .then(data => {
              if(data.success){
                this.setState({
                    showPswrdMsg: true
                  })
                  ToastsStore.success(data.message);
              }
              else{
                  ToastsStore.error(data.message);
                  this.setState({
                    showPswrdMsg: false
                  })
              }
          })
          .catch(error =>{
             ToastsStore.error("Something went wrong. Please try again later");
          })

      }
    changeMobileNumber(){
        this.setState({
            showMobile:true
        })
    }
    triggerResend(){
       const id = setInterval(()=>{
            let time = this.state.resendTime - 1;
            if(!time){
                this.setState({
                    resendDisable:false
                })
                clearInterval(id);
                return;
            }
            this.setState({
                resendTime: time
            })
        },1000)
    }
    sendOtp(){
        if(!this.state.formControls.username.value || this.state.formControls.username.value.length !== 10){
            ToastsStore.error("Please Enter Valid Mobile Number !");
            return;
        }
        const body = {
            "phoneNumber": this.state.formControls.username.value
        }
        this.setState({
            submitLoader: true
        })
        sendOTP(body)
        .then(response => response.json())
        .then(data => {
            
            this.setState({
                submitLoader: false
            })
            if(data.success) {
                ToastsStore.success("OTP sent Successfully")
                this.setState({
                    showMobile:false,
                    resendTime:30
                })
                this.triggerResend();
            } else {
                ToastsStore.error("Something went Wrong, Please try again later ! ");
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                submitLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    resendOtp(){
        const body = {
            "phoneNumber": this.state.formControls.username.value
        }
        sendOTP(body)
        .then(response => response.json())
        .then(data => {
            
            this.setState({
                submitLoader: false
            })
            if(data.success) {
                this.setState({
                    resendDisable:true,
                    resendTime:30
                })
                this.triggerResend();
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                submitLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    changeRegisterStep(step){
        if(step === "1"){
            this.setState({
                registerStep:'1'
            })
        }else{
            this.setState({
                registerStep:'2'
            })
        }
    }
    render(){
        let logo = window.localStorage.getItem('logoUrl');
    return(
            <section>
                <PageTitle title="ReachLocalAds | Hyperlocal Targeting Platform for SMS, MMS, Pamphlets, Email, Push Notification" description="Welcome to ReachLocalAds"/>
                {/* <div className="login-container"> */}
                
                    {
                        this.props.currState === "login" && 
                        <div className="login-wrapper flex flex-direction--col flex-wrap pad" style={{marginTop:`${this.props.marginTop}`}}> 
                            <a href="/" className="flex" style={{maxHeight:'90px',overflow:'hidden'}}>
                                <img src={logo} alt='logo' style={{width: '100%',height: '48px','objectFit': 'cover'}} />
                            </a>
                            <form id="loginform" className="ui form" onSubmit={this.loginUser.bind(this)}>
                                <div className="required field">
                                    <label>Email</label>
                                    <div className="ui left icon input">
                                        <i aria-hidden="true" className="at icon"></i>
                                        <input type="text" name="email" value={this.state.formControls.email.value} onChange={this.changeHandler} id="username" placeholder="Enter Email"/>
                                    </div>
                                </div>
                                <div className="required field">
                                    <label>Password</label>
                                    <div className="ui left icon input">
                                        <i aria-hidden="true" className="lock icon"></i>
                                        <input type="password" name="password" value={this.state.formControls.password.value} onChange={this.changeHandler} id="password" placeholder="Enter Password"/>
                                    </div>
                                </div>
                                {
                                    !this.state.submitLoader && 
                                    <input type="submit" className="ui fluid positive primary button" value="Login"/>
                                }
                                {
                                    this.state.submitLoader && 
                                    <div className="margin-top--double">
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </form>
                            <div className="ui divider"></div>
                                <div role="list" className="ui divided horizontal list">
                                    <div role="listitem" className="item">
                                        <span onClick={()=>this.props.toggleLogin('signup')} style={{color: '#4183c4', cursor: 'pointer'}}>Register Now</span>
                                    </div>
                                    <div role="listitem" className="item">
                                        <span onClick={()=>this.props.toggleLogin('forgetPswrd')} style={{color: '#4183c4', cursor: 'pointer'}}>Forgot Password?</span>
                                    </div>
                                </div>
                        </div>
                        
                    }
                    {
                        this.props.currState === 'forgetPswrd' &&
                        <div className="login-wrapper flex flex-direction--col flex-wrap pad" style={{marginTop:`${this.props.marginTop}`}}>
                            <a href="/" className="flex" style={{maxHeight:'90px',overflow:'hidden'}}>
                                <img src={logo} alt='logo' style={{width: '100%',height: '48px','objectFit': 'cover'}} />
                            </a>
                            <p style={{fontSize:'1.3em',lineHeight:'1.3em', textAlign:'justify'}}>Enter your email below and we will send you an email with instruction to reset your account</p>
                           
                            <form id="loginform" className="ui form">
                                <div className="required field">
                                     <label>Email</label>
                                     <div className="ui left icon input">
                                         <i aria-hidden="true" className="at icon"></i>
                                         <input type="text" name="email" value={this.state.formControls.email.value} onChange={this.changeHandler} id="username" placeholder="Enter Email"/>
                                     </div>
                                 </div> 
                            
                                 {
                                    !this.state.submitLoader && 
                                    // <input type="submit" className="ui fluid positive primary button" value="Send Reset Link"/>
                                    <button
                                    onClick={this.sendReset.bind(this)} 
                                    className="ui fluid positive primary button">Send Reset Link</button>
                                }

                                {
                                    this.state.submitLoader && 
                                    <div className="margin-top--double">
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </form> 
                                <div className="ui divider"></div>
                                <div role="list" className="ui divided horizontal list">
                                    <div role="listitem" className="item">
                                        <span onClick={()=>this.props.toggleLogin('signup')} style={{color: '#4183c4', cursor: 'pointer'}}>Back to Register</span>
                                    </div>
                                    <div role="listitem" className="item">
                                        <span onClick={()=>this.props.toggleLogin('login')} style={{color: '#4183c4', cursor: 'pointer'}}>Back to Login</span>
                                    </div>
                                </div>
                         </div>
                    }
                    {
                        this.props.currState === 'passwrdMsg' && this.state.showPswrdMsg &&
                        
                        <div className="login-wrapper flex flex-direction--col pad" style={{marginTop:`${this.props.marginTop}`}}>
                            <a href="/" className="flex" style={{maxHeight:'90px',overflow:'hidden'}}>
                                <img src={logo} alt='logo' style={{width: '100%',height: '48px','objectFit': 'cover'}} />
                            </a>
                            <p style={{textAlign:'justify',fontSize:'1.3em',lineHeight:'1.3em',margin:'1.5em 0 2em'}}>Please check your email and please login again as per the provided instructions.</p>
                            <button onClick={()=>this.props.toggleLogin('login')} className="ui fluid positive primary button">Login</button>
                        </div>
                        
                    }
                    {
                        this.props.currState === 'passwrdMsg' && !this.state.showPswrdMsg &&
                        
                        <div className="login-wrapper flex flex-direction--col pad" style={{marginTop:`${this.props.marginTop}`}}>
                            <a href="/" className="flex" style={{maxHeight:'90px',overflow:'hidden'}}>
                                <img src={logo} alt='logo' style={{width: '100%',height: '48px','objectFit': 'cover'}} />
                            </a>
                            <p style={{textAlign:'justify',fontSize:'1.3em',lineHeight:'1.3em',margin:'1.5em 0 2em'}}>If provided email is a registered email ID, you will receive an email with further instructions on how to reset your password. In case you didn't receive this email, you need to create a new account.</p>
                            <button onClick={()=>this.props.toggleLogin('signup')} className="ui fluid positive primary button">Register</button>
                        </div>
                        
                    }
                    {
                        this.props.currState === 'signup' && 
                        <section className="login-wrapper flex flex-direction--col flex-wrap pad" style={{marginTop:`${this.props.marginTop}`}}>
                            <a href="/" className="flex" style={{maxHeight:'90px',overflow:'hidden'}}>
                                <img src={logo} alt='logo' style={{width: '100%',height: '48px','objectFit': 'cover'}} />
                            </a> 
                            <div className="ui tiny ordered steps">
                                <div className={`${this.state.registerStep === '1' ? 'active' : 'completed'} step pointer`} id="step1" onClick={()=>this.changeRegisterStep("1")}>
                                    <div className="content">
                                        <div className="title">Basic Info</div>
                                    </div>
                                </div>
                                <div className={`${this.state.registerStep === '1' ? '' : 'active'} step pointer`} style={{paddingRight:'1.1em'}} id="step2" onClick={()=>this.changeRegisterStep("2")}>
                                    <div className="content">
                                        <div className="title">Login Details</div>
                                    </div>
                                </div>
                            </div>
                            <form id="loginform" className="ui form" onSubmit={this.registerUser.bind(this)}>
                                {
                                    this.state.registerStep === '1' &&
                                    <div className="margin-btm">
                                        <div className="required field">
                                        <label>Name</label>
                                        <div className="ui input">
                                            <input type="text" 
                                                className="input-login" 
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
                                            <label>Company Name</label>
                                            <div className="ui input">
                                                <input type="text" name="companyName" value={this.state.formControls.companyName.value} onChange={this.changeHandler} id="companyName" placeholder="Enter Company Name"/>
                                            </div>
                                            {
                                                this.state.formControls.companyName.error &&
                                                <div className="form-error text--center">{this.state.formControls.companyName.error}</div>
                                            }
                                        </div>
                                        <div className="required field">
                                            <label>Mobile No.</label>
                                            <div className="ui labeled input">
                                                <div className="ui label label">+91</div>
                                                <input type="number" inputMode="numeric" pattern="[0-9]*" name="username" value={this.state.formControls.username.value} onChange={this.changeHandler} id="username" placeholder="Enter Mobile Number"/>
                                            </div>
                                            {
                                                this.state.formControls.username.error &&
                                                <div className="form-error text--center">{this.state.formControls.username.error}</div>
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    this.state.registerStep === '2' &&
                                    <div className="margin-btm">
                                        <div className="required field">
                                            <label>Email</label>
                                            <div className="ui left icon input">
                                                <i aria-hidden="true" className="at icon"></i>
                                                <input type="text" name="email" value={this.state.formControls.email.value} onChange={this.changeHandler} id="email" placeholder="Enter Email"/>
                                            </div>
                                            {
                                                this.state.formControls.email.error &&
                                                <div className="form-error text--center">{this.state.formControls.email.error}</div>
                                            }
                                        </div>
                                        <div className="required field">
                                            <label>Password</label>
                                            <div className="ui input">
                                                <input type="password" name="password" value={this.state.formControls.password.value} onChange={this.changeHandler} id="password" placeholder="Enter Password"/>
                                            </div>
                                            {
                                                this.state.formControls.password.error &&
                                                <div className="form-error text--center">{this.state.formControls.password.error}</div>
                                            }
                                        </div>
                                        <div className="required field">
                                            <label>Retype Password</label>
                                            <div className="ui input">
                                                <input type="password" name="passwordConfirm" value={this.state.passwordConfirm} onChange={this.changeHandlerConfrm} id="passwordConfirm" placeholder="Retype Password"/>
                                            </div>
                                            {
                                                this.state.formControls.password.error &&
                                                <div className="form-error text--center">{this.state.formControls.password.error}</div>
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    this.state.registerStep === '1' &&
                                    <div onClick={()=>this.changeRegisterStep("2")} className="ui fluid positive primary button">Save &amp; Continue&nbsp;<i aria-hidden="true" className="arrow right icon"></i></div>
                                }
                                {
                                    !this.state.submitLoader && this.state.registerStep === '2' &&
                                    <input type="submit" className="ui fluid positive primary button" value="Signup"/>
                                }
                                {
                                    this.state.submitLoader && 
                                    <div className="margin-top--double">
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                                <div className="ui divider"></div>
                                <div role="list" className="ui divided horizontal list">
                                    <div role="listitem" className="item">
                                        <span onClick={()=>this.props.toggleLogin('login')} style={{color: '#4183c4', cursor: 'pointer'}}>Login using Email</span>
                                    </div>
                                </div>
                            </form>
                            
                        </section>
                    }
                   
                {/* </div> */}
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
            </section>
        );
    }
}

export default LoginSignup;