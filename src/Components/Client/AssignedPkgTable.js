import React from 'react';
import utils from '../../Services/utility-service';
// import {getAllServices} from '../../Services/subscriptions-service';

export default function AssignedPkg (props){
   
    return(
        <section className="margin-top leads-table-wrapper" 
            style = { utils.isMobile ? {maxHeight: "65vh"} : {maxHeight: "70vh"}}
        > 
        <h3>List of Assigned Packages</h3>
            <table className="client">
                <thead>
                    <tr>
                        <th>Packages</th>
                        <th>Code</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.pkg && props.pkg.map((item,index) =>{
                            return(
                            <tr>
                                <td>{item.name ? item.name : "--"}</td>
                                <td>{item.code ? item.code: "--"}</td>
                                <td>{item.desc ? item.desc : "--"}</td>
                            </tr>)
                        })
                    }
                    {
                        props.pkg && props.pkg.length === 0 &&
                        <tr className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>
                            No Package is assigned till now.
                        </tr>
                    }                   
                </tbody>
            </table>
        </section>
    );

}