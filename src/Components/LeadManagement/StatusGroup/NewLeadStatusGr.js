import React from 'react';
import CircularLoader from '../../circular-loader/circular-loader';
import Select from 'react-select';

export default function NewLeadStatusGroup(props){
    return(
        <article>
            <form className="ui form pad ">
            <div className="field">
                    <label className="label">CAMPAIGN</label>
                    <Select
                       isClearable={true}
                       isMulti
                       isRtl={false}
                       isSearchable={true}
                       defaultValue={props.prefillArray}
                       placeholder="Select or Search.."
                       // name="campaign"
                       //value={props.prefillArray}
                       onChange={props.changeHandlerMultiselect}
                       options={props.campaignArray}
                    />
                </div> 
                <div className="field">         
                    <label className="label">Status Group Name</label>
                    <input  type="text" 
                            className="form-control" 
                            name="statusGroup"
                            value={props.statusGroup}
                            onChange={props.changeHandler} />
                </div>           
            </form>
            {  
             !props.submitLoader &&
                <div className="dialog-footer pad margin-top">                  
                        <button className="btn btn-fill dialog--cta pointer" onClick={props.togglePopup}>Back</button>
                        <button className="btn btn-fill btn-success dialog--cta pointer btn-fill margin-left--half" onClick={()=>props.submitData(props.id)}>ADD</button>                     
                </div> 
            }
            {
                props.submitLoader && 
                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
            }
                   
        </article>    
    );
}