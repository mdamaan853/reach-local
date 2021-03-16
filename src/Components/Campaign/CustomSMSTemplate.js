import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';



export default function CustomSMSTemplate (props){

    const style = {
        borderRadius: 0,
        opacity: 0.85,
        padding: '1em',
        
    } 
    return(
        <React.Fragment>
        <article className="flex flex-direction--row">
            <div className="padding-all-12 col-9">
                <div className="label">Please select the required SMS Type</div>
                <label for="smsRadio" className="radioBtn">
                    <input type="radio" name="SMStype" checked={props.formControls.SMStype.value === "simpleSMS"} 
                    value="simpleSMS" id="smsRadio" 
                    onChange={props.changeHandler}/>Simple SMS
                    <span className="checkmark1"></span>
                </label>
                <label for="customSms" className="radioBtn">
                    <input type="radio" name="SMStype" checked={props.formControls.SMStype.value === "customSMS"} 
                    id="customSms" value="customSMS" onChange={props.changeHandler} onClick={props.loadData}
                    disabled ={(props.formControls.audienceGrId.value || props.audienceGrId) ? false: true}/>Custom SMS&nbsp; 
                {
                    props.display !== "none" &&
                    <Popup
                        trigger={<Icon name='info circle' color="blue" style={{fontSize:"0.8em", verticalAlign: 'super'}}/>}
                        content='To Send Custom SMS, First Select Audience Group/Upload Audience'
                        position='top center'
                        style={style}
                        inverted
                    />
                }
                    <span className="checkmark1"></span>
                </label>
            </div>         
            <div className="col-9 margin-left--auto padding-all-12">
                <div className="label">Language</div>
                <select name="language" className="form-control" style={{width:'90%'}} value={props.formControls.language.value} onChange={props.langChangeHandle}> 
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="gu">Gujarati</option>
                    <option value="bn">Bengali</option>
                    <option value="mr">Marathi</option>
                    <option value="kn">Kannada</option>
                    <option value="ta">Tamil</option>
                </select>
                {
                    props.formControls.language.error &&
                    <span className="form-error">{props.formControls.language.error}</span>
                }
            </div>   
        </article>
       
       {
           props.formControls.SMStype.value === "simpleSMS" &&
           <div className="col-20 padding-all-12">
           <div className="ui segment" style={{border: '1.2px solid rgba(0,0,0,0.1)'}}>
                   <div className="ui stackable very relaxed two column grid">
                           <div className="middle aligned column">
                               <div className="padding-all-12">
                                   <div className="label">Choose SMS template</div>
                                   <select name="template" className="form-control" value={props.formControls.template.value} onChange={props.smsChangeHandler}>
                                       <option defaultValue >-Choose-</option>
                                       {
                                            props.templates && props.templates.map((item,index)=>{
                                                return(
                                                        <option key={index} value={item.smsTemplateId}>{item.name}</option>
                                                );
                                            })
                                       }
                                   </select>
                               </div>
                               <div className="padding-all-12">       
                                               <div className="label">Please enter URL</div>
                                           <div className="flex flex-direction--row">
                                               <input className="form-control margin-right--half" type="text" name="longurl" style={{width:'70%'}}
                                                   onChange={props.changeHandler} value={props.formControls.longurl.value}/>
       
                                               <button className="ui blue button" 
                                                   onClick={props.addURL}>ADD URL</button> 
                                           </div>                    
                                   
                                   {
                                       props.formControls.template.error &&
                                       <span className="form-error">{props.formControls.template.error}</span>
                                   }
                               </div>                         
                           </div>
                           <div className="column">
                                   <div className="label">Template Content&nbsp;
                               
                                  
                                   <Popup
                                       trigger={<Icon name='info circle' color="blue"/>}
                                       content='It is advised to keep the message length to 160 characters and below for effective performance.'
                                       position='top center'
                                       style={style}
                                       inverted
                                   />
                               
                                   </div>
                                   <textarea className="form-control" 
                                               name="templateCont" 
                                               maxLength={props.formControls.language.value === "en" ? '300' : '120'}
                                               value={props.formControls.templateCont.value}
                                               onChange={props.contentHandler} style={{height:'85px',resize:'none'}}/>
                                   <div className="margin-top--half text-light text-small"> 
                                       Total <span className="text--darker text--bold">{props.messageNum}</span> {props.messageNum > 1 ? 'messages' : 'message'}, <span className="text--darker text--bold">{props.formControls.templateCont.value.length}</span> characters {props.formControls.language.value === "en" ? '(Max limit 300 characters)' : '(Max limit 120 characters)'}
                                   </div>
                                   {
                                       props.formControls.templateCont.value &&
                                       <div className="margin-top">
                                            <button className="ui green tiny button" style={{display:`${props.displayTestSMS}`}} onClick={()=>props.canTestSms()}>Send Test SMS</button>
                                       </div>
                                   }   
                                   {
                                       props.formControls.templateCont.error &&
                                       <span className="form-error">{props.formControls.templateCont.error}</span>
                                   }
                            
                                    <div style={{paddingTop:'12px',display:`${props.display}`}}>
                                        <label for="shorturl" className="label">Schedule Now</label>
                                        <input onChange={props.checkedHandler.bind(this)}  
                                        id="shorturl" name="scheduleNow" checked={props.formControls.scheduleNow.value} type="checkbox"/>                                 
                                    </div>      
                           </div>
                   </div>
                   <div className="ui vertical divider">Or</div>
           </div>
        </div> 
       } 
       {
           (props.formControls.audienceGrId.value || props.audienceGrId) && 
           props.formControls.SMStype.value === "customSMS" &&
           <div className="col-20 padding-all-12">
               <div className="ui segment" style={{border: '1.2px solid rgba(0,0,0,0.1)'}}>
                   <div className="ui stackable very relaxed two column grid">
                           <div className="middle aligned column">
                               <div className="padding-all-12">
                                   <div className="label">Column List&nbsp;
                                   <Popup
                                       trigger={<Icon name='info circle' color="blue" style={{verticalAlign: 'super'}}/>}
                                       content='Select field/data from the column list.'
                                       position='top center'
                                       style={style}
                                       inverted
                                   />
                                   </div>
                                   
                                   <select className="form-control" name="colmnElement" style={{height:'auto'}}
                                    onChange={props.changeHandler} multiple>
                                   {
                                       props.audienceData && props.audienceData.map((item)=>{
                                           return(
                                               <option value={item}>{item}</option>
                                           );
                                       })
                                   } 
                                   </select> 
                               </div>            
                               <div className="padding-all-12">
                                    
                                    <React.Fragment>  
                                        <div className="label">Please enter URL</div>
                                        <div className="flex flex-direction--row">
                                            <input className="form-control margin-right--half" type="text" name="longurl" style={{width:'70%'}}
                                                onChange={props.changeHandler} value={props.formControls.longurl.value}/>
    
                                            <button className="ui blue button"
                                                onClick={props.addURL}>ADD URL</button> 
                                        </div>
                                    </React.Fragment>                       
                                   
                               </div>          
                           </div>
                           <div className="column">
                                   <div className="label">Template Content&nbsp;
                                       <Popup
                                           trigger={<Icon name='info circle' color="blue" style={{verticalAlign: 'super'}}/>}
                                           content='It is advised to keep the message length to 160 characters and below for effective performance.'
                                           position='top center'
                                           style={style}
                                           inverted
                                       />
                                   </div>
                                   <textarea className="form-control" 
                                       name="templateCont" 
                                       maxLength={props.formControls.language.value === "en" ? '300' : '120'}
                                       value={props.formControls.templateCont.value}
                                       onChange={props.contentHandler} style={{height:'85px',resize:'none'}}/>
                                   <div className="margin-top--half text-light text-small">
                                       Total <span className="text--darker text--bold">{props.messageNum}</span> {props.messageNum > 1 ? 'messages' : 'message'}, <span className="text--darker text--bold">{props.formControls.templateCont.value.length}</span> characters {props.formControls.language.value === "en" ? '(Max limit 300 characters)' : '(Max limit 120 characters)'}
                                   </div>
                                   {
                                       props.formControls.templateCont.value &&
                                       <div className="margin-top">
                                               <button className="ui green tiny button" onClick={()=>props.canTestSms()}>Send Test SMS</button>
                                       </div>
                                   }   
                                   {
                                       props.formControls.templateCont.error &&
                                       <span className="form-error">{props.formControls.templateCont.error}</span>
                                   }

                                    <div style={{paddingTop:'12px', display:`${props.display}`}}>
                                        <label for="shorturl" className="label">Schedule Now</label>
                                        <input onChange={props.checkedHandler.bind(this)} id="shorturl" name="scheduleNow" checked={props.formControls.scheduleNow.value} type="checkbox"/>                                 
                                    </div>
                                    
                           </div>
                   </div>
                   <div className="ui vertical divider"><button className="btn btn-fill btn-green" onClick={props.clickHandler} style={{fontWeight:'bold'}}>Add</button></div>
               </div>
           </div>
       }
    </React.Fragment>
    )
}

