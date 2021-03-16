import React from 'react';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';


export default function AddLead(props){
   
    

    return(
        <main>
            <form className="senderId-modal--wrapper">
                <div className="col-9 required field">
                    <label for="name" className="required"><b>Name</b></label>
                    <div><input value={props.leadArr.name} type="text" id="name" className="form-control" name="name" onChange={props.changeHandler} required/></div>
                </div>
                <div className="col-9 margin-left--auto">
                    <label for="org"><b>Organisation</b></label>
                    <div><input type="text" value={props.leadArr.org} className="form-control" id="org" name="org" onChange={props.changeHandler} /></div>
                </div>  
                <div className="col-9 margin-top--half required field">
                    <label for="mobile" className="required"><b>Contact Number</b></label>
                    <div><input id="mobile" className="form-control" name="mobile" type="number" onChange={props.changeHandler} required/></div>
                </div>    
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="email"><b>Email Id</b></label>
                    <div><input id="email"  name="email" type="email" className="form-control" onChange={props.changeHandler}/></div>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="pubId" className="required"><b>Publisher Id</b></label>
                    <div><input id="pubId" name="pubId" type="text" className="form-control" onChange={props.changeHandler}/></div>
                </div>
                <div className="col-9 margin-top--half margin-left--auto required field">
                    <label for="campaignId" className="required"><b>Campaign Id</b></label>
                    <div><input id="campaignId" name="campaignId" type="text" className="form-control" onChange={props.changeHandler}/></div>
                </div> 
                <div className="col-9 margin-top--half">
                    <label for="address"><b>Address</b></label>
                    <input id="address" name="address" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto required field">
                    <label for="source"><b>Source</b></label>
                    <input id="source" name="source" className="form-control" onChange={props.changeHandler} srequired/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="city"><b>City</b></label>
                    <input id="city" name="city" className="form-control"onChange={props.changeHandler} /> 
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="industry"><b>Industry</b></label>
                    <input id="industry" name="industry" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="state"><b>State</b></label>
                    <input id="state" name="state" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="designation"><b>Designation</b></label>
                    <input id="designation" name="designation" className="form-control" onChange={props.changeHandler}/>        
                </div>
                <div className="col-9 margin-top--half">
                    <label for="pincode"><b>PIN</b></label>
                    <input type="number" id="pincode" name="pincode" className="form-control" onChange={props.changeHandler}/>   
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="website"><b>Website</b></label>
                    <input id="website" name="website" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="leadType"><b>Lead Type</b></label>
                    <input id="leadType" name="leadType" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="marketingMedium"><b>Current Marketing Mediums</b></label>
                    <input id="marketingMedium" name="marketingMedium" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="linkedIn"><b>LinkedIn URL</b></label>
                    <input id="linkedIn" name="linkedIn" type="url" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto"> 
                    <label for="company"><b>Company Name</b></label>
                    <input id="company" name="company" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="dob"><b>Date of Birth</b></label>
                    <input id="dob" name="dob" type="date" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="registered"><b>Registered on Platform</b></label>
                    <input id="registered" name="registered" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="mob2"><b>Mobile Number 2</b></label>
                    <input type="number" id="mob2" name="mob2" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="email2"><b>Email Id 2</b></label>
                    <input type="email" id="email2" name="email2" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="companyName"><b>Company Legal Name</b></label>
                    <input id="companyName" name="companyName" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="action"><b>Action</b></label>
                    <input id="action" name="action" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half">
                    <label for="gst"><b>GSTIN</b></label>
                    <input id="gst" name="gst" className="form-control" onChange={props.changeHandler}/>
                </div>
                <div className="col-9 margin-top--half margin-left--auto">
                    <label for="follow"><b>Follow-up comment (if any)</b></label>
                    <input id="follow" name="follow" className="form-control" onChange={props.changeHandler}/>
                </div>   
            </form>
            <div className="text--center" style={{color:"red"}}>{props.leadArr.error}</div>
            <ConfirmationModal 
                submitCta="Submit"
                togglePopup={props.togglePopup}
                submitData={props.submitLead}
            />
        </main>
    )
}