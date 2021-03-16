 import React, { Component } from "react";
import { videoUpload, imageUpload } from "../../Services/common-service";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import CeareNewCampaignProcess from "./CreateNewCampaignProcess";
import CreateNewCampaignProcessSMS from "./CreateNewCampaignProcessSMS";
import CreateNewCampaignHeader from "./CreateNewCampaignHeader";
import { getMediums } from "../../Services/medium-service";
import { getAudienceMediumMapping } from "../../Services/datasource-service";
import {
  getAudienceGroup,
  getAudienceData,
} from "../../Services/common-service";
import {
  submitCampaign,
  getCampaign,
  getDetailCampaign,
  editCampaign,
  sendTestSmsApi,
  sendTestSmsPro,
  getSmsPrice,
  getCcId,
} from "../../Services/campaign-service";
import { getLeadStatusGroup } from "../../Services/lead-service";
import { getTemplates } from "../../Services/template-service";
import { getUpdatedWallet } from "../../Services/subscriptions-service";
import { getBusinessDetails } from "../../Services/user-service";
import { getSenderIds } from "../../Services/senderId-service";
import CircularLoader from "../circular-loader/circular-loader";
import { createShortUrl } from "../../Services/shortUrl-service";
import CreateNewCampaignHeaderSMS from "./CreateNewCampaignHeaderSMS";
import CampaignWhatsApp from "./CampaignWhatsApp";
import Select from "react-select";
import InputRange from "react-input-range";
import { Link } from "react-router-dom";
import Popup from "../Popup/Popup";
import utils from "../../Services/utility-service";
import CampaignBillingDetails from "./CampaignBillingDetails";
import SmsProBilling from "./SmsProBilling";
import "./Campaign.css";
import Youtube from "../../Components/Youtube/Youtube";

const initialState = {
  smsCampErr: "",
  formControls: {
    medium: {
      value: "",
      error: "",
    },
    ammId: {
      value: "",
      error: "",
    },
    senderId: {
      value: "",
      error: "",
    },
    language: {
      value: "en",
      error: "",
    },
    campaignName: {
      value: "",
      error: "",
    },
    targetAudienceCount: {
      value: "",
      error: "",
    },
    SMStype: {
      value: "simpleSMS",
      error: "",
    },
    campaignDescription: {
      value: "",
      error: "",
    },
    template: {
      value: "",
      error: "",
    },
    date: {
      value: "",
      error: "",
    },
    time: {
      value: "",
      error: "",
    },
    su: {
      value: "",
      error: "",
    },
    ute: {
      value: false,
    },
    campaignCode: {
      value: "",
      error: "",
    },
    campaignType: {
      value: "",
      error: "",
    },
    templateCont: {
      value: "",
      error: "",
    },
    statusGrp: {
      value: "",
      error: "",
    },
    endPoint: {
      value: "",
      error: "",
    },
    defaultParams: {
      value: "",
      error: "",
    },
    campaignUrl: {
      value: "",
      error: "",
    },
    leadPushClass: {
      value: "",
      error: "",
    },
    duplicacyCheckDays: {
      value: "",
      error: "",
    },
    headerParams: {
      value: "",
      error: "",
    },
    pushExcludeParams: {
      value: "",
      error: "",
    },
    pushIncludeParams: {
      value: "",
      error: "",
    },
    groupName: {
      value: "",
      error: "",
    },
    mobileList: {
      value: "",
      error: [],
    },
    audienceGrId: {
      value: "",
      error: "",
    },
    colmnElement: {
      value: "",
    },
    longurl: {
      value: "",
    },
    audienceGrName: {
      value: "",
    },
    validMobile: {
      value: null,
    },
    scheduleNow: {
      value: false,
    },
    ccid: {
      value: "",
      loading: false,
      error: "",
    },
    dpURL: {
      value: null,
    },
    contentMediaUrl: {
      value: null,
    },
  },
};
class CreateNewCampaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaType: null,
      dpPath: null,
      mediaPath: null,
      showWhatsApp: false,
      serviceType: null,
      code: "",
      campaignDetails: null,
      mediums: [],
      datasources: [],
      templates: [],
      senderIds: [],
      start: 0,
      ammId: "",
      bamId: "",
      businessUid: "",
      displayCampaignFilter: false,
      campaignSegmentDetail: [],
      shortUrl: "",
      shortUrlLoader: false,
      submitLoader: false,
      showDisc: false,
      showBillingDetails: false,
      canTestSms: false,
      canTestSmsCr: false,
      segmentInfo: null,
      campSubmitErr: null,
      campType: "GENERIC",
      groupNameList: [],
      statusGroups: [],
      messageNum: 0,
      formControls: JSON.parse(JSON.stringify(initialState.formControls)),
      error: "",
      tempDs: "",
      showDsChangeConf: false,
      showLangChangeConf: false,
      pricePerUnit: 0,
      availableCredit: 0,
      creditToBeUsed: 0,
      howTo: false,
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.fetchMediums();
    this.fetchSenderIds();
    this.fetchBusinessDetails();
    this.fetchUpdatedWallet();
    if (
      this.props.location.pathname === "/edit-campaign" ||
      this.props.location.pathname === "/clone-campaign"
    ) {
      let temp = localStorage.getItem("code");
      if (temp) {
        this.setState(
          {
            code: JSON.parse(temp),
          },
          () => this.fetchCampaignDetails()
        );
      }
    }
  }

  fetchUpdatedWallet() {
    getUpdatedWallet({})
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let user = JSON.parse(localStorage.getItem("userInfo"));
          user.walletInfo = data.walletInfo;
          localStorage.setItem("userInfo", JSON.stringify(user));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchCampaignDetails() {
    const body = {
      code: this.state.code,
    };
    getDetailCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        //let data = {"success":true,"message":"Success","allowedActions":["view","clone"],"code":"2020_04_10_00_02_36-100005000896","mediumId":1,"ammId":2,"sgId":null,"bamId":null,"mediumName":"SMS","audienceGroupName":null,"campaignName":"test 1","campaignDesc":"Test Desc","shortUrl":"https://pky.es/283bdd","uniqueTrackingEnabled":false,"templateId":1,"scheduleDate":1586457000000,"scheduleTime":"11:00 AM - 13:00 PM","targetCount":100000,"segments":[{"segmentId":52,"asmId":128,"basmId":null,"selected":true,"datacode":"city","values":["Agra","Delhi"],"value":null},{"segmentId":6,"asmId":129,"basmId":null,"selected":true,"datacode":"mobile_bill","values":["Upto Rs. 200","Rs. 201 to 500"],"value":null},{"segmentId":50,"asmId":130,"basmId":null,"selected":false,"datacode":"pincode","values":["110011"],"value":null},{"segmentId":13,"asmId":131,"basmId":null,"selected":true,"datacode":"handset_name","values":["Acer","Asus","Apple"],"value":null},{"segmentId":1,"asmId":132,"basmId":null,"selected":true,"datacode":"ageSlider2","values":[],"value":"20-70"},{"segmentId":16,"asmId":133,"basmId":null,"selected":false,"datacode":"handset_cost","values":[],"value":null},{"segmentId":8,"asmId":134,"basmId":null,"selected":false,"datacode":"data_user","values":["No"],"value":null},{"segmentId":7,"asmId":135,"basmId":null,"selected":true,"datacode":"national_roaming","values":[],"value":null},{"segmentId":10,"asmId":136,"basmId":null,"selected":true,"datacode":"payment_model","values":["Prepaid"],"value":null},{"segmentId":17,"asmId":137,"basmId":null,"selected":false,"datacode":"handsetOS_category","values":[],"value":null},{"segmentId":12,"asmId":138,"basmId":null,"selected":false,"datacode":"handset_type","values":["Feature Phone"],"value":null},{"segmentId":18,"asmId":139,"basmId":null,"selected":false,"datacode":"ageof_device","values":["1-3 Months"],"value":null},{"segmentId":22,"asmId":140,"basmId":null,"selected":false,"datacode":"customer_BusinessCat","values":[],"value":null},{"segmentId":4,"asmId":141,"basmId":null,"selected":false,"datacode":"gender","values":["Male"],"value":null},{"segmentId":2,"asmId":235,"basmId":null,"selected":false,"datacode":"amountRange","values":[],"value":"100-900"},{"segmentId":2,"asmId":236,"basmId":null,"selected":false,"datacode":"amountRange","values":[],"value":"100-900"}],"status":"S"};
        if (data.success) {
          this.setState(
            {
              campaignDetails: data,
            },
            () => this.initForm()
          );
          ToastsStore.success(data.message);
        } else {
          ToastsStore.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  initForm() {
    if (this.state.campaignDetails.campaignType === "LEAD") {
      this.fetchStatusGroups(true);
    } else {
      this.fetchMediums(true);
    }
  }

  fetchMediums(isPrefill) {
    const body = {};
    getMediums(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState(
            {
              mediums: data.mediumList,
            },
            () => {
              if (isPrefill) {
                let temp = this.state.formControls;
                temp.medium.value = this.state.campaignDetails.mediumId;
                this.setState(
                  {
                    formControls: temp,
                  },
                  () => {
                    this.fetchDatasourcesByMedium(true);
                  }
                );
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadData() {
    const body = {
      audienceGroupId: this.state.formControls.audienceGrId.value,
    };
    if (!this.state.formControls.audienceGrId.value) {
      // ToastsStore.error("Please Select Audience or Upload Audience First");
      return;
    }

    getAudienceData(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            audienceData: data.audienceColumnNames,
            formControls: {
              ...this.state.formControls,
              validMobile: {
                value: data.validMobile,
              },
              targetAudienceCount: {
                value: data.validMobile,
              },
            },
          });

          ToastsStore.success(data.message);
        } else {
          ToastsStore.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  fetchGroupNames(upload) {
    const body = {
      maxResults: 20,
      start: 0,
    };
    getAudienceGroup(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          ToastsStore.success(data.message);

          this.setState({
            groupNameList: data.audienceGroups,
          });
          if (upload === "upload") {
            this.getAudienceGroupID();
          }
          this.loadData();
        } else {
          ToastsStore.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong. Please try again later.!!!");
      });
  }

  checkedHandler(event) {
    let value = event.target.checked;

    this.setState((state) => {
      return {
        formControls: {
          ...state.formControls,
          scheduleNow: {
            ...state.formControls.scheduleNow,
            value,
          },
        },
      };
    });
  }

  clickHandler() {
    //let finalStr = this.state.formControls.templateCont.value.concat("${"+this.state.formControls.colmnElement.value)+"}"
    let finalStr = this.state.formControls.templateCont.value.concat(
      " ${" + this.state.formControls.colmnElement.value + "}"
    );
    this.setState((state) => {
      return {
        formControls: {
          ...state.formControls,
          templateCont: {
            ...state.formControls.templateCont,
            value: finalStr,
          },
        },
      };
    });
  }

  addURL() {
    let str = " $ {clickUrlWithTracking}";
    let finalUrl = this.state.formControls.templateCont.value.concat(str);
    this.setState((state) => {
      return {
        formControls: {
          ...state.formControls,
          templateCont: {
            ...state.formControls.templateCont,
            value: finalUrl,
          },
        },
      };
    });
  }

  targetCountChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (value >= this.state.formControls.validMobile.value) {
      ToastsStore.error("Please add new audience and update Audience Group");
      return;
    } else {
      this.setState({
        formControls: {
          ...this.state.formControls,
          [name]: {
            ...this.state.formControls[name],
            value,
          },
        },
      });
    }
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      formControls: {
        ...this.state.formControls,
        [name]: {
          ...this.state.formControls[name],
          value,
        },
      },
    });
  };

  audienceChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(
      {
        formControls: {
          ...this.state.formControls,
          [name]: {
            ...this.state.formControls[name],
            value,
          },
        },
      },
      () => this.loadData()
    );
  }

  onMediumChange = (event) => {
    const value = event.target.value;
    let temp1 = this.state.formControls;
    temp1.medium.value = value;
    if ((value === "1" || value === "2") && this.state.senderIds.length < 1) {
      this.setState({
        formControls: temp1,
        showDisc: true,
        datasources: [],
      });
    } else {
      this.setState(
        {
          formControls: temp1,
          showDisc: false,
        },
        () => this.fetchDatasourcesByMedium()
      );
    }
  };

  fetchDatasourcesByMedium(isPrefill) {
    let body = {
      mediumId: this.state.formControls.medium.value,
    };
    getAudienceMediumMapping(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState(
            {
              datasources: data.audienceGroups,
            },
            () => {
              if (isPrefill) {
                let temp = this.state.formControls;
                temp.ammId.value =
                  this.state.campaignDetails.ammId +
                  "," +
                  this.state.campaignDetails.bamId;
                this.setState(
                  {
                    formControls: temp,
                    ammId: this.state.campaignDetails.ammId,
                    bamId: this.state.campaignDetails.bamId,
                  },
                  () => {
                    this.fetchCampaign(true);
                  }
                );
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onDatasourceChangeHandler = (event) => {
    let temp = this.state.formControls;
    if (!!temp.ammId.value) {
      this.setState({
        tempDs: event.target.value,
        showDsChangeConf: true,
      });
      return;
    }
    temp.ammId.value = event.target.value;
    this.setState(
      {
        ammId: event.target.value.split(",")[0],
        bamId: event.target.value.split(",")[1],
        formControls: temp,
      },
      () => this.fetchCampaign()
    );
  };

  continueChngDs() {
    let temp = JSON.parse(JSON.stringify(initialState.formControls));
    temp.ammId.value = this.state.tempDs;
    temp.medium.value = this.state.formControls.medium.value;
    this.setState(
      {
        ammId: this.state.tempDs.split(",")[0],
        bamId: this.state.tempDs.split(",")[1],
        formControls: temp,
        showDsChangeConf: false,
      },
      () => this.fetchCampaign()
    );
  }

  fetchCampaign(isprefill) {
    const body = {
      ammId: parseInt(this.state.ammId),
      bamId: parseInt(this.state.bamId),
    };
    getCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        //let data = {"success":true,"message":null,"allowedActions":[],"segmentDetails":[{"segmentName":"city","title":"City","desc":null,"icon":"fas fa-map-marked","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":128,"basmId":null,"segmentId":52},{"segmentName":"mobile_bill","title":"Mobile Bill Per Month (ARPU)","desc":null,"icon":"fa fa-mobile","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Upto Rs. 200"},{"id":3,"value":"Rs. 201 to 500"},{"id":4,"value":"Rs. 501 to 1000"},{"id":5,"value":"Rs. 1001+"}]},"segmentType":"MUL","asmId":129,"basmId":null,"segmentId":6},{"segmentName":"pincode","title":"Pincode","desc":null,"icon":"fas fa-thumbtack","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":null},"segmentType":"TXT","asmId":130,"basmId":null,"segmentId":50},{"segmentName":"handset_name","title":"Handset Name","desc":null,"icon":"fa fa-font","price":0.05,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Acer"},{"id":2,"value":"Apple"},{"id":3,"value":"Asus"},{"id":4,"value":"Blackberry"},{"id":5,"value":"Celkon"},{"id":6,"value":"Gionee"},{"id":7,"value":"Google"},{"id":8,"value":"HTC"},{"id":9,"value":"Huawei"},{"id":10,"value":"Intex"},{"id":11,"value":"Jolla"},{"id":12,"value":"Karbonn"},{"id":13,"value":"LAVA"},{"id":14,"value":"LeEco"},{"id":15,"value":"Lenovo"},{"id":16,"value":"LG"},{"id":17,"value":"Meizu"},{"id":18,"value":"Micromax"},{"id":19,"value":"Motorola"},{"id":20,"value":"Nokia"},{"id":21,"value":"OnePlus"},{"id":22,"value":"Oppo"},{"id":23,"value":"Panasonic"},{"id":24,"value":"Philips"},{"id":25,"value":"Sagem"},{"id":26,"value":"Samsung"},{"id":27,"value":"Sony"},{"id":28,"value":"Sony Ericson"},{"id":29,"value":"Spice"},{"id":30,"value":"Vertu"},{"id":31,"value":"Vivo"},{"id":32,"value":"Vodofone"},{"id":33,"value":"Xiaomi"},{"id":34,"value":"Xolo"},{"id":35,"value":"ZTE"}]},"segmentType":"MUL","asmId":131,"basmId":null,"segmentId":13},{"segmentName":"ageSlider2","title":"Age","desc":"","icon":"","price":0.0,"subscriptionType":"basic","values":{"minValue":15,"maxValue":75,"segmentValuesList":null},"segmentType":"RNG","asmId":132,"basmId":null,"segmentId":1},{"segmentName":"handset_cost","title":"Handset Cost","desc":null,"icon":"fas fa-hand-holding-usd","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Less than INR 1500"},{"id":2,"value":"INR 1500 - 3000"},{"id":3,"value":"INR 3001 - 5000"},{"id":4,"value":"INR 5K - 10K"},{"id":5,"value":"INR 10K - 15K"},{"id":6,"value":"INR 15K - 20K"},{"id":7,"value":"INR 20K - 30K"},{"id":8,"value":"INR 30K - 40K"},{"id":9,"value":"INR 40K+"}]},"segmentType":"MUL","asmId":133,"basmId":null,"segmentId":16},{"segmentName":"data_user","title":"Data User","desc":null,"icon":"fa fa-user-lock","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":134,"basmId":null,"segmentId":8},{"segmentName":"national_roaming","title":"National Roaming","desc":null,"icon":"fa fa-broadcast-tower","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Yes"},{"id":2,"value":"No"}]},"segmentType":"RDO","asmId":135,"basmId":null,"segmentId":7},{"segmentName":"payment_model","title":"Payment Model","desc":null,"icon":"fa fa-money-bill-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Prepaid"},{"id":3,"value":"Postpaid"}]},"segmentType":"RDO","asmId":136,"basmId":null,"segmentId":10},{"segmentName":"handsetOS_category","title":"Handset OS Category","desc":null,"icon":"fab fa-opera","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"Android"},{"id":2,"value":"iOS"},{"id":3,"value":"Windows"}]},"segmentType":"MUL","asmId":137,"basmId":null,"segmentId":17},{"segmentName":"handset_type","title":"Handset Type","desc":null,"icon":"fa fa-mobile-alt","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Feature Phone"},{"id":3,"value":"Smart Phone"}]},"segmentType":"RDO","asmId":138,"basmId":null,"segmentId":12},{"segmentName":"ageof_device","title":"Age of Device","desc":null,"icon":"fas fa-clock","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"1-3 Months"},{"id":2,"value":"3-6 Months"},{"id":3,"value":"6-12 Months"},{"id":4,"value":"1 Year +"}]},"segmentType":"MUL","asmId":139,"basmId":null,"segmentId":18},{"segmentName":"customer_BusinessCat","title":"Customer Business Category","desc":null,"icon":"fas fa-user-tie","price":0.02,"subscriptionType":"premium","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"SME"},{"id":2,"value":"Enterprise"}]},"segmentType":"MUL","asmId":140,"basmId":null,"segmentId":22},{"segmentName":"gender","title":"Gender","desc":"gender","icon":"fa fa-user","price":0.0,"subscriptionType":"basic","values":{"minValue":null,"maxValue":null,"segmentValuesList":[{"id":1,"value":"All"},{"id":2,"value":"Male"},{"id":3,"value":"Female"}]},"segmentType":"RDO","asmId":141,"basmId":null,"segmentId":4},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":235,"basmId":null,"segmentId":2},{"segmentName":"amountRange","title":"Amount","desc":"Amount","icon":"fa fa-users","price":0.99,"subscriptionType":"Premium","values":{"minValue":100,"maxValue":900,"segmentValuesList":null},"segmentType":"RNG","asmId":236,"basmId":null,"segmentId":2}]}
        if (data.success) {
          let temp = this.state.formControls;
          temp.targetAudienceCount.value = data.minCampaignCount;
          this.setState(
            {
              campaignSegmentDetail: this.formatSegmentData(
                data.segmentDetails
              ),
              segmentInfo: data,
              displayCampaignFilter: true,
              formControls: temp,
            },
            () => {
              if (isprefill) {
                this.populateCampaignData();
                this.populateSegmentFiltersData();
                let qp = utils.getQueryParams();
                if (qp && qp.p) {
                  this.computeDetails();
                }
              }
            }
          );
        } else {
          this.setState({
            campaignSegmentDetail: [],
          });
        }
        ToastsStore.success(data.message);
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  formatSegmentData(data) {
    data.forEach((item) => {
      item["checked"] = false; // to select-unselect filter
      item["value"] = ""; // to store selected values
      if (item.segmentType === "RDO") {
        // to bind selected radio button value
        item.values.segmentValuesList.forEach((ele) => {
          ele["checked"] = false;
        });
      }
      if (item.segmentType === "MUL") {
        // formatting data for multi-select
        let val = [];
        if (
          item.values.segmentValuesList &&
          item.values.segmentValuesList.length > 0
        ) {
          item.values.segmentValuesList.forEach((item) => {
            let obj = {
              value: item.value,
              label: item.value,
            };
            val.push(obj);
          });
        }
        item.values.segmentValuesList = val;
      }
      if (item.segmentType === "RNG") {
        let range = item.values.maxValue - item.values.minValue;
        item.value = {
          min: Math.floor(item.values.minValue + 0.3 * range),
          max: Math.floor(item.values.maxValue - 0.3 * range),
        };
      }
    });
    return data;
  }

  populateCampaignData() {
    let data = this.state.formControls;
    data.senderId.value = this.state.campaignDetails.senderId
      ? this.state.campaignDetails.senderId
      : "";
    data.campaignName.value = this.state.campaignDetails.campaignName;
    data.targetAudienceCount.value = this.state.campaignDetails.targetCount;
    data.campaignDescription.value = this.state.campaignDetails.campaignDesc;
    data.template.value = this.state.campaignDetails.templateId;
    data.date.value = new Date(this.state.campaignDetails.scheduleDate);
    data.time.value = this.state.campaignDetails.scheduleTime;
    data.campaignCode.value = this.state.campaignDetails.code;
    if (
      this.state.campaignDetails.content &&
      this.state.campaignDetails.content.content
    ) {
      data.language.value = this.state.campaignDetails.content.lang
        ? this.state.campaignDetails.content.lang
        : "en";
      data.templateCont.value = this.state.campaignDetails.content.content;
      data.dpURL.value = this.state.campaignDetails.content.dpImageUrl;
      data.contentMediaUrl.value = this.state.campaignDetails.content.contentMediaUrl;
    }
    this.setState({
      formControls: data,
      mediaType: this.state.campaignDetails.content
        ? this.state.campaignDetails.content.contentMediaType
        : null,
      dpPath: this.state.campaignDetails.content
        ? this.state.campaignDetails.content.dpImagePath
        : null,
      mediaPath: this.state.campaignDetails.content
        ? this.state.campaignDetails.content.contentMediaPath
        : null,
      shortUrl: this.state.campaignDetails.shortUrl,
    });
    if (data.templateCont.value) {
      this.contentHandler({ target: { value: data.templateCont.value } });
    }
  }

  populateSegmentFiltersData() {
    this.state.campaignSegmentDetail.forEach((ele) => {
      ele.checked = this.getCheckedStatus(ele.segmentId);
      if (ele.segmentType === "TXT") {
        ele.value = this.getTextTypeSegmentValue(ele.segmentId);
      }
      if (ele.segmentType === "RDO") {
        let val = this.getRadioTypeSegmentValue(ele.segmentId);
        ele.value = val;
        ele.values.segmentValuesList.forEach((ele) => {
          if (val === ele.value) {
            ele.checked = true;
          } else {
            ele.checked = false;
          }
        });
      }
      if (ele.segmentType === "RNG") {
        let val = this.getRangeTypeSegmentValue(ele.segmentId).split("-");
        if (val && val.length > 0) {
          ele.value = {
            min: val[0],
            max: val[1],
          };
        }
      }
      if (ele.segmentType === "MUL") {
        let val = this.getMulTypeSegmentValue(ele.segmentId);
        let temp = [];
        if (val && val.length > 0) {
          val.forEach((subEle) => {
            let obj = {
              value: subEle,
              label: subEle,
            };
            temp.push(obj);
          });
        }
        ele.value = temp;
      }
    });
  }

  getCheckedStatus(id) {
    let segment = this.getMatchingSegment(id);
    return segment ? segment.selected : false;
  }

  getTextTypeSegmentValue(id) {
    let segment = this.getMatchingSegment(id);
    return segment.values ? segment.values.join(",") : "";
  }

  getRadioTypeSegmentValue(id) {
    let segment = this.getMatchingSegment(id);
    return segment.values ? segment.values[0] : "";
  }

  getRangeTypeSegmentValue(id) {
    let segment = this.getMatchingSegment(id);
    return segment.value ? segment.value : "";
  }

  getMulTypeSegmentValue(id) {
    let segment = this.getMatchingSegment(id);
    return segment.values ? segment.values : "";
  }

  getMatchingSegment(id) {
    let matchingSegment = this.state.campaignDetails.segments.filter(
      (x) => x.segmentId === id
    );
    return matchingSegment[0];
  }

  getAudienceGroupID() {
    let audienceGrName = this.state.formControls.audienceGrName.value;
    this.state.groupNameList &&
      this.state.groupNameList.forEach((audience) => {
        if (audience.name === audienceGrName) {
          this.setState((state) => {
            return {
              formControls: {
                ...state.formControls,
                audienceGrId: {
                  ...state.formControls.audienceGrId,
                  value: audience.agId,
                },
              },
            };
          });
        }
      });
  }

  validateSMS() {
    if (!this.state.formControls.senderId.value) {
      ToastsStore.error("Please select sender Id first");
      return;
    }
    if (!this.state.formControls.campaignName.value) {
      ToastsStore.error("Campaign Name should not be empty");
      return;
    }
    if (!this.state.formControls.audienceGrId.value) {
      ToastsStore.error("Please specify audience or select or upload Audience");
      return;
    }

    if (!this.state.formControls.templateCont.value) {
      ToastsStore.error("Template content should not be empty");
      return;
    }

    if (
      !this.state.formControls.scheduleNow.value &&
      !this.state.formControls.date.value &&
      !this.state.formControls.time.value
    ) {
      ToastsStore.error("Please Schedule Campaign");
      return;
    }

    if (
      !this.state.formControls.time.value &&
      this.state.formControls.date.value
    ) {
      ToastsStore.error("Please Choose Schedule Time");
      return;
    }
    if (
      !this.state.formControls.date.value &&
      this.state.formControls.time.value
    ) {
      ToastsStore.error("Please Choose Schedule Date");
      return;
    }
    if (
      this.state.formControls.targetAudienceCount.value >
      this.state.formControls.validMobile.value
    ) {
      let temp = this.state.formControls;
      temp.targetAudienceCount.error =
        "Target Audience count cannot be greater than Available Audience.";
      ToastsStore.error(
        "Target Audience count cannot be greater than Available Audience."
      );
      this.setState({
        formControls: temp,
      });
      return;
    } else {
      let temp = this.state.formControls;
      temp.targetAudienceCount.error = "";
      this.setState({
        formControls: temp,
      });
    }

    this.getPriceInfo();
  }

  getPriceInfo() {
    let body = {
      audienceGroupId: this.state.formControls.audienceGrId.value,
      campaignType: "SMS",
      content: this.state.formControls.templateCont.value,
      custom: this.state.formControls.SMStype.value === "customSMS",
      lang: this.state.formControls.language.value,
      targetCount: this.state.formControls.targetAudienceCount.value,
    };
    this.setState({
      submitLoader: true,
    });
    getSmsPrice(body)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          submitLoader: false,
          serviceType: data.serviceType,
        });
        if (data.success) {
          this.setState({
            smsCampErr: null,
            showBillingDetails: true,
            creditToBeUsed: data.creditToBeUsed,
            pricePerUnit: data.pricePerUnit,
            availableCredit: data.availableCredit,
          });
        } else {
          // ToastsStore.error(data.message,4000);
          this.setState({
            smsCampErr: data.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
          smsCampErr: null,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  submitData(isDraft) {
    this.setState({
      submitLoader: true,
    });

    const body = {
      ammId: isNaN(parseInt(this.state.ammId))
        ? null
        : parseInt(this.state.ammId),
      bamId: isNaN(parseInt(this.state.bamId))
        ? null
        : parseInt(this.state.bamId),
      campaignDesc: this.state.formControls.campaignDescription.value
        ? this.state.formControls.campaignDescription.value
        : null,
      campaignName: this.state.formControls.campaignName.value,
      lang: this.state.formControls.language.value,
      mediumId: isNaN(parseInt(this.state.formControls.medium.value))
        ? null
        : parseInt(this.state.formControls.medium.value),
      saveAsDraft: !!isDraft,
      scheduleDate: this.state.formControls.date.value
        ? this.state.formControls.date.value
        : null,
      scheduleTime: this.state.formControls.time.value
        ? this.state.formControls.time.value
        : null,
      segments: this.parseSegmentsForRequest(),
      sgId: null,
      businessUid: null,
      scheduleNow: this.state.formControls.scheduleNow.value
        ? this.state.formControls.scheduleNow.value
        : null,
      //"campaignType": this.state.formControls.campaignType.value,
      campaignType: this.state.campType
        ? this.state.campType
        : this.state.formControls.campaignType.value,
      audienceGroupId: this.state.formControls.audienceGrId.value
        ? this.state.formControls.audienceGrId.value
        : null,
      isCustom:
        this.state.formControls.SMStype.value === "customSMS" ? true : false,
      shortUrl: this.state.shortUrl ? this.state.shortUrl : null,
      longUrl: this.state.formControls.longurl.value
        ? this.state.formControls.longurl.value
        : null,
      submit: !isDraft,
      targetCount: this.state.formControls.targetAudienceCount.value
        ? this.state.formControls.targetAudienceCount.value
        : this.state.formControls.validMobile.value,
      templateId: isNaN(parseInt(this.state.formControls.template.value))
        ? null
        : parseInt(this.state.formControls.template.value),
      uniqueTrackingEnabled: this.state.formControls.ute.value
        ? this.state.formControls.ute.value
        : true,
      senderId: this.state.formControls.senderId.value
        ? this.state.formControls.senderId.value
        : null,
      //"targetCount": this.state.formControls.validMobile.value ? this.state.formControls.validMobile.value : null,
      content: {
        content: this.state.formControls.templateCont.value
          ? this.state.formControls.templateCont.value
          : null,
        contentMediaType: this.state.mediaType ? this.state.mediaType : null,
        contentMediaPath: this.state.mediaPath ? this.state.mediaPath : null,
        dpImagePath: this.state.dpPath ? this.state.dpPath : null,
        lang: this.state.formControls.language.value
          ? this.state.formControls.language.value
          : null,
      },
    };
    submitCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          submitLoader: false,
        });
        if (data.success) {
          ToastsStore.success(data.message);
          this.props.history.push("/campaigns");
        } else {
          ToastsStore.error(data.message);
          if (!isDraft) {
            this.setState({
              campSubmitErr: data.message,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  editCampaignData(isDraft) {
    if (!this.validateCampaign()) {
      return;
    }
    this.setState({
      submitLoader: true,
    });
    const body = {
      ammId: isNaN(parseInt(this.state.ammId))
        ? null
        : parseInt(this.state.ammId),
      bamId: isNaN(parseInt(this.state.bamId))
        ? null
        : parseInt(this.state.bamId),
      campaignDesc: this.state.formControls.campaignDescription.value,
      campaignName: this.state.formControls.campaignName.value,
      lang: this.state.formControls.language.value,
      mediumId: isNaN(parseInt(this.state.formControls.medium.value))
        ? null
        : parseInt(this.state.formControls.medium.value),
      saveAsDraft: !!isDraft,
      scheduleDate: this.state.formControls.date.value,
      scheduleTime: this.state.formControls.time.value,
      segments: this.parseSegmentsForRequest(),
      sgId: null,
      shortUrl: this.state.shortUrl,
      submit: !isDraft,
      targetCount: this.state.formControls.targetAudienceCount.value,
      templateId: isNaN(parseInt(this.state.formControls.template.value))
        ? null
        : parseInt(this.state.formControls.template.value),
      uniqueTrackingEnabled: this.state.formControls.ute.value,
      code: this.state.formControls.campaignCode.value,
      senderId: this.state.formControls.senderId.value
        ? this.state.formControls.senderId.value
        : null,
      content: {
        content: this.state.formControls.templateCont.value
          ? this.state.formControls.templateCont.value
          : null,
        contentMediaType: this.state.mediaType ? this.state.mediaType : null,
        contentMediaPath: this.state.mediaPath ? this.state.mediaPath : null,
        dpImagePath: this.state.dpPath ? this.state.dpPath : null,
        lang: this.state.formControls.language.value
          ? this.state.formControls.language.value
          : null,
      },
    };
    editCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          submitLoader: false,
        });
        if (data.success) {
          ToastsStore.success(data.message);
          this.props.history.push("/campaigns");
        } else {
          ToastsStore.error(data.message);
          if (!isDraft) {
            this.setState({
              campSubmitErr: data.message,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  validateCampaign() {
    let isValid = true;
    let name = null;
    let temp = this.state.formControls;
    let error = null;

    if (!temp.time.value) {
      temp.time.error = "Please Choose Schedule Time";
      isValid = false;
      name = "time";
    } else {
      temp.time.error = "";
    }

    if (!temp.date.value) {
      temp.date.error = "Please Choose Schedule Date";
      isValid = false;
      name = "date";
    } else {
      temp.date.error = "";
    }

    if (!temp.template.value && !temp.templateCont.value) {
      temp.template.error =
        "Please Choose Template or provide Template Content";
      isValid = false;
      name = "template";
      ToastsStore.error("Please provide Template body");
    } else {
      temp.template.error = "";
    }

    if (!temp.campaignDescription.value) {
      temp.campaignDescription.error = "Please enter Campaign Description";
      isValid = false;
      name = "campaignDescription";
    } else {
      temp.campaignDescription.error = "";
    }

    if (!temp.targetAudienceCount.value) {
      temp.targetAudienceCount.error = "Please enter Target Audience Count";
      isValid = false;
      name = "targetAudienceCount";
    } else if (
      parseInt(temp.targetAudienceCount.value) <
      this.state.segmentInfo.minCampaignCount
    ) {
      temp.targetAudienceCount.error =
        "Target Audience Count cannot be less than " +
        this.state.segmentInfo.minCampaignCount;
      isValid = false;
      name = "targetAudienceCount";
    } else {
      temp.targetAudienceCount.error = "";
    }

    if (
      (temp.medium.value === "1" || temp.medium.value === "2") &&
      !temp.senderId.value
    ) {
      temp.senderId.error = "Please choose SenderId";
      isValid = false;
      name = "senderId";
      ToastsStore.error("Please choose SenderId");
    } else {
      temp.senderId.error = "";
    }

    if (!temp.campaignName.value) {
      temp.campaignName.error = "Campaign Name cannot be empty";
      isValid = false;
      name = "campaignName";
    } else {
      temp.campaignName.error = "";
    }

    if (!isValid && name) {
      let ele = document.querySelector(`[name=${name}]`);
      ele.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (!this.isFilterSelected()) {
      error = "Please choose Campaign Filters to proceed.";
      ToastsStore.error("Please choose Campaign Filters to proceed.");
      isValid = false;
    }

    this.setState({
      formControls: temp,
      error: error,
    });
    return isValid;
  }

  isFilterSelected() {
    let selected = false;
    this.state.campaignSegmentDetail.forEach((item) => {
      if (item.checked) {
        selected = true;
      }
    });
    return selected;
  }

  parseSegmentsForRequest() {
    let segments = [];
    this.state.campaignSegmentDetail.forEach((item) => {
      let obj = {
        asmId: item.asmId,
        basmId: item.basmId,
        datacode: item.segmentName,
        segmentId: item.segmentId,
        selected: item.checked,
        name: item.title,
        type: item.segmentType,
        value: null,
        values: [],
      };
      if (item.segmentType === "TXT" || item.segmentType === "RDO") {
        if (item.value) {
          obj.values = item.value.split(",");
        }
      } else if (item.segmentType === "RNG") {
        if (item.value.min && item.value.max) {
          obj.value = item.value.min + "-" + item.value.max;
        }
      } else if (item.segmentType === "MUL") {
        if (item.value) {
          item.value.forEach((ele) => {
            obj.values.push(ele.value);
          });
        }
      }
      segments.push(obj);
    });
    return segments;
  }

  fetchBusinessDetails() {
    getBusinessDetails()
      .then((response) => response.json())
      .then((data) => {
        if (data.success && !!data.uid) {
          this.setState(
            {
              businessUid: data.uid,
            },
            () => this.fetchTemplates()
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchTemplates() {
    const body = {
      businessUid: this.state.businessUid,
    };
    getTemplates(body)
      .then((response) => response.json())
      .then((data) => {
        //let data = { "success": true, "message": "Success", "allowedActions": [], "smsTemplates": [ { "smsTemplateId": 2, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" }, { "smsTemplateId": 3, "templateBody": "new template body", "smsType": "PRML", "smsChannelId": 1, "name": "sms-template", "dndHourBlockingEnabled": false, "dndScrubbingOn": true, "senderId": 1, "businesUid": "70005000789", "lang": "EN", "url": "master" } ] };
        if (data.success) {
          this.setState({
            templates: data.smsTemplates,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loadingData: false,
        });
      });
  }

  fetchSenderIds() {
    getSenderIds()
      .then((response) => response.json())
      .then((data) => {
        //let data = {"success":true,"message":"Success","allowedActions":[],"senderIds":[{"id":1,"medium":null,"dataSource":null,"senderCode":"qwq","status":"REQ","created":1586197800000,"businessName":"Anand ","businessOwnerName":null,"businessOwnerEmail":null}]};
        if (data.success) {
          this.setState({
            senderIds: data.senderIds,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  dateChange = (val) => {
    let temp1 = this.state.formControls;
    temp1.date.value = val;
    this.setState({
      formControls: temp1,
    });
  };

  filtersChangeHandler(event, index, subindex) {
    let segments = this.state.campaignSegmentDetail;
    let segment = this.state.campaignSegmentDetail[index];
    if (segment.segmentType === "TXT") {
      let val = event.target.value;
      segments[index].value = val;
    } else if (segment.segmentType === "RNG") {
      // const name = event.target.name;
      // if(name === 'min'){
      //       segments[index].values.minValue = val;
      // }else{
      //       segments[index].values.maxValue = val;
      // }
      segments[index].value = event;
    } else if (segment.segmentType === "RDO") {
      let val = event.target.value;
      segments[index].value = val;
      segments[index].values.segmentValuesList[subindex].checked = true;
    }
    segments[index].checked = true;
    this.setState({
      campaignSegmentDetail: segments,
    });
  }

  multiSelectChange(event, index) {
    let segments = this.state.campaignSegmentDetail;
    segments[index].value = event;
    segments[index].checked = true;
    this.setState({
      campaignSegmentDetail: segments,
    });
  }

  selectFilter(event, index) {
    let segments = this.state.campaignSegmentDetail;
    segments[index].checked =
      event.target.value === "on" ? !segments[index].checked : false;
    this.setState({
      campaignSegmentDetail: segments,
    });
  }

  createShortUrl() {
    let temp1 = this.state.formControls;
    let body = {
      longUrl: temp1.su.value,
    };
    if (!body.longUrl) {
      temp1.su.error = "Please enter a valid URL e.g. https://www.expletus.com";
      this.setState({
        formControls: temp1,
      });
      return;
    } else if (
      body.longUrl &&
      body.longUrl.indexOf("https://") < 0 &&
      body.longUrl.indexOf("http://") < 0
    ) {
      temp1.su.error = "Please enter a valid URL e.g. https://www.expletus.com";
      this.setState({
        formControls: temp1,
      });
      return;
    } else {
      temp1.su.error = "";
      this.setState({
        formControls: temp1,
      });
    }
    this.setState({
      shortUrlLoader: true,
    });
    createShortUrl(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            shortUrl: data.shortUrl,
          });
          ToastsStore.success(data.message);
        } else {
          ToastsStore.error(data.message);
        }
        this.setState({
          shortUrlLoader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          shortUrlLoader: false,
        });
        ToastsStore.error("Something went wrong, Please try again later !");
      });
  }

  smsChangeHandler = (event) => {
    const value = event.target.value;
    let temp1 = this.state.formControls;
    temp1.template.value = value;
    temp1.templateCont.value = this.getTemplate(value);
    let num = 0;
    if (temp1.templateCont.value.length !== 0) {
      if (temp1.language.value === "en") {
        temp1.templateCont.value = temp1.templateCont.value.substring(0, 300);
        num =
          temp1.templateCont.value.length - 160 > 0
            ? 1 + Math.ceil((temp1.templateCont.value.length - 160) / 140)
            : 1;
      } else {
        temp1.templateCont.value = temp1.templateCont.value.substring(0, 120);
        num =
          temp1.templateCont.value.length - 70 > 0
            ? 1 + Math.ceil((temp1.templateCont.value.length - 70) / 50)
            : 1;
      }
    }
    this.setState({
      formControls: temp1,
      messageNum: num,
    });
  };

  getTemplate(value) {
    let temp = "";
    this.state.templates.forEach((e) => {
      if (String(e.smsTemplateId) === String(value)) {
        temp = e.templateBody;
      }
    });
    return temp;
  }

  computeDetails() {
    if (!this.validateCampaign()) {
      return;
    }
    this.setState({
      showBillingDetails: true,
    });
  }

  closeAction() {
    this.setState({
      showBillingDetails: false,
      campSubmitErr: "",
    });
  }

  getBasicFilters() {
    let data = [];
    this.state.campaignSegmentDetail.forEach((e) => {
      if (e.subscriptionType !== "premium" && e.checked) {
        data.push(e);
      }
    });
    return data;
  }

  getPremiumFilters() {
    let data = [];
    this.state.campaignSegmentDetail.forEach((e) => {
      if (e.subscriptionType === "premium" && e.checked) {
        data.push(e);
      }
    });
    return data;
  }

  payAndSubmit(amt) {
    this.setState({
      submitLoader: true,
    });
    const body = {
      ammId: isNaN(parseInt(this.state.ammId))
        ? null
        : parseInt(this.state.ammId),
      bamId: isNaN(parseInt(this.state.bamId))
        ? null
        : parseInt(this.state.bamId),
      campaignDesc: this.state.formControls.campaignDescription.value,
      campaignName: this.state.formControls.campaignName.value,
      lang: this.state.formControls.language.value,
      mediumId: isNaN(parseInt(this.state.formControls.medium.value))
        ? null
        : parseInt(this.state.formControls.medium.value),
      saveAsDraft: false,
      scheduleDate: this.state.formControls.date.value,
      scheduleTime: this.state.formControls.time.value,
      segments: this.parseSegmentsForRequest(),
      sgId: null,
      shortUrl: this.state.shortUrl,
      businessUid: null,
      scheduleNow: this.state.formControls.scheduleNow.value
        ? this.state.formControls.scheduleNow.value
        : null,
      campaignType: this.state.campType
        ? this.state.campType
        : this.state.formControls.campaignType.value,
      audienceGroupId: this.state.formControls.audienceGrId.value
        ? this.state.formControls.audienceGrId.value
        : null,
      isCustom:
        this.state.formControls.SMStype.value === "customSMS" ? true : false,
      submit: true,
      targetCount: this.state.formControls.targetAudienceCount.value,
      templateId: isNaN(parseInt(this.state.formControls.template.value))
        ? null
        : parseInt(this.state.formControls.template.value),
      uniqueTrackingEnabled: this.state.formControls.ute.value,
      longUrl: this.state.formControls.longurl.value
        ? this.state.formControls.longurl.value
        : null,
      senderId: this.state.formControls.senderId.value,
      content: {
        content: this.state.formControls.templateCont.value
          ? this.state.formControls.templateCont.value
          : null,
        contentMediaType: this.state.mediaType ? this.state.mediaType : null,
        contentMediaPath: this.state.mediaPath ? this.state.mediaPath : null,
        dpImagePath: this.state.dpPath ? this.state.dpPath : null,
        lang: this.state.formControls.language.value
          ? this.state.formControls.language.value
          : null,
      },
    };
    if (this.props.location.pathname === "/edit-campaign") {
      body.code = this.state.formControls.campaignCode.value;
      editCampaign(body)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            submitLoader: false,
          });
          if (data.success) {
            this.pay(data, amt);
          } else {
            ToastsStore.error(data.message);
            this.setState({
              submitLoader: false,
              campSubmitErr: data.message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            submitLoader: false,
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        });
    } else {
      submitCampaign(body)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.pay(data, amt);
          } else {
            ToastsStore.error(data.message);
            this.setState({
              submitLoader: false,
              campSubmitErr: data.message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            submitLoader: false,
          });
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        });
    }
  }

  pay(data, amt) {
    let form = document.getElementById("paymentForm");
    document.getElementById("form-amount").value = parseFloat(amt.toFixed(2));
    let user = JSON.parse(localStorage.getItem("userInfo"));
    document.getElementById("form-walletId").value = user.walletInfo.walletId;
    document.getElementById("form-refCode").value = data.code;
    form.submit();
  }

  typeChangeHandler(event) {
    let val = event.value;
    this.setState(
      {
        campType: val,
      },
      () => {
        if (val === "LEAD") {
          this.fetchStatusGroups(false);
        } else if (val === "SMS") {
          this.fetchGroupNames();
        }
      }
    );
  }

  fetchStatusGroups(isPrefill) {
    const body = {
      start: 0,
      maxResults: 100,
      businessUid: this.state.businessUid,
    };
    getLeadStatusGroup(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState(
            {
              statusGroups: data.leadStatusGroups,
            },
            () => {
              if (isPrefill) {
                this.initLeadCampaign();
              }
            }
          );
        } else if (isPrefill) {
          this.initLeadCampaign();
        }
      })
      .catch((error) => {
        ToastsStore.error("Something Went Wrong.Please Try Again Later !!!");
      });
  }

  initLeadCampaign() {
    let data = this.state.formControls;
    data.senderId.value = this.state.campaignDetails.senderId
      ? this.state.campaignDetails.senderId
      : "";
    data.campaignName.value = this.state.campaignDetails.campaignName;
    data.statusGrp.value = this.state.campaignDetails.statusGroupId;
    data.campaignDescription.value = this.state.campaignDetails.campaignDesc;
    data.template.value = this.state.campaignDetails.templateId;
    data.ccid.value = this.state.campaignDetails.customCampaignId;
    data.campaignCode.value = this.state.campaignDetails.code;
    data.endPoint.value = this.state.campaignDetails.endPoint;
    data.defaultParams.value = this.state.campaignDetails.defaultParams;
    data.campaignUrl.value = this.state.campaignDetails.campaignUrl;
    data.duplicacyCheckDays.value = this.state.campaignDetails.duplicacyCheckDays;
    data.headerParams.value = this.state.campaignDetails.headerParams;
    data.pushExcludeParams.value = this.state.campaignDetails.pushExcludeParams;
    data.pushIncludeParams.value = this.state.campaignDetails.pushIncludeParams;

    if (
      this.state.campaignDetails.content &&
      this.state.campaignDetails.content.content
    ) {
      data.language.value = this.state.campaignDetails.content.lang
        ? this.state.campaignDetails.content.lang
        : "en";
      data.templateCont.value = this.state.campaignDetails.content.content;
    }
    this.setState({
      campType: "LEAD",
      formControls: data,
    });
    if (data.templateCont.value) {
      this.contentHandler({ target: { value: data.templateCont.value } });
    }
  }

  editLeadCamp(isDraft) {
    this.setState({
      submitLoader: true,
    });
    let body = {
      campaignDesc: this.state.formControls.campaignDescription.value,
      campaignName: this.state.formControls.campaignName.value,
      lang: this.state.formControls.language.value,
      saveAsDraft: !!isDraft,
      campaignType: "LEAD",
      shortUrl: this.state.shortUrl,
      submit: !isDraft,
      templateId: isNaN(parseInt(this.state.formControls.template.value))
        ? null
        : parseInt(this.state.formControls.template.value),
      uniqueTrackingEnabled: this.state.formControls.ute.value,
      senderId: this.state.formControls.senderId.value,
      content: {
        content: this.state.formControls.templateCont.value,
        lang: this.state.formControls.language.value,
      },
      statusGroupId: parseInt(this.state.formControls.statusGrp.value),
      endPoint: this.state.formControls.endPoint.value,
      defaultParams: this.state.formControls.defaultParams.value,
      campaignUrl: this.state.formControls.campaignUrl.value,
      duplicacyCheckDays: parseInt(
        this.state.formControls.duplicacyCheckDays.value
      ),
      headerParams: this.state.formControls.headerParams.value,
      pushExcludeParams: this.state.formControls.pushExcludeParams.value,
      pushIncludeParams: this.state.formControls.pushIncludeParams.value,
      code: this.state.formControls.campaignCode.value,
    };
    if (!!this.state.formControls.ccid.value) {
      body["customCampaignId"] = this.state.formControls.ccid.value;
    }
    editCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          submitLoader: false,
        });
        if (data.success) {
          ToastsStore.success(data.message);
          this.props.history.push("/campaigns");
        } else {
          ToastsStore.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  submitLeadCamp(isDraft) {
    this.setState({
      submitLoader: true,
    });
    let body = {
      campaignDesc: this.state.formControls.campaignDescription.value,
      campaignName: this.state.formControls.campaignName.value,
      lang: this.state.formControls.language.value,
      saveAsDraft: !!isDraft,
      campaignType: "LEAD",
      shortUrl: this.state.shortUrl,
      submit: !isDraft,
      templateId: isNaN(parseInt(this.state.formControls.template.value))
        ? null
        : parseInt(this.state.formControls.template.value),
      uniqueTrackingEnabled: this.state.formControls.ute.value,
      senderId: this.state.formControls.senderId.value,
      content: {
        content: this.state.formControls.templateCont.value,
        lang: this.state.formControls.language.value,
      },
      statusGroupId: parseInt(this.state.formControls.statusGrp.value),
      endPoint: this.state.formControls.endPoint.value,
      defaultParams: this.state.formControls.defaultParams.value,
      campaignUrl: this.state.formControls.campaignUrl.value,
      duplicacyCheckDays: parseInt(
        this.state.formControls.duplicacyCheckDays.value
      ),
      headerParams: this.state.formControls.headerParams.value,
      pushExcludeParams: this.state.formControls.pushExcludeParams.value,
      pushIncludeParams: this.state.formControls.pushIncludeParams.value,
    };
    if (!!this.state.formControls.ccid.value) {
      body["customCampaignId"] = this.state.formControls.ccid.value;
    }
    submitCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          submitLoader: false,
        });
        if (data.success) {
          ToastsStore.success(data.message);
          this.props.history.push("/campaigns");
        } else {
          ToastsStore.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  contentHandler = (event) => {
    const value = event.target.value;
    let temp1 = this.state.formControls;
    temp1.templateCont.value = value;
    let num = 0;
    if (value.length !== 0) {
      if (temp1.language.value === "en") {
        num =
          value.length - 160 > 0
            ? 1 + Math.ceil((value.length - 160) / 140)
            : 1;
      } else {
        num =
          value.length - 70 > 0 ? 1 + Math.ceil((value.length - 70) / 50) : 1;
      }
    }
    this.setState({
      formControls: temp1,
      messageNum: num,
    });
  };

  langChangeHandle = (event) => {
    let temp1 = this.state.formControls;
    if (!!temp1.language.value) {
      this.setState({
        tempDs: event.target.value,
        showLangChangeConf: true,
      });
      return;
    }
    temp1.language.value = event.target.value;
    temp1.template.value = "";
    temp1.templateCont.value = "";
    this.setState({
      formControls: temp1,
      messageNum: 0,
    });
  };

  clearLangData = () => {
    let temp1 = this.state.formControls;
    temp1.language.value = this.state.tempDs;
    temp1.template.value = "";
    temp1.templateCont.value = "";
    this.setState({
      formControls: temp1,
      messageNum: 0,
      showLangChangeConf: false,
    });
  };

  copyUrl = (event) => {
    navigator.clipboard.writeText(this.state.shortUrl);
    ToastsStore.success("Short Url Copied to Clipboard.");
    let temp = this.state.formControls;
    temp.templateCont.value =
      temp.templateCont.value + "  " + this.state.shortUrl;
    this.setState({
      formControls: temp,
    });
  };

  canTestSms() {
    let temp = this.state.formControls;
    if (!temp.senderId.value) {
      temp.templateCont.error = "Please choose Sender Id to send Test SMS.";
      this.setState({
        formControls: temp,
      });
      return;
    } else {
      temp.templateCont.error = "";
      this.setState({
        formControls: temp,
        canTestSms: true,
      });
    }
  }

  canTestSmsCr() {
    let temp = this.state.formControls;
    if (!temp.senderId.value) {
      temp.templateCont.error = "Please choose Sender Id to send Test SMS.";
      this.setState({
        formControls: temp,
      });
      return;
    } else {
      temp.templateCont.error = "";
      this.setState({
        formControls: temp,
        canTestSmsCr: true,
      });
    }
  }

  closeConf() {
    this.setState({
      canTestSms: false,
      showDsChangeConf: false,
      showLangChangeConf: false,
      canTestSmsCr: false,
    });
  }

  sendTestSms() {
    let val = document.getElementById("cstmMob").value;
    if (!val || (val && val.length < 10)) {
      ToastsStore.error("Please enter a valid Mobile Number.", 4000);
      return;
    }
    let temp = this.state.formControls;
    this.setState({
      submitLoader: true,
    });
    let body = {
      content: temp.templateCont.value,
      senderCode: document.querySelector("[name=senderId]").selectedOptions[0]
        .innerText,
      receiverMobile: val,
      type: "CRECV",
    };
    sendTestSmsApi(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          ToastsStore.success(data.message);
          this.closeConf();
        } else {
          ToastsStore.error(data.message);
        }
        this.setState({
          submitLoader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
        this.setState({
          submitLoader: false,
        });
      });
  }

  sendTestMessagePro() {
    let temp = this.state.formControls;
    this.setState({
      submitLoader: true,
    });
    let body = {
      content: temp.templateCont.value,
      audienceGroupId: this.state.formControls.audienceGrId.value
        ? this.state.formControls.audienceGrId.value
        : null,
      senderId: this.state.formControls.senderId.value
        ? this.state.formControls.senderId.value
        : null,
      longUrl: this.state.formControls.audienceGrId.value
        ? this.state.formControls.longurl.value
        : null,
      uniqueTrackingEnabled: this.state.formControls.audienceGrId.value
        ? true
        : null,
    };
    sendTestSmsPro(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          ToastsStore.success(data.message);
          this.closeConf();
        } else {
          ToastsStore.error(data.message);
        }
        this.setState({
          submitLoader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
        this.setState({
          submitLoader: false,
        });
      });
  }

  showVideo() {
    this.setState({
      howTo: !this.state.howTo,
    });
    console.log(this.state.howTo);
  }
  showWhatsappVideo() {
    this.setState((state) => {
      return {
        showWhatsApp: !state.showWhatsApp,
      };
    });
  }
  getCustomId() {
    let d = this.state.formControls;
    d.ccid.loading = true;
    this.setState({
      formControls: d,
    });
    getCcId({})
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          d.ccid.value = data.customCampaignId;
          d.ccid.loading = false;
          d.ccid.error = "";
          this.setState({
            formControls: d,
          });
        } else {
          d.ccid.loading = false;
          d.ccid.error = data.message;
          this.setState({
            formControls: d,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
        d.ccid.loading = false;
        this.setState({
          formControls: d,
        });
      });
  }

  eventType(data) {
    let arr = [];
    if (data && data.length > 0) {
      data.forEach((e) => {
        if (e === "SMS Pro") {
          let obj = {
            value: "SMS",
            label: "SMS Pro",
          };
          arr.push(obj);
        } else {
          let obj = {
            value: e,
            label: e,
          };
          arr.push(obj);
        }
      });
    }
    return arr;
  }

  /* ########## WhatsApp Medium ############*/
  templateWhatsApp(event) {
    let v = event.target.value;
    this.setState((state) => {
      return {
        formControls: {
          ...state.formControls,
          templateCont: {
            ...state.formControls.templateCont,
            value: v,
          },
        },
      };
    });
  }

  toggleLoader() {
    this.setState((state) => {
      return {
        submitLoader: !state.submitLoader,
      };
    });
  }

  handleImageUpload(img, type, name, imgType) {
    var formData = new FormData();
    formData.append("type", "Campaign");
    formData.append("file", img);
    formData.append("fileName", name);
    formData.append("mediaType", type);
    this.setState({
      submitLoader: true,
      mediaType: type,
    });

    imageUpload(formData)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          ToastsStore.success(data.message);
          if (imgType === "DP") {
            this.setState((state) => {
              return {
                formControls: {
                  ...state.formControls,
                  dpURL: {
                    ...state.formControls.dpURL,
                    value: data.url,
                  },
                },
                dpPath: data.path,
              };
            });
          } else if (imgType === "Content") {
            this.setState({
              mediaPath: data.path,
            });
            this.setState((state) => {
              return {
                formControls: {
                  ...state.formControls,
                  contentMediaUrl: {
                    ...state.formControls.contentMediaUrl,
                    value: data.url,  
                  },
                },
                dpPath: data.path,
              };
            });
          }
        } else {
          ToastsStore.error(data.message);
        }
        this.setState({
          submitLoader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later");
      });
  }

  handleUpload(img, type, imgType) {
    // let data = img.replace()
    // var buf = new Buffer(img,base64);

    this.setState({
      submitLoader: true,
      mediaType: type,
    });
    var formData = new FormData();
    formData.append("type", "Campaign");
    formData.append("file", img);
    formData.append("mediaType", type);

    videoUpload(formData)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          ToastsStore.success(data.message);
          if (imgType === "DP") {
            this.setState((state) => {
              return {
                formControls: {
                  ...state.formControls,
                  dpURL: {
                    ...state.formControls.dpURL,
                    value: data.url,
                  },
                },
                dpPath: data.path,
              };
            });
          } else if (imgType === "Content") {
            this.setState((state) => {
              return {
                formControls: {
                  ...state.formControls,
                  contentMediaUrl: {
                    ...state.formControls.contentMediaUrl,
                    value: data.url,
                  },
                },
                mediaPath: data.path,
              };
            });
          }
        } else {
          ToastsStore.error(data.message);
        }
        this.setState({
          submitLoader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitLoader: false,
        });
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  render() {
    return (
      <section className="wrapper-container">
        {this.state.campType === "GENERIC" &&
          parseInt(this.state.formControls.medium.value) === 1 && (
            <div style={{ textAlign: "end" }}>
              <i
                className="youtube large icon"
                style={{ color: "#ff0201" }}
              ></i>
              <span
                className="pointer text--bold text--underline"
                style={{ color: "#4183c4", textAlign: "end" }}
                onClick={() => {
                  this.showVideo();
                }}
              >
                How to Create an SMS Campaign ?
              </span>
            </div>
          )}
        {this.state.howTo && (
          <Popup
            title={"How to Create an SMS Campaign ?"}
            togglePopup={this.showVideo.bind(this)}
          >
            <Youtube url={"XzvIWjHD_D8"} />
          </Popup>
        )}
        {this.state.campType === "WhatsApp" && (
          <div style={{ textAlign: "end" }}>
            <i className="youtube large icon" style={{ color: "#ff0201" }}></i>
            <span
              className="pointer text--bold text--underline"
              style={{ color: "#4183c4", textlign: "end" }}
              onClick={this.showWhatsappVideo.bind(this)}
            >
              How to Create WhatsApp Campaign ?
            </span>
          </div>
        )}
        {this.state.showWhatsApp && (
          <Popup
            title={"How to Create WhatsApp Campaign ?"}
            togglePopup={this.showWhatsappVideo.bind(this)}
          >
            <Youtube url={"7HiJwBkGqgw"} />
          </Popup>
        )}

        <CreateNewCampaignHeader
          mediums={this.state.mediums}
          datasource={this.state.datasources}
          onMediumChange={this.onMediumChange.bind(this)}
          formControls={this.state.formControls}
          ammId={this.state.ammId}
          type={this.state.campType}
          typeChangeHandler={this.typeChangeHandler.bind(this)}
          isEdit={this.props.location.pathname === "/edit-campaign"}
          onDatasourceChangeHandler={this.onDatasourceChangeHandler.bind(this)}
          //clickHandler={this.clickHandler}
          eventType={this.eventType.bind(this)}
          changeHandler={this.changeHandler}
        />
        {this.state.campType === "LEAD" && (
          <React.Fragment>
            <CeareNewCampaignProcess
              changeHandler={this.changeHandler.bind(this)}
              formControls={this.state.formControls}
              templates={this.state.templates}
              senderIds={this.state.senderIds}
              dobChange={this.dateChange.bind(this)}
              shortUrl={this.state.shortUrl}
              type={this.state.campType}
              minCount={
                this.state.segmentInfo
                  ? this.state.segmentInfo.minCampaignCount
                  : null
              }
              statusGroups={this.state.statusGroups}
              shortUrlLoader={this.state.shortUrlLoader}
              smsChangeHandler={this.smsChangeHandler.bind(this)}
              createShortUrl={this.createShortUrl.bind(this)}
              contentHandler={this.contentHandler.bind(this)}
              messageNum={this.state.messageNum}
              canTestSms={this.canTestSms.bind(this)}
              langChangeHandle={this.langChangeHandle.bind(this)}
              getCustomId={this.getCustomId.bind(this)}
              copyUrl={this.copyUrl.bind(this)}
            />
            {!this.state.submitLoader && (
              <div
                className="flex margin-left--auto margin-right--auto"
                style={{ width: "42%" }}
              >
                {this.props.location.pathname === "/edit-campaign" && (
                  <button
                    onClick={() => this.editLeadCamp(true)}
                    className="ui big twitter button"
                  >
                    Save as Draft
                  </button>
                )}
                {(this.props.location.pathname === "/campaign-create" ||
                  this.props.location.pathname === "/clone-campaign") && (
                  <button
                    onClick={() => this.submitLeadCamp(true)}
                    className="ui big twitter button"
                  >
                    Save as Draft
                  </button>
                )}
                {this.props.location.pathname === "/edit-campaign" && (
                  <button
                    onClick={() => this.editLeadCamp(false)}
                    className="ui big green button"
                  >
                    Save Changes
                  </button>
                )}
                {(this.props.location.pathname === "/campaign-create" ||
                  this.props.location.pathname === "/clone-campaign") && (
                  <button
                    onClick={() => this.submitLeadCamp(false)}
                    className="ui big green button"
                  >
                    Submit Campaign
                  </button>
                )}
              </div>
            )}
            {/*
                                          this.state.submitLoader &&
                                          <div className="flex col-2 margin-left--auto margin-right--auto">
                                                <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                          </div>
                                    */}
          </React.Fragment>
        )}
        {this.state.campType === "GENERIC" && (
          <React.Fragment>
            {this.state.showDisc && (
              <div className="ui negative message">
                <div className="header">No Sender Id&#x27;s Available.</div>
                <p>
                  Please get a Sender Id to create SMS or MMS campaign.
                  <span
                    style={{ fontSize: "15px", textDecoration: "underline" }}
                  >
                    <Link to="/sender-ids">Get Sender ID</Link>
                  </span>
                </p>
              </div>
            )}
            {this.state.displayCampaignFilter && (
              <div>
                <CeareNewCampaignProcess
                  changeHandler={this.changeHandler.bind(this)}
                  formControls={this.state.formControls}
                  templates={this.state.templates}
                  senderIds={this.state.senderIds}
                  dobChange={this.dateChange.bind(this)}
                  shortUrl={this.state.shortUrl}
                  type={this.state.campType}
                  minCount={
                    this.state.segmentInfo
                      ? this.state.segmentInfo.minCampaignCount
                      : null
                  }
                  shortUrlLoader={this.state.shortUrlLoader}
                  smsChangeHandler={this.smsChangeHandler.bind(this)}
                  createShortUrl={this.createShortUrl.bind(this)}
                  contentHandler={this.contentHandler.bind(this)}
                  messageNum={this.state.messageNum}
                  canTestSms={this.canTestSmsCr.bind(this)}
                  langChangeHandle={this.langChangeHandle.bind(this)}
                  copyUrl={this.copyUrl.bind(this)}
                  handleImageUpload={this.handleImageUpload.bind(this)}
                  toggleLoader={this.toggleLoader.bind(this)}
                  handleUpload={this.handleUpload.bind(this)}
                  templateWhatsApp={this.templateWhatsApp.bind(this)}
                  mediaType={this.state.mediaType}
                />

                <div className="ui segment">
                  <div className="margin-btm--double">
                    <h4 className="ui dividing header">
                      CAMPAIGN FILTERS
                      <span
                        style={{ fontSize: "12px", color: "rgba(0,0,0,0.54)" }}
                      >
                        (Select the Campaign Filters based on the type of the
                        audience you want to target.)
                      </span>
                    </h4>
                  </div>
                  {this.state.campaignSegmentDetail &&
                    this.state.campaignSegmentDetail.length > 0 &&
                    this.state.campaignSegmentDetail.map((item, index) => {
                      return (
                        <React.Fragment>
                          <div
                            key={index}
                            className="flex col-20 flex-direction--row flex-wrap flex-align--center"
                          >
                            <div className="col-4 padding-left padding-right text--bold text--center text--darker truncate">
                              {item.icon && (
                                <span className="margin-right--quar">
                                  <i
                                    aria-hidden="true"
                                    className={`${item.icon} icon`}
                                  ></i>
                                </span>
                              )}
                              {item.title}
                            </div>
                            <div className="col-10">
                              {item.segmentType === "RNG" && (
                                <div style={{ padding: "36px 32px 36px 8px" }}>
                                  <InputRange
                                    draggableTrack
                                    maxValue={item.values.maxValue}
                                    minValue={item.values.minValue}
                                    onChange={(value) => {
                                      this.filtersChangeHandler(value, index);
                                    }}
                                    value={item.value}
                                  />
                                </div>
                              )}
                              {item.segmentType === "TXT" && (
                                <div className="pad--half">
                                  <div className="col-20">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Type here..."
                                      name={item.title}
                                      value={item.value}
                                      onChange={(event) => {
                                        this.filtersChangeHandler(event, index);
                                      }}
                                    ></input>
                                  </div>
                                </div>
                              )}
                              {item.segmentType === "RDO" && (
                                <div className="flex flex-direction--col pad">
                                  {item.values &&
                                    item.values.segmentValuesList &&
                                    item.values.segmentValuesList.length > 0 &&
                                    item.values.segmentValuesList.map(
                                      (subItem, subIndex) => {
                                        return (
                                          <div
                                            className={`ui radio checkbox ${
                                              subIndex !==
                                              item.values.segmentValuesList
                                                .length -
                                                1
                                                ? "margin-btm"
                                                : ""
                                            }`}
                                            key={subIndex}
                                          >
                                            <input
                                              type="radio"
                                              name={item.title}
                                              value={subItem.value}
                                              checked={subItem.checked}
                                              onChange={(event) => {
                                                this.filtersChangeHandler(
                                                  event,
                                                  index,
                                                  subIndex
                                                );
                                              }}
                                            />
                                            <label>{subItem.value}</label>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              )}
                              {item.segmentType === "MUL" && (
                                <div
                                  className="pad--half"
                                  style={{ width: "92%" }}
                                >
                                  <Select
                                    isClearable={true}
                                    isMulti
                                    isRtl={false}
                                    isSearchable={true}
                                    name={item.title}
                                    value={item.value}
                                    onChange={(event) => {
                                      this.multiSelectChange(event, index);
                                    }}
                                    options={item.values.segmentValuesList}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="col-3 text--center">
                              <div
                                className="margin-btm--quar text--capitalize text--darker"
                                style={{ fontSize: "15px" }}
                              >
                                {item.subscriptionType}
                              </div>
                              {item.subscriptionType === "premium" && (
                                <span
                                  className="text--darker text--capitalize"
                                  style={{ fontSize: "15px" }}
                                >
                                  &#8377; {item.price}
                                </span>
                              )}
                            </div>
                            <div className="col-1">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  style={{ height: "18px", width: "18px" }}
                                  onChange={(event) => {
                                    this.selectFilter(event, index);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          {/* <div className="col-1">
                                                                                    <label>
                                                                                          <input type="checkbox"
                                                                                                checked={item.checked}
                                                                                                style={{height:'18px',width:'18px'}}
                                                                                                onChange={event => {this.selectFilter(event,index)}}
                                                                                          />
                                                                                    </label>
                                                                              </div> */}
                          {/* </div> */}
                          <div className="bdr-btm col-18 margin-btm margin-left--auto margin-right--auto">
                            &nbsp;
                          </div>
                        </React.Fragment>
                      );
                    })}
                </div>
                {!this.state.submitLoader && (
                  <div
                    className="flex margin-left--auto margin-right--auto"
                    style={
                      utils.isMobile
                        ? { width: "42%", marginLeft: "20%" }
                        : { width: "42%" }
                    }
                  >
                    {this.props.location.pathname === "/edit-campaign" && (
                      <button
                        onClick={() => this.editCampaignData(true)}
                        className="ui big twitter button"
                      >
                        Save as Draft
                      </button>
                    )}
                    {(this.props.location.pathname === "/campaign-create" ||
                      this.props.location.pathname === "/clone-campaign") && (
                      <button
                        onClick={() => this.submitData(true)}
                        className="ui big twitter button"
                      >
                        Save as Draft
                      </button>
                    )}
                    {/*
                                                            this.props.location.pathname === '/edit-campaign' &&
                                                            <button onClick={()=>this.editCampaignData(false)} className="ui big green button">Save Changes</button>                               
                                                      */}
                    {(this.props.location.pathname === "/campaign-create" ||
                      this.props.location.pathname === "/clone-campaign" ||
                      this.props.location.pathname === "/edit-campaign") && (
                      <button
                        onClick={() => this.computeDetails()}
                        className="ui big green button"
                      >
                        Submit Campaign
                      </button>
                    )}
                  </div>
                )}

                {this.state.submitLoader && (
                  <div className="flex col-2 margin-left--auto margin-right--auto">
                    <CircularLoader
                      stroke={"#0c73a5"}
                      size={"36"}
                      buttonSize={"50px"}
                    ></CircularLoader>
                  </div>
                )}
              </div>
            )}
            {this.state.showBillingDetails && (
              <Popup
                title={"Billing Details"}
                togglePopup={this.closeAction.bind(this)}
              >
                <CampaignBillingDetails
                  info={this.state.segmentInfo}
                  formControls={this.state.formControls}
                  basicFilters={this.getBasicFilters()}
                  premiumFilters={this.getPremiumFilters()}
                  back={this.closeAction.bind(this)}
                  submit={
                    this.props.location.pathname === "/edit-campaign"
                      ? this.editCampaignData.bind(this)
                      : this.submitData.bind(this)
                  }
                  pay={this.payAndSubmit.bind(this)}
                  campSubmitErr={this.state.campSubmitErr}
                  submitLoader={this.state.submitLoader}
                ></CampaignBillingDetails>
              </Popup>
            )}
          </React.Fragment>
        )}
        {/* {
                              this.state.campType === "GENERIC" && parseInt(this.state.formControls.medium.value) === 8 &&
                              <GenericWhatsApp />
                        } */}
        {this.state.campType === "SMS" && (
          <React.Fragment>
            <CreateNewCampaignProcessSMS
              senderIds={this.state.senderIds}
              changeHandler={this.changeHandler.bind(this)}
              formControls={this.state.formControls}
              // langChangeHandle={this.langChangeHandle.bind(this)}
            />
            <CreateNewCampaignHeaderSMS
              groupNameList={this.state.groupNameList}
              addURL={this.addURL.bind(this)}
              changeHandler={this.changeHandler.bind(this)}
              formControls={this.state.formControls}
              contentHandler={this.contentHandler.bind(this)}
              canTestSms={this.canTestSms.bind(this)}
              smsChangeHandler={this.smsChangeHandler.bind(this)}
              templates={this.state.templates}
              messageNum={this.state.messageNum}
              loadData={this.loadData}
              dobChange={this.dateChange.bind(this)}
              audienceData={this.state.audienceData}
              audienceChangeHandler={this.audienceChangeHandler.bind(this)}
              checkedHandler={this.checkedHandler.bind(this)}
              clickHandler={this.clickHandler.bind(this)}
              fetchGroupNames={this.fetchGroupNames.bind(this)}
              langChangeHandle={this.langChangeHandle.bind(this)}
            />
            <div
              className="margin-left--auto margin-right--auto margin-top--double"
              style={{ width: "20%" }}
            >
              <button
                onClick={() => this.validateSMS()}
                className="ui big green button"
                disabled={this.state.smsCampErr ? true : null}
              >
                Submit Campaign
              </button>
            </div>
            {this.state.smsCampErr && (
              <Popup
                title="Error Message"
                togglePopup={() => {
                  this.setState({ smsCampErr: null });
                }}
              >
                <section className="pad">
                  <p style={{ color: "red" }}>{this.state.smsCampErr}</p>
                  <article className="flex align-space-between">
                    <button
                      onClick={() => {
                        this.setState({ smsCampErr: null });
                      }}
                      className="btn btn-fill"
                    >
                      Close
                    </button>
                    <Link
                      to={{
                        pathname: "/service/package",
                        search: `service=${this.state.serviceType}`,
                      }}
                    >
                      <button className="btn btn-fill btn-green">
                        Buy Package
                      </button>
                    </Link>
                  </article>
                </section>
              </Popup>
            )}
            {/* {
                                          this.state.showValidSMS &&
                                          <Popup title="Valid SMS Count" togglePopup={()=>this.toggleValidSMS()}>
                                                <div className="senderId-modal--wrapper flex flex-direction--col">
                                                      <p className="label">SMS will be sent to only valid mobile.</p>
                                                      <p className="label">Number of valid mobile is <i>{this.state.formControls.validMobile.value}</i></p>
                                                      <p className="label">Wanted to send/target less number of audience? Decrease value to:<input type="number" name="targetAudienceCount" value={this.state.formControls.targetAudienceCount.value}
                                                       onChange={this.targetCountChangeHandler.bind(this)}
                                                     /></p>
                                                      <div className="margin-top--half margin-btm--half">
                                                            <button className="btn btn-fill btn-danger" onClick={()=>this.toggleValidSMS()}>CANCEL</button>
                                                            <button className="btn btn-fill btn-success margin-left--half" onClick={()=>this.submitData(false,"SMS")}>PROCEED</button>
                                                      </div>
                                                </div>
                                          </Popup>
                                    } */}
            {this.state.showBillingDetails && (
              <Popup
                title={"Billing Details"}
                togglePopup={this.closeAction.bind(this)}
              >
                <SmsProBilling
                  pricePerUnit={this.state.pricePerUnit}
                  creditToBeUsed={this.state.creditToBeUsed}
                  availableCredit={this.state.availableCredit}
                  count={this.state.formControls.validMobile.value}
                  back={this.closeAction.bind(this)}
                  submit={this.submitData.bind(this)}
                  // pay={this.payAndSubmit.bind(this)}
                  campSubmitErr={this.state.campSubmitErr}
                  submitLoader={this.state.submitLoader}
                ></SmsProBilling>
              </Popup>
            )}
          </React.Fragment>
        )}
        {this.state.canTestSms && (
          <Popup
            title={"Send Test SMS"}
            togglePopup={this.closeConf.bind(this)}
          >
            <div className="pad" style={{ fontSize: "14px" }}>
              <span>Are you sure you want to send Test SMS</span>&nbsp;
              <span className="text--bold text-dropped">
                (This test message will be chargeable)
              </span>
            </div>
            <div className="col-20 flex flex-horz-center flex-wrap pad">
              {!this.state.submitLoader && (
                <React.Fragment>
                  <div className="col-4">
                    <button
                      className="ui grey button"
                      style={{ width: "100%" }}
                      onClick={() => this.closeConf()}
                    >
                      
                      Back
                    </button>
                  </div>
                  <div className="margin-left">
                    <button
                      className="ui green button"
                      style={{ width: "100%" }}
                      onClick={() => this.sendTestMessagePro()}
                    >
                      
                      Send Test SMS
                    </button>
                  </div>
                </React.Fragment>
              )}
              {this.state.submitLoader && (
                <CircularLoader
                  stroke={"#0c73a5"}
                  size={"36"}
                  buttonSize={"50px"}
                ></CircularLoader>
              )}
            </div>
          </Popup>
        )}
        {this.state.canTestSmsCr && (
          <Popup
            title={"Send Test SMS"}
            togglePopup={this.closeConf.bind(this)}
          >
            <div className="padding-top" style={{ fontSize: "14px" }}>
              <div className="col-10 margin-btm margin-left--auto margin-right--auto">
                <div className="label" style={{ textAlign: "left" }}>
                  Mobile Number
                </div>
                <input
                  type="number"
                  placeholder="Enter 10 Digit Mobile Number"
                  style={{ width: "100%" }}
                  id="cstmMob"
                  className="form-control"
                />
              </div>
              <div className="col-10 margin-left--auto margin-right--auto text--bold text--center text-dropped">
                (This test message is chargeable)
              </div>
            </div>
            <div className="col-20 flex flex-horz-center flex-wrap pad">
              {!this.state.submitLoader && (
                <React.Fragment>
                  <div className="col-4">
                    <button
                      className="ui grey button"
                      style={{ width: "100%" }}
                      onClick={() => this.closeConf()}
                    >
                      
                      Back
                    </button>
                  </div>
                  <div className="margin-left">
                    <button
                      className="ui green button"
                      style={{ width: "100%" }}
                      onClick={() => this.sendTestSms()}
                    >
                      
                      Send Test SMS
                    </button>
                  </div>
                </React.Fragment>
              )}
              {this.state.submitLoader && (
                <CircularLoader
                  stroke={"#0c73a5"}
                  size={"36"}
                  buttonSize={"50px"}
                ></CircularLoader>
              )}
            </div>
          </Popup>
        )}
        {this.state.showDsChangeConf && (
          <Popup title={""} togglePopup={this.closeConf.bind(this)}>
            <div
              className="pad text--bold text--center"
              style={{ fontSize: "14px" }}
            >
              <div>
                Please save the campaign before selecting another datasource.
                All Campaign Information will be lost and a new campaign view
                will be opened.
              </div>
              <div>Are you Sure ?</div>
            </div>
            <div className="col-20 flex flex-horz-center flex-wrap pad">
              <div className="col-4">
                <button
                  className="ui grey button"
                  style={{ width: "100%" }}
                  onClick={() => this.closeConf()}
                >
                  
                  Back
                </button>
              </div>
              <div className="margin-left">
                <button
                  className="ui green button"
                  style={{ width: "100%" }}
                  onClick={() => this.continueChngDs()}
                >
                  
                  Yes
                </button>
              </div>
            </div>
          </Popup>
        )}
        {this.state.showLangChangeConf && (
          <Popup title={""} togglePopup={this.closeConf.bind(this)}>
            <div
              className="pad text--bold text--center"
              style={{ fontSize: "14px" }}
            >
              <div>
                SMS Content Section will become blank on changing Language.
              </div>
              <div>Do you still want to change the language ?</div>
            </div>
            <div className="col-20 flex flex-horz-center flex-wrap pad">
              <div className="col-4">
                <button
                  className="ui grey button"
                  style={{ width: "100%" }}
                  onClick={() => this.closeConf()}
                >
                  
                  Back
                </button>
              </div>
              <div className="margin-left">
                <button
                  className="ui green button"
                  style={{ width: "100%" }}
                  onClick={() => this.clearLangData()}
                >
                  
                  Yes
                </button>
              </div>
            </div>
          </Popup>
        )}
        <ToastsContainer
          position={ToastsContainerPosition.TOP_RIGHT}
          lightBackground
          store={ToastsStore}
        />
        <form
          action="/payment/make"
          method="post"
          id="paymentForm"
          style={{ display: "none" }}
        >
          <input type="hidden" name="source" value="PAYTM" />
          <input type="hidden" id="form-amount" name="amount" value="" />
          <input type="hidden" id="form-walletId" name="walletId" value="" />
          <input type="hidden" id="form-refCode" name="refCode" value="" />
          <input
            type="hidden"
            id="form-refType"
            name="refType"
            value="CAMPAIGN_CODE"
          />
        </form>

        {this.state.campType === "WhatsApp" && <CampaignWhatsApp />}
      </section>
    );
  }
}

export default CreateNewCampaign;

// this.submitData(false)
