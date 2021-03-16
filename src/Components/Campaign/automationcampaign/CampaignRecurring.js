import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Checkbox, Form } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import Timekeeper from 'react-timekeeper';


// import "./when.css";
const animatedComponents = makeAnimated();

const Recurring = (props) => {
  const {
    FormData,
    setFormData,
    timeOption,
    timeHandler,
    FormDataError,
    changeHandler,
    submitHandler,
  } = props;

  const checkboxChangeHandler = (event, data) => {
    const value = data.checked;
    console.log(data);
    console.log(value);
    // this.setState({ [data.name]: data.checked });
    // console.log(value); // It is giving undefined here
  };

   
  return (
    <div>
      <Form.Field inline>
        <div className="mb-3 row">
          <label className="col-sm-3 col-form-label"> Start Date </label>
          <div className="col-sm-8">
            <SemanticDatepicker
              name="startDate"
              className="custom-datepicker"
              placeholder="click to select date"
              value={FormData.startDate}
              onChange={(e, d) => {
                console.log(d.value);
              }}
            />
          </div>
        </div>
      </Form.Field>
      <Form.Field inline>
        <div className="mb-3 row">
          <label className="col-sm-3 col-form-label"> Delivery Schedule </label>
          <div className="col-sm-9 p-0">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-5 px-3 pr-5 p-0">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-6 p-0">
                        <form className="d-flex align-items-center"> 
                          <label className="pr-2">Repeat Every</label>
                          <Checkbox
                            name="recurringInfo.frequency"
                            // value=""
                            // checked={FormData.frequency == "1"}
                            onChange={(event, data) => {
                              console.log(event);
                              console.log(data);
                              const frequency = data.checked;
                              // setFormData({ ...FormData, [FormData.recurringInfo.frequency]: frequency })
                              FormData.frequency = frequency;
                              // console.log(value); // It is giving undefined here
                            }}
                          />
                        </form>
                      </div>
                      <div className="col-sm-6">
                        <form className=""> 
                          <Select
                              className="cat-input"
                              components={animatedComponents}
                              defaultValue="select"
                              placeholder="Day"
                              // options={}
                              name="startTimeInterval"
                              onChange={(e) => (FormData.startTimeInterval = e.value)}
                            />
                        </form>
                      </div> 

                    </div>
                  </div>
                </div>
                <div className="col-sm-7 p-0">
                  <div className="container-fluid">
                    <div className="row mb-3">
                        <div className="col-sm-2 p-0"><b>on</b></div>
                        <div className="col-sm-10 p-0">
                          <div className="d-flex align-items-center">  
                            <div onClick={()=>setFormData({...FormData,weekday:"MON"})} className={FormData.weekday == "MON"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>M</div> 
                            <div onClick={()=>setFormData({...FormData,weekday:"TUE"})} className={FormData.weekday == "TUE"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>T</div> 
                            <div onClick={()=>setFormData({...FormData,weekday:"WED"})} className={FormData.weekday == "WED"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>W</div> 
                            <div onClick={()=>setFormData({...FormData,weekday:"THU"})} className={FormData.weekday == "THU"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>T</div> 
                            <div onClick={()=>setFormData({...FormData,weekday:"FRI"})} className={FormData.weekday == "FRI"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>F</div> 
                            <div onClick={()=>setFormData({...FormData,weekday:"SAT"})} className={FormData.weekday == "SAT"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>S</div> 
                            <div onClick={()=>setFormData({...FormData,weekday:"SUN"})} className={FormData.weekday == "SUN"?"p-1 px-2 border border-success bg-success text-white rounded mx-1":"p-1 px-2 border border-success rounded mx-1"}>S</div> 
                          </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-2 p-0"><b>at</b></div>
                        <div className="col-sm-10 p-0">
                        <Select
                          className="cat-input"
                          components={animatedComponents}
                          defaultValue="select"
                          placeholder="-Select Time-"
                          options={timeOption}
                          name="startTimeInterval"
                          onChange={(e) => (FormData.startTimeInterval = e.value)}
                        />
                        
                        
                        {/* <Timekeeper
                          onChange={(e) => {console.log(e)}}
                          // onChange={(e) => (FormData.startTimeInterval = e.value)}
                        
                        /> */}
                        
                        </div>
                    </div>
                  </div>        
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </Form.Field>
      {/* <Form.Group widths="equal">
        <div className="mb-3 row">
          <Form.Field inline>
            <label className="col-sm-12 col-form-label">
              Delivery Schedule
            </label>
            <label>Repeat Every</label>
            <Checkbox
              name="recurringInfo.frequency"
              // value=""
              // checked={FormData.frequency == "1"}
              onChange={(event, data) => {
                console.log(event);
                console.log(data);
                const frequency = data.checked;
                // setFormData({ ...FormData, [FormData.recurringInfo.frequency]: frequency })
                FormData.recurringInfo.frequency = frequency;
                // console.log(value); // It is giving undefined here
              }}
            />
          </Form.Field>
          <span className="mt-2 mr-2 h5">on</span>
          <Form.Field>
             

            <div class="weekDays-selector">
            <input type="radio" id="weekday-mon" className="weekday" />
            <label for="weekday-mon">M</label>
            <input type="radio" id="weekday-tue" className="weekday" />
            <label for="weekday-tue">T</label>
            <input type="radio" id="weekday-wed" className="weekday" />
            <label for="weekday-wed">W</label>
            <input type="radio" id="weekday-thu" className="weekday" />
            <label for="weekday-thu">T</label>
            <input type="radio" id="weekday-fri" className="weekday" />
            <label for="weekday-fri">F</label>
            <input type="radio" id="weekday-sat" className="weekday" />
            <label for="weekday-sat">S</label>
            <input type="radio" id="weekday-sun" className="weekday" />
            <label for="weekday-sun">S</label>
          </div>
          </Form.Field>
        </div>
        <span className="mt-2 mr-2 h5">at</span>
        <Form.Field inline>
          <div className="col-6 col-md-4">
            <Select
              className="cat-input"
              components={animatedComponents}
              defaultValue="select"
              placeholder="-Select Time-"
              options={timeOption}
              name="startTimeInterval"
              onChange={(e) => (FormData.startTimeInterval = e.value)}
            />
          </div>
        </Form.Field>
      </Form.Group> */}
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
              Till
            </label>
            <br />
            <label className="radio-label">
              <input
                type="radio"
                label="Send to users in a single segment multiple segment/"
                name="endType"
                className="mr-1"
                value={"1"}
                checked={FormData.endType === "1"}
                onChange={changeHandler}
              />
              Never
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
                  placeholder="-Click to select date-"
                  value={FormData.endDate}
                  onChange={(e) => console.log(e)}
                />
              </div>
            </Form.Field>
            <Form.Field>
              <Select
                className="cat-input"
                placeholder="-Select Time-"
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

export default Recurring;
