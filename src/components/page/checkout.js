import React, { Fragment, Component } from "react";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { connect } from "react-redux";
import back from "../../assets/img/checkout.jpg";
import FontAwesome from "react-fontawesome";
import Radio from "@material-ui/core/Radio";
import { RadioGroup } from "@material-ui/core";
import image from "../../assets/img/default-img.svg";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddCard from "../content/element/modal/add-card";
import PromoCode from "../../components/content/element/modal/promoCode";
import couponImg from "../../assets/img/coupon.svg";
import $ from "jquery";
import {
  getPaymentInfo,
  bookingPay,
  getAdminCouponList,
  // getCartInfo,
} from "../../Store/action/widget";
import { setCouponInfo } from "../../Store/action/bankAction";
import { getBannerImage } from "../../Store/action/categories";

import toastr from "toastr";
import { MultiLang } from "components/content/element/widget";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import moment from "moment";

class CheckoutBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      address: "",
      open: false,
      cardInfo: [],
      paymentMethod: "",
      load: false,
      promo_type: "",
      prev_promoCode: "",
      promocodeList: [],
    };
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }

  UNSAFE_componentWillMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.props.getBannerImage("/checkout");
    if (!user) {
      sessionStorage.setItem("url", JSON.stringify("checkout"));
      this.props.history.push("/sign-in");
    } else {
      // this.props.getCartInfo();
    }
    this.setState({ load: false, promoCodeList: [] });
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

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
    this.props.getAdminCouponList();
    this.props.getPaymentInfo();
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      const fullName = userData.name.split(" ");
      this.setState({
        name: fullName[0],
        surname: fullName[1],
        address: userData.address,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    nextProps.cartInfo.map((item) => {
      if (
        item.listingData.couponType !== "" &&
        item.listingData.couponType === "admin"
      ) {
        this.setState({ promo_type: "admin" });
      } else if (
        item.listingData.couponType !== "" &&
        item.listingData.couponType === "advertiser"
      ) {
        this.setState({ promo_type: "advertiser" });
      }
      if (item.extra_session_id !== "") {
        item.listingData.extraSessions.forEach((session) => {
          if (session.id === item.extra_session_id) {
            item.listingData["start_date"] = session.start_date;
            item.listingData["end_date"] = session.end_date;
            item.listingData["start_time"] = session.start_time;
            item.listingData["end_time"] = session.end_time;
          }
        });
      }
      return item;
    });
    this.setState({ cardInfo: nextProps.cardInfo });
    sessionStorage.setItem(
      "cartCnt",
      JSON.stringify(nextProps.cartInfo.length)
    );
    sessionStorage.setItem("bookingData", JSON.stringify(nextProps.cartInfo));
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

  handleSetCouponInfo = (selCouponInfo) => {
    this.props.setCouponInfo(
      this.state.promo_type,
      selCouponInfo,
      this.props.cartInfo,
      this.props.adminCouponList
    );
    this.setState({ open: false });
  };

  payBooking = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toastr.info("You must sign in");
      return false;
    }
    if (this.state.cardInfo.length === 0 || this.state.paymentMethod === "") {
      toastr.info("Select your card Infomation!");
      return false;
    }
    if (this.props.cartInfo.length === 0) {
      toastr.info("There is no booking information! Please book activities");
      return false;
    }
    this.props.bookingPay(
      this.state.paymentMethod,
      this.props.history,
      this.props.cartInfo,
      this.props.adminCouponList
    );
    this.setState({ load: true });
  };

  render() {
    const { cardInfo, cartInfo, t } = this.props;
    const light = this.props.logo[0].light;
    let totalAmount = 0,
      couponCheck = false,
      discount = 0;
    cartInfo &&
      cartInfo.forEach((item) => {
        totalAmount = totalAmount + item.displayPrice;
        if (item?.price_paid >= 0) {
          discount = discount + item.price_paid;
          couponCheck = true;
        } else {
          discount += item.displayPrice;
        }
      });
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
              class="menu--light"
              history={this.props.history}
            />
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
          <BreadcrumbWraper title={t("checkout")} />
        </section>
        {/* Header section end */}

        <section className="checkout-wrapper section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex align-items-center m-bottom-20">
                  <h3 className="cart-title mb-0">
                    <MultiLang text="shopping_cart" />
                  </h3>
                  {this.props.adminCouponList &&
                    cartInfo.length > 0 &&
                    this.props.adminCouponList.length > 0 && (
                      <button
                        className="btn btn-xs btn-gradient btn-gradient-two m-left-10"
                        style={{
                          background:
                            this.state.promo_type === "admin" && "#c87414",
                        }}
                        onClick={(e) =>
                          this.setState((prevState) => ({
                            open: true,
                            promoCodeList: this.props.adminCouponList,
                            promo_type: "admin",
                            prev_promoCode: prevState.promo_type,
                          }))
                        }
                      >
                        <img className="m-right-10" src={couponImg} alt="" />
                        {this.state.promo_type === "admin" ? (
                          <MultiLang text="promocode_applied" />
                        ) : (
                          <MultiLang text="add_promocode_all" />
                        )}
                      </button>
                    )}
                </div>
                <div className="cart-content">
                  {cartInfo ? (
                    cartInfo.map((item, key) => {
                      return (
                        <div className="cart-detail" key={key}>
                          <div className="cart-price">
                            {this.props.currency} {item.displayPrice}
                          </div>
                          <div className="row">
                            <div className="col-md-3 col-sm-3">
                              <div className="checkout-thumb">
                                <img
                                  src={
                                    item.listingData.img
                                      ? item.listingData.img[0]
                                      : image
                                  }
                                  alt=""
                                  className="cart-img"
                                />
                              </div>
                              {item.listingData.camp_type === 2 && (
                                <div className="virtual-mark1">
                                  <MultiLang text="virtual" />
                                </div>
                              )}
                            </div>
                            <div className="col-md-8 col-sm-8">
                              <div className="row">
                                <div className="col-md-12 cart-description">
                                  <div className="d-flex align-items-center">
                                    <h3 className="mb-0">
                                      {item.listingData.title}
                                    </h3>
                                    {item.listingData.couponList.length > 0 && (
                                      <button
                                        className="btn btn-xs btn-gradient btn-gradient-two m-left-10"
                                        style={{
                                          background:
                                            this.state.promo_type ===
                                              "advertiser" &&
                                            item.listingData.couponType ===
                                              "advertiser" &&
                                            "#c87414",
                                        }}
                                        onClick={(e) =>
                                          this.setState((prevState) => ({
                                            open: true,
                                            prev_promoCode:
                                              prevState.promo_type,
                                            promoCodeList:
                                              item.listingData.couponList,
                                            promo_type: "advertiser",
                                          }))
                                        }
                                      >
                                        <img
                                          className="m-right-10"
                                          src={couponImg}
                                          alt=""
                                        />
                                        {this.state.promo_type ===
                                          "advertiser" &&
                                        item.listingData.couponType ===
                                          "advertiser" ? (
                                          <MultiLang text="promocode_applied" />
                                        ) : (
                                          <MultiLang text="add_promocode" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                  <p>
                                    {/* <FontAwesome name="map-marker" /> */}{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="category" />:
                                    </span>{" "}
                                    {item.listingData.category}
                                  </p>
                                  <p>
                                    <FontAwesome name="map-marker" />{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="address" />:
                                    </span>{" "}
                                    {item.listingData.location}
                                  </p>
                                  <p>
                                    <FontAwesome
                                      name="users"
                                      style={{ marginLeft: "-2px" }}
                                    />
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="attendee" />:
                                    </span>
                                    {item.child_name + " " + item.surname}
                                  </p>
                                  <p>
                                    <FontAwesome name="calendar" />
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="session" />:
                                    </span>
                                    {`${moment(
                                      item.listingData.start_date
                                    ).format("MMM D, hh:mm a")} ~ ${moment(
                                      item.listingData.end_date
                                    ).format("MMM D, YYYY hh:mm a")}`}
                                  </p>

                                  <PromoCode
                                    open={this.state.open}
                                    promoCodeList={this.state.promoCodeList}
                                    onSetCouponInfo={this.handleSetCouponInfo}
                                    onClose={(e) =>
                                      this.setState({
                                        open: false,
                                        promoCodeList: [],
                                        promo_type: this.state.prev_promoCode,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div>
                      <MultiLang text="there_is_not_yet" />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12 pb-20">
                <div className="total-price">
                  <div className="total-price-num">
                    <h2>
                      <MultiLang text="total" />({cartInfo.length}{" "}
                      <MultiLang text="activity" />
                      ):{" "}
                      {JSON.parse(localStorage.getItem("store"))?.currency
                        ?.value || "USD"}{" "}
                      {totalAmount.toFixed(2)}
                    </h2>
                    {couponCheck && (
                      <h4 className="m-bottom-10 text-right">
                        <MultiLang text="paid_coupon" />: $
                        {discount > 0 ? discount : "free"}
                      </h4>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="confirm-part">
                  <div>
                    <h4 className="pb-20">
                      <MultiLang text="billing_info" />
                    </h4>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firsname" className="form-label">
                          <MultiLang text="name" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firsname"
                          value={this.state.name}
                          onChange={(e) =>
                            this.setState({ name: e.target.value })
                          }
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastname" className="form-label">
                          <MultiLang text="surname" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="surname"
                          value={this.state.surname}
                          onChange={(e) =>
                            this.setState({ surname: e.target.value })
                          }
                          placeholder="Enter your surname"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="address" className="form-label">
                          <MultiLang text="address" />
                        </label>
                        <input
                          id="autocomplete"
                          className="form-control"
                          defaultValue={this.state.address}
                          ref="input"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="card-box">
                  <div>
                    <h4>
                      <MultiLang text="saved_card" />
                    </h4>
                  </div>
                  <div className="card-list">
                    <RadioGroup
                      aria-label="delaied"
                      name="delaied"
                      value={this.state.value}
                    >
                      {cardInfo && cardInfo.length > 0 ? (
                        cardInfo.map((item, key) => {
                          return (
                            <FormControlLabel
                              key={key}
                              value={"card" + key}
                              onChange={(e) =>
                                this.setState({ paymentMethod: item.id })
                              }
                              control={<Radio className="cu-icon-color" />}
                              label={"xxxx-xxxx-xxxx-" + item.card.last4}
                            />
                          );
                        })
                      ) : (
                        <div>
                          <MultiLang text="there_is_no_info" />
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                  <div className="position-relative">
                    <div className="checkout-add-card">
                      <div className="btn btn btn-sm btn-outline-success add-card-btn">
                        <i className="la la-credit-card"></i>&nbsp;
                        <MultiLang text="add_card" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="all-pay">
                  <div
                    className="btn btn-xs btn-gradient btn-gradient-two btn-block btn-pay icon-left"
                    onClick={(e) => this.payBooking()}
                  >
                    {!this.state.load ? (
                      <span>
                        <FontAwesome name="money" />
                        <MultiLang text="pay" />
                      </span>
                    ) : (
                      <span id="uploading">
                        <FontAwesome
                          name="spinner"
                          className="loading-icon"
                          spin
                        />
                        <MultiLang text="loading" /> . . .
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*<!-- ends: .checkout-wrapper -->*/}
        <AddCard />
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartInfo: state.widget.cartData,
    cardInfo: state.widget.payment_data,
    logo: state.logo,
    heroImage: state.category.hero_image,
    adminCouponList: state.widget.admin_coupon,
    currency: state.app.currency.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaymentInfo: () => dispatch(getPaymentInfo()),
    bookingPay: (id, history, cartInfo, adminCouponList) =>
      dispatch(bookingPay(id, history, cartInfo, adminCouponList)),
    getAdminCouponList: () => dispatch(getAdminCouponList()),
    setCouponInfo: (type, selCoupon, bookingData) =>
      dispatch(setCouponInfo(type, selCoupon, bookingData)),
    getBannerImage: (page) => dispatch(getBannerImage(page)),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(CheckoutBasic);
