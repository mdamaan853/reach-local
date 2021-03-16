const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function submitCampaign(body){
    const response =
      await fetch( serverOrigin+"/campaign/create",
        { 
          method: 'post',
          headers: {'Content-Type':'application/json','Accept': 'application/json'},
          body: JSON.stringify(body)
        }
      )
    return await response;
  }


  async function getCampaign(body){
    const response = 
      await fetch(serverOrigin+"/segment/get/campaign/segments",
         {
           method:'post',
           headers: {'Content-Type':'application/json','Accept': 'application/json'},
           body: JSON.stringify(body)
         })
    return response;
  }
  
  async function getCampaignFilter(body){
    const response = 
      await fetch(serverOrigin+"/segment/get/campaign/segments",
      {
        method:'post',
        headers:{ "Accept": "application/json"},
        body: JSON.stringify(body)
      })
    return response;
  }

  async function fetchCampaign(body){
    const response =  await fetch(serverOrigin+"/campaign/get",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  
  async function getDetailCampaign(body){
    const response = await fetch(serverOrigin+"/campaign/get/detail",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function  editCampaign(body){
    const response = await fetch(serverOrigin+"/campaign/edit",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function  rejectCampaigns(body){
    const response = await fetch(serverOrigin+"/campaign/reject",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function  executeCampaigns(body){
    const response = await fetch(serverOrigin+"/campaign/mark/executed",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function approveCampaigns(body){
    const response = await fetch(serverOrigin+"/campaign/approve",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function updateStats(body){
    const response = await fetch(serverOrigin+"/campaign/update/stats",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function sendTestSmsApi(body){
    const response = await fetch(serverOrigin+"/hc/send/sms",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function sendTestSmsPro(body){
    const response = await fetch(serverOrigin+"/campaign/test/sms",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function getSmsPrice(body){
    const response = await fetch(serverOrigin+"/campaign/get/pricing",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function getCcId(body){
    const response = await fetch(serverOrigin+"/campaign/generate/custom/campaign/id",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  
  async function getJourney(body){
    const response = await fetch(serverOrigin+"/journey/get/all",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  async function getCredentials(body){
    const response = await fetch(serverOrigin+"/user/external/wapp/credentials",
    {
      method:'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
  }
  

  export{submitCampaign,getCredentials,getJourney,sendTestSmsPro,getCampaign,getCampaignFilter,fetchCampaign,getDetailCampaign,editCampaign,rejectCampaigns,executeCampaigns, approveCampaigns,updateStats,sendTestSmsApi,getSmsPrice,getCcId};
