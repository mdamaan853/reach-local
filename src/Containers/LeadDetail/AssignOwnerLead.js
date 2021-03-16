import React from 'react';
import DatePicker from "react-datepicker";

export default function AssignOwnerLead (props){
    return(
   <React.Fragment>
        <div style={{padding:'35px'}}>
            <div className="flex col-20">
                <div className="col-10">
                    <div className="label">Date &amp; Time:</div>
                    <DatePicker
                        selected={props.formControls.scheduleStart.value}
                        placeholderText="Click to select Date and Time"
                        onChange={event => {props.dateChange(event,'from')}}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="col-20"
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>
                <div className="col-9 margin-left">
                    <div className="label">Lead Detail Id:</div> 
                    <input 
                       value={props.leadDetailId}
                       className="form-control"
                       name="leadDetailId"
                    readOnly/>
                </div> 
            </div>
            
                <div className="flex col-20 margin-top--double">
                    <div className="col-10">
                        <div className="label">User</div>
                        <select className="form-control"
                                name="userUid"
                                value={props.formControls.userUid.value} 
                                onChange={props.changeHandler}
                                >
                                <option value="" defaultValue>-SELECT-</option>
                                {
                                    props.users && props.users.map(client=>{
                                        return(
                                            <option value={client.userUid}>{client.name}</option>
                                        )
                                    })
                                }
                        </select>
                    </div>
                    <div className="col-9 margin-left">
                        <div className="label">Task</div>
                        <select className="form-control"
                            name="taskId"
                            value={props.formControls.taskId.value} 
                            onChange={props.changeHandler}
                            >
                            <option value="" defaultValue>-SELECT-</option>
                            {
                                props.task && props.task.map(client=>{
                                    return(
                                        <option value={client.id}>{client.task}</option>
                                    )
                                 })
                             } 
                        </select>
                    </div>
                </div>
               
            {
                props.formControls.scheduleStart.error &&
                <div className="form-error text--center margin-top--half">{props.formControls.scheduleStart.error}</div>
            }
        </div>
        
   </React.Fragment>   
    );
    
}