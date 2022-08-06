import { MultiLang } from "components/content/element/widget";
import React, { Fragment, Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  getAdvNotification,
  setReadNotification,
} from "../../../Store/action/widget";

class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: JSON.parse(sessionStorage.getItem("role")),
    };
  }
  componentDidMount() {
    this.props.getAdvNotification();
    this.props.setReadNotification();
  }

  linkPage = (item) => {
    if (item.booking_id !== undefined) {
      if (this.state.role === "user") {
        this.props.history.push("/my-orders");
      } else {
        this.props.history.push(`/order-detail/${item.ad_id}`);
      }
    } else {
      // sessionStorage.setItem("chatRoomId", JSON.stringify(item.chat_id));
      this.props.history.push("/chat");
    }
    // if (item.chat_id !== undefined) {
    // sessionStorage.setItem("chatRoomId", JSON.stringify(item.chat_id));
    // this.props.history.push("/chat");
    // }
  };

  render() {
    const { notificationData } = this.props;
    return (
      <Fragment>
        <div className="atbd_author_module">
          <div className="atbd_content_module cu-radius">
            <div
              className="atbd_content_module__tittle_area"
              style={{ borderBottom: "none" }}
            >
              <div className="cu-notification-list-header">
                <div className="atbd_area_title">
                  <h4>
                    <span className="la la-sticky-note la-2x"></span>
                    <MultiLang text="notification_list" />
                  </h4>
                </div>
              </div>
              <div className="scroller">
                {notificationData && notificationData.length > 0 ? (
                  notificationData.map((item, key) => {
                    return (
                      <div
                        className="d-flex justify-content-between pointer p-3"
                        key={key}
                        onClick={(e) => this.linkPage(item)}
                      >
                        <p className="m-bottom-0">{item.message}</p>
                        <p className="p-right-15 m-bottom-0">{item.date}</p>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <p className="pt-20 pb-20">
                      <MultiLang text="there_is_not_yet" />
                    </p>
                  </div>
                )}
                {/* <a
                  href=" "
                  className="access-link cu-icon-color"
                  data-toggle="modal"
                  data-target="#notification_modal"
                  style={{ float: "right" }}
                >
                  Read More
                </a> */}
              </div>
            </div>
          </div>
        </div>
        {/*<!-- ends: .atbd_author_module -->*/}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notificationData: state.widget.adv_notification,
  };
};

const mapDistpatchToProps = (dispatch) => {
  return {
    getAdvNotification: () => dispatch(getAdvNotification()),
    setReadNotification: (id) => dispatch(setReadNotification(id)),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDistpatchToProps)
)(NotificationList);
