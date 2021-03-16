
import React from 'react';


export default function LeadsMapping (props){
    return(
        <article className="card-custom">
            <form className="ui form pad">
                <div className="equal width fields">
                    <div className="field">
                        <label  className="label">LEAD STATUS</label>
                        <select 
                          onChange={props.handleChange}
                          className="form-control"
                        //   value={props.key.statusKey.value}
                          name="statusKey"
                        >
                            <option default>--Choose Status--</option>
                    {    
                        props.leadStatus && props.leadStatus.length>0 && props.leadStatus.map((item,index) =>{
                            return(                                     
                                     <option  key={index} value={item.id}>{item.status}</option>                                     
                                );                                 
                            }
                        )
                    }
                        </select>                            
                    </div>
                    <div className="field">
                        <label className="label">BUCKETS</label>
                        <select 
                         onChange={props.handleChange}
                         className="form-control"
                        //  value={props.key.bucketKey.value}
                         name="bucketKey">
                            <option default>--Choose Bucket--</option>
                    {   
                        props.bucket && props.bucket.length>0 && props.bucket.map((item,index) =>{
                            return(                                     
                                    <option key={index} value={item.id}>{item.bucket}</option>                                     
                                );                                 
                            }
                        )
                    }
                         </select>
                    </div>
                   <div className="field">
                        <label className="label">LEAD STATUS FUNNEL</label>
                        <select 
                        onChange={props.handleChange}
                        className="form-control"
                        // value={props.key.leadFunnel.value}
                        name="leadFunnel">
                            <option default>--Choose Funnel--</option>
                    {   
                        props.leadFunnel && props.leadFunnel.length>0 && props.leadFunnel.map((item,index) =>{
                            return(                                     
                                    <option value={item.id} key={index}>{item.funnel}</option>                                     
                                );                                 
                            }
                        )
                    }
                         </select>
                    </div>                   
                </div>
                <div className="field">
                        <button onClick={props.leadMapping} className="btn btn-fill margin-left--auto">ADD</button>
                    </div>
            </form>
        </article>
    );
}

                