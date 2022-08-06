import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import defaultAvatar from "../../../assets/img/default.jpg";
import FontAwesome from "react-fontawesome";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { setChatRooms } from "../../../Store/action/widget";
// const noAction = (e) => e.preventDefault();
export function SellerInfoCSV({ companyInfo = {} }) {
  return (
    <div className="widget-body atbd_author_info_widget">
      <div className="atbd_avatar_wrapper">
        <div className="atbd_review_avatar">
          <img src={defaultAvatar} alt="" style={{ width: "40px" }} />
        </div>
        <div className="atbd_name_time">
          <h4>
            {companyInfo?.company ?? ""}
            <span
              className="verified"
              data-toggle="tooltip"
              data-placement="top"
              title="Verified"
            ></span>
          </h4>
        </div>
      </div>
      <div className="atbd_widget_contact_info">
        <ul>
          <li>
            <span className="la la-map-marker"></span>
            <span className="atbd_info">
              {companyInfo?.address || "No location"}
            </span>
          </li>
          <li>
            <span className="la la-phone"></span>
            <span className="atbd_info">
              {companyInfo?.phone_number || "No phone number"}
            </span>
          </li>
          {Boolean(companyInfo?.site_url) && (
            <li>
              <span className="la la-globe"></span>
              <a
                href={`https://${companyInfo?.site_url ?? ""}`}
                className="atbd_info"
                target="_blank"
                rel="noopener noreferrer"
              >
                {companyInfo?.site_url ?? ""}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

class SellerInfo extends Component {
  setChat = (id) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      sessionStorage.setItem("url", JSON.stringify("chat"));
      this.props.path.push("/sign-in");
      return false;
    }
    const { data, path } = this.props;
    this.props.setChatRooms(data, path, id);
  };
  render() {
    const {
      listing_id,
      adver_name,
      adver_address,
      // advertiser_id,
      user,
      posted_date,
    } = this.props.data;

    return (
      <Fragment>
        <div className="widget-body atbd_author_info_widget">
          <div
            className="atbd_avatar_wrapper"
            // onClick={() =>
            //   this.props.history.push({
            //     pathname: `/provider-profile/${adver_name.replace(/ /g, "-")}`,
            //     state: { providerId: advertiser_id },
            //   })
            // }
          >
            <div className="atbd_review_avatar">
              <img
                src={user === "" ? defaultAvatar : user}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
            </div>
            <div className="atbd_name_time">
              <h4>
                {adver_name}
                <span
                  className="verified"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Verified"
                ></span>
              </h4>
              <span className="review_time">{posted_date} posted</span>
            </div>
          </div>
          {/* <!-- ends: .atbd_avatar_wrapper --> */}
          <div className="atbd_widget_contact_info">
            <ul>
              <li>
                <span className="la la-map-marker"></span>
                <span className="atbd_info">
                  {typeof adver_address === "object"
                    ? Object.entries(adver_address).length > 0
                      ? `${adver_address.street}${" "}${
                          adver_address.city
                        }${" "}${adver_address.state}${" "}${
                          adver_address.country
                        }`
                      : "No location"
                    : typeof adver_address === "string"
                    ? adver_address
                    : "No location"}
                </span>
              </li>
              {/* <li>
                <span className="la la-phone"></span>
                <span className="atbd_info">
                  {phone ? phone : "No phone number"}
                </span>
              </li>
              <li>
                <span className="la la-envelope"></span>
                <span className="atbd_info">{adver_email}</span>
              </li> */}
              {/* <li>
                  <span className="la la-globe"></span>
                  <NavLink to="#" className="atbd_info" onClick={noAction}>
                    www.aazztech.com
                  </NavLink>
                </li> */}
            </ul>
          </div>
          {/* <!-- ends: .atbd_widget_contact_info --> */}
          {/* <div className="atbd_social_wrap">
            <p>
              <NavLink to="#" onClick={noAction}>
                <span className="fab fa-facebook-f"></span>
              </NavLink>
            </p>
            <p>
              <NavLink to="#" onClick={noAction}>
                <span className="fab fa-twitter"></span>
              </NavLink>
            </p>
            <p>
              <NavLink to="#" onClick={noAction}>
                <span className="fab fa-google-plus-g"></span>
              </NavLink>
            </p>

            <p>
              <NavLink to="#" onClick={noAction}>
                <span className="fab fa-linkedin-in"></span>
              </NavLink>
            </p>
            <p>
              <NavLink to="#" onClick={noAction}>
                <span className="fab fa-dribbble"></span>
              </NavLink>
            </p>
          </div> */}
          {/* <!-- ends: .atbd_social_wrap --> */}
          <Button
            onClick={(e) => this.setChat(listing_id)}
            className="btn-gradient btn-gradient-two btn btn-md btn-icon btn-block icon-left"
          >
            <FontAwesome name="comments" />
            Chat Now
          </Button>
        </div>
      </Fragment>
    );
  }
}
const mapActionsToProps = { setChatRooms };

export default withRouter(connect(null, mapActionsToProps)(SellerInfo));
