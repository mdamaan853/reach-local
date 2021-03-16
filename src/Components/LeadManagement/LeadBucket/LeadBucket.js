import React from 'react';
import Popup from '../../Popup/Popup';
import NewLeadBucket from './NewLeadBucket';
import {getLeadBucket,submitLeadBucket} from '../../../Services/lead-service';
import CircularLoader from '../../circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import {Link} from 'react-router-dom';

class LeadBucket extends React.Component{

    constructor(props){
        super(props);
        this.state={
            openNwLeadBucket: false,
            bucket:[],
            submitLoader: true,
            start:0,
            maxResults:100,
            formControl:{
                bucket:{
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
        this.fetchLeadBucketClient();
    }

    fetchLeadBucketClient(){
        const body = {
            start :parseInt(this.state.start),
            maxResults :parseInt(this.state.maxResults),
            businessUid :null
        }
        getLeadBucket(body)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    bucket:data.buckets,
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
            openNwLeadBucket: !this.state.openNwLeadBucket
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

    deleteData(id){
        let body={
            businessUid:null,
            bucket:this.state.formControl.bucket.value,
            id:id,
            remove:true,
           }
           submitLeadBucket(body)
           .then(response => response.json())
           .then(data => {
               this.setState({
                submitLoader: false
               })
               if(data.success){
                ToastsStore.success(data.message);
                this.fetchLeadBucketClient();
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
        bucket:this.state.formControl.bucket.value,
        id:null,
        remove:false,
       }
       submitLeadBucket(body)
       .then(response => response.json())
       .then(data => {
           this.setState({
            submitLoader: false
           })
           if(data.success){
            ToastsStore.success(data.message);
            this.togglePopup();
            this.fetchLeadBucketClient();
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

    render(){
        return(
          <main className="wrapper-container">
              <Link to="/leads/management"><button  className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button></Link>
             <article className="card-custom flex flex-direction--row flex-wrap pad--half">
                <h4 className="ui header">BUCKET</h4>
                <button className="btn btn-fill btn-success margin-left--auto" onClick={this.togglePopup}>New Bucket</button>
              </article>
              <article className="card-custom leads-table-wrapper">
                <table className="client">
                    <thead>
                        <tr style={{textAlign:'center'}}>
                            <th>Bucket Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {    
                            this.state.bucket && this.state.bucket.length>0 && this.state.bucket.map((item,index) =>{
                                return(
                                <tr key={index}>
                                    <td>{item.bucket}</td>
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
              { this.state.openNwLeadBucket && 
                <Popup title="New Lead Bucket" togglePopup={this.togglePopup}>
                <NewLeadBucket
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
export default LeadBucket;