const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function fetchRoles(panelName,bUid){
    let params = {
        "businessUid": bUid,
        "panel": panelName
      }
    const response =
        await fetch( serverOrigin+"/permission/get/allowed/subroles",
        { 
            method: 'post',
            headers: {'Content-Type':'application/json','Accept': 'application/json'},
            body: JSON.stringify(params)
        });
    return await response;
}

async function addNewRoleGroup(body){
    const response = await fetch(serverOrigin + "/permission/group/add",
        {
            method:"post",
            headers:{'Content-Type':'application/json','Accept': 'application/json'},
            body: JSON.stringify(body)
        }
    )
    return await response;   
}

async function getNewRoleGroupTable(body){
    const response = await fetch(serverOrigin + "/permission/get/group/names",
        {
            method:"post",
            headers:{'Content-Type':'application/json','Accept': 'application/json'},
            body: JSON.stringify(body)
        }
    )
    return await response;   
}

async function getNewRoleDropdown(body){
    const response = await fetch(serverOrigin + "/permission/get/all/roles",
        {
            method:"post",
            headers:{'Content-Type':'application/json','Accept': 'application/json'},
            body: JSON.stringify(body)
        }
    )
    return await response;   
}

async function addRoles(body){
    const response = await fetch(serverOrigin+"/permission/group/add/roles",
        {
            method:"post",
            headers:{'Content-Type':'application/json','Accept': 'application/json'},
            body: JSON.stringify(body)
        }
    )
    return await response;
}

async function assignRoleGroup(body){
    const response = await fetch(serverOrigin+"/permission/group/assign",
        {
            method:"post",
            headers:{'Content-Type':'application/json','Accept': 'application/json'},
            body: JSON.stringify(body)
        }
    )
    return await response;
}

export {addRoles,getNewRoleDropdown,getNewRoleGroupTable,fetchRoles,addNewRoleGroup,assignRoleGroup};