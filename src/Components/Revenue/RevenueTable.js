import React from 'react';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import CircularLoader from '../circular-loader/circular-loader';


export default function RevenueTable (props){
    return(
    <section>  
        <div className="margin-top leads-table-wrapper" 
            style = { utils.isMobile ? {maxHeight: "50vh"} : {maxHeight: "70vh"}}
        >         
            <table className="client">
                <thead>
                    <tr>
                        <th>Total Amount</th>
                        <th>Transaction Amount</th>     
                        {
                            utils.isSuAdmin &&
                            <React.Fragment>    
                                <th>Agency</th>
                            </React.Fragment>
                        }
                        <th>Client</th> 
                        <th>Client Email</th>
                        <th>Payment Date</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        props.revenueHis &&  props.revenueHis.map((item,index)=>{
                        return(
                            <tr key={index}>
                                <td>{item.amount}</td>
                                <td>{item.txnAmount}</td>
                                {
                                    utils.isSuAdmin &&
                                    <React.Fragment>    
                                        <td>{item.agency.name}</td>
                                    </React.Fragment>
                                }
                                <td>{item.client.name}</td>
                                <td>{item.client.email}</td>
                                {/* <td>{item.created}</td> */}
                                <td><Moment format="YYYY/MM/DD">{item.paymentDate}</Moment></td>
                                <td>{item.remarks}</td>                                                            
                            </tr>                              
                            );
                        })
                    }
                </tbody>
            </table>
            {
                false &&
                <div className="margin-btm margin-top">
                    <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                </div>
            }
            {
                props.revenueHis.length === 0 && 
                <div className="padding-top padding-btm" style={{textAlign:'center',fontSize:'small'}}>
                    No Data to show
                </div>
            }   
        </div>           
    </section>          
    );
}

