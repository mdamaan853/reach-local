import React,{Component} from 'react';
import {getDetailCampaign,updateStats} from '../../Services/campaign-service';
import CircularLoader from '../circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
//import {getShortUrl} from '../../Services/shortUrl-service';
//import ViewCampaignPopup from '../Campaign/ViewCampaignPopup';
import utils from '../../Services/utility-service';
import {Link} from 'react-router-dom'; 
import path from '../../Constants/img/sender-id-img.png';

class ViewCampaign extends Component{

    constructor(props){
        super(props);
        this.state={
            code:'',
            detailCampaign:[],
            saveChanges: false,
            type:'',
            opnPopup: false,
            submitLoader:false,
        }
       
    }

    componentDidMount(){
        let temp = localStorage.getItem("code");
        // console.log(temp);
        if(temp){
            this.setState({
                code : JSON.parse(temp)
            },()=>this.fetchDetailCampaign());
        }            
    }

    fetchDetailCampaign(){
        const body={
            code: this.state.code,
        }
        getDetailCampaign(body)
        .then(response=>response.json())
        .then((data)=>{
            if(data.success){
                this.setState({
                    detailCampaign: data,
                    type: (this.props.location.pathname === '/update-stats-campaign') ? 'update' : 'view'
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    submitData(){
        let t = this.state.detailCampaign.campaignStats;
        if(!t.executedCount && !t.potentialUsers && !t.deliveredCount && !t.chargeableCount){
            ToastsStore.error("Please fill data");
            return;
        }
        let body = {
            code:this.state.code,
            executedCount: this.state.detailCampaign.campaignStats.executedCount,
            potentialUsers: this.state.detailCampaign.campaignStats.potentialUsers,
            deliveredCount: this.state.detailCampaign.campaignStats.deliveredCount,
            chargeableCount: this.state.detailCampaign.campaignStats.chargeableCount
        }
        this.setState({
            submitLoader: true
        });
        updateStats(body)
        .then(response=>response.json())
        .then((data)=>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    saveChanges: true
                })
            }else{
                ToastsStore.error(data.message);
            }
            this.setState({
                submitLoader: false
            });
        })
        .catch(error => {
            console.log(error);
            ToastsStore.error("Something went wrong, Please Try Again Later ");
            this.setState({
                submitLoader: false
            });
        });
    }
    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        let temp = this.state.detailCampaign;
        temp.campaignStats[name] = value;
        this.setState({
              detailCampaign: temp
        });
      }
    render(){
        let ctr = null;
        if(this.state.type === 'view' && this.state.detailCampaign.campaignStats){
           try{
               ctr = this.state.detailCampaign.clickCount/this.state.detailCampaign.campaignStats.deliveredCount;
           }catch(e){
            console.log(e);
           } 
        }
        return(
            <React.Fragment>
                {
                    this.state.type === 'update' &&
                    <React.Fragment>
                        <Link to="/campaigns" className="margin-btm--half">
                            <button className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                        </Link>
                        <div className="ui segment">
                            <div className="col-6 field margin-left--auto margin-right--auto pad required simple-card">
                                <div className="col-20 margin-btm">
                                    <div className="label">Total Sent Count</div>
                                    <input type="number" style={{width:'100%'}} className="form-control" name="executedCount" value={this.state.detailCampaign.campaignStats.executedCount} onChange={this.changeHandler} onClick={()=>this.setState({saveChanges: false})}></input>
                                </div>
                                <div className="col-20 margin-btm">
                                    <div className="label">Potential Users</div>
                                    <input type="number" style={{width:'100%'}} className="form-control" name="potentialUsers" value={this.state.detailCampaign.campaignStats.potentialUsers} onChange={this.changeHandler} onClick={()=>this.setState({saveChanges: false})}></input>
                                </div>
                                <div className="col-20 margin-btm">
                                    <div className="label">Delivery Count</div>
                                    <input type="number" style={{width:'100%'}} className="form-control" name="deliveredCount" value={this.state.detailCampaign.campaignStats.deliveredCount} onChange={this.changeHandler} onClick={()=>this.setState({saveChanges: false})}></input>
                                </div>
                                <div className="col-20 margin-btm">
                                    <div className="label">Chargeable Count</div>
                                    <input type="number" style={{width:'100%'}} className="form-control" name="chargeableCount" value={this.state.detailCampaign.campaignStats.chargeableCount} onChange={this.changeHandler} onClick={()=>this.setState({saveChanges: false})}></input>
                                </div>
                                {
                                    !this.state.submitLoader && !this.state.saveChanges &&
                                    <div>
                                        <button onClick={()=>this.submitData()} className="ui fluid teal button">Save Changes</button>
                                    </div>
                                }
                                {
                                    this.state.saveChanges &&
                                    <div>
                                        <button onClick={()=>this.submitData()} className="ui fluid positive primary button">Saved</button>
                                    </div>
                                }
                                {
                                    this.state.submitLoader &&
                                    <div className="col-3 margin-left--auto margin-right--auto">
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div>
                                }
                            </div>
                        </div>
                        <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
                    </React.Fragment>
                }
                {
                    this.state.type === 'view' &&
                    <React.Fragment>
                        <Link to="/campaigns" className="margin-btm--half">
                            <button className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                        </Link>
                        <div className="card-custom flex flex--wrap flex-direction--row pad">
                            <div className="col-4 text--center bdr-rt">
                                <div className="text--bold margin-btm--quar">STATUS</div>
                                <div>{this.state.detailCampaign.status}</div>
                            </div>
                            <div className="col-4 text--center bdr-rt">
                                <div className="text--bold margin-btm--quar">CHARGEABLE COUNT</div>
                                <div>{this.state.detailCampaign.campaignStats ? this.state.detailCampaign.campaignStats.chargeableCount : ''}</div>
                            </div>
                            <div className="col-4 text--center bdr-rt">
                                <div className="text--bold margin-btm--quar">COST</div>
                                <div>{this.state.detailCampaign.totalCost} &#8377;</div>
                            </div>
                            <div className="col-4 text--center bdr-rt">
                                <div className="text--bold margin-btm--quar">CAMPAIGN TIME</div>
                                <div>{this.state.detailCampaign.scheduleTime}</div>
                            </div>
                            <div className="col-4 text--center">
                                <div className="text--bold margin-btm--quar">CAMPAIGN DATE</div>
                                <div>{this.state.detailCampaign.scheduleDate}</div>
                            </div>
                        </div>
                        <div className="flex flex--wrap flex-direction--row">
                            <div className="col-10 card-custom">
                                <div className="pad text--bold text--darker" style={{fontSize:'16px'}}>
                                    Campign Details
                                </div>
                                <div style={{background:'#eeeeee'}}>
                                    <div className="bdr-btm--wht pad--half">
                                        <span className="text--bold text--darker">Campaign Id:&nbsp;</span><span>{this.state.detailCampaign.campaignStats ? this.state.detailCampaign.campaignStats.code : ''}</span>
                                    </div>
                                    <div className="bdr-btm--wht pad--half">
                                        <span className="text--bold text--darker">Campaign Name:&nbsp;</span><span>{this.state.detailCampaign.campaignName}</span>
                                    </div>
                                    <div className="bdr-btm--wht pad--half">
                                        <span className="text--bold text--darker">Datasource Name:&nbsp;</span><span>{this.state.detailCampaign.audienceGroupName}</span>
                                    </div>
                                    <div className="flex flex--wrap pad--half">
                                        <div className="col-10 bdr-rt--wht text--center">
                                            <span className="text--bold text--darker">Marketing Medium:&nbsp;</span><span>{this.state.detailCampaign.mediumName}</span>
                                        </div>
                                        <div className="col-10 text--center">
                                            <span className="text--bold text--darker">Sender Code:&nbsp;</span><span>{this.state.detailCampaign.senderIdCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-custom margin-left col-10">
                                <div className="pad text--bold text--darker" style={{fontSize:'16px'}}>
                                    Statistics
                                </div>
                                <div style={{background:'#eeeeee'}}>
                                    { !utils.isMobile &&
                                    <div className="bdr-btm--wht col-20 flex flex--wrap pad">
                                        <div className="bdr-rt--wht col-6 text--center">
                                            <div>DELIVERED COUNT</div>
                                            <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>{this.state.detailCampaign.campaignStats ? this.state.detailCampaign.campaignStats.deliveredCount : ''}</div>    
                                        </div>
                                        <div className="col-4 bdr-rt--wht text--center">
                                            <div>CLICKS</div>
                                            <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>{this.state.detailCampaign.clickCount}</div>    
                                            <div className="margin-top--quar">
                                                <Link to="/view-campaign/clickShortURL">
                                                    <button className="btn btn-fill">Details</button>
                                                </Link>              
                                            </div>                                      
                                        </div>
                                        {/* <div className="col-4 bdr-rt--wht text--center">
                                            <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>N/A</div>
                                            <div>LEADS</div>
                                        </div> */}
                                        <div className="col-3 bdr-rt--wht text--center">
                                            <div>CTR</div>
                                            <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>
                                                {ctr ? (ctr).toFixed(2)  : '0'} &#37;
                                            </div>
                                            
                                        </div>
                                        {/* <div className="col-3 text--center">
                                            <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>N/A</div>
                                            <div>CR</div>
                                        </div> */}
                                    </div>
                                    }
                                    {
                                        utils.isMobile &&
                                        <React.Fragment>
                                            <div className="bdr-btm--wht col-20 flex flex--wrap pad">
                                                <div>DELIVERED COUNT</div>
                                                <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>{this.state.detailCampaign.campaignStats ? this.state.detailCampaign.campaignStats.deliveredCount : ''}</div>                            
                                            </div>
                                            <div className="bdr-btm--wht col-20 flex flex-direction--col flex--wrap pad">
                                                <div>CLICKS</div>
                                                <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>{this.state.detailCampaign.clickCount}</div>  
                                                <div className="margin-top--quar">
                                                    <Link to="/view-campaign/clickShortURL">
                                                        <button className="btn btn-fill">Details</button>
                                                    </Link>              
                                                </div>
                                            </div>
                                            <div className="bdr-btm--wht col-20 flex flex--wrap pad">
                                                <div>CTR</div>
                                                <div className="text--bold text--darker margin-btm--quar" style={{fontSize: '15px'}}>
                                                    {" "+ ctr ? ctr : '0'} &#37;
                                                </div>  
                                            </div>
                                        </React.Fragment>
                                    }
                               
                                    <div className="flex flex--wrap" style={{padding:'24px 0'}}>
                                        <div className="bdr-rt--wht col-10 text--center">
                                            <span className="text--bold text--darker">Campaign Target:&nbsp;</span><span>{this.state.detailCampaign.targetCount}</span>
                                        </div>
                                        <div className="col-10 text--center">
                                            <span className="text--bold text--darker">Total Sent Count:&nbsp;</span><span>{this.state.detailCampaign.campaignStats ? this.state.detailCampaign.campaignStats.executedCount : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex--wrap flex-direction--row">
                            <div className="col-10 card-custom">
                                <div className="pad text--bold text--darker" style={{fontSize:'16px'}}>
                                    Campign Content
                                </div>
                                <div style={{background:'#eeeeee',minHeight:'180px',maxHeight:'180px',overflow:'hidden'}}>
                                    {/* <div className="pad">
                                        {this.state.detailCampaign.content ? this.state.detailCampaign.content.content : ''}
                                    </div> */}
                                    {
                                        !utils.isMobile  &&
                                        <React.Fragment>
                                    <div className="preview__info">
                                        <i className="blue info circle icon"></i>This is how content will look like when message is received by user.
                                    </div>
                                    
                                        <div className="preview">
                                        <div className="preview__senderId">{this.state.detailCampaign.senderIdCode}</div>
                                        <div className="preview__overlay">
                                            {
                                                this.state.detailCampaign.content && this.state.detailCampaign.content.content && this.state.detailCampaign.content.content.length < 161 &&
                                                <div className="preview__text">{this.state.detailCampaign.content.content}</div>
                                            }
                                            {
                                                this.state.detailCampaign.content && this.state.detailCampaign.content.content && this.state.detailCampaign.content.content.length > 160 &&
                                                <React.Fragment>
                                                    <div className="preview__text" >{this.state.detailCampaign.content.content.substring(0,160)}</div>
                                                    
                                                   
                                                    <div className="preview__text" >{this.state.detailCampaign.content.content.substring(160,300)}</div>
                                                    
                                                   
                                                </React.Fragment>
                                            }
                                        </div>
                                        <img className="preview__img" src={path} alt="sender id sample"/>
                                    </div>
                                    </React.Fragment>
                                    }
                            
                                </div>
                            </div>
                            <div className="card-custom margin-left col-10">
                                <div className="pad text--bold text--darker" style={{fontSize:'16px'}}>
                                    Filters
                                </div>
                                <div style={{background:'#eeeeee',minHeight:'180px',maxHeight:'180px',overflowY:'auto'}}>
                                    {
                                        this.state.detailCampaign.segments && this.state.detailCampaign.segments.length > 0 &&
                                        this.state.detailCampaign.segments.map((item,index) => {
                                            return(
                                                <div key={index} className="bdr-btm--wht pad--half">
                                                    <span className="text--bold text--darker">{
                                                        item.icon &&
                                                        <span className="margin-right--quar">
                                                            <i aria-hidden="true" className={`${item.icon} icon`}></i>
                                                        </span>
                                                    }
                                                    {item.name}:&nbsp;</span>
                                                    {   item.value && 
                                                        <span>{item.value}</span>
                                                    }
                                                    {
                                                        item.values && item.values.length > 0 &&
                                                        <span>{item.values.toLocaleString()}</span>
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex--wrap flex-direction--row">
                            <div className="col-10 card-custom">
                                <div className="pad" style={{fontSize:'16px'}}>
                                    <span className="text--bold text--darker">Short Url</span>&nbsp;<span>{this.state.detailCampaign.shortUrl}</span>
                                </div>
                                <div style={{background:'#eeeeee'}}>
                                    <div className="pad">
                                        <span className="text--bold text--darker">Campaign Description:&nbsp;</span><span>{this.state.detailCampaign.campaignDesc}</span>
                                    </div>
                                </div>
                            </div>
                            {
                                (this.state.detailCampaign.acceptRejectRemark || this.state.detailCampaign.executeRemark) &&
                                <div className="card-custom margin-left col-10">
                                    <div className="pad text--bold text--darker" style={{fontSize:'16px'}}>
                                        Remarks
                                    </div>
                                    <div style={{background:'#eeeeee'}}>
                                        {
                                            this.state.detailCampaign.acceptRejectRemark &&
                                            <div className="bdr-btm--wht pad--half">
                                                <span className="text--bold text--darker">Remark on Acceptance/Rejection:&nbsp;</span><span>{this.state.detailCampaign.acceptRejectRemark}</span>
                                            </div>
                                        }
                                        {
                                            this.state.detailCampaign.executeRemark &&
                                            <div className="bdr-btm--wht pad--half">
                                                <span className="text--bold text--darker">Remark on Execution/Rejection:&nbsp;</span><span>{this.state.detailCampaign.executeRemark}</span>
                                            </div>
                                        }
                                    </div>    
                                </div>
                            }
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
export default ViewCampaign;
