import React, { Component } from 'react';
import utils from '../../Services/utility-service';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import CircularLoader from '../../Components/circular-loader/circular-loader';

class MediumTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            actions:["edit"]
        }    
    }
    render(){
        return(
            <section className="card-custom padding-btm--half leads-table-wrapper"
                style = { utils.isMobile ? {maxHeight: "60vh"} : {maxHeight: "70vh"}}
            >             
                <table className="client">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            {/* <th>DND Hour Blocking</th>
                            <th>DND Subscribing</th> */}
                            <th>Language</th>
                            <th>Url</th>
                            <th>Body</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                         {    
                            this.props.templates.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.smsType === 'PRML' ? 'Promotional' : 'Transactional'}</td>
                                    {/* <td>{item.dndHourBlockingEnabled ? 'Yes' : 'No'</td> */}
                                    {/* <td>{item.dndScrubbingOn ? 'Yes' : 'No'}</td> */}
                                    <td>{item.lang === 'EN' ? 'English' : item.lang}</td>
                                    <td>{item.url}</td>
                                    <td><span onClick={() => this.props.toggleAction(index,'view')} className="pointer" style={{textDecoration:'underline'}}>Click to view</span></td>
                                    <td>           
                                        { 
                                            this.state.actions.map((item,subIndex) => {
                                                return(
                                                    <span key={subIndex} className="margin-left pointer" onClick={() => this.props.toggleAction(index,item)}><SvgIcon icon={item} classes={'svg--lg'}></SvgIcon></span>
                                                );
                                            })
                                        } 
                                    </td>
                                </tr>                              
                                );
                             }) 
                         } 
                    </tbody>
                </table>
                {
                    this.props.loadingData &&
                    <div className="margin-btm margin-top">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
                {
                    this.props.templates.length === 0 && !this.props.loadingData &&
                    <div className="margin-btm margin-top" style={{textAlign:'center',fontSize:'small'}}>
                        No Templates to show
                    </div>
                }                        
            </section>          
        );
    }  
}

export default MediumTable;