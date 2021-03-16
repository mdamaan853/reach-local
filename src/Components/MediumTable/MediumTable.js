import React, { Component } from 'react';
import SvgIcon from '../Svg-icon/Svg-icon';
import CircularLoader from '../circular-loader/circular-loader';

class MediumTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            actions:["datasource","edit"]
        }    
    }
    render(){
        return(
            <section className="card-custom">           
                <table className="client">
                    <tbody>
                        <tr>
                            <th>Medium Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                         {    
                            this.props.mediums.map((item,index)=>{ 
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.status}</td>
                                    <td>           
                                        { 
                                            this.props.allowedActions[0] === "all" &&
                                            this.state.actions.map((item,subIndex) => {
                                                return(
                                                    <span key={subIndex} className="margin-left pointer" onClick={() => this.props.toggleAction(index,item)}><SvgIcon icon={item} classes={'svg--lg'}></SvgIcon></span>
                                                );
                                            })
                                        }
                                        { 
                                            this.props.allowedActions && this.props.allowedActions.length > 0 &&
                                            this.props.allowedActions.map((item,subIndex) => {
                                                item = item === 'map' ? 'datasource' : item;
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
                    false &&
                    <div className="margin-btm margin-top">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                } 
                {
                    this.props.mediums.length === 0 && 
                    <div className="padding-top padding-btm" style={{textAlign:'center',fontSize:'small'}}>
                        No Data to show
                    </div>
                }                         
            </section>          
        );
    }  
}

export default MediumTable;