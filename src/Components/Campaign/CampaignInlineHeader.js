import React from "react";
import DatePicker from "react-datepicker";
export default function ComponentInlineHeader(props) {
  return (
    <div className="flex flex-wrap">
      <div className="col-6">
        <div className="label">Medium</div>
        <select
          className="form-control"
          name="medium"
          value={props.mediumId}
          onChange={props.onMediumChange}
        >
          <option defaultValue>-Select Medium-</option>
          {props.mediums.map((item, index) => {
            return (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="col-6 margin-left--auto">
        <div className="label">Datasource</div>
        <select
          className="form-control"
          name="datasource"
          value={props.ammId}
          onChange={props.onDatasourceChangeHandler}
        >
          <option defaultValue>-SELECT Datasource-</option>
          {props.datasource.map((item, index) => {
            return (
              <option key={index} value={item.ammId}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="col-6 margin-left--auto">
        <div className="label">Date</div>
        <select
          className="form-control"
          value={props.date}
          onChange={props.onDateChangeHandler}
          name="date"
        >
          <option defaultValue hidden>
            -Select Day-
          </option>
          <option value="7">-7 Days-</option>
          <option value="14">14 Days</option>
          <option value="21">21 Days</option>
          <option value="30">This month</option>
          <option value="0">Custom</option>
        </select>
      </div>
      {props.date === "0" && (
        <div className="col-9 margin-left--auto margin-top">
          <div className="flex">
            <div className="col-8 flex">
              <div
                className="label margin-right--half"
                style={{ lineHeight: "28px" }}
              >
                From:
              </div>
              <DatePicker
                selected={props.formControls.from.value}
                placeholderText="Click to select Date"
                onChange={(event) => {
                  props.dobChange(event, "from");
                }}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="col-20"
              />
            </div>
            <div className="col-8 flex margin-left">
              <div
                className="label margin-right--half"
                style={{ lineHeight: "28px" }}
              >
                To:
              </div>
              <DatePicker
                selected={props.formControls.to.value}
                placeholderText="Click to select Date"
                onChange={(event) => {
                  props.dobChange(event, "to");
                }}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="col-20"
              />
            </div>
            <button
              onClick={() => props.customDateSubmit()}
              className="ui tiny green button margin-left"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
