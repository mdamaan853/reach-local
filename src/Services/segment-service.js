const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function createEditSegment(body){
  const response =
    await fetch(serverOrigin+"/segment/add/update/segment",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function getSegmentDetail(body){
  const response =
    await fetch(serverOrigin+"/segment/get/detail",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function getAllSegmentGroups(body){
  const response =
    await fetch(serverOrigin+"/segment/get/all/segment/groups",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function searchSegments(body){
  const response =
    await fetch(serverOrigin+"/journey/segment/search",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function addUpdateSegmentGroups(body){
  const response =
    await fetch(serverOrigin+"/segment/add/update/segment/group",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function assignSegmentGroups(body){
  const response =
    await fetch(serverOrigin+"/segment/assign/segment/group",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function editSegmentGroupDetail(body){
  const response =
    await fetch(serverOrigin+"/segment/update/segment/group",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function mapNewSegment(body){
  const response =
    await fetch(serverOrigin+"/segment/add/update/segment/segmentGroup/mapping",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function getSegmentGMappingDetails(body){
  const response =
    await fetch(serverOrigin+"/segment/get/segment/segmentGroup/mapping/detail",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
export {createEditSegment,getSegmentDetail,getAllSegmentGroups,addUpdateSegmentGroups,editSegmentGroupDetail,mapNewSegment,getSegmentGMappingDetails,assignSegmentGroups,searchSegments};