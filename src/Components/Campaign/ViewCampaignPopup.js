import React from 'react';
import Moment from 'react-moment';
import utils from '../../Services/utility-service';
import { ToastsStore,ToastsContainer,ToastsContainerPosition } from 'react-toasts';
import {getShortUrl} from '../../Services/shortUrl-service';
import CircularLoader from '../circular-loader/circular-loader';
import {Link} from 'react-router-dom';

export default class ViewCampaignPopup extends React.Component{

    constructor(props){
        super(props);
        this.state={
            shortUrl:[],
            loader: false
        }
        this.fetchShortUrl = this.fetchShortUrl.bind(this);
    }
    // const [shortUrl, setshortUrl] = useState(0);
   // let shortUrl;
    componentDidMount(){
        this.fetchShortUrl();
    }

    fetchShortUrl() {
        let temp = JSON.parse(localStorage.getItem("code"));
        this.setState({
            loader: true
        })
        let body={
            start : 0,
            maxResult : 4,
            campaignCode: temp
        }
        getShortUrl(body)
        .then(res => res.json())
        .then(data => {
            this.setState({
                loader: false
            })
            if(data.success){
                this.setState({
                    shortUrl: data.shortUrlDetails 
                }) 
                ToastsStore.success(data.message);  
            }  
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error=>{
            this.setState({
                loader: false
            })
            ToastsStore.error("Something went wrong. Please try again later.!!!")
            console.log(error);
        })
    }

    render(){ 
    return(
        
        <section className="mar--half margin-btm--quar pad--half">
             <Link to="/view-campaign"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
             <article className="card-custom margin-top leads-table-wrapper" style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
            <table className="client">
                <thead>
                    <tr className="text--center">
                        <th>Code</th>
                        <th>IP Address </th>
                        <th>Clicks</th>
                        <th>Click Time</th>
                        <th>Campaign Name</th>
                        <th>Audience Mobile</th>
                        <th>Audience GroupName</th>
                    </tr>
                </thead>
                <tbody>    
                        {
                            this.state.shortUrl && this.state.shortUrl.map(item=>{
                                return(
                                    <tr className="text--center">
                                        <td>{item.shortCode ? item.shortCod : "--"}</td>
                                        <td>{item.ip ? item.ip : "--"}</td>
                                        <td>{item.clicks ? item.clicks : "--"}</td>
                                        {
                                            item.clickTime &&
                                            <td><Moment format="YYYY-MM-DD HH:mm">{item.clickTime}</Moment></td>
                                        }
                                        {
                                            !item.clickTime &&
                                            <td>--</td>
                                        }
                                        
                                        <td>{item.campaignName ? item.campaignName : "--"}</td>
                                        <td>{item.audienceMobile ? item.audienceMobile : "--"}</td>
                                        <td>{item.audienceGroupName ? item.audienceGroupName : "--"}</td>
                                    </tr>
                                )   
                            })
                        }  
                </tbody>
                </table>
                </article>
                {/* <tfoot className="dialog-footer padding-top--half">
                    <button onClick={this.props.togglePopup} className="btn btn-fill dialog--cta pointer">CLOSE</button>
                </tfoot> */}
              <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
                {
                    this.state.loader &&
                    <CircularLoader />
                }
        </section>    
    );
}
}