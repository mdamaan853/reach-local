import React from 'react';

export function UserAccountDetail (props){
    return(
        <fieldset>
            <legend>Personal Details:</legend>
                <div className="row-profile">
                      <span className="col-50-profile">
                         <span className="col-25-profile">
                               <label htmlFor="email">Email &#9733;:</label>
                         </span>
                         <span className="col-75-profile">
                               <input 
                                 type="text" 
                                 id="email" 
                                 name="email" 
                                 placeholder="yourmail@email.co.in"                               
                                 /><br/> 
                         </span>
                         <span className="col-25-profile">
                               <label htmlFor="password">Password*:</label>
                         </span>
                         <span className="col-75-profile">
                               <input 
                                 type="password" 
                                 id="password"  
                                 placeholder="Enter your password"                               
                                 /><br/> 
                         </span>
                         
                         </span>
                      <span className="col-50-profile">
                         <span className="col-25-profile">
                               <label htmlFor="mobile">Mobile No.*:</label>
                         </span>
                         <span className="col-75-profile">
                               <input type="number" id="mobile" name="mobile" placeholder="mobile number.."/><br/>
                         </span>
                      </span>                         
                   </div>
        </fieldset>                    
    );
}