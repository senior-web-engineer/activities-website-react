import { IconButton } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React, { Component, Fragment } from "react";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import toastr from "toastr";

import avatar from "../../../assets/img/default.jpg";
import advertiserImg from "../../../assets/img/white-for-provider.png";
import { getUserInfo, logOut } from "../../../Store/action/auth";
import { getMetaData } from "../../../Store/action/listing";
import { getAdvNotification, getCartInfo } from "../../../Store/action/widget";
import NavItem from "../navbar/navItem";

//material iconbutton
//material icons
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      avatar: "",
      userType: false,
      cartCnt: 0,
      notificationCnt: 0,
      msgCnt: 0,
    };
  }
  UNSAFE_componentWillMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    this.props.getAdvNotification();
    this.props.getUserInfo();
    this.props.getMetaData();
    if (user) {
      this.props.getCartInfo();
      if (role === "advertiser") {
        this.setState({ userType: true });
      }
      if (user.profile_picture === "" || user.profile_picture === undefined) {
        this.setState({
          login: true,
          avatar: avatar,
        });
      } else {
        this.setState({
          login: true,
          avatar: user.profile_picture,
        });
      }
    } else {
      const cartCnt = JSON.parse(sessionStorage.getItem("cartCnt"));
      this.setState({ cartCnt: cartCnt });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && nextProps.notificationData !== undefined) {
      const notiList = nextProps.notificationData.filter(
        (item) => item.is_read === "0"
      );
      this.setState({
        notificationCnt: notiList.length,
        msgCnt: nextProps.unreadMsgCnt,
      });
    }
    if (user) {
      this.setState({ cartCnt: nextProps.cartInfo.length });
    }
  }
  signOut = (e) => {
    e.preventDefault();
    this.setState({
      login: false,
    });
    this.props.logOut();
  };

  checkActivity = () => {
    const role = JSON.parse(sessionStorage.getItem("role"));
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      this.props.history.push("/sign-in-advertiser");
    } else {
      if (!role) {
        toastr.warning("You can't access this page");
        return false;
      } else if (role) {
        if (role === "advertiser") {
          sessionStorage.removeItem("editId");
          window.location.href = "/add-activities";
          // this.props.history.push("/add-activities");
        } else {
          toastr.warning("You can't access this page");
          return false;
        }
      }
    }
  };

  render() {
    const role = JSON.parse(sessionStorage.getItem("role"));
    return (
      <Fragment>
        {Object.entries(this.props.metaData).length > 0 && (
          <MetaTags>
            <meta
              name="description"
              content={this.props.metaData.description}
            />
            <meta property="og:title" content={this.props.metaData.title} />
            <meta property="og:image" content={this.props.metaData.img} />
            <meta property="og:url" content={this.props.metaData.url} />
            <meta
              property="og:keywords"
              content={this.props.metaData.keywords}
            />
          </MetaTags>
        )}
        <div className={"menu-area menu1 " + this.props.class}>
          <div className="top-menu-area">
            <div className="menu-fullwidth">
              <div className="logo-wrapper order-lg-0 order-sm-1">
                <div className="logo logo-top">
                  {this.state.userType ? (
                    <NavLink to="#">
                      <img
                        src={advertiserImg}
                        alt="logoImage"
                        className="img-fluid"
                      />
                    </NavLink>
                  ) : (
                    <NavLink to="/">
                      <img
                        src={this.props.logo}
                        alt="logoImage"
                        className="img-fluid"
                      />
                    </NavLink>
                  )}
                </div>
              </div>
              {/*<!-- ends: .logo-wrapper -->*/}
              <div className="menu-container order-lg-1 order-sm-0">
                <div className="d_menu">
                  <nav className="navbar navbar-expand-lg mainmenu__menu">
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-toggle="collapse"
                      data-target="#activities-navbar-collapse"
                      aria-controls="activities-navbar-collapse"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="navbar-toggler-icon icon-menu">
                        <i className="la la-reorder"></i>
                      </span>
                    </button>
                    <div
                      className="collapse navbar-collapse"
                      id="activities-navbar-collapse"
                    >
                      <NavItem
                        propsRef={this.props.propsRef}
                        googleAppRef={this.props.googleAppRef}
                        merchantRef={this.props.merchantRef}
                      />
                    </div>
                    {/*<!-- /.navbar-collapse -->*/}
                  </nav>
                </div>
              </div>
              <div className="menu-right order-lg-2 order-sm-2">
                {/*<!-- start .author-area -->*/}
                <div className="author-area">
                  <div className="author__access_area">
                    {!this.state.login ? (
                      <ul className="d-flex list-unstyled align-items-center">
                        <li>
                          <div
                            className="btn btn-xs btn-gradient btn-gradient-two add-button"
                            onClick={this.checkActivity}
                          >
                            <span className="la la-plus"></span> Add Activity
                          </div>
                        </li>
                        {!this.state.userType && (
                          <li>
                            <NavLink to="/cart">
                              <IconButton
                                style={{
                                  color: "white",
                                  outline: "none",
                                  paddingRight: "0px",
                                }}
                              >
                                <Badge
                                  badgeContent={this.state.cartCnt}
                                  color="error"
                                >
                                  <ShoppingCartIcon />
                                </Badge>
                              </IconButton>
                            </NavLink>
                          </li>
                        )}
                        <li>
                          <NavLink to="/sign-in" style={{ color: "white" }}>
                            Login
                          </NavLink>
                          <span>or</span>
                          <NavLink to="/sign-up" style={{ color: "white" }}>
                            Register
                          </NavLink>
                        </li>
                      </ul>
                    ) : (
                      <ul className="d-flex list-unstyled align-items-center">
                        <li>
                          <div
                            className="btn btn-xs btn-gradient btn-gradient-two add-button"
                            onClick={this.checkActivity}
                          >
                            <span className="la la-plus"></span> Add Activity
                          </div>
                        </li>
                        {!this.state.userType && (
                          <li>
                            <NavLink to="/cart">
                              <IconButton
                                style={{
                                  color: "white",
                                  outline: "none",
                                }}
                              >
                                <Badge
                                  badgeContent={this.state.cartCnt}
                                  color="error"
                                >
                                  <ShoppingCartIcon />
                                </Badge>
                              </IconButton>
                            </NavLink>
                          </li>
                        )}
                        <li>
                          <div className="author-info">
                            <div className="note-alert">
                              <span>{this.state.notificationCnt}</span>
                            </div>
                            <div className="author-avatar">
                              <img
                                src={this.state.avatar}
                                alt=""
                                className="rounded-circle header-avatar"
                              />
                            </div>
                            <ul className="list-unstyled">
                              <li>
                                <NavLink
                                  to={`${
                                    role === "advertiser"
                                      ? "/advertiser-dashboard"
                                      : "/edit-account"
                                  }`}
                                >
                                  <i className="la la-user pr-10"></i>
                                  My Profile
                                </NavLink>
                              </li>
                              <li>
                                <NavLink to="/notification-list">
                                  <span className="la la-bell-o pr-10"></span>
                                  Notifications
                                  <div className="note-alert left-alert">
                                    <span>{this.state.notificationCnt}</span>
                                  </div>
                                </NavLink>
                              </li>
                              <li>
                                <NavLink to="/chat">
                                  <span className="la la-comment pr-10"></span>
                                  Chat
                                  <div
                                    className="note-alert left-alert"
                                    style={{ marginLeft: "84px" }}
                                  >
                                    <span>{this.state.msgCnt}</span>
                                  </div>
                                </NavLink>
                              </li>
                              <li>
                                <NavLink to="/" onClick={this.signOut}>
                                  <i className="la la-user pr-10"></i>
                                  Logout
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                {this.state.login ? (
                  <div className={"offcanvas-menu d-none"}>
                    <div
                      className="note-alert left-alert"
                      style={{ marginLeft: "35px", marginTop: "-5px" }}
                    >
                      <span>{this.state.notificationCnt}</span>
                    </div>
                    <a href=" " className="offcanvas-menu__user">
                      <i className="la la-user"></i>
                    </a>
                    <div className="offcanvas-menu__contents">
                      <a href=" " className="offcanvas-menu__close">
                        <i className="la la-times-circle"></i>
                      </a>
                      <div className="author-avatar">
                        <img
                          src={this.state.avatar}
                          alt=""
                          className="rounded-circle mobile-avatar"
                        />
                      </div>
                      <ul className="list-unstyled">
                        <li>
                          <NavLink
                            to={`${
                              role === "advertiser"
                                ? "/advertiser-dashboard"
                                : "/edit-account"
                            }`}
                          >
                            <i className="la la-user pr-10"></i>My Profile
                          </NavLink>
                        </li>
                        <li>
                          <div style={{ position: "relative" }}>
                            <NavLink to="/notification-list">
                              <span className="la la-comment pr-10"></span>
                              Notifications
                              <div
                                className="note-alert left-alert"
                                style={{ marginLeft: "110px" }}
                              >
                                <span>{this.state.notificationCnt}</span>
                              </div>
                            </NavLink>
                          </div>
                        </li>
                        <li>
                          <div style={{ position: "relative" }}>
                            <NavLink to="/chat">
                              <span className="la la-comment pr-10"></span>
                              Chat
                              <div
                                className="note-alert left-alert"
                                style={{ marginLeft: "64px" }}
                              >
                                <span>{this.state.msgCnt}</span>
                              </div>
                            </NavLink>
                          </div>
                        </li>
                      </ul>
                      <ul className="list-unstyled">
                        {this.state.userType && (
                          <div>
                            <li>
                              <NavLink to="/my-activities">
                                <span className="la la-list dropdown-icon pr-10"></span>
                                My Advertise
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/boost-ads">
                                <span className="la la-hand-o-right dropdown-icon pr-10"></span>
                                Boost Ads
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/insurance-info">
                                <span className="la la-list dropdown-icon pr-10"></span>
                                Insurance Information
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/manage-plan">
                                <span className="la la-empire dropdown-icon pr-10"></span>
                                Manage Pricing Plan
                              </NavLink>
                            </li>
                          </div>
                        )}
                        {!this.state.userType && (
                          <div>
                            <li>
                              <NavLink to="/my-calendar">
                                <span className="la la-calendar dropdown-icon pr-10"></span>
                                My Calender
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/my-favorite">
                                <span className="la la-heart-o dropdown-icon pr-10"></span>
                                My Favorite
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/my-orders">
                                <span className="la la-list dropdown-icon pr-10"></span>
                                Orders
                              </NavLink>
                            </li>
                          </div>
                        )}
                        <li>
                          <NavLink to="/payment-information">
                            <span className="la la-credit-card dropdown-icon pr-10"></span>
                            Payment Information
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/notification-setting">
                            <span className="la la-bell-o dropdown-icon pr-10"></span>
                            Notification Setting
                          </NavLink>
                        </li>
                        {this.state.userType && (
                          <div>
                            <li>
                              <NavLink to="/staff-management">
                                <span className="la la-users dropdown-icon pr-10"></span>
                                staff Management
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/business-profile">
                                <span className="la la-building dropdown-icon pr-10"></span>
                                Business Profile
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/balance-withdraw">
                                <span className="la la-balance-scale dropdown-icon pr-10"></span>
                                Balance & Withdraw
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/email-marketing">
                                <span className="la la-envelope dropdown-icon pr-10"></span>
                                Email Marketing
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/accesskey-management">
                                <span className="la la-shirtsinbulk dropdown-icon pr-10"></span>
                                APIKey Management
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="edit-account">
                                <span className="la la-user dropdown-icon pr-10"></span>
                                Edit Account
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/guide-document">
                                <span className="la la-comment dropdown-icon pr-10"></span>
                                API Document
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/support-home">
                                <span className="la la-user-secret dropdown-icon pr-10"></span>
                                Support
                              </NavLink>
                            </li>
                          </div>
                        )}

                        <li>
                          <NavLink to="/user-profile/11" onClick={this.signOut}>
                            <i className="la la-user pr-10"></i>Logout
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className={"offcanvas-menu d-none"}>
                    <a href=" " className="offcanvas-menu__user">
                      <i className="la la-user"></i>
                    </a>
                    <div className="offcanvas-menu__contents">
                      <a href=" " className="offcanvas-menu__close">
                        <i className="la la-times-circle"></i>
                      </a>
                      <ul className="list-unstyled mt-30">
                        <li>
                          <NavLink to="/my-activities">
                            <i className="la la-plus pr-10"></i>Add Listing
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/sign-in">
                            <i className="la la-user pr-10"></i>Login
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/sign-up">
                            <i className="la la-user pr-10"></i>Register
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartInfo: state.widget.cartData,
    notificationData: state.widget.adv_notification,
    unreadMsgCnt: state.widget.unreadMsg,
    metaData: state.list.metaData,
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
    getAdvNotification: () => dispatch(getAdvNotification()),
    getCartInfo: () => dispatch(getCartInfo()),
    getMetaData: () => dispatch(getMetaData()),
    getUserInfo: () => dispatch(getUserInfo()),
  };
};
export default connect(mapStateToProps, mapDispatchToProp)(Header);
