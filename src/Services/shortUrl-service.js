const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function createShortUrl(body){
  const response =
    await fetch(serverOrigin+"/shorturl/getShortUrl",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}

async function getShortUrl(body){
  const response =
    await fetch( serverOrigin+"/shorturl/get/details",
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    }
)
return await response; 
}

async function getTransactions(body){
  const response =
    await fetch( serverOrigin+"/txn/get/history",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response;
}

async function getRevenueSummary(body){
  const response =
    await fetch( serverOrigin+"/txn/get/revenue/summary",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response;
}

async function getRevenue(body){
  const response =
    await fetch( serverOrigin+"/txn/get/revenues",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
  return await response;
}
  

export {createShortUrl,getShortUrl,getTransactions,getRevenueSummary,getRevenue};