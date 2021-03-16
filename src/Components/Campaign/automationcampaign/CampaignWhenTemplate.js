import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Dropdown,
  Form,
  Header,
  Button,
  Segment,
  Ref,
  Input,
  Radio,
  TextArea,
} from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";

import Onetime from "./CampaignOneTime";
import Triggered from "./CampaignTrigger";
import Recurring from "./CampaignRecurring";
// import "./when.css";
const animatedComponents = makeAnimated();

const CampaignWhenTemplate = (props) => {
  const {
    FormData,
    tagsOption,
    timeOption,
    timeHandler,
    FormDataError,
    changeHandler,
    submitHandler,
    navigation,
  } = props;
  return (
    <>    
    <div className="container">
        <div className="row">
        <div className="col-sm-12">  
        <div className="shadow p-0">
      <Header as="h3" attached="top" >
          Create New Campaign
        </Header>
          <Segment attached>
            <div className="ui big breadcrumb">
              <a className="section"> Audience </a>
              <i className="right chevron icon divider"> </i>
              <a className="active-nav"> When </a>
              <i className="right chevron icon divider"> </i>
              <a className="section"> Message </a>
              <i className="right chevron icon divider"> </i>
              <a className="section"> Preview & Launch </a>
            </div>
          </Segment>
          </div>
         
      </div>
          <div className="col-sm-12">
         
          <div className="when-card bg-white my-3 shadow border-0">
          <Header as="h3" attached="top" className="when-header">
          Campaign Type & Schedule
        </Header>
            <Form onSubmit={submitHandler}>
              <Form.Field inline>
                <div className="mb-3 row">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-3 mt-5"
                  >
                    Campaign Type
                  </label>
                  <div className="col-sm-6 mt-4">
                    <input
                      type="radio"
                      label="One time"
                      className="mr-1"
                      name="campaignScheduleType"
                      value="ONETIME"
                      checked={FormData.campaignScheduleType === "ONETIME"}
                      onChange={changeHandler}
                    />
                    <label className="radio-label">One Time</label>
                    <br />
                    <input
                      type="radio"
                      className="mr-1"
                      label="Triggered"
                      name="campaignScheduleType"
                      value="TRIGGERED"
                      checked={FormData.campaignScheduleType === "TRIGGERED"}
                      onChange={changeHandler}
                    />
                    <label className="radio-label">Triggered</label>
                    <br />
                    <input
                      type="radio"
                      className="mr-1"
                      name="campaignScheduleType"
                      value="RECURRING"
                      checked={FormData.campaignScheduleType === "RECURRING"}
                      onChange={changeHandler}
                    />

                    <label className="radio-label">Recurring</label>
                    {!FormData.campaignScheduleType ? (
                      <small className="text-danger" className="text-danger">
                        {FormDataError.campaignScheduleType}
                      </small>
                    ) : null}
                  </div>
                </div>
              </Form.Field>
              {FormData.campaignScheduleType == "ONETIME" ? (
                <div>
                  <Onetime {...props} />
                </div>
              ) : null}
              {/* triggered  */}
              {FormData.campaignScheduleType == "TRIGGERED" ? (
                <div>
                  <Triggered {...props} />
                </div>
              ) : (
                ""
              )}
              {FormData.campaignScheduleType === "RECURRING" ? (
                <div>
                  <Recurring {...props} />
                </div>
              ) : (
                ""
              )}
              <br />
              <div className="form-btn">
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
            </Form>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CampaignWhenTemplate;
