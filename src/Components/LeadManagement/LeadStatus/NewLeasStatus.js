import React from 'react';
import CircularLoader from '../../circular-loader/circular-loader';

export default function NewLeadStatus (props){

        return(
             <section> 
                <form className="ui form pad">
                    <div className="equal width fields">
                        <div className="field">
                            <label className="label">Name</label>
                            <input  type="text" 
                            className="form-control" 
                            name="leadStatus"
                            value={props.formControl.leadStatus.value}
                            onChange={props.changeHandler} />
                        </div>
                       <div className="field">
                            <label className="label">Description</label>
                            <textarea 
                             id="desc"
                             type="text"
                             name="desc" 
                             className="form-control" rows="2"
                             onChange={props.changeHandler}
                             value={props.formControl.desc.value}/>
                        </div>
                        {/* <div className="field">
                            <label className="label">Status</label>
                            <select className="form-control" 
                             name="status"
                             value={props.formControl.status.value}
                             onChange={props.changeHandler}
                            >
                                <option default>   --Choose--</option>
                                <option value="false">Active</option>
                                <option value="true">Disable</option>
                            </select> 
        </div>*/}
                    </div>
                </form>
                <div className="dialog-footer pad ">   
                        {
                              !props.submitLoader && 
                              <div>
                                    <button className="btn btn-fill dialog--cta pointer" onClick={props.togglePopup}>
                                          Back
                                    </button>                    
                                    <button onClick={props.submitData} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">SUBMIT</button>
                              </div>
                        } 
                        {
                              props.submitLoader && 
                              <div>
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                              </div> 
                        }
                  </div>
            </section> 
        );
    
}