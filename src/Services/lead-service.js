import utils from '../Services/utility-service';
const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;

async function getLead(body){
    const response =
      await fetch( serverOrigin+"/lead/get",
        { 
          method: 'post',
          headers: {'Content-Type':'application/json','Accept': 'application/json'},
          body: JSON.stringify(body)
        }
      )
    return response;
}

async function getLeadAssign(body){
  const response =
    await fetch( serverOrigin+"/lead/get/assigned",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function leadUpdateTask(body){
  const response = 
  await fetch(serverOrigin+"/lead/update/task/status",
    {
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body),
      method: 'post'
    }
  )
  return response;
}

async function getLeads(body){
  const response = 
  await fetch(serverOrigin+"/lead/get/detail",
    {
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body),
      method: 'post'
    }
  )
  return response;
}

async function getLeadFilter(body){
    const response =
      await fetch( serverOrigin+"/lead/get/filters",
        { 
          method: 'post',
          headers: {'Content-Type':'application/json','Accept': 'application/json'},
          body: JSON.stringify(body)
        }
      )
    return response;
}

async function downloadLeadData(body){
  let params = "";
  if(body){
    params = utils.jsonToQueryString(body);
  }
  const response = await fetch( serverOrigin+"/lead/export-leads"+params);
  return response;
}

async function getLeadSummary(body){
  const response =
    await fetch( serverOrigin+"/lead/get/stats",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function getLeadUpload(body){
  const response = 
     await fetch(serverOrigin+"/lead/upload/dispositions",
      {
        method: 'post',
        body: body
      }
    )
     return response;
}

async function getLeadStatus(body){
  const response =
    await fetch( serverOrigin+"/lead/get/all/status",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function getLeadBucketStatus(body){
  const response =
    await fetch( serverOrigin+"/lead/get/bucket/status/mapping",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function getCommentHistory(body){
  const response =
    await fetch( serverOrigin+"/lead/get/activity/history",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function saveDisposition(body){
  const response =
    await fetch( serverOrigin+"/lead/update",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function getLeadStatusClient(body){
  const response =
    await fetch( serverOrigin+"/lead/get/all/business/status",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return response;
}

async function getLeadBucket(body){
   const response =
     await fetch(serverOrigin+ "/lead/get/all/business/bucket",
     { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    }
  )
  return response;
}

async function submitLeadBucket(body){
  const response=
    await fetch(serverOrigin+'/lead/update/business/bucket',
    {
       headers: {'Content-Type':'application/json','Accept': 'application/json'},
       method:"post",
       body:JSON.stringify(body)
    });
    return response;
}

async function submitLeadStatus(body){
  const response = 
    await fetch(serverOrigin+"/lead/update/business/status",
    {
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method:"post",
      body:JSON.stringify(body)
    })
    return response;
}

async function getLeadFunnel(body){
  const response = 
    await fetch(serverOrigin+"/lead/get/all/funnel",
    {
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method:"post",
      body:JSON.stringify(body)
    })
    return response;
}

async function leadStatusFunnelBucketMapping(body){
  const response =
    await fetch(serverOrigin+"/lead/update/status",{   
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method:'post',
      body: JSON.stringify(body)
    })
  return response;
}

async function getPublisherClient(body){
  const response =
    await fetch( serverOrigin+"/business/get/all/clients",{
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method: "post",
      body: JSON.stringify(body)
    })
    return response;
}

async function getPublisherVendor(body){
  const response =
    await fetch( serverOrigin+"/business/get/vendors",{
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method: "post",
      body: JSON.stringify(body)
    })
    return response;
  }

async function getLeadCampaign(body){
  const response = 
     await fetch(serverOrigin + "/lead/get/campaigns",{
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
       method:"post",
       body: JSON.stringify(body)
     })
     return response;
}

async function getPublisherUpdate(body){
  const response = 
    await fetch(serverOrigin + "/lead/update/business/publisher",
    {
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method:"post",
      body:JSON.stringify(body)
    })
    return response;
}

async function getPublisherUpdateTable(body){
  const response = 
    await fetch(serverOrigin + "/lead/get/business/publisher",
    {
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      method:"post",
      body:JSON.stringify(body)
    })
    return response;
}

async function getLeadTypeUpdate(body){
  const response =
    await fetch(serverOrigin+"/lead/update/type/status/mapping",
    {
      method: "post",
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
}

async function getOwnerAssign(body){
  const response =
    await fetch(serverOrigin+"/lead/get/users/to/assign",
    {
      method: "post",
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
}

async function pushDetailsToOwner(body){
  const response =
    await fetch(serverOrigin+"/lead/assign/to/user",
    {
      method: "post",
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    })
    return response;
}

async function getUpdatedLeadTypeTable(body){
  const response = 
     await fetch(serverOrigin +"/lead/get/type/status/mapping",
     {
        method:"post",
        body: JSON.stringify(body),
        headers:{'Content-Type':'application/json','Accept': 'application/json'}
     })
     return response;
}
 
async function getLeadStatusGroup(body){
  const response =
      await fetch(serverOrigin + "/lead/get/statusGroup",
      // await fetch(serverOrigin +"/lead/get/all/business/status",
      {
       headers:{'Content-Type':'application/json','Accept': 'application/json'},
       method:'post',
       body: JSON.stringify(body)
     })
     return response;
} 

async function updateLeadStatusGroup(body){
  const response =
    await fetch(serverOrigin+"/lead/update/statusGroup",
    {
       headers:{'Content-Type':'application/json','Accept': 'application/json'},
       method:'post',
       body: JSON.stringify(body)
     })
     return response;
}

async function getupdateStatusGroupMapping(body){
  const response =
    await fetch(serverOrigin+"/lead/update/statusGroup/status/mapping",
    {
       headers:{'Content-Type':'application/json','Accept': 'application/json'},
       method:'post',
       body: JSON.stringify(body)
     })
     return response;
}

async function getUpdatedStatusGroupTable(body){
  const response =
    await fetch(serverOrigin+"/lead/get/all/status",{
      headers:{'Content-Type':'application/json','Accept': 'application/json'},
      method:'post',
      body: JSON.stringify(body)
    })
    return response;
  }

  async function makeCall(body){
    const response =
      await fetch(serverOrigin+"/hc/make/call",{
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }

  async function sendEmail(body){
    const response = 
      await fetch(serverOrigin+"/hc/send/email",{
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }

  async function sendMessage(body){
    const response =
      await fetch(serverOrigin+"/hc/send/sms",{
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }
  async function leadTaskHistory(body){
    const response =
      await fetch(serverOrigin+"/lead/get/task/status/change/history",{
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }

  async function smsJourney(body){
    const response = 
      await fetch(serverOrigin+"/journey/sms/campaign/create",{
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
      return response;
  }
  
   
   async function getTaskType(body){
    const response =
      await fetch(serverOrigin+"/task/get/types",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }
 
  async function smsDropdown(body){
    const response =
      await fetch(serverOrigin+"/sms/get/all",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }

  async function getAllEmail(body){
    const response =
      await fetch(serverOrigin+"/email/get/all",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }

  async function leadPushById(body){
    const response =
      await fetch(serverOrigin+"/lead/push/to/campaign",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }
  async function getCount(body){
    const response =
      await fetch(serverOrigin+"/lead/get/count",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }
  
  async function getScheduleTask(body){
    const response =
      await fetch(serverOrigin+"/lead/get/schedule/tasks",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }

  async function pushLeadsApi(body){
    const response =
      await fetch(serverOrigin+"/lead/push/to/campaign",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method:'post',
        body: JSON.stringify(body)
      })
    return response;
  }
  async function leadPushBySheet(body){
    const response =
      await fetch(serverOrigin+"/incoming-lead/receive/by/sheet",
      {
        method: 'post',
        body: body
      });
    return response;
  }  
  
  async function leadScheduleTask(body){
    const response =
      await fetch(serverOrigin+"/lead/get/all/schedule/tasks",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method: 'post',
        body: JSON.stringify(body)
      });
    return response;
  }
  async function addLead(body){
    const response =
      await fetch(serverOrigin+"/lead/add/lead",
      {
        headers:{'Content-Type':'application/json','Accept': 'application/json'},
        method: 'post',
        body: JSON.stringify(body)
      });
    return response;
  }  
export{addLead,getLeadBucketStatus,smsDropdown,smsJourney,getAllEmail,getTaskType,leadScheduleTask,getScheduleTask,leadTaskHistory,leadUpdateTask,getLeadAssign,pushDetailsToOwner,getOwnerAssign,getPublisherVendor,sendMessage,sendEmail,getLeads,makeCall,getUpdatedStatusGroupTable,getupdateStatusGroupMapping,getPublisherUpdateTable,updateLeadStatusGroup,getLeadStatusGroup,getUpdatedLeadTypeTable,getLeadTypeUpdate,getPublisherUpdate,getLeadCampaign,getPublisherClient,leadStatusFunnelBucketMapping,getLeadFunnel,submitLeadStatus,submitLeadBucket,getLeadBucket,getLeadStatusClient,getLead,getLeadFilter,downloadLeadData,getLeadSummary,getLeadUpload,getLeadStatus,getCommentHistory,saveDisposition,leadPushById,leadPushBySheet,getCount,pushLeadsApi};