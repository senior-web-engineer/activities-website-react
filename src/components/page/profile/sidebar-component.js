import { MultiLang } from "components/content/element/widget";
import $ from "jquery";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import { logOut } from "../../../Store/action/auth";

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.handleClick();
  }
  signOut = (e) => {
    e.preventDefault();
    this.setState({
      login: false,
    });
    this.props.logOut();
  };
  handleClick = () => {
    $("#sidemenu-" + this.props.select).addClass("current");
    $("#icon-sub-" + this.props.select).addClass("current");
    for (var i = 1; i <= 22; i++) {
      if (i !== Number(this.props.select)) {
        $("#sidemenu-" + i).removeClass("current");
        $("#icon-sub-" + i).removeClass("current");
      }
    }
  };

  render() {
    const role = JSON.parse(sessionStorage.getItem("role"));
    return (
      <Fragment>
        <div className="widget atbd_widget widget-card cu-radius cu-sidebar">
          {role === "advertiser" && (
            <div>
              <NavLink to="/advertiser-dashboard">
                <div
                  className="atbd_widget_title cu-profile-edit1"
                  id="sidemenu-17"
                >
                  <h4 className="cu-font-size">
                    <span
                      className="la la-list cu-icon-color cu-icon"
                      id="icon-sub-17"
                    ></span>
                    <MultiLang text="dashboard" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/my-activities">
                <div className="atbd_widget_title cu-side" id="sidemenu-10">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-list cu-icon-color cu-icon"
                      id="icon-sub-10"
                    ></span>
                    <MultiLang text="my_advertise" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/boost-ads">
                <div className="atbd_widget_title cu-side" id="sidemenu-15">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-hand-o-right cu-icon-color cu-icon"
                      id="icon-sub-15"
                    ></span>
                    <MultiLang text="boost_ads" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/insurance-info">
                <div className="atbd_widget_title cu-side" id="sidemenu-14">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-empire cu-icon-color cu-icon"
                      id="icon-sub-14"
                    ></span>
                    <MultiLang text="insurance_info" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/manage-plan">
                <div className="atbd_widget_title cu-side" id="sidemenu-13">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-empire cu-icon-color cu-icon"
                      id="icon-sub-13"
                    ></span>
                    <MultiLang text="manage_pricing_plan" />
                  </h4>
                </div>
              </NavLink>
            </div>
          )}
          {role === "user" && (
            <div>
              <NavLink to="/my-calendar">
                <div className="atbd_widget_title cu-side" id="sidemenu-2">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-calendar cu-icon-color cu-icon"
                      id="icon-sub-2"
                    ></span>
                    <MultiLang text="my_calendar" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/my-favorite">
                <div className="atbd_widget_title cu-side" id="sidemenu-3">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-heart-o cu-icon-color cu-icon"
                      id="icon-sub-3"
                    ></span>
                    <MultiLang text="my_favorite" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/my-orders">
                <div className="atbd_widget_title cu-side" id="sidemenu-16">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-list cu-icon-color cu-icon"
                      id="icon-sub-16"
                    ></span>
                    <MultiLang text="orders" />
                  </h4>
                </div>
              </NavLink>
            </div>
          )}
          <NavLink to="/payment-information">
            <div className="atbd_widget_title cu-side" id="sidemenu-4">
              <h4 className="cu-font-size">
                <span
                  className="la la-credit-card cu-icon-color cu-icon"
                  id="icon-sub-4"
                ></span>
                <MultiLang text="payment_info" />
              </h4>
            </div>
          </NavLink>
          <NavLink to="/notification-setting">
            <div className="atbd_widget_title cu-side" id="sidemenu-5">
              <h4 className="cu-font-size">
                <span
                  className="la la-bell-o cu-icon-color cu-icon"
                  id="icon-sub-5"
                ></span>
                <MultiLang text="noticiation_settings" />
              </h4>
            </div>
          </NavLink>
          {role === "advertiser" && (
            <div>
              <NavLink to="/staff-management">
                <div className="atbd_widget_title cu-side" id="sidemenu-6">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-users cu-icon-color cu-icon"
                      id="icon-sub-6"
                    ></span>
                    <MultiLang text="staff_management" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/business-profile">
                <div className="atbd_widget_title cu-side" id="sidemenu-7">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-building cu-icon-color cu-icon"
                      id="icon-sub-7"
                    ></span>
                    <MultiLang text="business_profile" />
                  </h4>
                </div>
              </NavLink>
              {/* <NavLink to="/balance-withdraw">
                <div className="atbd_widget_title cu-side" id="sidemenu-8">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-balance-scale cu-icon-color cu-icon"
                      id="icon-sub-8"
                    ></span>
                    <MultiLang text="balance_withraw" />
                  </h4>
                </div>
              </NavLink> */}
              <NavLink to="/email-marketing">
                <div className="atbd_widget_title cu-side" id="sidemenu-21">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-envelope cu-icon-color cu-icon"
                      id="icon-sub-21"
                    ></span>
                    <MultiLang text="email_marketing" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/accesskey-management">
                <div className="atbd_widget_title cu-side" id="sidemenu-18">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-shirtsinbulk cu-icon-color cu-icon"
                      id="icon-sub-18"
                    ></span>
                    <MultiLang text="api_management" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/edit-account">
                <div
                  className="atbd_widget_title cu-side current"
                  id="sidemenu-1"
                >
                  <h4 className="cu-font-size">
                    <span
                      className="la la-user cu-icon-color cu-icon"
                      id="icon-sub-1"
                    ></span>
                    <MultiLang text="edit_account" />
                  </h4>
                </div>
              </NavLink>
              <NavLink to="/guide-document">
                <div className="atbd_widget_title cu-side" id="sidemenu-19">
                  <h4 className="cu-font-size">
                    <span
                      className="la la-comment cu-icon-color cu-icon"
                      id="icon-sub-19"
                    ></span>
                    <MultiLang text="api_doc" />
                  </h4>
                </div>
              </NavLink>
            </div>
          )}
          <NavLink to="/support-home">
            <div className="atbd_widget_title cu-side" id="sidemenu-20">
              <h4 className="cu-font-size">
                <span
                  className="la la-user-secret cu-icon-color cu-icon"
                  id="icon-sub-20"
                ></span>
                <MultiLang text="support" />
              </h4>
            </div>
          </NavLink>
          <div
            className="atbd_widget_title cu-profile-edit2 cu-side"
            id="sidemenu-11"
            onClick={this.signOut}
          >
            <h4 className="cu-font-size">
              <span
                className="la la-sign-out cu-icon-color cu-icon"
                id="icon-sub-11"
              ></span>
              <MultiLang text="logout" />
            </h4>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
  };
};
export default connect(null, mapDispatchToProps)(SideBar);
