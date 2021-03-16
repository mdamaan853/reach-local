import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';

class NewMedium extends Component {
      render(){
      return(
            <section>
                  
                  <div className="senderId-modal--wrapper">                      
                       <div className="col-9">
                               <div className="label">Medium Name</div>
                               <input type= "text" 
                                      className="form-control" 
                                      name="mediumName"
                                      value={this.props.formControls.mediumName.value} 
                                      onChange={this.props.changeHandler}  
                                      />
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Medium Short Name (Max 5 Characters)</div>
                               <input  type="text"
                                       className="form-control" 
                                       name="shortName"
                                       value={this.props.formControls.shortName.value} 
                                       onChange={this.props.changeHandler} >
                               </input>
                       </div>
                       <div className="col-9 margin-top--half margin-btm">
                               <div className="label">Medium Status</div>
                               <select className="form-control" 
                                       name="status"
                                       value={this.props.formControls.status.value} 
                                       onChange={this.props.changeHandler} >
                                     <option default hidden>--Choose--</option>
                                     <option value="Active">Active</option>
                                     <option value="Inactive">Inactive</option>
                               </select>
                       </div>
                  </div> 
                  <div className="dialog-footer pad ">   
                        {
                              !this.props.submitMediumLoader && 
                              <div>
                                    <button className="btn btn-fill dialog--cta pointer" onClick={()=>this.props.togglePopup()}>
                                          Back
                                    </button>                    
                                    <button onClick={()=>this.props.submitData()} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                              </div>
                        }
                        {
                              this.props.submitMediumLoader &&
                              <div>
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                              </div>
                        }
                  </div>                
            </section>
      );
    }
}

export default NewMedium;