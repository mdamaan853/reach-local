const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getCallDetail(body){
   const response =
  //  await fetch( serverOrigin+"/lead/get/campaigns",
     await fetch( serverOrigin+"/call/get/calling/details",
     { 
         method: 'post',
         headers: {'Content-Type':'application/json','Accept': 'application/json'},
         body: JSON.stringify(body)
       }
     )
   return await response; 
 }
export {getCallDetail}