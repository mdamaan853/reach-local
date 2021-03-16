import React from 'react';
import utils from '../../Services/utility-service';
import Moment from 'react-moment';
import classNames from 'classnames';
import CircularLoader from '../circular-loader/circular-loader';


export default function IVRtable(props){
    return(
    <article className="card-custom margin-top leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
        <table className="client">   
            <thead>
                <tr className="text--center">
                    <th>ID</th>
                    <th>Created at</th>
                    <th>Caller Number</th>
                    <th>Reciever Number</th>
                    <th>Call Status</th>
                    <th>Call Duration</th>
                    <th>Call Recording Url</th>
                    <th>Called By</th>
                </tr>
            </thead>
            <tbody>
            {   
                props.callDetails.map((item,index)=>{
                return(
                    <tr key={index}>
                        <td>{item.uid ? item.uid : "--" }</td>
                        {
                            item.created &&
                            <td><Moment format="YYYY/MM/DD HH:mm a z">{item.created}</Moment></td>
                        }
                        {
                            !item.created &&
                            <td>--</td>
                        }
                        <td>{item.callerNumber ? item.callerNumber : "--"}</td>
                        <td>{item.receiverNumber ? item.receiverNumber : "--"}</td>
                        <td>{item.callStatus ? item.callStatus : "--"}</td>
                        <td>{item.callDuration ?  item.callDuration: "--"}</td>
                        <td>
                            {  item.callRecordingUrl !== null  &&
                                <audio controls>
                                    <source src={item.callRecordingUrl} type="audio/wav" />
                                </audio>
                            }
                            {
                                ! item.callRecordingUrl &&
                                <p>No Recording Available</p>
                            }
                            
                        </td>
                        <td>{item.calledBy ? item.calledBy : "--"}</td>                                                                                   
                    </tr>                              
                    );
                })
            }
            </tbody>
            <tfoot className="full-width leads-table-footer">
                <tr style={{width:'100%',display:'block'}}>
                    <th colSpan="2" className="col-4">
                        {
                            props.callDetails && props.callDetails.length > 0 &&
                            <div style={{fontSize:'13px'}}>Showing results from <span>{props.start + 1}</span> to <span>{props.start + props.callDetails.length}</span> </div>
                        }
                    </th>
                    <th colSpan="11" className="col-2" style={{borderLeft:'none'}}>
                        {
                            !props.loader && 
                            <button className={classNames({
                                'ui small right floated icon right labeled button': true,
                                'disabled' : !props.hasNext
                            })} 
                            onClick={()=>props.getCallDetails('next')}>Next<i aria-hidden="true" className="chevron right icon"></i></button>
                        }
                        {
                            !props.loader && 
                            <button className={classNames({
                                'ui small right floated icon left labeled button': true,
                                'disabled' : props.start === 0
                            })} 
                            onClick={()=>props.getCallDetails('previous')}><i aria-hidden="true" className="chevron left icon"></i>Previous</button>
                        }
                        {
                            props.loader &&
                            <div className="col-1 floated margin-left--auto margin-right right ui">
                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                            </div>
                        }
                    </th>
                </tr>
            </tfoot>
        </table>
        {
        props.callDetails && props.callDetails.length === 0 &&
            <div  style={{fontSize:'small', padding:"20% 40%"}}>No Data To Show</div>
        }
    </article>     
    );
}




