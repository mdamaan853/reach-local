import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Popup from "../../Components/Popup/Popup";
import Youtube from "../../Components/Youtube/Youtube";
import { getMediums } from "../../Services/medium-service";
import { fetchCampaign } from "../../Services/campaign-service";
import { getAudienceMediumMapping } from "../../Services/datasource-service";
import ComponentInlineHeader from "../../Components/Campaign/CampaignInlineHeader";
import CampaignTable from "../../Components/Campaign/CampaignTable";
import SelectAutomationType from '../../Components/Campaign/automationcampaign/SelectAutomationType'
import { fetchRoles } from "../../Services/roles-service";
import utils from "../../Services/utility-service";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import CircularLoader from "../../Components/circular-loader/circular-loader";
import { Link } from "react-router-dom";
import "./Campaign.css";
import Pagination from "../../Components/Pagination/Pagination";

export default class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
      mediums: [],
      datasources: [],
      ammId: "",
      rolesFetched: false,
      accessDenied: false,
      showFilters: false,
      bamId: "",
      mediumId: "",
      date: "",
      start: 0,
      howTo: false,
      loader: false,
      hasNext: true,
      showClientDetails: false,
      formControls: {
        to: {
          value: "",
        },
        from: {
          value: "",
        },
      },
    };
  }

  showVideo() {
    this.setState({
      howTo: !this.state.howTo,
    });
  }

  componentDidMount() {
    if (utils.isAdmin) {
      this.afterDidMount();
    } else {
      this.getRequiredRoles();
    }
  }

  getRequiredRoles() {
    fetchRoles("Campaigns")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.subRoles && data.subRoles.length > 0) {
          utils.roles = data.subRoles;
          this.afterDidMount();
        } else if (
          data.success &&
          data.subRoles &&
          data.subRoles.length === 0
        ) {
          this.setState({
            accessDenied: true,
          });
        } else {
          ToastsStore.error("Something went wrong, Please Try Again Later ");
        }
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
      });
  }

  afterDidMount() {
    this.setState({
      rolesFetched: true,
    });
    this.showCampaign();
    this.fetchMediums();
    this.fetchDatasourcesByMedium();
  }

  fetchMediums() {
    const body = {
      start: this.state.start,
      maxResult: 20,
    };

    getMediums(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            mediums: data.mediumList,
          });
        } else {
          //   console.log("create toast");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onMediumChange = (event) => {
    this.setState(
      {
        mediumId: event.target.value,
      },
      () => this.fetchDatasourcesByMedium()
    );
  };

  fetchDatasourcesByMedium() {
    let body = {
      mediumId: this.state.mediumId,
    };

    getAudienceMediumMapping(body)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            datasources: data.audienceGroups,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onDatasourceChangeHandler = (event) => {
    this.setState(
      {
        ammId: event.target.value,
        bamId: this.state.bamId,
      },
      () => this.showCampaign()
    );
  };

  onDateChangeHandler = (event) => {
    this.setState(
      {
        date: event.target.value,
      },
      () => this.calculateDays()
    );
  };

  calculateDays() {
    if (this.state.date !== "0") {
      let endDate = new Date();
      let days = parseInt(this.state.date);
      let d = new Date();
      d.setDate(d.getDate() - days);
      // console.log(d.toISOString(),endDate.toISOString())
      this.showCampaign(d.toISOString(), endDate.toISOString());
    }
  }

  customDateSubmit() {
    if (
      !this.state.formControls.from.value ||
      !this.state.formControls.to.value
    ) {
      ToastsStore.error("Please select both Start and End Date.");
      return;
    }
    let d = this.state.formControls.from.value;
    d.setDate(d.getDate() + 1);
    let c = this.state.formControls.to.value;
    c.setDate(c.getDate() + 1);
    this.showCampaign(d.toISOString(), c.toISOString());
  }

  showCampaign(start, end) {
    const body = {
      ammId: this.state.ammId,
      bamId: this.state.bamId,
      mediumId: this.state.mediumId,
      start: this.state.start,
      maxResults: 30,
    };
    if (start && end) {
      body["createdStart"] = start;
      body["createdEnd"] = end;
    }
    this.setState({
      loader: true,
    });
    fetchCampaign(body)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.success) {
          if (data.campaigns && data.campaigns.length > 0) {
            this.setState({
              campaigns: this.trimLongDescription(data.campaigns),
              hasNext: data.campaigns.length === 30,
              showClientDetails: data.showClientDetails,
            });
          } else {
            this.setState({
              hasNext: false,
            });
          }
        } else {
          ToastsStore.error(data.message);
        }
        this.setState({
          loader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        ToastsStore.error("Something went wrong, Please Try Again Later ");
        this.setState({
          loader: false,
        });
      });
  }
  trimLongDescription(data) {
    if (data && data.length > 0) {
      data.forEach((ele) => {
        if (ele.desc && ele.desc.length > 100) {
          ele.desc = ele.desc.slice(0, 100) + "...";
        }
      });
    }
    return data;
  }

  dateChange(event, name) {
    let temp = this.state.formControls;
    if (name === "from") {
      temp.from.value = event;
    } else {
      temp.to.value = event;
    }
    this.setState({
      formControls: temp,
    });
  }

  getCampaigns(type) {
    if (type === "previous") {
      if (this.state.start > 0) {
        this.setState(
          {
            start: this.state.start - 30,
          },
          () => {
            this.showCampaign();
          }
        );
      }
    } else if (type === "next") {
      if (this.state.hasNext) {
        this.setState(
          {
            start: this.state.start + 30,
          },
          () => {
            this.showCampaign();
          }
        );
      }
    }
  }

  showHideFilters() {
    if (this.state.showFilters) {
      let data = this.state.formControls;
      data.from.value = "";
      data.to.value = "";
      this.setState(
        {
          formControls: data,
          date: "",
          ammId: "",
          mediumId: "",
          showFilters: false,
        },
        () => {
          this.showCampaign();
        }
      );
    } else {
      this.setState({
        showFilters: true,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Campaign | ReachLoalAds</title>
          <meta name="description" content="Campaign" />
        </Helmet>
        {this.state.rolesFetched && utils.hasRole("campaign_mgmt") && (
          <main className="wrapper-container">
            <div
              className="flex justify-flex-end"
              // style={utils.isMobile ? {marginLeft:"0%"} : {marginLeft:"77%"}}
            >
              <i
                className="youtube large icon"
                style={{ color: "#ff0201" }}
              ></i>
              <span
                className="pointer text--bold text--underline"
                style={{ color: "#4183c4" }}
                onClick={() => {
                  this.showVideo();
                }}
              >
                Understanding Campaign Dashboard
              </span>
            </div>
            {this.state.howTo && (
              <Popup
                title={"Understanding Campaign Dashboard"}
                togglePopup={this.showVideo.bind(this)}
              >
                <Youtube url={"IkcA-Vw9KdE"} />
              </Popup>
            )}
            <div className="card-custom flex flex-direction--row flex-wrap pad--half">
              <h4 className="ui header">Campaigns</h4>
              <section className="margin-left--auto margin-right--quar">
                {utils.hasRole("campaign_create") && (
                  <div className="senderId-action--wrapper">
                   
       {/* <Route path="/automationCampaign" component={NourishPref} /> */}
       {/* <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        launch type
      </button> */}

<SelectAutomationType />

                    {/* <Link to="/autocampaigns">
                      <button className="btn btn-fill btn-success margin-left--auto">
                        Create Automation Campaign
                      </button> 
                    </Link>*/}
                    <Link to="/campaign-create">
                      <button className="btn btn-fill btn-success margin-left--auto">
                        Create New Campaign
                      </button>
                    </Link>
                  </div>
                )}
              </section>
            </div>

            <section className="card-custom pad">
              {utils.hasRole("campaign_table") && (
                <React.Fragment>
                  <div
                    className="flex margin-top"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <Link to="/campaign/report">
                      <button class="ui blue button">SMSPro Reports</button>
                    </Link>
                    <button
                      class="ui teal button"
                      onClick={() => this.showHideFilters()}
                    >
                      {this.state.showFilters ? "Clear Filters" : "Filters"}
                    </button>
                  </div>
                  {this.state.showFilters && (
                    <ComponentInlineHeader
                      mediums={this.state.mediums}
                      datasource={this.state.datasources}
                      onMediumChange={this.onMediumChange.bind(this)}
                      ammId={this.state.ammId}
                      onDatasourceChangeHandler={this.onDatasourceChangeHandler}
                      onDateChangeHandler={this.onDateChangeHandler}
                      date={this.state.date}
                      formControls={this.state.formControls}
                      customDateSubmit={this.customDateSubmit.bind(this)}
                      dobChange={this.dateChange.bind(this)}
                      mediumId={this.state.mediumId}
                    />
                  )}

                  <div className="margin-top" style={{ marginBottom: "-15px" }}>
                    <Pagination
                      getData={this.getCampaigns.bind(this)}
                      start={this.state.start}
                      hasNext={this.state.hasNext}
                      data={this.state.campaigns}
                      loader={this.state.loader}
                    />
                  </div>
                  <CampaignTable
                    isStatsUpdateAllowed={utils.hasRole(
                      "campaign_stats_update"
                    )}
                    campaigns={this.state.campaigns}
                    history={this.props.history}
                    showClientDetails={this.state.showClientDetails}
                    fetchCampaigns={this.showCampaign.bind(this)}
                  />
                  <Pagination
                    getData={this.getCampaigns.bind(this)}
                    start={this.state.start}
                    hasNext={this.state.hasNext}
                    data={this.state.campaigns}
                    loader={this.state.loader}
                  />
                </React.Fragment>
              )}
            </section>

            <section
              className="margin-top--double pad--half sender-note"
              style={{ fontSize: "14px" }}
            >
              <b>Please Note :</b>* Campaign needs to be submitted at least 24
              hours before the actual campaign execution.
            </section>
            <ToastsContainer
              position={ToastsContainerPosition.TOP_RIGHT}
              lightBackground
              store={ToastsStore}
            />
          </main>
        )}
        {!this.state.rolesFetched && !this.state.accessDenied && (
          <div className="global-loader col-1">
            <CircularLoader
              stroke={"#0c73a5"}
              size={"36"}
              buttonSize={"50px"}
            ></CircularLoader>
          </div>
        )}
        {this.state.accessDenied && (
          <div className="global-loader col-2">
            <div>Access Denied.</div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
