import React, { Component } from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';

class CreateTemplate extends Component {
      render(){
      return(
            <section>
                  
                  <div className="senderId-modal--wrapper">                      
                       <div className="col-9">
                               <div className="label">Template Name</div>
                               <input type= "text" 
                                      className="form-control" 
                                      name="templateName"
                                      value={this.props.formControls.templateName.value} 
                                      onChange={this.props.changeHandler}  
                                      />
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">SMS Type</div>
                               <select className="form-control" 
                                       name="type"
                                       value={this.props.formControls.type.value} 
                                       onChange={this.props.changeHandler} >
                                     <option value="PRML">Promotional</option>
                                     <option value="TXNL">Transactional</option>
                               </select>
                       </div>
                       {/* <div className="col-9 margin-top">
                               <div className="label">DND Hour Blocking</div>
                               <select className="form-control" 
                                       name="dhb"
                                       value={this.props.formControls.dhb.value} 
                                       onChange={this.props.changeHandler} >
                                     <option value="true">Enabled</option>
                                     <option value="false">Disabled</option>
                               </select>
                       </div>
                       <div className="col-9 margin-top margin-left--auto">
                               <div className="label">DND Scrubbing</div>
                               <select className="form-control" 
                                       name="dsc"
                                       value={this.props.formControls.dsc.value} 
                                       onChange={this.props.changeHandler} >
                                     <option value="true">Enabled</option>
                                     <option value="false">Disabled</option>
                               </select>
                       </div> */}
                       <div className="col-9 margin-top">
                               <div className="label">Sender Id</div>
                               <select className="form-control" 
                                       name="si"
                                       value={this.props.formControls.si.value} 
                                       onChange={this.props.changeHandler} >
                                     <option value="" hidden>--Choose--</option>
                                     {
                                        this.props.senderIds.map((item,index)=>{
                                            return(
                                                <option key={index} value={item.id}>{item.senderCode}</option>
                                            );
                                        })   
                                     }
                               </select>
                       </div>
                       <div className="col-9 margin-top margin-left--auto">
                               <div className="label">Url</div>
                               <input type= "text" 
                                      className="form-control" 
                                      name="url"
                                      value={this.props.formControls.url.value} 
                                      onChange={this.props.changeHandler}  
                                />
                       </div>
                       <div className="col-20 margin-top">
                             <div className="label">Sample Message</div>
                             <textarea type="text"
                                       name="body" 
                                       value={this.props.formControls.body.value} 
                                       onChange={this.props.changeHandler}
                                       maxLength="320"
                                       placeholder="Type here..." 
                                       className="form-control" 
                                       style={{height: '120px',resize: 'none'}}>
                              </textarea>
                              <div className="margin-top--half text-light text-small">
                                    Total <span className="text--darker text--bold">1</span> message, <span className="text--darker text--bold">{this.props.formControls.body.value.length}</span> characters (Max limit 320 characters)
                              </div>
                         </div>
                  </div> 
                  <div className="dialog-footer pad">   
                        {
                              !this.props.submitTemplateLoader && 
                              <div>
                                    <button className="btn btn-fill dialog--cta pointer" onClick={()=>this.props.togglePopup()}>
                                          Back
                                    </button>                    
                                    <button onClick={()=>this.props.submitData()} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                              </div>
                        }
                        {
                              this.props.submitTemplateLoader &&
                              <div>
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                              </div>
                        }
                  </div>                
            </section>
      );
    }
}

export default CreateTemplate;