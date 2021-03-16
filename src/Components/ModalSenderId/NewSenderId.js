import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';
import { Popup } from 'semantic-ui-react';
// import SvgIcon from '../Svg-icon/Svg-icon';
import './NewSenderId.css';

const initialState = {
      formControls: {
        medium: {
          value: 'SMS'
        },
      //   datasource: {
      //     value: ''
      //   },
        senderCode: {
          value: ''
        },
        sampleMessage: {
          value: ''
        }
    }
}

class NewSenderId extends Component {
      constructor(props){
            super(props);
            this.state=initialState;
      }
      changeHandler = event => {
            const name = event.target.name;
            const value = event.target.value;
            this.setState({
                  formControls: {
                        ...this.state.formControls,
                        [name]: {
                        ...this.state.formControls[name],
                        value
                        }
                  }
            });
      }
      render(){
      return(
            <section>
                   <div className="senderId-modal--wrapper">
                   <div className="col-20">
                       <div className="col-20">
                               <div className="label">Medium</div>
                               <input type= "text" 
                                      className="form-control" 
                                      name="medium"
                                      value={this.state.formControls.medium.value} 
                                      onChange={this.changeHandler}  
                                      placeholder="Medium" disabled/>
                       </div>
                       {/* <div className="col-9 margin-left--auto">
                               <div className="label">Datasource</div>
                               <select className="form-control" 
                                       name="datasource"
                                       value={this.state.formControls.datasource.value} 
                                       onChange={this.changeHandler} >
                                     <option defaultValue >Choose</option>
                                     {
                                           this.props.datasources.map((item,index)=>{
                                                 return (
                                                       <option key={index} value={item.ammId+","+item.bamId}>{item.name}</option>
                                                 );
                                           })
                                     }
                               </select>
                       </div> */}
                       {
                        <Popup 
                              content='Sender code has to be approved in DLT platform. Please get in touch with your account manager.'
                              trigger={
                                    <div className="col-20 margin-top">   
                                          {/*  will do it in future 
                                          <div>  
                                                <span className="tooltip-icon"><SvgIcon icon={"help-circle"} classes={'svg--lg'}></SvgIcon></span>
                                                <span className="tooltip-text">Sender code has to be approved in DLT platform<br/>Please get in touch with your account manager.<br/></span>
                                          </div> 
                                          */}
                                    <div className="label">Sender Code</div>                      
                                          <input type="text" 
                                                className="form-control" 
                                                name="senderCode" 
                                                value={this.state.formControls.senderCode.value} 
                                                onChange={this.changeHandler}
                                                placeholder="Type here..."/>
                                          <div class="margin-top--quar" style={{fontSize: '12px'}}><i aria-hidden="true" class="blue info circle icon"></i>&nbsp;Sender Code has to be of 6 Characters</div>      
                                    </div> 
                              }>
                              {/* <Popup.Content>
                                    <span className="tooltip-text">Sender code has to be approved in DLT platform<br/>Please get in touch with your account manager.<br/></span> 
                              </Popup.Content> */}
                        </Popup>
                       }
                       </div>  
                         
                         <div className="col-20 margin-top">
                             <div className="label">Sample Message (Optional)</div>
                             <textarea type="text"
                                       name="sampleMessage" 
                                       value={this.state.formControls.sampleMessage.value} 
                                       onChange={this.changeHandler}
                                       maxLength="320"
                                       placeholder="Type here..." 
                                       className="form-control" 
                                       style={{height: '120px',resize: 'none'}}>
                              </textarea>
                              <div className="margin-top--half text-light text-small">
                                    Total <span className="text--darker text--bold">1</span> message, <span className="text--darker text--bold">{this.state.formControls.sampleMessage.value.length}</span> characters (Max limit 320 characters)
                              </div>
                         </div>

                         <div className="col-20 margin-top">
                              <div className="form-error text--center margin-btm">{this.props.error}</div>
                        </div> 
                  </div> 
                  <div className="dialog-footer pad">
                        {
                              this.props.submitIdLoader &&
                              <div>
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                              </div>
                        }
                        {
                              !this.props.submitIdLoader &&
                              <div>
                                    <button 
                                          className="btn btn-fill dialog--cta pointer" 
                                          onClick={()=>this.props.togglePopup()}>
                                                Cancel
                                    </button>
                                    <button onClick={()=>this.props.submitData(this.state.formControls)} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                              </div>
                        }      
                  </div>                
            </section>
      );
    }
}

export default NewSenderId;