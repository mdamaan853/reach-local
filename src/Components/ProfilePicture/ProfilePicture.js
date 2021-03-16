import React,{Component} from 'react';
import './ProfilePicture.css';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
class SideBar extends Component {
    render(){
        return(           
        <div className="round-profile">
             <SvgIcon icon={"person"} classes={'profile'}></SvgIcon>
        </div>
        ); 
    }
} 

export default SideBar;