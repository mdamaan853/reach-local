import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';


const initialState = {
      formControls: {
        medium: {
          value: 'Medium Name'
        },
        datasource: {
          value: 'Short Name'
        },
        senderCode: {
          value: ''
        },
        sampleMessage: {
          value: ''
        }
    }
}

class EditMedium extends Component {
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
                                     
                       <div className="col-9">
                               <div className="label">Medium Name</div>
                               <input type= "text" 
                                      className="form-control" 
                                      name="medium"
                                      value={this.state.formControls.medium.value} 
                                      onChange={this.changeHandler}  
                                      placeholder="Medium Name" disabled/>
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Medium Short Name (Max 5 Characters)</div>
                               <input  type="text"
                                       className="form-control" 
                                       name="short-name"
                                       value={this.state.formControls.datasource.value} 
                                       onChange={this.changeHandler} >
                               </input>
                       </div>
                       <div className="col-9">
                               <div className="label">Medium Status</div>
                               <select className="form-control" 
                                       name="datasource"
                                       value={this.state.formControls.datasource.value} 
                                       onChange={this.changeHandler} >
                                     <option defaultValue >Choose</option>
                                     {
                                           this.props.datasources.map((item,index)=>{
                                                 return (
                                                       <option key={index} value={item.id}>{item.name}</option>
                                                 );
                                           })
                                     }
                               </select>
                       </div>
                  </div> 
                  <div className="dialog-footer pad">   
                        <button 
                                                className="anchor-btn dialog--cta pointer" 
                                                      onClick={()=>this.props.togglePopup()}>
                                                            Back
                        </button>                    
                        <div>
                              <button onClick={()=>this.props.submitData(this.state.formControls)} className="anchor-btn margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                        </div>  
                                              
                                                                                                                                                              
                  </div>                
            </section>
      );
    }
}

export default EditMedium;