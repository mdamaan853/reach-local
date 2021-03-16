import React from 'react';
import utils from '../../Services/utility-service';

export default function ClientsTable(props){
    return(
        <div className="leads-table-wrapper card-custom" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
            <table className="client">
                <thead className="">
                    <tr className="">
                        <th>UID</th>
                        <th>Name</th>
                        
                        <th>Agency Name</th>
                        <th>Balance</th>
                        <th>Allowed Debit</th>
                        <th>Paid Type</th>
                        <th>Email</th>
                        <th className="" style={{width: '15%'}}>Action</th>             
                    </tr>
                </thead>
                <tbody className="">
                    {props.clients.map((item,index)=>{
                        return(
                            <tr key={index} className="">
                                <td className="">{item.uid ? item.uid : "--"}</td>
                                <td className="">{item.name ? item.name : "--"}</td>
                                
                                <td>{item.agencyName ? item.agencyName : "--"}</td>
                                <td>{item.balance ? item.balance : "--"}</td>
                                <td>{item.allowedDebit ? item.allowedDebit : "--"}</td>
                                <td>{item.paidType ? item.paidType : "--"}</td>
                                <td className="">{item.email ? item.email:"--"}</td>
                                <td className=""> 
                                    <button onClick={()=>props.action('detail',index)} className="ui icon right labeled tiny button">
                                        <i aria-hidden="true" className="right arrow icon"></i>
                                        View Details
                                    </button>
                                </td>                                 
                            </tr>                              
                            );
                    })}
                </tbody>
                {/* <tfoot className="full-width leads-table-footer">
                    <tr className="" style={{width:'100%',display:'block'}}>
                        <th colSpan="2" className="col-4">
                            {
                                props.clients && props.clients.length > 0 &&
                                <div style={{fontSize:'13px'}}>Showing results from <span>{props.start + 1}</span> to <span>{props.start + props.clients.length}</span> </div>
                            }
                        </th>
                        <th colSpan="11" className="col-2" style={{borderLeft:'none'}}>
                            {
                                !props.loader && 
                                <button className={`ui small right floated icon right labeled button ${!props.hasNext ? 'disabled' : ''}`} onClick={()=>this.getLeads('next')}>Next<i aria-hidden="true" className="chevron right icon"></i></button>
                            }
                            {
                                !props.loader && 
                                <button className={`ui small right floated icon left labeled button ${props.start === 0 ? 'disabled' : ''}`} onClick={()=>this.getLeads('previous')}><i aria-hidden="true" className="chevron left icon"></i>Previous</button>
                            }
                            {
                                props.loader &&
                                <div className="col-1 floated margin-left--auto margin-right right ui">
                                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                </div>
                            }
                        </th>
                    </tr>
                </tfoot> */}
            </table>
        </div>
    );
}