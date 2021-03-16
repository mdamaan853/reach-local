import React from 'react';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import utils from '../../Services/utility-service';
//import CircularLoader from '../circular-loader/circular-loader';

function LandingPagesTable (props){
 
        return(
            <section  className="margin-top leads-table-wrapper"
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >          
                <table className="client">
                    <thead>
                        <tr>
                            <th>Campaign Id</th>
                            <th>Client Name</th>
                            <th>Client Email</th>
                            <th>Landing Page</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {    
                            props.pageList.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.campaignId}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.landingPage}</td>
                                    <td>
                                       {
                                           item.allowedSubActions && item.allowedSubActions.length !== 0 &&
                                           item.allowedSubActions[0] === "all" &&
                                           props.actions.map((item,subIndex) => {
                                            return(
                                                <span key={subIndex} className="margin-left pointer" onClick={() => props.tableAction(index,item)}><SvgIcon icon={item} classes={'svg--lg'}></SvgIcon></span>
                                            );
                                        })
                                       }
                                    </td>                                   
                                </tr>                                                            
                                );                               
                             }) 
                         }
                    </tbody>
                </table>  
                {
                    props.pageList.length === 0 && 
                    <div className="padding-top padding-btm" style={{textAlign:'center',fontSize:'small'}}>
                        No Data to show
                    </div>
                }      
            </section>          
        );
    
}

export default LandingPagesTable;