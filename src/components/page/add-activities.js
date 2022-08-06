import Alert from "@material-ui/lab/Alert";
import $ from "jquery";
import moment from "moment";
import React, { Component, Fragment } from "react";
import FontAwesome from "react-fontawesome";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import toastr from "toastr";
import back from "../../assets/img/add-listing.jpg";
import inPersonImg from "../../assets/img/children.svg";
import virtualImg from "../../assets/img/developer.svg";
import ImageUploader from "../../components/content/element/image-uploader";
import {
  MultiLang,
  SessionDate,
} from "../../components/content/element/widget";
import { getBannerImage, getCategories } from "../../Store/action/categories";
import { FirebaseUpload } from "../../Store/action/imageUpload";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import SessionDateInput from "../content/element/card/session-date-input";
import { Footer } from "../layout/footer";
import Header from "../layout/header";

const initialState = {
  category_list: [],
  term_flag: false,
  prevAddress: {},
  ad_title: "",
  ad_description: "",
  category_id: "",
  category_name: "All",
  address: "",
  remaing_availability: 20,
  price: 50,
  availability: 20,
  start_time: "09:00",
  end_time: "18:00",
  start_date: moment().format("YYYY-MM-DD"),
  end_date: moment().format("YYYY-MM-DD"),
  sessions: [],
  is_feature_day_remaining: 0,
  is_feature_plan: "",
  is_feature: "1",
  picture: [],
  id: "",
  status: "1",
  remember_bring: "",
  timestamp: "",
  video: "",
  date: "",
  ad_click: 0,
  ad_view: 0,
  camp_type: 1,
  age_group_list: [],
  group_name: "All",
  option_field1_title: "",
  option_field2_title: "",
  custom_terms: "",
  virtual_link: "",
  covid_precautions: "",
};
class AddListing extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setStateFromInput = this.setStateFromInput.bind(this);
    this.addActivity = this.addActivity.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }

  reset = () => {
    this.setState(initialState);
  };

  UNSAFE_componentWillMount() {
    const role = JSON.parse(sessionStorage.getItem("role"));
    this.props.getBannerImage("/add-activity");
    if (role) {
      if (role === "user") {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push("/");
    }
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.getCategories();
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      { types: ["geocode"] }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // if (nextProps?.list && nextProps?.list?.length > 0) {
    // const adData = nextProps?.list[0] ?? {};
    const adData = nextProps?.location?.state?.list ?? {};
    let sessions = [];
    if ((adData?.sessions ?? []).length > 0) {
      sessions = adData.sessions.map((item) => {
        const startDate = moment(item?.start_date?.seconds * 1000).format(
          "YYYY-MM-DD"
        );
        const endDate = moment(item?.end_date?.seconds * 1000).format(
          "YYYY-MM-DD"
        );
        const element = {
          availability: item?.availability || 50,
          camp_type: item?.camp_type ?? 1,
          end_date: endDate,
          end_time: item.end_time,
          price: item.price,
          remaing_availability: item?.remaing_availability ?? "",
          session_description: item?.session_description ?? "",
          session_title: item?.session_title ?? "",
          start_date: startDate,
          start_time: item?.start_time ?? "",
          virtual_link: item?.virtual_link ?? "",
        };
        return element;
      });
    }
    this.setState({
      category_list: nextProps.categories,
      age_group_list: nextProps.groupData,
      term_flag: true,
      ad_title: adData.ad_title,
      ad_description: adData.ad_description,
      category_name: adData.category_name,
      prevAddress: adData.address ? adData.address : this.state.address,
      address: adData.address
        ? `${adData.address.street}, ${adData.address.city}, ${adData.address.state}, ${adData.address.country}`
        : "",
      start_date: Boolean(adData?.start_date)
        ? moment(adData.start_date.seconds * 1000).format("YYYY-MM-DD")
        : this.state.start_date,
      end_date: Boolean(adData?.end_date)
        ? moment(adData.end_date.seconds * 1000).format("YYYY-MM-DD")
        : this.state.end_date,

      end_time: adData?.end_time || this.state.end_time,
      start_time: adData?.start_time || this.state.start_time,
      picture: adData?.picture || this.state.picture,
      remember_bring: adData?.remember_bring || this.state.remember_bring,
      video: "",
      sessions: sessions,
      option_field2_title:
        adData?.option_field2_title || this.state.option_field2_title,
      option_field1_title:
        adData?.option_field1_title || this.state.option_field1_title,
      custom_terms: adData?.custom_terms || this.state.custom_terms,
      price: adData?.displayPrice || this.state.price,
      group_name: adData?.age_group?.name || this.state.group_name,
      availability: adData?.availability || this.state.availability,
      camp_type: adData?.camp_type || this.state.camp_type,
      status: adData?.status || this.state.status,
      virtual_link: adData?.virtual_link || this.state.virtual_link,
    });
    // }
    // this.setState({
    //   category_list: nextProps.categories,
    //   age_group_list: nextProps.groupData,
    // });
  }

  componentDidUpdate() {
    $(".bg_image_holder").each(function () {
      var imgLink = $(this).children().attr("src");
      $(this)
        .css({
          "background-image": "url('" + imgLink + "')",
          opacity: "1",
        })
        .children();
    });
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;
    if (!address) {
      toastr.info("Select location correctly!");
      return false;
    }
    let addressForm = {
      street_number: "short_name",
      route: "long_name",
      sublocality: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      administrative_area_level_2: "short_name",
      country: "short_name",
      postal_code: "short_name",
    };
    address.forEach((item) => {
      const addressType = item.types[0];
      addressForm[addressType] = item[addressForm[addressType]];
    });
    if (addressForm.street_number === "short_name") {
      addressForm["street_number"] = "";
    }
    if (addressForm.route === "long_name") {
      addressForm["route"] = "";
    }
    const place = {
      street: addressForm.street_number + " " + addressForm.route,
      city: addressForm.locality === "long_name" ? "" : addressForm.locality,
      state:
        addressForm.administrative_area_level_1 === "short_name"
          ? ""
          : addressForm.administrative_area_level_1,
      country: addressForm.country === "short_name" ? "" : addressForm.country,
      postal_code:
        addressForm.postal_code === "short_name" ? "" : addressForm.postal_code,
    };
    this.setState({
      address: place,
    });
  }

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  addDate = () => {
    let sessions = this.state.sessions;
    const element = {
      start_time: this.state.start_time,
      end_date: this.state.end_date,
      start_date: this.state.start_date,
      end_time: this.state.end_time,
      camp_type: this.state.camp_type,
      price: 100,
      availability: 50,
      remaing_availability: 50,
      session_description: "",
      session_title: "",
      virtual_link: this.state.virtual_link,
    };
    sessions = [...sessions, element];
    this.setState({ sessions: sessions });
  };

  deleteDate = (i) => {
    let curSessions = this.state.sessions;
    curSessions.splice(i, 1);
    this.setState({ sessions: curSessions });
  };

  updateDate = (i, e, type) => {
    const sessions = this.state.sessions;
    let newSessions = [];
    sessions.forEach((item, key) => {
      if (key === i) {
        switch (type) {
          case "pr":
            item.price = e;
            break;
          case "ti":
            item.session_title = e;
            break;
          case "att":
            item.availability = e;
            item.remaing_availability = e;
            break;
          case "des":
            item.session_description = e;
            break;
          case "sd":
            item.start_date = moment(e).format("YYYY-MM-DD");
            break;
          case "ed":
            item.end_date = moment(e).format("YYYY-MM-DD");
            break;
          case "st":
            item.start_time = e;
            break;
          default:
            item.end_time = e;
            break;
        }
      }
      newSessions = [...newSessions, item];
    });
    this.setState({ sessions: newSessions });
  };

  addActivity = (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const mstartDate = moment(this.state.start_date).unix();
    const mendDate = moment(this.state.end_date).unix();
    if (mstartDate > mendDate) {
      toastr.info(
        "Please check sessions. The end date must be behind the start date!"
      );
      return false;
    }
    if (this.state.sessions.length > 0) {
      let flag = true;
      this.state.sessions.forEach((item) => {
        const mstartDate = moment(item.start_date).unix();
        const mendDate = moment(item.end_date).unix();
        if (mstartDate > mendDate) {
          toastr.info(
            "Please check sessions. The end date must be behind the start date!"
          );
          flag = false;
        }
      });
      if (!flag) {
        return false;
      }
    }
    if (user.holdon_account) {
      toastr.info(
        "Your account is currently blocked to add new Camps, please contact the Administrator"
      );
      return false;
    }
    if (this.state.camp_type === 2 && this.state.virtual_link === "") {
      toastr.info("Please check virtual field again!");
      return false;
    }
    if (
      this.state.ad_title === "" ||
      this.state.ad_description === "" ||
      this.state.address === ""
    ) {
      toastr.info("Please check field again!");
      return false;
    } else if (
      this.state.category_name === "All" ||
      this.state.group_name === "All"
    ) {
      toastr.info("Please check category and age group!");
      return false;
    }
    if (this.state.picture.length === 0) {
      toastr.info("You must upload the at least one image!");
      return;
    }
    if (!this.state.term_flag) {
      toastr.info("Please check term & conditions");
      return false;
    }
    this.props.firebaseUpload(this.state, this.props.history);
    $("#normal-submit").addClass("hidden");
    $("#uploading").removeClass("hidden");
  };

  setImageList = (imageList) => {
    this.setState({ picture: imageList });
  };

  render() {
    const light = this.props.logo[0].light;
    const { t } = this.props;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage">
          <div className="bg_image_holder">
            <img
              src={this.props.heroImage !== "" ? this.props.heroImage : back}
              alt=""
            />
          </div>
          <div className="mainmenu-wrapper">
            <Header
              logo={light}
              className="menu--light"
              history={this.props.history}
            />
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
          <BreadcrumbWraper title={t("add_activity")} />
        </section>
        {/* Header section end */}

        <section className="add-listing-wrapper border-bottom section-bg section-padding-strict">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-user"></span>
                        <MultiLang text="general_info" />
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <h5>
                      <MultiLang text="camp_type" />
                    </h5>
                    <div className="p-left-20 p-top-10">
                      <div className="camp-type-div">
                        <div className="form-check" style={{ top: "25%" }}>
                          <input
                            className="form-check-input radio-btn p-bottom-10"
                            type="radio"
                            name="inperson"
                            id="inperson"
                            checked={this.state.camp_type === 1 ? true : false}
                            onChange={(e) => this.setState({ camp_type: 1 })}
                          />
                          <label
                            className="form-label radio-label"
                            htmlFor="inperson"
                          >
                            <MultiLang text="in_person_provider" />
                          </label>
                        </div>
                        <img
                          className="virtual-img m-bottom-10"
                          src={inPersonImg}
                          alt=""
                        />
                      </div>
                      <div className="camp-type-div">
                        <div className="form-check" style={{ top: "25%" }}>
                          <input
                            className="form-check-input radio-btn"
                            type="radio"
                            name="virtual"
                            id="virtual"
                            checked={this.state.camp_type === 2 ? true : false}
                            onChange={(e) => this.setState({ camp_type: 2 })}
                          />
                          <label
                            className="form-label radio-label"
                            htmlFor="virtual"
                          >
                            <MultiLang text="virtual" />
                          </label>
                        </div>
                        <img
                          className="virtual-img m-bottom-10"
                          src={virtualImg}
                          alt=""
                        />
                      </div>
                    </div>
                    {this.state.camp_type === 2 && (
                      <div>
                        <input
                          type="text"
                          name="virtual-link"
                          className="form-control"
                          id="virtual-link"
                          value={this.state.virtual_link}
                          placeholder={t("camp_link_googlemeet_zoom")}
                          onChange={(e) =>
                            this.setState({ virtual_link: e.target.value })
                          }
                          required
                        />
                        <p className="p-top-15 p-left-15">
                          <MultiLang text="this_link_will_only" />
                          <br />
                          <MultiLang text="access_control_must" />
                        </p>
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        <MultiLang text="activity" /> <MultiLang text="name" />
                      </label>
                      <input
                        type="text"
                        name="ad_title"
                        className="form-control"
                        id="title"
                        value={this?.state?.ad_title ?? ""}
                        placeholder={`${t("activity")} ${t("name")}`}
                        onChange={this.setStateFromInput}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="desc" className="form-label">
                        <MultiLang text="activity" />{" "}
                        <MultiLang text="description" />
                      </label>
                      <textarea
                        id="desc"
                        name="ad_description"
                        rows="8"
                        value={this.state.ad_description}
                        className="form-control"
                        placeholder={t("description")}
                        onChange={this.setStateFromInput}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="custom-field" className="form-label">
                        <MultiLang text="category" />
                      </label>
                      <div className="select-basic">
                        <select
                          className="form-control"
                          value={this.state.category_name}
                          onChange={(e) => {
                            this.setState({ category_name: e.target.value });
                          }}
                        >
                          <option value="All">
                            {t("select_category_list")}
                          </option>
                          {Object.values(this.props.categories).map(
                            (value, key) => {
                              return (
                                <option key={key} value={value.category}>
                                  {value.category}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="custom-field" className="form-label">
                        <MultiLang text="age_group" />
                      </label>
                      <div className="select-basic">
                        <select
                          className="form-control"
                          value={this.state.group_name}
                          onChange={(e) => {
                            this.setState({ group_name: e.target.value });
                          }}
                        >
                          <option value="All">{t("select_age_group")}</option>
                          {this.props.groupData.map((value, key) => {
                            return (
                              <option key={key} value={value.name}>
                                {value.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    {/*<!-- ends: .form-group -->*/}
                    <div className="form-group">
                      <label htmlFor="short_desc" className="form-label">
                        <MultiLang text="remember_to_bring" />
                      </label>
                      <textarea
                        id="short_desc"
                        name="remember_bring"
                        rows="5"
                        className="form-control"
                        placeholder={t("if_participants_need")}
                        value={this.state.remember_bring}
                        onChange={this.setStateFromInput}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="question1" className="form-label">
                        <MultiLang text="custom_field" /> 1 (
                        <MultiLang text="optional" />)
                      </label>
                      <input
                        type="text"
                        id="question1"
                        className="form-control"
                        value={this.state.option_field1_title || ""}
                        onChange={(e) =>
                          this.setState({
                            option_field1_title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="question2" className="form-label">
                        <MultiLang text="custom_field" /> 2 (
                        <MultiLang text="optional" />)
                      </label>
                      <input
                        type="text"
                        id="question2"
                        className="form-control"
                        value={this.state.option_field2_title || ""}
                        onChange={(e) =>
                          this.setState({
                            option_field2_title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="custom_terms" className="form-label">
                        <MultiLang text="custom_terms" /> (
                        <MultiLang text="optional" />)
                      </label>
                      <textarea
                        id="custom_terms"
                        name="custom_terms"
                        className="form-control"
                        rows="5"
                        placeholder={t("this_terms_will_be_included")}
                        value={this.state.custom_terms}
                        onChange={this.setStateFromInput}
                      ></textarea>
                    </div>
                    {this.state.camp_type === 1 && (
                      <div className="form-group">
                        <label htmlFor="covid-19" className="form-label">
                          <MultiLang text="covid_precautions" />
                        </label>
                        <textarea
                          name="covid_precautions"
                          id="covid_precautions"
                          className="form-control"
                          cols="30"
                          rows="3"
                          value={
                            this.state.covid_precautions || t("covid_desc")
                          }
                          onChange={this.setStateFromInput}
                        ></textarea>
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        <MultiLang text="address" />
                      </label>
                      <input
                        id="autocomplete"
                        className="form-control"
                        defaultValue={this.state.address}
                        ref="input"
                        type="text"
                        placeholder={t("address")}
                      />
                    </div>
                  </div>
                  {/*<!-- ends: .atbdb_content_module_contents -->*/}
                </div>
                {/*<!-- ends: .atbd_content_module -->*/}
              </div>
              {/*<!-- ends: .col-lg-10 -->*/}

              <div className="col-lg-10 offset-lg-1">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-calendar"></span>
                        <MultiLang text="sessions" />
                      </h4>
                    </div>
                  </div>
                  <div
                    className="atbdb_content_module_contents"
                    style={{ paddingBottom: 0, paddingTop: "5px" }}
                  >
                    <h6 className="p-top-10 p-bottom-10">
                      <MultiLang text="main_session" /> :
                    </h6>
                    <div
                      className="directorist row atbdp_faqs_wrapper cu-input-padding m-left-10"
                      id="faqsID-0"
                    >
                      <div className="col-md-6 col-sm-12 mb-20">
                        <div className="form-group">
                          <label htmlFor="title" className="form-label">
                            <MultiLang text="pricing" />{" "}
                            {`(${
                              JSON.parse(sessionStorage.getItem("store"))
                                ?.currency?.value || "USD"
                            })`}
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={this.state.price}
                            onChange={(e) =>
                              this.setState({ price: e.target.value })
                            }
                            className="form-control"
                            placeholder={t("pricing")}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 mb-20">
                        <div className="form-group">
                          <label className="form-label">
                            <MultiLang text="attendees" />
                          </label>
                          <input
                            type="number"
                            name="attendees"
                            className="form-control"
                            value={this.state.availability}
                            onChange={(e) =>
                              this.setState({
                                availability: e.target.value,
                                remaing_availability: e.target.value,
                              })
                            }
                            placeholder={t("enter_attendees_num")}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="row">
                          <div className="col-sm-7 d-flex justify-content-center align-items-center">
                            <div className="form-group">
                              <SessionDateInput
                                date={this.state.start_date}
                                handleSetDate={(newStartDate) =>
                                  this.setState({ start_date: newStartDate })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-sm-5 d-flex justify-content-center align-items-center">
                            <div className="form-group">
                              <input
                                type="time"
                                placeholder="Start"
                                onChange={(e) =>
                                  this.setState({ start_time: e.target.value })
                                }
                                name=""
                                value={this.state.start_time}
                                className="form-control atbdp_faqs_quez"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="row">
                          <div className="col-sm-7 d-flex justify-content-center align-items-center">
                            <div className="form-group">
                              <SessionDateInput
                                date={this.state.end_date}
                                handleSetDate={(newEndDate) =>
                                  this.setState({ end_date: newEndDate })
                                }
                              />
                              {/* <input
                                type="date"
                                placeholder="End"
                                value={this.state.end_date}
                                onChange={(e) =>
                                  this.setState({ end_date: e.target.value })
                                }
                                className="form-control atbdp_faqs_quez"
                              /> */}
                            </div>
                          </div>
                          <div className="col-sm-5 d-flex justify-content-center align-items-center">
                            <div className="form-group">
                              <input
                                type="time"
                                value={this.state.end_time}
                                onChange={(e) =>
                                  this.setState({ end_time: e.target.value })
                                }
                                placeholder="Start"
                                className="form-control atbdp_faqs_quez"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="atbdb_content_module_contents"
                    style={{ paddingTop: 0 }}
                  >
                    <h6 className="p-top-10 p-bottom-10">
                      <MultiLang text="extra_session" /> :
                    </h6>
                    {this.state.sessions.length > 0 ? (
                      <SessionDate
                        sessions={this.state.sessions}
                        onUpdate={this.updateDate}
                        onDelete={this.deleteDate}
                        price={this.state.price}
                      />
                    ) : (
                      <Alert
                        className="m-bottom-15"
                        variant="filled"
                        severity="info"
                      >
                        <MultiLang text="you_can_add_extra_session" />
                      </Alert>
                    )}
                    <button
                      type="button"
                      className="cu-hover extra-sesson-btn"
                      onClick={this.addDate}
                    >
                      <span className="plus-sign">+</span>
                      <MultiLang text="add_extra_session" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-10 offset-lg-1 p-0">
              <div className="atbd_content_module cu-radius">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-calendar-check-o"></span>{" "}
                      <MultiLang text="images_video" />
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  {/* {list && list.length > 0 ? (
                    <ImageUploader
                      url={list[0].picture}
                      handleChangeImages={this.setImageList}
                    />
                  ) : (
                    <ImageUploader
                      url={[]}
                      handleChangeImages={this.setImageList}
                    />
                  )} */}
                  <ImageUploader
                    url={this?.state?.picture ?? []}
                    handleChangeImages={this.setImageList}
                  />

                  <div className="form-group m-top-30">
                    <label htmlFor="videourl" className="not_empty form-label">
                      <MultiLang text="video_url" />
                    </label>
                    <input
                      type="text"
                      id="videourl"
                      name="video"
                      onChange={this.setStateFromInput}
                      value={this.state.video}
                      className="form-control directory_field"
                      placeholder={t("youtube_video_url")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-10 offset-lg-1 text-center">
              <div
                className="atbd_term_and_condition_area custom-control custom-checkbox checkbox-outline checkbox-outline-primary"
                onClick={(e) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    term_flag: !this.state.term_flag,
                  }));
                }}
                style={{
                  cursor: "pointer",
                  display: "-webkit-inline-box",
                  alignItems: "center",
                }}
              >
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="listing_t"
                    checked={this.state.term_flag || false}
                    onChange={(e) => {
                      this.setState((prevState) => ({
                        ...prevState,
                        term_flag: !this.state.term_flag,
                      }));
                    }}
                    id="listing_t"
                  />
                  <label
                    onClick={(e) => {
                      this.setState((prevState) => ({
                        ...prevState,
                        term_flag: !this.state.term_flag,
                      }));
                    }}
                    htmlFor="listing_t"
                    className="ml-2"
                  >
                    <MultiLang text="i_agree_with_all" /> &nbsp;
                  </label>
                </div>

                <a
                  href="https://www.activities.app/provider-terms-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  <MultiLang text="activity_terms_conditions" />
                </a>
                {/* </label> */}
              </div>
              <div className="btn_wrap list_submit m-top-25">
                <button
                  className="btn btn-primary btn-lg listing_submit_btn"
                  onClick={this.addActivity}
                >
                  <span id="normal-submit">
                    <MultiLang text="submit_activity" />
                  </span>
                  <span id="uploading" className="hidden">
                    <FontAwesome name="spinner" className="loading-icon" spin />
                    <MultiLang text="upLoading" />
                  </span>
                </button>
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
    logo: state.logo,
    categories: state.category.categories,
    heroImage: state.category.hero_image,
    groupData: state.category.groupData,
    list: state.list.advListing,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: () => dispatch(getCategories()),
    firebaseUpload: (data, url) => dispatch(FirebaseUpload(data, url)),
    getBannerImage: (page) => dispatch(getBannerImage(page)),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(AddListing);
