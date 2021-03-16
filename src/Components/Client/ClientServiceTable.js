import React, {useState, useEffect} from 'react';
import utils from '../../Services/utility-service';
import {getAllServices} from '../../Services/subscriptions-service';

export default function ClientServiceTable (props){
    
    const [serv,setServ] = useState(null);
    
    useEffect(()=>{
        const body={businessUid : props.id}
        // document.title = "Sarita";
        getAllServices(body)
        .then(r => r.json())
        .then(data => {
            if(data.success){
                setServ(data.services); 
            } else{
                console.log(data.message);
            }
        })
        .catch(e =>{
            console.log(e); 
        })

    },[props.id])
    
   

    return(
        <section className="margin-top leads-table-wrapper" 
            style = { utils.isMobile ? {maxHeight: "65vh"} : {maxHeight: "70vh"}}
        >
            <table className="client">
                <thead>
                    <tr>
                        <th>Service Code</th>
                        <th>Service</th>
                        <th>Price Per Unit</th>
                        {
                            props.page !== "Clients" &&
                            <React.Fragment>
                                <th >Per Unit Min Price</th>
                                <th>Agency Cost Or Share</th>
                            </React.Fragment>
                        }
                        
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>        
                    {
                        // (props || serv) && (props.serv || serv).map( (ser)=>{
                            serv && serv.map((ser) =>{
                            return(
                                <tr>
                                    <td>{ser.code ? ser.code: "--"}</td>
                                    <td>{ser.name ? ser.name: "--"}</td>
                                    <td>&#8377;{ser.perUnitPrice ? ser.perUnitPrice: "--"}</td>
                                    
                                    { props.page !== "Clients" &&
                                    <React.Fragment>
                                        <td>&#8377;{ser.perUnitMinPrice ? ser.perUnitMinPrice : "--"}</td>
                                        <td>&#8377;{ser.costOrShare ? ser.costOrShare : "--"}</td>
                                    </React.Fragment>
                                    }
                                    <td></td>

                                </tr>
                            )
                        })
                    }
                    {     
                        ((serv && serv.length === 0) || !serv) &&
                        <div className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>
                            No Data to show
                        </div>
                        
                    }
                </tbody>
            </table>
        </section>
    )
} 