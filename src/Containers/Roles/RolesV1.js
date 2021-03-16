import React from 'react';
import PageTitle from '../../Components/Helmet';
import RoleTable from '../../Components/Roles/RoleTable';
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import NewRole from '../../Components/Roles/NewRole';
import Popup from '../../Components/Popup/Popup';
import {getNewRoleGroupTable,getNewRoleDropdown,addRoles,addNewRoleGroup} from '../../Services/roles-service';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import Youtube from '../../Components/Youtube/Youtube';

export default class RolesV1 extends React.Component{

    constructor(props){
        super(props);
        this.state={
            permissionGroups:[],
            roles:[],
            openPopup: false,
            submitLoader:false,
            formControl:{
                groupName:{
                    value:""
                },
                roleDesc:{
                    value:""
                },
            },
            howTo: false
        }
    }

    componentDidMount(){
        this.fetchAllPermissionGroups();
        this.fetchAllRoles();
    }

    togglePopup(){
        this.setState({
            openPopup: !this.state.openPopup
        });
    }

    changeHandler(event){
        let name= event.target.name;
        let value=event.target.value;
        this.setState({
            formControl:{
                ...this.state.formControl,
                [name]:{
                    ...this.state.formControl[name],
                    value:value
                }
            }
        }
        );
    }
    
    fetchAllPermissionGroups(){
        let body = {};
        getNewRoleGroupTable(body)
        .then(response => response.json())
        .then( data => {
            // console.log(data);
            if(data.success){
                this.setState({
                    permissionGroups: this.formatGroupData(data.groups)
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            console.log(error);
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!.");
        })
    }

    formatGroupData(data){
        if(data && data.length>0){
            data.forEach(e => {
                e.roles = this.formatData(e.roles);
            })
        }
        return data;
    }

    fetchAllRoles(){
        let body = {};
        getNewRoleDropdown(body)
        .then(response => response.json())
        .then( data => {
            if(data.success){
                this.setState({
                    roles: this.formatData(data.permissions)
                })
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error => {
            console.log(error);
            ToastsStore.error("Something Went Wrong. Please Try Again Later !!!.");
        })
    }

    formatData(data){
        let temp = [];
        if(data && data.length>0){
             data.forEach(e=> {
                 let obj = {
                     "value": e.role, 
                     "label": e.name 
                 }
                 temp.push(obj);
             });
        }
        return temp;
    }

    multiSelectChangeHandler(event,index){
        let temp = this.state.permissionGroups;
        temp[index].roles = event;    
        this.setState({
            permissionGroups:temp
        });
    }

    submitaddRoles(index){
        let body = {
            "permissionGroupId": this.state.permissionGroups[index].groupId,
            "roles": this.getIds(this.state.permissionGroups[index].roles)
        }
        addRoles(body)
        .then(response => response.json())
        .then( data => {
            if(data.success){
                ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
            console.log(error);
        })
    }

    getIds(data){
        let temp = [];
        if(data && data.length > 0){
            data.forEach(e => {
                temp.push(e.value);
            })
        }
        return temp;
    }

    createNewRoleGroup(){
        if(!this.state.formControl.groupName.value){
            ToastsStore.error("Group Name cannot be empty.");
            return;
        }
        const body={
            groupName: this.state.formControl.groupName.value,
        }
        this.setState({
            submitLoader: true
        })
        addNewRoleGroup(body)
        .then(response => response.json())
        .then(data =>{
             if(data.success){
                ToastsStore.success(data.message);
                this.setState({
                    submitLoader:false,
                })
                this.togglePopup();
                this.fetchAllPermissionGroups();
             }
             else{
                 ToastsStore.error(data.message);
             }
        })
        .catch( error =>{
            ToastsStore.error("Something went wrong. Please Try Again Later !!!")
            this.setState({
                submitLoader: false
            })
        })
    }

    showVideo(){
        this.setState({
            howTo: !this.state.howTo
        })
    }

    render(){
        return(
            <main className="wrapper-container">
                <PageTitle title="Roles Management" description="Welcome to Role Management"/>
                 <div style={{textAlign:'end'}}>
                     <i className="youtube large icon" style={{ color: '#ff0201' }}></i>
                    <span className="pointer text--bold text--underline" style={{color:'#4183c4',textAlign:'end'}} onClick={()=>{this.showVideo()}}>How to Create Roles and Permission ?</span>
                </div>
                {
                    this.state.howTo && 
                    <Popup title={'How to Create Roles and Permission ?'} togglePopup={this.showVideo.bind(this)}>
                        <Youtube url={'HsVLRTaG334'}/>
                    </Popup>
                }
                <article className="card-custom flex flex-direction--row flex-wrap pad--half">
                    <div>
                        <h4 className="ui header">ROLES</h4>
                        <div>
                            <SvgIcon icon="information" classes="svg--lg" ></SvgIcon>
                            <span className="margin-left--quar text-small">This section is relevant when you have multiple employees working on our platform.</span>
                        </div>
                    </div>
                    <button className="btn btn-fill btn-success margin-left--auto"  onClick={()=>this.togglePopup()}>New Role/Permission Group</button>
                </article>
        
                <RoleTable
                   roles = {this.state.roles}
                   addRoles = {this.submitaddRoles.bind(this)}
                   multiSelectChangeHandler = {this.multiSelectChangeHandler.bind(this)}
                   permissionGroups = {this.state.permissionGroups}
                />

                {
                    this.state.submitLoader && 
                    <div className="margin-top--double">
                        <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
               
                { 
                this.state.openPopup && 
                    <Popup title="New Role Group" togglePopup={this.togglePopup.bind(this)}>
                        <NewRole
                            formControl={this.state.formControl}
                            changeHandler={this.changeHandler.bind(this)}
                            togglePopup={this.togglePopup.bind(this)}
                            submitData={this.createNewRoleGroup.bind(this)}
                            submitLoader={this.state.submitLoader}
                        />
                    </Popup>
                }

            <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
            </main>
        );
    }
}