import React, { useState, useEffect } from 'react';
import utils from '../../Services/utility-service';
import { getAllServicePackages } from '../../Services/subscriptions-service';
import { ToastsStore, ToastsContainerPosition, ToastsContainer } from 'react-toasts';



export default function ViewPkgDetail(props) {
    const [pkg, setPkg] = useState(null);
    
    useEffect(() => {

        const body = { businessUid: props.id }
        getAllServicePackages(body)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setPkg(data.servicePackages);
                } else {
                    ToastsStore.error(data.message);
                }
            })
            .catch(e => {
                console.log(e);
                ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            })

    },[props.id])

    return (
        <section className="margin-top leads-table-wrapper"
            style={utils.isMobile ? { maxHeight: "65vh" } : { maxHeight: "70vh" }}
        >
            <h3>List of Assigned Packages</h3>
            <table className="client">
                <thead>
                    <tr>
                        <th rowSpan="2">Package Name</th>
                        <th rowSpan="2">Package Code</th>
                        <th colSpan="6">Package Services</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Credit Unit Type</th>
                        <th>PerUnitPrice</th>
                        <th>Min Credit  </th>
                        <th>Customizable</th>
                        <th>Per Unit Min Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pkg && pkg.map((item, index) => { 
                            let ser=[];
                            return (
                                <React.Fragment> 
                                    <tr key={index}>
                                        {
                                            item.services && item.services.length && item.services.length>=1 &&
                                            <React.Fragment>
                                                <td rowSpan={item.services.length}>{item.name ? item.name : "--"}</td>
                                                <td rowSpan={item.services.length}>{item.code ? item.code : "--"}</td>
                                            </React.Fragment>
                                        }
                                        {
                                            item.services && item.services.length === 0 && 
                                            <React.Fragment>
                                                <td>{item.name ? item.name : "--"}</td>
                                                <td>{item.code ? item.code : "--"}</td>
                                            </React.Fragment>
                                        }
                                        <td>{item.services && item.services[0] && item.services[0].name ? item.services[0].name : "--"}</td>
                                        <td>{item.services && item.services[0] && item.services[0].creditUnitType ? item.services[0].creditUnitType : "--"}</td>
                                        <td>&#8377;{item.services && item.services[0] && item.services[0].pricePerUnit ? item.services[0].pricePerUnit : "--"}</td>
                                        <td>{item.services && item.services[0] && item.services[0].minCredit ? item.services[0].minCredit : "--"}</td>
                                        <td>{item.services && item.services[0] && item.services[0].customizable ? item.services[0].customizable : "--"}</td>
                                        <td>&#8377;{item.services && item.services[0] && item.services[0].perUnitMinPrice ? item.services[0].perUnitMinPrice : "--"}</td>
                                    </tr>
                                    {
                                        (function (){
                                            if(item.services.length>1){
                                            for( let i=1; i<item.services.length; i++){
                                               let row=(
                                                    <tr>
                                                        <td>{item.services[i].name ? item.services[i].name : "--"}</td>
                                                        <td>{item.services[i].creditUnitType ? item.services[i].creditUnitType : "--"}</td>
                                                        <td>&#8377;{item.services[i].pricePerUnit ? item.services[i].pricePerUnit : "--"}</td>
                                                        <td>{item.services[i].minCredit ? item.services[i].minCredit : "--"}</td>
                                                        <td>{item.services[i].customizable ? item.services[i].customizable : "--"}</td>
                                                        <td>&#8377;{item.services[i].perUnitMinPrice ? item.services[i].perUnitMinPrice : "--"}</td>
                                                    </tr>
                                                )
                                                ser.push(row)
                                            }       
                                        }})()
                                    } 
                                    { item.services && item.services.length && item.services.length>1 &&
                                       <React.Fragment>{ser}</React.Fragment>
                                    }                             
                                </React.Fragment>
                            )
                        })
                    }
                    {
                        props.pkg && props.pkg.length === 0 &&
                        <tr className="margin-btm margin-top" style={{ textAlign: 'center', fontSize: 'small' }}>
                            No Package is assigned till now.
                        </tr>
                    }
                </tbody>
            </table>
            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
        </section>
    );

}