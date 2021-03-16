import React, { Component } from 'react';
import Profile from '../Profile/Profile';
import BuyCredits from '../BuyCredits/BuyCredits';
import Campaign from '../Campaign/Campaign';
import SenderIds from '../SenderIds/SenderIds';
import { withRouter } from "react-router-dom";
import './FormContainer.css';

class FormConatiner extends Component {
    constructor(){
        super();
        this.state = {
            steps:[
                {page:"profile",rank:1,text:"Profile",subtext:null,url:"/profile"},
                {page:"buyCredtis",rank:2,text:"Wallet",subtext:null,url:"/buycredits"},
                {page:"senderIds",rank:3,text:"Request Sender ID",subtext:"(In Case of SMS)",url:"/sender-ids"},
                {page:"campaigns",rank:4,text:"Campaign",subtext:null,url:"/campaigns"},
            ]
        }
    }
    formNavigation(url){
        this.props.history.push(url);
    }
    render() {
      return (
                <div className="form-container-Wrapper client-bg">
                    <div className="form-steps-wrapper">
                        {
                            this.state.steps.map((item,index)=>{
                                return(
                                    <div onClick={()=>{this.formNavigation(item.url)}} key={index} className={
                                        'form-step-item '+
                                        ((this.props.page === item.page)? 'selected ':'unselected ')+
                                        ((index===0)? 'first ' : '')+
                                        ((index === this.state.steps.length-1)?'last ':'')+
                                        (index>0 && index<this.state.steps.length-1 ? 'middle' : '')
                                    }>
                                        <span className="count">{item.rank}</span>
                                        <span className="text">{item.text}</span>
                                        <div className="subtext">{item.subtext}</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="form-component-container">
                        {this.props.page === 'profile' && <Profile/>}
                        {this.props.page === 'buyCredtis' && <BuyCredits walletInfo={this.props.walletInfo}/>}
                        {this.props.page === 'senderIds' && <SenderIds/>}
                        {this.props.page === 'campaigns' && <Campaign/>}
                    </div>
                </div>
              );
    }
  }
  
  export default withRouter(FormConatiner);