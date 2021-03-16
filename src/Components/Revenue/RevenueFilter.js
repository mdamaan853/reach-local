import React from 'react';
import utils from '../../Services/utility-service';
import DatePicker from "react-datepicker";

export default function RevenueFilter (props){
    return(
   
        <div style={{padding:'35px'}}>
            <div className="flex col-20">
                <div className="col-10">
                    <div className="label">Start Date:</div>
                    <DatePicker
                        selected={props.formControls.from.value}
                        placeholderText="Click to select Date"
                        onChange={event => {props.dateChange(event,'from')}}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="col-20"
                    />
                </div>
                <div className="col-9 margin-left">
                    <div className="label">End Date:</div> 
                    <DatePicker
                        selected={props.formControls.to.value}
                        placeholderText="Click to select Date"
                        onChange={event => {props.dateChange(event,'to')}}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="col-20"
                    />
                </div> 
            </div>
            {
                utils.isSuAdmin &&
            <React.Fragment>
                <div className= "margin-top--double">
                    <label for="smsRadio" className="radioBtn">
                        <input type="radio" name="clientType" 
                        checked={props.clientType === "Agency"} 
                        value="Agency" id="smsRadio" 
                        onClick={props.formControls.client.value ? props.clearClient : null}
                        onChange={props.checkedHandler}
                        />Agency
                        <span className="checkmark1"></span>
                    </label>
                    <label for="customSms" className="radioBtn">
                        <input type="radio" name="clientType"
                        checked={props.clientType && props.clientType === "Client"} 
                        id="customSms" value="Client" 
                        onClick={props.formControls.agency.value ? props.clearAgency : null}
                        onChange={props.checkedHandler}
                        />Client
                        <span className="checkmark1"></span>
                    </label>
                </div>
                

                <div className="flex col-20">
                    <div className="col-10">
                        <div className="label">Agency</div>
                        <select className="form-control"
                                name="agency"
                                value={props.formControls.agency.value} 
                                onChange={props.changeHandler}
                                disabled={props.clientType && props.clientType === "Client" ? true: false}>
                                <option value="" defaultValue>-SELECT-</option>
                                {
                                    props.agencies && props.agencies.map(client=>{
                                        return(
                                            <option value={client.uid}>{client.name}</option>
                                        )
                                    })
                                }
                        </select>
                        {/* {
                            props.state.formControls.agency.error &&
                            <div className="form-error text--center">{props.state.formControls.agency.error}</div>
                        } */}
                    </div>
                    <div className="col-9 margin-left">
                        <div className="label">Client</div>
                        <select className="form-control"
                                name="client"
                                value={props.formControls.client.value} 
                                onChange={props.changeHandler}
                                disabled={props.clientType && props.clientType === "Agency" ? true: false}>
                                <option value="" defaultValue>-SELECT-</option>
                                {
                                    props.clients && props.clients.map(client=>{
                                        return(
                                            <option value={client.uid}>{client.name}</option>
                                        )
                                    })
                                }
                        </select>
                        {/* {
                            props.state.formControls.client.error &&
                            <div className="form-error text--center">{props.state.formControls.client.error}</div>
                        } */}
                    </div>
                </div>
            </React.Fragment>
            }
           
            <div className="flex col-20 margin-top--double">
                <div className="col-10">
                    <div className="label">Event Type</div>
                    <select className="form-control"
                            name="et"
                            value={props.formControls.et.value} 
                            onChange={props.changeHandler}>
                            <option value="" defaultValue>-SELECT Event Type-</option>
                            <option value="Campaign">Campaign</option>
                            <option value="Subscription">Subscription</option>
                            <option value="Buy Credit">Buy Credit</option>
                            <option value="Manual Payment">Manual Payment</option>
                    </select>
                </div>
                    
                
                { !utils.isSuAdmin &&
                    <div className="col-9 margin-left">
                    <div className="label">Client</div>
                    <select className="form-control"
                            name="client"
                            value={props.formControls.client.value} 
                            onChange={props.changeHandler}>
                            <option value="" defaultValue>-SELECT-</option>
                            {
                                props.clients && props.clients.map(client=>{
                                    return(
                                        <option value={client.uid}>{client.name}</option>
                                    )
                                })
                            }
                    </select>
                    {/* {
                        props.formControls.client.error &&
                        <div className="form-error text--center">{props.formControls.client.error}</div>
                    } */}
                    </div>
                }
                
            </div>
            {
                props.formControls.et.error &&
                <div className="form-error text--center margin-top--half">{props.formControls.et.error}</div>
            }
        </div>
    
    );
    
}