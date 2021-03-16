import React from 'react';

export default function SMSProMobile(props){
    return(
        <div className="column pad">
        <div className="col-10 margin-top--half margin-btm--half">
              <div className="label">Audience Group Name</div>
              <input type="text" 
                     className="form-control" 
                     name="audienceGrName" 
                     placeholder="Enter Group Name.."
                     value={props.formControls.audienceGrName.value}
                     onChange={props.changeHandler}
                     style={{width:'178%'}} 
                     />
                    
        </div>
        <div className="label">Mobile Number</div> 
        
        <textarea className="form-control" 
                          name="mobileList" 
                          placeholder="Please place comma after each 10 digit mobile number and please don't precede with country code.."
                          type="number"
                          onClick={props.showBtn}
                          onChange={props.changeHandler} 
                          style={{height:'85px',width:'90%',resize:'none'}}/>       
          
             
        {
            props.inValidNum.length !==0 && 
            <React.Fragment>
                <div className="form-error">Invalid Number {props.inValidNum} is going to ignore</div>    
            </React.Fragment>
        }
        {
            !props.showAudience && props.errorMsg &&
            <React.Fragment>
                <div className="form-error">{props.errorMsg}</div>    
            </React.Fragment>
        }
                                     
  </div>
    );
}