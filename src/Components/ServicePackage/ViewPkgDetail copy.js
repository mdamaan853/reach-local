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
                            return (
                                <React.Fragment>
                                    {
                                        item.services.map((e => {                                            
                                            return (
                                                <React.Fragment>  
                                                   
                                                        <tr key={index}>
                                                            <td>{item.name ? item.name : "--"}</td>
                                                            <td>{item.code ? item.code : "--"}</td>
                                                            <td>{e.name ? e.name : "--"}</td>
                                                            <td>{e.creditUnitType ? e.creditUnitType : "--"}</td>
                                                            <td>&#8377;{e.pricePerUnit ? e.pricePerUnit : "--"}</td>
                                                            <td>{e.minCredit ? e.minCredit : "--"}</td>
                                                            <td>{e.customizable ? e.customizable : "--"}</td>
                                                            <td>&#8377;{e.perUnitMinPrice ? e.perUnitMinPrice : "--"}</td>
                                                        </tr>
                                                                          
                                                </React.Fragment>
                                            )
                                        }))
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