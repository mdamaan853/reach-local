import React from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';

export default function CallPopup(props){
    return(
        <article className="pad">  
            { !props.confirmationLoader &&
            <React.Fragment>
                <div className="pad ui tiny header">Do you want to call on the number:{" "+props.leadData.mobile+". "}</div>
                <div className="dialog-footer padding-top"> 
                    <div className="margin-left--auto">   
                        <button className="btn btn-fill dialog--cta pointer" onClick={props.toggleCall}>
                            BACK
                        </button>                    
                        <button className="btn btn-fill btn-success margin-left--half dialog--cta pointer" onClick={props.makeCall}>CALL</button>     
                    </div>
                </div>
            </React.Fragment>   
            }
                { props.confirmationLoader &&
                    <div>
                        <div className="pad ui tiny header">Initiating Call...</div>
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }                      
        </article>
    );
}