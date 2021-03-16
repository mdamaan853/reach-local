import React from 'react';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import { Dropdown } from 'semantic-ui-react';

export default function TaskTable (props){
    return(
        <article className="card-custom margin-top leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "65vh"} : {maxHeight: "70vh",minHeight:"50vh"}}>
        <table className="client">
        <thead>
            <tr className="text--center">
                {/* <th>ID</th>
                <th>Name</th> */}
                <th>Task</th>
                <th>Schedule Time</th>
                <th>Status</th>
                {/* <th>Reference ID</th>
                <th>Reference Type</th> */}
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {
                !!props.work && props.work.map(item =>{
                    return(
                        <tr>
                        {/* //     <td>{item.taskId}</td>
                        //     <td>{item.name}</td> */}
                            <td>{item.task}</td>
                            <td><Moment format="YYYY-MM-DD HH:mm">{item.scheduleTime ? item.scheduleTime : null}</Moment></td>
                            <td>{item.status}</td>
                            {/* <td>{item.refId}</td>
                            <td>{item.refType}</td> */}
                            <td className="flex flex-direction--col">
                                <Dropdown text='Actions' direction='left'>
                                    <Dropdown.Menu style={{top:"100%",bottom:"auto"}}>
                                        {
                                            props.getActions(item.allowedActions).map((subItem) => {
                                                return(
                                                    <React.Fragment>
                                                        <Dropdown.Item icon={subItem.icon} text={subItem.text} onClick={()=>{props.action(subItem,item.mappingId,item.refId)}}/>
                                                        <Dropdown.Divider />
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    )
                })
            }
           
        </tbody>
    </table>
    {
        !props.work &&
        <div  style={{fontSize:'small', padding:"20% 40%"}}>No Data To Show</div>
    }
    </article>
    )
}