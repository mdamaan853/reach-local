import React, { Component } from "react";
import "./SideBar.css";
import { NavLink } from "react-router-dom";
import utils from "../../Services/utility-service";
import SvgIcon from "../../Components/Svg-icon/Svg-icon";
class SideBar extends Component {
  render() {
      console.log(this.props.list)
    return (
      <React.Fragment>
        {!utils.isMobile && (
          <div
            className="side-bar"
            style={this.props.sidebarOpen ? {} : { width: "50px" }}
          >

            {/* <div className="flex">
                            <span onClick={()=>this.props.toggleSidebar()} className="ease margin-left--auto margin-right margin-top text--white pointer margin-btm--half">
                                {
                                    this.props.sidebarOpen ?
                                    <SvgIcon icon={"arrow-left"} classes={'svg--lg'}></SvgIcon> :
                                    <SvgIcon icon={"arrow-right"} classes={'svg--lg'}></SvgIcon>
                                }
                            </span>
                        </div> */}
            {/*
                            this.props.sidebarOpen &&
                            <div className="flex flex-align pad--half flex-direction--col margin-btm ease" style={{fontSize:'14px'}}>
                                <div className="margin-top--half text--white">{this.props.userInfo && this.props.userInfo.firstName ? this.props.userInfo.firstName : "Guest"}</div>
                                <div className="credits margin-top--quar text--white">
                                    <SvgIcon icon={"credits"} classes={'svg--lg'}></SvgIcon>
                                    <span className="v-align-middle" style={{paddingLeft:'6px'}}>Credits: 0</span>
                                </div>
                            </div>
                        */}
            <ul className="exp_menu__list">
              {this.props.list.map((item, index) => {
                return (
                  <li
                    onClick={() => {
                      this.props.changeCategory(index);
                    }}
                    key={index}
                    className="exp_menu__element"
                  >
                    <NavLink
                      className={
                        this.props.sidebarOpen
                          ? "exp_menu__link ease"
                          : "collapse exp_menu__link ease"
                      }
                      to={item.url}
                    >
                      <SvgIcon icon={item.icon} classes={item.class}></SvgIcon>
                      <span className="">{item.text}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {utils.isMobile && (
          <div
            className="side-bar"
            style={this.props.sidebarOpen ? { width: "50%" } : { width: "0px" }}
          >
            <ul className="exp_menu__list">
              {this.props.list.map((item, index) => {
                return (
                  <li
                    onClick={() => {
                      this.props.changeCategory(index);
                    }}
                    key={index}
                    className="exp_menu__element"
                  >
                    <NavLink
                      className={
                        this.props.sidebarOpen
                          ? "exp_menu__link ease"
                          : "collapse exp_menu__link ease"
                      }
                      to={item.url}
                    >
                      <SvgIcon icon={item.icon} classes={item.class}></SvgIcon>
                      <span className="">{item.text}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default SideBar;
