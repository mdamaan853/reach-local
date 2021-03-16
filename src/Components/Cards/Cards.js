import React,{Component} from 'react';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import './Cards.css';

class Cards extends Component {
  render(){
    return( 
      <div className="cards-container">
        {
          this.props.creditSummary.map((item,index) => {
              return(
                  <div key={index} className="cards">
                    <div className="card-left flex flex-direction--col">
                        <div className="display-name"><span style={{margin:'0 auto'}}>{item.type}</span></div>
                        <span className="fullname">{item.displayName}</span>
                    </div>
                    <div className="card-right"> 
                        <div style={{marginTop:'auto'}}><SvgIcon icon={'arrow-right'} classes={'svg--xs'}></SvgIcon><span className="mini-status">CREDITS BROUGHT :</span> <span className="amount">{item.creditBought}</span></div>
                        <div style={{marginBottom:'auto',marginTop:'14px'}}><SvgIcon icon={(item.availableCredit>0)?'arrow-up':'arrow-down'} classes={(item.availableCredit>0)?'svg--xs green':'svg--xs red'}></SvgIcon><span className="mini-status">AVAILABLE CREDITS :</span> <span className="amount">{item.availableCredit}</span></div>
                    </div>
                </div>
              );              
          })
        }
      </div>
    );
  }   
}
export default Cards;






           