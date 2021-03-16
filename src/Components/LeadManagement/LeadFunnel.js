import React from 'react';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import CircularLoader from '../circular-loader/circular-loader';
import {getLeadFunnel} from '../../Services/lead-service';
import {Link} from 'react-router-dom';


export default class LeadFunnel extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            submitLoader: true,
            leadFunnel:[]
        }
    }
    componentDidMount(){
        this.fetchLeadFunnel();
    }

    fetchLeadFunnel(){
        let body ={}     
        getLeadFunnel(body)
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader:false,
                    leadFunnel:data.leadFunnels
                });

            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            this.setState({
                submitLoader: true          
            });
            ToastsStore.success("Something went wrong. Please Try Again Later !!");
        })
    }
    render(){
        return(
            <main className="wrapper-container">
                <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
                <article className="card-custom pad">
                        <h4 className="ui header">LEAD FUNNEL</h4>
                </article>
                <article className="card-custom pad">
                    <table className="client">            
                        <thead>
                            <tr className="">
                                <th>Lead Funnel ID</th>
                                <th>Lead Funnel</th>           
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.leadFunnel && this.state.leadFunnel.length>0 && this.state.leadFunnel.map((item,index)=>{ 
                                    return(
                                    <tr className="">
                                        <td>{item.id}</td>
                                        <td>{item.funnel}</td>                                              
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
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>             
            </main>
        );
    }
}