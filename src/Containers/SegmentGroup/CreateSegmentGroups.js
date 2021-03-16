import React, { Component } from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';

class CreateSegmentGroups extends Component {
      render(){
      return(
            <section>  
                  <div className="senderId-modal--wrapper">                       
                       <div className="col-20">
                                <div className="col-9 margin-btm margin-left--auto margin-right--auto">
                                        <div className="label">Medium</div>
                                        <select className="form-control"
                                        name="medium"
                                        value={this.props.formControls.mediumId.value} 
                                        onChange={this.props.onMediumChange}>                                               
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
                       </div>
                       <div className="col-20">
                                <div className="col-9 margin-btm margin-left--auto margin-right--auto">
                                        <div className="label">DataSource</div>
                                        <select className="form-control"
                                        name="ammId"
                                        value={this.props.formControls.ammId.value} 
                                        onChange={this.props.changeHandler}>                                               
                                                <option value="" hidden>-SELECT-</option>
                                                {
                                                        this.props.datasources.map((item,index)=>{
                                                                return (
                                                                <option key={index} value={item.ammId}>{item.name}</option>
                                                                );
                                                        })
                                                }
                                        </select>
                                </div>
                       </div>
                       <div className="col-9">
                               <div className="label">Segment Group Name</div>
                               <input  type="text"
                                       className="form-control"
                                       name="sgName"
                                       value={this.props.formControls.sgName.value} 
                                       onChange={this.props.changeHandler} >
                               </input>
                       </div>
                       <div className="col-9 margin-left--auto">
                               <div className="label">Status</div>
                               <select className="form-control" 
                                       name="status"
                                       value={this.props.formControls.status.value} 
                                       onChange={this.props.changeHandler} >
                                     <option value="Active">Active</option>
                                     <option value="Inactive">Inactive</option>
                               </select>
                       </div>
                        <div className="dialog-footer pad margin-top col-20">   
                                {
                                        !this.props.saveSegmentGLoader && 
                                        <div>
                                                <button  className="btn btn-fill dialog--cta pointer" onClick={()=>this.props.togglePopup()}>
                                                        Back
                                                </button>                    
                                                <button onClick={() => this.props.submitData()}  className="btn btn-fill btn-success margin-left--half dialog--cta pointer">{this.props.submitCta}</button>
                                        </div>
                                }
                                {
                                        this.props.saveSegmentGLoader &&
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

export default CreateSegmentGroups;