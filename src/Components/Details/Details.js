import React from 'react';
import './Details.css';
function Details ({details}){
    return(
      <div className="detailsContainer margin-top">
        {
          details.map((item,index)=>{
              return(
                <div key={index} className="detailCard-wrapper">
                    <div className="detailsCard-left">
                        <div className="name">{item.displayName}</div>
                        <div className="details-total">Total :{item.total}</div>
                    </div>
                    <div className="detailsCard-right"> 
                        {
                          item.items.map((key,index)=>{
                            return(
                              <div key={index} className="detail-menu"><span>{key.name}</span><span>{key.value}</span></div>
                            );
                          })
                        }
                    </div>
                </div>
              );
          })
        }  
      </div>
    );
}

export default Details;