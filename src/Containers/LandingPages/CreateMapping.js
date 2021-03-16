import React, { Component } from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import Select from 'react-select';


const customStyles = {
    menu: (provided) => ({
        ...provided,
        maxHeight: '100px',
        overflow: 'auto'
    }),
}
class CreateMapping extends Component {
      render(){
      return(
            <section>          
                  <div className="senderId-modal--wrapper">                       
                       <div className="col-20">
                                <div className="col-9 margin-btm margin-left--auto margin-right--auto">
                                        <div className="label">Client</div>
                                        <Select
                                            isClearable={true}
                                            styles={customStyles}
                                            isRtl={false}
                                            isSearchable={true}
                                            name="client"
                                            value={this.props.formControls.client.value}
                                            onChange={this.props.handleChange}
                                            options={this.props.clients}
                                        />
                                        {
                                           !!this.props.formControls.client.error &&
                                           <span className="form-error">{this.props.formControls.client.error}</span>
                                        }
                                </div>
                       </div>
                       <div className="col-9">
                               <div className="label">Campaign Id</div>
                               <input  type="text"
                                       className="form-control"
                                       name="campaignId"
                                       value={this.props.formControls.campaignId.value} 
                                       onChange={this.props.changeHandler} >
                               </input>
                               {
                                        !!this.props.formControls.campaignId.error &&
                                        <span className="form-error">{this.props.formControls.campaignId.error}</span>
                                }
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Landing Page Url</div>
                               <input  type="text"
                                       className="form-control"
                                       name="url"
                                       value={this.props.formControls.url.value} 
                                       onChange={this.props.changeHandler} >
                               </input>
                               {
                                        !!this.props.formControls.url.error &&
                                        <span className="form-error">{this.props.formControls.url.error}</span>
                                }
                       </div>
                        <div className="dialog-footer pad margin-top col-20">   
                                {
                                        !this.props.saveLoader && 
                                        <div>
                                                <button  className="btn btn-fill dialog--cta pointer" onClick={()=>this.props.togglePopup()}>
                                                        Back
                                                </button>                    
                                                <button onClick={() => this.props.submitData()}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                                        </div>
                                }
                                {
                                        this.props.saveLoader &&
                                        <div>
                                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        </div>
                                }                                                                                                                                              
                        </div>  
                </div>               
            </section>
      );
    }
}

export default CreateMapping;