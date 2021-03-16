import React, { useState, useEffect } from "react";
import CampaignAudienceForm from "../../Components/Campaign/automationcampaign/CampaignAudienceForm";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { useStep } from "react-hooks-helper";
import { getTags, postTags } from "../../Services/tag-service";
import { getSenderIds } from "../../Services/senderId-service";
import {searchSegments} from "../../Services/segment-service"
// import SegmentForm from "./Segment-Container";
import SelectAutomationType from "../../Components/Campaign/automationcampaign/SelectAutomationType";
import CampaignPreview from "../../Components/Campaign/automationcampaign/CampaignPreview";
import CampaignWhenTemplate from "../../Components/Campaign/automationcampaign/CampaignWhenTemplate";
import CampaignMessage from "../../Components/Campaign/automationcampaign/CampaignMessage";

const CampaignForm = (prop) => {
  // console.log("hrllo" + prop);
  const [FormData, setFormData] = useState({
    campaignName: "",
    tagIds: [],
    campaignScheduleType: "ONETIME",
    campaignDesc: "",
    audienceType: "",
    journeySegmentIds: [],
    deliveryTime: "",
    startType: "0",
    endType: "0",
    startDate: "",
    startTimeInterval: "",
    endDate: "",
    endTimeInterval: "",
    content: "",
    tagName: "",
    lang: "",
    longUrl: "",
    notificationType: "",
    subject: "uiu",
    templateId: "1",
    replyToStatus: false,
    bccStatus: false,
    ccStatus: false,
    replyTo: "",
    cc: "",
    bcc: "",
    frequency: "",
    frequencyUnit: "",
    time: "",
    weekday: "TUE",
  });
  const steps = [
    // { id: "campaignType" },
    { id: "audience" },
    { id: "when" },
    { id: "message" },
    { id: "preview" },
    // { id: "submit" },
  ];

  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const [currentData, setCurrentData] = useState({
    tags: [],
    senderIds:[],
    segment:[]
  });
  const [selectedTags, setSelectedTags] = useState([]);
  var [select, setSelect] = useState([]);

  const [FormDataError, setFormDataError] = useState({
    campaignName: "",
    tagIds: "",
    campaignScheduleType: "",
    campaignDesc: "",
    audienceType: "",
    journeySegmentIds: "",
  });

  useEffect(() => {
    fetchTags();
    fetchSenderIds();
    fetchSegment();
  }, []);

  const validate = () => {
    var campaignName = "";
    var tagIds = "";
    var campaignScheduleType = "";
    var campaignDesc = "";
    var audienceType = "";
    var journeySegmentIds = "";

    let val = 1;
    if (!FormData.campaignName) {
      campaignName = "Campaign Name should not be empty";
      val = 0;
    }
    if (FormData.tagIds.length === 0) {
      tagIds = "Campaign Tags should not be empty";
      val = 0;
    }
    if (!FormData.campaignScheduleType) {
      campaignScheduleType = "Campaign Type should not be empty";
      val = 0;
    }
    if (!FormData.campaignDesc) {
      campaignDesc = "Description should not be empty";
      val = 0;
    }

    if (!FormData.audienceType) {
      audienceType = "Audience Type should not be empty";
      val = 0;
    }

    if (FormData.journeySegmentIds.length == 0) {
      journeySegmentIds = "Select minimum 1 segement";
      val = 0;
    }

    setFormDataError({
      campaignName: campaignName,
      tagIds: tagIds,
      campaignScheduleType: campaignScheduleType,
      campaignDesc: campaignDesc,
      audienceType: audienceType,
      journeySegmentIds: journeySegmentIds,
    });

    return val;
  };

  function fetchTags() {
    let body = {
      name: "",
    };
    getTags(body)
      .then((response) => response.json())
      .then((data) => {
        if(data.success){
          if (data.tags.length > 0) {
            console.log(data.tags)
            setCurrentData({
          tags: data.tags.map((tag) => {
            return { value: tag.id, label: tag.name };
          }),
        });
      } else {
        setCurrentData({ tags: "no tags found" });
      }
        }
        
      })
      .catch((error) => {
        // console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }
  
  const submitTags = () => {
    addTag();
  };
  function addTag() {
    let body = {
      name: FormData.tagName,
    };
    postTags(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchTags();
          ToastsStore.success("Tag created successfully");
        } else {
          ToastsStore.error("Unable to create tags");
        }
      })
      .catch((error) => {
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  function fetchSenderIds() {
    getSenderIds()
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if (data.senderIds.length > 0) {
            setCurrentData({
              senderIds: data.senderIds.map((sender) => {
                return { value: sender.id, label: sender.senderCode };
              })
            })
           }
           else{
             setCurrentData.senderIds('no sender id found')
           }
        }
      })
      .catch((error) => {
        console.log(error);
     });
  }
  
  function fetchSegment(){
    let body={
        "bUid": "string"
    }
    searchSegments(body)
      .then((response) =>  response.json())
        .then((data) => {
        console.log("segment",data)
        if (data.success) {
          if (data.segments.length > 0) {
            setCurrentData({
              segment: data.segments.map((segment) => {
                return { value: segment.id, label: segment.name };
              })
            })
          }
           else{
             setCurrentData.segment('no segment found')
           }
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const timeOption = [
    { label: "9:00  - 11:00", value: "9:00  - 11:00" },
    { label: "11:00 - 13:00", value: "11:00 - 13:00" },
    { label: "13:00 - 15:00", value: "13:00 - 15:00" },
    { label: "15:00 - 17:00", value: "15:00 - 17:00" },
    { label: "17:00 - 19:00", value: "17:00 - 19:00" },
    { label: "19:00 - 21:00", value: "19:00 - 21:00" },
  ];

  const changeHandler = (e) => {
    if(e.target.name == 'deliveryTime'){
      if(e.target.value == 0){
        console.log("hello")
        var d=new Date()
        console.log(d)
        setFormData({deliveryTime:new Date()})
      }
    }
    console.log(e.target.value);
    setFormData({ ...FormData, [e.target.name]: e.target.value });
    console.log(FormData)
  };

  const handleTags = (selectedTags) => {
    select = selectedTags.map((selected) => {
      return selected.value;
    });
    // console.log(select);
    FormData.tagIds = select;
  };

  const submitHandler = () => {
    const isValid = validate();
    // ToastsStore.success("Datasource created Successfully !");
    if (isValid) {
      navigation.next()
    }
  };
  const handleSegment = (selectedSegements) => {
    var select = selectedSegements.map((selected) => {
      return selected.value;
    });
    FormData.journeySegmentIds = select;
  };

  const props = {
    setFormData,
    submitTags,
    timeOption,
    submitHandler,
    FormDataError,
    handleTags,
    handleSegment,
    FormData,
    currentData,
    changeHandler,
    selectedTags,
    navigation,
  };

  switch (step.id) {
    // case "campaignType":
    //  return <SelectAutomationType {...props} />;
    case "audience":
      return <CampaignAudienceForm {...props} />;
    case "when":
      return <CampaignWhenTemplate {...props} />;
    case "message":
      return <CampaignMessage {...props} />;
    case "preview":
      return <CampaignPreview {...props} />;
    case "submit":
    //   return <Submit {...props} />;
  }
  return <div>{/* <CampaignAudienceForm {...props} /> */}</div>;
};
export default CampaignForm;
