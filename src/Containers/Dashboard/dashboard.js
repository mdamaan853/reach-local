import React,{Component} from 'react';
import PageTitle from '../../Components/Helmet';
import './dashboard.css';
import utils from '../../Services/utility-service';
import Popup from '../../Components/Popup/Popup';
import {getRevenueSummary} from '../../Services/shortUrl-service';
import {getBusinessDetails} from '../../Services/user-service';
import {Link} from 'react-router-dom';
import Youtube from '../../Components/Youtube/Youtube';
import logo from '../../Constants/img/logo-wallet.png';
import Content from '../../Components/Content/Content';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import {getUpdatedWallet} from '../../Services/subscriptions-service';
import Leads from '../Leads/Leads';
import {fetchJUrl} from '../../Services/clients-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';


class Dashboard extends Component {
    constructor(props){
      super(props);
      this.state = {
        banners : [
          {img:"https://live.expletuslabs.com/dev/assets/images/target.png",caption:"Reach your potential customers."},
          {img:"https://live.expletuslabs.com/dev/assets/images/online-store.png",caption:"Increase your store visits and footfalls."},
          {img:"https://live.expletuslabs.com/dev/assets/images/seo.png",caption:"Create and run Campaigns."},
          {img:"https://live.expletuslabs.com/dev/assets/images/stadistics.png",caption:"Effective and efficient growth."}
        ],
        balance: 0,
        cl: 0,
        howTo:false,
        howToClient: false,
        joinUrl:"",
        totalRevenues:"",
        totalClientTxn:"",
        businessUid:""
      }; 
      this.getJoiningUrl = this.getJoiningUrl.bind(this);
    }
    componentDidMount(){
      if(this.props.userType === "AGENCY"){
        this.getJoiningUrl();
      }
      
      getUpdatedWallet({})
        .then(response => response.json())
        .then(data => {
              if (data.success) { 
                    this.setState({
                        balance: data.walletInfo.amount,
                        cl: data.walletInfo.maxAllowedDebit
                    });                              
              } 
        })
        .catch(error => {
              console.log(error);
        })

        getBusinessDetails()
        .then(response => response.json())
        .then(data => {
           if (data.success && !!data.uid) {
              this.setState({
                  businessUid: data.uid
              },()=>this.fetchRevenueSummary()); 
           }
        }).catch(error => {
           console.log(error);
        })
    }

    getJoiningUrl(){
      let body = {
          "businessUid": this.state.businessUid
      }
      fetchJUrl(body)
      .then(response => response.json())
      .then(data => {
          if(data.success){
              this.setState({
                  joinUrl: data.signupUrl,
                  // tempBData: null,
                  // tempBFetched: true
              })
          }else{
              ToastsStore.error(data.message,4000);
          }
      }).catch(error => {
          console.log(error);
          this.setState({
              joinUrl:""
          })
          // ToastsStore.error("Something went wrong, Please Try Again Later ");
      })
    }

  showVideo(){
    this.setState({
        howTo: !this.state.howTo
    })
  }
  showVideoClient(){
    this.setState({
      howToClient: !this.state.howToClient
    })
  }

  copyUrl = (event) => {
    navigator.clipboard.writeText(this.state.joinUrl);
    ToastsStore.success("Short Url Copied to Clipboard.");
    // console.log(event);
  }

    fetchRevenueSummary(){
      if(this.props.userType === 'AGENCY' && utils.isAdmin){
      const body={
      businessUid: this.state.businessUid,
      endDate:null,
      eventType: null,
      maxResults: 20,
      start: 0,
      startDate:null,
     }
      getRevenueSummary(body)
      .then( response => response.json())
      .then( data=>{
           if(data.success){
              ToastsStore.success(data.message);
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
        //  ToastsStore.error("Something went wrong, Please try again later.!!!");
      })
    }
  }
    render(){
      return(
        <div>
          <PageTitle title="Home" description="Welcome to ReachlocalAds"/>
          {
            this.props.userType && this.props.userType !== 'VENDOR' &&
            <div className = "dashboard">
              {
                this.props.userType && this.props.userType === 'BUSINESS' &&
                <div style={{textAlign:'left'}}>
                    <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                    <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>{this.showVideoClient()}}>Platform Introduction Video</span>
                </div>
              }
              {
                  this.state.howToClient && 
                  <Popup title={'Platform Introduction Video'} togglePopup={this.showVideoClient.bind(this)}>
                      <Youtube url={'KR-T_RgXtkM'}/>
                  </Popup>
              }
              
              {
                this.props.userType && this.props.userType === 'AGENCY' &&
                  <div style={{textAlign:'right'}}>
                      <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                      <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'left'}} onClick={()=>{this.showVideo()}}>Agency Platform Introduction Video</span>
                  </div>
              }
                {
                    this.state.howTo && 
                    <Popup title={'Agency Platform Introduction Video'} togglePopup={this.showVideo.bind(this)}>
                        <Youtube url={'XexwoMRf4UM'}/>
                    </Popup>
                }
                <div className="flex flex-direction--row " style={{justifyContent: 'space-between'}}>

                    { !utils.isMobile &&
                     this.state.totalRevenues && 
                      <div className="flex wallet-home text--darker">
                      <div>
                         Revenue &#8377;{this.state.totalRevenues}
                      </div>
                    </div>
                    }
                    {this.state.totalClientTxn && !utils.isMobile && 
                      <div className="flex wallet-home text--darker">
                      <div>
                        Total Client Transaction &#8377;{this.state.totalClientTxn}
                      </div>
                    </div>}   
                    <div style={{position:'relative',marginLeft:'auto'}}>
                      <Link to="/buycredits?source=home" className="flex wallet-home text--darker">
                        <div><img src={logo} className="wallet-home__icon" alt="banner"/></div>
                        {
                          !utils.isMobile &&
                          <div className="padding-right--half">&#8377; {this.state.balance}</div>
                        } 
                      </Link>
                      {
                        !!this.state.cl && (this.state.cl > 0) && !utils.isMobile && 
                        <div className="credit-limit">
                          <span className="text--bold text--darker" style={{fontSize: '14px'}}>
                            Credit Limit: 
                          </span>
                          <span className="text-light">&nbsp;&#8377; {this.state.cl}</span>
                        </div>
                      }
                    </div>
                </div>
                {  this.props.userType && this.props.userType === "AGENCY" &&
                <div className="margin-top--double">
                <h4 class="ui horizontal divider header col-7 ">
                  My Agency Partner Link
                </h4>
                <div className="ui action input col-7">
                  <p style={{verticalAlign:"middle"}}>{this.state.joinUrl}
                  <button className="ui teal icon right labeled tiny button" onClick={()=>this.copyUrl()}>
                    <i aria-hidden="true" className="copy icon"></i>
                    Copy
                  </button></p>
                </div>
                </div> 
                } 
                <Content banners={this.state.banners}/>
            </div>
          }
          {
              !this.props.userType && 
              <div className="margin-top--double">
                  <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
              </div>
          }
          {
            this.props.userType && this.props.userType === 'VENDOR' &&
            <Leads history={this.props.history}/>
          }
          <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
        </div>
        );
      }
    }
    
    export default Dashboard;
    