import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Form } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
// import "./when.css";
const animatedComponents = makeAnimated();
const Triggered = (props) => {
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
      <Form.Field inline>
        <div className="row">
          <label className="col-sm-3 col-form-label">Upon Occurence Of:</label>
          <div className="col-sm-6 p-2">
            <Select
              className="cat-input"
              components={animatedComponents}
              defaultValue="select"
              options={timeOption}
              placeholder="-Select Event-"
              name="startTimeInterval"
              onChange={(e) => (FormData.startTimeInterval = e.value)}
            />
          </div>
        </div>
      </Form.Field>
      <Form.Field inline>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-3 col-form-label">
            Start Date
          </label>
          <div className="col-sm-8">
            <label className="radio-label">
              <input
                type="radio"
                className="mr-1"
                label="Send to users in a single segment"
                name="startType"
                value={"0"}
                checked={FormData.startType === "0"}
                onChange={changeHandler}
              />
              Now
            </label>
            <br />
            <label className="radio-label">
              <input
                type="radio"
                className="mr-1"
                label="Send to users in a single segment multiple segment/"
                name="startType"
                value={"1"}
                checked={FormData.startType === "1"}
                onChange={changeHandler}
              />
              Later
            </label>
          </div>
        </div>
      </Form.Field>
      {FormData.startType === "1" ? (
        <div className="offset-3">
          <Form.Group widths="equal">
            <Form.Field>
              <div className="date">
                <SemanticDatepicker
                  name="startDate"
                  placeholder="click to select date"
                  value={FormData.startDate}
                  onChange={(e) => console.log(e)}
                />
              </div>
            </Form.Field>
            <Form.Field inline>
              <Select
                className="cat-input"
                placeholder="select time"
                components={animatedComponents}
                defaultValue="select"
                options={timeOption}
                name="startTimeInterval"
                onChange={(e) => (FormData.startTimeInterval = e.value)}
              />
            </Form.Field>
          </Form.Group>
        </div>
      ) : null}
      <Form.Field inline>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-3 col-form-label">
            End Date
          </label>
          <div className="col-sm-8">
            <label className="radio-label">
              <input
                type="radio"
                label="Send to users in a single segment"
                name="endType"
                className="mr-1"
                value={"0"}
                checked={FormData.endType === "0"}
                onChange={changeHandler}
              />
              Now
            </label>
            <br />
            <label className="radio-label">
              <input
                type="radio"
                label="Send to users in a single segment multiple segment/"
                className="mr-1"
                name="endType"
                value={"1"}
                checked={FormData.endType === "1"}
                onChange={changeHandler}
              />
              Later
            </label>
          </div>
        </div>
      </Form.Field>
      {FormData.endType === "1" ? (
        <div className="offset-3">
          <Form.Group widths="equal">
            <Form.Field>
              <div className="date">
                <SemanticDatepicker
                  name="endDate"
                  placeholder="click to select date"
                  value={FormData.endDate}
                  onChange={(e) => console.log(e)}
                />
              </div>
            </Form.Field>
            <Form.Field inline>
              <Select
                className="cat-input"
                placeholder="select time"
                components={animatedComponents}
                defaultValue="select"
                options={timeOption}
                name="endTimeInterval"
                onChange={(e) => (FormData.endTimeInterval = e.value)}
              />
            </Form.Field>
          </Form.Group>
        </div>
      ) : null}
    </div>
  );
};

export default Triggered;
