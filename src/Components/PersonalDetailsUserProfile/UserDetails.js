import React from 'react';

function UserProfile(props){
   return(
        <fieldset>
                <legend>Personal Details:</legend>
                   <div className="row-profile">
                      <span className="col-50-profile">
                            <span className="col-25-profile">
                                  <label htmlFor="fname">First Name&#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                                  <input type="text" id="fname" name="firstname" placeholder="Your first name.."/><br/>
                            </span> 
                         {/* <span className="col-25-profile">
                                  Title:
                         </span>
                         <span className="col-75-profile">
                               <input type="radio" id="mr" name="mr" value="mr"/><label for="mr"> Mr.</label>
                               <input type="radio" id="mrs" name="mr" value="mrs"/><label for="mrs">Mrs.</label>
                               <input type="radio" id="miss" name="mr" value="miss"/><label for="miss"> Miss</label><br/>  
                         </span> */}
                         </span>
                         <span className="col-50-profile">
                              <span className="col-25-profile">
                                    <label htmlFor="mname">Middle Name:</label>
                              </span>
                              <span className="col-75-profile">
                                    <input type="text" id="mname" name="middlename" /><br/>
                              </span>
                         </span>
                         

                      <span className="col-50-profile">
                         <span className="col-25-profile">
                               <label htmlFor="lname">Last Name &#9733;:</label>
                         </span> 
                         <span className="col-75-profile">
                               <input type="text" id="lname" name="lastname" placeholder="Your last name.."/><br/>
                         </span>                         
                      </span>                          
                   </div>
                  
                   
                  
                   <div className="row-profile">
                      <span className="col-50-profile">
                         <span className="col-25-profile">
                               Gender:
                         </span>
                         <span className="col-75-profile">
                               <input type="radio" id="male" name="mr" value="male"/><label htmlFor="male"> Male</label>
                               <input type="radio" id="female" name="mr" value="female"/><label htmlFor="female">Female</label>
                               <input type="radio" id="other" name="mr" value="other"/><label htmlFor="other">Other</label> <br/>
                         </span>                          
                      </span>
                      <span className="col-50-profile">
                      </span>              
                   </div>                                  
             </fieldset>
   );
}

export default  UserProfile;