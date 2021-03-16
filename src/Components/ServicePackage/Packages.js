import React from 'react';
import utils from '../../Services/utility-service';

export default function Packages(props){
    return(
        <section className="ui cards flex-horz-center">
            {
            props.servicePackages && props.servicePackages.map((item,index) =>{
                return(
                        <div class="card text--center" style={{margin:'1.5em'}}>
                            {
                                (utils.isSuAdmin || (props.userType && props.userType ==="AGENCY")) &&                   
                                <div className="text-end" style={{color:'#4183c4'}} onClick={()=>props.editPakage(index,item.code)}><i class="edit large icon"></i></div>
                            }
                            <div className="content" style={{padding:'2.5em', borderTop:"none"}}>
                                <p className="header padding-btm--half" style={{color:'#4183c4',fontSize:'2em',wordBreak:'break-all'}}>
                                    {item.name}
                                </p>    
                            </div>
                            <div className="description pad">
                                { item.price && 
                                    <div className="" style={{color:'#4CAF50',fontSize:'1.1em'}}>
                                        &#8377;{item.price}
                                    </div>
                                }
                                {/* { !item.price && 
                                    <div className="" style={{color:'#4CAF50',fontSize:'1.1em'}}>
                                        Customize to know the price
                                    </div>
                                } */}
                            <div/>
                                <div>{item.desc}</div>
                            </div>
                            {/* {
                                item.price && */}
                                    <button className="ui bottom btn btn-servicePackage btn-fill" 
                                        onClick={()=>props.setIndex(index)} style={{fontWeight:'bold'}}>
                                        BUY PACKAGE 
                                    </button>  
                            {/* } */}
                            {/* {
                                !item.price &&
                                    <button className="ui bottom btn btn-servicePackage btn-fill" 
                                        onClick={()=>props.setIndex(index)} style={{fontWeight:'bold'}}>
                                        CUSTOMIZE PACKAGE 
                                    </button>  
                            } */}
                                                    
                        </div>
                );
            }) 
            }       
        </section>
    )
}


