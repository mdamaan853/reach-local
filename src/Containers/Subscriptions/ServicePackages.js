import React from 'react';
import utils from '../../Services/utility-service';
import PageTitle from '../../Components/Helmet';
import {getAllServicePackages,getAllServices,createPackage} from '../../Services/subscriptions-service';
import { ToastsStore,ToastsContainerPosition, ToastsContainer } from 'react-toasts';
import PackageDetail from '../../Components/ServicePackage/PackageDetail';
import {editPackage,getMinPrice,getPackage} from '../../Services/subscriptions-service';
import EditPackage from '../../Components/ServicePackage/EditPackage';
import CreatePackage from '../../Components/ServicePackage/CreatePackage';
import Packages from '../../Components/ServicePackage/Packages';

export default class ServicePackages extends React.Component{

    constructor(props){
        super(props);
        this.state={
            servicePackages:[],
            services:[],
            createServices:[],
            completePackage:[],
            createPackage:[],
            package: [],
            showAddedService: false,
            openDetails:false,
            openEditDetails: false,
            openCreate:false,
            selectedPackage:null,
            userType:null,           
            success: false
        } 
        this.verifyPakg = this.verifyPakg.bind(this);  
        this.packegService = this.packegService.bind(this);   
    }

    componentDidMount(){
        this.getAllServicePackages();
    }

    getAllServicePackages(){
        let body={}
        if(!!window.location.search){
            let str=window.location.search;
            let ind = str.search("=");
            let result = str.slice(ind+1);
            body.serviceType = result;
        }
        getAllServicePackages(body)
        .then( response => response.json())
        .then( data=>{
            if(data.success){
                this.setState({
                    servicePackages: data.servicePackages
                })
                // ToastsStore.success(data.message);
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(error =>{
            console.log(error);
            ToastsStore.error("Something Went Wrong, Please Try Again Later.!!!");
        })     
    }

    backToListing(){
        this.setState({
            info: null,
            openDetails: false,
            openEditDetails: false
        })
    }

    setIndex(index){
        this.setState({
            selectedPackage: this.getEditable(this.state.servicePackages[index]),
            openDetails: true
        });
    }

    getEditable(data){
        data.services.forEach(e => {
            e['val'] = e.minCredit ? e.minCredit : 0;
            e['isMin'] = false;
            e['error'] = null;
            e['perUnitMinPrice']=this.getPriceDetail(e.code);
            if(!e.pricePerUnit){
                e.pricePerUnit = 0;
            }
        });
        return data;
    }
/*####### Edit Package#####*/
    editPakage(index,code){
        this.fetchPackage(code);
        // this.setState({
        //    // selectedPackage:this.getEditable(this.state.servicePackages[index]),
        //     openEditDetails: true
        // });
       // console.log(this.state.selectedPackage);
    }

    fetchPackage(code){
        let body={
            servicePackageCode: code
        }
        getPackage(body)
        .then( response => response.json())
        .then( data=>{
            if(data.success){ 
                this.setState({
                    package:data.servicePackageDTO,
                    openEditDetails: true
                })              
            }  
        })
        .catch(error =>{
            console.log(error);
        })
    }
    
    getPriceDetail(code){

        let body={
            serviceCode: code
        }
        getMinPrice(body)
        .then( response => response.json())
        .then( data=>{
            if(data.success){ 
                // this.setState({
                //     minPrice:data.serviceDTO.perUnitMinPrice   
                // })              
                // console.log(this.state.minPrice); 
            }  
        })
        .catch(error =>{
            console.log(error);
        })
        // return this.state.minPrice;     
    }

    checkForMinValue(p){
        let isValid = true;
       // let temp = this.state.selectedPackage;
        let temp = this.state.package;
        temp.services.forEach(e => {
            if(isValid === false){
                return; // return from forEach loop if earlier index have error
            }else{
                if(e.val < e.minCredit){
                    e.isMin = true;
                    e.error = `Entered Quantity/Price < ${e.minCredit+" "}(Min Credit)`;
                    isValid = false;
                    this.setState({
                        package: temp,
                    })
                    return;
                }          
                else{
                    e.isMin = false;
                    e.error = null;
                    isValid = true;
                }
                if(e.pricePerUnit < e.perUnitMinPrice){
                    e.error = `Entered per unit price must be greate than  ${e.perUnitMinPrice+" "}(per unit minimum price)`;         
                    isValid = false;
                    this.setState({
                        package: temp,
                    })
                    return;
                }
                else{
                    e.error = null;
                    isValid = true;
                }
            }
            
        });
        
        if(p === "edit"){
            this.setState({
                package: temp,
            })

        }
        else{
            this.setState({
                info: temp,
            })
        }
         
        if(isValid){
            this.verifyPakg();
        }  
    }

    verifyPakg(){
       // let temp = this.state.selectedPackage;
       let temp = this.state.package;
        if(!temp.name){
            alert("Package Name is Mandatory.!!!");
            // ToastsStore.Error("Package Name is Mandatory.!!!");
            return;
        }
        else{
            this.editPkg();
        }
    }

    backToHome(){
        this.setState({
            openDetails: false,
            openEditDetails: false,
            openCreate:false,
        })
    }

    packegService(ser){
        let arr =[];
        ser && ser.forEach((s) =>{
            let obj=
                {
                    "code": s.code,
                    "creditUnitType": s.creditUnitType,
                    "minCredit": s.minCredit,
                    "pricePerUnit": (s.pricePerUnit || s.perUnitPrice),
                    "totalPriceOrUnits": null
                }
            arr.push(obj);
        })

        return arr;
    }

    editPkg(){
      let temp = this.state.package;
        const body=
            {
                "bUid": null,
                "code": temp.code,
                "desc": temp.desc ? temp.desc : null,
                "discount": temp.discount ? temp.discount : null,
                "discountType": temp.discountType ? temp.discountType : null,
                "name": temp.name,
                "price": temp.price ? temp.price : null,
                "services": this.packegService(this.state.package.services),
                //"services": this.packegService(this.state.selectedPackage.services),        
            }        
        editPackage(body)
        .then(r => r.json())
        .then(data =>{
            if(data.success){
                this.setState({
                   // editServices:data.services,
                    openDetails: false,
                    openEditDetails: false
                })
                ToastsStore.success("Packeage is edited successfully"); 
            }         
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e =>{
            console.log(e);
            ToastsStore.error("Something Went Wrong. Please try Again Later.!!!")
        })
    }

    handleChange = (event,index) => {
        
       // let temp = this.state.selectedPackage;
       let temp = this.state.package;
        const val = event.target.value;
        const n = event.target.name;
        temp.services[index][n] = val;       
        this.setState({
            //selectedPackage: temp
            package: temp
        })

    }

    packgChange(event){
       // let temp = this.state.selectedPackage;
       let temp = this.state.package;
        const val = event.target.value;
        const n = event.target.name;
        temp[n]=val;
        this.setState({
            package: temp
            //selectedPackage: temp
        })
    }
   
    /*#########Create Package##########*/
    createPkg(){
        this.fetchAllServices();
        this.setState({
            openCreate: true,
            createPackage:[],
            createServices:[],
            completePackage:[]
        });
    }

    handleChangeCreate(event){
        let name= event.target.name;
        let value = event.target.value;
        let temp = this.state.createPackage;
        temp[name] = value;

        this.setState({
            createPackage: temp
        })

    }

    serviceHandler(event){
        let id = event.target.value;
        const ser = this.state.services;
        let s = ser.filter(service =>{
            return service.code === id;
        })
        this.setState({
            createServices:s[0]
        })
    }

    handleChangeServices(event){
        let name= event.target.name;
        let value = event.target.value;
        let temp = this.state.createServices;
        temp[name] = value;
        this.setState({
            createServices: temp
        })
    }

    changeSrvcArr(event,index){
        let name= event.target.name;
        let value = event.target.value;
        let temp = [...this.state.completePackage];   
        temp[index][name] = value
        this.setState({
           completePackage:temp    
        })
    }

    verifyPkg(){
        let pkg = this.state.createPackage;
        if(!pkg.name){
            pkg.error = "Package Name is mandatory.!!!";
            alert("Package Name is mandatory.!!!");
            this.setState({
                createPackage: pkg
            })
            return;
        }
        else if(this.state.completePackage.length === 0){
            pkg.error ="Please Create Services.!!!";
            this.setState({
                createPackage: pkg
            })
            return;
        }
        else{
            this.finalVerification();
        }
    }

    createNewPackage(){
        let pkg = this.state.createPackage;
        let body=
            {
                "desc": pkg.desc,
                "discount": pkg.discount,
                "discountType": pkg.discountType,
                "name": pkg.name,
                "price": 0,
                "services": this.packegService(this.state.completePackage),
                 
            }
        
        createPackage(body)
        .then(r => r.json())
        .then(data =>{
            if(data.success){
                ToastsStore.success("Package Created.");
                this.getAllServicePackages();
                this.backToHome();
            }
            else{
                ToastsStore.error(data.message);
            }
        })
        .catch(e => {
            console.log(e);
        })
    }

    finalVerification(){
        let srvcArr = this.state.completePackage;
        let e = false;

        srvcArr && srvcArr.forEach((srvc)=>{
            if(e === true){
                return;
            }
            else{
                if(!srvc.perUnitPrice){
                    srvc.error = "Please Enter Price.!!!";
                    e= true;
                    return;
                }
                else if(srvc.perUnitPrice < srvc.perUnitMinPrice){
                    srvc.error = `Per unit price must be greater than ${srvc.perUnitMinPrice}.!!!`;
                    e= true;
                    return;
                }
                else{
                    srvc.error = null;
                    e= false;
                }
                
                if((!srvc.minCredit) || srvc.minCredit === undefined){
                    srvc.error = "Minimum Credit/Quantity is Mandatory.!!!";
                    e= true;
                    return;
                }
                else{
                    srvc.error = null;
                    e=false
                }
                if((srvc.val === undefined) || (srvc.val===null)){
                    srvc.error = null;
                    e=false;
                }
                else{
                    if(srvc.val < srvc.minCredit){
                        srvc.error = `Entered Quantity/Price must be greater than ${srvc.minCredit} (Minimum Credit).!!!`;
                        e=true;
                        return;
                    }
                    else{
                        srvc.error = null;
                        e=false;
                    }
                }
            }

        }) 
        this.setState({
            completePackage: srvcArr
        })
        if(e === false){
            this.createNewPackage();
        }
    }

    verifyServices(){
        let srvc = this.state.createServices;
        if(!srvc || (srvc.length === 0)){
            srvc.error = "Please Create Service.!!!"; 
            this.setState({
                createServices: srvc
            })
            return;   
        }
        else if(srvc.length > 0){
            srvc.error = null;
            this.setState({
                createServices: srvc
            }) 
        }       
        if(!srvc.perUnitPrice){
            srvc.error = "Please Enter Price.!!!";
            this.setState({
                createServices: srvc
            }) 
            return;
        }
        else if(srvc.perUnitPrice < srvc.perUnitMinPrice){
            srvc.error = `Per unit price must be greater than ${srvc.perUnitMinPrice}.!!!`;
            this.setState({
                createServices: srvc
            }) 
            return;
        }
        else{
            srvc.error = null;
        }
        this.setState({
            createServices: srvc
        })
        if (this.state.createServices.error === null){
            this.addServices();
        }  
    }

    addServices(){

        let srvc = this.state.createServices; 
        let arr =this.state.completePackage;
        arr.push(srvc);

        this.setState({
            completePackage: arr,
            showAddedService: true
        })
        
    }

    formatServices(data){

        if(data){
            data.forEach((ser)=>{
                ser.minCredit =null;
            })
        }

        return data;
    }

    fetchAllServices(){
        const body={} 
        // if(bsnessUid){
        //     body.businessUid = bsnessUid;
        // }   
        getAllServices(body)
        .then(r => r.json())
        .then(data => {
            if(data.success){
                this.setState({
                    services:this.formatServices(data.services)
                })
                // ToastsStore.success(data.message);
            } 
        })
        .catch(e =>{
            console.log(e);
            ToastsStore.error("Something went wrong. Please try again later.!!!");
        })
    }
    
    render(){
        return(
            <main className="wrapper-container">
                <PageTitle title="Packages" description="Welcome to Packages"/>
                {
                    !this.state.openDetails && !this.state.openEditDetails && !this.state.openCreate && 
                    <React.Fragment>
                        {
                            this.props.showHeading === "true" ? 
                            (<section className="card-custom pad--half flex align-space-between">
                                <h4 className="ui header">Packages</h4>
                                {
                                    (utils.isSuAdmin || (this.props.userType && this.props.userType ==="AGENCY")) &&
                                    <button className="btn btn-success btn-fill" onClick={this.createPkg.bind(this)}>Create Package</button>
                                }
                            </section>) : null
                        }
                       
                        <Packages 
                            servicePackages = {this.state.servicePackages}
                            userType={this.props.userType}
                            setIndex={this.setIndex.bind(this)}
                            editPakage={this.editPakage.bind(this)}
                        />  
                    </React.Fragment>
                }
                {
                    this.state.openEditDetails && ! this.state.openDetails && !this.state.openCreate && 
                    <EditPackage
                        backToHome={this.backToHome.bind(this)}
                        pkg={this.state.package} 
                        packgChange = {this.packgChange.bind(this)}
                        editPkg = {this.checkForMinValue.bind(this)}
                        handleChange={this.handleChange.bind(this)}/>
                }
                {
                    this.state.openDetails && !this.state.openEditDetails && !this.state.openCreate && 
                    <PackageDetail
                        info={this.state.selectedPackage}                                                     
                        userType={this.state.userType}
                        back={this.backToListing.bind(this)}
                    />
                }
                {
                    !this.state.openDetails && !this.state.openEditDetails && this.state.openCreate &&
                    <CreatePackage 
                        backToHome={this.backToHome.bind(this)}
                        srvc={this.state.createServices} 
                        pkg={this.state.createPackage}
                        srvcArr={this.state.completePackage}
                        verifyServices={this.verifyServices.bind(this)}
                        show={this.state.showAddedService}
                        //setIndex = {this.setIndexCreate.bind(this)}
                        serviceHandler = {this.serviceHandler.bind(this)}
                        packgChange = {this.handleChangeCreate.bind(this)}
                        handleChange={this.handleChangeServices.bind(this)}
                        changeSrvcArr = {this.changeSrvcArr.bind(this)}
                        services={this.state.services}
                       // clearServices={this.clearCreateServices.bind(this)}
                        create={this.verifyPkg.bind(this)}/>
                }
                {/* {
                    this.state.success && !this.state.openDetails && !this.state.openEditDetails && !this.state.openCreate &&
                    
                    <div className="login-wrapper flex flex-direction--col pad" style={{marginTop:`${this.props.marginTop}`}}>
                        {/* <a href="/" className="flex" style={{maxHeight:'90px',overflow:'hidden'}}>
                            <img src={logo} alt='logo' style={{width: '100%',height: '48px','objectFit': 'cover'}} />
                        </a> */}
                       {  /* <p style={{textAlign:'justify',fontSize:'1.3em',lineHeight:'1.3em',margin:'1.5em 0 2em'}}>Package Created Successfully</p>
                        <button  className="ui fluid positive primary button">Go To Packages and Services</button>
                        <button  className="ui fluid positive primary button">Purchase New Package</button>
                    </div>
                    
                } */}
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} lightBackground store={ToastsStore}/>
            </main>
        );
    }
}