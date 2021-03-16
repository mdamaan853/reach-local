import React from 'react';
import SvgIcon from '../Svg-icon/Svg-icon';
import utils from '../../Services/utility-service';
// import CircularLoader from '../circular-loader/circular-loader';

function DatasourceTable (props){
    // render(){
        return(
            <section className="leads-table-wrapper" 
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >          
                <table className="client">
                    <thead>
                        <tr>
                            <th>Medium Name</th>
                            <th>Datasource Name</th>
                            <th>Client Price</th>
                            <th>Minimum Credits Per Campaign</th>
                            <th>Billing On</th>
                            {/* {
                                props.source === 'Agency' &&
                                <React.Fragment> */}
                                    <th>Agency Minimum Price</th>
                                    <th>Agency Cost Or Share</th>
                                    <th>Agency Sharing Type</th>
                                {/* </React.Fragment>    
                            } */}
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {    
                            props.datasources.map((item,index)=>{ 
                               
                            return(
                                <tr key={index}>
                                    <td>{item.mediumName}</td>
                                    <td>{item.agName}</td>
                                    <td>{item.pricePerCredit}</td>
                                    <td>{item.minCreditPerCampaign}</td>
                                    <td>{item.billingOn}</td> 
                                    {/* {
                                       props.source === 'Agency' &&
                                        <React.Fragment> */}
                                            <td>{item.minPrice}</td>
                                            <td>{item.costOrShare}</td>
                                            <td>
                                                { 
                                                    !!item.sharingType &&
                                                    <span>{item.sharingType === "PER" ? "Percentage" : "Cost to Business"}</span> 
                                                }
                                            </td>
                                        {/* </React.Fragment>    
                                    } */}
                                    <td>{item.status}</td> 
                                    <td>
                                    { 
                                        props.allowedSubActions.map((item,subIndex) => {
                                            return(
                                                <div key={subIndex} className="padding-btm--half padding-left--half pointer">
                                                    {
                                                        item === "map-B-AG" &&
                                                        <div onClick={() => props.tableAction(index,"account-plus")}><SvgIcon icon={"account-plus"} classes={'svg--lg'}></SvgIcon></div>        
                                                    }
                                                    {
                                                        item === "unmap-B-AG" &&
                                                        <div onClick={() => props.tableAction(index,"account-minus")}><SvgIcon icon={"account-minus"} classes={'svg--lg'}></SvgIcon></div>
                                                    }
                                                    {   props.userType !=="AGENCY" &&
                                                        item === "map-S-AG" &&
                                                        <div onClick={() => props.tableAction(index,"funnel")}><SvgIcon icon={"funnel"} classes={'svg--lg'}></SvgIcon></div>
                                                    }
                                                    {   props.userType !=="AGENCY" &&
                                                        item === "edit-AG" &&
                                                        <div onClick={() => props.tableAction(index,"database-edit")}><SvgIcon icon={"database-edit"} classes={'svg--lg'}></SvgIcon></div>
                                                    }
                                                    {   props.userType !=="AGENCY" &&
                                                        item === "delete" &&
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
                {/* {
                    this.props.datasources.length === 0 &&
                    <div className="margin-btm margin-top">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                } */}
            </section>          
        );
    // } 
}

export default DatasourceTable;