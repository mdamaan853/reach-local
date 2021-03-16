import React from 'react';

export default class AssignFieldAgent extends React.Component{
    render(){
        return(
            <div className="flex-20 leadDetail-card pad margin-top leadDetail-card">
                <div className="">
                    <label className="text--capitalize text--bold changeStatus-cta margin-top--half pointer text--center" 
                    onClick={
                        ()=>{
                        return(
                            this.setState({opnAssignOwner: true}),
                            this.getUsertoAssign()
                        ) } }                  
                        >Assign Field Agent</label>            
                </div>
                {
                    this.state.opnAssignOwner && 
                    <PopUp title="Assign Agent" togglePopup={()=>{this.setState(state=>{return{opnAssignOwner: !state.opnAssignOwner}})}}>
                        <AssignOwnerLead 
                            users={this.state.users}
                            dateChange = {this.dateChange.bind(this)}
                            formControls={this.state.formControls}
                            leadDetailId={this.props.leadData.id} 
                            changeHandler={this.changeHandler.bind(this)}                 
                        />
                            <div className="dialog-footer margin-top" style={{padding:'30px'}}>    
                            <div>
                                <button className="btn btn-fill dialog--cta pointer" 
                                onClick={()=>{this.setState({opnAssignOwner: false})}}>
                                    Back
                                </button>                      
                                <button  onClick={this.verifyDetails} className="btn btn-fill btn-success margin-left--half dialog--cta pointer">Assign</button>
                            </div>      
                        </div>  
                    </PopUp>
                }
                
            </div>
        );
    }
}