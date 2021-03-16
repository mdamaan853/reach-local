import React from 'react';
import Select from 'react-select';

export default function PublisherMapProcess(props){
    return(
    <article className="card-custom">
        <form className="ui form pad">
            <div className="equal width fields">
                <div className="field">
                    <label  className="label">VENDOR/PUBLISHER</label>
                    <select 
                      onChange={props.changeHandler}
                    //   value={props.key.client.id}
                      name="client"
                      placeholder="Select"
                    >
                        <option default>--Choose--</option>
                    {    
                        props.clientName && props.clientName.length>0 && props.clientName.map((item,index) =>{
                            return(                                     
                                <option  key={index} value={item.uid}>{item.email} | {item.name}</option>                                     
                                );                                 
                            }
                        )
                    }
                    </select>
                    
                </div>
                <div className="field">
                    <label className="label" onClick={props.campaignArray}>PUBLISHER ID</label>
                    <input 
                      type="number" 
                      placeholder = "Enter digits between 0 to 9"
                      className="form-control" 
                      name="publisher"
                    //   value={props.key.publisher.id}
                      onChange={props.changeHandler}/>
                    
                </div>
               <div className="field">
                    <label className="label" >CAMPAIGN</label>
                    <Select
                       isClearable={true}
                       isMulti
                       isRtl={false}
                       isSearchable={true}
                       name="campaign"
                       //value={props.key.campaign.id}
                       onChange= {props.changeHandlerMultiselect}
                       options={props.campaignArray}
                    />
                </div>                   
            </div>
            <div className="field">
            <button onClick={props.leadMapping} className="btn btn-fill margin-left--auto">ADD</button>
            </div>
        </form>
    </article>
    );
}