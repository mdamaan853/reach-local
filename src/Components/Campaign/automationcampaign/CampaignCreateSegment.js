import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { IoIosAddCircleOutline } from "react-icons/io";
import FileUpload from "../../FileUpload/FileUpload"

import {
  Button,
  Form,
  Checkbox,
  Divider,
  Icon,
  Modal,
  Radio,
  Accordion,
} from "semantic-ui-react";
import InputRange from "react-input-range";
import { IoIosArrowForward } from "react-icons/io";
import CampaignSegmentAudience from "./CampaignSegmentAudience";
// import "./audience.css";

const animatedComponents = makeAnimated();

function CampaignCreateSegment(props) {
  const {
    FormData,
    changeHandler,
    tagsOption,
    handleTags,
    audienceData,
    setaudienceData,
    segmentData,
    setSegmentData,
  } = props;

  console.log(props.segmentData);

  const [activeIndex, setactiveIndex] = React.useState("");
  const option = [
    { label: "create a new Audience", value: 0 },
    { label: "All audience", value: 1 },
    { label: "click Audience", value: 2 },
  ];

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setactiveIndex(newIndex);
    console.log(activeIndex);
  };

  return (
    <>
      <a 
        title="Create New Segment"
        class=""
        data-toggle="modal"
        data-target="#addSegment"
      >
        <IoIosAddCircleOutline
            type="button"
            color="gray"
            size="25"
            className="msg-icon"
          />
      </a>
      <div className="">
        <div
          class="modal fade modal fade bd-example-modal-lg bd-example-modal-xl"
          id="addSegment"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-dialog-centered modal-dialog modal-lg"
            role="document"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Create New Segment
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
                <div class="modal-footer">
                  <Button type="btn" class="btn " color="green">
                    Save
                  </Button>
                </div>
                <Form>
                  <h4> Segment Details</h4>
                  <Form.Field inline>
                    <label className="modal-label">Name Your Segment :</label>
                    <input
                      placeholder="type your segment name.."
                      style={{ minWidth: 230, width: 370 }}
                      onChange={changeHandler}
                      name="segmentName"
                      value={segmentData.segmentName}
                    />
                  </Form.Field>
                  <Accordion
                    fluid
                    className="custom-accordian"
                    style={{ marginBottom: 5 }}
                  >
                    <Accordion.Title
                      active={activeIndex === 0}
                      index={0}
                      className="p-3"
                      onClick={handleClick}
                    >
                      <Icon name="angle right" />
                      Audience
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                      <div className="">
                        <form>
                         
                            <label className="modal-label mx-3">Audience Type</label>
                            <div className="d-flex align-items-center my-3">
                              <div className="col-sm-10">
                                <Select
                                  name="audienceType"
                                  placeholder="select-Type"
                                  options={option}
                                  lable="Audience Type"
                                  defaultValue={0}
                                  onChange={(e) => {
                                    console.log(e.value);
                                    setaudienceData({ audienceType: e.value });
                                  }}
                                />
                              </div>
                              <div className="col-sm-2 text-right">
                                <button type="reset" className="btn text-success">Reset</button>
                              </div>
                            </div>
                         </form>
                      </div>
                      {audienceData.audienceType == 0 ? (
                        <div> 
                          <label className="modal-label ml-3"><b>User Attribute</b></label>
                          <form>
                            <div className="d-flex align-items-center">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-2 col-form-label"
                              >
                                Gender
                              </label>
                              <div className="col-sm-8 p-0">
                                <label className="radio-label">
                                  <input
                                    type="radio"
                                    className="mr-1"
                                    name="gender"
                                    value="All"
                                    checked={segmentData.gender == "All"}
                                    onChange={changeHandler}
                                  />
                                  All
                                </label>
                                <br />

                                <label className="radio-label">
                                  <input
                                    type="radio"
                                    className="mr-1"
                                    name="gender"
                                    value="Male"
                                    checked={segmentData.gender == "Male"}
                                    onChange={changeHandler}
                                  />
                                  Male
                                </label>
                                <br />

                                <label className="radio-label">
                                  <input
                                    type="radio"
                                    className="mr-1"
                                    name="gender"
                                    value="Female"
                                    checked={segmentData.gender == "Female"}
                                    onChange={changeHandler}
                                  />
                                  Female
                                </label>
                              </div>
                              <div className="col-sm-2 text-right">
                                <button type="reset" className="btn text-success">Reset</button>
                              </div>
                            </div>
                          </form>
                          <form> 
                            <div className="d-flex align-items-center">
                              <div className="col-sm-2">
                                <label htmlFor="age">Age</label>
                              </div>
                              <div className="col-sm-8 p-0">
                                <InputRange minValue={15} maxValue={80} />
                              </div>
                              <div className="col-sm-2 text-right">
                                <button type="reset" className="btn text-success">Reset</button>
                              </div>
                            </div>
                          </form>
                          <Divider />
                          <form className="px-3">
                            <div className="mb-3 row">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-2 form-label"
                              >
                                City
                              </label>
                              <div className="col-sm-8 p-0">
                                <input
                                  placeholder="type here"
                                  name="city"
                                  value={segmentData.city}
                                  onChange={changeHandler}
                                />
                              </div>
                              <div className="col-sm-2 text-right">
                                <button type="reset" className="btn text-success">Reset</button>
                              </div>  
                            </div>
                          </form>
                          <Divider />
                          {/* <div className="col-10">
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
                                  /> */}
                                {/* </div> */}
                              {/* )} */}
                           {/* </div> */}
                          <form className="px-3">
                            <div className="mb-3 row">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-2 form-label"
                              >
                                Pincode
                              </label>
                              <div className="col-sm-8 p-0">
                                <input
                                  placeholder="type here"
                                  onChange={changeHandler}
                                  name="pincode"
                                  value={segmentData.pincode}
                                  onChange={changeHandler}
                                  // value={FormData.PinCode.value}
                                />
                              </div>
                              <div className="col-sm-2 text-right">
                                <button type="reset" className="btn text-success">Reset</button>
                              </div>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div>
                          <FileUpload/>
                          {/* <CampaignSegmentAudience {...props} /> */}
                        </div>
                      )}
                      {/* </div> */}
                    </Accordion.Content>
                  </Accordion>
                  <Accordion
                    fluid
                    className="custom-accordian"
                    style={{ marginBottom: 5 }}
                  >
                    <Accordion.Title
                      active={activeIndex === 1}
                      index={1}
                      className="p-3"
                      onClick={handleClick}
                    >
                      <Icon name="angle right" />
                      Behavioral
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                      <Form.Field className="ml-3">
                        <label className="modal-label">
                          Users who DID these Events:
                        </label>
                        <div className="col-sm-6">
                          <Select placeholder="-select-event-" />
                        </div>
                      </Form.Field>
                      <Divider horizontal>
                        <div>
                          <Button.Group>
                            <Button
                              color="green"
                              className="green-btn"
                              content="And"
                            />
                            <Button className="white-btn" content="Or" />
                          </Button.Group>
                        </div>
                      </Divider>
                      <Form.Field className="ml-3">
                        <label className="modal-label">
                          Users who DID NOT do these meetings
                        </label>
                        <div className="col-sm-6">
                          <Select placeholder="-select-event-" />
                        </div>
                        <div className="reset">Reset</div>
                      </Form.Field>
                    </Accordion.Content>
                  </Accordion>
                  <Accordion fluid className="custom-accordian">
                    <Accordion.Title
                      active={activeIndex === 2}
                      index={2}
                      className="p-3"
                      onClick={handleClick}
                    >
                      <Icon name="angle right" />
                      Filter By Tags
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                      <Form.Field className="ml-3">
                        <label
                          htmlFor="staticEmail"
                          className="col-sm-3 col-form-label"
                        >
                          Campaign Tags :
                        </label>
                        <Select
                          className="cat-input"
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          defaultValue="select"
                          isMulti
                          options={tagsOption}
                          name="tagIds"
                          onChange={handleTags}
                        />
                      </Form.Field>
                    </Accordion.Content>
                  </Accordion>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CampaignCreateSegment;
