import React from 'react';
import classNames from 'classnames';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import CircularLoader from '../circular-loader/circular-loader';
import './SenderTable.css';

function SenderTable (props){
    return(
        <section className="leads-table-wrapper"
            style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
        >          
            <table className="client">           
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Client Email</th>
                        <th>Medium</th>
                        <th>Datasource</th>
                        <th>Sender Code</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th className="text--center" colspan="3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        props.senderDTO.map((item,index)=>{
                        return(
                            <tr key={index}>
                                <td>{item.businessName}</td>
                                <td>{item.businessOwnerEmail}</td>
                                <td>{item.medium}</td>
                                <td>{item.dataSource}</td>
                                <td>{item.senderCode}</td>
                                <td>{item.status + ''}</td>
                                <td><Moment format="DD-MM-YYYY">{item.created}</Moment></td>
                                <td>
                                    <div className={"flex flex-direction--col"}>
                                        {item.allowedActions.map((subitem,index)=>{
                                            let btnClass = classNames({
                                                'btn': true,
                                                'btn-fill': true,
                                                // 'mar--quar': true,
                                                // 'btn-small': true,
                                                'btn-blue': subitem === 'reject',
                                                'btn-danger': subitem === 'delete',
                                                'btn-green': subitem === 'accept',
                                                'margin-top--half': (index !== 0)
                                                });
                                            return(              
                                                <button style={{fontSize:"12px", padding:"0px"}} onClick={()=>{props.actionHandler(subitem,item.id)}} className={btnClass}>{subitem}</button>                                                
                                            );
                                        }) 
                                        }
                                    </div> 
                                </td>                                                                     
                            </tr>                              
                            );
                        })
                    }
                </tbody>
            </table>
            {
                false &&
                <div className="margin-btm margin-top">
                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                </div>
            }
            {
                props.senderDTO.length === 0 && 
                <div className="padding-top padding-btm" style={{textAlign:'center',fontSize:'small'}}>
                    No Data to show
                </div>
            }              
        </section>          
    );
}

export default SenderTable;