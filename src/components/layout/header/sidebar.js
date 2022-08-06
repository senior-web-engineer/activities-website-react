import { Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CloseIcon from "@material-ui/icons/Close";
import { MultiLang } from "components/content/element/widget";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import defaultAvatar from "../../../assets/img/default.jpg";
import { logOut } from "../../../Store/action/auth";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  list: {
    width: 250,
    position: "relative",
  },
  closebtn: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 8,
    cursor: "pointer",
  },
  fullList: {
    width: "auto",
  },
});

export const LoginedSidebar = ({ notificationCnt, msgCnt }) => {
  const role = JSON.parse(sessionStorage.getItem("role"));
  const dispatch = useDispatch();

  const signOut = (e) => {
    e.preventDefault();
    dispatch(logOut());
  };

  return (
    <div className="p-3 sidebar-content">
      <ul className="list-unstyled">
        <li>
          <NavLink to="/edit-account">
            <i className="la la-user pr-10"></i>
            <MultiLang text="my_profile" />
          </NavLink>
        </li>
        <li>
          <div style={{ position: "relative" }}>
            <NavLink to="/notification-list">
              <span className="la la-comment pr-10"></span>
              <MultiLang text="notifications" />
              <div
                className="note-alert left-alert"
                style={{ marginLeft: "110px" }}
              >
                {notificationCnt > 0 && <span>{notificationCnt}</span>}
              </div>
            </NavLink>
          </div>
        </li>
        <li>
          <div style={{ position: "relative" }}>
            <NavLink to="/chat">
              <span className="la la-comment pr-10"></span>
              <MultiLang text="chat" />
              <div
                className="note-alert left-alert"
                style={{ marginLeft: "64px" }}
              >
                {msgCnt > 0 && <span>{msgCnt}</span>}
              </div>
            </NavLink>
          </div>
        </li>
        {role === "advertiser" && (
          <div>
            <li>
              <NavLink to="/advertiser-dashboard">
                <span className="la la-list dropdown-icon pr-10"></span>
                <MultiLang text="dashboard" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-activities">
                <span className="la la-list dropdown-icon pr-10"></span>
                <MultiLang text="my_advertise" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/boost-ads">
                <span className="la la-hand-o-right dropdown-icon pr-10"></span>
                <MultiLang text="boost_ads" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/insurance-info">
                <span className="la la-list dropdown-icon pr-10"></span>
                <MultiLang text="insurance_info" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage-plan">
                <span className="la la-empire dropdown-icon pr-10"></span>
                <MultiLang text="manage_pricing_plan" />
              </NavLink>
            </li>
          </div>
        )}
        {role === "user" && (
          <div>
            <li>
              <NavLink to="/my-calendar">
                <span className="la la-calendar dropdown-icon pr-10"></span>
                <MultiLang text="my_calendar" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-favorite">
                <span className="la la-heart-o dropdown-icon pr-10"></span>
                <MultiLang text="my_favorite" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-orders">
                <span className="la la-list dropdown-icon pr-10"></span>
                <MultiLang text="orders" />
              </NavLink>
            </li>
          </div>
        )}
        <li>
          <NavLink to="/payment-information">
            <span className="la la-credit-card dropdown-icon pr-10"></span>
            <MultiLang text="payment_info" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/notification-setting">
            <span className="la la-bell-o dropdown-icon pr-10"></span>
            <MultiLang text="noticiation_settings" />
          </NavLink>
        </li>
        {role === "advertiser" && (
          <div>
            <li>
              <NavLink to="/staff-management">
                <span className="la la-users dropdown-icon pr-10"></span>
                <MultiLang text="staff_management" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/business-profile">
                <span className="la la-building dropdown-icon pr-10"></span>
                <MultiLang text="business_profile" />
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/balance-withdraw">
                <span className="la la-balance-scale dropdown-icon pr-10"></span>
                <MultiLang text="balance_withraw" />
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/email-marketing">
                <span className="la la-envelope dropdown-icon pr-10"></span>
                <MultiLang text="email_marketing" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/accesskey-management">
                <span className="la la-shirtsinbulk dropdown-icon pr-10"></span>
                <MultiLang text="api_management" />
              </NavLink>
            </li>
            <li>
              <NavLink to="edit-account">
                <span className="la la-user dropdown-icon pr-10"></span>
                <MultiLang text="edit_account" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/guide-document">
                <span className="la la-comment dropdown-icon pr-10"></span>
                <MultiLang text="api_doc" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/support-home">
                <span className="la la-user-secret dropdown-icon pr-10"></span>
                <MultiLang text="support" />
              </NavLink>
            </li>
          </div>
        )}
        <li>
          <NavLink to="/" onClick={signOut}>
            <i className="la la-user pr-10"></i>
            <MultiLang text="logout" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export function LoginSidebar({ title, lists }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="login-sidebar">
      <div className="toggle-title" onClick={() => setOpen(!open)}>
        <AddIcon />
        <MultiLang text={title} />
      </div>
      <Collapse in={open}>
        <ul className="list-unstyled">
          {lists.map((item, key) => (
            <li key={key}>
              <NavLink to={item.path}>
                <span>
                  <MultiLang text={item.title} />
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
}

export function SideBarList({ ...props }) {
  const classes = useStyles();
  const history = useHistory();
  const [user] = useState(JSON.parse(sessionStorage.getItem("user")));
  const role = JSON.parse(sessionStorage.getItem("role"));

  return (
    <div className={classes.list}>
      <div className={classes.closebtn}>
        <CloseIcon onClick={props.onClose} />
      </div>
      <div className="mobile-sidebar">
        <div className="sidebar-header">
          {user ? (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="mobile-avatar">
                <img
                  src={user?.profile_picture ?? defaultAvatar}
                  alt=""
                  width="50"
                  height="50"
                />
              </div>
              <div className="user-info">
                <h4 className="m-2">{user?.name}</h4>
              </div>
              {role === "advertiser" && (
                <button
                  onClick={() => {
                    window.location.href = "/add-activities";
                  }}
                >
                  <span className="la la-plus"></span>
                  <MultiLang text="add_activity" />
                </button>
              )}
            </div>
          ) : (
            <>
              <h3>
                <MultiLang text="create_an_account" />
              </h3>
              <p className="m-0">
                <MultiLang text="check_your_bookins_and_stay" />
              </p>
              <div className="sidebar-signup-btn">
                <button onClick={() => history.push("/sign-up")}>
                  <MultiLang text="sing_up" />
                </button>
              </div>
            </>
          )}
        </div>
        <div>
          {user ? (
            <LoginedSidebar {...props} />
          ) : (
            <>
              <LoginSidebar
                title="find_an_activity"
                lists={props.findActivityData}
              />
              <LoginSidebar
                title="list_an_activity"
                lists={props.listActivityData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SideBar({ open, onOpenSide, ...props }) {
  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={props.onClose}
        onOpen={onOpenSide}
      >
        <SideBarList {...props} />
      </SwipeableDrawer>
    </>
  );
}
