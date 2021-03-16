// import React from "react";
// import { Link } from "react-router-dom";
// // image
// import img1 from "./img/img1.svg";
// import img2 from "./img/img2.svg";
// import img3 from "./img/img3.svg";

// function SelectAutomationType(props){
//   console.log(props)
//   const {FormData,setFormData}=props
//   return (
//     <div>
//       <button
//         type="button"
//         className="btn btn-fill btn-success margin-left--auto mx-2"
//         data-toggle="modal"
//         data-target="#exampleModalCenter"
//       >
//         create Automation Campaign
//       </button>

//       <div
//         className="modal fade  bd-example-modal-lg"
//         id="exampleModalCenter"
//         tabindex="-1"
//         role="dialog"
//         aria-labelledby="exampleModalCenterTitle"
//         aria-hidden="true"
//       >
//         <div
//           className="modal-dialog modal-dialog-centered modal-lg"
//           role="document"
//         >
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLongTitle">
//                 Select Automation Campaign Type
//               </h5>
//               <button
//                 type="button"
//                 className="close"
//                 data-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">&times;</span>
//               </button>
//             </div>
//             <div className="modal-body">
//               <div class="container">
//                 <div class="row">
//                   <div class="col-md-4 col-lg-4 col-sm-4">
//                     <label>
//                       <input
//                         type="radio"
//                         name="campaignScheduleType"
//                         class="card-input-element"
//                         value="ONETIME"
//                         // onChange={(e)=>{
//                         //   console.log(e)
//                         //   setFormData({campaignScheduleType:e.target.value})
//                         // }}
//                         onClick={event => { 
//                           console.log(event)
//                           // setFormData({campaignScheduleType:'ONETIME'})
//                           window.location.href='/autocampaigns'
//                         }}
//                       />

//                       <div class="panel panel-default card-input border-success">
//                         <div class="panel-heading">One-Time</div>
//                         <figure>
//                           <img src={img1} alt="one-time" />
//                         </figure>
//                         <div class="panel-body">Product specific content</div>
//                       </div>
//                     </label>
//                   </div>
//                   <div class="col-md-4 col-lg-4 col-sm-4">
//                     <label>
//                       <input
//                         type="radio"
//                         name="product"
//                         class="card-input-element"
//                         value="TRIGGERED"
//                         // onChange={(e)=>{
//                         //   setFormData({campaignScheduleType:e.target.value})
//                         // }}
//                         onClick={event => {  
//                             // setFormData({campaignScheduleType:'TRIGGERED'})
//                           window.location.href='/autocampaigns'
//                       }}
//                       />

//                       <div class="panel panel-default card-input">
//                         <div class="panel-heading">Triggered</div>
//                         <figure>
//                           <img src={img2} alt="triggered" />
//                         </figure>
//                         <div class="panel-body">Product specific content</div>
//                       </div>
//                     </label>
//                   </div>
//                   <div class="col-md-4 col-lg-4 col-sm-4">
//                     <label>
//                       <input
//                         type="radio"
//                         name="product"
//                         class="card-input-element"
//                         value="RECURRING"
//                         // onChange={(e)=>{
//                         //   setFormData({campaignScheduleType:e.target.value})
//                         // }}
//                         onClick={event => {
//                           // setFormData({campaignScheduleType:'RECURRING'})
//                            window.location.href='/autocampaigns'
//                           }}
//                       />

//                       <div class="panel panel-default card-input">
//                         <div class="panel-heading">Recurring</div>
//                         <figure>
//                           <img src={img3} alt="Recurring" />
//                         </figure>
//                         <div class="panel-body">Product specific content</div>
//                       </div>
//                     </label>
//                   </div>
//                 </div>
//               </div>{" "}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SelectAutomationType;






import React from "react";
import { Link } from "react-router-dom";
// image
import img1 from "./img/img1.svg";
import img2 from "./img/img2.svg";
import img3 from "./img/img3.svg";

function SelectAutomationType() {

  const [selected,setSelected] = React.useState();

  return (
    <div>
      <button
        type="button"
        className="btn btn-fill btn-success margin-left--auto mx-2"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Create Automation campaign
      </button>
      <div
        className="modal fade  bd-example-modal-lg"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Select Automation Campaign Type
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-4 col-lg-4 col-sm-4"> 

                      <div class={selected==1?"panel panel-default card-input text-center px-4 py-2 shadow bg-light border":"panel panel-default card-input text-center px-4 py-2"} onMouseLeave={()=>{setSelected(null)}} onMouseEnter={()=>{setSelected(1)}}>
                        <div class="panel-heading h4">One-Time</div>
                        <figure onClick={event => {
                           window.location.href='/autocampaigns'
                          }}>
                          <img src={img1} className="w-75 mt-3" alt="one-time" />
                        </figure>
                        <div class="panel-body">
                          <small>Send the campaign only once at a specified date and time</small> 
                        </div>
                      </div>
                      
                  </div>
                  <div class="col-md-4 col-lg-4 col-sm-4"> 

                      <div class={selected==2?"panel panel-default card-input text-center px-4 py-2 shadow bg-light border":"panel panel-default card-input text-center px-4 py-2"} onMouseLeave={()=>{setSelected(null)}} onMouseEnter={()=>{setSelected(2)}}>
                        <div class="panel-heading h4">Triggered</div>
                        <figure onClick={event => {
                           window.location.href='/autocampaigns'
                          }}>
                          <img src={img2} className="w-75 mt-3" alt="Triggered" />
                        </figure>
                        <div class="panel-body">
                          <small>Send the campaign only once at a specified date and time</small>
                        </div>
                      </div> 

                  </div>
                  <div class="col-md-4 col-lg-4 col-sm-4"> 

                      <div class={selected==3?"panel panel-default card-input text-center px-4 py-2 shadow bg-light border":"panel panel-default card-input text-center px-4 py-2"} onMouseLeave={()=>{setSelected(null)}} onMouseEnter={()=>{setSelected(3)}}>
                        <div class="panel-heading h4">Recurring</div>
                        <figure 
                           onClick={event => {
                           window.location.href='/autocampaigns'
                          }}>
                          <img src={img3} className="w-75 mt-3" alt="Recurring" /> 
                        </figure>
                        <div class="panel-body">
                          <small>Send the campaign only once at a specified date and time</small>
                        </div>
                      </div>
                      
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectAutomationType;