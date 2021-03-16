import React from "react";
import { Header, Form, Button, Segment } from "semantic-ui-react";
// import "./preview.css";
const CampaignPreview = (props) => {
  const { FormData, navigation } = props;
  console.log(props)
  return (
    <div>
      <div className="container">
       
        <div className="heading p-0">
          <Header as="h3" attached="top">
            Create New Campaign
          </Header>
          <Segment attached>
            <div className="ui big breadcrumb">
              <a className="section"> Audience </a>
              <i className="right chevron icon divider"> </i>
              <a className="section"> When </a>
              <i className="right chevron icon divider"> </i>
              <a className="section"> Message </a>
              <i className="right chevron icon divider"> </i>
              <a className="active-nav"> Preview & Launch </a>
            </div>
          </Segment>
        </div>
       
        <div className="header">
          <Header as="h2" attached="top" className="shadow bg-white mt-1">
            Audience
          </Header>
        </div>

        <div className="shadow bg-white">
          <Form>
              <div class="form-row">
            
                <div class="form-group col-md-4">
                  <label className="preview-label">Campaign Name :</label>
                  {FormData.campaignName}
                </div>
                <div class="form-group col-md-4">
                  <label className="preview-label">Campaign Type :</label>
                  {FormData.campaignScheduleType}
                </div>
                <div class="form-group col-md-4">
                  <label className="preview-label">Campaign Description :</label>
                  {FormData.campaignDesc}
                </div>
                
          
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label className="preview-label">Audience Type :</label>
                  {FormData.audienceType == 0
                    ? "Single Segment"
                    : "Multiple Segment"}
                </div>
                <div class="form-group col-md-4">
                  <label className="preview-label">Send To :</label>
                  {FormData.campaignScheduleType}
                </div>
              </div>
            
          </Form>
        </div>
      </div>
      <div className="container">
     
          <Header as="h2" attached="top" className="shadow bg-white mt-3">
            When
          </Header>
         
          <div className="shadow bg-white">
          <div class="form-row">
          <div class="form-group col-md-4">
                <label className="preview-label">Campaign Type :</label>
                {FormData.campaignScheduleType}
              </div>

              <div class="form-group col-md-4">
                <label className="preview-label">Delivery Time:</label>
                {FormData.campaignScheduleType}
              </div>
            </div>
           </div>
        </div>
        <div className="container mt-4">
      
          <Header as="h2" attached="top" className="shadow bg-white mt-1">
            Message
          </Header>

          <div className="container bg-white shadow p-0">
            <div className="p-3 bg-light h5">Preview</div>
            <div className="p-5">
              <div className="">
              <p>Hi</p>
            
              No You can reach out to your target audience directly through their whatsapp and increase customer
              loyalty!<br />
              Know more about this Whatsapp marketing.
              </div>
            </div>
          </div>          
           <Button
              variant="contained"
              fullWidth
              color="green"
              style={{ marginTop: "1rem" }}
              onClick={() => navigation.next()}
            >
              Save & Continue
            </Button>
        </div>

    </div>
  );
};

export default CampaignPreview;
