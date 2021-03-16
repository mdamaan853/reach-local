import React from 'react';
import DatePicker from "react-datepicker";
import { Icon, Popup } from 'semantic-ui-react';
import path from '../../Constants/img/sender-id-img.png';
import utils from '../../Services/utility-service';
import GenericWhatsApp from './GenericWhatsApp/GenericWhatsApp';
import WhatsAppDP from './GenericWhatsApp/WhatsAppDP';

const style = {
       borderRadius: 0,
       opacity: 0.85,
       padding: '1em',
}

export default function CeareNewCampaignProcess(props){
    let d = new Date();
    if(d.getHours() >= 16){
       d.setDate(d.getDate() + 1);
    }

    return(
                <div className="card-custom col-20 pad--half flex flex-direction--row flex-wrap">    
                     {
                            parseInt(props.formControls.medium.value) !== 8 &&
                        <div className="col-9 padding-all-12">
                               <div className="label">Select Your Sender Id&nbsp;
                                   <Popup
                                          trigger={<Icon name='info circle' color="blue"/>}
                                          position='right center'
                                          style={style}
                                          inverted
                                          flowing 
                                          hoverable
                                   >
                                   <Popup.Content>
                                          <img src={path} alt="sender id sample"/>
                                   </Popup.Content>
                                   </Popup></div>
                               <select className="form-control" name="senderId" value={props.formControls.senderId.value} onChange={props.changeHandler}>                                  
                                     <option defaultValue hidden >-Select Sender Id-</option>
                                     {
                                          props.senderIds.map((item,index)=>{
                                                   return(
                                                        <option key={index} value={item.id}>{item.senderCode}</option>
                                                   );
                                          })
                                     }                          
                               </select>
                               {
                                   props.formControls.senderId.error &&
                                   <span className="form-error">{props.formControls.senderId.error}</span>
                               }
                        </div>
                     }
                        {   props.formControls && props.formControls.medium && props.formControls.medium.value && parseInt(props.formControls.medium.value) === 8 && 
                               <WhatsAppDP  
                                   handleUpload={props.handleUpload}
                                   handleImageUpload = {props.handleImageUpload}
                                   toggleLoader={props.toggleLoader}
                               />
                        }
                        
                        <div className="col-9 margin-left--auto padding-all-12 ">
                               <div className="label">Campaign Name</div>
                               <input  type="text"
                                       className="form-control"
                                       name="campaignName"
                                       value={props.formControls.campaignName.value}
                                       onChange={props.changeHandler}
                                        >
                               </input>
                               {
                                   props.formControls.campaignName.error &&
                                   <span className="form-error">{props.formControls.campaignName.error}</span>
                               }
                        </div>
                        {
                               props.type === "GENERIC" &&
                                   <div className="col-9 padding-all-12">
                                          <div className="label">Target Audience Count</div>
                                          <input  type="number"
                                                 className="form-control"
                                                 name="targetAudienceCount"
                                                 value={props.formControls.targetAudienceCount.value}
                                                 onChange={props.changeHandler}>
                                          </input>
                                          {
                                                 props.formControls.targetAudienceCount.error &&
                                                 <span className="form-error">{props.formControls.targetAudienceCount.error}</span>
                                          }
                                          {
                                                 props.minCount && !props.formControls.targetAudienceCount.error &&
                                                 <div className="padding-top--half" style={{fontSize:'12px'}}>Target Audience Count can not be less than {props.minCount}</div>
                                          }
                                   </div>    
                        } 
                        {
                               props.type === "LEAD" &&
                               <div className="col-9 padding-all-12">
                                   <div className="label">Choose Status Group</div>
                                   <select className="form-control" name="senderId" value={props.formControls.statusGrp.value} onChange={props.changeHandler}>                                  
                                          <option defaultValue hidden >-Select Status Group-</option>
                                          {
                                                 props.statusGroups.map((item,index)=>{
                                                        return(
                                                               <option key={index} value={item.id}>{item.statusGroup}</option>
                                                        );
                                                 })
                                          }                          
                                   </select>
                                   {
                                          props.formControls.statusGrp.error &&
                                          <span className="form-error">{props.formControls.senderId.error}</span>
                                   }
                               </div>
                        } 
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
                       {
                            props.type === 'LEAD' &&
                            <div className="col-20 padding-all-12">
                                   {
                                          !props.formControls.ccid.value &&
                                          <button onClick={()=>props.getCustomId()} className={`ui ${props.formControls.ccid.loading ? 'loading' : 'icon right labeled'} primary button`}><i aria-hidden="true" className="plus icon"></i>Create Custom Campaign Id</button>                
                                   }
                                   {
                                          !!props.formControls.ccid.value &&
                                          <div>
                                                 <span class="label" style={{fontSize:'14px'}}>Custom Campaign Id:&nbsp;</span>
                                                 <span class="text--bold text-intent" style={{fontSize:'18px'}}>{props.formControls.ccid.value}</span>
                                          </div>
                                   }
                            </div>
                       }    
                       <div className="col-20 padding-all-12">
                                <div className="label">Campaign Description</div>
                                <textarea className="form-control" 
                                          name="campaignDescription" 
                                          maxLength="400"
                                          value={props.formControls.campaignDescription.value}
                                          onChange={props.changeHandler} style={{height:'85px',resize:'none'}}/>   
                                 {
                                   props.formControls.campaignDescription.error &&
                                   <span className="form-error">{props.formControls.campaignDescription.error}</span>
                                 }                
                       </div>
                       {/* {
                          parseInt(props.formControls.medium.value) === 8 &&  
                          <GenericWhatsApp 
                                   handleUpload={props.handleUpload} 
                                   shortUrlLoader={props.shortUrlLoader} 
                                   mediaType = {props.mediaType} 
                                   templateWhatsApp={props.templateWhatsApp} 
                                   handleImageUpload = {props.handleImageUpload} 
                                   formControls={props.formControls}
                                   createShortUrl={props.createShortUrl} 
                                   shortUrlLoader={props.shortUrlLoader}
                                   shortUrl={props.shortUrl}
                                   copyUrl={props.copyUrl}
                                   changeHandler={props.changeHandler}/>  
                       } */}
                       {
                           parseInt(props.formControls.medium.value) !== 8 && 
                           <div className="col-20 padding-all-12">
                                   <div className="ui segment" style={{border:'none'}}>
                                          <div className="ui stackable very relaxed two column grid">
                                                 <div className="middle aligned column">
                                                        <div className="label">Choose SMS template</div>
                                                        <select name="template" className="form-control" value={props.formControls.template.value} onChange={props.smsChangeHandler}>
                                                               <option defaultValue >-Choose-</option>
                                                               {
                                                                      props.templates.map((item,index)=>{
                                                                             return(
                                                                                    <option key={index} value={item.smsTemplateId} >{item.name}</option>
                                                                             );
                                                                      })
                                                               }
                                                        </select>
                                                        {
                                                               props.formControls.template.error &&
                                                               <span className="form-error">{props.formControls.template.error}</span>
                                                        }
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
                                                                      disabled={(props.type === "LEAD")} 
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
                                                 </div>
                                          </div>
                                          <div className="ui vertical divider">{props.type === "LEAD" ? '' : 'Or'}</div>
                                   </div>
                            </div>    
                     }
    
                        {
                               props.type === "GENERIC" &&
                               <React.Fragment>
                                   {
                                   parseInt(props.formControls.medium.value) !== 8 && 
                                      <div className="col-20 padding-all-12">
                                          <div className="flex" style={{alignItems:'end'}}>
                                                 <div className="col-9">
                                                        <div className="label">Url Shortner / Tracker&nbsp;
                                                               <Popup
                                                                      trigger={<Icon name='info circle' color="blue"/>}
                                                                      content='URL shortner will help you to track the number of clicks on the link.'
                                                                      position='top center'
                                                                      style={style}
                                                                      inverted
                                                               /></div>
                                                        <div className="ui action input" style={{width:'100%'}}>
                                                               <input  type="text"
                                                                      name="su"
                                                                      value={props.formControls.su.value}
                                                                      onChange={props.changeHandler}>
                                                               </input>
                                                               <button onClick={()=> props.createShortUrl()} className="ui green button">
                                                                      {!props.shortUrlLoader ? 'Create' : <i aria-hidden="true" class="spinner icon"></i>}
                                                               </button>
                                                        </div>
                                                        {
                                                               props.formControls.su.error &&
                                                               <div className="form-error form-error margin-top--quar">{props.formControls.su.error}</div>
                                                        }
                                                 </div>
                                          </div>
                                          {
                                                 props.shortUrl &&
                                                 <div className="padding-top--half" style={{fontSize:'smaller'}}>Short Url: <span className="margin-right" style={{color:'-webkit-link'}}>{props.shortUrl}</span> 
                                                        <button class="ui teal icon right labeled tiny button" onClick={() => props.copyUrl()}>
                                                               <i aria-hidden="true" class="copy icon"></i>Copy
                                                        </button>
                                                 </div>
                                          }
                                   </div>
                                   }
                                      <div className="col-9 padding-all-12">
                                          <div className="label">Schedule Date &nbsp;
                                                 <Popup
                                                        trigger={<Icon name='info circle' color="blue"/>}
                                                        content='The date on which the campaign needs to be executed.'
                                                        position='top center'
                                                        style={style}
                                                        inverted
                                                 /></div>
                                          <DatePicker
                                          selected={props.formControls.date.value}
                                          placeholderText="Click to select Date"
                                          minDate={d}
                                          onChange={props.dobChange}
                                          peekNextMonth
                                          showMonthDropdown
                                          showYearDropdown
                                          dropdownMode="select"
                                          className="col-20"
                                          name="date"
                                          />
                                          {
                                                 props.formControls.date.error &&
                                                 <span className="form-error">{props.formControls.date.error}</span>
                                          }
                                   </div>  
                                   <div className="col-9 margin-left--auto padding-all-12 ">
                                          <div className="label">Schedule Time&nbsp;
                                                 <Popup
                                                        trigger={<Icon name='info circle' color="blue"/>}
                                                        content='The time at which the campaign needs to be executed.'
                                                        position='top center'
                                                        style={style}
                                                        inverted
                                                 /></div>
                                          <select name="time" className="form-control" required="" value={props.formControls.time.value} onChange={props.changeHandler}>
                                                 <option value="" defaultValue hidden>Select Time</option>
                                                 <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                                 <option value="11:00 AM - 13:00 PM">11:00 AM - 13:00 PM</option>
                                                 <option value="13:00 PM - 15:00 PM">13:00 PM - 15:00 PM</option>
                                                 <option value="15:00 PM - 17:00 PM">15:00 PM - 17:00 PM</option>
                                                 <option value="17:00 PM - 19:00 PM">17:00 PM - 19:00 PM</option>
                                                 <option value="19:00 PM - 21:00 PM">19:00 PM - 21:00 PM</option>
                                          </select>
                                          {
                                                 props.formControls.time.error &&
                                                 <span className="form-error">{props.formControls.time.error}</span>
                                          }
                                   </div>
                                   {
                          parseInt(props.formControls.medium.value) === 8 &&  
                          <GenericWhatsApp 
                                   handleUpload={props.handleUpload} 
                                   mediaType = {props.mediaType} 
                                   templateWhatsApp={props.templateWhatsApp} 
                                   handleImageUpload = {props.handleImageUpload} 
                                   formControls={props.formControls}
                                   createShortUrl={props.createShortUrl} 
                                   shortUrlLoader={props.shortUrlLoader}
                                   shortUrl={props.shortUrl}
                                   copyUrl={props.copyUrl}
                                   changeHandler={props.changeHandler}/>  
                       }
                               </React.Fragment>
                        }
                        {
                               props.type === "LEAD" &&
                               <React.Fragment>
                                      <div className="col-9 padding-all-12">
                                          <div className="label">Campaign Url</div>
                                          <input  type="text"
                                                 className="form-control"
                                                 name="campaignUrl"
                                                 value={props.formControls.campaignUrl.value}
                                                 onChange={props.changeHandler}>
                                          </input>
                                          {
                                                 props.formControls.campaignUrl.error &&
                                                 <span className="form-error">{props.formControls.campaignUrl.error}</span>
                                          }
                                     </div>
                                     <div className="col-9 margin-left--auto padding-all-12 ">
                                          <div className="label">End Point</div>
                                          <input  type="text"
                                                 className="form-control"
                                                 name="endPoint"
                                                 value={props.formControls.endPoint.value}
                                                 onChange={props.changeHandler}
                                                 >
                                          </input>
                                          {
                                                 props.formControls.endPoint.error &&
                                                 <span className="form-error">{props.formControls.endPoint.error}</span>
                                          }
                                   </div>
                                   <div className="col-9 padding-all-12">
                                          <div className="label">Default Params</div>
                                          <input  type="text"
                                                 className="form-control"
                                                 name="defaultParams"
                                                 value={props.formControls.defaultParams.value}
                                                 onChange={props.changeHandler}>
                                          </input>
                                          {
                                                 props.formControls.defaultParams.error &&
                                                 <span className="form-error">{props.formControls.defaultParams.error}</span>
                                          }
                                     </div>
                                     <div className="col-9 margin-left--auto padding-all-12 ">
                                          {/* <div className="label">Lead Push Class</div>
                                          <input  type="text"
                                                 className="form-control"
                                                 name="leadPushClass"
                                                 value={props.formControls.leadPushClass.value}
                                                 onChange={props.changeHandler}
                                                 >
                                          </input>
                                          {
                                                 props.formControls.leadPushClass.error &&
                                                 <span className="form-error">{props.formControls.leadPushClass.error}</span>
                                          } */}
                                   </div>
                                   <div className="col-9 padding-all-12">
                                          <div className="label">Duplicacy Check Days</div>
                                          <input  type="number"
                                                 className="form-control"
                                                 name="duplicacyCheckDays"
                                                 value={props.formControls.duplicacyCheckDays.value}
                                                 onChange={props.changeHandler}>
                                          </input>
                                          {
                                                 props.formControls.duplicacyCheckDays.error &&
                                                 <span className="form-error">{props.formControls.duplicacyCheckDays.error}</span>
                                          }
                                     </div>
                                     <div className="col-9 margin-left--auto padding-all-12 ">
                                          <div className="label">Header Params</div>
                                          <input  type="text"
                                                 className="form-control"
                                                 name="headerParams"
                                                 value={props.formControls.headerParams.value}
                                                 onChange={props.changeHandler}
                                                 >
                                          </input>
                                          {
                                                 props.formControls.headerParams.error &&
                                                 <span className="form-error">{props.formControls.headerParams.error}</span>
                                          }
                                   </div>
                                   {
                                          utils.isAdmin &&
                                          <React.Fragment>
                                                 <div className="col-9 padding-all-12">
                                                        <div className="label">Push Exclude Params</div>
                                                        <input  type="text"
                                                               className="form-control"
                                                               name="pushExcludeParams"
                                                               value={props.formControls.pushExcludeParams.value}
                                                               onChange={props.changeHandler}>
                                                        </input>
                                                        {
                                                               props.formControls.pushExcludeParams.error &&
                                                               <span className="form-error">{props.formControls.pushExcludeParams.error}</span>
                                                        }
                                                 </div>
                                                 <div className="col-9 margin-left--auto padding-all-12 ">
                                                        <div className="label">Push Include Params</div>
                                                        <input  type="text"
                                                               className="form-control"
                                                               name="pushIncludeParams"
                                                               value={props.formControls.pushIncludeParams.value}
                                                               onChange={props.changeHandler}
                                                               >
                                                        </input>
                                                        {
                                                               props.formControls.pushIncludeParams.error &&
                                                               <span className="form-error">{props.formControls.pushIncludeParams.error}</span>
                                                        }
                                                 </div>
                                          </React.Fragment>
                                   }
                               </React.Fragment>
                        }
                </div> 
        );
    }            
              