import React, { Component } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import CircularLoader from '../circular-loader/circular-loader';

class CreateDatasource extends Component {
      render(){
            const style = {
                  borderRadius: 0,
                  opacity: 0.85,
                  padding: '1em',
                  
              } 
      return(
            <section>          
                  <div className="senderId-modal--wrapper">                       
                       <div className="col-9">
                               <div className="label">Medium Name</div>
                               <select className="form-control"
                                       name="mediumName"
                                       value={this.props.formControls.mediumName.value} 
                                       onChange={this.props.changeHandler} >                                              
                                     <option value="" hidden>-SELECT-</option>
                                     {
                                           this.props.mediums.map((item,index)=>{
                                                 return (
                                                       <option key={index} value={item.id}>{item.name}</option>
                                                 );
                                           })
                                     }
                               </select> 
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Datasource Name</div>
                               <input  type="text"
                                       className="form-control"
                                       name="datasourceName"
                                       value={this.props.formControls.datasourceName.value} 
                                       onChange={this.props.changeHandler}>
                               </input>
                       </div>
                       <div className="col-9 margin-top--half">
                               <div className="label">Billing On</div>
                               <select className="form-control" 
                                    name="billingOn"
                                    value={this.props.formControls.billingOn.value} 
                                    onChange={this.props.changeHandler}>                                  
                                     <option value="" hidden>-choose-</option>
                                     <option key="1" value="SENT">Sent</option>
                                     <option key="2" value="DELIVERED">Delivered</option>
                               </select>
                       </div>                 
                        <div className="col-9 margin-top--half margin-left--auto">
                                    <div className="label">Client Price</div>
                                    <input  type="text"
                                            className="form-control"
                                            name="pricePrCrdt"
                                            value={this.props.formControls.pricePrCrdt.value} 
                                            onChange={this.props.changeHandler} >
                                    </input>
                        </div>
                        <div className="col-9 margin-top">
                              <div className="label">Agency Sharing Type</div>
                              <select className="form-control"
                              name="sType"
                              value={this.props.formControls.sType.value} 
                              onChange={this.props.changeHandler}>                                               
                              <option value="" hidden>-SELECT-</option>
                              <option value="PER">Percentage</option>
                              <option value="C2B">Cost To Business</option>
                              </select>
                        </div>
                        <div className="col-9 margin-left--auto margin-top">
                              <div className="label">Agency Cost Or Share</div>
                              <input  type="number"
                                    className="form-control"
                                    name="cos"
                                    value={this.props.formControls.cos.value} 
                                    onChange={this.props.changeHandler} >
                              </input>
                        </div>
                        <div className="col-9 margin-top--half">
                                    <div className="label">Minimum Credits Per Campaign</div>
                                    <input  type="text"
                                            className="form-control"
                                            name="minCrdtCampgn"
                                            value={this.props.formControls.minCrdtCampgn.value} 
                                            onChange={this.props.changeHandler} >
                                    </input>
                        </div>
                        <div className="col-9 margin-top--half margin-left--auto">
                                    <div className="label">Vendor Email Id</div>
                                    <input  type="text"
                                            className="form-control"
                                            name="vendorEmail"
                                            value={this.props.formControls.vendorEmail.value} 
                                            onChange={this.props.changeHandler} >
                                    </input>
                        </div>
                        <div className="col-9 margin-top--half">
                                    <div className="label">Vendor Phone Number</div>
                                    <input  type="text"
                                            className="form-control"
                                            name="phoneNumber"
                                            value={this.props.formControls.phoneNumber.value} 
                                            onChange={this.props.changeHandler}>
                                    </input>
                        </div>
                        <div className="col-9 margin-top--half margin-left--auto">
                               <div className="label">Datasource Status</div>
                               <select className="form-control" 
                                    name="status"
                                    value={this.props.formControls.status.value} 
                                    onChange={this.props.changeHandler}> 
                                     <option value="" hidden>-choose-</option>                                 
                                     <option value="LIVE">Active</option>
                                     <option value="DELETED">Inactive</option>
                               </select>
                       </div>
                       <div className="col-9 margin-top--half">
                               <div className="label">Client Billing Credit Type</div>
                               <select className="form-control" 
                                    name="bct"
                                    value={this.props.formControls.bct.value} 
                                    onChange={this.props.changeHandler}>                                  
                                     <option value="">-Choose-</option>
                                     <option value="basic">Basic</option>
                                     <option value="premium">Premium</option>
                               </select>
                       </div>
                       <div className="col-9 margin-top--half margin-left--auto">
                                    <div className="label">Agency Minimum Price&nbsp;
                                    <Popup
                                          trigger={<Icon name='info circle' color="blue" style={{fontSize:"0.8em", verticalAlign: 'super'}}/>}
                                          content='the price below which the agency cannot sell'
                                          position='top center'
                                          style={style}
                                          inverted
                                    />
                                    </div>
                                    <input  type="text"
                                            className="form-control"
                                            name="mp"
                                            value={this.props.formControls.mp.value} 
                                            onChange={this.props.changeHandler} >
                                    </input>
                        </div>
                        {
                              !!this.props.error &&
                              <div className="col-20 form-error margin-top text--center">
                                    {this.props.error}
                              </div>      
                        }
                        <div className="dialog-footer pad col-20 margin-top">   
                              {     !this.props.saveDataSourceLoader &&
                                    <div>
                                          <button className="btn btn-fill dialog--cta pointer" 
                                          onClick={()=>this.props.togglePopup()}>
                                                Back
                                          </button>                      
                                          <button  onClick={()=> this.props.submitData()} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                                    </div>      
                              }
                              {
                                    this.props.saveDataSourceLoader &&
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

export default CreateDatasource;