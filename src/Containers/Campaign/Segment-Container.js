import React, { useState,useEffect } from "react";
import CampaignCreateSegment from "../../Components/Campaign/automationcampaign/CampaignCreateSegment";
import {getCampaign} from "../../Services/campaign-service";
import utils from "../../Services/utility-service";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
const SegmentForm = () => {
  const [audienceData, setaudienceData] = useState({
    audienceType: 0,
    fileFormat: null,
    operation: "fileUpload",
    gpUpdate: null,
    groupNameList: [],
    audienceData: [],
    audienceGroupId: null,
    fetchingData: false,
  });

  
  const [segmentData, setSegmentData] = useState({
    segmentName: "",
  });

  const [formControls, setFormControls] = useState({
    file: {
      value: null,
    },
    gpName: {
      value: null,
    },
  });

  const changeHandler = () => {};

  useEffect(() => {
    // fetchCampaign(true);
    }
  )

  // function fetchCampaign(isprefill) {
  //   const body = {
  //     // ammId: parseInt(this.state.ammId),
  //     // bamId: parseInt(this.state.bamId),
  //   };
  //   getCampaign(body)
  //     .then((response) =>{ response.json()
  //     console.log(response)
  //     })
  //     .then((data) => {
  //       //let data = {"success":true,"message":null,"allowedActions":[],"segmentDetails":[{"segmentName":"city","title":"City","desc":null,"icon":"fas fa-map-marked","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":128,"basmId":null,"segmentId":52},{"segmentName":"mobile_bill","title":"Mobile Bill Per Month (ARPU)","desc":null,"icon":"fa fa-mobile","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Upto Rs. 200"},{"id":3,"value":"Rs. 201 to 500"},{"id":4,"value":"Rs. 501 to 1000"},{"id":5,"value":"Rs. 1001+"}]},"segmentType":"MUL","asmId":129,"basmId":null,"segmentId":6},{"segmentName":"pincode","title":"Pincode","desc":null,"icon":"fas fa-thumbtack","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":130,"basmId":null,"segmentId":50},{"segmentName":"handset_name","title":"Handset Name","desc":null,"icon":"fa fa-font","price":0.05,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Acer"},{"id":2,"value":"Apple"},{"id":3,"value":"Asus"},{"id":4,"value":"Blackberry"},{"id":5,"value":"Celkon"},{"id":6,"value":"Gionee"},{"id":7,"value":"Google"},{"id":8,"value":"HTC"},{"id":9,"value":"Huawei"},{"id":10,"value":"Intex"},{"id":11,"value":"Jolla"},{"id":12,"value":"Karbonn"},{"id":13,"value":"LAVA"},{"id":14,"value":"LeEco"},{"id":15,"value":"Lenovo"},{"id":16,"value":"LG"},{"id":17,"value":"Meizu"},{"id":18,"value":"Micromax"},{"id":19,"value":"Motorola"},{"id":20,"value":"Nokia"},{"id":21,"value":"OnePlus"},{"id":22,"value":"Oppo"},{"id":23,"value":"Panasonic"},{"id":24,"value":"Philips"},{"id":25,"value":"Sagem"},{"id":26,"value":"Samsung"},{"id":27,"value":"Sony"},{"id":28,"value":"Sony Ericson"},{"id":29,"value":"Spice"},{"id":30,"value":"Vertu"},{"id":31,"value":"Vivo"},{"id":32,"value":"Vodofone"},{"id":33,"value":"Xiaomi"},{"id":34,"value":"Xolo"},{"id":35,"value":"ZTE"}]},"segmentType":"MUL","asmId":131,"basmId":null,"segmentId":13},{"segmentName":"ageSlider2","title":"Age","desc":"","icon":"","price":0.0,"subscriptionType":"basic","values":{"minValue":15,"maxValue":75,"segmentValuesList":null},"segmentType":"RNG","asmId":132,"basmId":null,"segmentId":1},{"segmentName":"handset_cost","title":"Handset Cost","desc":null,"icon":"fas fa-hand-holding-usd","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Less than INR 1500"},{"id":2,"value":"INR 1500 - 3000"},{"id":3,"value":"INR 3001 - 5000"},{"id":4,"value":"INR 5K - 10K"},{"id":5,"value":"INR 10K - 15K"},{"id":6,"value":"INR 15K - 20K"},{"id":7,"value":"INR 20K - 30K"},{"id":8,"value":"INR 30K - 40K"},{"id":9,"value":"INR 40K+"}]},"segmentType":"MUL","asmId":133,"basmId":null,"segmentId":16},{"segmentName":"data_user","title":"Data User","desc":null,"icon":"fa fa-user-lock","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":134,"basmId":null,"segmentId":8},{"segmentName":"national_roaming","title":"National Roaming","desc":null,"icon":"fa fa-broadcast-tower","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":135,"basmId":null,"segmentId":7},{"segmentName":"payment_model","title":"Payment Model","desc":null,"icon":"fa fa-money-bill-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Prepaid"},{"id":3,"value":"Postpaid"}]},"segmentType":"RDO","asmId":136,"basmId":null,"segmentId":10},{"segmentName":"handsetOS_category","title":"Handset OS Category","desc":null,"icon":"fab fa-opera","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Android"},{"id":2,"value":"iOS"},{"id":3,"value":"Windows"}]},"segmentType":"MUL","asmId":137,"basmId":null,"segmentId":17},{"segmentName":"handset_type","title":"Handset Type","desc":null,"icon":"fa fa-mobile-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Feature Phone"},{"id":3,"value":"Smart Phone"}]},"segmentType":"RDO","asmId":138,"basmId":null,"segmentId":12},{"segmentName":"ageof_device","title":"Age of Device","desc":null,"icon":"fas fa-clock","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"1-3 Months"},{"id":2,"value":"3-6 Months"},{"id":3,"value":"6-12 Months"},{"id":4,"value":"1 Year +"}]},"segmentType":"MUL","asmId":139,"basmId":null,"segmentId":18},{"segmentName":"customer_BusinessCat","title":"Customer Business Category","desc":null,"icon":"fas fa-user-tie","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"SME"},{"id":2,"value":"Enterprise"}]},"segmentType":"MUL","asmId":140,"basmId":null,"segmentId":22},{"segmentName":"gender","title":"Gender","desc":"gender","icon":"fa fa-user","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Male"},{"id":3,"value":"Female"}]},"segmentType":"RDO","asmId":141,"basmId":null,"segmentId":4},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":235,"basmId":null,"segmentId":2},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":236,"basmId":null,"segmentId":2}]}
  //       if (data.success) {
  //         let temp = this.state.formControls;
  //       //     // () => {
  //       //     //   if (isprefill) {
  //       //     //     this.populateCampaignData();
  //       //     //     this.populateSegmentFiltersData();
  //       //     //     let qp = utils.getQueryParams();
  //       //     //     if (qp && qp.p) {
  //       //     //       this.computeDetails();
  //       //     //     }
  //       //       }
  //       //     }
  //       //   );
  //       // } else {
  //       //   this.setState({
  //       //     campaignSegmentDetail: [],
  //       //   });
  //       }
  //       ToastsStore.success(data.message);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       ToastsStore.error("Something went wrong, Please Try Again Later ");
  //     });
  // }

  const props = { formControls,segmentData, changeHandler, audienceData, setaudienceData };

  return (
    <>
      <CampaignCreateSegment {...props} />
    </>
  );
};

export default SegmentForm;
