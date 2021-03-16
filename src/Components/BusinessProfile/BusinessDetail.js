import React from 'react';

function BusinessProfileDetail (props){
    return(
         <form action="/action_page.php">

         
               <fieldset>                
                  <legend>Professional Details:</legend>
                      <div className="row-profile">
                         <span className="col-25-profile">
                               <label htmlFor="comp-name">Company Name  &#9733;:</label>
                         </span>
                         <span className="col-75-profile">
                               <input type="text" id="comp-name" name="comp-name" placeholder="Company Name.."/><br/>
                         </span>
                      </div>
                   
                      <div className="row-profile">
                         <span className="col-25-profile">
                               <label htmlFor="website">Website  &#9733;:</label>
                         </span>
                         <span className="col-75-profile">
                               <input type="url" id="website" name="website" placeholder="Enter your url.."/><br/>
                         </span>
                      </div>                              
               </fieldset>
               <fieldset>
                   <legend>Correspondence Details:</legend>
                      <div className="row-profile">
                         <span className="col-50-profile">
                            <span className="col-25-profile">
                               <label htmlFor="address">Address &#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                               <input type="text" id="address" name="address" placeholder="House/Street/Gali No.."/><br/>
                            </span>
                         </span> 
                         <span className="col-50-profile">  
                            <span className="col-25-profile">
                               <label htmlFor="city">City/Town  &#9733;:</label>
                            </span>
                            <span className="col-75-profile">  
                               <input type="text" id="city" name="city" placeholder="City/Town"/><br/>
                            </span>
                         </span> 
                      </div>
                                     
                      <div className="row-profile">
                         <span className="col-50-profile">
                            <span className="col-25-profile">
                               <label htmlFor="state">State  &#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                               <input type="text" id="state" name="state" /><br/>
                            </span>
                         </span>
                         <span className="col-50-profile">
                            <span className="col-25-profile">
                               <label htmlFor="country">Country&#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                               <input type="text" id="country" name="country" placeholder="Country.."/><br/>
                            </span>
                         </span>
                         
                      </div>
                    
                      <div className="row-profile">
                         <span className="col-25-profile">
                            <label htmlFor="pin">PIN&#9733;:</label>
                         </span>
                         <span className="col-75-profile">
                            <input type="number" id="pin" name="pin" placeholder="six digit pin"/><br/>
                         </span>
                         <span className="col-50-profile">
 
                      </span>
                      </div>
                </fieldset> 
         </form>
    );
}

export default BusinessProfileDetail;