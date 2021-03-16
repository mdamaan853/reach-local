import React from 'react';
import Popup from '../../Popup/Popup';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import CircularLoader from '../../circular-loader/circular-loader';
import { RetargettingSMSPro } from './RetargettingSMSPro';
import {getJourney} from '../../../Services/campaign-service';
import { ToastsStore,ToastsContainer,ToastsContainerPosition } from 'react-toasts';
import './JourneyDesigner.css';

export default class JourneyDesigner extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            opnRetarget: false,
            journeyDesignerDTOs:[],
            loader: false,
            viewCont: false
        }
        this.fetchJourney = this.fetchJourney.bind(this);
    }

    componentDidMount(){
        this.fetchJourney();
    }

    fetchJourney(){
        let code = JSON.parse(localStorage.getItem("code"));
        let body={
            bUid: null,
            campaignCode: code
        }
        this.setState({
            loader: true,
        })
        getJourney(body)
        .then(r => r.json())
        .then(e =>{  
            this.setState({
                loader: false
            })
            if(e.success){
                ToastsStore.success(e.success);
                this.setState({
                    journeyDesignerDTOs:e.journeyDesignerDTOs,
                    opnRetarget: false,
                })
            }
            else{
                ToastsStore.error(e.message);
            }
        })
        .catch(e=>{
            this.setState({
                loader: false
            })
            ToastsStore.error("Something went wrong. Please try Again later.!!!");
        })
    }

    render(){
        return(
            <main className="JourneyDesinerFont">
                 <Link to="/campaigns"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
                {
                    !!this.state.journeyDesignerDTOs && this.state.journeyDesignerDTOs.map((item,index)=>{
                        return(
                            <section className="card-custom flex pad" style={{border:"5px solid #dfe2e4"}}>
                                <span className="col-6" >
                                    <div className="label">Event Type</div>
                                    <p>{item.eventType}</p>
                                </span>
                                
                                <span className="col-6">
                                    <React.Fragment>
                                    { 
                                    item.delay && item.delay.delaySeconds && (parseInt(item.delay.delaySeconds) >= 3600) ? 
                                    <React.Fragment>
                                        <span className="label">Delay (in hours)</span>
                                        <p>{(item.delay.delaySeconds/3600).toFixed(2)}</p>     
                                    </React.Fragment> : ( 
                                        item.delay && item.delay.delaySeconds &&(parseInt(item.delay.delaySeconds) > 60) ?
                                            <React.Fragment>
                                                <span className="label">Delay (in minutes)</span>
                                                <p>{(item.delay.delaySeconds/60).toFixed(2)}</p>     
                                            </React.Fragment> :
                                            // } 
                                            // { 
                                            // item.delay && item.delay.delaySeconds && ( parseInt(item.delay.delaySeconds) < 60) &&
                                                <React.Fragment>
                                                    <span className="label">Delay (in seconds)</span>
                                                    <p>{item.delay && item.delay.delaySeconds && (item.delay.delaySeconds).toFixed(2)}</p>     
                                                </React.Fragment>
                           
                                        )
                                    } 
                                    {
                                        (!item.delay || (item.delay && !item.delay.delaySeconds)) &&
                                        <p>--</p>
                                    }
                                    </React.Fragment>     
                                </span>                        
                                <span className="col-6">
                                    <span className="label">Schedule Date &amp; Time </span>
                                    {
                                        item.scheduledTime &&
                                        <p><Moment format="YYYY-MM-DD HH:mm">{item.scheduledTime}</Moment></p>
                                    }
                                    {
                                        !item.scheduledTime &&
                                        <p>--</p>
                                    }
                                </span>
                                {  item.notifications.map(j=>{
                                    return(
                                        <React.Fragment>
                                        <span className="col-6">
                                            <span className="label">Notifications type</span>
                                            <p>{j.notificationType}</p>
                                        </span>
                                        <span className="col-6">
                                             <div className="label">Content</div>
                                             {
                                               j.notificationType === "SMS" &&  
                                               <Dropdown text='(View)' direction='left' className="text-intent">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item style={{border:"3px solid #dfe2e4", whiteSpace:"normal"}}><p style={{maxWidth:"12.5em", height:"100%"}}>{j.content}</p></Dropdown.Item>              
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                             }
                                            {
                                                j.notificationType === "EMAIL" &&
                                                <Dropdown text='(View)' direction='left' className="text-intent">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item style={{border:"3px solid #dfe2e4", whiteSpace:"normal"}}>
                                                            <b style={{maxWidth:"12.5em", height:"100%"}}>Subject:{j.subject}</b>             
                                                            {/* <Dropdown.Divider /> */}
                                                            <p style={{maxWidth:"12.5em", height:"100%"}}>Body:{j.content}</p>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            }
                                           
                                        </span>
                                        </React.Fragment>
                                    )
                                })
                            }   
                            </section>    
                        )
                    })
                }
                <div className="flex justify-content--center algn-vert-center">
                    <button onClick={()=>this.setState({opnRetarget: true})} className="ui big green button">ADD JOURNEY</button>
                </div>
                
                {
                    this.state.opnRetarget && 
                    <Popup title="Journey Designer" togglePopup={()=>this.setState({opnRetarget: false})} maxWidth="900px">
                        <RetargettingSMSPro submit={this.fetchJourney} close={()=>this.setState({opnRetarget: false})}/>
                    </Popup>     
                }

                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
                {
                    this.state.loader &&
                    <CircularLoader />
                }
            </main> 
        )
    }
}