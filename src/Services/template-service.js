const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getTemplates(body){
  const response =
    await fetch( serverOrigin+"/sms/get/all",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response; 
}
async function addUpdateTemplate(body){
  const response =
    await fetch(serverOrigin+"/sms/add-update",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}

async function getAllSMSTxns(body){
  const response = await fetch(serverOrigin+"/sms/txn/get/history",
  {
    method:'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  })
  return response;
}

async function getAllSMSCampaignSmry(body){
  const response = await fetch(serverOrigin+"/sms/txn/get/campaign/wise/summary/report",
  {
    method:'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  })
  return response;
}

async function getAllSMSDailySmry(body){
  const response = await fetch(serverOrigin+"/sms/txn/get/daily/summary/report",
  {
    method:'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  })
  return response;
}

async function downloadAllTransaction(body){
  const response = await fetch(serverOrigin+"/sms/txn/export/history",
  {
    method:'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  })
  return response;
}

async function downloadAllCampgnWiseSmry(body){
  const response = await fetch(serverOrigin+"/sms/txn/export/campaign/wise/summary/report",
  {
    method:'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  })
  return response;
}

async function downloadAllDailySmryReport(body){
  const response = await fetch(serverOrigin+"/sms/txn/export/daily/summary/report",
  {
    method:'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  })
  return response;
}

export {getTemplates,downloadAllDailySmryReport,downloadAllCampgnWiseSmry,downloadAllTransaction,addUpdateTemplate,getAllSMSTxns,getAllSMSCampaignSmry,getAllSMSDailySmry};