import React from 'react';
import PageTitle from '../../Components/Helmet';
import {leadScheduleTask} from '../../Services/lead-service';
import Table from "../../Components/Task/TaskTable";
import TaskFilter from '../../Components/Task/TaskFilter';
import utils from '../../Services/utility-service';
import Popup from '../../Components/Popup/Popup';
import RemarksModal from '../../Components/RemarksModal/RemarksModal';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {leadUpdateTask} from '../../Services/lead-service';
import LeadDetail from '../../Containers/LeadDetail/LeadDetail';
import {getLead} from '../../Services/lead-service';
import DatePicker from "react-datepicker";
import Pagination from '../../Components/Pagination/Pagination';


export default class Task extends React.Component{
    
    constructor(props){
        super(props);
            this.state={
                work:[],
                taskAction:"page",
                leads:[],
                start: 0,
                hasNext: true,
                opnfilter:false,
                isTaskFilterApplied: false,
                taskStatus: null,
                remarks:null,
                opnRemarks: false,
                opnReschedule: false,
                confirmationLoader: false,
                filter:{
                    status:{
                        value:""
                    },
                    from:{
                        value:""
                    },
                    to:{
                        value:""
                    },
                    reschedule:{
                        value:""
                    }
                   
                }
            }
            this.handleChange = this.handleChange.bind(this);
            this.toggleReSchedule = this.toggleReSchedule.bind(this);
            this.clearFilters = this.clearFilters.bind(this);
            this.fetchTask = this.fetchTask.bind(this);
            this.action = this.action.bind(this);
            this.filterPopup = this.filterPopup.bind(this);
            this.switchPage = this.switchPage.bind(this);
            this.getActions = this.getActions.bind(this);
            this.remarksChangeHandler = this.remarksChangeHandler.bind(this);
            // this.formatMulSelectData = this.formatMulSelectData.bind(this);
    }

    componentDidMount(){
        this.fetchTask();
    }

    verifyFilter(){
        let f= this.state.filter;
        if(f.status.value || f.from.value || f.to.value){
            this.setState({
                isTaskFilterApplied: true
            })
        }
        this.filterPopup();
        this.fetchTask();
    }

    clearFilters(){
        let f= this.state.filter;
        f.status.value = "";
        f.from.value = null;
        f.to.value = null;
        this.setState({
            filter: f,
            isTaskFilterApplied: false,
        })
        
        this.fetchTask();
    }

    fetchTask(){
        let body={
            "endDate": this.state.filter.to.value ? this.state.filter.to.value : null,
            "maxResults": 200,
            "start": this.state.start,
            "startDate": this.state.filter.from.value ? this.state.filter.from.value : null, 
            "status": this.state.filter.status.value ? this.state.filter.status.value : null
        }
        this.setState({
            confirmationLoader: true
        })
        leadScheduleTask(body)
        .then(r => r.json())
        .then(data =>{
            this.setState({
                confirmationLoader: false
            })
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    work: data.userTaskMappings
                })
                if(data.userTaskMappings && data.userTaskMappings.length > 0){
                    this.setState({
                        // work: data.userTaskMappings,
                        hasNext: (data.userTaskMappings.length === 200)
                    })
                }
                else{
                    ToastsStore.error("No Datasource Found");
                    this.setState({
                        hasNext: false
                    })
                }   
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e =>{
            ToastsStore.error("Something Went Wrong!!! Please Try Again Later");
            this.setState({
                confirmationLoader: false
            })
        })
    }

    updateCurrentStatus(status){
        let temp = this.state.leads;
        temp.status = status;
        this.setState({
            leads:temp
        })  
    }

    remarksChangeHandler(event){
        this.setState({
            remarks: event.target.value
        })
    }

    updateTaskStatus(){

        let body={
            "bUid": null,
            "mappingId": this.state.mappingId,
            "remarks": this.state.remarks ? this.state.remarks: null,
            "status": !!this.state.taskStatus ? this.state.taskStatus: null,
            "rescheduleTime":  this.state.taskStatus === "Re-Schedule" ?  this.state.filter.reschedule.value : null,
        }
        this.setState({
            confirmationLoader: true
        })
        leadUpdateTask(body)
        .then(res => res.json())
        .then(data =>{
            this.setState({
                confirmationLoader: false
            })
            if(!!data.success){
                ToastsStore.success(data.message);
                if(this.state.taskStatus === "Re-Schedule"){
                    this.toggleReSchedule();
                }
                else{
                    this.togglePopup();
                }   
                // this.props.scheduleTask();
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later!!!");
            this.setState({
                confirmationLoader: false
            })
        })
    }

    switchPage(page){   
        this.setState({
            taskAction: page
        })
    }

    getActions(data){
        let actions = [];
        if(data && data.length > 0){
            data.forEach(e => {
                switch(e){
                    case 'view':
                        actions.push({
                            icon:"eye",
                            key:"view",
                            text:"View Details"
                        });
                        break;
                    case 'complete':
                        actions.push({
                            icon:"checkmark",
                            key:"Complete",
                            text:"Complete"
                        })
                        break;
                    case 'edit':
                        actions.push({
                            icon:"edit",
                            key:"edit",
                            text:"Edit"
                        })
                        break;
                    case 'cancel':
                        actions.push({
                            icon:"cancel",
                            key:"Cancelled",
                            text:"Cancel"
                        })
                        break; 
                    case 'init':
                        actions.push({
                            icon:"hourglass start",
                            key:"Initiated",
                            text:"Start"
                        })
                        break;
                    case 're-assign':
                        actions.push({
                            icon:"redo alternate icon",
                            key:"Re-Assign",
                            text:"Re-Assign"
                        })
                        break; 
                    case 're-schedule':
                        actions.push({
                            icon:"clock outline icon",
                            key:"Re-Schedule",
                            text:"Re-Schedule"
                        })
                        break; 
                             
                    default:    
                        console.log("unhandled type");
                        break;    
                }
            });
        }
        return actions;
    }

    specificLeads(leads,id){
        leads.map(item =>{
            if(item.id === id){
                return(
                    this.setState({
                        leads: item,
                        taskAction: "view",
                    })
                )  
            }
            return
        })
    }

    fetchLeads(id){
        let body={
            start:parseInt(this.state.start),
            maxResult:parseInt(30),
            leadId: id
          }
        getLead(body)
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                this.specificLeads(data.leads,id);
                this.setState({
                    hasNext: data.hasNext,
                     
                 });
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                loader: false
            })
        })
        .catch(error =>{
            // console.log(error);
            this.setState({
                loader: false, 
            })
        })
    }

    toggleReSchedule(){
        this.setState((state)=>{
            return{
                opnReschedule : !state.opnReschedule
            }
        })
    }

    action(task,mid,rid){  
        if(task.key === "view"){
            this.fetchLeads(rid);
        }
        else if(task.key === "Re-Schedule"){
            this.setState({
                taskStatus: task.key,
                mappingId: mid
            })
            this.toggleReSchedule();
        }
        else{
            this.setState({
                taskStatus: task.key,
                mappingId: mid
            })
            this.togglePopup();    
        }              
    }

    togglePopup(){
        this.setState(state=>{
            return{
                opnRemarks : !state.opnRemarks
            }
        })
        console.log(this.state.opnRemarks);
    }

    filterPopup(){
        this.setState(state=>{
            return{
                opnfilter : !state.opnfilter
            }
        })
    }

    dateChange(event,name){
        let temp = this.state.filter;
        temp[name].value=event;
        // if(name === "reschedule"){
        //     if(temp.time.value){
        //         temp.time.value = null;
        //     }
        // }  
        this.setState({
            filter:temp
        })
    }

    handleChange(event) {
        let temp = this.state.filter;
        let name= event.target.name;
        temp[name].value = event.target.value;
        this.setState({
            filter: temp
        }); 
             
    }

    newTask(type){
        if(type === 'previous'){
            if(this.state.start > 0){
              this.setState({
                  start: this.state.start - 200,
              },()=>{
                  this.fetchTask();
              })
            }
        }else if(type === 'next'){
            if(this.state.hasNext){
                this.setState({
                    start: this.state.start + 200,
                },()=>{
                    this.fetchTask();
                })
            }
        }
      }

    render(){
        return(
            <React.Fragment>
            <PageTitle title="Task" description="Welcome to Task"/>
        {
            this.state.taskAction && this.state.taskAction === "page" &&
            <React.Fragment>
            <article className="card-custom  pad">
                <div className="flex align-space-between">
                    <div style={{color:'rgba(0,0,0,.87)',fontSize:'1.28em',lineHeight:'27px',fontWeight:'bold'}}>Task</div>
                    {/* <div className={`${utils.isMobile ? "margin-left-one":"margin-left-seventyFive"} col-15 flex margin-left-fourfour margin-right`} style={{overflowX:"auto"}}> */}
                    <div>   
                        {
                            this.state.isTaskFilterApplied &&
                                <button
                                    onClick={() => this.clearFilters()} 
                                    className="ui tiny grey button margin-right--half">Clear Filters</button>                            
                        }
                           <button 
                               onClick={this.filterPopup}
                               className="ui tiny teal button margin-left--half">Filter</button>
                    </div>
                </div>
                </article>

                    <Table
                        work = {this.state.work}
                        getActions={this.getActions}
                        action={this.action}
                    />
                    <Pagination
                        getData={this.newTask.bind(this)}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.work}
                        loader={this.state.confirmationLoader} 
                    />
                    </React.Fragment>
                }
                {    !!this.state.opnRemarks &&
                <Popup title="Remarks" togglePopup={this.togglePopup} >
                    <RemarksModal
                        submitCta="Submit"
                        remarks={this.state.remarks}
                        changeHandler={this.remarksChangeHandler.bind(this)}
                        confirmationLoader={this.state.confirmationLoader}
                        submitData={this.updateTaskStatus.bind(this)}
                        togglePopup={this.togglePopup.bind(this)}
                    >
                    </RemarksModal>    
                </Popup>
            }
            {
                !!this.state.opnReschedule && 
                <Popup title="Re-Schedule" togglePopup={this.toggleReSchedule}>
                    <div className="popUp-modal--wrapper margin-left--auto margin-right--auto">
                        
                        {
                            !utils.isMobile && 
                            <React.Fragment>
                                <div className="label">Select Re-Schedule Date</div>  
                                <DatePicker
                                    selected={this.state.filter.reschedule.value}
                                    placeholderText="Click to select Date"
                                    onChange={event => {this.dateChange(event,'reschedule')}}
                                    peekNextMonth
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="col-20"
                                    dateFormat="dd/MM/yyyy h:mm aa"
                                    inline
                                />
         
                        </React.Fragment>
                        }  
                       {
                           utils.isMobile &&
                           <React.Fragment>
                               <div className="label">Select Re-Schedule Date</div>  
                                <DatePicker
                                    selected={this.state.filter.reschedule.value}
                                    placeholderText="Click to select Date"
                                    onChange={event => {this.dateChange(event,'reschedule')}}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="col-20"
                                    dateFormat="dd/MM/yyyy"
                                    inline
                                />
                               
                                <div >
                                    <div className="label">Enter Re-Schedule Time</div>
                                    <DatePicker
                                        selected={this.state.filter.reschedule.value}
                                        onChange={event => {this.dateChange(event,'reschedule')}}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                    />
                                </div>
                            </React.Fragment>
                       }
                        
                        <div className="label margin-top-five">Remarks</div>
                        <textarea type="text"
                            name="remarks" 
                            value={this.state.remarks} 
                            onChange={this.remarksChangeHandler.bind(this)}
                            maxLength="320"
                            placeholder="Type here..." 
                            className="form-control form-control-fullwdth" 
                            style={{height: '60px',resize: 'none'}}>
                        </textarea>
                        <div style={{borderTop:"null"}} className={`${utils.isMobile ? "padding-top-tewleve" : "padding-top-six margin-btm-Three" } col-20 dialog-footer margin-top-seven`}>
                            <div>
                                <button onClick={this.toggleReSchedule}  className="btn btn-fill margin-left--half dialog--cta pointer">Back</button>                    
                                <button onClick={this.updateTaskStatus.bind(this)}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Re-Schedule</button>
                            </div>
                        </div>
                    </div>
                </Popup>
            }
                 { 
                    this.state.opnfilter &&
                    <Popup title={'Filter'} togglePopup={this.filterPopup} >
                        <TaskFilter
                            // changeHandler={this.changeHandler.bind(this)}
                            formControls={this.state.filter}
                            selectChange={this.handleChange.bind(this)}
                            submitData={this.verifyFilter.bind(this)}
                            dateChange={this.dateChange.bind(this)}
                            clear={this.clearFilters.bind(this)}
                            togglePopup={this.filterPopup}
                            statusObjArray={this.formatMulSelectData}>
                        </TaskFilter>
                    </Popup>
                } 
                {
                    this.state.taskAction && this.state.taskAction === "view" &&
                        <LeadDetail  updateCurrentStatus={this.updateCurrentStatus.bind(this)} leadData={this.state.leads} switchPage={this.switchPage} back="task"/>
                }
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
            
            </React.Fragment>
        )
    }
}