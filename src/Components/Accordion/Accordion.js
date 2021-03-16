import React, { useState, useRef } from "react";
import SvgIcon from '../../Components/Svg-icon/Svg-icon';
import "./Accordion.css";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
    );
  }

  return (
    <div className="accordion__section">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <div className="accordion__title" dangerouslySetInnerHTML={{ __html: props.title }}/>
        <SvgIcon icon="chevron-down" className={`${setRotate}`} classes="svg--sm" ></SvgIcon>
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__content"
      >
        {props.children}
      </div>
    </div>
  );
}

export default Accordion;
