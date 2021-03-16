import React from 'react';




function TaxRegistrationDetail(props) {
    return(
                <fieldset>
                   <legend>Payment Details:</legend>
                      <div className="row-profile">
                         <span className="col-50-profile">
                            <span className="col-25-profile">
                               <label htmlFor="reg">GST registration type&#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                               <input type="text" id="reg" name="reg" /><br/>
                            </span>
                         </span>
                         <span className="col-50-profile">
                            <span className="col-25-profile">
                               <label htmlFor="gst-no.">GST No  &#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                               <input type="text" id="gst-no." name="gst-no." /><br/>
                            </span>
                         </span>                       
                      </div>
                                
                      <div className="row-profile">
                         <span className="col-50-profile">
                            <span className="col-25-profile">
                               <label htmlFor="pan-no.">PAN No &#9733;:</label>
                            </span>
                            <span className="col-75-profile">
                               <input type="text" id="pan-no." name="pan-no." /><br/>
                            </span>
                         </span>
                      <span className="col-50-profile">
                         <span className="col-25-profile">
                            <label htmlFor="tax-reg">Tax Registration&#9733;:</label>
                         </span>
                         <span className="col-75-profile">    
                            <input type="text" id="tax-reg" name="tax-reg" /><br/>
                         </span>
                      </span>                      
                      </div>                
                </fieldset>  
 
    );
}
 export default TaxRegistrationDetail;         
  