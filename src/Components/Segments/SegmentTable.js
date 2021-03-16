import React from 'react';
import SvgIcon from '../Svg-icon/Svg-icon';
import utils from '../../Services/utility-service';


function SegmentTable (props){
 
        return(
            <section className="card-custom padding-btm--half leads-table-wrapper"
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >                       
                <table className="client">
                    <thead>
                        <tr>
                            <th>Segment Id</th>
                            <th>Segment Title</th>
                            <th>Segment Type</th>
                            <th>Segment Name</th>
                            <th>Segment Data Code</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {    
                            props.segments.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>
                                        {
                                            item.icon &&
                                            <span className="margin-right--quar">
                                                <i aria-hidden="true" className={`${item.icon} icon`}></i>
                                            </span>
                                        } 
                                        {item.displayTitle}
                                    </td>
                                    <td>{item.type}</td>
                                    <td>{item.name}</td>
                                    <td>{item.dataCode}</td>
                                    <td>{item.status}</td>                                   
                                    <td>
                                       {
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
            </section>          
        );
    
}

export default SegmentTable;