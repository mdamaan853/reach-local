import React from 'react';
import Select from 'react-select';

export default function RoleTable (props){
    return(
        <article className="card-custom">
        <table className="ui celled table">
            <thead className="">
                <tr className="text--center">
                    <th className="">Permission/Roles Group</th>
                    <th className="">Role Assigned</th>
                    <th className="">Action</th>
                </tr>
            </thead>
            <tbody className="">
                {    
                    props.permissionGroups && props.permissionGroups.length>0 && props.permissionGroups.map((item,index) =>{
                        return(
                            <tr key={index} className="text--center">
                                <td className=""><b>{item.name.toUpperCase()}</b></td>
                                <td className="">
                                    <Select
                                        isClearable={true}
                                        isMulti
                                        isRtl={false}
                                        isSearchable={true}
                                        value={item.roles}
                                        onChange={(event)=>props.multiSelectChangeHandler(event,index)}
                                        options={props.roles}
                                    />                             
                                </td>
                                <td className="">
                                    <button className="btn btn-fill btn-expletus margin-left--auto" onClick={()=> props.addRoles(index)}>SAVE</button>
                                </td>
                            </tr>                          
                        );
                    })                         
                }
            </tbody>        
        </table>
    </article>
    );
}