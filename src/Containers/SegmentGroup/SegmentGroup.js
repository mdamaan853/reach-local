import React, { Component } from 'react';
import PageTitle from '../../Components/Helmet';
import SegmentGroupTable from '../../Components/SegmentGroup/SegmentGroupTable';
import Popup from '../../Components/Popup/Popup';
import CreateSegmentGroups from '../../Containers/SegmentGroup/CreateSegmentGroups';
import EditSegment from '../SegmentGroup/EditSegment';
import {getAllSegmentGroups,addUpdateSegmentGroups,editSegmentGroupDetail} from '../../Services/segment-service';
import { getMediums } from '../../Services/medium-service';
import { getAudienceMediumMapping } from '../../Services/datasource-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {fetchRoles} from '../../Services/roles-service';
import utils from '../../Services/utility-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import Pagination from '../../Components/Pagination/Pagination';
import Youtube from '../../Components/Youtube/Youtube';

export default class SegmentGroup extends Component{
    constructor(props){
        super(props);
        this.state = {       
            segmentGroups: [],
            mediums:[],
            datasources:[],
            openPopup: false,
            submitCta: 'Save',
            rolesFetched:false,
            accessDenied:false,
            saveSegmentGLoader:false,
            editSegment:false,
            start: 0,
            loader: false,
            hasNext:true,
            howTo:false,
            formControls:{
              mediumId:{
                value:""
              },
              ammId:{
                value:""
              },
              sgName:{
                value:""
              },
              status:{
                value:""
              },
              sgId:{
                value:""
              },
              mediumName:{
                value:""
              },
              datasourceName:{
                value:""
              }
            },
            asgmId:"",
            basgmId:"" ,
            segmentGroupId:"" 
        }
    }

    componentDidMount(){
      if(utils.isAdmin){
        this.fetchAllSegmentGroups();
        this.getAllMedium();
      }else{
          this.getRequiredRoles();
      }
    }

    getRequiredRoles(){
        fetchRoles('SegmentGroups')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
                this.fetchAllSegmentGroups();
                this.getAllMedium();
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

    fetchAllSegmentGroups(){
      this.setState({
        rolesFetched: true,
        loader: true
      });
      let body = {
        start : this.state.start,
        maxResults : 30
      };
      getAllSegmentGroups(body)
      .then(response => response.json())
        .then(data => {
          if (data.success) {
              if(data.segmentGroups && data.segmentGroups.length > 0){
                  this.setState({
                      segmentGroups: data.segmentGroups,
                      hasNext: (data.segmentGroups.length === 30)
                  })
              }else{
                  ToastsStore.error("No Segment Groups Found");
                  this.setState({
                      segmentGroups: [],
                      hasNext: false
                  })
              }
          } else {
            ToastsStore.error(data.message);
          }
          this.setState({
              loader: false
          })
        }).catch(error => {
          console.log(error);
          ToastsStore.error("Something went wrong, Please Try Again Later ");
          this.setState({
              loader: false
          })
        })
    }
    
    getAllMedium(){
      let body = {};
      getMediums(body)
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
    togglePopup() {
      this.setState({
        openPopup: !this.state.openPopup
      });
      this.clearFormControls();
    }
    closeAction(){
      if(this.state.editSegment){
        this.setState({
          editSegment:false
        })
        this.clearFormControls();
      }
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

  showVideo(){
      this.setState({
          howTo: !this.state.howTo
      })
  }
    
    saveSegmentGroup(){
      let body = {
        "ammId" : this.state.formControls.ammId.value,
        "sgName" : this.state.formControls.sgName.value,
        "status" : this.state.formControls.status.value,
      }
      this.setState({
        saveSegmentGLoader:true
      })
      addUpdateSegmentGroups(body)
      .then(response => response.json())
      .then(data => {
          if (data.success) { 
            this.setState({
              openPopup: false 
            })
            this.fetchAllSegmentGroups();
          }
          ToastsStore.success(data.message);
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
      this.setState({
            formControls: {
                  ...this.state.formControls,
                  [name]: {
                  ...this.state.formControls[name],
                  value
                  }
            }
      });
      console.log(this.state.formControls);
    }
    tableAction(ind,action,medium,datasource,status,segmentName,asId,basgmId,sgId){
      
      let data = this.state.segmentGroups[ind];
      if(action === "funnel"){
          localStorage.setItem("segmentGroup",JSON.stringify(data));
          this.props.history.push("/mapped-segment-group");
      }else if(action === "segmentG-edit"){
        this.populateFormControls(medium,datasource,status,segmentName);
        this.setState({
          editSegment:true,
          asgmId:asId,
          basgmId:basgmId,
          segmentGroupId:sgId
        });
    }
  }
    editSegmentGroup(){
      let body = { 
       "asgmId": this.state.asgmId ? parseInt(this.state.asgmId) : null,
       "basgmId": this.state.basgmId,
       "name": this.state.formControls.sgName.value ? this.state.formControls.sgName.value: null ,
       "segmentGroupId": this.state.segmentGroupId ? parseInt(this.state.segmentGroupId): null,         
       "status" : this.state.formControls.status.value ? this.state.formControls.status.value : null ,
      }
      this.setState({
        saveSegmentGLoader:true
      })
      editSegmentGroupDetail(body)
      .then(response => response.json())
      .then(data => {
          if (data.success) { 
            this.setState({
              editSegment: false 
            })
            this.fetchAllSegmentGroups();
            ToastsStore.success(data.message);
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
        ToastsStore.error("Something went wrong. Please try again later.!!!");
      })
    }
    
    populateFormControls(m,d,status,segmentName){
      let temp1 = this.state.formControls;
      temp1.mediumName.value = m;
      temp1.datasourceName.value = d;
      temp1.status.value = status || "";
      temp1.sgName.value = segmentName;
      this.setState({
        formControls: temp1
      });
      console.log(this.state.formControls);
    }

    clearFormControls(){
        let temp1 = this.state.formControls;
        temp1.mediumName.value = "";
        temp1.datasourceName.value = "";
        temp1.status.value = "";
        temp1.sgName.value = "";
        temp1.mediumId.value = "";
        temp1.ammId.value = "";
        temp1.sgId.value = "";
        this.setState({
          formControls: temp1
        });
    }

    navSegmentGroup(type){
      if(type === 'previous'){
          if(this.state.start > 0){
            this.setState({
                start: this.state.start - 30,
            },()=>{
                this.fetchAllSegmentGroups();
            })
          }
      }else if(type === 'next'){
          if(this.state.hasNext){
              this.setState({
                  start: this.state.start + 30,
              },()=>{
                  this.fetchAllSegmentGroups();
              })
          }
      }
    }

    render(){
        return(
          <React.Fragment>
            <PageTitle title="Segment Group" description="Welcome to Segment Group"/>
            {
              this.state.rolesFetched &&
              <main>
                {  
                 (this.props.userType === "AGENCY" || utils.isSuAdmin) &&
                 <div style={{textAlign:'end'}}>
                    <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                    <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'end'}} onClick={()=>{this.showVideo()}}>How to create and assign new Segment Group ?</span>
                  </div>
                  }
                  {
                    this.state.howTo && 
                    <Popup title={'How to create and assign new Segment Group ?'} togglePopup={this.showVideo.bind(this)}>
                          <Youtube url={'z_Y2EHwFvt8'}/>
                    </Popup>
                  }
                
                <div className="card-custom flex flex-direction--row flex-wrap pad--half">
                    <h4 className="ui header">Segments Groups</h4>
                    <section className="margin-left--auto margin-right--quar">
                        {
                            utils.hasRole('segment_group_create') &&
                            <div className="senderId-action--wrapper">
                                <button onClick={() => this.togglePopup()} className="btn btn-fill btn-success margin-left--auto">New Segment Group</button>
                            </div>
                        }
                    </section>
                </div>

                <section className="card-custom pad">
                  <div className="margin-top">
                    <Pagination
                        getData={this.navSegmentGroup.bind(this)}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.segmentGroups}
                        loader={this.state.loader} 
                    />
                  </div>
                  <SegmentGroupTable 
                    segmentGroups={this.state.segmentGroups}
                    tableAction={this.tableAction.bind(this)}/>  
                  {
                    this.state.segmentGroups && this.state.segmentGroups.length > 0 &&
                    <Pagination
                        getData={this.navSegmentGroup.bind(this)}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.segmentGroups}
                        loader={this.state.loader} 
                    />
                  }
                </section>

                {   
                    this.state.openPopup &&
                    <Popup title={'Create New Segment Group'} togglePopup={this.togglePopup.bind(this)} >
                      <CreateSegmentGroups
                        mediums={this.state.mediums}
                        datasources={this.state.datasources}
                        onMediumChange={this.onMediumChange.bind(this)}
                        changeHandler={this.changeHandler.bind(this)}
                        submitData={this.saveSegmentGroup.bind(this)}
                        formControls={this.state.formControls}
                        saveSegmentGLoader={this.state.saveSegmentGLoader}
                        submitCta={"Save"}
                        togglePopup={this.togglePopup.bind(this)}>
                      </CreateSegmentGroups>
                    </Popup>
                }
                {   
                    this.state.editSegment &&
                    <Popup title={'Edit Segment Group'} togglePopup={this.closeAction.bind(this)} >
                      <EditSegment
                        mediums={this.state.formControls.mediumName.value}
                        datasources={this.state.formControls.datasourceName.value}
                        changeHandler={this.changeHandler.bind(this)}
                        submitData={this.editSegmentGroup.bind(this)}
                        formControls={this.state.formControls}
                        saveSegmentGLoader={this.state.saveSegmentGLoader}
                        submitCta={"Save"}
                        togglePopup={this.closeAction.bind(this)}>
                      </EditSegment>
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