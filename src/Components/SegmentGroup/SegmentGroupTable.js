import React from 'react';
import SvgIcon from '../Svg-icon/Svg-icon';
import utils from '../../Services/utility-service';

function SegmentGroupTable (props){
 
        return(
            <section className="card-custom padding-btm--half leads-table-wrapper"
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >                       
                <table className="client">
                    <thead>
                        <tr>
                            <th>Segment Group Name</th>
                            <th>Medium</th>
                            <th>Datasource</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {    
                            props.segmentGroups.map((item,index)=>{ 
                                
                            return(
                                <tr key={index}>
                                    <td>{item.sgName}</td>
                                    <td>{item.mediumName}</td>
                                    <td>{item.agName}</td>
                                    <td>{item.status}</td>                                   
                                    <td>
                                    { 
                                        !props.showNoAction && item.allowedSubAction.map((subItem,subIndex) => {
                                            return(
                                                <div key={subIndex} className="padding-btm--half padding-left--half pointer">
                                                    {
                                                        subItem === "map-S-SG" && utils.hasRole('segment_group_map_segment') &&
                                                        <div onClick={() => props.tableAction(index,"funnel")}><SvgIcon icon={"funnel"} classes={'svg--lg'}></SvgIcon></div>        
                                                    }
                                                    {
                                                        subItem === "edit-SG" && utils.hasRole('segment_group_edit') &&
                                                        <div onClick={() => props.tableAction(index,"segmentG-edit",item.mediumName,item.agName,item.status,item.sgName,item.asgmId,item.basgmId,item.sgId)}><SvgIcon icon={"edit"} classes={'svg--lg'}></SvgIcon></div>
                                                    }
                                                    {
                                                        subItem === "delete" &&
                                                        <div onClick={() => props.tableAction(index,"delete")}><SvgIcon icon={"delete"} classes={'svg--lg'}></SvgIcon></div>
                                                    }
                                                </div>
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

export default SegmentGroupTable;