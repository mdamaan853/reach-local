import React from 'react';

const Youtube = (props) => {
    return (	
        <div style={{marginBottom:'-6px'}}>
            <iframe id="ytplayer" title="embed_youtube_player" className="iframe-placeholder" allowFullScreen="allowFullScreen" type="text/html" width="600" height="360"
            src={'https://www.youtube.com/embed/' + props.url + '?autoplay=1'}
            frameborder="0" />
        </div>
    );
}




export default Youtube;