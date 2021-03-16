import React from 'react';
import CircularLoader from '../circular-loader/circular-loader';

export default function NewRole(props){
    return(
        <section>
            <form className="ui form pad">
                <div className="equal width fields">
                        <div className="field">
                            <label className="label">Permission Group Name</label>
                            <input  type="text" 
                            className="form-control" 
                            name="groupName"
                            value={props.formControl.groupName.value}
                            onChange={props.changeHandler} />
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <textarea 
                             id="desc"
                             type="text"
                             name="roleDesc" 
                             className="form-control" rows="2"
                             onChange={props.changeHandler}
                             value={props.formControl.roleDesc.value}/>
                        </div>
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
                                    <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                              </div> 
                        }
            </div>
        </section>
    );
}