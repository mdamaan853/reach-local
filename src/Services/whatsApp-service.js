const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function whatsAppMobile(body){
    const response = await fetch(serverOrigin+'/user/agency/wapp/mobile',
    {
       method:'post',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body: JSON.stringify(body)
    })
    return response;
}

export {whatsAppMobile};