import React, {Component} from 'react';
import PageTitle from '../../Components/Helmet';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import {updatePaymentDetails,
         userUpdate,getUserDetails,
         getBusinessDetails,editBusinessDetail,
         addEmployee,
         changePassword,
         getAllEmployees,
         updateEmployee,
         getPaymentDetails} from '../../Services/user-service';
import {getNewRoleGroupTable,assignRoleGroup} from '../../Services/roles-service';
import Popup from '../../Components/Popup/Popup';
import {fetchRoles} from '../../Services/roles-service';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import BusinessDetails from './BusinessDetails';
import TaxDetails from './TaxDetails';
import ProfileDetails from './ProfileDetails';
import Youtube from '../../Components/Youtube/Youtube';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import './Profile.css';

const initialState = {
    userInfo:null,
    businessInfo:null,
    buid:null,
    taxInfo:null,
    userDTO:null,
    employees:[],
    howTo: false,
    isChange:false,
    // howTo: false,
    password:{
        oldPassword:{
            value:"",
            error:""
        },
        newPassword:{
            value:"",
            error:""
        },
        rePassword:{
            value:"",
            error:""
        }
    },
    permissionGroups:[],
    rolesFetched:false,
    viewBusinessDetails:false,
    viewTaxDetails:false,
    viewProfileDetails:false,
    confirmationLoader:false,
    isBusinessEdit:false,
    profilePopupHeader:"",
    popType:"self",
    delete:false
}

const emptyUserDTO = {
    "title":"Mr",
    "firstName":"",
    "middleName":"",
    "lastName":"",
    "password":"",
    "mobile":"",
    "email":"",
    "gender":"male",
    "dob":0,
    "uid":"",
    "walletInfo":{
         "walletId":'',
         "amount":''
    },
    "permissionGroups":[]
}

class ProfileV1 extends Component{
   constructor(){
      super();
      this.state = initialState;
      this.setPassword = this.setPassword.bind(this);
      this.changePaswrdHandler = this.changePaswrdHandler.bind(this);
   }

   componentDidMount(){
        if(utils.isAdmin){
            this.afterDidMount();
        }else{
            this.getRequiredRoles();
        }
   }

   setPassword(event){
       event.preventDefault();
       let body={
        oldPassword : this.state.password.oldPassword.value.trim(),
        password : this.state.password.rePassword.value.trim()
       }
       if(!this.state.password.oldPassword.value){
           ToastsStore.error("Old Password field is mandatory!!!");
           return;
       }
       if(!this.state.password.rePassword.value){
        ToastsStore.error("Confirm Password field is mandatory!!!");
        return;
       }
       if(!this.state.password.newPassword.value){
        ToastsStore.error("New Password field is mandatory!!!");
        return;
       }
       if(this.state.password.rePassword.value !== this.state.password.newPassword.value){
        this.setState(state=>{
            return{
                password:{
                    ...state.password,rePassword:{
                        ...state.password.rePassword,error:"Password do not match" 
                    }       
                }
            } 
        });
        return;
       }
    changePassword(body)
        .then(res => res.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.clearPassword();
                this.setState({isChange:false});
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error=>{
            ToastsStore.error("Something went wrong.Please try again later.!!!");
        })

    }   

    clearPassword(){
        let temp = this.state.password;
        temp.oldPassword.value = "";
        temp.newPassword.value = this.state.password.newPassword.value;
        temp.rePassword.value = this.state.password.rePassword.value;
        this.setState({
            password:temp
        })
        console.log(temp);
    }

   afterDidMount(){
      this.fetchUserDetail();
      if(utils.isAdmin){
          this.fetchAllEmployees();
      }
   }

   prefillMockdata(){
       let obj = {
        "userDetails": [
          {
            "dob": 1582050600000,
            "email": "string",
            "firstName": "string",
            "gender": "string",
            "lastName": "string",
            "middleName": "string",
            "mobile": "string",
            "password": "string",
            "permissionGroups": [
              {
                "groupId": 0,
                "name": "string1",
              },
              {
                "groupId": 1,
                "name": "string11",
              },
              {
                "groupId": 2,
                "name": "string22",
              },
              {
                "groupId": 3,
                "name": "string33",
              }
            ],
            "title": "string",
            "uid": "string"
          },
          {
            "dob": 1582050600000,
            "email": "string2",
            "firstName": "strin2",
            "gender": "string222",
            "lastName": "string22",
            "middleName": "strin222g",
            "mobile": "string222",
            "password": "string222",
            "permissionGroups": [
              {
                "groupId": 0,
                "name": "string1",
              },
              {
                "groupId": 1,
                "name": "string11",
              },
              {
                "groupId": 2,
                "name": "string22",
              },
              {
                "groupId": 3,
                "name": "string33",
              }
            ],
            "title": "string",
            "uid": "string"
          }
        ]
      };
      this.setState({
          employees: obj.userDetails
      })
   }

    showVideo(){
        this.setState({
            howTo: !this.state.howTo
        })
    }

   getRequiredRoles(){
        fetchRoles('Profile')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
            }
            this.afterDidMount();
        })
        .catch(error =>{
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    fetchUserDetail(){
        getUserDetails()
        .then(response => response.json())
          .then(data => {
            //var data = {"success":true,"message":"Success","allowedActions":[],"userDetails":{"title":"Mr","firstName":"Anand","middleName":"Kumar","lastName":"Verma","password":null,"mobile":"+918800263891","email":"sam@l.com","gender":"Male","dob":1582050600000,"uid":"10001000396","walletInfo":{"walletId":3,"amount":-827000}},"allowedPanels":["Dashboard","Mediums","LandingPageManagement","Datasource","Campaigns","Credits","Leads","LeadReportUpload","LeadsUpload","SenderIds","Statements","MissedCallNumbers","MissedCallAssigned","ShortCode","ShortCodeAssigned","Agency","Clients","Segments","SegmentGroups","Roles","Permissions","Quickbook","Profile","SMSTemplate"],"roles":["su_admin"],"type":"BUSINESS"};
            if(data.success){
               this.setState({
                rolesFetched: true,
                userInfo: data.userDetails
               })
            }
          })
          .catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        });
    }

    showBusinessDetails(){
        this.setState({
            viewBusinessDetails:true
        })
        getBusinessDetails()
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":null,"allowedActions":[],"uid":"70005000175","name":"Anand ","address":"112,Xyz","landmark":"India","locality":"Kalkaji","city":"Delhi","state":"Delhi","pincode":"110084","logo":"","website":"anand.com"};
            if (data.success && !!data.uid) {  
                data.state = {value:data.state,label:data.state};
                this.setState({
                    businessInfo: data
                })  
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    showTaxDetails(){
        this.setState({
            viewTaxDetails:true
        })
        getBusinessDetails()
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":null,"allowedActions":[],"uid":"70005000175","name":"Anand ","address":"112,Xyz","landmark":"India","locality":"Kalkaji","city":"Delhi","state":"Delhi","pincode":"110084","logo":"","website":"anand.com"};
            if (data.success && !!data.uid) {
                this.setState({
                    buid: data.uid
                },() => this.fetchTaxDetail(data.uid));
            } else {
                ToastsStore.error("Please Save Business Details First.");
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    fetchTaxDetail(uid){
        const body = {
            businessUid:uid
        }
        getPaymentDetails(body)
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":null,"allowedActions":[],"businessUid":"70005000175","taxType":"NONE","registrationNumber":"None","pan":"None"};
            if (data.success) {
                this.setState({
                    taxInfo: data
                })
            }else{
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

   closePopup(){
       this.setState({
           viewBusinessDetails: false,
           isBusinessEdit: false,
           viewTaxDetails:false,
           viewProfileDetails:false
       })
   }

   changeViewToEditBusiness(){
       this.setState({
            isBusinessEdit: true
       });
   }

   showProfileDetails(type){
        if(type === 'edit-s'){
            this.setState({
                viewProfileDetails:true,
                popType:'self',
                headerText:'Profile Details',
                userDTO:this.state.userInfo
            })
        }else if(type === 'add'){
            this.setState({
                viewProfileDetails:true,
                popType:'add-e',
                headerText:'Employee Details',
                userDTO: emptyUserDTO
            },()=>this.fetchPermissionGroups())
        }
   }

   fetchPermissionGroups(){
        const body={ }  
        getNewRoleGroupTable(body)
        .then(response => response.json())
        .then( data => {
            //let data = { "success": true, "message": null, "allowedActions": [], "groups": [ { "groupId": 1, "name": "testing123", "roles": [] }, { "groupId": 2, "name": "Testing", "roles": [] }, { "groupId": 3, "name": "testing2", "roles": [ { "role": "admin", "subRoles": null, "name": "admin", "panel": "Profile", "parent": true }, { "role": "medium_mgmt", "subRoles": [ { "role": "medium_create", "subRoles": null, "name": "medium_create", "panel": "Mediums", "parent": false }, { "role": "medium_map_datasource", "subRoles": null, "name": "medium_map_datasourc", "panel": "Mediums", "parent": false } ], "name": "medium_mgmt", "panel": "Mediums", "parent": true } ] } ] };
            if(data.success){
                this.setState({
                    permissionGroups: this.formatMulSelectData(data.groups),
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

   formatMulSelectData(data){
       let temp = [];
       if(data && data.length>0){
            data.forEach(e=> {
                let obj = {
                    "value": e.groupId, 
                    "label": e.name 
                }
                temp.push(obj);
            });
       }
       return temp; 
   }

   saveBusinessDetails(){
        if(!this.state.businessInfo.state){
            ToastsStore.error("State cannot be empty");
            return;
        }
        const body = {
            address: this.state.businessInfo.address,
            city: this.state.businessInfo.city,
            landmark: this.state.businessInfo.landmark,
            locality: this.state.businessInfo.locality,
            logo: this.state.businessInfo.logo,
            name: this.state.businessInfo.name,
            pincode: this.state.businessInfo.pincode,
            state: this.state.businessInfo.state.value,
            website: this.state.businessInfo.website,
            uid: this.state.businessInfo.uid
        }
        if(this.checkMandatoryFields({"Address":body.address,"City":body.city,"Company Name":body.name,"Pincode":body.pincode,"State":body.state})){
            this.setState({
                confirmationLoader: true
            })
            editBusinessDetail(body)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    confirmationLoader: false,
                    isBusinessEdit:false
                })
                if (data.success) {
                    ToastsStore.success("Details Saved Successfully !");
                } else {
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                }
            }).catch(error => {
                    console.log(error);
                    this.setState({
                        confirmationLoader:false
                    })
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
        }
    }

   saveTaxDetails(){
        let uid = this.state.buid;
        if(!uid){
            ToastsStore.error("Please Save Business Details First");
            return;
        }
        if(this.state.taxInfo.taxType === "GST registered- Regular" || this.state.taxInfo.taxType === "GST registered- Composition"){
            if(! this.state.taxInfo.registrationNumber){
                ToastsStore.error("GST Number is mandatory");
                // console.log(this.state.taxInfo.taxType);
                return;
            }        
        }
        const body = {
            businessUid: uid,
            pan: this.state.taxInfo.pan,
            registrationNumber: this.state.taxInfo.registrationNumber,
            taxType: this.state.taxInfo.taxType,
        }
        if(this.checkMandatoryFields({'PAN NO':body.pan,"GST Registration Type":body.taxType})){
            this.setState({
                confirmationLoader: true
            })
            updatePaymentDetails(body)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    confirmationLoader: false,
                    isBusinessEdit:false
                })
                if (data.success) {  
                    ToastsStore.success("Details Saved Successfully !");
                } else {
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    confirmationLoader:false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
        }
   }

   saveProfileDetails(){
        if(this.state.popType==='self'){
            const body = {
                dob: this.state.userInfo.dob,
                email: this.state.userInfo.email,
                firstName: this.state.userInfo.firstName,
                gender: this.state.userInfo.gender,
                lastName: this.state.userInfo.lastName,
                middleName: this.state.userInfo.middleName,
                mobile: this.state.userInfo.mobile,
                title: this.state.userInfo.title,
                uid: this.state.userInfo.uid
            }
            if(this.checkMandatoryFields({'Name':body.firstName,"Mobile":body.mobile,"email":body.email})){
                this.setState({
                    confirmationLoader: true
                })
                userUpdate(body)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        confirmationLoader: false,
                    })
                    if (data.success) {
                        ToastsStore.success("Details Saved Successfully !");
                        this.setState({
                            confirmationLoader: false,
                            viewProfileDetails:false
                        })
                        this.fetchUserDetail();
                    } else {
                        ToastsStore.error("Something went wrong, Please Try Again Later ");
                    }
                }).catch(error => {
                    console.log(error);
                    this.setState({
                        confirmationLoader:false
                    })
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                })
            }
        }
   }

   saveEmployeeDetails(){
        let body = {
            "dob": this.state.userDTO.dob,
            "email": this.state.userDTO.email,
            "firstName": this.state.userDTO.firstName,
            "gender": this.state.userDTO.gender,
            "lastName": this.state.userDTO.lastName,
            "middleName": this.state.userDTO.middleName,
            "mobile": this.state.userDTO.mobile,
            "password": this.state.userDTO.password,
            "primaryRoles": [],
            "title": this.state.userDTO.title
        }
        if(this.checkMandatoryFields({'Name':body.firstName,"Mobile":body.mobile,"email":body.email,'password':body.password})){
            this.setState({
                confirmationLoader: true
            })
            addEmployee(body)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    ToastsStore.success("Details Saved Successfully !");
                    this.updatePermissions(data.uid);
                } else {
                    this.setState({
                        confirmationLoader: false,
                    })
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    confirmationLoader:false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
        }
   }

   fetchAllEmployees(){
        getAllEmployees()
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({
                    employees: data.userDetails
                })
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                confirmationLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
   }

   editEmployeeDetails(index){
        this.setState({
            viewProfileDetails:true,
            popType:'edit-e',
            headerText:'Employee Details',
            userDTO: this.formatEmployeeDto(this.state.employees[index])
        },() => { 
            this.fetchPermissionGroups();
        })
   }

   formatEmployeeDto(data){
       let temp = {
            "dob": data.dob,
            "email": data.email,
            "firstName": data.firstName,
            "gender": data.gender,
            "lastName": data.lastName,
            "middleName": data.middleName,
            "mobile": data.mobile,
            "password": data.password,
            "permissionGroups": this.formatMulSelectData(data.permissionGroups),
            "title": data.title,
            "uid": data.uid
        }
        return temp;
   }

   updateEmployeeDetails(){
        let body = {
            "dob": this.state.userDTO.dob,
            "email": this.state.userDTO.email,
            "firstName": this.state.userDTO.firstName,
            "gender": this.state.userDTO.gender,
            "lastName": this.state.userDTO.lastName,
            "middleName": this.state.userDTO.middleName,
            "mobile": this.state.userDTO.mobile,
            "password": this.state.userDTO.password,
            "primaryRoles": [],
            "title": this.state.userDTO.title,
            "uid":this.state.userDTO.uid

        }
        // console.log(this.state.userDTO.permissionGroups);
        if(this.checkMandatoryFields({'Name':body.firstName,"Mobile":body.mobile,"email":body.email})){
            this.setState({
                confirmationLoader: true
            })
            updateEmployee(body)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    ToastsStore.success("Details Saved Successfully !");
                    this.updatePermissions();    
                } else {
                    this.setState({
                        confirmationLoader: false,
                    })
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    confirmationLoader:false
                })
                ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
        }
   }

   updatePermissions(uid){
        let body = {
            "permissionGroupIds": this.getIds(this.state.userDTO.permissionGroups),
            "userUid": uid ? uid : this.state.userDTO.uid
        }
        assignRoleGroup(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                ToastsStore.success("Details Saved Successfully !");
                this.setState({
                    confirmationLoader: false,
                    viewProfileDetails:false
                },this.fetchAllEmployees());
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                confirmationLoader:false
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
   }

   getIds(data){
        let temp = [];
        if(data && data.length>0){
            data.forEach(e =>{
                temp.push(e.value)
            })
        }
        return temp;
   }

   checkMandatoryFields(body){
        for(let i in body){
        if(!body[i]){
            let str = " cannot be empty !"
            ToastsStore.error(i+str);
            return false;
        }
        if(i === 'pincode' && body[i].length < 6){
            ToastsStore.error("6 digit Pincode required");
            return false;
        }
        }
        return true;
    }

    bChangeHandler(event){
        let name = event.target.name;
        let val = event.target.value;
        let temp = this.state.businessInfo;
        temp[name] = val;
        this.setState({
            businessInfo: temp
        })
    }

    pChangeHandler(event){
        let name = event.target.name;
        let val = event.target.value;
        let temp = this.state.userDTO;
        temp[name] = val;
        // console.log(name,val);
        this.setState({
            userDTO: temp
        })
    }

    tChangeHandler(event){
        let name = event.target.name;
        let val = event.target.value;
        let temp = this.state.taxInfo;
        temp[name] = val;
        this.setState({
            taxInfo: temp
        })
    }
    
    handleChange(event){
            let name = 'state';
            let val = event;
            let temp = this.state.businessInfo;
            temp[name] = val;
            this.setState({
                businessInfo: temp
            })
    }

    handleRolesChange(event){
        let name = 'permissionGroups';
        let val = event;
        let temp = this.state.userDTO;
        temp[name] = val;
        this.setState({
            userDTO: temp
        })
    }

    dobChange = val => {
        let temp1 = this.state.userDTO;
        temp1.dob = val;
        this.setState({
            userDTO: temp1
        })
    }

    // showVideo(){
    //     this.setState({
    //         howTo: !this.state.howTo
    //     })
    // }

    changePaswrdHandler(event){
        event.preventDefault();
        const name=event.target.name;
        const value=event.target.value;
        this.setState(state=>{
            return{
                password:{
                    ...state.password,[name]:{
                        ...state.password.name,value 
                    }       
                }
            } 
        });    
    }
   
   render(){    
      return(
            <React.Fragment>
                <PageTitle title="Profile" description="Welcome to Profile"/>
                {
                  this.state.rolesFetched &&
                    <main>
                         <div style={{textAlign:'end'}}>
                              <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                              <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'end'}} onClick={()=>{this.showVideo()}}>How to Update Profile Details ?</span>
                        </div>
                        {
                              this.state.howTo && 
                              <Popup title={'How to Update Profile Details ?'} togglePopup={this.showVideo.bind(this)}>
                                    <Youtube url={'LZw65MM3zFA'}/>
                              </Popup>
                        }
                        <div className="ui centered cards">
                            <div className="ui card">
                                <div className="image">
                                    <div className="company-logo">
                                        <i aria-hidden="true" className="user outline huge icon global-loader" style={{color:'#8e8d8d'}}></i>
                                    </div>
                                </div>
                                <div className="content">
                                    <div className="header" style={{marginTop:'8px'}}>{this.state.userInfo.title}&nbsp;{this.state.userInfo.firstName}&nbsp;{this.state.userInfo.middleName}&nbsp;{this.state.userInfo.lastName}</div>
                                    {
                                        this.state.userInfo.gender &&
                                        <span>
                                            {this.state.userInfo.gender} |
                                        </span>
                                    } 
                                    {
                                        this.state.userInfo.dob &&
                                        <span>
                                            <Moment format="DD-MM-YYYY">{this.state.userInfo.dob}</Moment>
                                        </span>
                                    }
                                    <div className="description">
                                        <div>
                                            {`Mobile: ${this.state.userInfo.mobile}`}
                                        </div>
                                        <div onClick={()=>console.log(this.state.isChange)}>
                                            {`Email: ${this.state.userInfo.email}`}
                                        </div>
                                        <div style={{color:"red"}} className="pointer" onClick={()=>this.setState({isChange:true})}>Change Password </div>     
                                        {
                                            this.state.isChange &&
                                            <form>
                                                <div>
                                                    <label className="text--darker" for="oldPassword">Old Password:</label><br/>
                                                    <input type="password" className="form-control" id="oldPassword" name="oldPassword" onChange={this.changePaswrdHandler}></input>
                                                {
                                                    this.state.password.oldPassword.error &&
                                                    <span className="margin-left--half pointer text-intent">password do not match</span>
                                                }
                                                </div>
                                                <div>
                                                    <label className="text--darker" for="newPassword">New Password:</label><br/>
                                                    <input type="password" id="newPassword" className="form-control" name="newPassword" onChange={this.changePaswrdHandler}></input>
                                               
                                                </div>
                                                <div >
                                                    <label className="text--darker" for="rePassword">Confirm Password:</label><br/>
                                                    <input type="password" id="rePassword" className="form-control" name="rePassword" onChange={this.changePaswrdHandler}></input>
                                                {
                                                    this.state.password.rePassword.error &&
                                                    <span style={{color:"red"}} className="margin-left--half pointer form-error">{this.state.password.rePassword.error}</span>
                                                }
                                                </div>
                                                <div className="margin-top--half">
                                                    <button className="btn btn-fill col-9 margin-right--quar" onClick={()=>this.setState({isChange:false})}>BACK</button>
                                                    <button className="btn btn-fill btn-success col-9" onClick={this.setPassword}>SUBMIT</button>
                                                </div>
                                            </form>    
                                        }              
                                    </div>
                                </div>
                                <div className="extra content flex">
                                    <div className="ui vertical buttons" style={{margin:'auto'}}>
                                        {
                                            utils.hasRole('business_profile') &&
                                            <button onClick={() => this.showBusinessDetails()} className="ui icon right labeled small button">
                                                <i aria-hidden="true" className="eye small icon"></i>
                                                View Business Details
                                            </button>
                                        }
                                        {
                                            utils.hasRole('tax_detail') &&
                                            <button onClick={() => this.showTaxDetails()} className="ui icon right labeled small button">
                                                <i aria-hidden="true" className="eye small icon"></i>
                                                View Tax Details
                                            </button>
                                        }
                                        <button onClick={() => this.showProfileDetails('edit-s')} className="ui icon right labeled small button">
                                            <i aria-hidden="true" className="edit outline small icon"></i>
                                            Edit Profile
                                        </button>
                                        {
                                            utils.isAdmin &&
                                            <button onClick={() => this.showProfileDetails('add')} className="ui icon right labeled small button">
                                                <i aria-hidden="true" className="add user small icon"></i>
                                                Add Employee
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="margin-top--double">
                            {
                                utils.isAdmin && this.state.employees && this.state.employees.length>0 &&
                                <h3 class="ui dividing header" style={{marginTop:'36px',marginBottom:'36px'}}>Employees</h3>
                            }
                            <div className="ui cards">
                            {
                                this.state.employees.map((item,index) => {
                                    return(
                                        <div key={index} className="ui card">
                                            <div className="image">
                                                <div className="company-logo">
                                                    <i aria-hidden="true" className="user outline huge icon global-loader" style={{color:'#8e8d8d'}}></i>
                                                </div>
                                            </div>
                                            <div className="content">
                                                <div className="header" style={{marginTop:'8px'}}>{item.title}&nbsp;{item.firstName}&nbsp;{item.middleName}&nbsp;{item.lastName}</div>
                                                {
                                                    item.gender &&
                                                    <span>
                                                        {item.gender} |
                                                    </span>
                                                } 
                                                {
                                                    item.dob &&
                                                    <span>
                                                        <Moment format="DD-MM-YYYY">{item.dob}</Moment>
                                                    </span>
                                                }
                                                <div className="description">
                                                    <div>
                                                        {`Mobile: ${item.mobile}`}
                                                    </div>
                                                    <div>
                                                        {`Email: ${item.email}`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="extra content flex">
                                                <div className="ui vertical buttons" style={{margin:'auto'}}>
                                                    <button onClick={() => this.editEmployeeDetails(index)} className="ui icon right labeled small button">
                                                        <i aria-hidden="true" className="eye small icon"></i>
                                                        Edit Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            </div>
                        </div>
                    </main>
                }
                {
                  !this.state.rolesFetched &&
                  <div className="global-loader col-1">
                     <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                  </div>
                }
                { 
                    this.state.viewBusinessDetails &&
                    <Popup title={'Business Details'} togglePopup={this.closePopup.bind(this)} >
                        <BusinessDetails
                            isBusinessEdit={true}
                            closePopup={this.closePopup.bind(this)}
                            changeViewToEditBusiness={this.changeViewToEditBusiness.bind(this)}
                            saveBusinessDetails={this.saveBusinessDetails.bind(this)}
                            bChangeHandler={this.bChangeHandler.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            confirmationLoader={this.state.confirmationLoader}
                            businessInfo={this.state.businessInfo}>
                        </BusinessDetails>
                    </Popup>
                }
                { 
                    this.state.viewTaxDetails &&
                    <Popup title={'Tax/Registration Details'} togglePopup={this.closePopup.bind(this)} >
                        <TaxDetails
                            isBusinessEdit={true}
                            closePopup={this.closePopup.bind(this)}
                            changeViewToEditBusiness={this.changeViewToEditBusiness.bind(this)}
                            saveTaxDetails={this.saveTaxDetails.bind(this)}
                            tChangeHandler={this.tChangeHandler.bind(this)}
                            confirmationLoader={this.state.confirmationLoader}
                            taxInfo={this.state.taxInfo}>
                        </TaxDetails>
                    </Popup>
                }
                { 
                    this.state.viewProfileDetails &&
                    <Popup title={this.state.headerText} togglePopup={this.closePopup.bind(this)} >
                        <ProfileDetails
                            userInfo={this.state.userDTO}
                            closePopup={this.closePopup.bind(this)}
                            confirmationLoader={this.state.confirmationLoader}
                            saveEmployeeDetails={this.saveEmployeeDetails.bind(this)}
                            editEmployeeDetails={this.updateEmployeeDetails.bind(this)}
                            saveProfileDetails={this.saveProfileDetails.bind(this)}
                            dobChange={this.dobChange.bind(this)}
                            popType={this.state.popType}
                            permissionGroups={this.state.permissionGroups}
                            handleRolesChange={this.handleRolesChange.bind(this)}
                            pChangeHandler={this.pChangeHandler.bind(this)}>
                        </ProfileDetails>
                    </Popup>
                }
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
            </React.Fragment>
        );               
   }
}
 
export default ProfileV1;
