const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getAllLandingPages(body){
  const response =
    await fetch( serverOrigin+"/landing-page/get/all",
    { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response; 
}
async function addLandingPages(body){
  const response =
    await fetch(serverOrigin+"/landing-page/add/update",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
  

export {getAllLandingPages,addLandingPages};