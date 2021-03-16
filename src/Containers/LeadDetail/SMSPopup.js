import React from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import utils from '../../Services/utility-service';

export default function SMSPopup(props){
   
        return(
            <article>
                <div className="senderId-modal--wrapper pad">  
                    <div className="field margin-right--auto margin-left--auto">
                        <label className="label">SMS Templates</label>
                        <select 
                            onChange={props.handleChange}
                            className="form-control col-20">
                            <option>--Choose Templates--</option>
                            {
                                props.smsTemplates && props.smsTemplates.map((item,index) =>{
                                    return(
                                        <React.Fragment>
                                            {/* <option key={index} value={item.smsTemplateId}>{item.smsTemplateId ? item.name:null}</option>  
                                                                                  */}
                                            <option key={index} value={item.smsTemplateId}>{item.name}</option>
                                        </React.Fragment>                
                                    );
                                })
                            }
                        </select>
                        {
                            props.specificTemplates &&
                            <div className="col-20 pad--half">
                                <textarea rows="5" cols={`${utils.isMobile ? "30" :"40" }`} value={props.specificTemplates} onChange={props.smsContentChanegHandler}>{props.specificTemplates}</textarea> 
                            </div>                
                        }
                    </div>              
                </div>
                <div className="dialog-footer pad">   
                    {
                        !props.confirmationLoader && 
                        <div>
                            <button className="btn btn-fill dialog--cta pointer" onClick={props.toggleSMS}>
                                    BACK
                            </button>                    
                            <button className="btn btn-fill btn-success margin-left--half dialog--cta pointer" onClick={props.sendMessage}>SEND</button>
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
        );
    
}