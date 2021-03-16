import React from 'react';
import Moment from 'react-moment';
import utils from '../../../Services/utility-service';

export default function DailySummary(props){
    return(
        <article className="card-custom margin-top leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
            <table className="client">
                <thead>
                    <tr className="text--center">
                        <th>Date</th>
                        <th>Delivered Count</th>
                        <th>Delivered Credit</th>
                        <th>Failed Count</th>
                        <th>Failed Credit</th>
                        <th>Sent Count</th>
                        <th>Sent Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.dailySummaries && props.dailySummaries.length>0 &&
                        props.dailySummaries.map((item,index)=>{
                            return(
                                <tr className="text--center" key={index}>
                                    {
                                        item.date &&
                                        <td><Moment format="YYYY/MM/DD">{item.date}</Moment></td>
                                    }
                                    {
                                        !item.date &&
                                        <td>--</td>
                                    }
                                    <td>{item.deliveredCount ? item.deliveredCount : "--"}</td>
                                    <td>{item.deliveredCredit ? item.deliveredCredit : "--"}</td>
                                    <td>{item.failedCount ? item.failedCount : "--"}</td>
                                    <td>{item.failedCredit ? item.failedCredit : "--"}</td>
                                    <td>{item.sentCount ? item.sentCount : "--"}</td>
                                    <td>{item.sentCredit ? item.sentCredit : "--"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                props.dailySummaries.length === 0 &&
                <div  style={{fontSize:'small', padding:"20% 40%"}}>No Data To Show</div>
            }
        </article> 
    )
}
