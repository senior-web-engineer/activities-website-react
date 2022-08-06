import { RadioGroup } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import CustomDatePicker from "components/content/element/card/CustomDatePicker";
import { Footer } from "components/layout/footer";
import "date-fns";
import $ from "jquery";
// import { newDate } from "lib/dateLib";
import moment from "moment";
// import { singleIamge } from "../../../../Store/action/auth";
import React, { Component, Fragment } from "react";
import FontAwesome from "react-fontawesome";
import { withTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import { compose } from "redux";
import toastr from "toastr";
import image from "../../../../assets/img/default-img.svg";
import {
  MultiLang,
  ParentInfo,
} from "../../../../components/content/element/widget";
import { setCartInfo } from "../../../../Store/action/widget";
import Subscribe from "../subscribe";
import ProviderTermsDialog from "./termsConditionsDialog";

let bookingData = [];
const initialState = {
  child_dob: moment().format("YYYY-MM-DD  "),
  child_name: "",
  surname: "",
  address: "",
  child_gender: "Male",
  child_image: "",
  child_allergy: "none",
  child_medication: "none",
  emergency_contact_number_1: "",
  emergency_contact_number_2: "",
  option_field2_title: "",
  option_field1_title: "",
  guardians: [],
  // discount: 0,
  // used_coupon_id: "",
  price: null,
  displayPrice: null,
  listingData: [],
  cartId: "",
  total: 0,
  extra_session_id: "main",
  extra_session_title: "",
  custom_terms: false,
};
class BookNow extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }

  UNSAFE_componentWillMount() {
    const editBooking = JSON.parse(sessionStorage.getItem("bookingData"));
    if (editBooking) {
      const filter = editBooking.filter(
        (item) => item.listingData.listing_id === this.props.cartId
      );
      if (filter.length > 0) {
        if (filter[0].extra_session_id === "") {
          filter[0]["extra_session_id"] = "main";
        }
        this.setState(filter[0]);
      } else {
        this.setState({ extra_session_id: this.props.selSession });
      }
    }
  }

  componentDidMount() {
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
    document.addEventListener("keydown", this.escFunction, false);
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    if (bookingData) {
      let total = 0;
      bookingData.map((item) => {
        total = total + item.price;
        return item;
      });
      this.setState({ total: total });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      listingData: nextProps.detailData,
      cartId: nextProps.cartId,
      extra_session_id: nextProps.selSession,
      price: nextProps.detailData.price,
      displayPrice:
        this.state.displayPrice || nextProps.detailData.displayPrice,
    });
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    if (!addressObject.address_components) {
      toastr.info("Select location correctly!");
      return false;
    }
    this.setState({
      address: addressObject.formatted_address,
    });
  }

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  goBack = () => {
    $(window).scrollTop(0);
    $(".short-control").removeClass("hidden");
    $("#booking-modal").removeClass("is-visible");
  };

  addGuardian = () => {
    let data = this.state.guardians;
    let element = { name: "", address: "", phone: "" };
    data = [...data, element];
    this.setState({ guardians: data });
  };

  pDelete = (key) => {
    let data = this.state.guardians;
    data.splice(key, 1);
    this.setState({ guardians: data });
  };

  pUpdate = (key, e, type) => {
    let { guardians } = this.state;
    switch (type) {
      case "ad":
        guardians[key]["address"] = e;
        this.setState({ guardians: guardians });
        break;
      case "ph":
        guardians[key]["phone"] = e;
        this.setState({ guardians: guardians });
        break;
      default:
        guardians[key]["name"] = e;
        this.setState({ guardians: guardians });
        break;
    }
  };

  imageData = (image) => {
    // this.props.singleIamge(image);
    this.setState({ child_image: image });
  };

  setChildBirth = (date) => {
    // const selDate = newDate(date),
    //   mnth = ("0" + (selDate.getMonth() + 1)).slice(-2),
    //   day = ("0" + selDate.getDate()).slice(-2);
    // const birth = [mnth, day, selDate.getFullYear()].join("/");
    // this.setState({ child_dob: birth });
    console.log(date.target.value, "date");
  };

  addCart = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (this.state.child_name === "" || this.state.address === "") {
      toastr.info("Check your name and address!");
      return false;
    }
    if (this.state.extra_session_id === "") {
      toastr.info("Please select session.");
      return false;
    }
    if (user) {
      this.props.setCartInfo(this.state);
    } else {
      bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
      if (!bookingData) {
        bookingData = [];
        bookingData = [...bookingData, this.state];
      } else {
        const flag = bookingData.filter(
          (item) => item.cartId === this.state.cartId
        );
        if (flag.length === 0) {
          bookingData = [...bookingData, this.state];
        } else {
          let element = [];
          bookingData.map((item) => {
            if (item.cartId === this.state.cartId) {
              return (element = [...element, this.state]);
            } else {
              return (element = [...element, item]);
            }
          });
          bookingData = element;
        }
      }
      sessionStorage.setItem("cartCnt", JSON.stringify(bookingData.length));
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    }
    this.props.history.push("/cart");
  };

  goCheckout = () => {
    let bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (this.state.child_name === "" || this.state.address === "") {
      toastr.info("Check your name and address!");
      return false;
    }
    if (this.state.extra_session_id === "") {
      toastr.info("Please select session.");
      return false;
    }
    if (user) {
      this.props.setCartInfo(this.state);
    } else {
      if (!bookingData) {
        bookingData = [];
        bookingData = [...bookingData, this.state];
      } else {
        const flag = bookingData.filter(
          (item) => item.cartId === this.state.cartId
        );
        if (flag.length === 0) {
          bookingData = [...bookingData, this.state];
        } else {
          let element = [];
          bookingData.map((item) => {
            if (item.cartId === this.state.cartId) {
              return (element = [...element, this.state]);
            } else {
              return (element = [...element, item]);
            }
          });
          bookingData = element;
        }
      }
      sessionStorage.setItem("cartCnt", JSON.stringify(bookingData.length));
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    }
    this.props.history.push("/checkout");
  };

  seeMore = () => {
    sessionStorage.removeItem("searchData");
    this.props.history.push("/all-listings-grid");
  };

  render() {
    const { detailData, t } = this.props;
    return (
      <Fragment>
        <div id="booking-modal" className="booking-modal">
          {/* <Header className="menu--light" background="#afdb30" /> */}
          <div className="booking-body">
            <div className="container" style={{ position: "relative" }}>
              <div className="top-go-back" onClick={this.goBack}>
                <FontAwesome name="arrow-left" />
                <span className="gogo-back">
                  <MultiLang text="go_back" />
                </span>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-12">
                      <img
                        src={detailData.img ? detailData.img[0] : image}
                        alt=""
                        className="book-img"
                      />
                    </div>
                    {detailData.camp_type === 2 && (
                      <div className="atbd_thumbnail_overlay_content virtual-book-mark text-white">
                        <MultiLang text="virtual" />
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="book-subdetail">
                        <h4>
                          <MultiLang text="select_sessions" />
                        </h4>
                        <div className="checklist-items feature-checklist hideContent">
                          <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary pl-0">
                            <div>
                              {Object.entries(detailData).length > 0 && (
                                <div className="mb-10">
                                  <input
                                    type="checkbox"
                                    checked={
                                      this.state.extra_session_id === "main"
                                        ? true
                                        : false
                                    }
                                    className="custom-control-input"
                                    onChange={(e) =>
                                      this.setState({
                                        extra_session_id: "main",
                                        price: detailData.price,
                                        displayPrice: detailData.displayPrice,
                                      })
                                    }
                                    id="main"
                                  />
                                  <label
                                    className="custom-control-label pt-0"
                                    htmlFor="main"
                                  >
                                    {`${moment(detailData.start_date).format(
                                      "MMM D, hh:mm a"
                                    )} ~ ${moment(detailData.end_date).format(
                                      "MMM D, YYYY hh:mm a"
                                    )}`}
                                  </label>
                                  <div className="d-flex justify-content-between  p-top-10 p-bottom-10">
                                    <h6 className="p-left-30">
                                      {detailData.title} - {detailData.category}
                                    </h6>{" "}
                                    <h6 className="justify-content-end p-left-10">
                                      {this.props.currency}{" "}
                                      {detailData.displayPrice}
                                    </h6>
                                  </div>
                                  <p className="p-left-30">
                                    {detailData.location}
                                  </p>
                                </div>
                              )}
                              {Object.entries(detailData).length > 0 &&
                                detailData.extraSessions.length > 0 &&
                                detailData.extraSessions.map((item, key) => {
                                  return (
                                    <div className="mb-10" key={key}>
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={
                                          this.state.extra_session_id ===
                                          item.id
                                            ? true
                                            : false
                                        }
                                        onChange={(e) =>
                                          this.setState({
                                            extra_session_id: item.id,
                                            extra_session_title:
                                              item.session_title,
                                            price: item.price,
                                            displayPrice: item.displayPrice,
                                          })
                                        }
                                        id={key}
                                      />
                                      <label
                                        className="custom-control-label pt-0"
                                        htmlFor={key}
                                      >
                                        {`${moment(item.start_date).format(
                                          "MMM D, hh:mm a"
                                        )} ~ ${moment(item.end_date).format(
                                          "MMM D, YYYY hh:mm a"
                                        )}`}
                                      </label>
                                      <div className="d-flex justify-content-between  p-top-10 p-bottom-10">
                                        <h6 className="p-left-30 d-flex">
                                          {item.session_title}
                                        </h6>
                                        <h6 className="justify-content-end p-left-10">
                                          {this.props.currency}{" "}
                                          {item.displayPrice}
                                        </h6>
                                      </div>
                                      <p className="p-left-30">
                                        {item.session_description}
                                      </p>
                                    </div>
                                  );
                                })}
                              {!detailData.custom_terms || (
                                <h5
                                  className="text-center pointer mt-3"
                                  onClick={() =>
                                    this.setState({
                                      custom_terms: !this.state.custom_terms,
                                    })
                                  }
                                >
                                  <MultiLang text="provider_terms_conditions" />
                                </h5>
                              )}
                              {this.state.custom_terms &&
                                detailData.custom_terms === "" && (
                                  <p className="text-center pt-2">
                                    <MultiLang text="there_is_not_yet" />
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="book-ads">
                        <MultiLang text="create_your_bookings" />
                      </h2>
                    </div>
                  </div>
                  <div className="row pt-25">
                    <div className="col-md-12 pt-25 pb-20">
                      <h4>
                        <MultiLang text="attendee_information" />
                      </h4>
                    </div>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-12">
                          <label>
                            <MultiLang text="full_name" /> :
                          </label>
                          <input
                            type="text"
                            name="child_name"
                            className="form-control cu-radius"
                            placeholder={t("full_name")}
                            value={this.state.child_name}
                            onChange={this.setStateFromInput}
                            required
                          />
                        </div>
                        <div className="col-md-12 pt-20">
                          <label>
                            <MultiLang text="gender" /> :
                          </label>
                          <RadioGroup
                            aria-label="delaied"
                            name="delaied"
                            value={this.state.child_gender}
                          >
                            <div className="d-flex justify-content-start">
                              <FormControlLabel
                                value="Male"
                                control={
                                  <Radio
                                    className="cu-icon-color"
                                    onClick={(e) => {
                                      this.setState({
                                        child_gender: "Male",
                                      });
                                    }}
                                  />
                                }
                                label="Male"
                              />
                              <FormControlLabel
                                value="Female"
                                control={
                                  <Radio
                                    className="cu-icon-color"
                                    onClick={(e) => {
                                      this.setState({
                                        child_gender: "Female",
                                      });
                                    }}
                                  />
                                }
                                label="Female"
                              />
                              <FormControlLabel
                                value="not"
                                control={
                                  <Radio
                                    className="cu-icon-color"
                                    onClick={(e) => {
                                      this.setState({
                                        child_gender: "not",
                                      });
                                    }}
                                  />
                                }
                                label="Prefer not to say"
                              />
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="col-md-6">
                          <label>
                            <MultiLang text="date_of_birth" /> :
                          </label>
                          {/* <MaterialUIPickers
                            date={this.state.child_dob}
                            handleSetDate={this.setChildBirth}
                          /> */}
                          <CustomDatePicker
                            className="form-control"
                            value={this.state.child_dob}
                            onChange={(e) => this.setState({ child_dob: e })}
                          />
                        </div>
                        <div className="col-md-6 book-phone">
                          <label>
                            <MultiLang text="emergency_number" />:
                          </label>
                          <PhoneInput
                            country={"us"}
                            name="emergency_contact_number_1"
                            value={this.state.emergency_contact_number_1}
                            onChange={(phone) =>
                              this.setState({
                                emergency_contact_number_1: phone,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-25">
                    <div className="col-md-12">
                      <label>
                        <MultiLang text="address" /> :
                      </label>
                      <input
                        id="autocomplete"
                        className="form-control"
                        defaultValue={this.state.address}
                        placeholder={t("address")}
                        ref="input"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="row pt-25">
                    <div className="col-md-6">
                      <label>
                        <MultiLang text="allergy" /> :
                      </label>
                      <input
                        type="text"
                        name="child_allergy"
                        className="form-control cu-radius"
                        placeholder={t("name")}
                        value={this.state.child_allergy}
                        onChange={this.setStateFromInput}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>
                        <MultiLang text="medication" /> :
                      </label>
                      <input
                        type="text"
                        name="child_medication"
                        className="form-control cu-radius"
                        placeholder={t("name")}
                        value={this.state.child_medication}
                        onChange={this.setStateFromInput}
                        required
                      />
                    </div>
                  </div>
                  {detailData.option_field1_title && (
                    <div className="row pt-25">
                      <div className="col-md-12">
                        <label>{detailData.option_field1_title}</label>
                        <input
                          className="form-control"
                          value={this.state.option_field1_title}
                          type="text"
                          placeholder="Enter a answer"
                          onChange={(e) =>
                            this.setState({
                              option_field1_title: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {detailData.option_field2_title && (
                    <div className="row pt-25">
                      <div className="col-md-12">
                        <label>{detailData.option_field2_title}</label>
                        <input
                          className="form-control"
                          value={this.state.option_field2_title}
                          type="text"
                          placeholder="Enter a answer"
                          onChange={(e) =>
                            this.setState({
                              option_field2_title: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {/* Add Guardians Info */}

                  <div className="row pt-25">
                    <div className="add-other-guardian">
                      <p onClick={this.addGuardian}>
                        + <MultiLang text="add_parents" />
                      </p>
                    </div>
                  </div>
                  <ParentInfo
                    padd={this.state.guardians}
                    pupdate={this.pUpdate}
                    pdelete={this.pDelete}
                    placename={t("name")}
                    placeaddress={t("address")}
                  />

                  <div className="row hidden-xs">
                    <div className="col-md-12">
                      <h3
                        style={{
                          textAlign: "right",
                          fontSize: 28,
                          padding: 10,
                          color: "#358804",
                        }}
                      >
                        <MultiLang text="Total" />: {this.props.currency}{" "}
                        {this.state.displayPrice}
                      </h3>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="right-button cart-botton"
                        onClick={this.addCart}
                      >
                        <MultiLang text="add_to_cart" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="right-button tocheckout-botton"
                        onClick={this.goCheckout}
                      >
                        <MultiLang text="checkout" />
                      </div>
                    </div>
                    {/* <div className="col-md-6 offset-md-3">
                      <div
                        className="right-button continue-botton"
                        onClick={this.seeMore}
                      >
                        <MultiLang text="show_more" />{" "}
                        <MultiLang text="activities" />
                      </div>
                    </div> */}
                  </div>
                  <div className="mobile-booking-box">
                    <h4 className="text-center">
                      <MultiLang text="Total" />: {this.props.currency}{" "}
                      {this.state.displayPrice}
                    </h4>
                    <div>
                      <button
                        className="mobile-checkout-btn"
                        onClick={this.goCheckout}
                      >
                        <MultiLang text="add_to_cart" />
                      </button>
                    </div>
                    <div>
                      <button
                        className="mobile-add-cart"
                        onClick={this.goCheckout}
                      >
                        <MultiLang text="checkout" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="listing-detail-footer-section">
            <Subscribe />
            <Footer />
          </div>
        </div>
        {detailData.custom_terms !== "" && (
          <ProviderTermsDialog
            open={this.state.custom_terms}
            handleClose={() => this.setState({ custom_terms: false })}
            termCondition={detailData.custom_terms}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.app.currency.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // singleIamge: (image) => dispatch(singleIamge(image)),
    setCartInfo: (data) => dispatch(setCartInfo(data)),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookNow);
