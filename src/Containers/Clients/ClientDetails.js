import React, {Component} from 'react';
import ClientServiceTable from '../../Components/Client/ClientServiceTable';
import SegmentGroupTable from '../../Components/SegmentGroup/SegmentGroupTable';
import {getAgency,updateAgency} from '../../Services/clients-service';
import {getAllServices,assignService} from '../../Services/subscriptions-service';
import {
    updatePaymentDetails,
    userUpdate,getBusinessUserDetails,
    getClientBusinessDetails,editBusinessDetail,updateBPaidType,
    getPaymentDetails} from '../../Services/user-service';
import {getAllServicePackages,pkgAssign} from '../../Services/subscriptions-service';
import {getNewRoleGroupTable} from '../../Services/roles-service';
import {getAllSegmentGroups,assignSegmentGroups} from '../../Services/segment-service';
import {addUpdateClient,getDatasource,getAudienceMediumMapping,getParentDetails} from '../../Services/datasource-service';
import { getMediums } from '../../Services/medium-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import PopUp from '../../Components/Popup/Popup';
import { Icon, Popup } from 'semantic-ui-react';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import BusinessDetails from '../Profile/BusinessDetails';
import TaxDetails from '../Profile/TaxDetails';
import ProfileDetails from '../Profile/ProfileDetails';
import DatasourceTable from '../../Components/Datasource/DatasourceTable';
import { ToastsStore} from 'react-toasts';
import ClientEditDatasource from './ClientEditDatasource';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';
import {getPackage} from '../../Services/subscriptions-service';
import EditPackage from '../../Components/ServicePackage/EditPackage';
import ViewPkgDetail from '../../Components/ServicePackage/ViewPkgDetail';
//import AssignedPkg from '../../Components/Client/AssignedPkgTable';

const initialState = {
    active:5,
    start:0,
    minPrice:0,
    userInfo:null,
    businessInfo:null,
    buid:null,
    taxInfo:null,
    userDTO:null,
    permissionGroups:[],
    rolesFetched:false,
    viewBusinessDetails:false,
    viewTaxDetails:false,
    viewProfileDetails:false,
    confirmationLoader:false,
    isBusinessEdit:false,
    saveSegmentGLoader:false,
    isBctDisabled:false,
    openEditDatasource:false,
    confirmationPopup:false,
    popType:"self",
    agencies:[],
    services:[],
    selectedSrvc:[],
    mediums:[],
    datasources:[],
    servicePackages:[],
    package:[],
    serv:[],
    segmentGroups:[],
    assignedPkg:[],
    allSegmentGroups:[],
    datasourcesAssigned:[],
    displayAgency:"",
    // id: null,
    dsToEdit:null,
    paidType:null,
    isPTypeEdit:false,
    //isDebitEdit:false,
    confSgPopup:false,
    bptError:'',
    temp:'',
    srvice:{
        pricePrUnt:{
            value:"",
            error:''
        },
        perUnitMinPrice:{
            value:""
        },
        costOrShare:{
            value:""
        },
        sharingType:{
            value:""
        },
        serviceCode:{
            value:""
        },
        error:{
            value: null
        }
    },
    formControls:{
        mediumId:{
            value:"",
            error:""
        },
        ammId:{
            value:"",
            error:""
        },
        sgData:{
            value:"",
            error:""
        },
        billingOn:{
            value:"",
            error:""
        },
        bct:{
            value:"",
            error:""
        },
        pricePrCrdt:{
            value:"",
            error:""
        },
        mName:{
            value:"",
        },
        dName:{
            value:"",
        },
        cos:{
            value:"",
            error:""
        },
        sType:{
            value:"",
            error:""
        },
        debit:{
            value:'',
            error:''
        },
        mp:{
            value:'',
            error:''
        }
    }
}


export default class ClientDetails extends Component{
    
    constructor(props){
        super(props);
        this.state = initialState;
        this.asnSer = this.asnSer.bind(this);
        this.formatPkg = this.formatPkg.bind(this);
        this.serviceHandler = this.serviceHandler.bind(this);
        this.fetchAllServices = this.fetchAllServices.bind(this);
        this.serviceChangeHandler = this.serviceChangeHandler.bind(this);
    }

    componentDidMount(){
        this.changeTab(0);
    }
  
    changeTab(num){

        this.setState({
            active: num
        },()=>{
            switch(num){
                case 0:
                    this.fetchProfileData();
                    break;
                case 1:
                    this.fetchAllAgency();
                    break;
                case 2:
                    this.fetchSegmentSectionData();
                    break;
                case 3:
                    this.fetchDatasourceData();
                    break;
                case 4:
                    this.fetchAllServices();
                    break;
                case 6:
                    this.getAllServicePackages(this.props.info.uid);
                    this.getAllServicePackages();
                    break;
                default:
                    console.log("unhandled tab click");            
            }
        })
        this.clearFormControls();
    }

    verifyServicesClient(){
        let isError = false;
        let value= null;
        if(this.state.srvice && this.state.selectedSrvc && (this.state.selectedSrvc.perUnitMinPrice >  this.state.srvice.pricePrUnt.value)){
            value=`Price per unit must be greater than or equal to ${this.state.selectedSrvc.perUnitMinPrice}`;
            ToastsStore.error(value);
            isError = true;
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
            return;
        }
        else{
            isError = false;
            value= null;
            ToastsStore.success(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })

        }
        if(!isError || isError === false){
            this.servicesAssign();
        }
    }

    verifyServices(){
        let isError = false;
        let value= null;
         
        if(!this.state.srvice.serviceCode){
            isError = true;
            value="Please Select Services.!!!";
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
            return;
        }
        else{
            isError = false;
            value= null;
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
        }
        if(!this.state.srvice.perUnitMinPrice.value || !this.state.srvice.costOrShare.value){
            isError = true;
            value=`All Fields are mandatory.!!!`;
            ToastsStore.error(`All Fields are mandatory.!!!`);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
            return;
        }
        else{
            isError = false;
            value= null;
            ToastsStore.success(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
        }
        if(this.state.srvice.perUnitMinPrice && this.state.srvice.pricePrUnt && (this.state.srvice.perUnitMinPrice.value >  this.state.srvice.pricePrUnt.value)){
            value="Price per unit must be greater than Client Per unit min price";
            ToastsStore.error(value);
            isError = true;
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })

            return;
        }      
        else{

            isError = false;
            value= null;
            ToastsStore.success(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })

        }

    if(this.state.srvice.sharingType.value === "C2B"){

        if(this.state.srvice.costOrShare && this.state.selectedSrvc && (this.state.srvice.costOrShare.value <  this.state.selectedSrvc.perUnitMinPrice)){

            isError = true;
            value=`Agency cost or share must be greater than ${this.state.selectedSrvc && this.state.selectedSrvc.perUnitMinPrice}`;
            ToastsStore.error(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })

            return;
        }
        else{

            isError = false;
            value=null;
            ToastsStore.success(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })

        }
    }
    else if(this.state.srvice.sharingType.value ==="PER"){
        let minPrice = this.state.selectedSrvc.perUnitMinPrice*(1+(this.state.srvice.costOrShare.value/100));
        if(this.state.srvice.costOrShare && (this.state.srvice.costOrShare.value < minPrice)){
            isError = true;
            value=`Agency cost or share must be greater than ${minPrice}`;
            ToastsStore.error(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
            return;
        }
        else{
            isError = false;
            value=null;
            ToastsStore.success(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
        }
    }

        if(this.state.srvice.perUnitMinPrice && this.state.srvice.costOrShare && (this.state.srvice.perUnitMinPrice.value <  this.state.srvice.costOrShare.value)){
            isError = true;
            value=`Clients per unit minimum Price must be greater than Agency cost or share i.e. ${this.state.srvice.costOrShare && this.state.srvice.costOrShare.value}`;
            ToastsStore.error(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
            return;
        }
        else{
            isError = false;
            value=null;
            ToastsStore.success(value);
            this.setState({
                srvice:{
                    ...this.state.srvice,
                    error:{
                        ...this.state.srvice.error,
                        value
                    }
                }
            })
        }

        if(!isError || isError === false){
            this.servicesAssign();
        }
    }

    servicesAssign(){
      
        let body={
            "bUid": null,
            "costOrShare": this.state.srvice.costOrShare.value ? this.state.srvice.costOrShare.value : null,
            "perUnitMinPrice": this.state.srvice.perUnitMinPrice.value ? this.state.srvice.perUnitMinPrice.value: null,
            "perUnitPrice": this.state.srvice.pricePrUnt.value ? this.state.srvice.pricePrUnt.value : null,
            "serviceCode": this.state.srvice.serviceCode.value ? this.state.srvice.serviceCode.value: null,
            "sharingType": this.state.srvice.sharingType.value ? this.state.srvice.sharingType.value : null,
            "toBusinessUid": this.props.info.uid
        }
        assignService(body)
        .then( r => r.json())
        .then( data =>{
            if(data.success){
                this.changeTab(0);
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e =>{
            console.log("Something Went Wrong. Please Assign later.!!!");
        })
    }
    
    fetchAllServices(bsnessUid){
        let body={}; 
        if(bsnessUid){
            body.businessUid = bsnessUid;
        } 
        else{
            body={};
        }  
        getAllServices(body)
        .then(r => r.json())
        .then(data => {
            if(data.success){
                if(bsnessUid){
                    this.setState({
                        serv: data.services
                    })  
                }
                else{
                    this.setState({
                        services:data.services
                    })
                }  
            }
            else{
                ToastsStore.error(data.message);
            } 
        })
        .catch(e =>{
            console.log(e);
            ToastsStore.error("Something went wrong. Please try again later.!!!");
        })
    }

    serviceHandler(event){
        if(!event.target.value){
            let t = this.state.srvice;
            t.pricePrUnt.value = null;
            t.serviceCode.value = null;
            // t.perUnitMinPrice.value = s.perUnitMinPrice;
            // t.costOrShare.value = s.costOrShare;
            t.sharingType.value = null;
            this.setState({
                srvice: t   
            })
            return;
        }
        else{  
        let id = event.target.value;
        const ser = this.state.services;
        let s = ser.filter(service =>{
            return service.code === id;
        })
        
        this.state.srvice.serviceCode.value = id;
        this.setState({
            srvice:ser,
            selectedSrvc: s[0]
        })
        this.asnSer(s[0]);
       }
    }

    asnSer(s){
        let t = this.state.srvice;
        t.pricePrUnt.value = s.perUnitPrice;
        // t.perUnitMinPrice.value = s.perUnitMinPrice;
        // t.costOrShare.value = s.costOrShare;
        t.sharingType.value = s.sharingType;
        this.setState({
            srvice:t
        })
    }

    fetchProfileData(){
        getBusinessUserDetails(this.props.info.uid)
        .then(response => response.json())
          .then(data => {
            //var data = {"success":true,"message":"Success","allowedActions":[],"userDetails":{"title":"Mr","firstName":"Anand","middleName":"Kumar","lastName":"Verma","password":null,"mobile":"+918800263891","email":"sam@l.com","gender":"Male","dob":1582050600000,"uid":"10001000396","walletInfo":{"walletId":3,"amount":-827000}},"allowedPanels":["Dashboard","Mediums","LandingPageManagement","Datasource","Campaigns","Credits","Leads","LeadReportUpload","LeadsUpload","SenderIds","Statements","MissedCallNumbers","MissedCallAssigned","ShortCode","ShortCodeAssigned","Agency","Clients","Segments","SegmentGroups","Roles","Permissions","Quickbook","Profile","SMSTemplate"],"roles":["su_admin"],"type":"BUSINESS"};
            if(data.success){
               this.setState( state =>{
                   return{
                    userInfo: data.userDetails,
                    formControls:{
                        ...state.formControls,debit:{
                            ...state.formControls.debit,value:data.userDetails.walletInfo.maxAllowedDebit,
                        }
                    }
                   } 
               })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          })
          .catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        });

        getClientBusinessDetails(this.props.info.uid)
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":null,"allowedActions":[],"uid":"70005000175","name":"Anand ","address":"112,Xyz","landmark":"India","locality":"Kalkaji","city":"Delhi","state":"Delhi","pincode":"110084","logo":"","website":"anand.com"};
            if (data.success && !!data.uid) {  
                data.state = {value:data.state,label:data.state};
                data.agency = {
                    email: (data.agency && data.agency.email) ? data.agency.email : "",
                    name: (data.agency && data.agency.name) ? data.agency.name : "",
                    uid: (data.agency && data.agency.uid) ? data.agency.uid : ""
                };
                this.setState({
                    businessInfo: data,
                    displayAgency: data.agency.name,
                    paidType: data.paidType
                })  
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
  
    showBusinessDetails(){
        this.setState({
            viewBusinessDetails:true
        })
    }

    showTaxDetails(){
        this.setState({
            viewTaxDetails:true
        })
        getClientBusinessDetails(this.props.info.uid)
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

    fetchAllAgency(){
        let body = {};
        getAgency(body)
        .then(response => response.json())
        .then( data => {
            //let data = { "success": true, "message": null, "allowedActions": [], "groups": [ { "groupId": 1, "name": "testing123", "roles": [] }, { "groupId": 2, "name": "Testing", "roles": [] }, { "groupId": 3, "name": "testing2", "roles": [ { "role": "admin", "subRoles": null, "name": "admin", "panel": "Profile", "parent": true }, { "role": "medium_mgmt", "subRoles": [ { "role": "medium_create", "subRoles": null, "name": "medium_create", "panel": "Mediums", "parent": false }, { "role": "medium_map_datasource", "subRoles": null, "name": "medium_map_datasourc", "panel": "Mediums", "parent": false } ], "name": "medium_mgmt", "panel": "Mediums", "parent": true } ] } ] };
            if(data.success){
                this.setState({
                    agencies: data.clients,
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
        getClientBusinessDetails(this.props.info.uid)
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":null,"allowedActions":[],"uid":"70005000175","name":"Anand ","address":"112,Xyz","landmark":"India","locality":"Kalkaji","city":"Delhi","state":"Delhi","pincode":"110084","logo":"","website":"anand.com"};
            if (data.success && !!data.uid) {  
                data.state = {value:data.state,label:data.state};
                data.agency = {
                    email: (data.agency && data.agency.email) ? data.agency.email : "",
                    name: (data.agency && data.agency.name) ? data.agency.name : "",
                    uid: (data.agency && data.agency.uid) ? data.agency.uid : ""
                };
                this.setState({
                    businessInfo: data,
                    displayAgency: data.agency.name
                })  
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    showProfileDetails(){
        this.setState({
            viewProfileDetails:true,
            popType:'edit-e',
            headerText:'Client Details',
            userDTO: this.formatEmployeeDto(this.state.userInfo)
        },() => { 
            this.fetchPermissionGroups();
        })
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

    fetchSegmentSectionData(){
        let body = {
            start : this.state.start,
            maxResults : 50,
            businessUid: this.props.info.uid
        };
        getAllSegmentGroups(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({
                  segmentGroups : data.segmentGroups
                });
            } else {
                ToastsStore.error(data.message);
            }
        }).catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })

        getMediums({})
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
                this.setState({
                    mediums: data.mediumList, 
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    onMediumChange = event => {
        const value = event.target.value;
        let temp1 = this.state.formControls;
        temp1.mediumId.value = value;
        this.setState({
          formControls: temp1
        },()=>this.fetchDatasourcesByMedium())
    }
  
    fetchDatasourcesByMedium(){
        let body = {
          mediumId: this.state.formControls.mediumId.value
        }
        getAudienceMediumMapping(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
              this.setState({
                 datasources: data.audienceGroups, 
              })
            }
        })
        .catch(error => {
        console.log(error);
        })
    }
      
    assignSegmentGroup(){
        if(!this.state.formControls.sgData.value){
            ToastsStore.error("Please choose Segment Group to be assigned.");
            return;
        }
        let temp = this.state.formControls.sgData.value.split(",");
        temp[0] = (temp[0] === "null") ? null : temp[0];
        temp[1] = (temp[1] === "null") ? null : temp[1];
        let body = {
            "asgmId": temp[0],
            "basgmId": temp[1],
            "businessUid": this.props.info.uid
        }
        this.setState({
          saveSegmentGLoader:true
        })
        assignSegmentGroups(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
                let body = {
                    start : this.state.start,
                    maxResults : 50,
                    businessUid: this.props.info.uid
                };
                ToastsStore.success(data.message);
                getAllSegmentGroups(body)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({
                          segmentGroups : data.segmentGroups
                        });
                    } else {
                        ToastsStore.error(data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                })
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                saveSegmentGLoader:false
            })
        })
        .catch(error => {
            this.setState({
                saveSegmentGLoader:false
            })
            console.log(error);
        })
    }

    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(state =>{
            return{
                formControls: {
                    ...state.formControls,
                    [name]: {
                    ...state.formControls[name],
                    value
                    }
                }
            }        
        });
    }

    closePopup(){
        this.setState({
            viewBusinessDetails: false,
            viewTaxDetails:false,
            isBusinessEdit: false,
            viewProfileDetails:false
        })
    }

    changeViewToEditBusiness(){
        this.setState({
             isBusinessEdit: true
        });
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
                ToastsStore.error("Please Save GST Number First");
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
                        this.fetchProfileData();
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

    saveAgencyChange(){
        let body = {
            "agencyBusinessUid": this.state.businessInfo.agency.uid,
            "businessUid": this.props.info.uid
        }
        this.setState({
            confirmationLoader: true,
        })
        updateAgency(body)
        .then(response => response.json())
        .then(data => {
            this.setState({
                confirmationLoader: false,
            })
            if (data.success) {
                ToastsStore.success("Details Saved Successfully !");
                this.setState({
                    confirmationLoader: false,
                    displayAgency: this.state.businessInfo.agency.name
                })
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

    fetchDatasourceData(){
        let body1 = {
            "start" : 0,
            "maxResults" : 50,
            "businessUid" : this.props.info.uid
        }
        getDatasource(body1)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({
                    datasourcesAssigned: data.audienceGroupDetails,
                })
            }
        })
        .catch(error => {
            console.log(error);
        })

        getMediums({})
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
                this.setState({
                    mediums: data.mediumList, 
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
    }   

    assignDatasource(){
        let t = this.state.formControls;
        if(!this.state.formControls.ammId.value || !this.state.formControls.pricePrCrdt.value || !this.state.formControls.billingOn.value || !this.state.formControls.bct.value){
            t.pricePrCrdt.error = "All fields are mandatory.";
            this.setState({
                formControls: t
            });
            return;
        }else{
            t.pricePrCrdt.error = "";
            this.setState({
                formControls: t
            }); 
        }
        if(!this.validate()){
            return;
        }
        let body = {
            "businessUid" : this.props.info.uid,
            "audienceMediumMappingId" : this.state.formControls.ammId.value,
            "price" : this.state.formControls.pricePrCrdt.value,
            "billingOn": this.state.formControls.billingOn.value,
            "billingCreditType": this.state.formControls.bct.value,
            "minCreditToBuy" : null,
            "minCampaign" : null,
            "costOrShare" : this.state.formControls.cos.value,
            "sharingType" : this.state.formControls.sType.value,
            "minPrice": this.state.formControls.mp.value,
            "businessAudienceMappingId" : this.state.temp
        }
        this.setState({
            saveSegmentGLoader: true
        })
        addUpdateClient(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                ToastsStore.success(data.message,4000);
                this.clearFormControls();
                let body1 = {
                    "start" : 0,
                    "maxResults" : 50,
                    "businessUid" : this.props.info.uid
                }
                getDatasource(body1)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({
                            datasourcesAssigned: data.audienceGroupDetails,
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                saveSegmentGLoader: false
            })
        })
        .catch(error => {
            this.setState({
                saveSegmentGLoader: false
            })
            ToastsStore.error("Something went wrong, Please try again later !");
            console.log(error);
        })
    }

    validate(){
        let isValid = true;
        let data = this.state.formControls;
        let temp;

        if(this.props.page === 'Clients'){
            if(data.pricePrCrdt.value < this.state.minPrice){
                data.pricePrCrdt.error = "Price cannot be less than Minimum Price " + this.state.minPrice +".";
                this.setState({
                  formControls: data
                })
                return false;
              }
        }else{
            if(!data.pricePrCrdt.value || !data.mp.value || !data.cos.value){
                data.cos.error = "Please Provide Pricing Details.";
                this.setState({
                  formControls: data
                })
                return false;
              }
              if(!data.sType.value){
                data.cos.error = "Please Provide Sharing Type.";
                this.setState({
                  formControls: data
                })
                return false;
              }
              if(data.pricePrCrdt.value < data.mp.value){
                data.cos.error = "Price cannot be less than Minimum Price.";
                this.setState({
                  formControls: data
                })
                return false;
              }
              if(data.sType.value === 'C2B'){
                temp = data.cos.value;
                if(data.mp.value < temp){
                    data.cos.error = "Minimum Price cannot be less than Cost Or Share.";
                    this.setState({
                      formControls: data
                    })
                  return false;
                }
              }else{
                if(data.cos.value < 0 || data.cos.value > 100){
                    data.cos.error = "Invalid Cost Or Share Value.";
                    this.setState({
                      formControls: data
                    })
                    return false;
                }
                temp = (data.mp.value - (data.mp.value*data.cos.value*0.01));
                if(data.mp.value < temp ){
                    data.cos.error = "Minimum Price cannot be less than Cost Or Share.";
                    this.setState({
                      formControls: data
                    })
                    return false;
                }
              }
              if(temp < this.state.minPrice){
                data.cos.error = "Cost or Share cannot be less than " + this.state.minPrice + ".";
                this.setState({
                  formControls: data
                })
                return false;
              }
        }
        data.cos.error = "";
        data.pricePrCrdt.error = "";
        this.setState({
          formControls: data
        })
        return isValid;
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
        // console.log(temp);
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
        // console.log(temp);
    }

    tChangeHandler(event){
        let name = event.target.name;
        let val = event.target.value;
        let temp = this.state.taxInfo;
        temp[name] = val;
        this.setState({
            taxInfo: temp
        })
       // console.log(temp);
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

    dsHandler = (event) => {
        let name = event.target.name;
        let val = event.target.value;
        if(name === "ammIdd"){
            let agData = this.getMatchingAgData(val);
            let temp1 = this.state.formControls;
            temp1.ammId.value = val;
            temp1.billingOn.value = agData.billingOn;
            temp1.bct.value = agData.billingCreditType;
            temp1.pricePrCrdt.value = agData.price;
            temp1.cos.value = agData.costOrShare;
            temp1.sType.value = agData.sharingType;
            temp1.mp.value = agData.minPrice;
            this.setState({
                formControls: temp1,
                isBctDisabled: (agData.billingCreditType === "premium"),
                minPrice: agData.minPrice,
                temp: agData.bamId
            })
        }else{
            let temp2 = this.state.formControls;
            temp2.ammId.value = val;
            this.setState({
                formControls: temp2
            },()=>{
                let body1 = {
                    start : this.state.start,
                    maxResults : 50,
                    ammId: val
                };
                getAllSegmentGroups(body1)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({
                          allSegmentGroups : data.segmentGroups
                        });
                    } else {
                        ToastsStore.error(data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                })
            })
        }
    }

    getMatchingAgData(val){
        let temp = [{}];
        val = parseInt(val);
        temp = this.state.datasources.filter(e => {
            return e.ammId === val;
        });
        return temp[0];
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

    uInfoChangeHandler = (event)=>{
            let name = event.target.name;
            let val = event.target.value;
            let temp = this.state.businessInfo;
            temp[name].uid = val;
            this.setState({
                businessInfo: temp
            })
    }

    tableAction(index,action){
        let data = this.state.datasourcesAssigned[index];
        if(action === "database-edit"){
            this.fetchParentData(data);
        }else{
            this.setState({
                confirmationPopup:true,
                dsToEdit:data
            })
        }
    }

    fetchParentData(data){
        this.populateFormControls(data);
        let body = {
            "ammId": data.ammId,
            "bamId": data.bamId,
        }
        getParentDetails(body)
        .then(response => response.json())
        .then(data => {
            if(data.success && data.ammMinDTO){
                this.setState({
                    minPrice: data.ammMinDTO.minPrice,
                    isBctDisabled: (data.ammMinDTO.billingCreditType === "premium")
                })
            }
        })
        .catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please try again later !");
        })
    }

    closeEditDs(){
        this.setState({
            openEditDatasource:false
        })
        this.clearFormControls();
    }

    serviceChangeHandler(event){
        const value= event.target.value;
        const name = event.target.name;
            
        this.setState(state=>{
            return{
                srvice:{
                   ...state.srvice,
                   [name]:{
                       ...state.srvice.name,value
                   }
                }
            }
        })
      
    }

    editAssignedDataSc(){
        
        if(!this.validate()){
            return;
        }
        
        let body = {
            "businessUid" : this.props.info.uid,
            "audienceMediumMappingId" : this.state.formControls.ammId.value,
            "price" : this.state.formControls.pricePrCrdt.value,
            "billingOn": this.state.formControls.billingOn.value,
            "billingCreditType": this.state.formControls.bct.value,
            "minCreditToBuy" : null,
            "minCampaign" : null,
            "businessAudienceMappingId": this.state.dsToEdit.bamId,
            "costOrShare" : this.state.formControls.cos.value,
            "sharingType" : this.state.formControls.sType.value,
            "minPrice": this.state.formControls.mp.value
        }
        addUpdateClient(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                ToastsStore.success(data.message);
                let body1 = {
                    "start" : 0,
                    "maxResults" : 50,
                    "businessUid" : this.props.info.uid
                }
                getDatasource(body1)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({
                            datasourcesAssigned: data.audienceGroupDetails,
                            openEditDatasource:false
                        },()=>{
                            this.clearFormControls();
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })

            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                saveSegmentGLoader: false
            })
        })
        .catch(error => {
            this.setState({
                saveSegmentGLoader: false
            })
            ToastsStore.error("Something went wrong, Please try again later !");
            console.log(error);
        })
    }

    unAssignDs(){
        let data = this.state.dsToEdit;
        let body = {
            "businessUid" : this.props.info.uid,
            "audienceMediumMappingId" : data.ammId,
            "price" : data.pricePerCredit,
            "billingOn": data.billingOn,
            "billingCreditType": data.billingCreditType,
            "minCreditToBuy" : null,
            "minCampaign" : null,
            "businessAudienceMappingId": data.bamId,
            "remove":true
        }
        addUpdateClient(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                ToastsStore.success(data.message);
                let body1 = {
                    "start" : 0,
                    "maxResults" : 50,
                    "businessUid" : this.props.info.uid
                }
                getDatasource(body1)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({
                            datasourcesAssigned: data.audienceGroupDetails,
                            confirmationPopup:false
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })

            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                saveSegmentGLoader: false
            })
        })
        .catch(error => {
            this.setState({
                saveSegmentGLoader: false
            })
            ToastsStore.error("Something went wrong, Please try again later !");
            console.log(error);
        })
    }

    unAssignSg(){
        let data = this.state.dsToEdit;
        let body = {
            "asgmId": data.asgmId,
            "basgmId": data.basgmId,
            "businessUid": this.props.info.uid,
            "remove": true
        }
        assignSegmentGroups(body)
        .then(response => response.json())
        .then(data => {
            if (data.success) { 
                let body = {
                    start : this.state.start,
                    maxResults : 50,
                    businessUid: this.props.info.uid
                };
                ToastsStore.success(data.message);
                getAllSegmentGroups(body)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({
                          segmentGroups : data.segmentGroups,
                          confSgPopup: false
                        });
                    } else {
                        ToastsStore.error(data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                })
            }else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            this.setState({
                saveSegmentGLoader:false
            })
            console.log(error);
        })
    }

    populateFormControls(data){
        let temp = this.state.formControls;
        temp.mediumId.value = data.mediumId;
        temp.ammId.value = data.ammId;
        temp.billingOn.value = data.billingOn;
        temp.bct.value = data.billingCreditType;
        temp.pricePrCrdt.value = data.pricePerCredit;
        temp.pricePrCrdt.error = "";
        temp.mName.value = data.mediumName;
        temp.dName.value = data.agName;
        temp.cos.value = data.costOrShare;
        temp.sType.value = data.sharingType;
        temp.mp.value = data.minPrice;
        this.setState({
            openEditDatasource:true,
            formControls:temp,
            isBctDisabled: (data.billingCreditType === "premium"),
            dsToEdit:data
        })
    }

    closeConfirmation(){
        this.setState({
            confirmationPopup:false,
            confSgPopup: false
        })
    }

    // clearDebitType(){
    //     this.setState( state =>{
    //         return{
    //             formControls:{
    //                 ...state.formControls,debit:{
    //                     ...state.formControls.debit,value:""
    //                 }
    //             }
    //         }   
    //     })
    //     console.log(this.state.formControls.debit);
    // }

    editPaidType(){
        this.setState({
            isPTypeEdit: true
        })
    }

    getAllServicePackages(bsnessUid){
        let body={}
        if(bsnessUid){
            body.businessUid = bsnessUid;
        }
        getAllServicePackages(body)
        .then( response => response.json())
        .then( data=>{
            if(data.success){
                if(bsnessUid){
                    this.setState({
                        assignedPkg:data.servicePackages
                    })
                }else{
                    this.setState({
                        servicePackages: data.servicePackages
                    })
                }
                
                // ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            console.log(error);
            ToastsStore.error("Something Went Wrong, Please Try Again Later.!!!");
        })     
    }

    editBPaidType(){
        if(!this.state.businessInfo.paidType){
            this.setState({
                bptError: "Please choose Paid Type"
            })
            return;
        }else{
            this.setState({
                bptError: ""
            })
        }
        if(this.state.formControls.debit.value > 1000000){
            this.setState({
                formControls:{
                    ...this.state.formControls,debit:{
                        ...this.state.formControls.debit,error: "Value should be less than Rs.1000000"
                    }
                }
            })
            return;
        }else{
            this.setState({
                formControls:{
                    ...this.state.formControls,debit:{
                        ...this.state.formControls.debit,error:""
                    }
                }
            })
        }
        let body = {
            "businessUid" : this.props.info.uid,
            "paidType" : this.state.businessInfo.paidType,
            maxAllowedDebit: this.state.formControls.debit.value     
        }
        this.setState({
            saveSegmentGLoader: true
        })
        updateBPaidType(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                getClientBusinessDetails(this.props.info.uid)
                .then(response => response.json())
                .then(data => {
                    //let data = {"success":true,"message":null,"allowedActions":[],"uid":"70005000175","name":"Anand ","address":"112,Xyz","landmark":"India","locality":"Kalkaji","city":"Delhi","state":"Delhi","pincode":"110084","logo":"","website":"anand.com"};
                    if (data.success && !!data.uid) {  
                        data.state = {value:data.state,label:data.state};
                        data.agency = {
                            email: (data.agency && data.agency.email) ? data.agency.email : "",
                            name: (data.agency && data.agency.name) ? data.agency.name : "",
                            uid: (data.agency && data.agency.uid) ? data.agency.uid : ""
                        };
                        this.setState({
                            businessInfo: data,
                            paidType: data.paidType,
                            isPTypeEdit:false,
                           // isDebitEdit:false
                        })
                        /********************************************** */
                        if(this.state.businessInfo.paidType === "postpaid"){
                            this.fetchProfileData();
                        }  
                    } else {
                        ToastsStore.error(data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    ToastsStore.error("Something went wrong, Please Try Again Later ");
                })
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                saveSegmentGLoader: false
            })
        })
        .catch(error => {
            this.setState({
                saveSegmentGLoader: false
            })
            ToastsStore.error("Something went wrong, Please try again later !");
            console.log(error);
        })
    }

    clearFormControls(){
        let temp = this.state.formControls;
        temp.mediumId.value = "";
        temp.ammId.value = "";
        temp.sgData.value = "";
        temp.billingOn.value = "";
        temp.bct.value = "";
        temp.pricePrCrdt.value = "";
        temp.cos.value = "";
        temp.sType.value = "";
        temp.mp.value = "";
        temp.cos.error = "";
        temp.pricePrCrdt.error = "";
        this.setState({
            formControls: temp
        })
    }

    tableActionSg(index,action){
        let data = this.state.segmentGroups[index];
        this.setState({
            confSgPopup:true,
            dsToEdit:data
        })
    }

    /*######Edit Pckg#########*/

    // assignPackage(){
    //     this.setState({opnAssign: true});
    //     this.fetchPackage(this.state.pkgId);
    // }

    servicePackageHandler(event){
        this.setState({
            opnAssign: true
        },this.fetchPackage(event.target.value)) 
        
    }

    fetchPackage(code){
    
        let body={
            servicePackageCode: code
        }
        getPackage(body)
        .then( response => response.json())
        .then( data=>{
            if(data.success){ 
                this.setState({
                    package:this.formatPkg(data.servicePackageDTO),
                    //openEditDetails: true
                })                            
            }  
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            console.log(error);
            ToastsStore.error("Something Went Wrong.!!!");
        })
    }

    formatPkg(data){
      
        if(data){
            data.services.forEach(e=>{
                e.error= null;
            })
            return data;
        }

    }

    packgChange(event){
        // let temp = this.state.selectedPackage;
        let temp = this.state.package;
         const val = event.target.value;
         const n = event.target.name;
         temp[n]=val;
         this.setState({
             package: temp
             //selectedPackage: temp
         })
        
         //console.log(this.state.selectedPackage);
    }

    checkForMinValue(){
        let isValid = true;
        let temp = this.state.package;
        temp.services.forEach(e => {
            if(isValid === false){        
                return;
            }
            else{
                if(e.val < e.minCredit){
                    e.isMin = true;
                    e.error = `Entered Quantity/Price < ${e.minCredit+" "}(Min Credit)`;
                    isValid = false;
                    this.setState({
                        package: temp,
                    })
                    return;
                }          
                else if(e.val > e.minCredit){
                    e.isMin = false;
                    e.error = null;
                    isValid = true;
                }
                if(e.pricePerUnit < e.perUnitMinPrice){
                    e.error = `Entered per unit price must be greate than  ${e.perUnitMinPrice+" "}(per unit minimum price)`;         
                    isValid = false;
                    this.setState({
                        package: temp,
                    })
                    return;
                }
                else if(e.pricePerUnit > e.perUnitMinPrice){
                    e.error = null;
                    isValid = true;
                }
            }           
        });
        this.setState({
            package: temp,
        })
        console.log(isValid);
        if(isValid){
            this.verifyPakg();
        }  
    }

    verifyPakg(){
        // let temp = this.state.selectedPackage;
        let temp = this.state.package;
         if(!temp.name){
             alert("Package Name is Mandatory.!!!");
             // ToastsStore.Error("Package Name is Mandatory.!!!");
             return;
         }
         else{
             this.asgnPkg();
         }
     }

    packegService(ser){
        let arr =[];
        ser && ser.forEach((s) =>{
            let obj=
                {
                    "code": s.code,
                    "creditUnitType": s.creditUnitType,
                    "minCredit": s.minCredit,
                    "pricePerUnit": (s.pricePerUnit || s.perUnitPrice),
                    "totalPriceOrUnits": s.val
                }
            arr.push(obj);
        })
        return arr;
    }

    handleChangePkg = (event,index) => {
        
        // let temp = this.state.selectedPackage;
        let temp = this.state.package;
         const val = event.target.value;
         const n = event.target.name;
         temp.services[index].error = null;
         temp.services[index][n] = val;       
         this.setState({
             //selectedPackage: temp
             package: temp
         })

     }

    asgnPkg(){
        let temp = this.state.package;
          const body=
          {
            "businessUid": this.props.info.uid,
            "code": temp.code,
            "desc": temp.desc ? temp.desc : null,
            "discount": temp.discount ? temp.discount : null,
            "discountType": temp.discountType ? temp.discountType : null,
            "name": temp.name,
            "price": temp.price ? temp.price : null,
            "services": this.packegService(this.state.package.services),
          }
          pkgAssign(body)
          .then(r => r.json())
          .then(data =>{
              if(data.success){
                  this.setState({
                    opnAssign: false
                  })
                  ToastsStore.success("This packeage is assigned"); 
              }         
              else{
                  ToastsStore.error(data.message);
              }
          })
          .catch(e =>{
              console.log(e);
              ToastsStore.error("Something Went Wrong. Please try Again Later.!!!")
          })
      }

    render(){
        const style = {
            borderRadius: 0,
            opacity: 0.85,
            padding: '1em',
     }
        return(
            <React.Fragment>
                <div onClick={()=>this.props.back('table')} className="margin-btm--half"><button className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></div>
                <div className="ui pointing secondary menu overflowX-auto">
                    <div className={`${this.state.active === 0 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(0)}>Profile</div>
                    {
                        utils.isSuAdmin && this.props.page === 'Clients' &&
                        <div className={`${this.state.active === 1 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(1)}>Agency</div>
                    }
                    <div className={`${this.state.active === 2 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(2)}>Segment Groups</div>
                    <div className={`${this.state.active === 3 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(3)}>Datasource</div>
                    <div className={`${this.state.active === 4 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(4)}>Services</div>
                    <div className={`${this.state.active === 6 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(6)}>Assign Package</div> 
                </div>
                <div className="ui segment" style={{minHeight:'200px'}}>
                    {
                        this.state.active === 0 && this.state.userInfo &&
                        <React.Fragment>
                            <div className="ui centered cards">
                                <div className="ui card">
                                    <div className="image">
                                        <div className="company-logo">
                                            <i aria-hidden="true" className="user outline huge icon global-loader" style={{color:'#8e8d8d'}}></i>
                                        </div>
                                    </div>
                                    <div className="content">
                                        <div className="header" style={{marginTop:'8px'}}>{this.state.userInfo.title}&nbsp;{this.state.userInfo.firstName}&nbsp;{this.state.userInfo.middleName}&nbsp;{this.state.userInfo.lastName}</div>
                                        <div className="meta">
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
                                        </div>
                                        <div className="description">
                                            <div>
                                                {`Mobile: ${this.state.userInfo.mobile}`}
                                            </div>
                                            <div>
                                                {`Email: ${this.state.userInfo.email}`}
                                            </div>
                                            <div>
                                                <div>Paid Type: {this.state.paidType ? <span style={{textTransform:"capitalize"}}>{this.state.paidType}</span> : "Not Assigned"}
                                                {
                                                    !this.state.isPTypeEdit &&
                                                    <span className="margin-left--half pointer text-intent" onClick={()=>this.editPaidType()}>(Edit)</span>
                                                }
                                                </div>
                                                {
                                                    utils.isSuAdmin && this.state.businessInfo && this.state.businessInfo.paidType === "postpaid" &&
                                        
                                                    <div>Max Allowed Debit:{this.state.formControls.debit.value ? <span style={{textTransform:"capitalize"}}>{this.state.formControls.debit.value}</span> : "0"}
                                                    {
                                                        !this.state.isPTypeEdit &&
                                                        <span className="margin-left--half pointer text-intent" onClick={()=>this.editPaidType()}>(Edit)</span>
                                                    }
                                                    </div>
                                                }
                                               
                                                {
                                                    this.state.isPTypeEdit &&
                                                    <div className="margin-top--half">
                                                        <label className="text--darker">Choose Paid Type</label>
                                                        <select className="form-control" 
                                                            name="paidType"
                                                            value={this.state.businessInfo.paidType} 
                                                            onChange={this.bChangeHandler.bind(this)} >
                                                            <option value="" hidden>--Choose--</option>
                                                            <option value="prepaid">PREPAID</option>
                                                            <option value="postpaid">POSTPAID</option>
                                                        </select>
                                                        {
                                                            this.state.bptError &&
                                                            <div className="text--center form-error">{this.state.bptError}</div>
                                                        }
                                                {
                                                    utils.isSuAdmin && this.state.businessInfo.paidType === "postpaid" &&
                                                    <React.Fragment>
                                                        Max Allowed Debit:&nbsp;
                                                        <Popup
                                                        trigger={<Icon name='info circle' color="blue"/>}
                                                        position='right center'
                                                        style={style}
                                                        inverted
                                                        flowing
                                                        content="Max limit is &#8377;1,000,000" 
                                                        hoverable>
                                                        </Popup>
                                                        <div className="ui labeled input">
                                                            <div className="ui label label">&#8377;</div>
                                                            <input type="number" name="debit" className="form-control" value={this.state.formControls.debit.value} onChange={this.changeHandler} style={{width:'95%', display:'inline'}} />
                                                        </div>
                                                        {
                                                            this.state.formControls.debit.error &&
                                                            <div className="text--center form-error">{this.state.formControls.debit.error}</div>
                                                        }
                                                        
                                                                {/* {
                                                                    !this.state.isDebitEdit &&
                                                                    <span className="margin-left--half pointer text-intent" onClick={()=>this.editDebitType()}>(Continue)</span>
                                                                } */}
                                                                {/* { this.state.isDebitEdit && !this.state.saveSegmentGLoader &&  */}
                                                                    {/* <div className="flex flex-horz-center padding-top--half">
                                                                         <button className="ui button" onClick={this.clearDebitType.bind(this)}>
                                                                            CLEAR
                                                                        </button>                    
                                                                        <button className="ui green button" onClick={()=>this.editBPaidType()}>
                                                                            SAVE
                                                                        </button>
                                                                    </div>  */}
                                                                {/* } */}
                                                              
                                                                { 
                                                                    this.state.saveSegmentGLoader && 
                                                                    <div className="flex flex-horz-center padding-top--half">
                                                                        <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                                                    </div>
                                                                }
                                                                </React.Fragment>
                                                            }
                                                        {
                                                            !this.state.saveSegmentGLoader && 
                                                            <div className="flex flex-horz-center padding-top--half">
                                                                {/* {
                                                                    utils.isSuAdmin && this.state.businessInfo.paidType === "postpaid" &&
                                                                        <button className="ui button" style={{fontSize:"0.9rem"}} onClick={this.clearDebitType.bind(this)}>
                                                                            CLEAR DEBIT
                                                                        </button> 
                                                                } */}
                                                               
                                                                <button className="ui button col-10" style={{fontSize:"0.9rem"}} onClick={()=>this.setState({isPTypeEdit:false})}>
                                                                    BACK
                                                                </button>                    
                                                                <button className="ui green button col-8" style={{fontSize:"0.9rem"}} onClick={()=>this.editBPaidType()}>
                                                                    SAVE
                                                                </button>
                                                            </div>
                                                        }
                                                       
                                                    </div>
                                                }   
                                            </div>
                                        </div>
                                    </div>
                                    <div className="extra content flex">
                                        <div className="ui vertical buttons" style={{margin:'auto'}}>
                                            <button onClick={() => this.showBusinessDetails()} className="ui icon right labeled small button">
                                                <i aria-hidden="true" className="eye small icon"></i>
                                                View Business Details
                                            </button>
                                            <button onClick={() => this.showTaxDetails()} className="ui icon right labeled small button">
                                                <i aria-hidden="true" className="eye small icon"></i>
                                                View Tax Details
                                            </button>
                                            <button onClick={() => this.showProfileDetails()} className="ui icon right labeled small button">
                                                <i aria-hidden="true" className="edit outline small icon"></i>
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { 
                                this.state.viewBusinessDetails &&
                                <PopUp title={'Business Details'} togglePopup={this.closePopup.bind(this)} >
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
                                </PopUp>
                            }
                            { 
                                this.state.viewTaxDetails &&
                                <PopUp title={'Tax/Registration Details'} togglePopup={this.closePopup.bind(this)} >
                                    <TaxDetails
                                        isBusinessEdit={true}
                                        closePopup={this.closePopup.bind(this)}
                                        changeViewToEditBusiness={this.changeViewToEditBusiness.bind(this)}
                                        saveTaxDetails={this.saveTaxDetails.bind(this)}
                                        tChangeHandler={this.tChangeHandler.bind(this)}
                                        confirmationLoader={this.state.confirmationLoader}
                                        taxInfo={this.state.taxInfo}>
                                    </TaxDetails>
                                </PopUp>
                            }
                            { 
                                this.state.viewProfileDetails &&
                                <PopUp title={this.state.headerText} togglePopup={this.closePopup.bind(this)} >
                                    <ProfileDetails
                                        userInfo={this.state.userDTO}
                                        closePopup={this.closePopup.bind(this)}
                                        confirmationLoader={this.state.confirmationLoader}
                                        saveEmployeeDetails={""}
                                        editEmployeeDetails={this.saveProfileDetails.bind(this)}
                                        saveProfileDetails={""}
                                        dobChange={this.dobChange.bind(this)}
                                        popType={this.state.popType}
                                        permissionGroups={this.state.permissionGroups}
                                        handleRolesChange={this.handleRolesChange.bind(this)}
                                        pChangeHandler={this.pChangeHandler.bind(this)}>
                                    </ProfileDetails>
                                </PopUp>
                            }
                        </React.Fragment>
                    }
                    {
                        this.state.active === 1 &&
                        <React.Fragment>
                            <div className="padding-btm--half padding-top--half">
                                <span className="text--bold">Current Agency:&nbsp;</span><span>{this.state.displayAgency}</span>
                            </div>
                            {
                                this.state.businessInfo &&
                                <select className="col-5 form-control margin-btm"
                                    name="agency"
                                    value={this.state.businessInfo.agency.uid} 
                                    onChange={this.uInfoChangeHandler}>                                               
                                            <option value="" hidden>-SELECT-</option>
                                            {
                                                    this.state.agencies.map((item,index)=>{
                                                            return (
                                                            <option key={index} value={item.uid}>{item.name}</option>
                                                            );
                                                    })
                                            }
                                </select>
                            }
                            <button className="ui green button" onClick={()=>this.saveAgencyChange()}>
                                SAVE CHANGES
                            </button>
                        </React.Fragment>
                    }
                    {
                        this.state.active === 2 &&
                        <React.Fragment>
                            <div className="col-20 flex flex-wrap margin-btm--double">
                            <div className="col-3">
                                <div className="label">Medium</div>
                                    <select className="form-control"
                                        name="mediumId"
                                        value={this.state.formControls.mediumId.value} 
                                        onChange={this.onMediumChange}>                                               
                                            <option value="" hidden>-SELECT-</option>
                                            {
                                                    this.state.mediums.map((item,index)=>{
                                                            return (
                                                            <option key={index} value={item.id}>{item.name}</option>
                                                            );
                                                    })
                                            }
                                    </select>
                                </div>
                                <div className="col-4 margin-right--half margin-left">
                                    <div className="label">DataSource</div>
                                    <select className="form-control"
                                        name="ammId"
                                        value={this.state.formControls.ammId.value} 
                                        onChange={this.dsHandler}>                                               
                                            <option value="" hidden>-SELECT-</option>
                                            {
                                                    this.state.datasources.map((item,index)=>{
                                                            return (
                                                            <option key={index} value={item.ammId}>{item.name}</option>
                                                            );
                                                    })
                                            }
                                    </select>
                                </div>
                                <div className="col-8">
                                    <div className="label">Choose Segment Group</div>
                                    <select className="form-control"
                                    name="sgData"
                                    value={this.state.formControls.sgData.value} 
                                    onChange={this.changeHandler}>                                               
                                        <option value="" hidden>-SELECT-</option>
                                        {
                                            this.state.allSegmentGroups.map((item,index)=>{
                                                return (
                                                    <option key={index} value={item.asgmId+","+item.basgmId}>{item.sgName}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </div>
                                {
                                    !this.state.saveSegmentGLoader &&
                                    <div className="margin-left">
                                        <div className="label">&nbsp;</div>
                                        <button className="ui green button margin-left" onClick={()=>this.assignSegmentGroup()}>
                                            Assign
                                        </button>
                                    </div>
                                }
                                {
                                    this.state.saveSegmentGLoader &&
                                    <div className="col-1 margin-left">
                                        <div className="label">&nbsp;</div>
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </div>
                            <SegmentGroupTable 
                                segmentGroups={this.state.segmentGroups}
                                showNoAction={false}
                                tableAction={this.tableActionSg.bind(this)}/>
                            {
                                this.state.confSgPopup &&
                                <PopUp title={''} togglePopup={this.closeConfirmation.bind(this)} >
                                    <ConfirmationModal
                                        confirmationString={"Are you sure, you want to unassign this Segment Group."}
                                        togglePopup={this.closeConfirmation.bind(this)}
                                        submitData={this.unAssignSg.bind(this)}
                                        confirmationLoader={false}
                                        submitCta={"Yes"}
                                    />
                                </PopUp>
                            }    
                        </React.Fragment>
                    }
                    {
                        this.state.active === 3 &&
                        <React.Fragment>
                            {
                                this.props.page === 'Clients' &&
                                <div className="col-20 flex flex-wrap margin-btm--double">
                                    <div className="col-3">
                                        <div className="label">Medium</div>
                                        <select className="form-control"
                                            name="mediumId"
                                            value={this.state.formControls.mediumId.value} 
                                            onChange={this.onMediumChange}>                                               
                                                <option value="" hidden>-SELECT-</option>
                                                {
                                                        this.state.mediums.map((item,index)=>{
                                                                return (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                                );
                                                        })
                                                }
                                        </select>
                                    </div>
                                    <div className="col-4 margin-right--half margin-left">
                                        <div className="label">DataSource</div>
                                        <select className="form-control"
                                            name="ammIdd"
                                            value={this.state.formControls.ammId.value} 
                                            onChange={this.dsHandler}>                                               
                                                <option value="" hidden>-SELECT-</option>
                                                {
                                                        this.state.datasources.map((item,index)=>{
                                                                return (
                                                                <option key={index} value={item.ammId}>{item.name}</option>
                                                                );
                                                        })
                                                }
                                        </select>
                                    </div>
                                    <div className="col-3">
                                        <div className="label">Billing On</div>
                                        <select className="form-control" 
                                                name="billingOn"
                                                value={this.state.formControls.billingOn.value} 
                                                onChange={this.changeHandler}>                                  
                                                <option defaultValue >-choose-</option>
                                                <option key="1" value="SENT">Sent</option>
                                                <option key="2" value="DELIVERED">Delivered</option>
                                        </select>
                                    </div> 
                                    <div className="col-3 margin-left margin-right">
                                        <div className="label">Billing Credit Type</div>
                                        <select className="form-control" 
                                                name="bct"
                                                disabled={this.state.isBctDisabled}
                                                value={this.state.formControls.bct.value} 
                                                onChange={this.changeHandler}>                                  
                                                <option defaultValue >-choose-</option>
                                                <option key="1" value="basic">Basic</option>
                                                <option key="2" value="premium">Premium</option>
                                        </select>
                                    </div>
                                    <div className="col-3">
                                        <div className="label">Price</div>
                                        <input  type="number"
                                                className="form-control"
                                                name="pricePrCrdt"
                                                value={this.state.formControls.pricePrCrdt.value} 
                                                onChange={this.changeHandler} >
                                        </input>
                                        {
                                            this.state.formControls.pricePrCrdt.error &&
                                            <span className="form-error">{this.state.formControls.pricePrCrdt.error}</span>
                                        }
                                    </div>
                                    {
                                        !this.state.saveSegmentGLoader &&
                                        <div>
                                            <div className="label" style={{marginBottom:'3px'}}>&nbsp;</div>
                                            <button className="ui green button margin-left" onClick={()=>this.assignDatasource()}>
                                                Assign
                                            </button>
                                        </div>
                                    }
                                    {
                                        this.state.saveSegmentGLoader &&
                                        <div className="col-1 margin-left">
                                            <div className="label">&nbsp;</div>
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        </div>
                                    }
                                </div>   
                            }
                            {
                                this.props.page === "Agency" &&
                                <div className="col-20 flex flex-wrap margin-btm--double">
                                    <div className="col-18 flex flex-wrap">
                                    <div className="col-20 flex flex-wrap">
                                        <div className="col-4">
                                            <div className="label">Medium</div>
                                            <select className="form-control"
                                                name="mediumId"
                                                value={this.state.formControls.mediumId.value} 
                                                onChange={this.onMediumChange}>                                               
                                                    <option value="" hidden>-SELECT-</option>
                                                    {
                                                            this.state.mediums.map((item,index)=>{
                                                                    return (
                                                                    <option key={index} value={item.id}>{item.name}</option>
                                                                    );
                                                            })
                                                    }
                                            </select>
                                        </div>
                                        <div className="col-5 margin-right--half margin-left">
                                            <div className="label">DataSource</div>
                                            <select className="form-control"
                                                name="ammIdd"
                                                value={this.state.formControls.ammId.value} 
                                                onChange={this.dsHandler}>                                               
                                                    <option value="" hidden>-SELECT-</option>
                                                    {
                                                            this.state.datasources.map((item,index)=>{
                                                                    return (
                                                                    <option key={index} value={item.ammId}>{item.name}</option>
                                                                    );
                                                            })
                                                    }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <div className="label">Billing On</div>
                                            <select className="form-control" 
                                                    name="billingOn"
                                                    value={this.state.formControls.billingOn.value} 
                                                    onChange={this.changeHandler}>                                  
                                                    <option defaultValue >-choose-</option>
                                                    <option key="1" value="SENT">Sent</option>
                                                    <option key="2" value="DELIVERED">Delivered</option>
                                            </select>
                                        </div> 
                                        <div className="col-3 margin-left margin-right">
                                            <div className="label">Billing Credit Type</div>
                                            <select className="form-control" 
                                                    name="bct"
                                                    disabled={this.state.isBctDisabled}
                                                    value={this.state.formControls.bct.value} 
                                                    onChange={this.changeHandler}>                                  
                                                    <option defaultValue >-choose-</option>
                                                    <option key="1" value="basic">Basic</option>
                                                    <option key="2" value="premium">Premium</option>
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <div className="label">Price</div>
                                            <input  type="number"
                                                    className="form-control"
                                                    name="pricePrCrdt"
                                                    value={this.state.formControls.pricePrCrdt.value} 
                                                    onChange={this.changeHandler} >
                                            </input>
                                            {
                                                this.state.formControls.pricePrCrdt.error &&
                                                <span className="form-error">{this.state.formControls.pricePrCrdt.error}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-20 flex flex-wrap margin-top">
                                        <div className="col-3">
                                            <div className="label">Cost Or Share</div>
                                            <input  type="number"
                                                    className="form-control"
                                                    name="cos"
                                                    value={this.state.formControls.cos.value} 
                                                    onChange={this.changeHandler} >
                                            </input>
                                        </div>
                                        <div className="col-5">
                                            <div className="label">Sharing Type</div>
                                            <select className="form-control"
                                                name="sType"
                                                value={this.state.formControls.sType.value} 
                                                onChange={this.changeHandler}>                                               
                                                <option value="" hidden>-SELECT-</option>
                                                <option value="PER">Percentage</option>
                                                <option value="C2B">Cost To Business</option>
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <div className="label">Min Price</div>
                                            <input  type="number"
                                                    className="form-control"
                                                    name="mp"
                                                    value={this.state.formControls.mp.value} 
                                                    onChange={this.changeHandler} >
                                            </input>
                                        </div>
                                    </div>
                                    {
                                        this.state.formControls.cos.error &&
                                        <div className="form-error margin-top text--center col-20">{this.state.formControls.cos.error}</div>
                                    }
                                    </div>
                                    <div className="col-2 flex flex-wrap">
                                        {
                                            !this.state.saveSegmentGLoader &&
                                            <div>
                                                <div className="label" style={{marginBottom:'3px'}}>&nbsp;</div>
                                                <button className="ui green button margin-left" onClick={()=>this.assignDatasource()}>
                                                    Assign
                                                </button>
                                            </div>
                                        }
                                        {
                                            this.state.saveSegmentGLoader &&
                                            <div className="col-1 margin-left">
                                                <div className="label">&nbsp;</div>
                                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            <DatasourceTable 
                                datasources={this.state.datasourcesAssigned}
                                allowedSubActions={['edit-AG','delete']}
                                source={this.props.page}
                                tableAction={this.tableAction.bind(this)}/>

                            { this.state.openEditDatasource &&
                                <PopUp title={'Edit Datasource'} togglePopup={this.closeEditDs.bind(this)} >
                                    <ClientEditDatasource
                                        formControls={this.state.formControls}
                                        source={this.props.page}
                                        closeAction={this.closeEditDs.bind(this)}
                                        changeHandler={this.changeHandler.bind(this)}
                                        saveDataSourceLoader={false}
                                        isBctDisabled={this.state.isBctDisabled}
                                        submitData={this.editAssignedDataSc.bind(this)}
                                    />
                                </PopUp>
                            } 
                            {
                                this.state.confirmationPopup &&
                                <PopUp title={''} togglePopup={this.closeConfirmation.bind(this)} >
                                    <ConfirmationModal
                                        confirmationString={"Are you sure, you want to unassign this Datasource."}
                                        togglePopup={this.closeConfirmation.bind(this)}
                                        submitData={this.unAssignDs.bind(this)}
                                        confirmationLoader={false}
                                        submitCta={"Yes"}
                                    />
                                </PopUp>
                            }           
                        </React.Fragment>
                    }
                    {
                        this.state.active === 4 &&
                        <React.Fragment>
                            {
                                this.props.page === 'Clients' &&
                                
                                <div className="col-20 flex flex-wrap margin-btm--double">
                                   <div className="col-6">
                                        <div className="label">Services</div>
                                        <select className="form-control" onChange={this.serviceHandler}>
                                            <option value="" defaultValue>-SELECT SERVICES-</option>
                                            {
                                                this.state.services && this.state.services.map((item,index) =>{
                                                    return(
                                                        <option key={index} value={item.code}>{item.name}</option>
                                                    )    
                                                })                                                
                                            }
                                        </select>
                                    </div> 
                                
                                <div className="col-6">
                                    <div className="label">Price per Unit</div>
                                    <input  type="number"
                                            className="form-control"
                                            name="pricePrUnt"
                                            value={this.state.srvice.pricePrUnt.value} 
                                            onChange={this.serviceChangeHandler} >
                                    </input>
                                    {
                                        this.state.srvice.pricePrUnt.error &&
                                        <div className="text--center form-error">{this.state.srvice.pricePrUnt.value}</div>
                                    }
                                </div>

                                <div>
                                    { this.state.srvice.serviceCode && this.state.srvice.serviceCode.value &&
                                        <React.Fragment>
                                            <div className="label" style={{marginBottom:'3px'}}>&nbsp;</div>
                                            <button className="ui green button margin-left" 
                                                onClick={this.verifyServicesClient.bind(this)}
                                            >
                                                Assign/Update
                                            </button>
                                        </React.Fragment>
                                    }                                   
                                </div>
                                        <div className="form-error col-20">{this.state.srvice.error.value}</div>
                            </div>
                            }                   
                       
                        {
                            this.props.page === "Agency" &&
                            <div className={utils.isMobile ? "col-20 flex flex-direction--col flex-wrap margin-btm--double" : "col-20 flex flex-wrap margin-btm--double"}>
                                <div className={utils.isMobile ? "col-19":"col-3"}>
                                <div className="label">Services</div>
                                    <select className="form-control" onChange={this.serviceHandler}>
                                        <option value="" defaultValue>-SELECT SERVICES-</option>
                                        {
                                            this.state.services && this.state.services.map((item,index) =>{
                                                return(
                                                    <option key={index} value={item.code}>{item.name}</option>
                                                )    
                                            })                                                
                                        }
                                    </select>
                                        
                                </div>
                                <div className={utils.isMobile ? "col-20":"col-3"}>
                                    <div className="label">Price per Unit</div>
                                    <input  type="number"
                                            className="form-control"
                                            name="pricePrUnt"
                                            value={this.state.srvice && this.state.srvice.pricePrUnt && this.state.srvice.pricePrUnt.value ? this.state.srvice.pricePrUnt.value : null} 
                                            onChange={this.serviceChangeHandler}>
                                    </input>
                                </div>
                                <div className={utils.isMobile ? "col-20":"col-3"}>
                                    <div className="label">Clients Per Unit Min Price</div>
                                    <input  type="number"
                                            className="form-control"
                                            name="perUnitMinPrice"
                                            value={this.state.srvice && this.state.srvice.perUnitMinPrice && this.state.srvice.perUnitMinPrice.value} 
                                            onChange={this.serviceChangeHandler}>
                                    </input>
                                </div>
                                <div className={utils.isMobile ? "col-20":"col-3"}>
                                    <div className="label">Agency Cost Or Share</div>
                                    <input  type="number"
                                            className="form-control"
                                            name="costOrShare"
                                            value={this.state.srvice && this.state.srvice.costOrShare && this.state.srvice.costOrShare.value} 
                                            onChange={this.serviceChangeHandler}>
                                    </input>
                                </div>
                                 
                                <div className={utils.isMobile ? "col-19":"col-3"}>
                                    <div className="label">Sharing Type</div>
                                    <select
                                            className="form-control"
                                            name="sharingType"
                                            value={this.state.srvice && this.state.srvice.sharingType && this.state.srvice.sharingType.value ? this.state.srvice.sharingType.value : null} 
                                            onChange={this.serviceChangeHandler} >
                                                <option value="" hidden>-SELECT-</option>
                                                {/* <option value="PER">Percentage</option> */}
                                                <option value="C2B">Cost To Business</option>
                                    </select>
                                </div>
                               {
                                   this.state.srvice && this.state.srvice.serviceCode && this.state.srvice.serviceCode.value &&
                              
                                        <div>
                                            <div className="label" style={{marginBottom:'3px'}}>&nbsp;</div>
                                            <button className="ui green button margin-left" onClick={()=>this.verifyServices()}>
                                                Assign/Update
                                            </button>
                                        </div>
                                }
                                <div className="form-error col-20">{this.state.srvice && this.state.srvice.error && this.state.srvice.error.value}</div>
                            </div>
                                
                        }

                        <ClientServiceTable 
                            page ={this.props.page}
                            serv={this.state.serv}
                            id={this.props.info.uid}/>
                     </React.Fragment>
                                               
                    }
                    {
                        this.state.active === 6 &&
                        <React.Fragment>
                        {/* {
                            this.props.page === "Agency" && */}
                            <div className="col-20 flex flex-wrap margin-btm--double flex-horz-center">
                                 <div className="label margin-right--half">Packages</div>
                                    <select className="form-control" style={{width:"35%"}} onChange={(event)=>this.servicePackageHandler(event)}>
                                        <option value="" hidden>-SELECT PACKAGE-</option>
                                        {
                                            this.state.servicePackages && this.state.servicePackages.map((item,index) =>{
                                                return(
                                                    <option key={index} value={item.code}>{item.name}</option>
                                                )    
                                            })                                                
                                        }
                                    </select>                                                               
                                </div>                              
                                {
                                    this.state.opnAssign &&
                                    <EditPackage
                                    pkg={this.state.package} 
                                    packgChange = {this.packgChange.bind(this)}
                                    assign = {this.checkForMinValue.bind(this)}
                                    handleChange={this.handleChangePkg.bind(this)}/>
                                }
                                <ViewPkgDetail id={this.props.info.uid}/>
                                {/* <AssignedPkg pkg = {this.state.assignedPkg}/> */}
                        </React.Fragment>
                    }
                    {
                        this.state.active === 5 &&
                        <React.Fragment>
                            {
                                <div className="global-loader col-1">
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                </div>
                            }
                        </React.Fragment>
                    }
                    
                </div>
            </React.Fragment>
        );
    }
}