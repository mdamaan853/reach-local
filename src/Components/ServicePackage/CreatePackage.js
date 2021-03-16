import React from 'react';
import Popup from '../Popup/Popup';
import utils from '../../Services/utility-service';



export default class CreatePackage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addSrvc: false,
            crtSrvc: false
        }
    }

    createServices(){
        this.props.verifyServices();
       
        if(!this.props.srvc.error || this.props.srvc.error === null){       
            this.setState(state=>{
                return{
                    addSrvc: true,
                    crtSrvc: !state.crtSrvc
                }   
            })
        }
        else if(this.props.srvc.error !== null){
            this.setState({
                crtSrvc: true
            })
        }    
    }

    render() {
        return (
            <React.Fragment>
                <button className="ui icon left labeled tiny button" onClick={this.props.backToHome}><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                <div className={`${utils.isMobile ? "col-6 margin-right--auto margin-left--auto margin-top-five" : "col-12 margin-right--auto margin-left--auto"} flex flex-direction--col leadDetail-card margin-btm`}>

                    <div style={{ border: "1.5px solid #ccc", borderRadius: "5px" }}>
                        <div className="bdr-btm col-20 flex pad">
                            <h3 style={{ paddingTop: "2%" }}>Create Package</h3>
                        </div>

                        <div className="col-20 flex pad bdr-btm align-space-around">
                            <div className="text--bold text--darker">Package Name</div>
                            <input className="form-control" style={{ width: "50%" }} name="name" value={this.props.pkg.name} onChange={this.props.packgChange} />
                        </div>

                        <div className="col-20 flex pad bdr-btm align-space-around">
                            <div className="text--bold text--darker">Description</div>
                            <input name="desc" style={{ width: "50%" }} className="form-control" value={this.props.pkg.desc} onChange={this.props.packgChange} />
                        </div>
                        {/* <div className="col-20 flex pad bdr-btm align-space-around">
                            <div className="text--bold text--darker">Discount</div>
                            <input type="number" style={{ width: "50%" }} name="discount" className="form-control" value={this.props.pkg.discount} onChange={this.props.packgChange} />
                        </div> */}
                        {/* <div className="col-20 flex pad bdr-btm align-space-around">
                            <div className="text--bold text--darker">Discount Type</div>
                            <select name="discountType" style={{ width: "50%" }} className="form-control" value={this.props.pkg.discountType} onChange={this.props.packgChange}>
                                <option value="" defaultValue>--Choose--</option>
                                <option value="amt">Amount</option>
                                <option value="per">Percentage</option>
                            </select>
                        </div> */}
                        
                            {
                                this.props.pkg && this.props.pkg.error &&
                                <div className="form-error text--center">{this.props.pkg.error}</div>
                            }
                        
                        <div className="col-7 padding-btm padding-top--half text--center margin-right--auto margin-left--auto">
                            <button className="ui fluid big green button" onClick={() => this.setState({ crtSrvc:true })}>Add Services</button>
                        </div>
                    </div>
                </div>
                {
                    this.state.crtSrvc &&
                    <Popup title="Create Service" togglePopup={()=>this.setState({crtSrvc: false})}>
                         
                        <section className="flex flex-direction--col">

                            <div className="flex pad">
                                <span className="col-6" >
                                    <div className="label">Services</div>
                                    <select className="form-control" style={{ width: "75%" }}  onChange={this.props.serviceHandler}>
                                        <option value="" defaultValue>-SELECT SERVICES-</option>
                                        {
                                            this.props.services && this.props.services.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.code}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </span>
                                {/* <span className="col-6">
                                    <div className="label">Service Code</div>
                                    <div>{this.props && this.props.srvc && this.props.srvc.code ? this.props.srvc.code : "--"}</div>
                                </span> */}
                                <span className="col-6">
                                    <div className="label">Credit Unit Type</div>
                                    <div>{this.props && this.props.srvc && this.props.srvc.creditUnitType ? this.props.srvc.creditUnitType : "--"}</div>
                                </span>
                                {/* <span className="col-6">
                                    <div className="label">Minimum Credit</div>
                                    {
                                        this.props && this.props.srvc && this.props.srvc.creditUnitType === "price" &&
                                        <div>
                                            <input style={{ width: "75%" }} placeholder="Enter Minimum Credit in Rs" name="minCredit" type="number" className="form-control" onChange={(event) => this.props.handleChange(event)} value={this.props && this.props.srvc && this.props.srvc.minCredit ? this.props.srvc.minCredit : null} />
                                        </div>
                                    }
                                    {
                                        this.props && this.props.srvc && this.props.srvc.creditUnitType !== "price" &&
                                        <div>
                                            <input style={{ width: "75%" }} placeholder="Enter Minimum Quantity" name="minCredit" type="number" className="form-control" onChange={(event) => this.props.handleChange(event)} value={this.props && this.props.srvc && this.props.srvc.minCredit ? this.props.srvc.minCredit : null} />
                                        </div>
                                    }
                                </span> */}
                                <span className="col-6">
                                    <div className="label">Price Per Unit</div>
                                    <input style={{ width: "75%" }} placeholder="Enter Price" name="perUnitPrice" type="number" className="form-control" onChange={(event) => this.props.handleChange(event)} value={this.props && this.props.srvc && this.props.srvc.perUnitPrice ? this.props.srvc.perUnitPrice : null} />
                                </span>
                            </div>
                            </section>
                            
                            
                            {this.props && this.props.srvc && this.props.srvc.error && this.props.srvc.error !== null &&
                                <div className="text--center col-20 ">
                                    <div className="form-error" style={{ width: "100%" }}>{this.props && this.props.srvc && this.props.srvc.error}</div>
                                </div>
                            }
                            <div className="dialog-footer pad">
                                <button className="btn btn-success btn-fill" onClick={this.createServices.bind(this)}>Save</button>
                                {
                                    this.props.srvcArr && this.props.srvcArr.length !== 0 &&
                                    <button className="btn btn-danger btn-fill margin-left--half" onClick={()=>this.setState({crtSrvc: false})}>Close</button>
                                }
                                
                            </div> 
                        </Popup>
                    }
                    {
                        this.state.addSrvc &&
                        <React.Fragment>
                        <div className="col-20 flex flex-wrap leadDetail-card pad" style={{ border: "1.5px solid #ccc", borderRadius: "5px" }}>
                            <div className="bdr-btm col-20 flex pad">
                                <h3>Created Services</h3>
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
                                        {/* <th className="">Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {
                                        this.props.srvcArr && this.props.srvcArr.map((item, index) => {
                                            return (
                                                <React.Fragment>
                                                <tr key={index}>

                                                    <td><b>{item.name ? item.name : "--"}</b></td>


                                                    <td><b>{item.code ? item.code : "--"}</b></td>

                                                    <td className=""><b>{item.creditUnitType ? item.creditUnitType : "--"}</b></td>

                                                    {
                                                        item.creditUnitType === "price" &&
                                                        <td className="">Enter Min Credit in &#8377;
                                        <input style={{ width: "100%" }} placeholder="Enter Amount in Rs" name="minCredit" type="number" className="form-control" onChange={(event) => this.props.changeSrvcArr(event,index)} value={item.minCredit ? item.minCredit : null} />
                                                        </td>
                                                    }
                                                    {
                                                        item.creditUnitType !== "price" &&
                                                        <td className="">Enter Minimum Quantity
                                        <input placeholder="Enter Quantity" name="minCredit" type="number" className="form-control" onChange={(event) => this.props.changeSrvcArr(event,index)} value={item.minCredit ? item.minCredit : null} />
                                                        </td>
                                                    }
                                                    <td>Enter Price in &#8377;
                            <input placeholder="Enter Price" name="perUnitPrice" type="number" className="form-control" onChange={(event) => this.props.changeSrvcArr(event,index)} value={item.perUnitPrice ? item.perUnitPrice : null} /></td>
                                                    {
                                                        item.creditUnitType === "price" ?

                                                            (<td className="">
                                                                <div className="col-16 margin-left--auto margin-right--auto">
                                                                    <label>Enter Amount in &#8377; </label>
                                                                    <input type="number"
                                                                        className="form-control"
                                                                        // min="999"
                                                                        name="val"
                                                                        value={item.val ? item.val : null}
                                                                        onChange={(event) => this.props.changeSrvcArr(event,index)}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Enter Amount"
                                                                    />
                                                                </div>

                                                            </td>) :
                                                            // }

                                                            item.creditUnitType !== "price" ?

                                                                (<td className="">
                                                                    <div className="col-16 margin-left--auto margin-right--auto">
                                                                        <label>Enter Quantity </label>
                                                                        <input type="number"
                                                                            className="form-control"
                                                                            name="val"
                                                                            value={item.val ? item.val : null}
                                                                            onChange={(event) => this.props.changeSrvcArr(event,index)}
                                                                            style={{ width: '100%' }}
                                                                            placeholder="Enter Quantity"
                                                                        />
                                                                    </div>
                                                                </td>) : <td>"--"</td>
                                                    }

                                                    {
                                                        item.creditUnitType === "price" ?
                                                            (<td>
                                                                <div className="text--center text--bold">&#8377; {item.val ? item.val : "--"}</div>
                                                            </td>) :
                                                            // }
                                                            // {
                                                            (item.creditUnitType === "count" ?
                                                                (<td>
                                                                    <div className="text--center"> <span>{item.val ? item.val : "--"}</span> x <span>&#8377;{item.perUnitPrice ? item.perUnitPrice : "--"}</span> = <span className="text--bold">&#8377;{(item.val * item.perUnitPrice) > 0 ? (item.val * item.perUnitPrice).toFixed(4) : "--"}</span></div>
                                                                </td>) : <td>--</td>)
                                                    }

                                                    {/* <td><button onClick={()=>this.props.verifyServices(index,"update")} className="ui green button">Update Changes</button></td> */}
                                                </tr>
                                                {
                                                    item.error && item.error !== null &&
                                                    <tr className="text--center">       
                                                        <td colspan="6" className="form-error">{item.error}</td>                          
                                                    </tr>
                                                }
                                               
                                                </React.Fragment>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="col-7 padding-btm padding-top--half text--center margin-right--auto margin-left--auto">
                            <button className="ui fluid big green button" onClick={this.props.create}>Save</button>
                        </div>
                        </React.Fragment>
                    }                
            </React.Fragment>
        )
    }
}