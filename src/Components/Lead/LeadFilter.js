import React from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";



export default function LeadFilter(props){
    return(
        <article>
           <div className="popUp-modal--wrapper pad" style={{maxHeight:'440px'}}>
               {props.publisherIdsObjArray && props.publisherIdsObjArray.length>0 &&
                <div className="col-19 margin-btm">
                    <div className="label">Publisher ID</div>
                    <Select                                    
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="publisherIds"
                        placeholder="Select or Search.."
                        value={props.formControls.publisherIds.value}
                        onChange={event => {props.selectChange(event,"publisherIds")}}
                        options={props.publisherIdsObjArray}
                    />

                </div>
                }
                {
                    props.leadFunnelObjArray && props.leadFunnelObjArray.length > 0 &&
                    <div className="col-19 margin-btm">
                        <div className="label">Lead Funnel</div>
                        <Select
                            isClearable={true}
                            isRtl={false}
                            isSearchable={true}            
                            name="leadFunnels"
                            placeholder="Select or Search.."
                            value={props.formControls.leadFunnels.value}
                            onChange={event => {props.selectChange(event,"leadFunnels")}}
                            options={props.leadFunnelObjArray}
                        />
                    </div>
                }
                {
                    props.campaignNameObjArray && props.campaignNameObjArray.length > 0 &&
                    <div className="col-19 margin-btm">
                        <div className="label">Campaign Name</div>
                        <Select
                            isClearable={true}
                            isRtl={false}
                            isSearchable={true}
                            name="campaignName"
                            placeholder="Select or Search.."
                            value={props.formControls.campaignName.value}
                            onChange={event => {props.selectChange(event,"campaignName")}}
                            options={props.campaignNameObjArray}
                        />
                                
                    </div>
                } 
                {
                    props.leadTypeObjArray && props.leadTypeObjArray.length>0 &&
                    <div className="col-19 margin-btm">
                        <div className="label">Lead Type</div>
                        <Select
                            isClearable={true}
                            isRtl={false}
                            isSearchable={true}
                            placeholder="Select or Search.."
                            name="leadType"
                            value={props.formControls.leadType.value}
                            onChange={event => {props.selectChange(event,"leadType")}}
                            options={props.leadTypeObjArray}
                        />
                    </div>
                } 
                 {
                    props.leadStatusObjArray && props.leadStatusObjArray.length>0 &&
                    <div className="col-19 margin-btm">
                            <div className="label">Lead Status</div>
                            <Select
                                isClearable={true}
                                isRtl={false}
                                isSearchable={true}
                                placeholder="Select or Search.."
                                name="leadType"
                                value={props.formControls.leadStatus.value}
                                onChange={event => {props.selectChange(event,"leadStatus")}}
                                options={props.leadStatusObjArray}
                            />
                    </div>
                }       
                <div className="col-19 margin-btm">
                <div className="label">Medium Contains</div>
                        <input type= "text" 
                                className="form-control form-control-fullwdth" 
                                name="utmMedium"
                                placeholder={props.formControls.utmMedium.value ? props.formControls.utmMedium.value:"Type here.."}
                                value={props.formControls.utmMedium.value} 
                                onChange={props.textHandleChange}  
                                />
                </div>                   
            
                <div className="col-19 margin-btm">
                    <div className="label">Source Contains</div>
                        <input  type="text"
                                className="form-control form-control-fullwdth" 
                                name="utmSource"
                                placeholder={props.formControls.utmSource.value ? props.formControls.utmSource.value :"Type here.."}
                                value={props.formControls.utmSource.value} 
                                onChange={props.textHandleChange}>
                        </input>
                </div>

                <div className="col-19 margin-btm">
                    <div className="label">Lead ID</div>
                        <input  type="number"
                                className="form-control form-control-fullwdth" 
                                name="leadId"
                                placeholder={props.formControls.leadId.value ? props.formControls.leadId.value :"Type here.."}
                                value={props.formControls.leadId.value} 
                                onChange={props.textHandleChange}>
                        </input>
                </div> 

                  <div className="col-19 margin-btm">
                    <div className="label">Mobile Number</div>
                        <input  type="number"
                                className="form-control form-control-fullwdth" 
                                name="mobile"
                                placeholder={props.formControls.mobile.value ? props.formControls.mobile.value :"Type atleast last 4 digits.."}
                                value={props.formControls.mobile.value} 
                                onChange={props.textHandleChange}>
                        </input>
                </div>

                <div className="col-19 margin-top--half">
                        <div className="label" style={{fontSize:'12.5px'}}>Date</div>
                        <div className="flex">
                           <div className="col-9 flex">
                                <div className="label margin-right--half" style={{lineHeight:'28px'}}>From:</div>
                                <DatePicker
                                    selected={props.formControls.from.value}
                                    placeholderText="Click to select Date"
                                    onChange={event => {props.dobChange(event,'from')}}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="col-20"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className="col-9 flex margin-left--auto">
                               <div className="label margin-right--half" style={{lineHeight:'28px'}}>To:</div> 
                               <DatePicker
                                    selected={props.formControls.to.value}
                                    placeholderText="Click to select Date"
                                    onChange={event => {props.dobChange(event,'to')}}
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
                </div> 
                <div className="col-20 dialog-footer pad">
                    <div>
                            <button onClick={() => props.clear()}  className="btn btn-fill margin-left--half dialog--cta pointer">Clear Filters</button>                    
                            <button onClick={() => props.submitData()}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Apply</button>
                    </div>
                </div>
        </article>
    );
}