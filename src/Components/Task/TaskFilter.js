import React from 'react';
import utils from '../../Services/utility-service';
import DatePicker from "react-datepicker";

export default function TaskFilter (props){
    return(
        <article className="popUp-modal--wrapper pad" style={{maxHeight:'440px'}}>            
            <div className="col-19 margin-top--half">
                <div className="label" style={{fontSize:'12.5px'}}>Date</div>
                <div className={utils.isMobile ? "flex flex-direction--col" : "flex"}>
                    <div className={utils.isMobile ? "col 20" : "col-9 flex" }>
                        <div className="label margin-right--half" style={{lineHeight:'28px'}}>From:</div>
                        <DatePicker
                            selected={props.formControls.from.value}
                            placeholderText="Click to select Date"
                            onChange={event => {props.dateChange(event,'from')}}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="col-20"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className={utils.isMobile ? "col 20 margin-top--double" : "col-9 flex margin-left--auto" }>
                        <div className="label margin-right--half" style={{lineHeight:'28px'}}>To:</div> 
                        <DatePicker
                            selected={props.formControls.to.value}
                            placeholderText="Click to select Date"
                            onChange={event => {props.dateChange(event,'to')}}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="col-20"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div> 
                </div> 
            </div>
            <div className={utils.isMobile ? "margin-btm--TwentyFive col-19 margin-top--double" : "col-19 margin-btm margin-top--double" }>
                <div className="label">Status</div>
                <select         
                        className="form-control form-control-fullwdth"
                        name="status"
                        value={props.formControls.status.value}
                        onChange={props.selectChange}>
                        <option value="" defaultValue>-SELECT-</option>
                        <option value="Initiated">Start</option>
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                        <option value="Re-Schedule">Re-Schedule</option>
                        <option value="Cancelled">Cancel</option>
                        <option value="Re-Assign">Re-Assign</option>
                    </select>
                {/* <Select
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    placeholder="Select or Search.."
                    name="status"
                    className="form-control-fullwdth"
                    value={props.formControls.status.value}
                    // onChange={event => {props.selectChange(event,'status')}}
                    options={()=>props.statusObjArray()}
                /> */}
            </div>
            <div className={`${utils.isMobile ? "padding-top-tewleve" : "padding-top-six margin-btm-Three" } col-20 dialog-footer margin-top-seven`}>
                <div>
                        <button onClick={() => props.clear()}  className="btn btn-fill margin-left--half dialog--cta pointer">Clear</button>                    
                        <button onClick={() => props.submitData()}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Apply</button>
                </div>
            </div>
        </article>
    )
}