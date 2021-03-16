const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getDatasources(){
  const response =
    await fetch( serverOrigin+"/datasource/get/all",
      { 
        headers: {'Content-Type': 'application/json'}
      }
    )
  return await response;
}

async function fileUpload(body){
  const response =
    await fetch( serverOrigin+"/audience/upload",
      { 
        method: 'post',
        body: body
      }
    )
  return await response;
}

async function imageUpload(body){
  const response =
    await fetch( serverOrigin+"/upload/image",
      { 
        method: 'post',
        body: body
      }
    )
  return await response;
}

async function videoUpload(body){
  const response =
  await fetch( serverOrigin+"/upload/file",
  { 
    method: 'post',
    body: body
  }
)
return await response;
}
async function getAudienceGroup(body){
  const response =
    await fetch( serverOrigin+"/audience/get/audienceGroup",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response;
}

async function getAudienceData(body){
  const response =
    await fetch(serverOrigin+"/audience/get/audience",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}

export {getDatasources,fileUpload,videoUpload,imageUpload,getAudienceGroup,getAudienceData};