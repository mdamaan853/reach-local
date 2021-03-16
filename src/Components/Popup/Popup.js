import React, { Component } from 'react';
import utils from '../../Services/utility-service';
import './Popup.css';

class Popup extends Component {
 UNSAFE_componentWillMount(){
    document.getElementsByTagName('body')[0].classList.add("no-scroll");
 } 
 componentWillUnmount(){
    document.getElementsByTagName('body')[0].classList.remove("no-scroll")
 }

constructor(props){
    super(props);
    this.state = {
        pop: true
    }
}

componentDidMount(){
    setTimeout(()=>{
        this.setState({
            pop: false
        })
    },200)
}

 render() {
    return (  
        <div className="ease">
            <div className="scroll-mask" aria-hidden="true" style={{zIndex: 50}}> 
                {/* Here we have used aria-hidden for semantic purpose ie. browser will not read entire div */}
                <div className="scroll-mask-bar"></div>
            </div>
            <div className="dialog-container">
                <div className={`dialog ${this.state.pop ? 'zero-height' : ''}`} style={{maxWidth:`${this.props.maxWidth ? this.props.maxWidth : "600px"}`, maxHeight: `${this.props.maxHeight ? this.props.maxHeight : (utils.isMobile ? null :"590px")}`}}>
                    <div className="dialog-header">
                        <div className="toolbar-tools pointer" onClick={()=>this.props.togglePopup()}>
                            <div>{this.props.title}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                    </div>
                    {this.props.children}
                </div>
            </div>
        </div>
        );       
    }
  }
  
  export default Popup;