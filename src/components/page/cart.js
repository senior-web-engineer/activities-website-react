import { MultiLang } from "components/content/element/widget";
import $ from "jquery";
import parseAddress from "parse-address-string";
import React, { Component, Fragment } from "react";
import FontAwesome from "react-fontawesome";
import { withTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import { compose } from "redux";
import toastr from "toastr";
import back from "../../assets/img/checkout.jpg";
import image from "../../assets/img/default-img.svg";
import { getBannerImage } from "../../Store/action/categories";
import { deleteCartInfo } from "../../Store/action/widget";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { Footer } from "../layout/footer";
import Header from "../layout/header";
class CheckoutBasic extends Component {
  state = {
    bookingData: [],
    load: true,
  };

  componentDidMount() {
    console.log("hello");
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.getBannerImage("/cart");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    if (user) {
      // this.props.getCartInfo();
    } else {
      if (bookingData) {
        this.props.setCartInfo(bookingData);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const cartInfo = this.chooseSession(nextProps.cartInfo);
    this.setState({ bookingData: cartInfo, load: false });
    sessionStorage.setItem("bookingData", JSON.stringify(cartInfo));
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

  handleDelete = (key) => {
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    const cartCnt = JSON.parse(sessionStorage.getItem("cartCnt"));
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.props.deleteCartInfo(bookingData[key].id);
    }
    bookingData.splice(key, 1);
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    sessionStorage.setItem("cartCnt", JSON.stringify(cartCnt - 1));
    this.setState({ bookingData: bookingData });
    toastr.success("Delete cart successfully!");
  };

  chooseSession = (data) => {
    if (data.length === 0) {
      return false;
    }
    data.map((item) => {
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
    return data;
  };

  handleEdit = async (key) => {
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    const bookingInfo = bookingData[key].listingData;
    const promise = new Promise((resolve, reject) => {
      parseAddress(bookingInfo.location, function (error, addressObj) {
        const address = { city: addressObj.city, state: addressObj.state };
        resolve(address);
      });
    });
    promise.then((res) => {
      const { city, state } = res;
      const url =
        "/listing-details/" +
        (city ? city : state) +
        "/" +
        (bookingInfo?.category || "category") +
        "/" +
        (bookingInfo?.author || "name") +
        "/" +
        (bookingInfo?.title || "title") +
        "/" +
        bookingInfo.listing_id;
      this.props.history.push({
        pathname: url.replace(/ /g, "-"),
        state: { params: { listing_id: bookingInfo.listing_id } },
      });
    });
  };

  seeMore = () => {
    sessionStorage.removeItem("searchData");
    this.props.history.push("/all-listings-grid/search/");
  };

  render() {
    const light = this.props.logo[0].light;
    const { bookingData } = this.state;
    const { t } = this.props;
    let totalAmount = 0;
    bookingData &&
      bookingData.forEach((item) => {
        totalAmount = totalAmount + item.displayPrice;
      });

    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage">
          <div className="bg_image_holder">
            {!this.props.load && (
              <img
                src={this.props.heroImage !== "" ? this.props.heroImage : back}
                alt=""
              />
            )}
          </div>
          <div className="mainmenu-wrapper">
            <Header
              logo={light}
              class="menu--light"
              history={this.props.history}
            />
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
          <BreadcrumbWraper title={t("cart")} />
        </section>
        {/* Header section end */}

        <section className="checkout-wrapper section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="d-flex align-items-center m-bottom-20">
                  <h3 className="cart-title mb-0">
                    <MultiLang text="shopping_cart" />
                  </h3>
                </div>

                <div className="cart-content">
                  {this.state.load ? (
                    <div className="custom-loader">
                      <Loader
                        type="Oval"
                        color="#afdb30"
                        height={70}
                        width={70}
                        timeout={3000}
                      />
                    </div>
                  ) : bookingData && bookingData.length > 0 ? (
                    bookingData.map((item, key) => {
                      return (
                        <div className="cart-detail" key={key}>
                          <div className="cart-price">
                            {this.props.currency} {item.displayPrice}
                          </div>
                          <div className="row">
                            <div className="col-md-3">
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
                                <div className="atbd_thumbnail_overlay_content virtual-mark1">
                                  <MultiLang text="virtual" />
                                </div>
                              )}
                            </div>
                            <div className="col-md-9">
                              <div className="row">
                                <div className="col-md-12 cart-description">
                                  <h3>{item.listingData.title}</h3>
                                  <p>
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="category" />:
                                    </span>{" "}
                                    {item?.listingData?.category ?? ""}
                                  </p>
                                  <p>
                                    <FontAwesome name="map-marker" />{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="address" />:
                                    </span>{" "}
                                    {item?.listingData?.location ?? ""}
                                  </p>
                                  <p>
                                    <FontAwesome
                                      name="users"
                                      style={{ marginLeft: "-2px" }}
                                    />
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="attendee" />:
                                    </span>
                                    {/* {item?.child_name ??
                                      "" + " " + item?.surname ??
                                      ""} */}
                                    {`${item?.child_name} ${item?.surname}`}
                                  </p>
                                  <p>
                                    <FontAwesome name="calendar" />
                                    <span style={{ fontWeight: "bold" }}>
                                      <MultiLang text="session" />:
                                    </span>
                                    {item?.listingData?.start_date} ~{" "}
                                    {item?.listingData?.end_date}
                                    <br />
                                  </p>
                                </div>
                                <div className="col-md-12 cart-action">
                                  <button
                                    className="btn btn-xs btn-gradient btn-gradient-two"
                                    onClick={(e) => this.handleEdit(key)}
                                  >
                                    <FontAwesome name="edit" />
                                    <MultiLang text="edit" />
                                  </button>
                                  <button
                                    className="btn btn-xs btn-gradient btn-gradient-two"
                                    onClick={(e) => this.handleDelete(key)}
                                  >
                                    <FontAwesome name="trash" />
                                    <MultiLang text="delete" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : // <div>There is no cart</div>
                  null}
                </div>
              </div>
              <div className="col-md-4">
                <div className="cart-info">
                  <div className="cart-total-price">
                    {totalAmount > 0 && (
                      <h3>
                        <MultiLang text="cart_total" /> {bookingData.length}{" "}
                        <MultiLang text="activities" />: {this.props.currency}{" "}
                        {totalAmount}
                      </h3>
                    )}
                  </div>
                  <div
                    className="right-button tocheckout-botton btn-block"
                    onClick={(e) => this.props.history.push("/checkout")}
                  >
                    <MultiLang text="proceed_checkout" />
                  </div>
                  <div
                    className="right-button continue-botton btn-block"
                    onClick={this.seeMore}
                  >
                    <MultiLang text="show_more" />{" "}
                    <MultiLang text="activities" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*<!-- ends: .checkout-wrapper -->*/}

        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartInfo: state.widget.cartData,
    logo: state.logo,
    heroImage: state.category.hero_image,
    currency: state.app.currency.currency,
    load: state.app.isload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCartInfo: (id) => dispatch(deleteCartInfo(id)),
    setCartInfo: (data) => dispatch({ type: "GET_CART_INFO", payload: data }),
    getBannerImage: (page) => dispatch(getBannerImage(page)),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(CheckoutBasic);
