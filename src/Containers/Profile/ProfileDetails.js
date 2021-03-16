import React from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import './Profile.css';

function ProfileDetails(props) {
      return(
            <React.Fragment>
                <div className="senderId-modal--wrapper pad">
                    {
                        props.userInfo &&
                        <React.Fragment>
                            <div className="col-20 flex flex--wrap flex-direction--row">
                                <div className="margin-right--half">
                                    <label className="label col-5">&nbsp;</label>
                                    <select 
                                          className="form-control"
                                          name="title"
                                          value={props.userInfo.title} 
                                          onChange={props.pChangeHandler}>
                                             <option value="Mr.">Mr.</option>
                                             <option value="Mrs.">Ms.</option>
                                             <option value="Mrs.">Mrs.</option>
                                    </select>
                                 </div>
                                 <div className="col-6">
                                    <label className="label col-5">First Name</label>
                                    <input type="text" 
                                       className="form-control" 
                                       name="firstName"
                                       value={props.userInfo.firstName} 
                                       onChange={props.pChangeHandler} 
                                       placeholder="Type here..."/>
                                 </div>
                                 <div className="col-6">
                                    <label className="label col-5">Middle Name</label>
                                    <input type="text" 
                                       className="form-control" 
                                       name="middleName"
                                       value={props.userInfo.middleName} 
                                       onChange={props.pChangeHandler} 
                                       placeholder="Type here..."/>
                                 </div>
                                 <div className="col-6">
                                    <label className="label col-5">Last Name</label>
                                    <input type="text" 
                                       className="form-control" 
                                       name="lastName"
                                       value={props.userInfo.lastName} 
                                       onChange={props.pChangeHandler} 
                                       placeholder="Type here..."/>
                                 </div>
                            </div>
                            <div className="col-20 flex flex--wrap flex-direction--row">
                                 <div className="col-4 margin-top margin-right--half">
                                    <label className="label col-5">Gender</label>
                                    <select 
                                          className="form-control"
                                          name="gender"
                                          value={props.userInfo.gender} 
                                          onChange={props.pChangeHandler}>
                                             <option value="male">Male</option>
                                             <option value="female">Female</option>
                                             <option value="others">Others</option>
                                    </select>
                                 </div>
                                 <div className="col-7 flex flex-direction--col flex-wrap margin-top">
                                    <label className="label col-5" style={{marginBottom:'0px'}}>DOB</label>
                                    <DatePicker
                                       selected={props.userInfo.dob}
                                       onChange={props.dobChange}
                                       peekNextMonth
                                       showMonthDropdown
                                       showYearDropdown
                                       dropdownMode="select"
                                    />
                                 </div>
                            </div>
                            <div className="col-20 flex flex--wrap flex-direction--row margin-top">
                                {
                                    props.popType === 'self' &&
                                    <React.Fragment>
                                        <div className="col-7 margin-right--half">
                                            <label className="label col-5">Mobile</label>
                                            <input type="text" 
                                            className="form-control" 
                                            name="mobile"
                                            value={props.userInfo.mobile}
                                            disabled   
                                            placeholder="Type here..."/>
                                        </div>
                                        <div className="col-7">
                                            <label className="label col-5">Email</label>
                                            <input type="text" 
                                            className="form-control" 
                                            name="email"
                                            value={props.userInfo.email} 
                                            disabled
                                            placeholder="Type here..."/>
                                        </div>
                                    </React.Fragment>    
                                }
                                {
                                    (props.popType === 'add-e' || props.popType === 'edit-e') &&
                                    <React.Fragment>
                                        <div className="col-6 margin-right--half">
                                            <label className="label col-5">Mobile</label>
                                            <input type="text" 
                                            className="form-control" 
                                            name="mobile"
                                            value={props.userInfo.mobile}
                                            onChange={props.pChangeHandler}   
                                            placeholder="Type here..."/>
                                        </div>
                                        <div className="col-6">
                                            <label className="label col-5">Email</label>
                                            <input type="text" 
                                            className="form-control" 
                                            name="email"
                                            value={props.userInfo.email} 
                                            onChange={props.pChangeHandler}
                                            placeholder="Type here..."/>
                                        </div>
                                        <div className="col-6">
                                            <label className="label col-5">Password</label>
                                            <input type="text" 
                                            className="form-control" 
                                            name="password"
                                            value={props.userInfo.password} 
                                            onChange={props.pChangeHandler}
                                            placeholder="Type here..."/>
                                        </div>
                                    </React.Fragment>    
                                }
                            </div>
                            {
                                (props.popType === 'add-e' || props.popType === 'edit-e') &&
                                <div className="col-20 margin-top">
                                    <label className="label col-5">Permission Groups</label>
                                    <Select
                                        isMulti
                                        isClearable={true}
                                        isRtl={false}
                                        isSearchable={true}
                                        name="permissionGroups"
                                        value={props.userInfo.permissionGroups}
                                        onChange={props.handleRolesChange}
                                        options={props.permissionGroups}
                                    />
                                </div>    
                            }
                        </React.Fragment>
                    }
                </div>
                <div className="dialog-footer pad">
                    {
                        !props.confirmationLoader && props.popType === 'self' && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                BACK
                            </button>                    
                            <button className="ui green button" onClick={props.saveProfileDetails}>
                                SAVE CHANGES
                            </button>
                        </div>
                    }
                    {
                        !props.confirmationLoader && props.popType === 'edit-e' && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                BACK
                            </button>                    
                            <button className="ui green button" onClick={props.editEmployeeDetails}>
                                SAVE CHANGES
                            </button>
                        </div>
                    }
                    {
                        !props.confirmationLoader && props.popType === 'add-e' && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                BACK
                            </button>                    
                            <button className="ui green button" onClick={props.saveEmployeeDetails}>
                                ADD EMPLOYEE
                            </button>
                        </div>
                    }
                    { 
                        props.confirmationLoader && 
                        <div>
                            <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                        </div>
                    } 
                </div>
            </React.Fragment>
        );               
}
 
export default ProfileDetails;