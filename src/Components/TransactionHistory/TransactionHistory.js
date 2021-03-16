import React, {Component} from 'react';
import {fetchTxnHistory} from '../../Services/subscriptions-service';
import {getAllClients,getAgency} from '../../Services/clients-service';
import Pagination from '../../Components/Pagination/Pagination';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import { ToastsStore } from 'react-toasts';
//import {getBusinessDetails} from '../../Services/user-service';
import Popup from '../Popup/Popup';
import DatePicker from "react-datepicker";


const initialState = {
    history:[],
    clients:[],
    agencies:[],
    start: 0,
    loader: false,
    hasNext:true,
    filtersApplied:false,
    showFilters:false,
    businessUid:"",
    clientType:"Agency",
    formControls:{
        from:{
            value:""
        },
        to:{
            value:""
        },
        et:{
            value:"",
            error:""
        },
        agency:{
            value:""
        },
        client:{
            value:""
        }    
    }
}

class TransactionHistory extends Component {
    
    constructor(){
        super(); 
        this.state = initialState;
        this.clearClient = this.clearClient.bind(this);
        this.clearAgency = this.clearAgency.bind(this);
        this.checkedHandler = this.checkedHandler.bind(this);
    }

    componentDidMount(){
        this.getTxnHistory();
        // getBusinessDetails()
        // .then(response => response.json())
        // .then(data => {
        //    if (data.success && !!data.uid) {
        //       this.setState({
        //           businessUid: data.uid
        //       },()=>this.getTxnHistory()); 
        //    }
        // }).catch(error => {
        //    console.log(error);
        // })
    }
    
    getTxnHistory(){
        let body = {
            start: this.state.start,
            maxResults: 30,
            businessUid: this.state.businessUid
        }
        if(this.state.formControls.et.value){
            body.eventType = this.state.formControls.et.value;
        }
        if(this.state.formControls.from.value){
            body.startDate = this.state.formControls.from.value;
        }
        if(this.state.formControls.to.value){
            body.endDate = this.state.formControls.to.value;
        }
        if(this.state.formControls.agency.value){
            body.agencyBusinessUid = this.state.formControls.agency.value;
        }
        if(this.state.formControls.client.value){
            body.businessUid = this.state.formControls.client.value;
        }
        this.setState({
            loader: true
        })
        fetchTxnHistory("?"+utils.jsonToQueryString(body))
        .then((response)=>response.json())
        .then(data=>{
            if(data.success){
                if(data.txns && data.txns.length > 0){
                    this.setState({
                        history: data.txns,
                        hasNext: (data.txns.length === 30)
                    })
                }else{
                    this.setState({
                        history: data.txns,
                        hasNext: false
                    })
                }                    
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                loader: false
            })
        })
        .catch(error=>{
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
            this.setState({
                loader: false
            })
        })
    }

    historyNav(type){
        if(type === 'previous'){
            if(this.state.start > 0){
                this.setState({
                    start: this.state.start - 30,
                },()=>{
                    this.getTxnHistory();
                })
            }
        }else if(type === 'next'){
            if(this.state.hasNext){
                this.setState({
                    start: this.state.start + 30,
                },()=>{
                    this.getTxnHistory();
                })
            }
        }
    }

    showFilters(){
        this.setState({
            showFilters: true
        })
        if(utils.isSuAdmin){
           this.fetchClient();
           this.fetchAgency();
        }
        else if(this.props.userType  === "AGENCY" ){
            this.fetchClient();
        }
    }

    fetchClient(){
        let body={}
        getAllClients(body)
        .then(res => res.json())
        .then(data =>{
            if(data.success){
                this.setState({
                    clients: data.clients
                })    
            }
            // console.log(this.state.clients);
        }) 
        .catch(error=>{
            console.log(error);
        }) 
    }

    fetchAgency(){
        let body={}
        getAgency(body)
        .then(res => res.json())
        .then(data => {
            if(data.success){
                this.setState({
                    agencies:data.clients
                })
            }
            else{
                ToastsStore.error(data.message);
            }
            // console.log(this.state.agencies);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    closeFilters(){
        this.setState({
            showFilters: false
        })
    }

    dateChange(event,name){
        let temp = this.state.formControls;
        if(name === 'from'){
            temp.from.value = event;
        }else{
            temp.to.value = event;
        }
        this.setState({
            formControls:temp
        })
    }
    clearClient(){
        let temp = this.state.formControls;
        temp.client.value = "";
        this.setState({
            formControls: temp
        })
        // console.log(this.state.formControls);
    }

    clearAgency(){
        let temp = this.state.formControls;
        temp.agency.value = "";
        this.setState({
            formControls: temp
        })
        // console.log(this.state.formControls);
    }

    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            formControls: {
                    ...this.state.formControls,
                    [name]: {
                    ...this.state.formControls[name],
                    value
                    }
            }
        });
    }

    checkedHandler(event){
        this.setState({
            clientType: event.target.value
        })
    }

    applyFilters(){
        let temp = this.state.formControls;
       
        if(utils.isSuAdmin){
            if(!temp.from.value && !temp.to.value && !temp.et.value && !temp.agency.value && !temp.client.value){
                temp.et.error = "No Filter Choosed."
                this.setState({
                    formControls: temp
            })
            return;
            }
        }else{
            if(!temp.from.value && !temp.to.value && !temp.et.value  && !temp.client.value){
                temp.et.error = "No Filter Choosed."
                this.setState({
                    formControls: temp
                })
                return;
            }
        }
        if((temp.from.value && !temp.to.value) || (!temp.from.value && temp.to.value) ){
            temp.et.error = "Please choose both Start and End Date to apply filter."
            this.setState({
                formControls: temp
            })
            return;
        }
        if(temp.et.value || (temp.from.value && temp.to.value) || temp.agency.value || temp.client.value){
            temp.et.error = ""
            this.setState({
                formControls: temp,
                showFilters: false,
                filtersApplied: true
            },()=>{
                this.getTxnHistory();
            })
        }
    }

    clearFilters(){
        this.setState({
            formControls: {
                from:{
                    value:""
                },
                to:{
                    value:""
                },
                et:{
                    value:"",
                    error:""
                },
                agency:{
                    value:""
                },
                client:{
                    value:""
                }
            },
            showFilters: false,
            filtersApplied: false
        },()=>{
            this.getTxnHistory();
        })
    }

    render(){
        return(
            <React.Fragment>
                <div className="flex col-20">
                    <div className="margin-left--auto margin-right">
                        {
                            this.state.filtersApplied &&
                            <button onClick={() => this.clearFilters()} className="ui tiny grey button margin-right--half">Clear Filters</button>                            
                        }
                        <button onClick={() => this.showFilters()} className="ui tiny teal button margin-left--half">Filter</button>
                    </div>
                </div>
                <div className="margin-top" style={{marginBottom:'-15px'}}>
                    <Pagination
                        getData={this.historyNav.bind(this)}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.history}
                        loader={this.state.loader} 
                    />
                </div>
                <section className="padding-top" style={{overflow:'auto'}}>
                <div className="margin-top leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "65vh"} : {maxHeight: "70vh"}}
                >
                    <table className="client">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Transaction Type</th>
                                    <th>Amount</th>    
                                    <th>Tax</th>   
                                    <th>Discount</th>    
                                    <th>Total Amount</th>   
                                    {/* <th>Credit</th>
                                    <th>Debit</th> */}
                                    <th>Balance</th>
                                    {
                                        utils.isSuAdmin &&
                                        <React.Fragment>
                                            <th>Client</th> 
                                            <th>Agency</th>
                                        </React.Fragment>
                                    }
                                    {  this.props.userType && this.props.userType  === "AGENCY" &&
                                        <th>Client</th>
                                    }
                                    <th>Event</th>
                                    <th>Ref Code</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>    
                            <tbody>
                            {   this.state.history.length>0 &&
                                this.state.history.map((item,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td><Moment format="DD-MM-YYYY HH:mm">{item.created}</Moment></td>
                                            <td>{item.txnType}</td>
                                            <td>{item.amount}</td>
                                            <td>{item.tax}</td>
                                            <td>{item.discount}</td>
                                            <td>{item.creditDebit}</td>
                                            {/* <td>{item.credit}</td>
                                            <td>{item.debit}</td> */}
                                            <td>{item.balanceCredit}</td>
                                            {
                                                utils.isSuAdmin &&
                                                <React.Fragment>
                                                    <td>{item.business.name}</td> 
                                                    <td>{item.agency.name}</td>
                                                </React.Fragment>
                                            }
                                            {  this.props.userType && this.props.userType  === "AGENCY" &&
                                               <td>{item.business.name}</td>
                                            }
                                            <td>{item.event}</td>
                                            <td>{item.refCode}</td>
                                            <td>{item.remarks}</td>
                                        </tr> 
                                    );
                                })
                            }
                            </tbody>
                    </table>
                    {
                        this.state.history.length === 0 && <div className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>No History Found</div>
                    }
                    </div>
                </section>
                <Pagination
                    getData={this.historyNav.bind(this)}
                    start={this.state.start}
                    hasNext={this.state.hasNext}
                    data={this.state.history}
                    loader={this.state.loader} 
                />
                {
                    this.state.showFilters &&
                    <Popup title={'Filters'} togglePopup={this.closeFilters.bind(this)}>
                        <div style={{padding:'20px'}}>
                            <div className="flex col-20">
                                <div className="col-10">
                                    <div className="label">Start Date:</div>
                                    <DatePicker
                                        selected={this.state.formControls.from.value}
                                        placeholderText="Click to select Date"
                                        onChange={event => {this.dateChange(event,'from')}}
                                        peekNextMonth
                                        // showMonthDropdown
                                        // showYearDropdown
                                        dropdownMode="select"
                                        className="col-20"
                                    />
                                </div>
                                <div className="col-9 margin-left">
                                    <div className="label">End Date:</div> 
                                    <DatePicker
                                        selected={this.state.formControls.to.value}
                                        placeholderText="Click to select Date"
                                        onChange={event => {this.dateChange(event,'to')}}
                                        peekNextMonth
                                        // showMonthDropdown
                                        // showYearDropdown
                                        dropdownMode="select"
                                        className="col-20"
                                    />
                                </div> 
                            </div>
                             {
                                utils.isSuAdmin &&
                            <React.Fragment>
                                <div className= "margin-top--double">
                                    <label for="smsRadio" className="radioBtn">
                                        <input type="radio" name="clientType" 
                                        checked={this.state.clientType === "Agency"} 
                                        value="Agency" id="smsRadio" 
                                        onChange={this.checkedHandler}
                                        onClick={this.state.formControls.client.value ? this.clearClient : null}
                                        />Agency
                                        <span className="checkmark1"></span>
                                    </label>
                                    <label for="customSms" className="radioBtn">
                                        <input type="radio" name="clientType"
                                        checked={this.state.clientType && this.state.clientType === "Client"} 
                                        id="customSms" value="Client" 
                                        onClick={this.state.formControls.agency.value ? this.clearAgency : null}
                                        onChange={this.checkedHandler}
                                        />Client
                                        <span className="checkmark1"></span>
                                    </label>
                                </div>
                               

                                <div className="flex col-20">
                                    <div className="col-10">
                                        <div className="label">Agency</div>
                                        <select className="form-control"
                                                name="agency"
                                                value={this.state.formControls.agency.value} 
                                                onChange={this.changeHandler}
                                                disabled={this.state.clientType &&this.state.clientType === "Client" ? true: false}>
                                                <option value="" defaultValue>-SELECT-</option>
                                                {
                                                    this.state.agencies && this.state.agencies.map(client=>{
                                                        return(
                                                            <option value={client.uid}>{client.name}</option>
                                                        )
                                                    })
                                                }
                                        </select>
                                        {/* {
                                            this.state.formControls.agency.error &&
                                            <div className="form-error text--center">{this.state.formControls.agency.error}</div>
                                        } */}
                                    </div>
                                    <div className="col-9 margin-left">
                                        <div className="label">Client</div>
                                        <select className="form-control"
                                                name="client"
                                                value={this.state.formControls.client.value} 
                                                onChange={this.changeHandler}
                                                disabled={this.state.clientType && this.state.clientType === "Agency" ? true: false}>
                                                <option value="" defaultValue>-SELECT-</option>
                                            {
                                                    this.state.clients && this.state.clients.map(client=>{
                                                        return(
                                                            <option value={client.uid}>{client.name}</option>
                                                        )
                                                    })
                                            }
                                        </select>
                                        {/* {
                                            this.state.formControls.client.error &&
                                            <div className="form-error text--center">{this.state.formControls.client.error}</div>
                                        } */}
                                    </div>
                                </div>
                            </React.Fragment>
                            }
                            {
                                this.props.userType && this.props.userType  === "AGENCY" &&
                                    <div className="col-9 margin-btm margin-left--auto margin-right--auto margin-top--double">
                                        <div className="label">Client</div>
                                        <select className="form-control"
                                                name="client"
                                                value={this.state.formControls.client.value} 
                                                onChange={this.changeHandler}>
                                                <option value="" defaultValue>-SELECT-</option>
                                                {
                                                    this.state.clients && this.state.clients.map(client=>{
                                                        return(
                                                            <option value={client.uid}>{client.name}</option>
                                                        )
                                                    })
                                                }
                                        </select>
                                        {/* {
                                            this.state.formControls.client.error &&
                                            <div className="form-error text--center">{this.state.formControls.client.error}</div>
                                        } */}
                                    </div>
                            }
                            <div className="col-9 margin-btm margin-left--auto margin-right--auto margin-top--double">
                                <div className="label">Event Type</div>
                                <select className="form-control"
                                        name="et"
                                        value={this.state.formControls.et.value} 
                                        onChange={this.changeHandler}>
                                        <option value="" defaultValue>-SELECT Event Type-</option>
                                        <option value="Campaign">Campaign</option>
                                        <option value="Subscription">Subscription</option>
                                        <option value="Buy Credit">Buy Credit</option>
                                        <option value="Manual Payment">Manual Payment</option>
                                </select>
                                {
                                    this.state.formControls.et.error &&
                                    <div className="form-error text--center">{this.state.formControls.et.error}</div>
                                }
                            </div>
                            <div className="dialog-footer margin-top--double" style={{padding:'25px'}}>   
                                <button className="btn btn-fill dialog--cta pointer" onClick={()=>this.closeFilters()}>
                                    Back
                                </button>
                                {
                                    this.state.filtersApplied &&
                                    <button onClick={() => this.clearFilters()} className="button grey margin-left margin-right--half tiny ui">Clear Filters</button>                            
                                }                    
                                <button onClick={()=>this.applyFilters()} className="btn btn-fill btn-success dialog--cta margin-left--half pointer">Apply Filters</button>
                            </div>        
                        </div>
                    </Popup>
                }
            </React.Fragment>
        );
    }
}

export default TransactionHistory;