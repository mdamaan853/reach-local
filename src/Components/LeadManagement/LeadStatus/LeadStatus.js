import React from 'react';
import Popup from '../../Popup/Popup';
import NewLeadStatus from './NewLeasStatus';
import {getLeadStatusClient,submitLeadStatus} from '../../../Services/lead-service';
import CircularLoader from '../../circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {Link} from 'react-router-dom';
import utils from '../../../Services/utility-service';

class LeadStatus extends React.Component{

    constructor(props){
        super(props);
        this.state={
            openNwLeadStatus: false,
            leadStatus:[],
            submitLoader: true,
            start:0,
            maxResults:100,
            formControl:{
                leadStatus:{
                    value:""
                },
                desc:{
                    value:""
                }
                // status:{
                //     value:""
                // }
            }
        }
        this.togglePopup = this.togglePopup.bind(this);
        this.submitData = this.submitData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.fetchLeadStatusClient();
    }

    deleteData(id){       
        let body={
            businessUid:null,
            status:this.state.formControl.leadStatus.value,
            id:parseInt(id),
            remove:true
           }     
           submitLeadStatus(body)
           .then(response => response.json())
           .then(data => {
               this.setState({
                submitLoader: false
               })
               if(data.success){
                ToastsStore.success(data.message);
                this.fetchLeadStatusClient();
               }
               else{
                ToastsStore.error(data.message); 
               }
           } )
           .catch(error => {
               ToastsStore.error("Something went wrong, Please Try Again Later ");
               this.setState({
                submitLoader: true
               })
           })
    }

    submitData(){
        let body={
         businessUid:null,
         status:this.state.formControl.leadStatus.value,
         id:null,
         remove:false
        }     
        submitLeadStatus(body)
        .then(response => response.json())
        .then(data => {
            this.setState({
             submitLoader: false
            })
            if(data.success){
             ToastsStore.success(data.message);
             this.togglePopup();
             this.fetchLeadStatusClient();
            }
            else{
             ToastsStore.error(data.message); 
            }
        } )
        .catch(error => {
            ToastsStore.error("Something went wrong, Please Try Again Later ");
            this.setState({
             submitLoader: true
            })
        })
     }

    fetchLeadStatusClient(){
        const body = {
            start :parseInt(this.state.start),
            maxResults :parseInt(this.state.maxResults),
            businessUid :null
        }
        getLeadStatusClient(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){     
                ToastsStore.success(data.message);
                this.setState({
                    leadStatus:data.status,
                    submitLoader: false       
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            this.setState({
                submitLoader: true
            })
            ToastsStore.error("Something went wrong, Please Try Again Later ");
        })     
    }

    togglePopup(){
        this.setState({
            openNwLeadStatus: !this.state.openNwLeadStatus
        })
    }

    handleChange(event){
        let name= event.target.name;
        let value=event.target.value;
        this.setState({
            formControl:{
                ...this.state.formControl,
                [name]:{
                    value:value
                }
            } 
        });
    }


    render(){
        return(
          <main className="wrapper-container">
             <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
             <article className="card-custom flex flex-direction--row flex-wrap pad--half">
              <h4 className="ui header">LEAD STATUS</h4>
                <button className="btn btn-fill btn-success margin-left--auto"  onClick={this.togglePopup}>New Lead Status</button>
              </article>
              <article className="card-custom margin-top leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}>
              
                <table className="client">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Lead Status Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>    
                         {    
                            this.state.leadStatus && this.state.leadStatus.length>0 && this.state.leadStatus.map((item,index) =>{
                                return(
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button className="btn btn-fill btn-expletus margin-left--auto"  onClick={()=>{this.deleteData(item.id)}}>DELETE</button>
                                    </td>
                                </tr>                    
                                );
                            })                         
                            }     
                    </tbody>
                </table>
              </article>
              {
                    this.state.submitLoader && 
                    <div className="margin-top--double">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
              }
              { this.state.openNwLeadStatus && 
                <Popup title="New Lead Status" togglePopup={this.togglePopup}>
                <NewLeadStatus
                    formControl={this.state.formControl}
                    changeHandler={this.handleChange}
                    togglePopup={this.togglePopup}
                    submitData={this.submitData}
                    submitLoader={this.state.submitLoader}
                />
                </Popup>
             }
             <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
          </main>
        );
}

}
export default LeadStatus;