import React from 'react';
import cities from '../../Constants/cities.constants';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import Select from 'react-select';
import './Profile.css';

const customStyles = {
    menu: (provided) => ({
        ...provided,
        zIndex:'55'
    }),
}

function BusinessDetails(props) {
      return(
            <React.Fragment>
                <div className="senderId-modal--wrapper pad">
                    {
                        !props.isBusinessEdit && props.businessInfo &&
                        <div className="flex flex-wrap businessView">
                            <div className="col-6 margin-right--half">
                                <div className="content">
                                    <div className="header">Company Name</div>
                                    <div className="meta">{props.businessInfo.name}</div>
                                </div>
                            </div>
                            <div className="col-6 margin-right--half">
                                <div className="content">
                                    <div className="header">Website</div>
                                    <div className="meta">{props.businessInfo.website}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="content">
                                    <div className="header">Logo</div>
                                    <div className="meta">{props.businessInfo.logo}</div>
                                </div>
                            </div>
                            <div className="col-15 margin-top">
                                <div className="content">
                                    <div className="header">Address</div>
                                    <div className="meta">{props.businessInfo.address}</div>
                                </div>
                            </div>
                            <div className="col-8 margin-right--half margin-top">
                                <div className="content">
                                    <div className="header">Landmark</div>
                                    <div className="meta">{props.businessInfo.landmark}</div>
                                </div>
                            </div>
                            <div className="col-5 margin-top">
                                <div className="content">
                                    <div className="header">Locality</div>
                                    <div className="meta">{props.businessInfo.locality}</div>
                                </div>
                            </div>
                            <div className="col-4 margin-left--half margin-top">
                                <div className="content">
                                    <div className="header">City/Town</div>
                                    <div className="meta">{props.businessInfo.city}</div>
                                </div>
                            </div>
                            <div className="col-5 margin-right--half margin-top">
                                <div className="content">
                                    <div className="header">State</div>
                                    <div className="meta">{props.businessInfo.state && props.businessInfo.state.value}</div>
                                </div>
                            </div>   
                            <div className="col-5 margin-top">
                                <div className="content">
                                    <div className="header">Pincode</div>
                                    <div className="meta">{props.businessInfo.pincode}</div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        props.isBusinessEdit && props.businessInfo &&
                        <React.Fragment>
                            <div className="align-space-between col-20 flex flex--wrap flex-direction--row">
                                <div className="col-6">
                                    <label className="label col-5">Company Name</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="name"
                                        value={props.businessInfo.name} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="Company's name"/>
                                </div>
                                <div className="col-6">
                                    <label className="label col-5">Website</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="website"
                                        value={props.businessInfo.website} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="Company's website"/>
                                </div>
                                <div className="col-6">
                                    <label className="label col-5">Logo</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="logo"
                                        value={props.businessInfo.logo} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="Company's logo"/>
                                </div>
                            </div>
                            <div className="align-space-between col-20 flex flex--wrap flex-direction--row margin-top">
                                <div className="col-14">
                                    <label className="label col-5">Address</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="address"
                                        value={props.businessInfo.address} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="House/Street/Gali No.."/>
                                </div>
                                <div className="col-5 margin-left--half">
                                    <label className="label col-5">Landmark</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="landmark"
                                        value={props.businessInfo.landmark} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="Landmark..."/>
                                </div>                
                            </div>
                            <div className="align-space-between col-20 flex flex--wrap flex-direction--row flex-horz-center margin-top">                
                                <div className="col-9">
                                    <label className="label col-5">Locality</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="locality"
                                        value={props.businessInfo.locality} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="Locality..."/>
                                </div>
                                <div className="col-10">
                                    <label className="label col-5">City/Town</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="city"
                                        value={props.businessInfo.city} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="City/Town"/>
                                </div>
                            </div>
                            <div className="align-space-between col-20 flex flex--wrap flex-direction--row margin-top">
                                <div className="col-9">
                                    <label className="label col-5">State</label>
                                    <Select
                                        styles={customStyles}
                                        isClearable={true}
                                        isRtl={false}
                                        isSearchable={true}
                                        name="state"
                                        value={props.businessInfo.state}
                                        onChange={props.handleChange}
                                        options={cities}
                                    />
                                </div>
                                <div className="col-10 margin-left">
                                    <label className="label col-5">Pincode</label>
                                    <input type="text" 
                                        className="form-control col-20" 
                                        name="pincode"
                                        value={props.businessInfo.pincode} 
                                        onChange={props.bChangeHandler}  
                                        placeholder="Enter Pincode"/>
                                </div>                
                            </div>
                        </React.Fragment>
                    }
                </div>
                <div className="dialog-footer pad">   
                    {
                        !props.confirmationLoader && !props.isBusinessEdit && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                    BACK
                            </button>                    
                            <button className="anchor-btn margin-left--half dialog--cta pointer" onClick={props.changeViewToEditBusiness}>
                                EDIT DETAILS
                            </button>
                        </div>
                    }
                    {
                        !props.confirmationLoader && props.isBusinessEdit && 
                        <div>
                            <button className="ui button" onClick={props.closePopup}>
                                    BACK
                            </button>                    
                            <button className="ui green button" onClick={props.saveBusinessDetails}>
                                SAVE CHANGES
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
 
export default BusinessDetails;