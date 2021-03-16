import React from 'react';
import PageTitle from '../../Components/Helmet';
import {Link} from 'react-router-dom';
import Popup from '../../Components/Popup/Popup';
import IVRtable from '../../Components/IVR/IVRtable';
import IVRFilter from '../../Components/IVR/IVRFilter';
import {getCallDetail} from '../../Services/ivr-services';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

export default class IVR extends React.Component{

    constructor(props){
        super(props);
        this.state={
            callDetails:[],
            start: parseInt(0),
            hasNext:false,
            submitLoader:false,
            showFilter:false,
            showClrBtn:false,
            filter:{
                callerMobile:{
                    value:null
                },
                receiverMobile:{
                    value:null
                },
                callType:{
                    value:""
                },
                startDate:{
                    value:""
                },
                endDate:{
                    value:""
                }
            }
        }
        this.togglePopup = this.togglePopup.bind(this);
        this.callDetails = this.callDetails.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.getPagination = this.getPagination.bind(this);
        this.textHandleChange = this.textHandleChange.bind(this);
    }

    componentDidMount(){
        this.callDetails();
    }

    getPagination(type){
        if(type === 'previous'){
            if(this.state.start > 0){
                this.setState({
                    start: this.state.start - 50,
                },()=>{
                    this.callDetails();
                })
            }
        }else if(type === 'next'){
            if(this.state.hasNext){
                this.setState({
                    start: this.state.start + 50,
                },()=>{
                    this.callDetails();
                })
            }
        }
    }
    
    callDetails(filter) {
            let body={
                id: null,
                start: this.state.start,
                maxResults: parseInt(50),
                businessUid: null,
                startDate: null,
                endDate: null,    
                refType:  parseInt(2),
                callerMobile: null,
                receiverMobile: null,
                refId: null
            }
        
         if(filter === "filter"){
            let eDate=this.state.filter.endDate.value;
            let sDate=this.state.filter.startDate.value; 
            let callerMob = this.state.filter.callerMobile.value;
            let receiverMob = this.state.filter.receiverMobile.value ? this.state.filter.receiverMobile.value:null ;
            let calType = this.state.filter.callType.value ? this.state.filter.callType.value:null;
            let startDate= this.state.filter.startDate.value ? sDate.getTime() :null;
            let endDate= this.state.filter.endDate.value? eDate.getTime() :null;
            body.callerMobile=callerMob;
            body.receiverMobile=receiverMob;
            body.refType=calType;
            body.startDate=startDate;
            body.endDate=endDate;
            this.setState({
                showClrBtn:true
            })
        }
          
        else if(filter === "clear"){
            let clearFilter = this.state.filter;
            clearFilter.callerMobile.value=null;
            clearFilter.receiverMobile.value=null;
            clearFilter.callType.value=null;
            clearFilter.endDate.value=null;
            clearFilter.startDate.value=null;
            this.setState({
                filter:clearFilter,
                showClrBtn: !this.state.showClrBtn
            })
            body.callerMobile=this.state.filter.callerMobile.value ? this.state.filter.callerMobile.value:null;
            body.receiverMobile=this.state.filter.receiverMobile.value;
            body.refType=this.state.filter.callType.value;
            body.startDate=this.state.filter.startDate.value;
            body.endDate=this.state.filter.endDate.value;
        }
        getCallDetail(body)
        .then(response => response.json())
        .then( data =>{
            if(data.success){
                if(data.callingDetails && data.callingDetails.length > 0){
                    this.setState({
                        callDetails:data.callingDetails,
                        submitLoader: false,
                        hasNext:(data.callingDetails.length === parseInt(50))
                    })
                }
                else{
                   // ToastsStore.error("No Call Details Found");
                    this.setState({
                        hasNext: false
                    })
                }          
                if(filter === "filter"){
                    this.togglePopup();
                }
                ToastsStore.success(data.message);    
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something went wrong, Please try again later.!!!");
            this.setState({
                submitLoader: true
            })
        })
    }

    dateChange(event,name){
        const value=event;
        this.setState({
             filter:{
                 ...this.state.filter,
                [name]:{
                    ...this.state.filter,
                    value
                }
             }
        })
    }

    textHandleChange(event){
        let value = event.target.value;
        let name = event.target.name;
        this.setState({
            filter:{
                ...this.state.filter,
                [name]:{
                    ...this.state.filter,
                    value
                }
            }
        });
    }

    togglePopup(){
        this.setState(state =>{
            return{
                showFilter: ! state.showFilter
            }     
        })  
    }

    render(){
        return(
            <main className="wrapper-container">
                <PageTitle title="IVR (Calling Details)" description="Calling details" />
                <article className="card-custom flex flex-direction--row pad--half align-space-between">
                    <h4 className="ui header">Calling Details</h4>
                    {
                        this.state.showClrBtn &&
                        <span>
                            <Link to="/service/package"><button  className="ui tiny blue button margin-right--quar">Buy Now</button></Link>
                            <button onClick={() => this.callDetails("clear")} className="ui tiny grey button margin-right--quar">Clear Filters</button>                                       
                            <button onClick={this.togglePopup} className="ui tiny teal button">Filter</button>
                        </span>  
                    }
                    {
                        !this.state.showClrBtn && 
                        <span>
                            <Link to="/service/package"><button  className="ui tiny blue button margin-right--quar">Buy Now</button></Link>
                            <button onClick={this.togglePopup} className="ui tiny teal button">Filter</button>
                        </span>
                    }
     
                </article>                
                <IVRtable
                    callDetails={this.state.callDetails}
                    start={this.state.start}
                    loader={this.state.submitLoader}
                    getCallDetails={this.getPagination}
                    hasNext={this.state.hasNext}
                />                    
                {
                    this.state.showFilter && 
                    <Popup title={'IVR Filter'} togglePopup={this.togglePopup}>
                        <IVRFilter
                            textHandleChange ={this.textHandleChange}
                            filter={this.state.filter}
                            submitData={this.callDetails}
                            clearFilter = {this.callDetails}
                            togglePopup={this.togglePopup}
                            dobChange={this.dateChange}
                        />
                    </Popup>        
                }
                {
                   this.state.submitLoader &&
                    <div className="global-loader col-1">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }   
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore} />           
            </main>
        );
    }
}