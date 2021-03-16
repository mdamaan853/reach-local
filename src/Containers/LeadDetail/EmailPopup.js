import React from 'react';
import utils from '../../Services/utility-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';

export default function EmailPopup (props){
    return(
    <article>
        <div className="popUp-modal--wrapper pad">  
            <div className="margin-right--auto margin-left--auto">
                <div className="margin-btm">
                    <label className="label">EMAIL Templates</label>
                    <select 
                        onChange={props.handleChange}
                        className="form-control col-20">
                        <option>--Choose Templates--</option>
                        {
                            props.emailTemplates && props.emailTemplates.map((item,index) =>{
                                return(
                                    <React.Fragment>
                                        <option key={index} value={item.templateId}>{item.name}</option>
                                    </React.Fragment>                
                                );
                            })
                        }
                    </select>
                </div>
                {
                   !!props.specificTemplates &&
                    <React.Fragment>
                    <div className="col-20">
                        <div className="label">To</div>
                        <input type="text" 
                            className="form-control" 
                            style={{width:"100%"}} 
                            name="to"
                            onChange={props.handleChangeEmail}
                            value={props.specificTemplates.to}
                            placeholder="Please enter a valid email"/>
                    </div>
                    <div className="col-20">
                        <div className="label">Subject</div>
                        <input type="text"
                            className="form-control"
                            style={{width:"100%"}} 
                            name="subjectTemplate"
                            onChange={props.handleChangeEmail}
                            value={props.specificTemplates.subjectTemplate}
                            placeholder="Subject" required />
                    </div>
                    <div className="col-20">
                        <div className="label">Body</div>
                        <textarea rows="10" cols={`${utils.isMobile ? "26" :"65" }`} value={props.specificTemplates.bodyTemplate} 
                            name="bodyTemplate"
                            onChange={props.handleChangeEmail}
                            >{props.specificTemplates.bodyTemplate}</textarea>
                    </div>  
                    {
                       !!props.specificTemplates && !!props.specificTemplates.error &&
                        <div style={{color:"red"}}>{props.specificTemplates.error}</div>
                    }     
                    </React.Fragment>                
                }
            </div>              
        </div>
        <div className="dialog-footer pad">   
            {
                !props.confirmationLoader && 
                <div>
                    <button className="btn btn-fill dialog--cta pointer" onClick={props.toggleEmail}>
                            BACK
                    </button>                    
                    <button className="btn btn-fill btn-success margin-left--half dialog--cta pointer" onClick={props.sendEmail}>SEND</button>
                </div>
            }
            { 
                props.confirmationLoader && 
                <div>
                    <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                </div>
            } 
        </div>      
    </article>
    )
}