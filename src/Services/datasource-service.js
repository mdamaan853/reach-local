
const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getDatasource(body){
  const response =
    await fetch( serverOrigin+"/audience/get/all/audienceGroup",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response; 
}
async function createEditDatasource(body){
  const response =
    await fetch( serverOrigin+"/audience/add/update/audienceGroup",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response; 
}
async function getDatasourceforMedium(body){
  const response =
    await fetch( serverOrigin+"/medium/get/mapped/audienceGroup",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response; 
}
async function getAudienceMediumMapping(body){
  const response =
    await fetch(serverOrigin+"/audience/get/audienceGroup/by/medium",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function addUpdateAudienceMediumMapping(body){
  const response =
    await fetch(serverOrigin+"/medium/add/update/audienceGroup/mapping",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function submitDatasources(body){
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
async function getDatasourceMapSegment(body){
  const response = 
    await fetch(serverOrigin+"/audience/get/audience/segment/mapping",
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    });
    return response;
}
async function getSelectSegment(body){
  const response = 
    await fetch(serverOrigin+"/segment/get/all",
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    });
      return await response;
}
async function addAudienceSegmentMapping(body){
  const response = 
    await fetch(serverOrigin+"/audience/add/update/audience/segment/mapping",
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    });
      return await response;
}
async function getclients(body){
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
async function getMappedclients(body){
  const response =
    await fetch(serverOrigin+"/audience/get/all/business/mapping",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function addUpdateClient(body){
  const response =
    await fetch(serverOrigin+"/audience/add/update/business/audienceGroup/mapping",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function getParentDetails(body){
  const response =
    await fetch(serverOrigin+"/audience/get/audienceGroup/parent/detail",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
export {getDatasource,submitDatasources,getDatasourceMapSegment,getSelectSegment,getAudienceMediumMapping,addUpdateAudienceMediumMapping,getDatasourceforMedium,createEditDatasource,getclients,getMappedclients,addUpdateClient,addAudienceSegmentMapping,getParentDetails};