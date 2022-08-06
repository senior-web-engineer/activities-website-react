import { newDate } from "lib/dateLib";
import { RadioGroup } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import toastr from "toastr";
import { db } from "../../../services/firebase";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

let user, role, collection_type;
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone_number: "",
      avater: "",
      email_notification: false,
      value: "24 Hours",
    };
  }
  async UNSAFE_componentWillMount() {
    role = JSON.parse(sessionStorage.getItem("role"));
    user = JSON.parse(sessionStorage.getItem("user"));
    collection_type =
      role === "user"
        ? "user_notification_setting"
        : "advertiser_notification_setting";
    const res = await db.collection(collection_type).get();
    const noti_data = res.docs.map((doc) => doc.data());
    let user_noti_data = noti_data.filter((item) => item.user_id === user.id);
    if (user_noti_data.length > 0) {
      this.setState({
        value: user_noti_data[0].push_notification,
        email_notification: user_noti_data[0].email_notification,
      });
    }
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }
  onSave = async () => {
    try {
      const setting_data = {
        date: newDate().toLocaleDateString().slice(0, 10),
        email_notification: this.state.email_notification,
        id: "",
        push_notification: this.state.value,
        user_id: user.id,
      };
      const res = await db.collection(collection_type).get();
      const setting_list = res.docs.map((doc) => doc.data());

      const check_setting = setting_list.filter(
        (item) => item.user_id === user.id
      );
      if (check_setting.length > 0) {
        setting_data.id = check_setting[0].id;
        await db
          .collection(collection_type)
          .doc(setting_data.id)
          .set(setting_data);
      } else {
        const docRef = await db.collection(collection_type).add(setting_data);
        await db.collection(collection_type).doc(docRef.id).update({
          id: docRef.id,
        });
      }
      toastr.success("Successfully notification setting!");
    } catch (error) {
      toastr.warning(error.message);
    }
  };
  render() {
    const { t } = this.props;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={5} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-bell-o cu-icon-color"></span>
                          <MultiLang text="noticiation_settings" />
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              this.setState({
                                email_notification:
                                  !this.state.email_notification,
                              });
                            }}
                            checked={this.state.email_notification}
                            name="checkedG"
                            className="cu-icon-color"
                          />
                        }
                        label={t("email_notification")}
                      />
                    </div>
                    <div className="atbdb_content_module_contents cu-notification-font">
                      <MultiLang text="event_notification_before" />
                    </div>
                    <div className="atbdb_content_module_contents">
                      <RadioGroup
                        aria-label="delaied"
                        name="delaied"
                        value={this.state.value}
                      >
                        <FormControlLabel
                          value="24 Hours"
                          control={
                            <Radio
                              className="cu-icon-color"
                              onClick={(e) => {
                                this.setState({ value: e.target.value });
                              }}
                            />
                          }
                          label={t("24hours")}
                        />
                        <FormControlLabel
                          value="01 Hour"
                          control={
                            <Radio
                              className="cu-icon-color"
                              onClick={(e) => {
                                this.setState({ value: e.target.value });
                              }}
                            />
                          }
                          label={t("01hours")}
                        />
                      </RadioGroup>
                      <div
                        className="widget atbd_widget widget_claim_listing"
                        style={{ width: "30%" }}
                      >
                        <div
                          onClick={this.onSave}
                          className="btn btn-block btn-gradient btn-gradient-two btn-lg claim-btn cu-radius cu-hover"
                        >
                          <MultiLang text="save_settings" />
                        </div>
                      </div>
                      {/*<!-- ends: .widget -->*/}
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_author_module -->*/}{" "}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    list: state.list,
    login: state.login,
    logo: state.logo,
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(Notification);
