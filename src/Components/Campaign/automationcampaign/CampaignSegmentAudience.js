import React, { useState } from "react";
import utils from "../../../Services/utility-service";

// import "./audience.css";
const CampaignSegmentAudience = (props) => {
  const { changeHandler } = props;
  const [fileFormat, setFileFormat] = useState(null);
  const [operation, setOperation] = useState("fileUpload");
  const [gpUpdate, setgpUpdate] = useState(null);
  const [groupNameList, setgroupNameList] = useState([]);
  const [audienceData, setaudienceData] = useState([]);
  const [audienceGroupId, setaudienceGroupId] = useState(null);
  const [fetchingData, setfetchingData] = useState(false);
  const [formControls, setFormControls] = useState({
    file: {
      value: null,
    },
    gpName: {
      value: null,
    },
  });

  const radioChangeHandler = (event, params) => {
    let v = event.target.value;
    if (params === "operation") {
      setOperation(v);
      setFileFormat(null);
    } else if (params === "fileFormat") {
      setFileFormat(event.target.value);
    }
  };

  const handleUpload = () => {};

  const chooseAgain = () => {};

  return (
    <div>
      {/* <Popup title={'Upload/Update Audience'} togglePopup={this.togglePopup.bind(this)}></Popup> */}
      <article className="padding-all-12 ml-5 col-20">
        <div className="label">Please select one of the operation</div>
        <label for="fileUpload" className="modal-label1">
          <input
            type="radio"
            name="operation"
            value="fileUpload"
            className="mr-2"
            id="fileUpload"
            onChange={(e) => {
              radioChangeHandler(e, "operation");
            }}
          />
          Add New Audience
        </label>
        <label for="fileUpdate" className="modal-label1">
          <input
            type="radio"
            name="operation"
            className="mr-2"
            checked={operation === "fileUpdate"}
            id="fileUpdate"
            value="fileUpdate"
            onChange={(e) => {
              radioChangeHandler(e, "operation");
            }}
          />
          Update Audience
        </label>
      </article>
      {operation === "fileUpload" ? (
        <div className="file-upload--card pad--half flex flex-direction--col m-4">
          <div className="section-title">File Upload</div>
          <div className="col-20 margin-top--half margin-btm--half">
            <div className="modal-label">Group Name</div>
            <input
              type="text"
              className="form-control"
              id="groupName"
              style={{ width: "100%" }}
            />
            <div class="form-group form-check mt-2">
              <input
                className="mr-1 mt-1"
                type="checkbox"
                name="remember"
                value="1"
                id="remember"
              />
              <label class="form-check-label" for="exampleCheck1">
                SHA Encryption Required
              </label>
            </div>
          </div>
          <article className="margin-btm--half">
            <div>
              <b>Please select format</b>
            </div>
            <form
              className="flex align-space-between"
              style={{
                border: "1px solid rgb(204, 204, 204)",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <span>
                <input
                  type="radio"
                  id=".xls"
                  value=".xls"
                  name=".xls"
                  checked={fileFormat === ".xls"}
                  onChange={(e) => {
                    radioChangeHandler(e, "fileFormat");
                  }}
                  style={{ marginRight: "5px" }}
                />
                <label for=".xls">XLS</label>
                <div>
                  <a
                    href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/AudienceXLS.xls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" "
                  >
                    <b>
                      <u>Download xls Template</u>
                    </b>
                  </a>
                </div>
              </span>
              <span>
                <input
                  type="radio"
                  id=".xlsx"
                  value=".xlsx"
                  name=".xlsx"
                  checked={fileFormat === ".xlsx"}
                  onChange={(e) => {
                    radioChangeHandler(e, "fileFormat");
                  }}
                  style={{ marginRight: "5px" }}
                />
                <label for=".xlsx">XLSX</label>
                <div>
                  <a
                    href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_XLSX.xlsx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" "
                  >
                    <b>
                      <u>Download xlsx Template</u>
                    </b>
                  </a>
                </div>
              </span>
              <span>
                <input
                  type="radio"
                  id=".csv"
                  value=".csv"
                  name=".csv"
                  checked={fileFormat === ".csv"}
                  onChange={(e) => {
                    radioChangeHandler(e, "fileFormat");
                  }}
                  style={{ marginRight: "5px" }}
                />
                <label for=".csv">CSV</label>
                <div>
                  <a
                    href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_CSV.csv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" "
                  >
                    <b>
                      <u>Download csv Template</u>
                    </b>
                  </a>
                </div>
              </span>
            </form>
          </article>
          <form>
            <input
              type="file"
              accept={`${fileFormat}`}
              className="form-control"
              name="file"
              id="file"
              style={{ width: "100%" }}
              onChange={changeHandler}
            />
            <div className="col-20">
              <p style={{ color: "green" }}>
                Please upload {`${fileFormat}`} file only
              </p>
              {/* <a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_CSV.csv" className=""><b><u>Download csv Template</u></b></a> */}
            </div>
          </form>
        </div>
      ) : (
        <article className="file-upload--card pad--half flex flex-direction--col m-4">
          <div className="col-14 margin-btm--half">
            <div className="modal-label">Group Name</div>
            <select
              className="form-control"
              style={utils.isMobile ? { width: "100%" } : { width: "100%" }}
              name="gpUpdate"
              onChange={(e) => ({ gpUpdate: e.target.value })}
              id="gNameUpdate"
            >
              <option>Choose...</option>
              {groupNameList.map((item, index) => {
                return (
                  <option key={index} value={item.agId}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* --------------------- */}

          <article className="margin-btm--half">
            <div>
              <b>Please select format</b>
            </div>
            <form
              className="flex align-space-between"
              style={{
                border: "1px solid rgb(204, 204, 204)",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <span>
                <input
                  type="radio"
                  id=".xls"
                  value=".xls"
                  name=".xls"
                  checked={fileFormat === ".xls"}
                  onChange={(e) => {
                    radioChangeHandler(e, "fileFormat");
                  }}
                  style={{ marginRight: "5px" }}
                />
                <label for=".xls">XLS</label>
                <div>
                  <a
                    href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/AudienceXLS.xls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" "
                  >
                    <b>
                      <u>Download xls Template</u>
                    </b>
                  </a>
                </div>
              </span>
              <span>
                <input
                  type="radio"
                  id=".xlsx"
                  value=".xlsx"
                  name=".xlsx"
                  checked={fileFormat === ".xlsx"}
                  onChange={(e) => {
                    radioChangeHandler(e, "fileFormat");
                  }}
                  style={{ marginRight: "5px" }}
                />
                <label for=".xlsx">XLSX</label>
                <div>
                  <a
                    href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_XLSX.xlsx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" "
                  >
                    <b>
                      <u>Download xlsx Template</u>
                    </b>
                  </a>
                </div>
              </span>
              <span>
                <input
                  type="radio"
                  id=".csv"
                  value=".csv"
                  name=".csv"
                  checked={fileFormat === ".csv"}
                  onChange={(e) => {
                    radioChangeHandler(e, "fileFormat");
                  }}
                  style={{ marginRight: "5px" }}
                />
                <label for=".csv">CSV</label>
                <div>
                  <a
                    href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/Audience_Sample_CSV.csv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" "
                  >
                    <b>
                      <u>Download csv Template</u>
                    </b>
                  </a>
                </div>
              </span>
            </form>
          </article>

          <form>
            <input
              type="file"
              accept={`${fileFormat}`}
              className="form-control"
              name="file"
              id="file"
              onChange={changeHandler}
              style={{ width: "100%" }}
            />
            <div className="col-20">
              <p style={{ color: "green" }}>
                Please upload {`${fileFormat}`} file only
              </p>
              {/* <a href="https://s3-reachlocalads.s3.ap-south-1.amazonaws.com/sample/audience/AudienceXLS.xls" className=""><b><u>Download Template</u></b></a> */}
            </div>
          </form>

          <div className="label">{formControls.file.value}</div>

          {/* <div>
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                    </div> */}

          <div className="margin-top--half">
            <button
              className="btn btn-fill btn-primary"
              onClick={() => chooseAgain()}
            >
              Choose Again
            </button>
            <button
              className="btn btn-fill btn-green margin-left--half"
              onClick={() => handleUpload("update")}
            >
              UPDATE
            </button>
          </div>
        </article>
      )}
    </div>
  );
};

export default CampaignSegmentAudience;
