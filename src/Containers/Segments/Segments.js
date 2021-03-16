import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import SegmentTable from '../../Components/Segments/SegmentTable';
import Popup from '../../Components/Popup/Popup';
import CreateSegment from '../../Components/Segments/CreateSegments';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {fetchRoles} from '../../Services/roles-service';
import { createEditSegment, getSegmentDetail } from '../../Services/segment-service';
import {getSelectSegment} from '../../Services/datasource-service';
import utils from '../../Services/utility-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import Pagination from '../../Components/Pagination/Pagination';
export default class Segments extends Component{
    constructor(props){
        super(props);
        this.state = {       
            segments: [],
            start: 0,
            loader: false,
            hasNext:true,
            openPopup: false,
            submitCta: 'Save',
            actions:["eye"],
            rolesFetched:false,
            accessDenied:false,
            segmentTypes: [{id:"RNG",name:"RANGE"},{id:"RDO",name:"RADIO"},{id:"MUL",name:"MULTI"},{id:"TXT",name:"TEXT"}] ,
            formControls:{
              segmentType:{
                value:""
              },
              segmentTitle:{
                value:""
              },
              segmentIcon:{
                value:""
              },
              segmentName:{
                value:""
              },
              minValue:{
                value:""
              },
              maxValue:{
                value:""
              },
              floorValue:{
                value:""
              },
              cielValue:{
                value:""
              },
              segmentOption:{
                value:""
              },
              status:{
                value:"Active"
              },
              segmentId:{
                value:""
              }
            },
            saveSegmentLoader:false,
            editSegment:false  
        }
    }
    componentDidMount(){
      if(utils.isAdmin){
        this.fetchAllSegments();
      }else{
          this.getRequiredRoles();
      }
    }
    getRequiredRoles(){
      fetchRoles('Segments')
      .then(response => response.json())
      .then(data =>{
          if(data.success && data.subRoles && data.subRoles.length>0){
              utils.roles = data.subRoles;
              this.fetchAllSegments();
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
    getAllPages(type){
      if(type === 'previous'){
          if(this.state.start > 0){
              this.setState({
                  start: this.state.start - 30,
              },()=>{
                  this.fetchAllSegments();
              })
          }
      }else if(type === 'next'){
          if(this.state.hasNext){
              this.setState({
                  start: this.state.start + 30,
              },()=>{
                  this.fetchAllSegments();
              })
          }
      }
    }
    fetchAllSegments(){
      let temp = this.state.actions;
      if(utils.hasRole('segment_edit') && !this.state.rolesFetched){
        temp.push('edit');
      }
      this.setState({
        rolesFetched: true,
        actions:temp
      })
      let body = {
        start: this.state.start,
        maxResults: 30
      };
        getSelectSegment(body)
        .then(response => response.json())
        .then(data=>{
        //let data = { "success": true, "message": "Success", "allowedActions": [ "all" ], "segmentList": [ { "id": 1, "icon": "abc", "displayTitle": "Segment-1", "type": "RNG", "name": "segment-name-1", "dataCode": null, "status": "active", "allowedSubActions": [ "all" ] }, { "id": 2, "icon": "abc", "displayTitle": "Segment-1", "type": "RNG", "name": "segment-name-1", "dataCode": null, "status": "active", "allowedSubActions": [ "all" ] } ] };  
        if (data.success && data.segmentList && data.segmentList.length > 0){
            this.setState({
              segments: data.segmentList,
              hasNext: (data.segmentList.length === 30)        
            });
          }else{
            this.setState({
              hasNext: false
            })
          } 
        })
        .catch(error => {
          console.log(error);
        })
    }
    togglePopup() {
      this.clearFormControls();
      this.setState({
        openPopup: !this.state.openPopup
      });
    }
    createNewSegment(){
      //console.log(this.state.formControls);
      let data = this.state.formControls;
      if(!data.segmentType.value){
        ToastsStore.error("Please choose Segment type");
        return;
      }
      this.setState({
        saveSegmentLoader:true
      })
      let body = {
        "title" : data.segmentTitle.value,
        "iconUrl" : data.segmentIcon.value,
        "name" : data.segmentName.value,
        "desc" : "",
        "status" : data.status.value,
        "segmentType" : data.segmentType.value
      }
      if(body.segmentType === "RNG"){
        body['values'] = {
          "minValue" : data.minValue.value,
          "maxValue" : data.maxValue.value
        }
      }else if(body.segmentType === "RDO" || body.segmentType === "MUL"){
        body['values'] = {
          segmentValuesList:[]
        }
        if(!data.segmentOption.value){
          ToastsStore.error("Please add Segment options");
          return;
        }else{
          try{
            let arr = data.segmentOption.value.split(",");
            for(let i=0;i<arr.length;i++){
              let obj = {id:i,value:arr[i]};
              body.values.segmentValuesList.push(obj);
            }
          }catch(err){
            ToastsStore.error("Value of Segment Options is not Appropriate");
            return;
          }
        }
      }
      //console.log(body);
      createEditSegment(body)
      .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.togglePopup();
            this.fetchAllSegments();
            this.clearFormControls();
            ToastsStore.success("Segment created Successfully !");
          } else {
            ToastsStore.error(data.message);
          }
          this.setState({
            saveSegmentLoader: false
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            saveSegmentLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    tableAction(index,action){
      if(action === "edit"){
        let data1 = this.state.segments[index];
        let body = {
          segmentId: data1.id
        }
        getSegmentDetail(body)
        .then(response => response.json())
        .then(data=>{
          //let data = { "success": true, "message": "Success", "allowedActions": [], "segmentDetails": { "segmentId": 3, "title": "Segment-1", "iconUrl": "abc", "name": "segment-name-1", "desc": "dec", "status": "active", "segmentType": "RDO", "values": { "minValue": null, "maxValue": null, "segmentValuesList": [ { "id": 1, "value": "Y" }, { "id": 2, "value": "No" } ] } } };
          if (data.success){
            this.populateFormControls(data.segmentDetails);
          }else{
            ToastsStore.error(data.message);
          } 
          })
          .catch(error => {
            console.log(error);
          })
      }else if (action === "eye"){
        
      }
    }
    clearFormControls(){
      let temp1 = this.state.formControls;
      temp1.segmentType.value = "";
      temp1.segmentTitle.value = "";
      temp1.segmentIcon.value = "";
      temp1.segmentName.value = "";
      temp1.minValue.value = "";
      temp1.maxValue.value = "";
      temp1.floorValue.value = "";
      temp1.cielValue.value = "";
      temp1.status.value = "";
      temp1.segmentId.value = "";
      temp1.segmentOption.value = "";
      this.setState({
        formControls: temp1
      })
    }
    populateFormControls(data){
      let temp1 = this.state.formControls;
      temp1.segmentType.value = data.segmentType;
      temp1.segmentTitle.value = data.title;
      temp1.segmentIcon.value = data.iconUrl;
      temp1.segmentName.value = data.name;
      temp1.minValue.value = data.values.minValue;
      temp1.maxValue.value = data.values.maxValue;
      temp1.floorValue.value = "";
      temp1.cielValue.value = "";
      temp1.status.value = data.status;
      temp1.segmentId.value = data.segmentId;
      if(data.segmentType === "RDO" || data.segmentType === "MUL"){
        let str = "";
        if(data.values.segmentValuesList){
          for(let i=0;i<data.values.segmentValuesList.length;i++){
            str += data.values.segmentValuesList[i].value;
            if(i !== data.values.segmentValuesList.length-1){
              str+=","
            }
          }
          temp1.segmentOption.value = str;
        }else{
          temp1.segmentOption.value = "";
        }
      }else{
        temp1.segmentOption.value = "";
      }
      this.setState({
        formControls: temp1,
        editSegment:true
      })
    }
    editSegment(){
      let data = this.state.formControls;
      if(!data.segmentType.value){
        ToastsStore.error("Please choose Segment type");
        return;
      }
      this.setState({
        saveSegmentLoader:true
      })
      let body = {
        "title" : data.segmentTitle.value,
        "iconUrl" : data.segmentIcon.value,
        "name" : data.segmentName.value,
        "desc" : "",
        "segmentId" : data.segmentId.value,
        "status" : data.status.value,
        "segmentType" : data.segmentType.value
      }
      if(body.segmentType === "RNG"){
        body['values'] = {
          "minValue" : data.minValue.value,
          "maxValue" : data.maxValue.value
        }
      }else if(body.segmentType === "RDO" || body.segmentType === "MUL"){
        body['values'] = {
          segmentValuesList:[]
        }
        if(!data.segmentOption.value){
          ToastsStore.error("Please add Segment options");
          return;
        }else{
          try{
            let arr = data.segmentOption.value.split(",");
            for(let i=0;i<arr.length;i++){
              let obj = {id:i,value:arr[i]};
              body.values.segmentValuesList.push(obj);
            }
          }catch(err){
            ToastsStore.error("Value of Segment Options is not Appropriate");
            return;
          }
        }
      }
      //console.log(body);
      createEditSegment(body)
      .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.closeAction();
            this.fetchAllSegments();
            this.setState({
              saveSegmentLoader: false
            });
            this.clearFormControls();
            ToastsStore.success("Segment Edited Successfully !");
          } else {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
          }
        }).catch(error => {
          console.log(error);
          this.setState({
            saveSegmentLoader: false
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }
    closeAction(){
      if(this.state.editSegment){
        this.clearFormControls();
        this.setState({
          editSegment:false
        })
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
    render(){
        return(
          <React.Fragment>
            <PageTitle title="Segments" description="Welcome to Segment"/>
            {
              this.state.rolesFetched &&
              <main className="wrapper-container">
                <div className="card-custom flex flex-direction--row flex-wrap pad--half">
                    <h4 className="ui header">Segments</h4>
                    <section className="margin-left--auto margin-right--quar">
                        {
                            utils.hasRole('segment_create') &&
                            <div className="senderId-action--wrapper">
                              <button onClick={() => this.togglePopup()} className="btn btn-fill btn-success margin-left--auto">New Segment</button>
                            </div>
                        }
                    </section>
                </div>     
                <section className="card-custom pad">
                    <div className="margin-top margin-btm">
                      <Pagination
                          getData={this.getAllPages.bind(this)}
                          start={this.state.start}
                          hasNext={this.state.hasNext}
                          data={this.state.segments}
                          loader={this.state.loader} 
                          />
                      </div>
                      <SegmentTable 
                        segments={this.state.segments}
                        tableAction={this.tableAction.bind(this)}
                        actions={this.state.actions}/>
                      <Pagination
                          getData={this.getAllPages.bind(this)}
                          start={this.state.start}
                          hasNext={this.state.hasNext}
                          data={this.state.segments}
                          loader={this.state.loader} 
                      />
                  </section>
                  
                  { this.state.openPopup &&
                    <Popup title={'Create New Segment'} togglePopup={this.togglePopup.bind(this)} >
                      <CreateSegment
                        segmentTypes={this.state.segmentTypes}
                        changeHandler={this.changeHandler.bind(this)}
                        submitData={this.createNewSegment.bind(this)}
                        formControls={this.state.formControls}
                        saveSegmentLoader={this.state.saveSegmentLoader}
                        submitCta={"Save"}
                        togglePopup={this.togglePopup.bind(this)}>
                      </CreateSegment>
                    </Popup>
                  }
                  {
                    this.state.editSegment && 
                    <Popup title={'Edit Segment'} togglePopup={this.closeAction.bind(this)} >
                      <CreateSegment
                        segmentTypes={this.state.segmentTypes}
                        changeHandler={this.changeHandler.bind(this)}
                        submitData={this.editSegment.bind(this)}
                        formControls={this.state.formControls}
                        saveSegmentLoader={this.state.saveSegmentLoader}
                        submitCta={"Save"}
                        togglePopup={this.closeAction.bind(this)}>
                      </CreateSegment>
                    </Popup>
                  }
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