import React, { useRef } from "react";
import { Header, Form, Segment, Button, TextArea } from "semantic-ui-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Switch from "react-switch";
import Select, { components } from "react-select";
import ReactQuill from "react-quill";
// import EditorToolbar, { modules, formats } from "./QuillToolbar";
import DragAndDrog from "./DragDropEditor";
// import "./style.css";
const CampaignMessage = (props) => {
  const {
    FormData,
    currentData,
    setFormData,
    changeHandler,
    navigation,
    submitHandler,
  } = props;
  console.log(currentData.senderIds);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="shadow bg-white p-0">
              <Header as="h3" attached="top">
                Create New Campaign
              </Header>
              <Segment attached>
                <div className="ui big breadcrumb">
                  <a className="section"> Audience </a>
                  <i className="right chevron icon divider"> </i>
                  <a className="section"> When </a>
                  <i className="right chevron icon divider"> </i>
                  <a className="active-nav"> Message </a>
                  <i className="right chevron icon divider"> </i>
                  <a className="section"> Preview & Launch </a>
                </div>
              </Segment>
            </div>
            <div className="card shadow bg-white mb-2 mt-1 p-3 border-0">
              <div className="row">
                <div className="col-sm-3">
                  <h4 className="msg-heading">Notification Type</h4>
                </div>
                <div className="col-sm-6">
                  <Select
                    className="cat-input"
                    closeMenuOnSelect={false}
                    // components={animatedComponents}
                    defaultValue="select"
                    options={[
                      { label: "SMS", value: "SMS" },
                      { label: "EMAIL", value: "EMAIL" },
                    ]}
                    // name="tagIds"
                    onChange={(e) => {
                      setFormData({ notificationType: e.value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="card shadow bg-white mb-2 mt-1 p-3 border-0">
              <div className="row">
                <div className="col-sm-3">
                  <h4 className="msg-heading">Sender Id</h4>
                </div>
                <div className="col-sm-6">
                  <Select
                    className="cat-input"
                    closeMenuOnSelect={false}
                    // components={animatedComponents}
                    defaultValue="select"
                    options={currentData.senderIds}
                    // name="tagIds"
                    // onChange={(e)=>{setFormData({notificationType:e.value})}}
                  />
                </div>
              </div>
            </div>
          </div>

          {FormData.notificationType == "SMS" ? (
            <div class="container">
              <div class="d-flex align-item-center pr-2 my-3">
                <div class="col-sm-7 shadow bg-white border p-5">
                  {/* <div className="shadow bg-white">
                  <h3 className="">Sender ID</h3>
                  <label className="">Select Your Sender Id</label>
                  <div className="">
                    <Select
                      className="cat-input"
                      closeMenuOnSelect={false}
                      // components={animatedComponents}
                      defaultValue="select"
                      isMulti
                      // options={tagsOption}
                      // name="tagIds"
                      // onChange={handleTags}
                    />
                  </div>
                </div> */}

                  <div className="my-3">
                    <h3 className="mb-4">Messages</h3>
                    <label className="">language</label>
                    <div className="mb-3">
                      <Select
                        className="cat-input"
                        closeMenuOnSelect={false}
                        // components={animatedComponents}
                        defaultValue="select"
                        placeholder="-Select Language-"
                        isMulti
                        // options={tagsOption}
                        // name="tagIds"
                        // onChange={handleTags}
                      />
                    </div>
                    <label>Message Content</label>
                    <div className="mb-3">
                      <TextArea
                        className="text-area form-control"
                        // style={{ minHeight: 100,width:800 }}
                        placeholder="Tell us more"
                        style={{ minHeight: 100 }}
                      />
                    </div>
                    <label>Url Shortner / Tracker</label>
                    <div className="mb-3">
                      <div class="input-group mb-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Recipient's username"
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                        />
                        <div class="input-group-append">
                          <button class="btn btn-outline-success" type="button">
                            create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-5 mx-2 p-3 shadow bg-white">
                  <div className="">
                    <Header as="h3" attached="top">
                      {" "}
                      Preview
                    </Header>
                    <div className="text-center">
                      <img
                        src="/mobile/android.png"
                        width="72%"
                        className="me-auto my-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-btn">
              <Button
                variant="contained"
                fullWidth
                color="green"
                style={{ marginTop: "1rem" }}
                onClick={() => navigation.next()}
              >
                Save & Continue
              </Button>
            </div>
            </div>
          ) : (
            <></>
          )}

          {FormData.notificationType == "EMAIL" ? (
            <div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card shadow bg-white border-0 my-2">
                      <Form.Field inline>
                        <div className="mb-3 row ">
                          <label className="col-sm-3 mt-4 col-form-label">
                            From Name
                          </label>
                          <div className="col-sm-9 ">
                            <input
                              className="form-control mt-4"
                              type="text"
                              name="subject"
                              value={FormData.fromName}
                              placeholder="Subject"
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                      </Form.Field>
                      <Form.Field inline>
                        <div className="mb-3 row ">
                          <label className="col-sm-3 mt-4 col-form-label">
                            From Email
                          </label>
                          <div className="col-sm-9 ">
                            <input
                              className="form-control mt-4"
                              type="text"
                              name="fromEmail"
                              value={FormData.fromEmail}
                              placeholder="Subject"
                              onChange={changeHandler}
                            />
                          </div>
                        </div>
                      </Form.Field>
                      <Form.Field inline>
                        <div className="mb-3 row ">
                          <label className="col-sm-3 mt-4 col-form-label">
                            Reply To
                          </label>
                          <div className="col-sm-9 ">
                            <Switch
                              checked={FormData.replyToStatus}
                              onChange={(val) => {
                                console.log(val);
                                setFormData({
                                  ...FormData,
                                  replyToStatus: val,
                                });
                                console.log(FormData);
                              }}
                            />
                          </div>
                        </div>
                      </Form.Field>
                      {FormData.replyToStatus ? (
                        <Form.Field inline>
                          <div className="mb-3 row ">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 ">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="alex.smit@example.com"
                                name="replyTo"
                                value={FormData.replyTo}
                                onChange={changeHandler}
                              />
                            </div>
                          </div>
                        </Form.Field>
                      ) : null}

                      <Form.Field inline>
                        <div className="mb-3 row ">
                          <label className="col-sm-3 col-form-label">CC</label>
                          <div className="col-sm-9 ">
                            <Switch
                              checked={FormData.ccStatus}
                              onChange={(val) => {
                                console.log(val);
                                setFormData({ ...FormData, ccStatus: val });
                                console.log(FormData);
                              }}
                            />
                          </div>
                        </div>
                      </Form.Field>

                      {FormData.ccStatus ? (
                        <Form.Field inline>
                          <div className="mb-3 row ">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 ">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="alex.smit@example.com"
                                name="cc"
                                value={FormData.cc}
                                onChange={changeHandler}
                              />
                            </div>
                          </div>
                        </Form.Field>
                      ) : null}

                      <Form.Field inline>
                        <div className="mb-3 row ">
                          <label className="col-sm-3 col-form-label">BCC</label>
                          <div className="col-sm-9 ">
                            <Switch
                              checked={FormData.bccStatus}
                              onChange={(val) => {
                                console.log(val);
                                setFormData({ ...FormData, bccStatus: val });
                                console.log(FormData);
                              }}
                            />
                          </div>
                        </div>
                      </Form.Field>
                      {FormData.bccStatus ? (
                        <Form.Field inline>
                          <div className="mb-3 row ">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 ">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="alex.smit@example.com"
                                name="bcc"
                                value={FormData.bcc}
                                onChange={changeHandler}
                              />
                            </div>
                          </div>
                        </Form.Field>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="card shadow bg-white border-0">
                      <Header as="h3" attached="top" className="header">
                        Message
                      </Header>
                      <Form onSubmit={submitHandler}>
                        <Form.Field inline>
                          <div className="mb-3 row ">
                            <label className="col-sm-3 mt-4 form-label">
                              Subject
                            </label>
                            <div className="col-sm-5 ">
                              <input
                                className="form-control mt-4"
                                type="text"
                                name="subject"
                                // value={FormData.subject}
                                placeholder="Subject"
                                onChange={changeHandler}
                              />
                            </div>
                          </div>
                        </Form.Field>
                        <label></label>

                        <div className="row">
                          <div className="col-sm-3"></div>
                          <div className="col-sm-9">
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="templateId"
                                value={"1"}
                                checked={FormData.templateId === "1"}
                                onChange={changeHandler}
                              />
                              <label
                                class="form-check-label"
                                for="inlineRadio1"
                              >
                                Rich Text
                              </label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="radio"
                                value={"2"}
                                checked={FormData.templateId === "2"}
                                onChange={changeHandler}
                              />
                              <label
                                class="form-check-label"
                                for="inlineRadio2"
                              >
                                Html
                              </label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="templateId"
                                value={"3"}
                                checked={FormData.templateId === "3"}
                                  onChange={changeHandler}
                              />
                              <label
                                class="form-check-label"
                                for="inlineRadio3"
                              >
                                Drag & Drop Editor
                              </label>
                            </div>
                          </div>
                        </div>

                        {FormData.templateId == "1" ? (
                          <Form.Field inline>
                            <div className="mb-3 row">
                              <label className="col-sm-3 mt-4 form-label">
                                Body
                                {/* <label className="col-sm-3 mt-4 col-form-label">Body */}
                                <div className="">
                                  {/* <div className="col-sm-5 "> */}
                                  <CKEditor
                                    // editor={ ClassicEditor }
                                    data="<p>Hello from CKEditor 5!</p>"
                                    name="content"
                                    value={FormData.content}
                                    // onChange={changemsg}
                                    onReady={(editor) => {
                                      // You can store the "editor" and use when it is needed.
                                      console.log(
                                        "Editor is ready to use!",
                                        editor
                                      );
                                    }}
                                    onChange={(event, editor) => {
                                      const data = editor.getData();
                                      FormData.content = data;

                                      console.log(data);
                                    }}
                                    onBlur={(event, editor) => {
                                      console.log("Blur.", editor);
                                    }}
                                    onFocus={(event, editor) => {
                                      console.log("Focus.", editor);
                                    }}
                                  />

                                  {/* <FroalaEditor
                                    tag='textarea'
                                    // config={config}
                                    // model={FormData.content}
                                    // onModelChange={(e)=>{console.log(e)}}
                                  /> */}
                                </div>
                              </label>
                            </div>
                          </Form.Field>
                        ) : (
                          ""
                        )}
                        {FormData.templateId == "2" ? (
                          <Form.Field>
                            {/* <EditorToolbar /> */}
                            <ReactQuill
                              theme="snow"
                              style={{ height: 300 }}
                              value={FormData.content}
                              name="content"
                              placeholder={"Write something awesome..."}
                              // modules={modules}
                              // formats={formats}
                              onChange={(e) => (FormData.content = e)}
                            />
                          </Form.Field>
                        ) : (
                          ""
                        )}
                        {FormData.templateId == "3" ? (
                          <Form.Field>
                            <DragAndDrog {...props} />
                          </Form.Field>
                        ) : (
                          ""
                        )}
                        <Form.Field inline>
                          <div className=" row ">
                            <label className="col-sm-3 mt-4 form-label">
                              Attachments
                            </label>
                            <div className="col-sm-4 ">
                              <i className="fa fa-user icon"></i>
                              <input
                                className=" "
                                type="text"
                                name="longUrl"
                                value={FormData.longUrl}
                                onChange={changeHandler}
                                placeholder="https://www.abc.com/document.pdf"
                              />
                              <p className="text-muted">
                                Maximum file size:10mb
                              </p>
                            </div>
                            <span className="msg-span">OR</span>
                            <div className="col-sm-3 mt-3">
                              <button className="upload-btn badge badge-pill mt-3">
                                UPLOAD
                              </button>
                            </div>
                          </div>
                        </Form.Field>
                        <Form.Field>
                          <div className="col-sm-5 mt-3 d-flex justify-content-end">
                            <button className="btn-attachment badge badge-pill">
                              Add another Attachment
                            </button>
                          </div>
                        </Form.Field>
                      </Form>
                        <div className="form-btn">
                        <Button
                          variant="contained"
                          fullWidth
                          color="green"
                          style={{ marginTop: "1rem" }}
                          onClick={() => navigation.next()}
                        >
                          Save & Continue
                        </Button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
export default CampaignMessage;
