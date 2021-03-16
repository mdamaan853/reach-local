import React from 'react';
import Popup from '../../Components/Popup/Popup';
import Moment from 'react-moment';
import {leadUpdateTask,leadTaskHistory} from '../../Services/lead-service';
import {ToastsStore} from 'react-toasts';
import { Dropdown } from 'semantic-ui-react';
import RemarksModal from '../../Components/RemarksModal/RemarksModal';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import HistoryTable from './HistoryTable';
import utils from '../../Services/utility-service';


export default class LeadTaskStatus extends React.Component{

    constructor(props){
        super(props);
        this.state={
            taskAction: null,
            openTable: false,
            remarks:null,
            mappingId:null,
            opnPopUp: false,
            taskHistory:[],
            confirmationLoader: false
        }
        this.getActions = this.getActions.bind(this);
        this.togglePopup =this.togglePopup.bind(this);
        this.toggleTable = this.toggleTable.bind(this);
        this.updateTaskHistory = this.updateTaskHistory.bind(this);
    }

    remarksChangeHandler(event){
        this.setState({
            remarks: event.target.value
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
                    default:    
                        console.log("unhandled type");
                        break;    
                }
            });
        }
        return actions;
    }

    togglePopup(){
        this.setState(state =>{
            return{
                opnPopUp: !state.opnPopUp
           }
        })
    }
    
    toggleTable(){
        this.setState(state =>{
            return{
                openTable: !state.openTable
           }
        })
    }

    action(task,id){        
        if(task.key === "view"){
            this.updateTaskHistory(id);
        }
        else{
            this.setState({
                taskAction: task.key,
                opnPopUp: true,
                mappingId: id
            })
        }  
    }

    updateTaskHistory(id){
        let body={
            "mappingId": id,
            // "bUid": null,
            // "remarks": null,
            // "status": null
        }
        leadTaskHistory(body)
        .then(res => res.json())
        .then(data =>{
            if(data.success){
                this.setState(state =>{
                    return{
                    taskHistory: data.histories,
                    confirmationLoader: false
                    }
                })
                this.toggleTable();
                ToastsStore.success(data.message);
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

    updateTaskStatus(){
        let body={
            "bUid": null,
            "mappingId": this.state.mappingId,
            "remarks": this.state.remarks,
            "status": !!this.state.taskAction ? this.state.taskAction: null 
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
                this.props.scheduleTask();
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

    render(){
        return(
            <div  style={ utils.isMobile ? {marginLeft:'0px'} : {marginLeft: "16px"} } className= "col-20 flex flex-wrap leadDetail-card pad leads-table-wrapper">
             
                <table className="client">
                    <thead>
                        <tr style={{textAlign:'center'}}>
                            <th> Name</th>
                            <th>Schedule Time</th>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        !!this.props.userTaskMappings && this.props.userTaskMappings.map(emp =>{
                            return(
                                <tr className="text--center">
                                    <td>{emp.name}</td>
                                    <td><Moment format="YYYY-MM-DD HH:mm">{emp.scheduleTime}</Moment></td>
                                    <td>{emp.task}</td>
                                    <td>{emp.status}</td>
                                    <td>
                                        <div className="flex flex-direction--col">
                                            <Dropdown text='Actions' direction='left'>
                                                <Dropdown.Menu>
                                                    {
                                                        this.getActions(emp.allowedActions).map((subItem) => {
                                                            return(
                                                                <React.Fragment>
                                                                    <Dropdown.Item icon={subItem.icon} text={subItem.text} onClick={()=>{this.action(subItem,emp.mappingId)}}/>
                                                                    <Dropdown.Divider />
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        {/* <button onClick={()=>this.setState({taskAction: "Initiated",opnPopUp: true})}>Task Started</button>
                                        <button onClick={()=>this.setState({taskAction: "Complete",opnPopUp: true})}>Task Complete</button>
                                        <button>View  History</button> */}
                                    </td>
                                </tr>
                            )           
                        })
                    }
                    </tbody>
                </table>
            {    !!this.state.opnPopUp &&
                <Popup title="Remarks" togglePopup={this.togglePopup} >
                     <RemarksModal
                        submitCta="Submit"
                        remarks={this.state.remarks}
                        changeHandler={this.remarksChangeHandler.bind(this)}
                        confirmationLoader={this.state.confirmationLoader}
                        submitData={this.updateTaskStatus.bind(this)}
                        togglePopup={this.togglePopup}
                        >
                    </RemarksModal>    
                </Popup>
            }
            {
                this.state.openTable &&
                <Popup title="Task History"
                 togglePopup={this.toggleTable}
                >
                    <HistoryTable histories={this.state.taskHistory}/>
                </Popup>
                
            }
            {    !!this.state.confirmationLoader &&
                <div className="global-loader col-1">
                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                </div>    
            }
        </div>
         
        );
    }
}