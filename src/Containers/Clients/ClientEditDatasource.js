import React from 'react';

export default function ClientEditDatasource(props){
    return(
        <React.Fragment>
                <div className="senderId-modal--wrapper overflowX-auto">                       
                    <div className="col-9">
                        <div className="label">Medium</div>
                        <input  type="text"
                                className="form-control"
                                name="medium"
                                value={props.formControls.mName.value} 
                                readOnly>
                        </input>
                    </div>
                    <div className="col-9 margin-left--auto">
                        <div className="label">DataSource</div>
                        <input  type="text"
                                className="form-control"
                                name="datasource"
                                value={props.formControls.dName.value} 
                                readOnly>
                        </input>
                    </div>
                    <div className="col-9 margin-top">
                        <div className="label">Billing On</div>
                        <select className="form-control" 
                                name="billingOn"
                                value={props.formControls.billingOn.value} 
                                onChange={props.changeHandler}>                                  
                                <option defaultValue >-choose-</option>
                                <option key="1" value="SENT">Sent</option>
                                <option key="2" value="DELIVERED">Delivered</option>
                        </select>
                    </div> 
                    <div className="col-9 margin-left--auto margin-top">
                        <div className="label">Billing Credit Type</div>
                        <select className="form-control" 
                                name="bct"
                                disabled={props.isBctDisabled}
                                value={props.formControls.bct.value} 
                                onChange={props.changeHandler}>                                  
                                <option defaultValue >-choose-</option>
                                <option key="1" value="basic">Basic</option>
                                <option key="2" value="premium">Premium</option>
                        </select>
                    </div>
                    <div className="col-9 margin-top">
                        <div className="label">Price Per Credit</div>
                        <input  type="text"
                                className="form-control"
                                name="pricePrCrdt"
                                value={props.formControls.pricePrCrdt.value} 
                                onChange={props.changeHandler} >
                        </input>
                        {
                            props.formControls.pricePrCrdt.error &&
                            <span className="form-error">{props.formControls.pricePrCrdt.error}</span>
                        }
                    </div>
                    {
                        props.source === "Agency" &&
                        <React.Fragment>
                            <div className="col-9 margin-left--auto margin-top">
                                <div className="label">Cost Or Share</div>
                                <input  type="number"
                                        className="form-control"
                                        name="cos"
                                        value={props.formControls.cos.value} 
                                        onChange={props.changeHandler} >
                                </input>
                            </div>
                            <div className="col-9 margin-top">
                                <div className="label">Sharing Type</div>
                                <select className="form-control"
                                    name="sType"
                                    value={props.formControls.sType.value} 
                                    onChange={props.changeHandler}>                                               
                                    <option value="" hidden>-SELECT-</option>
                                    <option value="PER">Percentage</option>
                                    <option value="C2B">Cost To Business</option>
                                </select>
                            </div>
                            <div className="col-9 margin-left--auto margin-top">
                                <div className="label">Min Price</div>
                                <input  type="number"
                                        className="form-control"
                                        name="mp"
                                        value={props.formControls.mp.value} 
                                        onChange={props.changeHandler} >
                                </input>
                            </div>
                        </React.Fragment>
                    }
                    {
                        props.formControls.cos.error &&
                        <div className="col-20 margin-top margin-btm--half text--center form-error">{props.formControls.cos.error}</div>
                    }
                    <div className="dialog-footer pad col-20 margin-top">   
                            {     !props.saveDataSourceLoader &&
                                <div>
                                        <button className="btn btn-fill dialog--cta pointer" 
                                        onClick={()=>props.closeAction()}>
                                            Back
                                        </button>                      
                                        <button  onClick={()=> props.submitData()} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Save Changes</button>
                                </div>      
                            }
                            {/*
                                props.saveDataSourceLoader &&
                                <div>
                                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                </div>
                            */}
                    </div>  
                </div>
        </React.Fragment>
    );
}