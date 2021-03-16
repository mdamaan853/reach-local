const serverOrigin = "http://13.233.125.97:8080";
// const serverOrigin = window.location.origin;
async function getTags(body) {
  const response = await fetch(serverOrigin + "/tag/search", {
    method: "post",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  return await response;
}
async function postTags(body){
  const response =
    await fetch( serverOrigin+"/tag/create",
      { 
        method: 'post',
        headers: {'Content-Type':'application/json','Accept': 'application/json'},
        body: JSON.stringify(body)
      }
    )
    
  return await response; 
}
export { getTags,postTags };
