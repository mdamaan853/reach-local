var utils = {
    isMobile: false,
    userInfo:null,
    tempCache:{},
    isAdmin:false,
    isSuAdmin:false,
    roles:[],
    campns:[],
    publIds:[],
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    },
    jsonToQueryString(json) { 
        return '' + Object.keys(json).map(function (key) { 
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]); 
        }).join('&'); 
    },
    setGlobalRoles(roles){
        if(roles && roles.length>0){
            roles.forEach(e=>{
                if(e === 'su_admin' || e === 'admin'){
                    this.isAdmin = true;
                }
                if(e === 'su_admin'){
                    this.isSuAdmin = true;
                }
            });
        }
    },
    hasRole(role){

        if(this.isAdmin){
            return true;
        }
        
        if(this.roles && this.roles.length>0){
 
            var has = false;
            this.roles.forEach(e=>{
                if(e === role){
                    has = true;
                }
            });

            return has;
        }
        return false;
    },
    
    debounce(callback,timeout){
        let timer;
        return ()=>{
            let context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(()=>{
                callback.apply(context,args);
            },timeout);    
        }
    },
    getQueryParams(){
        let str = window.location.search;
        if(str){
            try{
                str = str.split('?')[1];
                let obj = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                return obj;
            }catch(err){
                console.log(err);
                return {};
            }
        }else{
            return {};
        }
    }
}
export default utils;