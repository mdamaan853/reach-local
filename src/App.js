import React, { Component } from "react";
import Header from "./Containers/Header/Header";
import SideBar from "./Containers/SideBar/SideBar";
import Navigator from "./Containers/Navigator/Navigator";
//import LoginSignup from './Containers/LoginSignup/LoginSignup';
import Login from "./Containers/LoginSignup/Login";
import { getUserDetails } from "./Services/user-service";
import utils from "./Services/utility-service";
import { BrowserRouter } from "react-router-dom";
import LandingPage from "./Containers/LandingPage/LandingPage";
import { getBusinessDetails } from "./Services/user-service";
import CircularLoader from "./Components/circular-loader/circular-loader";
import EmployeeForm from "./Containers/EmployeeForm/EmployeeForm";
import "./App.css";
import "./helperCss/width-helper.css";
import "./helperCss/margin-helper.css";
import "./helperCss/padding-helper.css";
import "./helperCss/buttons-helper.css";
import "./helperCss/text-helper.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-input-range/lib/css/index.css";
const initialState = {
  activeRoute: "/",
  sidebarOpen: true,
  userInfo: null,
  panelsToShow: [
    {
      text: "Dashboard",
      name: "Dashboard",
      url: "/home",
      class: "svg--img",
      icon: "dashboard",
    },

    {
      text: "Profile",
      name: "Profile",
      url: "/profile",
      class: "svg--img",
      icon: "profile",
    },
    {
      text: "Wallet",
      name: "Credits",
      url: "/buycredits",
      class: "svg--img",
      icon: "wallet",
    },
    {
      text: "Sender Ids",
      name: "SenderIds",
      url: "/sender-ids",
      class: "svg--img",
      icon: "paper-plane",
    },
    {
      text: "Campaign",
      name: "Campaigns",
      url: "/campaigns",
      class: "svg--img",
      icon: "campaign",
    },
    {
      text: "AutomationCampaign",
      name: "autoCampaigns",
      url: "/autocampaigns",
      class: "svg--img",
      icon: "",
    },
    {
      text: "Transactions History",
      url: "/transactions",
      class: "svg--img",
      icon: "paper-plane",
    },
    {
      text: "Audience Upload",
      name: "LeadsUpload",
      url: "/upload",
      class: "svg--img",
      icon: "file-upload",
    },
    {
      text: "Landing Pages",
      name: "LandingPageManagement",
      url: "/landing-pages",
      class: "svg--img",
      icon: "web-outline",
    },
    {
      text: "Roles Management",
      name: "Roles",
      url: "/roles/manage",
      class: "svg--img",
      icon: "roles",
    },
    {
      text: "Leads Management",
      name: "Leads",
      url: "/leads/management",
      class: "svg--img",
      icon: "group",
    },
    {
      text: "Lead Report Upload",
      name: "LeadReportUpload",
      url: "/leads/upload/report",
      class: "svg--img",
      icon: "file-upload",
    },
    {
      text: "Mediums",
      name: "Mediums",
      url: "/mediums",
      class: "svg--img",
      icon: "medium",
    },
    {
      text: "Datasource",
      name: "Datasource",
      url: "/datasource",
      class: "svg--img",
      icon: "datasource",
    },
    {
      text: "Clients",
      name: "Clients",
      url: "/clients",
      class: "svg--img",
      icon: "group",
    },
    {
      text: "Agency",
      name: "Agency",
      url: "/agency",
      class: "svg--img",
      icon: "group",
    },
    {
      text: "IVR Panel",
      name: "IVRPanel",
      url: "/ivr-panel",
      class: "svg--img",
      icon: "call",
    },
    {
      text: "Task",
      name: "Tasks",
      url: "/tasks",
      class: "svg--img",
      icon: "files",
    },
    {
      text: "Packages & Services",
      name: "ServicePackage",
      url: "/service/package",
      class: "svg--img",
      icon: "cart",
    },
    {
      text: "Services",
      name: "Services",
      url: "/services/all",
      class: "svg--img",
      icon: "alpha-s-circle-outline",
    },
    {
      text: "Subscriptions",
      name: "ManageSubscriptions",
      url: "/manage/subscriptions",
      class: "svg--img",
      icon: "checklist",
    },
    {
      text: "Segments",
      name: "Segments",
      url: "/segments",
      class: "svg--img",
      icon: "funnel-outline",
    },
    {
      text: "Segment Group",
      name: "SegmentGroups",
      url: "/segment-group",
      class: "svg--img",
      icon: "files",
    },
    {
      text: "SMS Templates",
      name: "SMSTemplate",
      url: "/templates",
      class: "svg--img",
      icon: "sms-outline",
    },
    {
      text: "Log Out",
      name: "Logout",
      url: "/logout",
      class: "svg--img",
      icon: "signout",
    },
  ],
  panels: [],
  userType: false,
  isGlobalRoleFetched: false,
  loginState: "login",
};
class App extends Component {
  constructor() {
    super();
    if (navigator.userAgent.includes("Mobile")) {
      // if (window.rla.mobile === "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Mobile Safari/537.36") {
      utils.isMobile = true;
      // initialState.sidebarOpen = false;
      initialState.sidebarOpen = true;
      this.state = initialState;
    } else {
      this.state = initialState;
    }
  }
  componentDidMount() {
    if (window.location.pathname !== "/login" && !this.state.userInfo) {
      this.fetchUserDetail();
    }
  }
  fetchUserDetail() {
    getUserDetails()
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // console.log(data);
          utils.setGlobalRoles(data.roles);
          this.setState(
            {
              userInfo: data.userDetails,
              userType: data.type,
              isGlobalRoleFetched: true,
            },
            () => {
              localStorage.setItem(
                "userInfo",
                JSON.stringify(this.state.userInfo)
              );
              this.showPanels(data.allowedPanels);
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getBusinessDetails()
      .then((response) => response.json())
      .then((data) => {
        if (data.success && !!data.uid) {
          localStorage.setItem("bInfo", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showPanels(data) {
    if (data && data.length > 0) {
      let temp = [];
      data.push("Logout");
      data.forEach((element) => {
        let temp1 = this.getMatchingPanel(element);
        if (temp1 && temp1.length > 0) {
          temp.push(temp1[0]);
        }
      });
      this.setState({
        panels: temp,
      });
    }
  }
  getMatchingPanel(element) {
    return this.state.panelsToShow.filter((x) => x.name === element);
  }
  changeCategory(index) {
    if (!!utils.isMobile) {
      if (this.state.panels[index].url === "/logout") {
        //document.cookie = 'u_at_c=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = window.location.origin + "/logout";
      } else {
        this.setState({
          activeRoute: this.state.panels[index].url,
          sidebarOpen: false,
        });
      }
    } else {
      if (this.state.panels[index].url === "/logout") {
        //document.cookie = 'u_at_c=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = window.location.origin + "/logout";
      } else {
        this.setState({
          activeRoute: this.state.panels[index].url,
          sidebarOpen: true,
        });
      }
    }
  }
  toggleSidebar() {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen,
    });
  }
  toggleLogin(page) {
    this.setState({
      loginState: page,
    });
  }
  render() {
    const isLandingPage = window.location.pathname.includes("/onevaidya");
    const isInformationForm = window.location.pathname.includes(
      "/lp/aditya-birla"
    );
    return (
      <React.Fragment>
        {window.location.pathname !== "/login" &&
          window.location.pathname !== "/agency-login" &&
          window.location.pathname !== "/vendor-login" &&
          window.location.pathname !== "/user-login" &&
          !isLandingPage &&
          !isInformationForm && (
            <div className="flex-container-app">
              <BrowserRouter>
                <Header
                  sidebarOpen={this.state.sidebarOpen}
                  userInfo={this.state.userInfo}
                  toggleSidebar={this.toggleSidebar.bind(this)}
                />
                <SideBar
                  list={this.state.panels}
                  userInfo={this.state.userInfo}
                  changeCategory={this.changeCategory.bind(this)}
                  toggleSidebar={this.toggleSidebar.bind(this)}
                  sidebarOpen={this.state.sidebarOpen}
                />
                {/* <div className="main" style={!utils.isMobile ? {left:'200px'} :this.state.sidebarOpen ?  {left:'100%'}: {left:'0px'} }> */}
                <div
                  className="main"
                  style={!utils.isMobile ? { left: "200px" } : { left: "0px" }}
                >
                  {this.state.isGlobalRoleFetched && (
                    <Navigator
                      id="navigator"
                      userType={this.state.userType}
                      userInfo={this.state.userInfo}
                    />
                  )}
                  {!this.state.isGlobalRoleFetched && (
                    <div className="global-loader col-1">
                      <CircularLoader
                        stroke={"#0c73a5"}
                        size={"36"}
                        buttonSize={"50px"}
                      ></CircularLoader>
                    </div>
                  )}
                </div>
              </BrowserRouter>
            </div>
          )}
        {/* {
            (window.location.pathname === "/login" || window.location.pathname === "/agency-login"|| window.location.pathname === "/vendor-login" || window.location.pathname ==="/user-login") && !isLandingPage && !isInformationForm &&
            <LoginSignup currState={this.state.loginState} toggleLogin={this.toggleLogin.bind(this)}/>
          } */}
        {(window.location.pathname === "/login" ||
          window.location.pathname === "/agency-login" ||
          window.location.pathname === "/vendor-login" ||
          window.location.pathname === "/user-login") &&
          !isLandingPage &&
          !isInformationForm && (
            <Login
              currState={this.state.loginState}
              toggleLogin={this.toggleLogin.bind(this)}
            />
          )}
        {isLandingPage && <LandingPage></LandingPage>}
        {isInformationForm && (
          <React.Fragment>
            <EmployeeForm />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default App;
