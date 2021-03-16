import React, { Fragment } from "react";
import Select, { components } from "react-select";
// import "./customselect.css";
// import SegmentForm from "../segment"

const Menu = (props) => {
  console.log(props)
  return (
    <Fragment>
      <components.Menu {...props}>
        <div>
          {props.selectProps.fetchingData ? (
            <span className="fetching">Fetching data...</span>
          ) : (
            <div>{props.children}</div>
          )}  
            <button
            // className=""
            className={"change-data"} 
            // onClick={props.selectProps.changeOptionsData}
          >
            Create Segment
          </button>
          <br />
          {/* <SegmentForm/> */}
        </div>
      </components.Menu>
    </Fragment>
  );  
};

const Option = (props) => {
  return (
    <Fragment>
      <components.Option {...props}>{props.children}</components.Option>
    </Fragment>
  );
};

const CustomSelect = ({
  options,
  onChange
}) => {
  return (
    <div>
      <Select
        options={options}
        components={{ Menu, Option }}
        maxMenuHeight={100}
        onChange={onChange}
      />
    </div>
  );
};
const CustomSelectMulti = ({
  options,
  onChange,
  closeMenuOnSelect
}) => {
  return (
    <div>
      <Select
        options={options}
        components={{ Menu, Option }}
        isMulti
        maxMenuHeight={100}
        closeMenuOnSelect={closeMenuOnSelect}
        onChange={onChange}
      />
    </div>
  );
};
export {CustomSelect,CustomSelectMulti,Menu}