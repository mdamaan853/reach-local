import React, {Component} from 'react';
import PageTitle from '../../Components/Helmet';
import {getAllClients,registerClient,fetchClientByEmail,businessAssign,fetchJUrl,sendJUrl} from '../../Services/clients-service';
import ClientsTable from './ClientsTable';
import Youtube from '../../Components/Youtube/Youtube';
import Popup from '../../Components/Popup/Popup';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import {getAgency} from '../../Services/clients-service';
import ClientDetails from './ClientDetails';
import {getBusinessDetails} from '../../Services/user-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

const initialState = {
    clients:[],
    start:0,
    howTo: false,
    howToM:false,
    maxResults:50,
    loader:false,
    hasNext:false,
    view:'table',
    profileToView:null,
    submitLoader: false,
    active:0,
    buid:"",
    joinUrl:"",
    tempBData:null,
    tempBFetched: false,
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
    }
}

const validEmailRegex = 
  RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

export default class Clients extends Component {
    constructor(props){
        super(props);
        this.state = initialState;
    }
    componentDidMount(){
        if(this.props.location.pathname === '/agency'){
            this.fetchAllAgency();
        }else{
            this.fetchAllClients();
        }
        this.fetchBusinessUid();
    }
    changeView(view){
        this.setState({
            view: view
        })
    }
    showVideo(){
        this.setState({
            howTo: !this.state.howTo
        })
    }
    showVideoM(){
        this.setState({
            howToM: !this.state.howToM
        }) 
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
    tableAction(action,index){
        if(action === 'detail'){
            this.setState({
                view: 'detail',
                profileToView: this.state.clients[index]
            })  
        }
    }
    fetchAllClients(){
        let body={};
        getAllClients(body)
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.setState({
                    clients: res.clients
                })
            }else{
                ToastsStore.error(res.message);
            }
        })
        .catch(err => {
            console.log(err);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    fetchAllAgency(){
        let body = {};
        getAgency(body)
        .then(response => response.json())
        .then( data => {
            if(data.success){
                this.setState({
                    clients: data.clients,
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!.");
            console.log(error);
        })
    }
    fetchBusinessUid(){
        getBusinessDetails()
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":null,"allowedActions":[],"uid":"70005000175","name":"Anand ","address":"112,Xyz","landmark":"India","locality":"Kalkaji","city":"Delhi","state":"Delhi","pincode":"110084","logo":"","website":"anand.com"};
            if (data.success && !!data.uid) {  
                data.state = {value:data.state,label:data.state};
                this.setState({
                    buid: data.uid
                })  
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    isValidUser(){
        var isValid = true;
        var temp = this.state.formControls;
        if(!temp.name.value.trim()){
          temp.name.error = "Please enter a valid Name.";
          isValid = false;
        }else if(!!temp.name.value){
          temp.name.error = "";
        } 
        if(!temp.companyName.value.trim()){
          temp.companyName.error = "Please enter Company Name";  
          isValid = false;
        }else if(temp.companyName.value.trim()){
          temp.companyName.error = "";  
        }
        if(!temp.username.value.trim() || temp.username.value.trim().length !== 10 ){
          temp.username.error = "Please enter a valid Number.";
          isValid = false;
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
        }
        this.setState({
            formControls: temp
        })   
        return isValid;
    }
    registerUser(event){
        event.preventDefault();
        if(!this.isValidUser()){
            return;
        }    
        const body = {
            "title" : "",
            "firstName" : this.state.formControls.name.value.trim(),
            "middleName" : "",
            "companyName" : this.state.formControls.companyName.value,
            "password" : this.state.formControls.password.value,
            "mobile" : this.state.formControls.username.value,
            "email" : this.state.formControls.email.value.trim(),
            "agencyUid" : this.state.buid
        }
        this.setState({
          submitLoader:true,
        })
        registerClient(body)
        .then(response => response.json())
          .then(data => {
             
              if(data.success){
                ToastsStore.success(data.message);
                this.fetchAllClients();
              }else{
                ToastsStore.error(data.message);
              }
              this.setState({
                submitLoader:false
              })              
          }).catch(error => {
              console.log(error);
              this.setState({
                submitLoader:false
              })
              ToastsStore.error("Something went wrong, Please Try Again Later ");
          })
    }
    changeTab(tab){
        this.setState({
            active: tab
        })
    }
    getClientByEmail(){
        var isValid = true;
        var temp = this.state.formControls;
        if(!validEmailRegex.test(temp.email.value.trim())){
            temp.email.error = "Please enter a valid Email.";
            isValid = false;
        }else if(validEmailRegex.test(temp.email.value.trim())){
            temp.email.error = "";
        }
        this.setState({
            formControls: temp
        })
        if(isValid){
            let body = {
                "email" : temp.email.value.trim(),
                "toAssignToAgency" : true
            }
            this.setState({
                submitLoader:true,
                tempBFetched: false
            })
            fetchClientByEmail(body)
            .then(response => response.json())
            .then(data => {
                if(data.exists){
                    this.setState({
                        tempBData: data.business,
                        tempBFetched: true
                    })
                }else{
                    this.getJoiningUrl();
                }              
                this.setState({
                    submitLoader:false
                })
            }).catch(error => {
                console.log(error);
                this.setState({
                    submitLoader:false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
        }
    }
    getJoiningUrl(){
        let body = {
            "businessUid": this.state.buid
        }
        fetchJUrl(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                this.setState({
                    joinUrl: data.signupUrl,
                    tempBData: null,
                    tempBFetched: true
                })
            }else{
                ToastsStore.error(data.message,4000);
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                joinUrl:""
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    sendUrl(){
        let body = {
            "businessUid": this.state.buid,
            "email": this.state.formControls.email.value
        }
        sendJUrl(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
               let msg = "Signup Url sent to "+this.state.formControls.email.value; 
               ToastsStore.success(msg,4000);
               this.clearDetails();
            }else{
                ToastsStore.error(data.message,4000);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Unable to Send, Please Try Again Later ");
        })
    }
    sendRequest(){
        let body = {
            "clientUid" : this.state.tempBData.uid,
            "agencyUid" : this.state.buid
        } 
        this.setState({
            submitLoader:true
        })
        businessAssign(body)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.success){
                ToastsStore.success(data.message);
                this.clearDetails();
            }else{
                ToastsStore.error(data.message);
            }              
            this.setState({
                submitLoader:false
            })
        }).catch(error => {
            console.log(error);
            this.setState({
                submitLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    clearDetails(){
        let t = this.state.formControls;
        t.email.value = "";
        t.email.error = "";
        this.setState({
            tempBData: null,
            tempBFetched: false,
            joinUrl: "",
            formControls: t
        });
    }
    copyUrl = (event) => {
        navigator.clipboard.writeText(this.state.joinUrl);
        ToastsStore.success("Short Url Copied to Clipboard.");
        console.log(event);
    }
    render(){
        let page = this.props.location.pathname === '/agency' ? 'Agency' : 'Clients';
        return(
            <main className="wrapper-container">
                <PageTitle title={page} description='Welcome'/>
                {
                    this.state.view === 'table' &&
                    <React.Fragment>
                        <article className="flex flex-direction--row align-space-between">
                            <div>
                                <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                                <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>{this.showVideoM()}}>Managing Clients</span>
                            </div>
                            {
                                this.state.howToM && 
                                <Popup title={'Managing Clients'} togglePopup={this.showVideoM.bind(this)}>
                                    <Youtube url={'dXWnXmho1u0'}/>
                                </Popup>
                            }
                            {/* <div style={{marginLeft:"73%"}}> */}
                            <div>
                                <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                                <span className="pointer text--bold text--underline" style={{color:'#4183c4'}} onClick={()=>{this.showVideo()}}>How to add new Clients ?</span>
                            </div>
                            {
                                this.state.howTo && 
                                <Popup title={'How to add new Clients ?'} togglePopup={this.showVideo.bind(this)}>
                                        <Youtube url={'fWy2Jcss-xw'}/>
                                </Popup>
                            }
                        </article>
                        <article className="card-custom flex flex-direction--row flex-wrap pad--half">
                       
                            <h4 className="ui header">{page}</h4>
                            {
                                page === 'Clients' &&
                                <button className="btn btn-fill btn-success margin-left--auto"  onClick={()=>this.changeView('add')}>Add Client</button>
                            }
                        </article>
                
                        <ClientsTable
                            clients={this.state.clients}
                            start={this.state.start}
                            loader={this.state.loader}
                            hasNext={this.state.hasNext}
                            action={this.tableAction.bind(this)}
                        />
                    </React.Fragment>
                }
               
                { 
                    this.state.view === 'add' && 
                    <React.Fragment>
                        <button onClick={()=>this.changeView("table")} className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                       
                        <div className="ui pointing secondary menu">
                            <div className={`${this.state.active === 0 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(0)}>Add Existing</div>
                            <div className={`${this.state.active === 1 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(1)}>Register New</div>
                        </div>
                        <div className="ui segment">
                            {
                                this.state.active === 0 &&
                                <div className="col-6 field margin-left--auto margin-right--auto pad required simple-card">
                                    <div className="label">Email</div>
                                    <div className="ui left icon input" style={{width:'100%',marginBottom:'11px',position:'relative'}}>
                                        <i aria-hidden="true" className="at icon"></i>
                                        <input type="text" name="email" value={this.state.formControls.email.value} onChange={this.changeHandler} id="email" placeholder="Enter Email"/>
                                        {
                                            this.state.formControls.email.value &&
                                            <i aria-hidden="true" className="close icon" onClick={()=>this.clearDetails()} style={{position:'absolute',right:'18px',left:'88%',opacity:'1',cursor:'pointer',pointerEvents:'all'}}></i>
                                        }
                                    </div>
                                    {
                                        this.state.formControls.email.error &&
                                        <div className="form-error text--center">{this.state.formControls.email.error}</div>
                                    }
                                    {
                                        this.state.tempBData && this.state.tempBFetched &&
                                        <div className="margin-btm">
                                            <div className="text--center" style={{color:'green'}}>Client Details Found</div>
                                            <div><span className="text--darker text--bold">Name:&nbsp;</span><span>{this.state.tempBData.name}</span></div>
                                            <div><span className="text--darker text--bold">Email:&nbsp;</span><span>{this.state.tempBData.email}</span></div>
                                        </div>
                                    }
                                    {
                                        this.state.tempBFetched && !this.state.tempBData &&
                                        <React.Fragment>
                                            <div className="text--center form-error margin-btm--half">
                                                No Client Found with given details.
                                            </div>
                                            <button className="ui fluid twitter button" style={{marginBottom:'12px'}} onClick={()=>this.sendUrl()}>Send Signup Url</button>  
                                            <div className="ui action input" style={{width:'67%'}}>
                                                <input type="text" value={this.state.joinUrl} readOnly/>
                                                <button className="ui teal icon right labeled tiny button" onClick={()=>this.copyUrl()}>
                                                    <i aria-hidden="true" className="copy icon"></i>
                                                    Copy
                                                </button>
                                            </div>                                              
                                        </React.Fragment> 
                                    }
                                    {
                                        !this.state.submitLoader && this.state.tempBData && this.state.tempBFetched &&
                                        <button className="ui fluid twitter button" style={{marginBottom:'12px'}} onClick={()=>this.sendRequest()}>Request Client To Join</button>
                                    }
                                    {
                                        !this.state.submitLoader && !this.state.tempBFetched && !this.state.tempBData && 
                                        <button className="ui fluid positive primary button" onClick={()=>this.getClientByEmail()}>Get Details</button>
                                    }
                                    {
                                        this.state.submitLoader && 
                                        <div className="margin-top--double">
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        </div>
                                    }
                                </div>
                            }
                            {
                                this.state.active === 1 &&
                                <form id="loginform" className="ui form col-7 margin-left--auto margin-right--auto pad simple-card" onSubmit={this.registerUser.bind(this)}>
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
                                    </div>
                                    {
                                        !this.state.submitLoader &&
                                        <input type="submit" className="ui fluid positive primary button" value="Register"/>
                                    }
                                    {
                                        this.state.submitLoader && 
                                        <div className="margin-top--double">
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        </div>
                                    }
                                </form>
                            }    
                        </div>
                    </React.Fragment>
                }

                { 
                    this.state.view === 'detail' && 
                    <React.Fragment>
                        <ClientDetails
                            back={this.changeView.bind(this)}
                            info={this.state.profileToView}
                            page={page}
                        />
                    </React.Fragment>
                }

                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
            </main>
        );
    }

}