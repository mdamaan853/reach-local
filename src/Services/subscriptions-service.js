const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getAllServicePackages(body){
    const response = await fetch(serverOrigin+'/service/package/get/all',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

async function getAllServices(body){
    const response = await fetch(serverOrigin+'/service/get/all',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

async function assignService(body){
    const response = await fetch(serverOrigin+'/service/assign',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

async function submitPackage(body){
    const response = await fetch(serverOrigin+'/service/package/subscribe',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

async function editPackage(body){
    const response = await fetch(serverOrigin+'/service/package/edit',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}


async function pkgAssign(body){
    const response = await fetch(serverOrigin+'/service/package/assign',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

async function requestPackage(body){
    const response = await fetch(serverOrigin+'/service/package/request',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

async function subscriptionApprovalList(body){
    const response = await fetch(serverOrigin+'/subscription/get/approval/pending',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }

 async function subscriptionGetAll(body){
    const response = await fetch(serverOrigin+'/subscription/get/all',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }

 async function unPaidSubs(body){
    const response = await fetch(serverOrigin+'/subscription/get/payment/pending',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }

 async function makePayment(body){
    const response = await fetch(serverOrigin+'/subscription/make/payment',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }
 async function cancelSubs(body){
    const response = await fetch(serverOrigin+'/subscription/cancel',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }
 
 async function rejectSubs(body){
    const response = await fetch(serverOrigin+'/subscription/reject',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }

 async function approveSubs(body){
    const response = await fetch(serverOrigin+'/subscription/approve',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }
 async function fetchTxnHistory(params){
    let url = "/txn/get/history"+params;
    const response =
        await fetch( serverOrigin+url,
        { 
            headers: {'Content-Type': 'application/json','Accept': 'application/json'}
        }
        )
    return await response; 
}
// async function updateManualTxn(params){
//     let url = "/payment/manual/add"+params;
//     const response =
//         await fetch( serverOrigin+url,
//         { 
//             headers: {'Content-Type': 'application/json','Accept': 'application/json'}
//         }
//         )
//     return await response; 
// }
async function updateManualTxn(body){
    const response = await fetch(serverOrigin+'/payment/manual/add',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }
 async function getUpdatedWallet(body){
    const response = await fetch(serverOrigin+'/business/wallet',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }
 async function createPackage(body){
    const response = await fetch(serverOrigin+'/service/package/create',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }

 async function getPackage(body){
    const response = await fetch(serverOrigin+'/service/package/get/detail',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }

 async function getMinPrice(body){
    const response = await fetch(serverOrigin+'/service/get/pricing/detail',
    {
        method:'post',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(body)
     })
     return response;
 }
 
export {approveSubs,pkgAssign,getPackage,getMinPrice,createPackage,editPackage,assignService,getAllServices,cancelSubs,rejectSubs,getAllServicePackages,submitPackage,subscriptionApprovalList,requestPackage,subscriptionGetAll,unPaidSubs,makePayment,fetchTxnHistory,updateManualTxn,getUpdatedWallet};