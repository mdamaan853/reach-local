import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';
import IconSearch from '../IconSearch/IconSearch';
class CreateSegment extends Component {
      render(){
      return(
            <section>          
                  <div className="senderId-modal--wrapper">                       
                       <div className="col-20">
                                <div className="col-9 margin-btm margin-left--auto margin-right--auto">
                                        <div className="label">Segment Type</div>
                                        <select className="form-control"
                                        name="segmentType"
                                        value={this.props.formControls.segmentType.value} 
                                        onChange={this.props.changeHandler}>                                               
                                                <option value="" hidden>-SELECT-</option>
                                                {
                                                        this.props.segmentTypes.map((item,index)=>{
                                                                return (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                                );
                                                        })
                                                }
                                        </select>
                                </div>
                       </div>
                       <div className="col-9">
                               <div className="label">Segment Title</div>
                               <input  type="text"
                                       className="form-control"
                                       name="segmentTitle"
                                       value={this.props.formControls.segmentTitle.value} 
                                       onChange={this.props.changeHandler} >
                               </input>
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Segment Name</div>
                               <input  type="text"
                                       className="form-control"
                                       name="segmentName"
                                       value={this.props.formControls.segmentName.value} 
                                       onChange={this.props.changeHandler} >
                               </input>
                       </div>
                       <div className="col-9 margin-top">
                               <div className="label">Segment Icon</div>
                               <IconSearch name="segmentIcon" preValue={this.props.formControls.segmentIcon.value} callback={this.props.changeHandler}/>
                               {/* <input  type="text"
                                       className="form-control"
                                       name="segmentIcon"
                                       value={this.props.formControls.segmentIcon.value} 
                                       onChange={this.props.changeHandler} >
                               </input> */}
                       </div>
                       <div className="col-9 margin-top margin-left--auto">
                               <div className="label">Status</div>
                               <select className="form-control" 
                                       name="status"
                                       value={this.props.formControls.status.value} 
                                       onChange={this.props.changeHandler} >
                                     <option value="Active">Active</option>
                                     <option value="Inactive">Inactive</option>
                               </select>
                       </div>
                       {
                               this.props.formControls.segmentType.value === "RNG" &&
                               <div className="col-20 flex flex-wrap margin-top">
                                       <div className="col-9">
                                                <div className="label">Min Value</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="minValue"
                                                        value={this.props.formControls.minValue.value} 
                                                        onChange={this.props.changeHandler} >
                                                </input>
                                        </div>
                                        <div className="col-9 margin-left--auto">
                                                <div className="label">Max Value</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="maxValue"
                                                        value={this.props.formControls.maxValue.value} 
                                                        onChange={this.props.changeHandler} >
                                                </input>
                                        </div>
                                        <div className="col-9">
                                                <div className="label margin-top">Floor Value (Default Minimum)</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="floorValue"
                                                        value={this.props.formControls.floorValue.value} 
                                                        onChange={this.props.changeHandler} >
                                                </input>
                                        </div>
                                        <div className="col-9 margin-top margin-left--auto">
                                                <div className="label">Ceil Value (Default Max)</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="cielValue"
                                                        value={this.props.formControls.cielValue.value} 
                                                        onChange={this.props.changeHandler} >
                                                </input>
                                        </div>
                               </div>
                       }
                       {
                               (this.props.formControls.segmentType.value === "RDO" || this.props.formControls.segmentType.value === "MUL") &&
                               <div className="col-20 flex flex-wrap margin-top">
                                       <div className="col-20">
                                                <div className="label">Segment options (Comma Seperated values i.e. option1,option2,option3)</div>
                                                <input  type="text"
                                                        className="form-control"
                                                        name="segmentOption"
                                                        value={this.props.formControls.segmentOption.value} 
                                                        onChange={this.props.changeHandler} >
                                                </input>
                                        </div>
                               </div>
                       }
                        <div className="dialog-footer pad margin-top col-20">   
                                {
                                        !this.props.saveSegmentLoader && 
                                        <div>
                                                <button  className="btn btn-fill dialog--cta pointer" onClick={()=>this.props.togglePopup()}>
                                                        Back
                                                </button>                    
                                                <button onClick={() => this.props.submitData()}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                                        </div>
                                }
                                {
                                        this.props.saveSegmentLoader &&
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

export default CreateSegment;