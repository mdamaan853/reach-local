import React from 'react';
import AllTxns from './AllTxns';
import SMSFilter from './SMSFilter';
import Popup from '../../Popup/Popup';
import {Link} from 'react-router-dom';
import DailySummary from './DailySummaty';
import CampaignSummary from './CampaignSummary';
import Pagination from '../../Pagination/Pagination';
import utils from '../../../Services/utility-service';
import CircularLoader from '../../circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
//import {getAllSMSTxns,downloadAllDailySmryReport,downloadAllCampgnWiseSmry,getAllSMSCampaignSmry,getAllSMSDailySmry,downloadAllTransaction} from '../../../Services/template-service';
import {getAllSMSTxns,getAllSMSCampaignSmry,getAllSMSDailySmry} from '../../../Services/template-service';

export default class SMSReports extends React.Component{

    constructor(props){
        super(props);
        this.state={
            active: 0,
            smsTxns: [],
            campaignSummaries:[],
            dailySummaries:[],
            loader: false,
            startAllTxns:0,
            hasNextAllTxns: true,
            hasNextCampaign: true,
            startCampaign:0,
            startDailySmry:0,
            hasNextDaiySmry: true,
            opnFilter: false,
            opnDownload: false,
            formControls:{
                mobile:{
                    value: null
                },
                date:{
                    to: null,
                    from:null
                }
            }
        }
        
        this.changeTab = this.changeTab.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.submitData = this.submitData.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.fetchAllReport = this.fetchAllReport.bind(this);
        this.fetchAllSMSTxns = this.fetchAllSMSTxns.bind(this);
        this.textHandleChange = this.textHandleChange.bind(this);
        this.fetchAllSMSDailySmry = this.fetchAllSMSDailySmry.bind(this);
        this.fetchAllSMSCampaignSmry =this.fetchAllSMSCampaignSmry.bind(this);
        this.dwnldAllDailySmryReport =  this.dwnldAllDailySmryReport.bind(this);
        this.downloadAllCampgnWiseSmryReport = this.downloadAllCampgnWiseSmryReport.bind(this);
        
    }

    componentDidMount(){
        this.fetchAllSMSTxns();
    }

    changeTab(n){
        this.setState({
            active: n
        })
        if (n === 0){
            this.fetchAllSMSTxns();
        }
        else if( n === 1){
            this.fetchAllSMSCampaignSmry();
        }
        else if(n === 2){
            this.fetchAllSMSDailySmry();
        }
    }

    textHandleChange(event){
        const name=event.target.name;
        const value=event.target.value;
        this.setState({
            formControls:{
                ...this.state.formControls,
                [name]: {
                    ...this.state.formControls[name],
                    value
                }
            }
        })
       
    }

    dateChange(event,name){
        
        let value = event;
        let n=name;
        let t= this.state.formControls;
        t.date[n] = value;
        this.setState({
            formControls: t                
        })
        
    }

    submitData(){
        if(this.state.active === 0){
            this.fetchAllSMSTxns();
        }
        else if(this.state.active === 1){
            this.fetchAllSMSCampaignSmry();
        }
        else if(this.state.active === 2){
            this.fetchAllSMSDailySmry();
        }
    }

    clearFilter(){
        let temp = this.state.formControls;
        temp.date.to = null;
        temp.date.from = null;
        this.setState({
            formControls: temp
        })
        this.submitData();
    }

    fetchAllSMSDailySmry(){
        this.setState({
            loader: true
        })
        let body ={
            start: this.state.startDailySmry,
            maxResults: 50,
            startTime: this.state.formControls.date.from ? this.state.formControls.date.from : null,
            endTime:this.state.formControls.date.to ?this.state.formControls.date.to : null
        }
        
        getAllSMSDailySmry(body)
        .then(r => r.json())
        .then(data =>{
            this.setState({
                loader: false,
                opnFilter: false
            })
            if(data.success){
                this.setState({
                    dailySummaries: data.dailySummaries
                })
                ToastsStore.success(data.message);
                if(data.dailySummaries && data.dailySummaries.length > 0){
                    this.setState({
                        hasNextDaiySmry: (data.dailySummaries.length === 50)
                    })
                }
                else{
                    ToastsStore.error("No Data Found");
                    this.setState({
                        hasNextDaiySmry: false
                    })
                }  
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e =>{
            this.setState({
                loader: false
            })
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
        })
    }

    allDailySmry(type){
        if(type === 'previous'){
            if(this.state.startDailySmry > 0){
              this.setState({
                startDailySmry: this.state.startDailySmry - 50,
              },()=>{
                    this.fetchAllSMSDailySmry();
              })
            }
        }else if(type === 'next'){
            if(this.state.hasNextCampaign){
                this.setState({
                    startDailySmry: this.state.startDailySmry + 50,
                },()=>{
                    this.fetchAllSMSDailySmry();
                })
            }
        }
    }

    fetchAllSMSCampaignSmry(){

        this.setState({
            loader: true
        })
        let body={
            maxResults: 50,
            start: this.state.startCampaign,
            startTime: this.state.formControls.date.from ? this.state.formControls.date.from : null,
            endTime:this.state.formControls.date.to ?this.state.formControls.date.to : null
        }
        
        getAllSMSCampaignSmry(body)
        .then(r => r.json())
        .then( data =>{
            this.setState({
                loader: false,
                opnFilter: false
            })
            if(data.success){
                this.setState({
                    campaignSummaries: data.campaignSummaries
                })
                ToastsStore.success(data.message);
                if(data.campaignSummaries && data.campaignSummaries.length > 0){
                    this.setState({
                        hasNextCampaign: (data.campaignSummaries.length === 50)
                    })
                }
                else{
                    ToastsStore.error("No Data Found");
                    this.setState({
                        hasNextCampaign: false
                    })
                }  
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( e=>{
            this.setState({
                loader:false
            })
            ToastsStore.error("Something Went Wrong. Please Try Again Later!!!");
        })
    }

    allCampnSmry(type){
        if(type === 'previous'){
            if(this.state.startCampaign > 0){
              this.setState({
                    startCampaign: this.state.startCampaign - 50,
              },()=>{
                    this.fetchAllSMSCampaignSmry();
              })
            }
        }else if(type === 'next'){
            if(this.state.hasNextCampaign){
                this.setState({
                    startCampaign: this.state.startCampaign + 50,
                },()=>{
                    this.fetchAllSMSCampaignSmry();
                })
            }
        }
    }

    fetchAllSMSTxns(){

        this.setState({
            loader: true
        })
        let body={
            maxResults: 50,
            start: this.state.startAllTxns,
            startTime: this.state.formControls.date.from ? this.state.formControls.date.from : null,
            endTime:this.state.formControls.date.to ?this.state.formControls.date.to : null
        }
        
        getAllSMSTxns(body)
        .then(r => r.json())
        .then( data =>{
            this.setState({
                loader: false,
                opnFilter: false
            })
            if(data.success){
                this.setState({
                    smsTxns: data.smsTxns
                })
                ToastsStore.success(data.message);
                if(data.smsTxns && data.smsTxns.length > 0){
                    this.setState({
                        hasNextAllTxns: (data.smsTxns.length === 50)
                    })
                }
                else{
                    ToastsStore.error("No Data Found");
                    this.setState({
                        hasNextAllTxns: false
                    })
                }  
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch( e=>{
            this.setState({
                loader:false
            })
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
        })
    }

    allTxns(type){
        if(type === 'previous'){
            if(this.state.startAllTxns > 0){
              this.setState({
                  startAllTxns: this.state.startAllTxns - 50,
              },()=>{
                  this.fetchAllSMSTxns();
              })
            }
        }else if(type === 'next'){
            if(this.state.hasNextAllTxns){
                this.setState({
                    startAllTxns: this.state.startAllTxns + 50,
                },()=>{
                    this.fetchAllSMSTxns();
                })
            }
        }
    }

    fetchAllReport(){
        let body = {
            "endTime": this.state.formControls.date.to ?this.state.formControls.date.to : null,
            // "maxResults": 100,
            // "start": 0,
            "startTime": this.state.formControls.date.from ? this.state.formControls.date.from : null,
        };
   
        let url = "?"+utils.jsonToQueryString(body);
        console.log(url);
            return url;
    }

    // fetchAllReport(){
    //     let body={
    //         // "bUid": "string",
    //         // "businessUid": "string",
    //         "endTime": this.state.formControls.date.to ?this.state.formControls.date.to : null,
    //         // "maxResults": 100,
    //         // "start": 0,
    //         "startTime": this.state.formControls.date.from ? this.state.formControls.date.from : null,
    //     }
    //     downloadAllTransaction(body)
    //     .then(r => r.json())
    //     .then(data=>{
    //         if(data.success){
    //             ToastsStore.success(data.message);
    //         }
    //         else{
    //             ToastsStore.error(data.message);
    //         }
    //     })
    //     .catch(e=>{
    //         ToastsStore.error("Something went wrong. Please try again later!!!");
    //     })
    // }
    downloadAllCampgnWiseSmryReport(){
    let body = {
        "endTime": this.state.formControls.date.to ?this.state.formControls.date.to : null,
        // "maxResults": 100,
        // "start": 0,
        "startTime": this.state.formControls.date.from ? this.state.formControls.date.from : null,
    };

    let url = "?"+utils.jsonToQueryString(body);
        return url;
    }
    // downloadAllCampgnWiseSmryReport(){
    //     let body={
    //         // "bUid": "string",
    //         // "businessUid": "string",
    //         "endTime": this.state.formControls.date.to ?this.state.formControls.date.to : null,
    //         // "maxResults": 100,
    //         // "start": 0,
    //         "startTime": this.state.formControls.date.from ? this.state.formControls.date.from : null,
    //     }
    //     downloadAllCampgnWiseSmry(body)
    //     .then(r => r.json())
    //     .then(data=>{
    //         if(data.success){
    //             ToastsStore.success(data.message);
    //         }
    //         else{
    //             ToastsStore.error(data.message);
    //         }
    //     })
    //     .catch(e=>{
    //         ToastsStore.error("Something went wrong. Please try again later!!!");
    //     })
    // }
    
    // dwnldAllDailySmryReport(){
    //     let body={
    //         // "bUid": "string",
    //         // "businessUid": "string",
    //         "endTime": this.state.formControls.date.to ?this.state.formControls.date.to : null,
    //         // "maxResults": 100,
    //         // "start": 0,
    //         "startTime": this.state.formControls.date.from ? this.state.formControls.date.from : null,
    //     }
    //     downloadAllDailySmryReport(body)
    //     .then(r => r.json())
    //     .then(data=>{
    //         if(data.success){
    //             ToastsStore.success(data.message);
    //         }
    //         else{
    //             ToastsStore.error(data.message);
    //         }
    //     })
    //     .catch(e=>{
    //         ToastsStore.error("Something went wrong. Please try again later!!!");
    //     })
    // }
    dwnldAllDailySmryReport(){
        let body = {
            "endTime": this.state.formControls.date.to ?this.state.formControls.date.to : null,
            // "maxResults": 100,
            // "start": 0,
            "startTime": this.state.formControls.date.from ? this.state.formControls.date.from : null,
        };

        let url = "?"+utils.jsonToQueryString(body);
            return url;
    }

    render(){
        // let url = this.fetchAllReport();
        // let url1 = this.downloadAllCampgnWiseSmryReport();
        // let url2 = this.dwnldAllDailySmryReport();
        return(
            <section>
                <Link to="/campaigns"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
                <article className="card-custom flex pad--half align-space-between ">
                    <h4 className="ui header">SMSPro Reports</h4>
                    <div className="flex justify-flex-end">
                        {/* <Link to=""><button className="ui blue button">Create SMSPro Campaign</button></Link> */}
                        <Link to={{pathname:"/service/package", search:`service=SMSPro`}}><button className="ui teal button">Buy SMSPro Package</button></Link>
                    </div>  
                </article>
                <article className=  { utils.isMobile ? "ui pointing secondary menu overflowX-auto" : "ui pointing secondary menu"}>                        
                    <div className={`${this.state.active === 0 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(0)}>All Transactions</div>
                    <div className={`${this.state.active === 1 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(1)}>Campaign Summary</div>
                    <div className={`${this.state.active === 2 ? 'active' : ''} item pointer`} onClick={()=>this.changeTab(2)}>Daily Summary</div>
                </article>
                <article>
                    {
                        this.state.active === 0 &&
                        <React.Fragment>
                            {
                                (this.state.formControls.date.to || this.state.formControls.date.from) &&
                                <button onClick={this.clearFilter} className="ui tiny grey button">Clear Filter</button> 
                            }
                            <button onClick={()=>{this.setState({opnFilter: true})}} className="ui tiny teal button">Filter</button>
                            {/* <a href={`/sms/txn/export/history${url}`} download="allTxns.csv">
                                <button  className="ui tiny blue button">Download Report&nbsp;<i aria-hidden="true" className="download icon"></i></button>              
                            </a>  */}
                            <AllTxns
                                smsTxns={this.state.smsTxns}/>
                            <Pagination
                                getData={this.allTxns.bind(this)}
                                start={this.state.startAllTxns}
                                hasNext={this.state.hasNextAllTxns}
                                data={this.state.smsTxns}
                                loader={this.state.loader} 
                            />
                        </React.Fragment>
                    }
                    {
                        this.state.active === 1 &&
                        <React.Fragment>
                            {
                                (this.state.formControls.date.to || this.state.formControls.date.from) &&
                                <button onClick={this.clearFilter} className="ui tiny grey button">Clear Filter</button> 
                            }
                            <button onClick={()=>{this.setState({opnFilter: true})}} className="ui tiny teal button">Filter</button>              
                            {/* <a href={`/sms/txn/export/campaign/wise/summary/report${url1}`} download="CampaignWiseReport.csv">
                                <button  className="ui tiny blue button">Download Report&nbsp;<i aria-hidden="true" className="download icon"></i></button>              
                            </a> */}
                            {/* <button onClick={()=>this.downloadAllCampgnWiseSmryReport()} className="ui tiny blue button">Download Report&nbsp;<i aria-hidden="true" className="download icon"></i></button>               */}
                            
                            <CampaignSummary 
                                campaignSummaries={this.state.campaignSummaries}/>
                            <Pagination
                                getData={this.allCampnSmry.bind(this)}
                                start={this.state.startCampaign}
                                hasNext={this.state.hasNextCampaign}
                                data={this.state.campaignSummaries}
                                loader={this.state.loader} 
                            />
                        </React.Fragment>   
                    }
                    {
                        this.state.active === 2 &&
                        <React.Fragment>
                            {
                                (this.state.formControls.date.to || this.state.formControls.date.from) &&
                                <button onClick={this.clearFilter} className="ui tiny grey button">Clear Filter</button> 
                            }
                            <button onClick={()=>{this.setState({opnFilter: true})}} className="ui tiny teal button">Filter</button> 
                            {/* <a href={`/sms/txn/export/daily/summary/report${url2}`} download="dailySummaryReport.csv">
                                <button  className="ui tiny blue button">Download Report&nbsp;<i aria-hidden="true" className="download icon"></i></button>              
                            </a> */}
                            {/* <button onClick={()=>this.dwnldAllDailySmryReport()} className="ui tiny blue button">Download Report&nbsp;<i aria-hidden="true" className="download icon"></i></button>                            */}
                            <DailySummary 
                                dailySummaries={this.state.dailySummaries}/>
                            <Pagination
                                getData={this.allDailySmry.bind(this)}
                                start={this.state.startDailySmry}
                                hasNext={this.state.hasNextDaiySmry}
                                data={this.state.dailySummaries}
                                loader={this.state.loader} 
                            />
                        </React.Fragment>

                    }
                </article>
                {
                    this.state.loader &&
                    <div className="global-loader col-1">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
                {
                    this.state.opnFilter &&
                    <Popup title="Filter" togglePopup={()=>this.setState({opnFilter: false})}>
                        <SMSFilter 
                            formControls={this.state.formControls}
                            textHandleChange={this.textHandleChange}
                            dobChange={this.dateChange}
                            submitData={this.submitData}
                            clear={()=>this.setState({opnFilter: false})}
                        />
                    </Popup> 
                }
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />   
            </section>
        )
    }
}