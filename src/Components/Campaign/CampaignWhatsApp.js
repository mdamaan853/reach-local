import React,{useEffect,useState} from 'react';
import Popup from '../Popup/Popup';
import CircularLoader from '../circular-loader/circular-loader';
import {getCredentials} from '../../Services/campaign-service';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

export default function CampaignWhatsApp(props){
    
    const [loader,setLoader] = useState(false);
    const [email,setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [details, setDetails] = useState(false);

    useEffect(()=>{
        setLoader(true);
        let body={}
        getCredentials(body)
        .then(r => r.json())
        .then(data =>{
            setLoader(false);
            if(data.success){
                setEmail(data.email);
                setPassword(data.password);
                // ToastsStore.success("Fetched Credentials Successfully. Please Click Show Credential");
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e=>{
            setLoader(false);
            ToastsStore.error("Something went wrong. Difficult to show credentials");
        })
    },[])

    return(
        <React.Fragment>
            {
                details && 
                <Popup title="Credentials" togglePopup={()=> setDetails(false)}>
                    <article className="senderId-modal--wrapper">
                        <div >
                            <span className="label" style={{fontSize:"large"}}>Email:</span><span style={{fontSize:"large"}}>{email}</span>
                        </div>  
                                       
                        <div className="col-20 margin-top">
                            <span className="label" style={{fontSize:"large"}}>Password:</span><span style={{fontSize:"large"}}>{password}</span>
                        </div>
                    </article>  
                    <div className="dialog-footer pad">
                    <button 
                            className="btn btn-fill dialog--cta pointer" 
                            onClick={()=>setDetails(false)}>
                                Close
                    </button>
                    </div> 
                    {
                        loader &&
                        <div className="global-loader col-1">
                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                        </div>
                    }                
                </Popup>
            } 
            <div className="flex justify-flex-end algn-vert-center">
                <a href="http://whatsapp.reachlocalads.com/" target="_blank" rel="noopener noreferrer"><b>Go to WhatsApp Panel</b></a>
                <button className="btn btn-fill btn-success" style={{width:"15%",marginLeft:"1%"}} onClick={()=>setDetails(true)}>Show Credentials</button>                    
            </div>   
                   
            <iframe title="WhatsApp" src="https://www.whatsapp.reachlocalads.com/" width="100%" height="400"></iframe> 
           
            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
            
        </React.Fragment>
    )
}
