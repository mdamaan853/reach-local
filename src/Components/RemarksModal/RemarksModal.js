import React, { Component } from 'react';
import classNames from 'classnames';
import CircularLoader from '../circular-loader/circular-loader';

class RemarksModal extends Component {
      render(){
            let btnClass = classNames({
                  'btn': true,
                  'btn-fill': true,
                  'margin-left--half': true,
                  'btn-info': this.props.submitCta === 'accept',
                  'btn-danger' : this.props.submitCta === 'reject',
                  'btn-success' : this.props.submitCta === ('execute' || 'Submit'),

            });      
            return(
                  <section>
                        <div className="senderId-modal--wrapper pad">                      
                                    <textarea type="text"
                                          name="remarks" 
                                          value={this.props.remarks} 
                                          onChange={this.props.changeHandler}
                                          maxLength="320"
                                          placeholder="Type here..." 
                                          className="form-control" 
                                          style={{height: '60px',resize: 'none'}}>
                                    </textarea>
                        </div> 
                        <div className="dialog-footer pad">   
                              {
                                    !this.props.confirmationLoader && 
                                    <div>
                                          <button className="btn btn-fill dialog--cta pointer" onClick={()=>this.props.togglePopup()}>
                                                Back
                                          </button>                    
                                          <button onClick={()=>this.props.submitData()} style={{padding:'3px 12px;',textTransform:'capitalize'}} className={btnClass}>{this.props.submitCta}</button>
                                    </div>
                              }
                              {
                                    this.props.confirmationLoader &&
                                    <div>
                                          <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                              }
                        </div>                
                  </section>
            );
    }
}

export default RemarksModal;