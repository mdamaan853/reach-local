import React from 'react';
import PageTitle from '../../Components/Helmet';
import utils from '../../Services/utility-service';
import {fetchRoles} from '../../Services/roles-service';
import {Link} from 'react-router-dom';
import { getUserDetails } from '../../Services/user-service';
import "./LeadManagement.css";

class LeadManagement extends React.Component{

    constructor(props){
        super(props);
        this.state={
            showPublisher:false,
            type:"",
            cards:[{
                url:'/leads/summary',
                text:'LEADS'
            }],
            bCards:[{
                url:'/leads/status',
                text:'LEAD STATUS'
            },{
                url:'/leads/funnel',
                text:'LEAD FUNNEL'
            },{
                url:'/leads/bucket',
                text:'BUCKETS'
            },{
                url:'/leads/mapping',
                text:'LEAD STATUS MAPPING'
            },{
                url:'/leads/status/group/name',
                text:'STATUS GROUP STATUS MAPPING'
            },{
                url:'/leads/leadtype/mapping',
                text:'LEAD TYPE ASSIGNMENT'
            }],
            pCards:[{
                url:'/leads/publisher',
                text:'PUBLISHER MAPPING'
            },{
                url:'/leads/reports',
                text:'LEAD REPORTS'
            }],
            plCards:[{
                url:'/leads/push',
                text:'PUSH LEADS'
            },
            {
                url:'/leads/assignLead',
                text:"ASSIGN LEADS"
            }
        ],
            // empCards:[{
            //     url:'',
            //     text:"ASSIGN LEADS"
            // }]
        }
    }
    
    componentDidMount(){
        this.fetchUserDetail();
        this.getRequiredRoles();
    }

    getRequiredRoles(){
        fetchRoles('Leads')
        .then(response => response.json())
        .then(data =>{
            if(data.success && data.subRoles && data.subRoles.length>0){
                utils.roles = data.subRoles;
                // console.log(data.subRoles);
                // this.afterDidMount();
            }else if(data.success && data.subRoles && data.subRoles.length === 0){
                // this.setState({
                //     accessDenied:true
                // })
            }else{
                // ToastsStore.error("Something went wrong, Please Try Again Later ");
            }
        })
        .catch(error =>{
             console.log(error);
            //  ToastsStore.error("Something went wrong, Please Try Again Later ");
        })
    }

    fetchUserDetail() {
        getUserDetails()
          .then(response => response.json())
          .then(data => {   
            if (data.success) {
                this.setState({
                    showPublisher: data.showPublisher,
                    type:data.type
                })
                           
            }
          })
          .catch(error => {
            console.log(error);
          });
    }

    render(){
        let cds = [];
        cds = cds.concat(this.state.cards);
        if(this.state.type && (this.state.type === "BUSINESS" || this.state.type ==="AGENCY")){
            cds = cds.concat(this.state.bCards);
        }
        if(this.state.showPublisher){
            cds = cds.concat(this.state.pCards);
        }
        cds = cds.concat(this.state.plCards);
        return(
            <main className="wrapper-container">
                <PageTitle title="Leads Management" description="Welcome to Lead Management"/>
                <article className="card-custom  pad">
                    <h4 className="ui header">LEAD MANAGEMENT</h4>
                </article>
                <section className={`${utils.isMobile ? "ui two cards":"ui four cards"}`}>              
                    {
                        cds.map((item,index) => {
                            return(
                                <div key={index} className="ui card">
                                    <Link to={item.url} style={{marginTop:'auto',marginBottom:'auto',textAlign:'center'}}>
                                        <div className="content">
                                            <div className="header pad" style={{fontSize:"16px"}}>{item.text}</div> 
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </section>
            </main>
        );
    }
}
export default LeadManagement;