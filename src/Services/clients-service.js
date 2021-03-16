const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getAllClients(body){
  const response =
    await fetch(serverOrigin+"/business/get/clients",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}

async function getAgency(body){
  const response =
    await fetch(serverOrigin+"/business/get/agencies",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function updateAgency(body){
  const response =
    await fetch(serverOrigin+"/business/update/agency",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function registerClient(body){
  const response =
    await fetch(serverOrigin+"/user/register/by/agency",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function fetchClientByEmail(body){
  const response =
    await fetch(serverOrigin+"/business/get/by/email",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function businessAssign(body){
  const response =
    await fetch(serverOrigin+"/business/assign/to/agency",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function fetchJUrl(body){
  const response =
    await fetch(serverOrigin+"/business/get/agency/client/singup/url",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function sendJUrl(body){
  const response =
    await fetch(serverOrigin+"/business/send/singup/url",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
export {getAllClients,getAgency,updateAgency,registerClient,fetchClientByEmail,businessAssign,fetchJUrl,sendJUrl};