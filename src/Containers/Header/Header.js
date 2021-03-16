import React,{Component} from 'react';
import utils from '../../Services/utility-service';
import { Dropdown } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {whatsAppMobile} from '../../Services/whatsApp-service';
import './Header.css';

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            url:""
        }
        this.whatsAppNumber = this.whatsAppNumber.bind(this);
    }

    componentDidMount(){
        this.whatsAppNumber();
    }
    headerNavigation(url){
        const { history } = this.props;
        if (url === "/login") {
          //window.document.cookie = 'u_at_c=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //   setTimeout(() => {
        //       window.location.reload();
        //   },100)
        window.location.href = window.location.origin + "/logout";
        } else {
          history.push(url);
        }
    }

    whatsAppNumber(){
        // let url= `${utils.isMobile ? "https://api.whatsapp.com/send?" :"https://web.whatsapp.com/send?"}`;
        let url = "https://api.whatsapp.com/send?";
        const body={};
        whatsAppMobile(body)
        .then (r => r.json())
        .then(data =>{
            if(data.success){               
                let mob = data.mobile.substring(1);
                let urlPh=url.concat(mob);
                // let urlPh=url.concat(`phone=${data.mobile}`);
                let finalURL = urlPh.concat("&text=Tell+me+more+about+ReachLocalAds+Hyperlocal+Marketing+Platform");
                this.setState({
                    url:finalURL
                })
                
            }
            else{
                ToastsStore.error(data.message);            
            }
        })
        .catch( e=>{
            ToastsStore.error("Something Went Wrong. Please try again later.!!!");
        })        
    }

    render(){
        let triger= (
            <span>
                Hi, <strong>{this.props.userInfo && this.props.userInfo.firstName ? (this.props.userInfo.firstName ? this.props.userInfo.firstName + " " : '') + (this.props.userInfo.middleName ? this.props.userInfo.middleName + " ": '') + (this.props.userInfo.lastName ? this.props.userInfo.lastName : '') : "Guest"}</strong>
            </span>
        );
        let logo = window.localStorage.getItem('logoUrl');
        return(
            <div className={(this.props.sidebarOpen ? "flex flex-align--center align-space-between header-custom header--mobile " : "flex flex-align--center align-space-between header-custom header--mobile ")}>
                {
                    utils.isMobile && 
                    <span onClick={()=>{this.props.toggleSidebar()}} className={(this.props.sidebarOpen ? "menuBar menuBar-open--mobile menuBar-open" : "menuBar menuBar-close")}>
                        <div/>
                        <div/> 
                        <div/>
                    </span>
                }
               <a href={`${window.location.origin}/home`} style={ utils.isMobile ? {marginLeft:'18%'} : {maxHeight:'90px',overflow:'hidden'}}>
                    <img src={logo} alt="Company Logo" style={{marginTop: '18px',width: '226px',height:'34px',objectFit:'cover'}}/>
               </a>

               <div className="flex flex-align--center" style={ utils.isMobile ? {marginRight:'0%'} : {marginRight:'28px'}}>
                        <Dropdown 
                            floating 
                            icon="chevron down" 
                            trigger= { !utils.isMobile ? triger : <i class="user icon"></i> }
                            >
                            <Dropdown.Menu className="left">
                                {
                                    this.props.userInfo && this.props.userInfo.firstName &&
                                    <Dropdown.Item disabled={true} text={`Signed in as ${this.props.userInfo.firstName}`} />
                                }
                                <Dropdown.Item icon='user' text='Profile' onClick={()=>this.headerNavigation('/profile')}/>
                                <Dropdown.Divider />
                                <Dropdown.Item icon='shopping cart' text='Buy Credits' onClick={()=>this.headerNavigation('/buycredits?source=header')}/>
                                <Dropdown.Divider />
                                <Dropdown.Item icon='sign-out' text='Logout' onClick={()=>this.headerNavigation('/login')}/>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Popup                   
                            content="Contact Us"
                            flowing 
                            hoverable                                
                            trigger={
                                utils.isMobile ? 
                                <a target="_blank" rel="noopener noreferrer" href={this.state.url}>
                                    <img alt="Icon" style={{width:"70%"}} src="https://img.icons8.com/color/48/000000/whatsapp--v4.png" />
                                </a> :
                        
                                <a target="_blank" rel="noopener noreferrer" href={this.state.url}>
                                    <img alt="Icon" style={{width:"70%"}} src="https://img.icons8.com/color/48/000000/whatsapp--v4.png" />
                                </a>
                            }
                            >
                        </Popup>
               </div>
              
               <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} /> 
            </div>
        )
    }
}
export default withRouter(Header);