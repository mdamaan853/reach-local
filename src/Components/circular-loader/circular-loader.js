import React from 'react';
function CircularLoader (props){
    return(
        <div style={{minWidth:props.buttonSize,textAlign:'center',opacity:'0.4'}}> 
            <svg style={{width:props.size+'px',height:props.size+'px',margin:'auto'}} 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
                preserveAspectRatio="xMidYMid" 
                className="uil-ring"> 
                <rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect> 
                <circle cx="50" cy="50" r="47.5" 
                        strokeDasharray="193.99334635916975 104.45795573186061" 
                        stroke={props.stroke} fill="none" strokeWidth="5"> 
                        <animateTransform attributeName="transform" type="rotate" values="0 50 50;180 50 50;360 50 50;" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite" begin="0s"></animateTransform> 
                </circle> 
            </svg>
        </div>
    );
}

export default CircularLoader;