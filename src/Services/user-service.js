const serverOrigin ='http://13.233.125.97:8080';
// const serverOrigin = window.location.origin;
async function getUserDetails(){
  const response =
    await fetch( serverOrigin+"/user/get/detail",
      { 
        headers: {'Content-Type': 'application/json','Accept': 'application/json'}
      }
    )
  return await response;
}
async function getBusinessUserDetails(id){
  const response =
    await fetch( serverOrigin+"/user/get/business/owner?businessUid="+id,
      { 
        headers: {'Content-Type': 'application/json','Accept': 'application/json'}
      }
    )
  return await response;
}
async function getBusinessDetails(){
  const response =
    await fetch( serverOrigin+"/business/get/profile/detail",
      { 
        headers: {'Content-Type': 'application/json','Accept': 'application/json'}
      }
    )
  return await response;
}
async function getClientBusinessDetails(id){
  const response =
    await fetch( serverOrigin+"/business/get/profile/detail?businessUid="+id,
      { 
        headers: {'Content-Type': 'application/json','Accept': 'application/json'}
      }
    )
  return await response;
}
async function addBusinessDetail(body){
  const response =
    await fetch(serverOrigin+"/business/add",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function addEmployee(body){
  const response =
    await fetch(serverOrigin+"/user/add/employee",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function editBusinessDetail(body){
  const response =
    await fetch(serverOrigin+"/business/edit",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function getPaymentDetails(body){
  const response =
    await fetch(serverOrigin+"/business/get/tax/registration/detail",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function updatePaymentDetails(body){
  const response =
    await fetch(serverOrigin+"/business/update/tax/registration/detail",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}  
async function userSignup(body){
  const response =
    await fetch(serverOrigin+"/user/signup",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function userUpdate(body){
  const response =
    await fetch(serverOrigin+"/user/update",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function login(body){
  const response =
    await fetch(serverOrigin+"/user/login",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function sendResetEmail(body){
  const response =
    await fetch(serverOrigin+'/send/reset-password/email',
    { 
      method: 'post',
      headers: {'Content-Type':'application/json','Accept': 'application/json'},
      body: JSON.stringify(body)
    }
  );  
return await response;
}
async function register(body){
  const response =
    await fetch(serverOrigin+"/user/signup",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function sendOTP(body){
  const response =
    await fetch(serverOrigin+"/resend/otp",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function leadSendOtp(body){
  const response =
    await fetch(serverOrigin+"/incoming-lead/send/otp?mobile="+body,
      { 
        headers: {'Accept': 'application/json'},
      }
    );  
  return await response;
}
async function leadSendOtpBetaCura(body){
  const response =
    await fetch(serverOrigin+"/incoming-lead/send/otp"+body,
      { 
        headers: {'Accept': 'application/json'},
      }
    );  
  return await response;
}
async function submitLeadData(body){
  const response =
    await fetch(serverOrigin+"/incoming-lead/receive"+body,
      { 
        headers: {'Accept': 'application/json'},
      }
    );  
  return await response;
}
async function getAllEmployees(){
  const response =
    await fetch(serverOrigin+"/user/get/employees",
      { 
        headers: {'Accept': 'application/json'},
      }
    );  
  return await response;
}
async function updateEmployee(body){
  const response =
    await fetch(serverOrigin+"/user/update/employee",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    );  
  return await response;
}
async function updateBPaidType(body){
  const response =
    await fetch(serverOrigin+"/business/update/paidType",
      {
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    ); 
  return await response;
}
async function changePassword(body){
  const response = 
  await fetch(serverOrigin+'/user/reset-password',
  {
    method: 'post',
    headers: {'Content-Type':'application/json','Accept': 'application/json'},
    body: JSON.stringify(body)
  });
  return await response;
}
export {addBusinessDetail,
        updatePaymentDetails,
        userSignup,
        userUpdate,
        login,
        getUserDetails,
        getBusinessUserDetails,
        getClientBusinessDetails,
        getBusinessDetails,
        editBusinessDetail,
        getPaymentDetails,
        register,
        sendResetEmail,
        leadSendOtp,
        leadSendOtpBetaCura,
        submitLeadData,
        addEmployee,
        getAllEmployees,
        updateEmployee,
        updateBPaidType,
        changePassword,
        sendOTP};