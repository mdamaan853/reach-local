import React, { Component } from 'react';
import CircularLoader from '../circular-loader/circular-loader';
import {getclients,getMappedclients,addUpdateClient} from '../../Services/datasource-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import SvgIcon from '../Svg-icon/Svg-icon';
import {Link} from 'react-router-dom';
import utils from '../../Services/utility-service';

class AddClients extends Component{
    constructor(props){
        super(props);
        this.state = {
            clients:[],
            mappedClients:[],
            datasource:null,
            addClientLoader:false            
        }  
        
    }
    componentDidMount(){
        let temp = localStorage.getItem("datasource");
        if(temp){
            this.setState({
                datasource : JSON.parse(temp)
            },()=>this.fetchBusinessClientMapping())
        }
        this.fetchAvailableClients();
    }
    fetchAvailableClients(){
        let body = {}
        getclients(body)
        .then(response => response.json())
        .then(data => {
          //let data = { "success": true, "message": "Success", "allowedActions": [], "clients": [ { "uid": "70005000401", "name": "qwerty" }, { "uid": "70005000568", "name": "qweqweq" }, { "uid": "70002000610", "name": "213213213" }, { "uid": "70005000789", "name": "213123" }, { "uid": "70007000859", "name": "123123123" }, { "uid": "70006000948", "name": "qweqwe" }, { "uid": "70009001083", "name": "wrewerwer" } ] };
          if (data.success) { 
            this.setState({
              clients: data.clients, 
            })
          }
        })
        .catch(error => {
            console.log(error);
        })
    }
    fetchBusinessClientMapping(){
        let body = {
            "ammId" : this.state.datasource ? this.state.datasource.ammId : null
        }
        getMappedclients(body)
        .then(response => response.json())
        .then(data => {
            //let data = { "success": true, "message": "Success", "allowedActions": [], "businessMapping": [ { "uid": "70005000401", "businessName": "qwerty", "status": null }, { "uid": "70007000859", "businessName": "123123123", "status": null }, { "uid": "70006000948", "businessName": "qweqwe", "status": "ACT" } ] };
            if (data.success) { 
              this.setState({
                mappedClients: data.businessMapping, 
              })
            }
          })
          .catch(error => {
              console.log(error);
          })
    }

    addNewClient(del,bamid,uid){
        let body;
        if(del){  
            body={
                "remove":true,
                "businessAudienceMappingId":bamid,
                "businessUid":uid
            }          
        }
        else{
            if(!document.getElementById("clients").value){
                ToastsStore.error("Please Choose Client to Add");
                return;
            }
        
   
            if(!this.state.datasource){
                ToastsStore.error("Something went wrong, Please try again later !");
                return;
            }
            let val = document.getElementById("clients").value;
            body = {
                "businessUid" : val,
                "audienceMediumMappingId" : this.state.datasource.ammId,
                "price" : this.state.datasource.pricePerCredit,
                "minCreditToBuy" : this.state.datasource.minCreditToBuy,
                "minCampaign" : this.state.datasource.minCreditPerCampaign,
            }
        }
    this.setState({
        addClientLoader: true
    })
    addUpdateClient(body)
    .then(response => response.json())
    .then(data => {
        if(data.success){
            ToastsStore.success(data.message);
            this.fetchBusinessClientMapping();
        }else{
            ToastsStore.error(data.message);
        }
        this.setState({
            addClientLoader: false
        })
    })
    .catch(error => {
        this.setState({
            addClientLoader: false
        })
        ToastsStore.error("Something went wrong, Please try again later !");
        console.log(error);
    })
    }
    
    render(){
        return(
          <main className="sender-id--wrapper">
            <div className="section-title"><span style={{fontWeight:'400'}}>Datasource : </span> {this.state.datasource ? this.state.datasource.agName : ''}, <span style={{fontWeight:'400'}}>Mapped Clients</span></div>
               <section className="flex margin-btm--half margin-top">
                  <div className="senderId-action--wrapper margin-btm margin-top">
                    <Link to="/datasource"><button className="btn btn-fill btn-success">Back</button></Link>
                  </div>
                  <div className="col-9 margin-left--auto margin-top">
                      <select id="clients" className="form-control">
                          <option hidden value="">Choose Client</option>
                          {
                            this.state.clients.map((item,index)=>{
                              return(
                                <option key={index} value={item.uid}>{item.name}</option>
                              )
                            })
                          }
                      </select>
                  </div>
                  <div className="senderId-action--wrapper margin-btm margin-top">
                      {
                        this.state.addClientLoader &&
                        <div>
                              <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                        </div>
                      }
                      {
                        !this.state.addClientLoader && 
                        <button onClick={()=>this.addNewClient()} className="btn btn-fill btn-success margin-left--auto">Add</button>
                      }
                  </div>
               </section>
               <section className="margin-top leads-table-wrapper" 
                    style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
                >           
                <table className="client">
                    <thead>
                        <tr>
                            <th>Client Id</th>
                            <th>Name</th>
                            {/* <th>Company</th> */}
                            <th>Email</th>
                            {/* <th>Mobile</th> */}
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {    
                            this.state.mappedClients.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.uid}</td>
                                    <td>{item.businessName}</td>
                                    {/* <td>{item.company}</td> */}
                                    <td>{item.email}</td>
                                    {/* <td>{item.mobile}</td> */}
                                    <td>{item.status}</td>
                                    <td>
                                        <div onClick={()=>this.addNewClient("delete",item.bamId,item.uid)}><SvgIcon icon={"delete"} classes={'svg--lg'}></SvgIcon></div>
                                    </td>                                   
                                </tr>                                                            
                                );                               
                             }) 
                         } 
                    </tbody>
                </table>
              </section> 
              <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />
          </main>         
        );
    }  
}

export default AddClients;