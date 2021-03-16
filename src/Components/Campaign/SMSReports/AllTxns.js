import React from 'react';
import Moment from 'react-moment';
import utils from '../../../Services/utility-service';

export default function AllTxns(props){
    return(
        <article className="card-custom margin-top leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
            <table className="client">
                <thead>
                    <tr className="text--center">
                        <th>Credit</th>
                        <th>Delivery Time</th> 
                        <th>Length</th>
                        <th>Message</th>
                        <th>Mobile</th>
                        <th>Send Time</th>
                        <th>Sender</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    
                       {
                           props.smsTxns && props.smsTxns.length>0 &&
                           props.smsTxns.map((item,index)=>{
                               return(
                                <tr className="text--center" key={index}>
                                    <td>{item.credit}</td>
                                    {
                                        item.deliveryTime && 
                                        <td><Moment format="YYYY-MM-DD HH:mm">{item.deliveryTime}</Moment></td>
                                    }
                                    {
                                        !item.deliveryTime &&
                                        <td>--</td>
                                    }
                                    <td>{item.length ? item.length : "--"}</td>
                                    <td>{item.message ? item.message : "--"}</td>
                                    <td>{item.mobile ? item.mobile : "--"}</td>
                                    {
                                        item.sendTime &&
                                        <td><Moment format="YYYY-MM-DD HH:mm">{item.sendTime}</Moment></td>
                                    }
                                    {
                                        !item.sendTime &&
                                        <td>--</td>
                                    }
                                    <td>{item.sender ? item.sender : "--"}</td>
                                    <td>{item.status ? item.status : "--"}</td>
                                </tr>
                               )
                           })
                       } 
                </tbody>
            </table>
            {
                props.smsTxns.length === 0 &&
                <div  style={{fontSize:'small', padding:"20% 40%"}}>No Data To Show</div>
            }
        </article>
    )
}