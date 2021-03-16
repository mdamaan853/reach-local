import React from 'react';
import utils from '../../Services/utility-service';
// import CircularLoader from '../../circular-loader/circular-loader';

export default function ManagePackageDetail (props){
    
        return(
            <React.Fragment>  
                <section className={`${utils.isMobile ? "flex-direction--col": "flex-direction--row"} flex`}>
                
                <article className="card-custom leads-table-wrapper mar--half margin-btm pad--half" style={ utils.isMobile ? {maxHeight: "60vh",border: '1px solid #eeeeee',borderRadius: '12px',alignItems:'center'} : {maxHeight: "70vh",border: '1px solid #eeeeee',borderRadius: '12px',alignItems:'center'}}>
                        <table className="client">
                        <thead>
                            <tr className="text--center">
                                <th>Service Name</th>
                                <th>Unit Type</th>
                                <th>Assigned Credit</th>
                                <th>Total Price</th>
                                <th>Per Unit Price</th>
                                <th>Available Credit</th>
                                <th>Consumed Credit</th>
                            </tr> 
                        </thead> 
                        <tbody>  
                        {
                            props.listArr && props.listArr.subscriptionServiceMappings && props.listArr.subscriptionServiceMappings.map((item,index)=>{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                            return(
                                <tr key={index} className="text--center">
                                    <td><b>{item.serviceName ? item.serviceName : "--"}</b></td>
                                    <td>{item.creditUnitType ? item.creditUnitType : "--"}</td>
                                    <td>{item.assignedCredit ? item.assignedCredit:"--"}</td>
                                    <td>&#8377;{item.price ? item.price:"--"}</td>   
                                    <td>&#8377;{item.perUnitPrice ? item.perUnitPrice : "--"}</td>
                                    <td>{item.availableCredit ? item.availableCredit:"--"}</td>
                                    <td>{item.consumedCredit ? item.consumedCredit : "--"}</td>
                                </tr> 
                                );          
                            })     
                        }        
                        </tbody>
                    </table>                                
                </article> 
                {/* <section className="dialog-footer pad">  */}
                    <article className={`${utils.isMobile ? "col-20 margin-top-five": "col-6 margin-left"} flex flex-direction--col card-custom flex-wrap leadDetail-card pad--half margin-right--half`} style={{border: '1px solid #eeeeee',borderRadius: '12px',alignItems:'center'}}>
                        <div className="bdr-btm col-20 flex pad">
                            <h3>Order Summary</h3>
                        </div>
                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                            <div className="text--bold text--darker">Total Amount</div>
                                <div className="text--bold text--darker">&#8377; {props.listArr && props.listArr.price}</div>
                        </div>
                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                            <div className="text--bold text--darker">Taxable Amount</div>
                                <div className="text--bold text--darker">&#8377; {props.listArr && props.listArr.taxAmount}</div>
                        </div>
                        <div className="col-20 flex pad bdr-btm flex-space--btw">
                            <div className="text--bold text--darker">Payable Amount</div>
                                <div className="text--bold text--darker"> &#8377; {props.listArr && props.listArr.totalPrice}</div>
                        </div>
                        {/* <div><button onClick={props.togglePopup} className="btn btn-fill dialog--cta pointer">CLOSE</button> </div> */}
                        </article>
                  
                
                </section>                             
            </React.Fragment>
        );
   
}