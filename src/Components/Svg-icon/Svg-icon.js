import React from 'react';
import './Svg-icon.css';
import icons from '../../Constants/icons.constants.js'
const SvgIcon = ({icon,classes}) => {
    return (	
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
            <path d={icons[icon]}></path>
        </svg>
    );
}

export default SvgIcon;