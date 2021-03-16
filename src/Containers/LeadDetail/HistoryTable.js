import React from 'react';
import './LeadDetail.css';
import Moment from 'react-moment';

export default function HistoryTable (props){
    return(
    <section className="popUp-modal--wrapper pad">
        <table id="customers">
            <tr>
                <th>Name</th>
                <th>Schedule Time</th>
                <th>Status</th>
                <th>Remarks</th>
            </tr>
            {
                !!props.histories && props.histories.length>0 && props.histories.map(history =>{
                    return(
                <tr>
                    <td>{history.userName}</td>
                    <td><Moment format="YYYY-MM-DD HH:mm">{history.scheduleTime}</Moment></td>
                    <td>{history.status}</td>
                    <td>{history.remarks}</td>
                </tr>
                    )
                })                
            }   
        </table>
    </section>
    );
}