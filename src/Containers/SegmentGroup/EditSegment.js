import React from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';

function EditSegmentGroups(props) {
      return(
            <section>          
                  <div className="senderId-modal--wrapper">                       
                       <div className="col-20">
                                <div className="col-9 margin-btm margin-left--auto margin-right--auto">
                                        <div className="label">Medium</div>
                                        <input  type="text"
                                                className="form-control"
                                                value={props.mediums} 
                                                disabled>
                                        </input>
                                </div>
                       </div>
                       <div className="col-20">
                                <div className="col-9 margin-btm margin-left--auto margin-right--auto">
                                        <div className="label">DataSource</div>
                                        <input  type="text"
                                         className="form-control"
                                         value={props.datasources} 
                                         disabled/>                                                                                             
                                </div>
                       </div>
                       <div className="col-9">
                               <div className="label">Segment Group Name</div>
                               <input  type="text"
                                       className="form-control"
                                       name="sgName"
                                       value={props.formControls.sgName.value} 
                                       onChange={props.changeHandler} >
                               </input>
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Status</div>
                               <select className="form-control" 
                                       name="status"
                                       value={props.formControls.status.value} 
                                       onChange={props.changeHandler} >
                                     <option value="Active">Active</option>
                                     <option value="Inactive">Inactive</option>
                               </select>
                       </div>
                        <div className="dialog-footer pad margin-top col-20">   
                                {
                                        !props.saveSegmentGLoader && 
                                        <div>
                                                <button  className="btn btn-fill dialog--cta pointer" onClick={()=>props.togglePopup()}>
                                                        Back
                                                </button>                    
                                                <button onClick={props.submitData}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{props.submitCta}</button>
                                        </div>
                                }
                                {
                                        props.saveSegmentGLoader &&
                                        <div>
                                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        </div>
                                }                                                                                                                                              
                        </div>  
                </div>               
            </section>
      );

}

export default EditSegmentGroups;