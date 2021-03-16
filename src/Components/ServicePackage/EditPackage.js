import React from 'react';
import utils from '../../Services/utility-service';
 


export default class EditPackage extends React.Component{
  
  

    render(){
        return(
            <React.Fragment>
                {
                    this.props.backToHome &&
                    <button className="ui icon left labeled tiny button" onClick={this.props.backToHome}><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                }
                
                    <div className={`${utils.isMobile ? "col-6 margin-right--auto margin-left--auto margin-top-five": "col-12 margin-right--auto margin-left--auto"} flex flex-direction--col leadDetail-card margin-btm`}>
                        
                        <div style={{border:"1.5px solid #ccc", borderRadius:"5px"}}>
                            <div className="bdr-btm col-20 flex pad">
                                <h3 style={{paddingTop:"2%"}}>Edit Package</h3>
                            </div>

                            <div className="col-20 flex pad bdr-btm align-space-around">
                                <div className="text--bold text--darker">Package Name</div>
                                <input className="form-control" style={{width:"50%"}} name="name" value={this.props.pkg && this.props.pkg.name} onChange={this.props.packgChange}/>
                            </div>
                            
                            <div className="col-20 flex pad bdr-btm flex-space--btw">
                                <div className="col-9 flex-horz-center">
                                    <div className="text--bold text--darker" style={{padding:"0 24%"}}>Package Code</div>
                                </div>
                                <div className="col-11 flex-horz-center">
                                    <div className="text--bold text--darker text--center">{this.props.pkg && this.props.pkg.code}</div>
                                </div>
                            </div>
                            <div className="col-20 flex pad bdr-btm align-space-around">
                                    <div className="text--bold text--darker">Description</div>
                                        <input name="desc" style={{width:"50%"}} className="form-control" value={this.props.pkg && this.props.pkg.desc} onChange={this.props.packgChange} />
                            </div>
                            {/* <div className="col-20 flex pad bdr-btm align-space-around">
                                <div className="text--bold text--darker">Discount</div>
                                    <input type="number" style={{width:"50%"}} name="discount" className="form-control" value={this.props.pkg.discount} onChange={this.props.packgChange}/>
                            </div> */}
                            {/* <div className="col-20 flex pad bdr-btm align-space-around">
                                <div className="text--bold text--darker">Discount Type</div>
                                    <select name="discountType" style={{width:"50%"}} className="form-control" value={this.props.pkg.discountType} onChange={this.props.packgChange}>
                                        <option value="" defaultValue>--Choose--</option>
                                        <option value="amt">Amount</option>
                                        <option value="per">Percentage</option>
                                    </select>
                            </div> */}
                        </div> 
                    </div>
            
            <div className="col-20 flex flex-wrap leadDetail-card pad" style={{border:"1.5px solid #ccc", borderRadius:"5px"}}>
                <div className="bdr-btm col-20 flex pad">
                    <h3 onClick={()=>console.log(this.props.pkg)}>Services</h3>
                </div>
                <table className="ui celled table">
                    <thead className="">
                        <tr className="text--center">
                            <th className="">Service Name</th>
                            <th className="">Service Code</th>
                            <th className="">Credit Unit Type</th>
                            <th className="">Min Credit</th>
                            <th className="">Price per Unit</th>
                            <th className="">Quantity/Price</th>
                            <th className="">Payable Amount</th>
                        </tr> 
                    </thead> 
                    <tbody className="">                     
                        {
                            this.props.pkg && this.props.pkg.services && this.props.pkg.services.map((item,index)=>{
                                return(
                                    <React.Fragment>
                                    <tr>
                                        <td className=""><b>{item.name}</b></td>
                                        <td className=""><b>{item.code}</b></td>
                                        <td className=""><b>{item.creditUnitType}</b></td>
                                        
                                        {
                                            item.creditUnitType === "price" &&
                                                <td className="">
                                                    <label>Enter min credit amount in &#8377;</label>
                                                    <input style={{width:"100%"}} placeholder="Enter Amount in Rs" name="minCredit" type="number" className="form-control" onChange={(event)=>this.props.handleChange(event,index)} value={item.minCredit}/>  
                                                </td>
                                        }
                                        {
                                            item.creditUnitType !== "price" &&
                                                <td className="">
                                                    <label>Enter min credit count</label>
                                                    <input placeholder= "Enter Quantity" name="minCredit" type="number" className="form-control" onChange={(event)=>this.props.handleChange(event,index)} value={item.minCredit}/>    
                                                </td>
                                        }
                                        <td><label>Enter per unit price in &#8377;</label>
                                            <input name="pricePerUnit" placeholder="Enter per unit price" onChange={(event)=>this.props.handleChange(event,index)}  type="number"  className="form-control" value={item.pricePerUnit}/></td>
                                        {
                                            item.creditUnitType === "price" &&
                                        
                                            <td className="">
                                                <div className="col-16 margin-left--auto margin-right--auto">
                                                    <label>Enter Amount in &#8377; </label>
                                                    <input  type="number"
                                                        className="form-control"
                                                        // min="999"
                                                        name="val"
                                                        value={item.val ? item.val : null}
                                                        onChange={(event)=>this.props.handleChange(event,index)}
                                                        style={{width:'100%'}}
                                                        placeholder="Enter Amount" 
                                                    />
                                                </div>
                                                {/* { item.error && item.error !== null &&
                                        // <tr className="text--center">
                                                    <div className="form-error" style={{width:"100%"}}>{item.error}</div>
                                        // </tr>
                                    } */}
                                            </td>
                                        }
                                        {
                                            item.creditUnitType !== "price" &&
                                        
                                            <td className="">
                                                <div className="col-16 margin-left--auto margin-right--auto">
                                                    <label>Enter Quantity </label>
                                                    <input  type="number"
                                                        className="form-control"
                                                        name="val"
                                                        value={item.val ? item.val : null}
                                                        onChange={(event)=>this.props.handleChange(event,index)}
                                                        style={{width:'100%'}}
                                                        placeholder= "Enter Quantity"
                                                    />
                                                </div>
                                                {/* { item.error && item.error !== null &&
                                                    // <tr className="text--center">
                                                        <div className="form-error" style={{width:"100%"}}>{item.error}</div>
                                                    // </tr>
                                    } */}
                                            </td>
                                        }
                                        
                                        {
                                            item.creditUnitType === "price" &&
                                            <td>
                                                <div className="text--center text--bold">&#8377; {item.val}</div>
                                            </td>   
                                        }
                                        {
                                            item.creditUnitType === "count" &&
                                            <td>
                                                <div className="text--center"> <span>{item.val}</span> x <span>&#8377;{item.pricePerUnit}</span> = <span className="text--bold">&#8377;{(item.val * item.pricePerUnit) >0 ? (item.val * item.pricePerUnit).toFixed(4) : null}</span></div>
                                            </td>   
                                        }
                                    </tr>
                                    {
                                        item.error && item.error !== null && item.error !== undefined &&
                                        <tr className="text--center">
                                            <td colspan="7" className=" form-error">{item.error}</td>
                                        </tr>
                                    }                                   
                                    </React.Fragment>
                                );
                            })       
                        }                        
                    </tbody>
                </table>
            </div>
            {
                this.props.editPkg &&
                <div className="col-7 padding-btm padding-top--half text--center margin-right--auto margin-left--auto">
                    <button className="ui fluid big green button" onClick={()=>this.props.editPkg("edit")}>Save Package</button>
                </div>
            }
            
            {
                this.props.assign &&
                <div className="col-7 padding-btm padding-top--half text--center margin-right--auto margin-left--auto">
                    <button className="ui fluid big green button" onClick={this.props.assign}>Assign Package</button>
                </div>
            }
            
            </React.Fragment>
        )
    }
}
