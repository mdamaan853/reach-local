import React from 'react';
import {getRevenueSummary,getRevenue} from '../../Services/shortUrl-service';
//import {getBusinessDetails} from '../../Services/user-service';
import utils from '../../Services/utility-service';
import {getAllClients,getAgency} from '../../Services/clients-service';
import Popup from '../Popup/Popup';
import { ToastsStore } from 'react-toasts';
import RevenueFilter from './RevenueFilter';
import RevenueTable from './RevenueTable';
import Pagination from '../Pagination/Pagination';
import Youtube from '../../Components/Youtube/Youtube';
import './Revenue.css';


export default class Revenue extends React.Component{

    constructor(props){
        super(props);
        this.state={
            businessUid:null,
            revenueHis:[],
            clients:[],
            agencies:[],
            loader:false,
            showFilter:false,
            totalClientTxn:"",
            totalRevenues:"",
            filtersApplied:false,
            start:0,
            howTo:false,
            hasNext: null,
            clientType:"Agency",
            revenue:{
                from:{
                    value:"",
                    
                },
                to:{
                    value:"",
                    
                },
                et:{
                    value:"",
                    error:""
                },
                client:{
                    value:"",
                    
                },
                agency:{
                    value:""
                }
            }
        }
        
        this.pagination = this.pagination.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.clearAgency = this.clearAgency.bind(this);
        this.clearClient = this.clearClient.bind(this);
        this.fetchRevenue = this.fetchRevenue.bind(this);
        this.clearFilters = this.clearFilters.bind(this);   
        this.changeHandler = this.changeHandler.bind(this);
        this.checkedHandler = this.checkedHandler.bind(this);
        this.fetchAllClients = this.fetchAllClients.bind(this);
        this.fetchRevenueSummary = this.fetchRevenueSummary.bind(this);   
    }

    componentDidMount(){
        this.fetchRevenue();
        this.fetchRevenueSummary();
        // getBusinessDetails()
        // .then(response => response.json())
        // .then(data => {
        //    if (data.success && !!data.uid) {
        //       this.setState({
        //           businessUid: data.uid
        //       },()=>{this.fetchRevenue();this.fetchRevenueSummary();}); 
        //    }
        // }).catch(error => {
        //    console.log(error);
        // })
        
    }

    checkedHandler(event){
        this.setState({
            clientType: event.target.value
        })
    }

    fetchAllClients(){
        let body={};
        getAllClients(body)
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.setState({
                    clients: res.clients
                })
            }else{
                ToastsStore.error(res.message);
            }
        })
        .catch(err => {
            console.log(err);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
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

    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            revenue: {
                    ...this.state.revenue,
                    [name]: {
                    ...this.state.revenue[name],
                    value
                    }
            }
        });
    }

    clearFilters(){
        this.setState({
            revenue: {
                from:{
                    value:"",
                   
                },
                to:{
                    value:"",
                    
                },
                et:{
                    value:"",
                    error:""
                },
                client:{
                    value:"",
                   
                },
                agency:{
                    value:""
                }
            },
            showFilter: false,
            filtersApplied: false
        },()=>{
            this.fetchRevenue();
            this.fetchRevenueSummary();
        })
    }

    pagination(type){
        if(type === 'next'){
            if(this.state.hasNext){
                this.setState(state=>{
                    return{
                        start: state.start+20
                    }  
                },this.fetchRevenue)
            }
        }
        else if(type === 'previous'){
            this.setState(state=>{
                return{
                    start: state.start-20
                }
            },this.fetchRevenue)
        }
    }

    dateChange(event,name){
        let temp = this.state.revenue;
        if(name === 'from'){
            temp.from.value = event;
        }else{
            temp.to.value = event;
        }
        this.setState({
            revenue:temp
        })
    }

    clearClient(){
        let temp = this.state.revenue;
        temp.client.value = "";
        this.setState({
            revenue: temp
        })
       
    }

    showVideo(){
        this.setState({
            howTo: !this.state.howTo
        })
    }

    clearAgency(){
        let temp = this.state.revenue;
        temp.agency.value = "";
        this.setState({
            revenue: temp
        })     
    }

    applyFilters(){
        let temp = this.state.revenue;
       
        if(utils.isSuAdmin){
            if(!temp.from.value && !temp.to.value && !temp.et.value && !temp.agency.value && !temp.client.value){
                temp.et.error = "No Filter Choosed."
                this.setState({
                    revenue: temp
                })
            return;
            }
        }else{
            if(!temp.from.value && !temp.to.value && !temp.et.value && !temp.client.value){
                temp.et.error = "No Filter Choosed."
                this.setState({
                    revenue: temp
                })
                return;
            }
        }
        
        if((temp.from.value && !temp.to.value) || (!temp.from.value && temp.to.value) ){
            temp.et.error = "Please choose both Start and End Date to apply filter."
            this.setState({
                revenue: temp
            })
            return;
        }
        if(temp.et.value || (temp.from.value && temp.to.value) || temp.agency.value || temp.client.value){
            temp.et.error = ""
            this.setState({
                formControls: temp,
                showFilter: false,
                filtersApplied: true
            },()=>{
                this.fetchRevenue("closeFilter");
                this.fetchRevenueSummary("closeFilter");
            })
        }
    }

    fetchRevenueSummary(cl){
        const body={
        businessUid: this.state.businessUid,
        endDate: this.state.revenue.to.value ? this.state.revenue.to.value: null,
        eventType: this.state.revenue.et.value ? this.state.revenue.et.value : null,
        maxResults: 20,
        start: this.state.start ? this.state.start : 0,
        startDate: this.state.revenue.from.value ? this.state.revenue.from.value : null,
       }
       if(this.state.revenue.agency.value){
            body.agencyBusinessUid = this.state.formControls.agency.value;
        }
        if(this.state.revenue.client.value){
            body.businessUid = this.state.formControls.client.value;
        }
       if(cl){
        this.setState({showFilter: false})
       }
        getRevenueSummary(body)
        .then( response => response.json())
        .then( data=>{
             if(data.success){
                this.setState({
                    totalRevenues: data.totalRevenues,
                    totalClientTxn: data.totalClientTxn
                })
             }
             else{
                 ToastsStore.error(data.message);
             }
        })
        .catch(error =>{
            ToastsStore.error("Something went wrong, Please try again later.!!!");
        })
    }
   
    fetchRevenue(cl){
        const body={
            businessUid: this.state.businessUid,
            endDate: this.state.revenue.to.value ? this.state.revenue.to.value: null,
            eventType: this.state.revenue.et.value ? this.state.revenue.et.value : null,
            maxResults: 20,
            start: this.state.start,
            startDate: this.state.revenue.from.value ? this.state.revenue.from.value : null
        }
        if(this.state.revenue.agency.value){
            body.agencyBusinessUid = this.state.formControls.agency.value;
        }
        if(this.state.revenue.client.value){
            body.businessUid = this.state.formControls.client.value;
        }
        this.setState({
            loader: true
        })
        if(cl){
            this.setState({showFilter: false})
        }
        getRevenue(body)
        .then( response => response.json())
        .then( data=>{
            this.setState({
                loader: false
            })
             if(data.success){
                if(data.revenueHistories && data.revenueHistories.length > 0){
                    ToastsStore.success(data.message);
                    this.setState({
                        revenueHis: data.revenueHistories,
                        hasNext: (data.revenueHistories.length === 20)
                    })   
                }
                else{
                    this.setState({
                        hasNext: false,
                        revenueHis: data.revenueHistories,
                    })
                } 
             }
             else{
                 ToastsStore.error(data.message);
             }
        })
        .catch(error =>{
            ToastsStore.error("Something went wrong, Please try again later.!!!");
            this.setState({
                loader: false
            })
        })
    }
    
    render(){
        return(
            <article className="pad--half"> 
                <div style={{textAlign:'left'}}>
                    <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                    <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>{this.showVideo()}}>Understanding Agency Partner Revenue</span>
                </div>
                {
                    this.state.howTo && 
                    <Popup title={'Understanding Agency Partner Revenue'} togglePopup={this.showVideo.bind(this)}>
                        <Youtube url={'Yf7NkxkSSvw'}/>
                    </Popup>
                }
                <div className="flex col-20">
                    <div className="margin-left--auto margin-right">
                        {
                            this.state.filtersApplied &&
                            <button  className="ui tiny grey button margin-right--half" onClick={this.clearFilters}>Clear Filters</button>                            
                        } 
                        <button onClick={()=>
                            {
                                this.setState({showFilter: true});
                                this.fetchAllClients();
                                utils.isSuAdmin &&
                                this.fetchAgency();
                            }} className="ui tiny teal button margin-left--half">Filter</button>
                    </div>
                </div>

                <div className="flex flex-direction--row margin-top">
                    <div className="info revenue-info">Revenue &#8377;{this.state.totalRevenues}</div>
                    <div className="info client-transaction" style={ utils.isMobile ? {marginLeft:'0%'} : {marginLeft:'70%'}}>Total Client Transaction &#8377;{this.state.totalClientTxn}</div>
                </div>

                {   this.state.showFilter &&
                    <Popup title={'Filters'} togglePopup={()=>this.setState({showFilter: false})}>
                        <RevenueFilter 
                            formControls={this.state.revenue}
                            dateChange={this.dateChange}
                            changeHandler={this.changeHandler}
                            clients={this.state.clients}
                            agencies={this.state.agencies}
                            clientType={this.state.clientType}
                            checkedHandler={this.checkedHandler}
                            userType={this.props.userType}
                            clearClient={this.clearClient}
                            clearAgency={this.clearAgency}
                        />
                        <div className="dialog-footer margin-top" style={{padding:'30px'}}>   
                            <button className="btn btn-fill dialog--cta pointer" onClick={()=>this.setState({showFilter: false})}>
                                Back
                            </button>
                            {
                                this.state.filtersApplied &&
                                <button onClick={() => this.clearFilters()} className="button grey margin-left margin-right--half tiny ui">Clear Filters</button>                            
                            }                     
                            <button onClick={()=>this.applyFilters()} className="btn btn-fill btn-success dialog--cta margin-left--half pointer">Apply Filters</button> 
                        </div> 
                    </Popup>   
                }
                 <div className="margin-top" style={{marginBottom:'-15px'}}>
                    <Pagination
                        getData={this.pagination}
                        start={this.state.start}
                        hasNext={this.state.hasNext}
                        data={this.state.revenueHis}
                        loader={this.state.loader} 
                    />
                </div>
                <div className="padding-top">
                    <RevenueTable revenueHis={this.state.revenueHis} />
                </div> 
                <Pagination
                    getData={this.pagination}
                    start={this.state.start}
                    hasNext={this.state.hasNext}
                    data={this.state.revenueHis}
                    loader={this.state.loader} 
                /> 
            </article> 
        );
    }
}