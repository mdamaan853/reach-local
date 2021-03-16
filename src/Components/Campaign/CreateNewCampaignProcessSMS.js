import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import path from '../../Constants/img/sender-id-img.png';

import './Campaign.css';

const style = {
    borderRadius: 0,
    opacity: 0.85,
    padding: '1em',
}

export default function CreateNewCampaignProcessSMS (props){
    return(
        <article className="card-custom col-20 pad--half flex flex-direction--row flex-wrap">
               <div className="col-9 padding-all-12">
                        <div className="label">Select Your Sender Id&nbsp;
                            <Popup
                                    trigger={<Icon name='info circle' color="blue" style={{verticalAlign: 'super'}}/>}
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
            
            {/* <div className="col-9 padding-all-12">
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
            </div> */}
            {/* <div className="col-9 margin-left--auto padding-all-12">
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
            </div>    */}
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
        </article>      
    );
}