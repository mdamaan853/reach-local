const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getSenderIds(body){
  let url = "/sender/get/all";
  if(body){
    url+="?start="+body.start+"&maxResults="+body.maxResults;
  }
  const response =
    await fetch( serverOrigin+url,
      { 
        headers: {'Content-Type': 'application/json','Accept': 'application/json'}
      }
    )
  return await response; 
}
async function submitSenderIds(body){
  const response =
    await fetch(serverOrigin+"/sender/add",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
  
async function getAcceptStatus(body){
  const response =
    await fetch(serverOrigin+"/sender/approve/status",
    {
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)      
    });
    return response;
}

async function getRejectStatus(body){
  const response = await fetch(serverOrigin+"/sender/reject/status",
  {
     method:'post',
     headers: {'Content-Type':'application/json','Accept': 'application/json'},
     body: JSON.stringify(body)
  } 
    );
    return response;
}

async function getDeleteStatus(body){
  const response =
  await fetch(serverOrigin+"/sender/disable/status",
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    }
  );  
return await response;
}
export {getSenderIds,submitSenderIds,getAcceptStatus,getRejectStatus,getDeleteStatus};