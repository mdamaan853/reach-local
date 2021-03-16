import React,{useEffect,useState} from 'react';
import utils from '../../Services/utility-service';
import {getAllServices} from '../../Services/subscriptions-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

export default function PkgServices (props){

    const [services, setServices] = useState(null);

    useEffect(() =>{
        let body={}
        getAllServices(body)
        .then(r => r.json())
        .then(data =>{
            if(data.success){
                setServices(data.services);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( e =>{
            ToastsStore.error("Something went wrong. Please try again later.!!! ");
        })        
    },[])

    return(
        <main>
        <article className="card-custom flex flex-direction--row pad--half">
            <h4 className="ui header">Services</h4>
        </article>
        <section className="margin-top leads-table-wrapper" 
            style = { utils.isMobile ? {maxHeight: "65vh"} : {maxHeight: "70vh"}}
        >   
            <table className="client">
                <thead>
                <tr>
                    <th onClick={()=>console.log(props.userType)}>Code</th>
                    <th>Name</th>
                    <th>Credit Unit Type</th>
                    <th>Per Unit Price</th>
                    {
                        ((props.userType && props.userType === 'AGENCY') || (utils.isSuAdmin)) &&
                        <React.Fragment>
                            <th>Cost Or Share</th>                 
                            <th>Per Unit Min Price</th>
                            <th>Sharing Type</th>
                        </React.Fragment>
                    } 
                </tr>
                </thead>
                <tbody>
                {
                    services && services.map((item,index)=>{
                        
                        return(
                            <tr key={index}>
                                <td>{item.code ? item.code : "--"}</td>
                                <td>{item.name ? item.name : "--"}</td>
                                <td>{item.creditUnitType ? item.creditUnitType : "--"}</td>
                                <td>&#8377;{item.perUnitPrice ? item.perUnitPrice : "--"}</td>     
                                    {
                                        ((props.userType && props.userType === 'AGENCY') || (utils.isSuAdmin)) &&
                                        <React.Fragment>
                                            <td>&#8377;{item.costOrShare ? item.costOrShare : "--"}</td>           
                                            <td>&#8377;{item.perUnitMinPrice ? item.perUnitMinPrice : "--"}</td>
                                            <td>{item.sharingType ? (item.sharingType === "C2B" ? "Cost to Business" : "Percentage" ): "--"}</td>
                                        </React.Fragment>
                                    } 
                            </tr>
                        )                       
                    })
                }
                {                           
                    ((services && services.length === 0) || !services) &&
                    <div className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>
                        No Data to show
                    </div>
                    
                }
                </tbody>
            </table>
            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
        </section>
        </main>
    )
}