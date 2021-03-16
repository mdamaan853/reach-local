import React from 'react';
import DatePicker from "react-datepicker";
import utils from '../../../Services/utility-service';

export default function SMSFilter (props){
    return(
        <section className="popUp-modal--wrapper pad">
            {/* <div className="col-19 margin-btm">
                <div className="label">Mobile Number</div>
                <input  type="number"
                        className="form-control form-control-fullwdth" 
                        name="mobile"
                        placeholder={props.formControls.mobile.value ? props.formControls.mobile.value :"Type atleast last 4 digits.."}
                        value= {props.formControls.mobile.value} 
                        onChange={props.textHandleChange}>
                </input>
            </div> */}
            <div className="col-19 margin-top--half">
                <div className="label" style={{fontSize:'12.5px'}}>Date</div>
                <div className={utils.isMobile ? "flex flex-direction--col":"flex"}>
                    <div className={utils.isMobile ? "col-9":  "col-9 flex"}>
                        <div className={utils.isMobile ? "label":"label margin-right--half"} style={{lineHeight:'28px'}}>From:</div>
                        <DatePicker
                            selected={props.formControls.date.from}
                            placeholderText="Click to select Date"
                            onChange={event => {props.dobChange(event,'from')}}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="col-20"
                            dateFormat="dd/MM/yyyy"
                            inline
                        />
                    </div>
                    <div className={utils.isMobile ? "col-9":"col-9 flex margin-left--auto"}>
                        <div className={utils.isMobile ? "label":"label margin-right--half"} style={{lineHeight:'28px'}}>To:</div> 
                        <DatePicker
                            selected={props.formControls.date.to}
                            placeholderText="Click to select Date"
                            onChange={event => {props.dobChange(event,'to')}}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="col-20"
                            dateFormat="dd/MM/yyyy"
                            inline
                        />
                    </div> 
                </div> 
            </div>
            {/* <div className="col-19 margin-btm">
                <div className="label">Date</div>
                <DatePicker
                    selected={props.formControls.date.value}
                    placeholderText="Click to select Date"
                    onChange= {event=>props.dobChange(event)}
                    peekNextMonth
                    inline
                    name="date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="col-20"
                    dateFormat="dd/MM/yyyy"
                />
            </div> */}
            <div className="col-20 dialog-footer pad">
                <div>
                        <button onClick={() => props.clear()}  className="btn btn-fill margin-left--half dialog--cta pointer">CLOSE</button>                    
                        <button onClick={() => props.submitData()}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Apply</button>
                </div>
            </div>
        </section>
    )
}
