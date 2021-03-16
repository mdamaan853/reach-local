import React,{Component} from 'react';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CeareNewCampaignProcess from './CreateNewCampaignProcess';
import CreateNewCampaignHeader from './CreateNewCampaignHeader';
import {getMediums} from '../../Services/medium-service';
import {getAudienceMediumMapping} from '../../Services/datasource-service';
import {submitCampaign,getCampaign,getDetailCampaign,editCampaign}from '../../Services/campaign-service';
import {getTemplates} from '../../Services/template-service';
import {getBusinessDetails} from '../../Services/user-service'; 
import { getSenderIds } from '../../Services/senderId-service';
import CircularLoader from '../circular-loader/circular-loader';
import {createShortUrl} from '../../Services/shortUrl-service';
import Select from 'react-select';
import "./Campaign.css"

class CreateNewCampaign extends Component{
      constructor(props){
            super(props);
            this.state = {
                code:"",  
                campaignDetails:null,
                mediums:[],
                datasources:[],
                templates:[],
                senderIds:[],
                start:0, 
                ammId:'',
                bamId:'',
                businessUid:'',
                displayCampaignFilter: false,
                campaignSegmentDetail:[],
                shortUrl:'',
                shortUrlLoader:false,
                submitLoader:false,
                formControls:{
                  medium:{
                    value:""
                  },
                  ammId:{
                    value:""
                  },
                  senderId:{
                    value:""
                  },
                  language:{
                    value:"en"
                  },
                  campaignName:{
                        value:""
                  },
                  targetAudienceCount:{
                        value:""
                  },
                  // language:{
                  //       value:""
                  // },
                  campaignDescription:{
                        value:""
                  },
                  template:{
                        value:""
                  },
                  date:{
                        value:""
                  },
                  time:{
                        value:""
                  },
                  su:{
                        value:"",
                        error:""
                  },
                  ute:{
                        value:false
                  },
                  campaignCode:{
                        value: ""
                  }
                }                
            }           
      }
      componentDidMount(){
            this.fetchMediums();
            this.fetchSenderIds();
            this.fetchBusinessDetails();
            if(this.props.location.pathname === '/edit-campaign'){
                  let temp = localStorage.getItem("code");
                  if(temp){
                      console.log("temp found")
                      this.setState({
                          code : JSON.parse(temp)
                      },()=>this.fetchCampaignDetails());
                  }
            }
      }
      fetchCampaignDetails(){
            const body = {
                  code : this.state.code
            }
            getDetailCampaign(body)
            .then(response => response.json())
            .then(data => {
               //let data = {"success":true,"message":"Success","allowedActions":["view","clone"],"code":"2020_04_10_00_02_36-100005000896","mediumId":1,"ammId":2,"sgId":null,"bamId":null,"mediumName":"SMS","audienceGroupName":null,"campaignName":"test 1","campaignDesc":"Test Desc","shortUrl":"https://pky.es/283bdd","uniqueTrackingEnabled":false,"templateId":1,"scheduleDate":1586457000000,"scheduleTime":"11:00 AM - 13:00 PM","targetCount":100000,"segments":[{"segmentId":52,"asmId":128,"basmId":null,"selected":true,"datacode":"city","values":["Agra","Delhi"],"value":null},{"segmentId":6,"asmId":129,"basmId":null,"selected":true,"datacode":"mobile_bill","values":["Upto Rs. 200","Rs. 201 to 500"],"value":null},{"segmentId":50,"asmId":130,"basmId":null,"selected":false,"datacode":"pincode","values":["110011"],"value":null},{"segmentId":13,"asmId":131,"basmId":null,"selected":true,"datacode":"handset_name","values":["Acer","Asus","Apple"],"value":null},{"segmentId":1,"asmId":132,"basmId":null,"selected":true,"datacode":"ageSlider2","values":[],"value":"20-70"},{"segmentId":16,"asmId":133,"basmId":null,"selected":false,"datacode":"handset_cost","values":[],"value":null},{"segmentId":8,"asmId":134,"basmId":null,"selected":false,"datacode":"data_user","values":["No"],"value":null},{"segmentId":7,"asmId":135,"basmId":null,"selected":true,"datacode":"national_roaming","values":[],"value":null},{"segmentId":10,"asmId":136,"basmId":null,"selected":true,"datacode":"payment_model","values":["Prepaid"],"value":null},{"segmentId":17,"asmId":137,"basmId":null,"selected":false,"datacode":"handsetOS_category","values":[],"value":null},{"segmentId":12,"asmId":138,"basmId":null,"selected":false,"datacode":"handset_type","values":["Feature Phone"],"value":null},{"segmentId":18,"asmId":139,"basmId":null,"selected":false,"datacode":"ageof_device","values":["1-3 Months"],"value":null},{"segmentId":22,"asmId":140,"basmId":null,"selected":false,"datacode":"customer_BusinessCat","values":[],"value":null},{"segmentId":4,"asmId":141,"basmId":null,"selected":false,"datacode":"gender","values":["Male"],"value":null},{"segmentId":2,"asmId":235,"basmId":null,"selected":false,"datacode":"amountRange","values":[],"value":"100-900"},{"segmentId":2,"asmId":236,"basmId":null,"selected":false,"datacode":"amountRange","values":[],"value":"100-900"}],"status":"S"};
                  if (data.success) {
                        this.setState({
                              campaignDetails: data
                        },()=>this.initForm())
                        ToastsStore.success(data.message);
                  }else{
                        ToastsStore.error(data.message);
                  }
            })
            .catch(error => {
                  console.log(error);
                  ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
      }
      initForm(){
            this.fetchMediums(true);
      }
      fetchMediums(isPrefill){
            const body={}
            getMediums(body)
            .then(response => response.json())
            .then(data => {
                  if (data.success) { 
                        this.setState({
                              mediums: data.mediumList, 
                        },()=>{
                              if(isPrefill){
                                    let temp = this.state.formControls;
                                    temp.medium.value = this.state.campaignDetails.mediumId;
                                    this.setState({
                                          formControls: temp
                                    },()=>{
                                          this.fetchDatasourcesByMedium(true);
                                    })
                              }
                        });                              
                  } 
            })
            .catch(error => {
                  console.log(error);
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
      onMediumChange = event => {
            const value = event.target.value;
            let temp1 = this.state.formControls;
            temp1.medium.value = value;  
            this.setState({
                formControls: temp1
            },()=>this.fetchDatasourcesByMedium())
      }
      fetchDatasourcesByMedium(isPrefill){
            let body = {
                  mediumId: this.state.formControls.medium.value                
            }
            getAudienceMediumMapping(body)
            .then(response => response.json())
            .then(data => {
                  if (data.success) { 
                        this.setState({
                              datasources: data.audienceGroups,     
                        },()=>{
                              if(isPrefill){
                                    let temp = this.state.formControls;
                                    temp.ammId.value = this.state.campaignDetails.ammId + "," + this.state.campaignDetails.bamId;
                                    this.setState({
                                          formControls: temp,
                                          ammId: this.state.campaignDetails.ammId,
                                          bamId: this.state.campaignDetails.bamId
                                    },()=>{
                                          this.fetchCampaign(true);
                                    })
                              }
                        });                 
                  }
            })
            .catch(error => {
                  console.log(error);
            })
      }
      onDatasourceChangeHandler = (event) =>{            
            let temp = this.state.formControls;
            temp.ammId.value = event.target.value;
            this.setState({
                  ammId: event.target.value.split(",")[0],
                  bamId: event.target.value.split(",")[1],
                  formControls: temp
            },()=>this.fetchCampaign())                      
      }
      fetchCampaign(isprefill){
          const body={
                ammId: parseInt(this.state.ammId),
                bamId: parseInt(this.state.bamId)
          }
           getCampaign(body)
          .then((response)=> response.json())
          .then((data)=> {
            //let data = {"success":true,"message":null,"allowedActions":[],"segmentDetails":[{"segmentName":"city","title":"City","desc":null,"icon":"fas fa-map-marked","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":128,"basmId":null,"segmentId":52},{"segmentName":"mobile_bill","title":"Mobile Bill Per Month (ARPU)","desc":null,"icon":"fa fa-mobile","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Upto Rs. 200"},{"id":3,"value":"Rs. 201 to 500"},{"id":4,"value":"Rs. 501 to 1000"},{"id":5,"value":"Rs. 1001+"}]},"segmentType":"MUL","asmId":129,"basmId":null,"segmentId":6},{"segmentName":"pincode","title":"Pincode","desc":null,"icon":"fas fa-thumbtack","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":130,"basmId":null,"segmentId":50},{"segmentName":"handset_name","title":"Handset Name","desc":null,"icon":"fa fa-font","price":0.05,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Acer"},{"id":2,"value":"Apple"},{"id":3,"value":"Asus"},{"id":4,"value":"Blackberry"},{"id":5,"value":"Celkon"},{"id":6,"value":"Gionee"},{"id":7,"value":"Google"},{"id":8,"value":"HTC"},{"id":9,"value":"Huawei"},{"id":10,"value":"Intex"},{"id":11,"value":"Jolla"},{"id":12,"value":"Karbonn"},{"id":13,"value":"LAVA"},{"id":14,"value":"LeEco"},{"id":15,"value":"Lenovo"},{"id":16,"value":"LG"},{"id":17,"value":"Meizu"},{"id":18,"value":"Micromax"},{"id":19,"value":"Motorola"},{"id":20,"value":"Nokia"},{"id":21,"value":"OnePlus"},{"id":22,"value":"Oppo"},{"id":23,"value":"Panasonic"},{"id":24,"value":"Philips"},{"id":25,"value":"Sagem"},{"id":26,"value":"Samsung"},{"id":27,"value":"Sony"},{"id":28,"value":"Sony Ericson"},{"id":29,"value":"Spice"},{"id":30,"value":"Vertu"},{"id":31,"value":"Vivo"},{"id":32,"value":"Vodofone"},{"id":33,"value":"Xiaomi"},{"id":34,"value":"Xolo"},{"id":35,"value":"ZTE"}]},"segmentType":"MUL","asmId":131,"basmId":null,"segmentId":13},{"segmentName":"ageSlider2","title":"Age","desc":"","icon":"","price":0.0,"subscriptionType":"basic","values":{"minValue":15,"maxValue":75,"segmentValuesList":null},"segmentType":"RNG","asmId":132,"basmId":null,"segmentId":1},{"segmentName":"handset_cost","title":"Handset Cost","desc":null,"icon":"fas fa-hand-holding-usd","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Less than INR 1500"},{"id":2,"value":"INR 1500 - 3000"},{"id":3,"value":"INR 3001 - 5000"},{"id":4,"value":"INR 5K - 10K"},{"id":5,"value":"INR 10K - 15K"},{"id":6,"value":"INR 15K - 20K"},{"id":7,"value":"INR 20K - 30K"},{"id":8,"value":"INR 30K - 40K"},{"id":9,"value":"INR 40K+"}]},"segmentType":"MUL","asmId":133,"basmId":null,"segmentId":16},{"segmentName":"data_user","title":"Data User","desc":null,"icon":"fa fa-user-lock","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":134,"basmId":null,"segmentId":8},{"segmentName":"national_roaming","title":"National Roaming","desc":null,"icon":"fa fa-broadcast-tower","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":135,"basmId":null,"segmentId":7},{"segmentName":"payment_model","title":"Payment Model","desc":null,"icon":"fa fa-money-bill-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Prepaid"},{"id":3,"value":"Postpaid"}]},"segmentType":"RDO","asmId":136,"basmId":null,"segmentId":10},{"segmentName":"handsetOS_category","title":"Handset OS Category","desc":null,"icon":"fab fa-opera","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Android"},{"id":2,"value":"iOS"},{"id":3,"value":"Windows"}]},"segmentType":"MUL","asmId":137,"basmId":null,"segmentId":17},{"segmentName":"handset_type","title":"Handset Type","desc":null,"icon":"fa fa-mobile-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Feature Phone"},{"id":3,"value":"Smart Phone"}]},"segmentType":"RDO","asmId":138,"basmId":null,"segmentId":12},{"segmentName":"ageof_device","title":"Age of Device","desc":null,"icon":"fas fa-clock","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"1-3 Months"},{"id":2,"value":"3-6 Months"},{"id":3,"value":"6-12 Months"},{"id":4,"value":"1 Year +"}]},"segmentType":"MUL","asmId":139,"basmId":null,"segmentId":18},{"segmentName":"customer_BusinessCat","title":"Customer Business Category","desc":null,"icon":"fas fa-user-tie","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"SME"},{"id":2,"value":"Enterprise"}]},"segmentType":"MUL","asmId":140,"basmId":null,"segmentId":22},{"segmentName":"gender","title":"Gender","desc":"gender","icon":"fa fa-user","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Male"},{"id":3,"value":"Female"}]},"segmentType":"RDO","asmId":141,"basmId":null,"segmentId":4},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":235,"basmId":null,"segmentId":2},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":236,"basmId":null,"segmentId":2}]} 
            if(data.success){
                  this.setState({
                        campaignSegmentDetail: this.formatSegmentData(data.segmentDetails),
                        displayCampaignFilter: true 
                  },()=>{
                        if(isprefill){
                              this.populateCampaignData();
                              this.populateSegmentFiltersData();
                        }
                  });
                }
                ToastsStore.success(data.message)
          })
          .catch( error =>{
                  console.log(error);
                  ToastsStore.error("Something went wrong, Please Try Again Later ");
          })         
      }
      formatSegmentData(data){
            data.forEach(item => {
                  item['checked'] = false;    // to select-unselect filter
                  if(item.segmentType === 'TXT' || item.segmentType === 'MUL' || item.segmentType === 'RDO'){      // to store selected values
                        item['value'] = "";
                  }
                  if(item.segmentType === 'RDO'){     // to bind selected radio button value    
                        item.values.segmentValuesList.forEach(ele => {
                              ele['checked'] = false;
                        })
                  }
                  if(item.segmentType === 'MUL'){      // formatting data for multi-select
                        let val = [];
                        if(item.values.segmentValuesList && item.values.segmentValuesList.length>0){
                              item.values.segmentValuesList.map((item) => {
                                  let obj = {
                                      "value": item.value, 
                                      "label": item.value 
                                  }
                                  val.push(obj);
                              })
                        }
                        item.values.segmentValuesList = val;  
                  }
            });
            return data;
      }
      populateCampaignData(){
            let data = this.state.formControls;
            data.senderId.value = this.state.campaignDetails.senderId ? this.state.campaignDetails.senderId : '';
            data.campaignName.value = this.state.campaignDetails.campaignName;
            data.targetAudienceCount.value = this.state.campaignDetails.targetCount;
            data.language.value = this.state.campaignDetails.language ? this.state.campaignDetails.language : "EN";
            data.campaignDescription.value = this.state.campaignDetails.campaignDesc;
            data.template.value = this.state.campaignDetails.templateId;
            data.date.value = new Date(this.state.campaignDetails.scheduleDate);
            data.time.value = this.state.campaignDetails.scheduleTime;
            data.campaignCode.value = this.state.campaignDetails.code;
            this.setState({
                  formControls: data,
                  shortUrl: this.state.campaignDetails.shortUrl 
            })
      }
      populateSegmentFiltersData(){
            this.state.campaignSegmentDetail.forEach((ele) => {
                  ele.checked = this.getCheckedStatus(ele.segmentId);
                  if(ele.segmentType === 'TXT'){
                        ele.value = this.getTextTypeSegmentValue(ele.segmentId);
                  }
                  if(ele.segmentType === 'RDO'){    
                        let val = this.getRadioTypeSegmentValue(ele.segmentId);
                        ele.value = val;
                        ele.values.segmentValuesList.forEach(ele => {
                              if(val === ele.value){
                                    ele.checked = true;
                              }else{
                                    ele.checked = false;
                              }
                        }) 
                  }
                  if(ele.segmentType === 'RNG'){
                        let val = this.getRangeTypeSegmentValue(ele.segmentId).split("-");
                        if(val && val.length > 0){
                              ele.values.minValue =  val[0];
                              ele.values.maxValue =  val[1];
                        }
                  }
                  if(ele.segmentType === 'MUL'){
                        let val = this.getMulTypeSegmentValue(ele.segmentId);
                        let temp = [];
                        if(val && val.length>0){
                              val.forEach((subEle) => {
                                  let obj = {
                                      "value": subEle, 
                                      "label": subEle 
                                  }
                                  temp.push(obj);
                              })
                        }
                        ele.value = temp;  
                  }
            })
      }
      getCheckedStatus(id){
            let segment = this.getMatchingSegment(id);
            return segment.selected;
      }
      getTextTypeSegmentValue(id){
            let segment = this.getMatchingSegment(id);
            return segment.values ? segment.values.join(",") : "";
      }
      getRadioTypeSegmentValue(id){
            let segment = this.getMatchingSegment(id);
            return segment.values ? segment.values[0] : '';
      }
      getRangeTypeSegmentValue(id){
            let segment = this.getMatchingSegment(id);
            return segment.value ? segment.value : "";
      }
      getMulTypeSegmentValue(id){
            let segment = this.getMatchingSegment(id);
            return segment.values ? segment.values : "";
      }
      getMatchingSegment(id){
            let matchingSegment = this.state.campaignDetails.segments.filter( x => x.segmentId === id)
            return matchingSegment[0];
      }
      submitData(isDraft) {
            this.setState({
                  submitLoader: true
            })
            const body = {
                  "ammId": isNaN(parseInt(this.state.ammId)) ? null : parseInt(this.state.ammId),
                  "bamId": isNaN(parseInt(this.state.bamId)) ? null : parseInt(this.state.bamId),
                  "campaignDesc": this.state.formControls.campaignDescription.value,
                  "campaignName": this.state.formControls.campaignName.value,
                  "lang": this.state.formControls.language.value,
                  "mediumId": isNaN(parseInt(this.state.formControls.medium.value)) ? null : parseInt(this.state.formControls.medium.value),
                  "saveAsDraft": isDraft,
                  "scheduleDate": this.state.formControls.date.value,
                  "scheduleTime": this.state.formControls.time.value,
                  "segments": this.parseSegmentsForRequest(),
                  "sgId": null,
                  "shortUrl": this.state.shortUrl,
                  "submit": !isDraft,
                  "targetCount": this.state.formControls.targetAudienceCount.value,
                  "templateId": isNaN(parseInt(this.state.formControls.template.value)) ? null : parseInt(this.state.formControls.template.value),
                  "uniqueTrackingEnabled": this.state.formControls.ute.value,
                  "senderId":this.state.formControls.senderId.value,
            }
            submitCampaign(body)
            .then(response => response.json())
            .then(data => {
                  this.setState({
                        submitLoader: false
                  })
                  if (data.success) {
                        ToastsStore.success(data.message);
                  } else {
                        ToastsStore.error(data.message);
                  }
            }).catch(error => {
                  console.log(error);
                  this.setState({
                        submitLoader: false
                  });
                  ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
      }
      editCampaignData(){
            this.setState({
                  submitLoader: true
            })
            const body = {
                  "ammId": isNaN(parseInt(this.state.ammId)) ? null : parseInt(this.state.ammId),
                  "bamId": isNaN(parseInt(this.state.bamId)) ? null : parseInt(this.state.bamId),
                  "campaignDesc": this.state.formControls.campaignDescription.value,
                  "campaignName": this.state.formControls.campaignName.value,
                  "lang": this.state.formControls.language.value,
                  "mediumId": isNaN(parseInt(this.state.formControls.medium.value)) ? null : parseInt(this.state.formControls.medium.value),
                  "saveAsDraft": false,
                  "scheduleDate": this.state.formControls.date.value,
                  "scheduleTime": this.state.formControls.time.value,
                  "segments": this.parseSegmentsForRequest(),
                  "sgId": null,
                  "shortUrl": this.state.shortUrl,
                  "submit": true,
                  "targetCount": this.state.formControls.targetAudienceCount.value,
                  "templateId": isNaN(parseInt(this.state.formControls.template.value)) ? null : parseInt(this.state.formControls.template.value),
                  "uniqueTrackingEnabled": this.state.formControls.ute.value,
                  "code":this.state.formControls.campaignCode.value,
                  "senderId":this.state.formControls.senderId.value,
            }
            editCampaign(body)
            .then(response => response.json())
            .then(data => {
                  this.setState({
                        submitLoader: false
                  })
                  if (data.success) {
                        ToastsStore.success(data.message);
                  } else {
                        ToastsStore.error(data.message);
                  }
            }).catch(error => {
                  console.log(error);
                  this.setState({
                        submitLoader: false
                  });
                  ToastsStore.error("Something went wrong, Please Try Again Later ");
            })
      }
      parseSegmentsForRequest(){
            let segments = [];
            this.state.campaignSegmentDetail.forEach(item => {
                  let obj = {
                        "asmId": item.asmId,
                        "basmId": item.basmId,
                        "datacode": item.segmentName,
                        "segmentId": item.segmentId,
                        "selected": item.checked,
                        "value": null,
                        "values":[]
                  }
                  if(item.segmentType === 'TXT' || item.segmentType === 'RDO'){
                        if(item.value){
                              obj.values = item.value.split(',');
                        }
                  }else if(item.segmentType === 'RNG'){
                        if(item.values.minValue && item.values.maxValue){
                              obj.value = item.values.minValue + "-" + item.values.maxValue;
                        }
                  }else if(item.segmentType === 'MUL'){
                        if(item.value){
                              item.value.forEach(ele => {
                                    obj.values.push(ele.value)
                              })
                        }
                  }
                  segments.push(obj);
            });
            return segments;
      }
      fetchBusinessDetails(){
            getBusinessDetails()
            .then(response => response.json())
            .then(data => {
               if (data.success && !!data.uid) {
                  this.setState({
                      businessUid: data.uid
                  },()=>this.fetchTemplates()); 
               }
            }).catch(error => {
               console.log(error);
            })
      }
      fetchTemplates() {
            const body = {
              businessUid: this.state.businessUid
            }
            getTemplates(body)
              .then(response => response.json())
              .then(data => {
            //let data = { "success": true, "message": "Success", "allowedActions": [], "smsTemplates": [ { "smsTemplateId": 2, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" }, { "smsTemplateId": 3, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" } ] };
                if (data.success) { 
                  this.setState({
                    templates: data.smsTemplates, 
                  })
                }
              })
              .catch(error => {
                console.log(error);
                this.setState({
                  loadingData: false
                })
              })
      }
      fetchSenderIds() {
         getSenderIds()
        .then(response => response.json())
        .then(data => {
            //let data = {"success":true,"message":"Success","allowedActions":[],"senderIds":[{"id":1,"medium":null,"dataSource":null,"senderCode":"qwq","status":"REQ","created":1586197800000,"businessName":"Anand ","businessOwnerName":null,"businessOwnerEmail":null}]};
            if (data.success) {
            this.setState({
                  senderIds: data.senderIds,
            })
            } 
        })
        .catch(error => {
           console.log(error);
        })
      }
      dateChange = val => {
            let temp1 = this.state.formControls;
            temp1.date.value = val;
            this.setState({
                  formControls: temp1
            })
      }
      filtersChangeHandler(event,index,subindex){
            console.log(event.target.value,index,subindex);
            let val = event.target.value;
            let segments = this.state.campaignSegmentDetail;
            let segment = this.state.campaignSegmentDetail[index];
            if(segment.segmentType === 'TXT'){
                  segments[index].value = val;
            } else if(segment.segmentType === "RNG"){
                  const name = event.target.name;
                  if(name === 'min'){
                        segments[index].values.minValue = val;
                  }else{
                        segments[index].values.maxValue = val;
                  }
            }else if(segment.segmentType === "RDO"){
                  segments[index].value = val;
                  segments[index].values.segmentValuesList[subindex].checked = true;
            }
            this.setState({
                  campaignSegmentDetail: segments
            })
      }
      multiSelectChange(event,index){
            //console.log(event,index);
            let segments = this.state.campaignSegmentDetail;
            segments[index].value = event;
            this.setState({
                  campaignSegmentDetail: segments
            })
      }
      selectFilter(event,index){
            //console.log(event.target.value,index);
            let segments = this.state.campaignSegmentDetail;
            segments[index].checked = event.target.value === 'on' ? !segments[index].checked : false;
            this.setState({
                  campaignSegmentDetail: segments
            })
      }
      createShortUrl(){
            let temp1 = this.state.formControls;
            let body = {
                  longUrl: temp1.su.value
            }
            if(!body.longUrl){
                  temp1.su.error = "Please enter a valid URL e.g. https://www.expletus.com"
                  this.setState({
                        formControls: temp1
                  })
                  return;
            } else if (body.longUrl && body.longUrl.indexOf("https://") < 0) {
                  temp1.su.error = "Please enter a valid URL e.g. https://www.expletus.com"
                  this.setState({
                        formControls: temp1
                  })
                  return;
            }else{
                  temp1.su.error = "";
                  this.setState({
                        formControls: temp1
                  })
            }
            this.setState({
                  shortUrlLoader:true
            })
            createShortUrl(body)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                  this.setState({
                        shortUrl: data.shortUrl,
                  })
                  ToastsStore.success(data.message);
                } else {
                      ToastsStore.error(data.message);
                }
                this.setState({
                   shortUrlLoader:false
                })
            })
            .catch(error => {
                  console.log(error);
                  this.setState({
                        shortUrlLoader:false
                  })
                  ToastsStore.error("Something went wrong, Please try again later !")
            })
      }
      render(){
            return(
                  <section className="wrapper-container">
                        <CreateNewCampaignHeader
                              mediums={this.state.mediums}
                              datasource={this.state.datasources}
                              onMediumChange={this.onMediumChange.bind(this)}
                              formControls={this.state.formControls}
                              ammId={this.state.ammId}
                              onDatasourceChangeHandler={this.onDatasourceChangeHandler.bind(this)}
                              clickHandler={this.clickHandler}
                        />
                        { this.state.displayCampaignFilter &&
                        <div>
                              <CeareNewCampaignProcess
                                    changeHandler={this.changeHandler.bind(this)}
                                    formControls={this.state.formControls}
                                    templates={this.state.templates}                                  
                                    senderIds={this.state.senderIds}
                                    dobChange={this.dateChange.bind(this)}
                                    shortUrl={this.state.shortUrl}
                                    shortUrlLoader={this.state.shortUrlLoader}
                                    createShortUrl={this.createShortUrl.bind(this)}
                              /> 
                              
                              <div className="col-20 pad--half flex flex-direction--row flex-wrap">                
                                    <div className="col-20 margin-btm margin-top section-title">CAMPAIGN FILTERS <span style={{fontSize:'12px',color:'rgba(0,0,0,0.54)'}}>(Select the Campaign Filters based on the type of the audience you want to target.)</span></div>      
                              </div>
                              {
                                   this.state.campaignSegmentDetail && this.state.campaignSegmentDetail.length>0 &&
                                   this.state.campaignSegmentDetail.map((item,index) => {
                                         return (
                                                <div key={index} className="card-custom flex flex-direction--row flex-wrap flex-align--center">
                                                      <div className="col-4 padding-left padding-right text--bold text--center text--darker truncate">
                                                            {item.title}
                                                      </div>
                                                      <div className="col-10">
                                                            {
                                                                  item.segmentType === "RNG" && 
                                                                  <div className="pad--half">
                                                                        <div className="col-12 flex flex-align--center margin-btm--half">
                                                                              <div className="col-12 label text--center">Min value:</div>
                                                                              <input  type="number"
                                                                                    className="form-control"
                                                                                    name="min"
                                                                                    min={item.values.minValue} max={item.values.maxValue}
                                                                                    value={item.values.minValue} 
                                                                                    onChange={event => {this.filtersChangeHandler(event,index)}} >
                                                                              </input>
                                                                        </div>
                                                                        <div className="col-12 flex flex-align--center">
                                                                              <div className="col-12 label text--center">Max value:</div>
                                                                              <input  type="number"
                                                                                    className="form-control"
                                                                                    name="max"
                                                                                    min={item.values.minValue} max={item.values.maxValue}
                                                                                    value={item.values.maxValue} 
                                                                                    onChange={event => {this.filtersChangeHandler(event,index)}} >
                                                                              </input>
                                                                        </div>                                        
                                                                  </div>
                                                            }
                                                            {
                                                                  item.segmentType === "TXT" && 
                                                                  <div className="pad--half">
                                                                        <div className="col-20">
                                                                              <input  type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Type here..."
                                                                                    name={item.title}
                                                                                    value={item.value} 
                                                                                    onChange={event => {this.filtersChangeHandler(event,index)}} >
                                                                              </input>
                                                                        </div>                           
                                                                  </div>
                                                            }
                                                            {
                                                                  item.segmentType === "RDO" && 
                                                                  <div className="pad--half">
                                                                        {
                                                                              item.values && item.values.segmentValuesList && item.values.segmentValuesList.length>0 &&
                                                                              item.values.segmentValuesList.map((subItem,subIndex) => {
                                                                                    return(
                                                                                          <div className="margin-btm--quar" key={subIndex}>
                                                                                                <input type="radio" name={item.title} value={subItem.value}
                                                                                                      checked={subItem.checked} onChange={event => {this.filtersChangeHandler(event,index,subIndex)}}/>
                                                                                                <label>{subItem.value}</label>
                                                                                          </div>
                                                                                    );
                                                                              })
                                                                        }             
                                                                  </div>
                                                            }
                                                            {
                                                                  item.segmentType === "MUL" && 
                                                                  <div className="pad--half" style={{width:'92%'}}>
                                                                        <Select
                                                                              isClearable={true}
                                                                              isMulti
                                                                              isRtl={false}
                                                                              isSearchable={true}
                                                                              name={item.title}
                                                                              value={item.value}
                                                                              onChange={event => {this.multiSelectChange(event,index)}}
                                                                              options={item.values.segmentValuesList}
                                                                        />                  
                                                                  </div>
                                                            }
                                                      </div>   
                                                      <div className="col-3 text--center">
                                                            <div className="margin-btm--quar text--capitalize text--darker" style={{fontSize:'15px'}}>{item.subscriptionType}</div>
                                                            {
                                                                  item.subscriptionType === 'premium' &&
                                                                  <span className="text--darker text--capitalize" style={{fontSize:'15px'}}>{item.price}</span>
                                                            }
                                                      </div>
                                                      <div className="col-1">
                                                            <label>
                                                                  <input type="checkbox"
                                                                        checked={item.checked}
                                                                        style={{height:'18px',width:'18px'}}
                                                                        onChange={event => {this.selectFilter(event,index)}}
                                                                  />
                                                            </label>
                                                      </div>
                                                </div>
                                         );
                                   }) 
                              }
                              {
                                    !this.state.submitLoader &&
                                    <div>
                                          <button onClick={()=>this.submitData(true)} className="btn btn-fill btn-expletus margin-left--half dialog--cta pointer">Save as Draft</button> 
                                          {
                                                this.props.location.pathname === '/edit-campaign' &&
                                                <button onClick={()=>this.editCampaignData()} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Save Changes</button>                               
                                          }
                                          {
                                                (this.props.location.pathname === '/campaign-create' || this.props.location.pathname === '/clone-campaign' ) &&
                                                <button onClick={()=>this.submitData(false)} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Submit Campaign</button>
                                          }
                                    </div>
                              }
                              {
                                    this.state.submitLoader &&
                                    <div className="col-4 margin-btm--double margin-top--double">
                                          <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                              }
                        </div> 
                        }                                              
                        <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />                 
                 </section>          
              );
      }
        
}

export default CreateNewCampaign;

