import React from "react";
// import { Icon, Popup } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../Containers/Campaign/Campaign.css";
import CreateCampaign from "../../Containers/Campaign/CreateCampaign";
import CampaignMainSource from "./automationcampaign/CampaignMainSource";
function CreateNewCampaignHeader(props) {
  return (
    <article>
      <article className="card-custom  pad">
        {props.isEdit && <h4 className="ui header">EDIT CAMPAIGN</h4>}
        {!props.isEdit && <h4 className="ui header">CREATE NEW CAMPAIGN</h4>}
      </article>
      {/* <CreateCampaign /> */}
      
      <div className="card-custom pad--half">
        {props.type === "WhatsApp" && (
          <div className="col-20 flex align-space-around algn-vert-center">
            <div style={{ width: "30%" }}>
              <div className="label">Campaign Type</div>
              <Select
                style={{ width: "35%" }}
                isClearable={true}
                isRtl={false}
                isSearchable={true}
                placeholder="Select or Search.."
                name="campaignType"
                // value={this.state.formControls.eventType}
                onChange={(event) => {
                  props.typeChangeHandler(event);
                }}
                options={props.eventType([
                  "GENERIC",
                  "LEAD",
                  "SMS Pro",
                  "WhatsApp",
                ])}
              />
            </div>
            <Link to="/service/package">
              <button className="btn btn-fill btn-success">
                Buy WhatsApp Package
              </button>
            </Link>
          </div>
        )}
        {props.type !== "WhatsApp" && (
          <div className="col-9 margin-left--auto margin-right--auto">
            <div className="label">Campaign Type</div>
            <Select
              isClearable={true}
              isRtl={false}
              isSearchable={true}
              placeholder="Select or Search.."
              name="campaignType"
              // value={this.state.formControls.eventType}
              onChange={(event) => {
                props.typeChangeHandler(event);
              }}
              options={props.eventType([
                "GENERIC",
                "LEAD",
                "SMS Pro",
                "WhatsApp",
              ])}
            />
          </div>
        )}
        {props.type === "GENERIC" && (
          <div className="col-20  flex flex-direction--row flex-wrap">
            <div className="col-9 padding-all-12">
              <div className="label">Medium</div>
              <select
                className="form-control"
                name="medium"
                disabled={props.isEdit}
                value={props.formControls.medium.value}
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
            <div className="col-9 margin-left--auto padding-all-12">
              <div className="label">Datasource</div>
              <select
                className="form-control"
                name="ammId"
                disabled={props.isEdit}
                value={props.formControls.ammId.value}
                onChange={props.onDatasourceChangeHandler}
              >
                <option defaultValue>-SELECT Datasource-</option>
                {props.datasource.map((item, index) => {
                  return (
                    <option key={index} value={item.ammId + "," + item.bamId}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default CreateNewCampaignHeader;
