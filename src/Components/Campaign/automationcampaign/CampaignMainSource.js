import React from "react";
import { useStep } from "react-hooks-helper";
import CampaignWhenTemplate from "./CampaignWhenTemplate";
import CampaignAudienceForm from "./CampaignAudienceForm";
import CampaignForm from "../../../Containers/Campaign/CreateCampaign"
import CampaignMessage from "./CampaignMessage";
import CampaignPreview from "./CampaignPreview";

const steps = [
  { id: "audience" },
  { id: "when" },
  { id: "message" },
  { id: "preview" },
  // { id: "submit" },
];

function CampaignMainSource() {
  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const props = { navigation };

  switch (step.id) {
    case "audience":
      return <CampaignForm {...props} />;
    case "when":
      return <CampaignWhenTemplate {...props} />;
    case "message":
      return <CampaignMessage {...props} />;
    case "preview":
      return <CampaignPreview {...props} />;
    case "submit":
    //   return <Submit {...props} />;
  }
  return <div></div>;
}

export default CampaignMainSource;
