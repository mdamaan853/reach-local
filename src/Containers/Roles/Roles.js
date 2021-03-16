

// import React from 'react';
// import RoleTable from '../../Components/Roles/RoleTable';
// import NewRole from '../../Components/Roles/NewRole';
// import Popup from '../../Components/Popup/Popup';
// import {addRoles,getNewRoleDropdown,addNewRoleGroup,getNewRoleGroupTable} from '../../Services/roles-service';
// import CircularLoader from '../../Components/circular-loader/circular-loader';
// import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

// export default class Roles extends React.Component{

//     constructor(props){
//         super(props);
//         this.state={
//             roles:[],
//             addRolesTable:[],
//             id:"",
//             rolesDropdown: [],
//             openPopup: false,
//             submitLoader:false,
//             formControl:{
//                 groupName:{
//                     value:""
//                 },
//                 roleDesc:{
//                     value:""
//                 },
//             },
//             MultiSelect:{
//                 rolesDropdown:{
//                     value:"",
//                     id:""
//                 }
//             }
//         }          
//         this.togglePopup = this.togglePopup.bind(this);
//         this.changeHandler = this.changeHandler.bind(this);
//         this.fetchNewRoleGroup = this.fetchNewRoleGroup.bind(this);
//         this.fetchNewRoleDropdown = this.fetchNewRoleDropdown.bind(this);
//         this.submitaddRoles = this.submitaddRoles.bind(this);
//         this.multiSelectOptionsArray = this.multiSelectOptionsArray.bind(this);
      
//     }

//     componentDidMount(){
//         this.fetchNewRoleGroupTable();
//         this.fetchNewRoleDropdown();
//     }

//     togglePopup(){
//         this.setState({
//             openPopup: !this.state.openPopup
//         });
//     }

//     changeHandler(event){
//         let name= event.target.name;
//         let value=event.target.value;
//         this.setState({
//             formControl:{
//                 ...this.state.formControl,
//                 [name]:{
//                     ...this.state.formControl[name],
//                     value:value
//                 }
//             }
//         }
//         );
//     }

//     multiSelectChangeHandler(id,event){
//         let assignedRoles = [];
//        if(event && event.length>0){
//            event.forEach((item,index)=>{
//                 assignedRoles[index] = item.value
//            })
//        }
//        this.setState({
//             MultiSelect:{
//                 ...this.state.MultiSelect,
//                 rolesDropdown:{
//                     ...this.state.MultiSelect.rolesDropdown,
//                     value:assignedRoles,
//                     id:id
//                 }
//             }    
//        });
//     }

//     multiSelectOptionsArray(){
//         const rolesDrpdwn=[];      
//       if(this.state.rolesDropdown && this.state.rolesDropdown.length>0){
//         this.state.rolesDropdown.forEach((item) => {
//                 let obj = {
//                     "value": item.role, 
//                     "label": item.role 
//                 }
//                 rolesDrpdwn.push(obj);           
//         })     
//       }
//         return rolesDrpdwn;
//     }
    
//     fetchNewRoleGroup(){
//         const body={
//             groupName: this.state.formControl.groupName.value,
//         }
//         addNewRoleGroup(body)
//         .then(response => response.json())
//         .then(data =>{
//              if(data.success){
//                 ToastsStore.success(data.message);
//                 this.setState({
//                     submitLoader:false,
//                 })
//                 this.togglePopup();
//                 this.fetchNewRoleGroupTable();
//              }
//              else{
//                  ToastsStore.error(data.message);
//              }
//         })
//         .catch( error =>{
//             ToastsStore.error("Something went wrong. Please Try Again Later !!!")
//             this.setState({
//                 submitLoader: true
//             })
//         })

//     }

//     fetchNewRoleGroupTable(){
//         const body={ }  
//         getNewRoleGroupTable(body)
//         .then(response => response.json())
//         .then( data => {
//             if(data.success){
//                 ToastsStore.success(data.message);
//                 this.setState({
//                     submitLoader: false,
//                     roles: data.groups,
//                 })
//             }
//             else{
//                 ToastsStore.error(data.message);
//             }
//         })
//         .catch(error => {
//             ToastsStore.error("Something Went Wrong. Please Try Again Later !!!.");
//             this.setState({
//                 submitLoader: true
//             })
//         })
//     }

//     fetchNewRoleDropdown(){
//         const body={}
//         getNewRoleDropdown(body)
//         .then(response => response.json())
//         .then( data =>{
//             if(data.success){
//                 ToastsStore.success(data.message);
//                 this.setState({
//                     rolesDropdown:data.permissions,
//                     submitLoader: false
//                 })
//             }
//             else{
//                 ToastsStore.error(data.message);
//             }
//         }).catch(error =>{
//             ToastsStore.error("Something went wrong. Please try again later.!!!");
//             this.setState({
//                 submitLoader: true
//             })
//         })
//     }

//     submitaddRoles(){
//         let roles=this.state.MultiSelect.rolesDropdown.value;
//         let id = this.state.MultiSelect.rolesDropdown.id;
//         const body={
//             roles:roles,
//             permissionGroupId:parseInt(id)
//         }      
//         addRoles(body)
//         .then(response => response.json())
//         .then( data => {
//             if(data.success){
//                 ToastsStore.success(data.message);
//                 this.setState({
//                     submitLoader:false,
//                     addRolesTable: data.roles,
//                     id: data.id
//                 });
//             }
            
//             else{
//                 ToastsStore.error(data.message);
//             }
//         })
//         .catch(error =>{
//             ToastsStore.error("Something Went Wrong. Please Try Again Later.!!!");
//             this.setState({
//                 submitLoader:true
//             })
//         })
//     }

//     render(){
//         return(
//             <main className="wrapper-container">
//                 <article className="card-custom flex flex-direction--row flex-wrap pad--half">
//                     <h4 className="ui header">ROLES</h4>
//                     <button className="btn btn-fill btn-success margin-left--auto"  onClick={this.togglePopup}>New Role/Permission Group</button>
//                 </article>
        
//                 <RoleTable
//                    roles={this.state.roles}
//                    addRoles = {this.submitaddRoles}
//                    multiSelectChangeHandler = {this.multiSelectChangeHandler.bind(this)}
//                    addRolesTable = {this.state.addRolesTable}
//                    multiSelectOptionsArray={this.multiSelectOptionsArray.bind(this)}
//                   id={this.state.id}
//                 />

//                 {
//                     this.state.submitLoader && 
//                     <div className="margin-top--double">
//                         <CircularLoader stroke={"#c82506"} size={"36"} buttonSize={"50px"}></CircularLoader>
//                     </div>
//                 }
               
//                 { 
//                 this.state.openPopup && 
//                     <Popup title="New Role Group" togglePopup={this.togglePopup}>
//                     <NewRole
//                         formControl={this.state.formControl}
//                         changeHandler={this.changeHandler}
//                         togglePopup={this.togglePopup}
//                         submitData={this.fetchNewRoleGroup}
//                         submitLoader={this.state.submitLoader}
//                     />
//                     </Popup>
//                 }

//             <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
//             </main>
//         );
//     }
// }