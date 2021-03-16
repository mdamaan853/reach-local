import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Form } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
// import "./when.css";
const animatedComponents = makeAnimated();

const Onetime = (props) => {
  const {
    FormData,
    timeOption,
    timeHandler,
    FormDataError,
    changeHandler,
    submitHandler,
  } = props;

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">
            <Form>
              <Form.Field inline>
                <div className="mb-3 row">
                  <label htmlFor="staticEmail" className="col-sm-3 form-label">
                    Delivery Time
                  </label>
                  <div className="col-sm-6">
                    <label className="radio-label">
                      <input
                        type="radio"
                        className="mr-1"
                        name="deliveryTime"
                        value={"0"}
                        checked={FormData.deliveryTime === "0"}
                        onChange={changeHandler}
                      />
                      Now
                    </label>
                    <br />
                    <label className="radio-label">
                      <input
                        type="radio"
                        className="mr-1"
                        name="deliveryTime"
                        value={"1"}
                        checked={FormData.deliveryTime === "1"}
                        onChange={changeHandler}
                      />
                      Later
                    </label>
                  </div>
                </div>
              </Form.Field>
              {FormData.deliveryTime === "1" ? (
                <div className="offset-3">
                  <Form.Group widths="equal">
                    <Form.Field inline>
                      <label className="radio-label">Schedule Date</label>
                      <div className="date">
                        <SemanticDatepicker
                          name="startDate"
                          //    value={FormData.startDate}
                          placeholder="-Click to select date-"
                          onChange={(e) => console.log(e)}
                        />
                      </div>
                    </Form.Field>
                    <Form.Field>
                      <label className=" radio-label">Schedule Time:</label>
                      {/* <Select
                        className="cat-input"
                        components={animatedComponents}
                        defaultValue="select"
                        placeholder="-Select Time-"
                        options={timeOption}
                        name="startTimeInterval"
                        onChange={(e) => (FormData.startTimeInterval = e.value)}
                      /> */}
                      <input
                      name=""
                      value=""
                      className="timepicker"
                      />
                    </Form.Field>
                  </Form.Group>
                </div>
              ) : null}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onetime;
