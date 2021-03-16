import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';

class ConfirmationModal extends Component {
      render(){
      return(
            <section>
                  
                  <div className="senderId-modal--wrapper pad"> 
                    
                       {this.props.confirmationString}
                       
                       
                  </div> 
                  <div className="dialog-footer pad">   
                        {
                              !this.props.confirmationLoader && 
                              <div>
                                    <button className="ui button" 
                                    onClick={()=>console.log(this.props.error)}
                                    // onClick={()=>this.props.togglePopup()}
                                    >
                                          Back
                                    </button>                    
                                    <button onClick={()=>this.props.submitData()} className="ui teal button">{this.props.submitCta}</button>
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

export default ConfirmationModal;