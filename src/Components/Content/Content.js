import React,{Component} from 'react';
import utils from '../../Services/utility-service';
import './Content.css';

class Content extends Component {
    render(){
        return(
          <div className="content">
            <div className="cust-reach">
                <h1>Your Customer Reachout Partner</h1>
                <img alt="promotional banner" src="https://live.expletuslabs.com/newdesign/assets/images/globe.png"/>            
            </div>             
             
                { !utils.isMobile &&
                    <div className="banners-container"> 
                    { 
                        this.props.banners.map((item,index) => {
                            return (
                                <div key={index} className="banner">
                                    <img src={item.img} alt={item.caption}/>
                                    <span className="banner-imgSpan">{item.caption}</span>
                                </div>          
                            );
                        })
                    } 
                    </div>
                }
                {
                    !!utils.isMobile &&
                    <div className="banners-container"> 
                    {
                        this.props.banners.map((item,index) => {
                            return (
                                <div key={index} className="banner">
                                    <span className="banner-imgSpan"><img src={item.img} alt={item.caption}/>{item.caption}</span>  
                                </div>          
                            );
                        })
                    }
                    </div>
                }
             
            <div className="flex flex-wrap getStarted pad">
                <b className="getStarted-content" style={utils.isMobile ? {fontSize:'15px',lineHeight:'30px'}: {fontSize:'18px',lineHeight:'36px'}}>Grow your business in a few easy steps!
                    <a href="/profile">
                        <button className="getStarted-btn float-rt padding-btm--half padding-left padding-right padding-top--half">Get Started</button>
                    </a> 
                </b>              
            </div>             
          </div>
        );
    }
          
} 

export default Content;