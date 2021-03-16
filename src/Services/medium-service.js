const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getMediums(body){
    const response = await fetch(serverOrigin+"/medium/get/all",
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    }
  )
  return response;
}
async function submitMediums(body){
  const response =
    await fetch(serverOrigin+"/medium/add/update",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
 
export {getMediums,submitMediums};