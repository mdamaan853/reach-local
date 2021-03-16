import React from 'react';
import Moment from 'react-moment';
import utils from '../../../Services/utility-service';

export default function CampaignSummary(props){
    return(
        <article className="card-custom margin-top leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
            <table className="client">
                <thead>
                    <tr className="text--center">
                        <th>Awaited Count</th>
                        <th>Campaign Code</th>
                        <th>Campaign Name</th>
                        <th>Delivered Count</th>
                        <th>Failed Count</th>
                        <th>Message</th>
                        <th>Schedule Time</th>
                        <th>Sender</th>
                        <th>ShortUrl Click Count</th>
                        <th>Total Credit</th>
                        <th>Transaction Count</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.campaignSummaries && props.campaignSummaries.length>0 &&
                        props.campaignSummaries.map((item,index)=>{
                            return(
                                <tr key={index} className="text--center">
                                    <td>{item.awaitedCount ? item.awaitedCount : "--"}</td>
                                    <td>{item.campaignCode ? item.campaignCode : "--"}</td>
                                    <td>{item.campaignName ? item.campaignName : "--"}</td>
                                    <td>{item.deliveredCount ? item.deliveredCount :"--"}</td>
                                    <td>{item.failedCount ? item.failedCount : "--"}</td>
                                    <td>{item.message ? item.message : "--"}</td>
                                    {
                                        item.scheduleTime &&
                                        <td><Moment format="YYYY-MM-DD HH:mm">{item.scheduleTime}</Moment></td>
                                    }
                                    {
                                        !item.scheduleTime &&
                                        <td>--</td>
                                    }
                                    <td>{item.sender ? item.sender : "--"}</td>
                                    <td>{item.shortUrlClickCount ? item.shortUrlClickCount : "--"}</td>
                                    <td>{item.totalCredit ? item.totalCredit : "--"}</td>
                                    <td>{item.txnCount ? item.txnCount : "--"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                props.campaignSummaries.length === 0 &&
                <div  style={{fontSize:'small', padding:"20% 40%"}}>No Data To Show</div>
            }
        </article>
    )
}