import React from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import './Profile.css';


function TaxDetails(props) {
      return(
            <React.Fragment>
                <div className="senderId-modal--wrapper pad">
                    {
                        !props.isBusinessEdit && props.taxInfo &&
                        <div className="flex flex-wrap businessView col-20">
                            <div className="col-6 margin-right--half">
                                <div className="content">
                                    <div className="header">GST Registration Type</div>
                                    <div className="meta">{props.taxInfo.taxType}</div>
                                </div>
                            </div>
                            <div className="col-6 margin-right--half">
                                <div className="content">
                                    <div className="header">GST No</div>
                                    <div className="meta">{props.taxInfo.registrationNumber}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="content">
                                    <div className="header">Pan No</div>
                                    <div className="meta">{props.taxInfo.pan}</div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        props.isBusinessEdit && props.taxInfo &&
                        <React.Fragment>
                            <div className="align-space-between col-20 flex flex--wrap flex-direction--row">
                                <div className="col-6">
                                    <label className="label col-5">GST Registration Type</label>
                                    <select name="taxType" 
                                        class="form-control col-20"  
                                        onChange={props.tChangeHandler} 
                                        value={props.taxInfo.taxType}
                                        >
                                        <option value="">-Choose-</option>    
                                        <option value="GST registered- Regular">GST registered- Regular</option>
                                        <option value="GST registered- Composition">GST registered- Composition</option>
                                        <option value="GST unregistered">GST unregistered</option>
                                        <option value="Consumer">Consumer</option>
                                        <option value="Overseas">Overseas</option>
                                        <option value="SEZ">SEZ</option>
                                        <option value="Deemed exports- EOU's, STP's EHTP's etc">Deemed exports- EOU's, STP's EHTP's etc</option>
                                    </select>
                                    {/* <input type="text" 
                                        className="form-control col-20" 
                                        name="taxType"
                                        value={props.taxInfo.taxType} 
                                        onChange={props.tChangeHandler}  
                                        /> */}
                                </div>
                                <div className="col-6">
                                    <label className="label col-5">GST No</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="registrationNumber"
                                        value={props.taxInfo.registrationNumber} 
                                        onChange={props.tChangeHandler}  
                                        />
                                </div>
                                <div className="col-6">
                                    <label className="label col-5">Pan No</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="pan"
                                        value={props.taxInfo.pan} 
                                        onChange={props.tChangeHandler}  
                                        />
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </div>
                <section className="margin-auto margin-btm--quar col-18 margin-top-60 pad--half sender-note bdr-radius-8px" style={{fontSize:'12px'}}>
                    <div className="text--center">
                         *GST No., PAN NO., Tax registration details are to be filled as per the GST Registration Type.<br/>These details are required by our Finance team to raise the invoice.
                    </div> 
                </section>
                <div className="dialog-footer pad">   
                    {
                        !props.confirmationLoader && !props.isBusinessEdit && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                    BACK
                            </button>                    
                            <button className="anchor-btn margin-left--half dialog--cta pointer" onClick={props.changeViewToEditBusiness}>
                                EDIT DETAILS
                            </button>
                        </div>
                    }
                    {
                        !props.confirmationLoader && props.isBusinessEdit && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                    BACK
                            </button>                    
                            <button className="ui green button" onClick={props.saveTaxDetails}>
                                SAVE CHANGES
                            </button>
                        </div>
                    }
                    { 
                        props.confirmationLoader && 
                        <div>
                            <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                        </div>
                    } 
                </div>
            </React.Fragment>
        );               
}
 
export default TaxDetails;