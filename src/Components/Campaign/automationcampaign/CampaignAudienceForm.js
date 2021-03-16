import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";
import SegmentForm from "../../../Containers/Campaign/Segment-Container";
import { CustomSelect, CustomSelectMulti, Menu } from "./CustomSelect";

// import SelectMenu from "./SelectMenu";
import {
  Form,
  Header,
  Button,
  Segment,
  Input,
  TextArea,
} from "semantic-ui-react";
// import "./style.css";
const animatedComponents = makeAnimated();
const CampaignFormTemplate = (props) => {
  console.log("nav :" + props.navigation);
  const {
    currentData,
    submitTags,
    tagName,
    continueAndNext,
    FormData,
    FormDataError,
    options,
    changeHandler,
    handleTags,
    handleSegment,
    submitHandler,
    navigation,
  } = props;

console.log(currentData)
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="shadow p-0">
              <Header as="h3" attached="top">
                Create New Campaign
              </Header>
              <Segment attached>
                <div className="ui big breadcrumb">
                  <a className="active-nav breadcrumb-label">Audience</a>
                  <i className="right chevron icon divider"></i>
                  <a className="section breadcrumb-label">When</a>
                  <i className="right chevron icon divider"></i>
                  <a className="section breadcrumb-label">Message</a>
                  <i className="right chevron icon divider"></i>
                  <a className="section breadcrumb-label">Preview & Launch</a>
                </div>
              </Segment>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="campaign-card bg-white shadow mb-5 border-0">
              <Form onSubmit={submitHandler}>
                <Form.Field inline>
                  <div className="mb-3 row">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-3 form-label"
                    >
                      Campaign Name
                    </label>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        className="form-control-plaintext"
                        id="staticEmail"
                        name="campaignName"
                        value={FormData.campaignName}
                  
                        onChange={changeHandler}
                      />
                      {!FormData.campaignName ? (
                        <small className="text-danger">
                          {FormDataError.campaignName}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Form.Field>
                <Form.Field inline>
                  <div className="mb-3 row">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-3 form-label"
                    >
                      Campaign Tags
                    </label>
                    <div className="col-sm-7">
                      <Select
                        className="cat-input"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue="select"
                        isMulti
                        options={currentData.tags}
                        name="tagIds"
                        onChange={handleTags}
                      />
                      <div className="m-auto">
                        <p className="text-muted">
                          This field is optional.Tags help you analyze Campaign
                          results for a group of campaign that belongs to a tag.
                        </p>
                      </div>
                    </div>
                    <div data-toggle="modal" data-target="#exampleModalCenter">
                      <IoIosAddCircleOutline
                        type="button"
                        color="gray"
                        size="25"
                        className="msg-icon"
                      />
                    </div>
                    <div
                      class="modal fade"
                      id="exampleModalCenter"
                      tabindex="-1"
                      role="dialog"
                      aria-labelledby="exampleModalCenterTitle"
                      aria-hidden="true"
                    >
                      <div
                        class="modal-dialog modal-dialog-centered"
                        role="document"
                      >
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">
                              Add Tags
                            </h5>
                            <button
                              type="button"
                              class="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            <Form.Field>
                              <input
                                type="text"
                                placeholder="add tags.."
                                name="tagName"
                                value={FormData.tagName}
                                onChange={changeHandler}
                              />
                            </Form.Field>
                          </div>
                          <div class="modal-footer">
                            <Button
                              type="button"
                              color="green"
                              className="btn btn-block"
                              onClick={submitTags}
                            >
                             Add Tags 
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form.Field>
                <Form.Field inline>
                  <div className="mb-3 row">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-3 form-label"
                    >
                      Campaign Type
                    </label>
                    <div className="col-sm-2">
                      <label>
                        <input
                          type="radio"
                          label="one time"
                          name="campaignScheduleType"
                          value="ONETIME"
                          className="mr-1"
                          checked={FormData.campaignScheduleType === "ONETIME"}
                          onChange={changeHandler}
                        />
                        One time
                      </label>
                      <br />
                      <label>
                        <input
                          type="radio"
                          label="triggered"
                          name="campaignScheduleType"
                          value="TRIGGERED"
                          className="mr-1"
                          checked={
                            FormData.campaignScheduleType === "TRIGGERED"
                          }
                          onChange={changeHandler}
                        />
                        Triggered
                      </label>
                      <br />
                      <label>
                        <input
                          type="radio"
                          className="btn btn-outline-secondary"
                          label="recurring"
                          className="mr-1"
                          name="campaignScheduleType"
                          value="RECURRING"
                          checked={
                            FormData.campaignScheduleType === "RECURRING"
                          }
                          onChange={changeHandler}
                        />
                        Recurring
                      </label>
                      {!FormData.campaignScheduleType ? (
                        <small className="text-danger" className="text-danger">
                          {FormDataError.campaignScheduleType}
                        </small>
                      ) : null}
                    </div>
                  </div>
                </Form.Field>
                <Form.Field inline>
                  <div className="mb-3 row">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-3 form-label"
                    >
                      Campaign Description
                    </label>
                    <div className="col-sm-8">
                      <TextArea
                        className="text-area"
                        style={{ minHeight: 100, width: 800 }}
                        name="campaignDesc"
                        value={FormData.campaignDesc}
                        onChange={changeHandler}
                      />
                      {!FormData.campaignDesc ? (
                        <small className="text-danger">
                          {FormDataError.campaignDesc}
                        </small>
                      ) : null}
                    </div>
                  </div>
                </Form.Field>
                <Form.Field inline>
                  <div className="mb-3 row">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-3 form-label"
                    >
                      Audience Type
                    </label>
                    <div className="col-sm-8">
                      <label>
                        <input
                          type="radio"
                          label="Send to users in a single segment"
                          name="audienceType"
                          value={"0"}
                          className="mr-1"
                          checked={FormData.audienceType === "0"}
                          onChange={changeHandler}
                        />
                        Send to users in a single segment
                      </label>
                      <br />
                      <label>
                        <input
                          type="radio"
                          label="Send to users in a single segment multiple segment/"
                          className="mr-1"
                          name="audienceType"
                          value={"1"}
                          checked={FormData.audienceType === "1"}
                          onChange={changeHandler}
                        />
                        Send to users in a single segment/multiple segment
                      </label>
                      <br />
                      {!FormData.audienceType ? (
                        <small className="text-danger">
                          {FormDataError.audienceType}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Form.Field>
                <Form.Field inline>
                  <div className="mb-3 row">
                    <label className="col-sm-3 form-label">Send To</label>
                    <div className="col-sm-8">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-sm-8">
                            {FormData.audienceType == 0 ? (
                              <Select
                                placeholder="Select Segment"
                                className="cat-input"
                                options={currentData.segment}
                                style={{ minWidth: 300 }}
                                name="journeySegmentIds"
                                onChange={(e) =>
                                  (FormData.journeySegmentIds = Array.from(e.value))
                                }
                              />
                            ) : (
                              <Select
                                placeholder="Select Segment"
                                className="cat-input"
                                closeMenuOnSelect={false}
                                options={currentData.segment}
                                style={{ minWidth: 300 }}
                                name="journeySegmentIds"
                                isMulti
                                // value={FormData.journeySegmentIds}
                                onChange={handleSegment}
                              />
                            )}

                          </div>
                          <div className="col-sm-4">
                            <SegmentForm {...props} />
                            {FormData.journeySegmentIds.length == 0 ? (
                              <small className="text-danger">
                                {FormDataError.journeySegmentIds}
                              </small>
                            ) : null}
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </Form.Field>
                <br />
                <div className="form-btn">
                  <Button
                    variant="contained"
                    fullWidth
                    color="green"
                    style={{ marginTop: "1rem" }}
                    // onClick={()=>navigation.next()}
                    onClick={submitHandler}
                  >
                    Save & Continue
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </>
  );
};
export default CampaignFormTemplate;
