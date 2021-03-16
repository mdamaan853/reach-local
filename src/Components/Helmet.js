import React from 'react';
import {Helmet} from "react-helmet";

export default function PageTile(props){
    return(
        <Helmet>
            <title>{props.title} | ReachLoalAds</title>
            <meta name="description" content={props.description} />
        </Helmet>
    )
}