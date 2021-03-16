import React from 'react';
import DatePicker from "react-datepicker";


export default function IVRfilter(props){
    return(
       <article>
           <div className="senderId-modal--wrapper pad">
                <div className="col-19 mar--half">
                    <div className="label">Call Type</div>
                    <select         
                        className="form-control" style={{width:'97%'}}
                        name="callType"
                        value={props.filter.callType.value}
                        onChange={props.textHandleChange}>
                        <option value="" hidden>-SELECT-</option>
                        <option value="2">Lead</option>
                    </select>
                </div>
                <div className="col-20 mar--half" >
                    <div className="label">Caller Mobile</div>
                        <input  type="number"
                                className="form-control" style={{width:'95%'}} 
                                name="callerMobile"
                                placeholder={props.filter.callerMobile.value ? props.filter.callerMobile.value :"Type atleast last 4 digits.."}
                                value={props.filter.callerMobile.value} 
                                onChange={props.textHandleChange}>
                        </input>
                </div> 

                <div className="col-20 mar--half">
                    <div className="label">Receiver Mobile</div>
                        <input  type="number"
                                className="form-control" style={{width:'95%'}}
                                name="receiverMobile"
                                placeholder={props.filter.receiverMobile.value ? props.filter.receiverMobile.value :"Type atleast last 4 digits.."}
                                value={props.filter.receiverMobile.value} 
                                onChange={props.textHandleChange}>
                        </input>
                </div>

                {/* <div className="col-20 margin-top--half"> */}
                <div className="col-20 mar--half">
                        <div className="label" style={{fontSize:'12.5px'}}>Date</div>
                        <div className="flex">
                           <div className="col-10 flex">
                                <div className="label margin-right--half" style={{lineHeight:'28px'}}>From:</div>
                                <DatePicker
                                    selected={props.filter.startDate.value}
                                    placeholderText="Click to select Date"
                                    onChange={event => {props.dobChange(event,'startDate')}}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="col-19"
                                />
                            </div>
                            <div className="col-10 flex margin-left--auto">
                               <div className="label margin-right--half" style={{lineHeight:'28px'}}>To:</div> 
                               <DatePicker
                                    selected={props.filter.endDate.value}
                                    placeholderText="Click to select Date"
                                    onChange={event => {props.dobChange(event,'endDate')}}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="col-19"
                                />
                           </div> 
                       </div> 
                </div>
                <div className="dialog-footer padding-right padding-left padding-top margin-top col-20">
                    <div>
                             {/* <button onClick={() => props.clear()}  className="btn btn-fill margin-left--half dialog--cta pointer">Clear Filters</button> */}
                            <button onClick={()=>props.clearFilter("clear")}  className="btn btn-fill margin-left--half dialog--cta pointer">Clear Filters</button>                    
                            <button onClick={()=>props.submitData("filter")}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Apply</button> 
                    </div>
                </div>
           </div> 
        </article>
    );
}