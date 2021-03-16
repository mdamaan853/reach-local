import React from 'react';
import './Youtube.css';


function YoutubeVideo (props){
    return(
        <div className="container" style={{width:`${props.width}`,paddingTop:`${props.paddingTop}`,left:`${props.left}`,right:`${props.right}`}}>
            <iframe style={{width:`${props.iframeWidth}`, height:`${props.iframeHeight}`}} className="responsive-iframe" src={'https://www.youtube.com/embed/' + props.url + '?autoplay=1'} controls></iframe>
        </div>       
    )
}

export {YoutubeVideo}; 