import React from "react";

function SelectMenu() {
  const Menu = (props) => {
    return (
      <>
        <button
          className={"change-data"}
          onClick={props.selectProps.changeOptionsData}
        >
          Create new segment
        </button>
      </>
    );
  };
}
export default SelectMenu;
