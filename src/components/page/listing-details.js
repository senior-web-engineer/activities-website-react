import {
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import $ from "jquery";
import { isEmpty } from "lodash";
import moment from "moment";
import React, { Component, Fragment } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { db } from "../../services/firebase";
import { getListing, setViewCnt } from "../../Store/action/listing";
import { BreadcrumbSingle } from "../content/element/breadcrumb";
import { ContentStory } from "../content/element/listing-details-story";
import BookNow from "../content/element/modal/book-panel";
import { AddReview, Review } from "../content/element/review";
import SellerInfo from "../content/element/SellerInfo";
import {
  MultiLang,
  PopularListing,
  SimilarListing,
} from "../content/element/widget";
import { Footer } from "../layout/footer";
import Header from "../layout/header";
// import GoogleMap from "../../components/content/element/map";

class ListingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      filter: {},
      image: [],
      userData: {},
      reviews: [],
      path: "",
      open: false,
      selSession: "main",
    };
  }

  componentDidMount() {
    const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
    if (bookingData) {
      const flag = bookingData.filter(
        (item) =>
          item.listingData.listing_id === this.props.match?.params?.activityId
      );
      if (flag.length > 0) {
        $("html").css("scroll-behavior", "unset");
        $(window).scrollTop(0);
        $(".short-control").addClass("hidden");
        $("#booking-modal").addClass("is-visible");
      }
    }
    var bannerHeight = $(".bg_image_holder").height();
    var standardHeight =
      bannerHeight -
      $(".top-book-panel").height() -
      $(".top-menu-area").height() -
      20;
    window.addEventListener("scroll", this.scrollListener);
    $("#about-button").click(function () {
      $("html").css("scroll-behavior", "smooth");
      document.documentElement.scrollTop = 260;
      if ($(window).width() < 992) {
        document.documentElement.scrollTop = 200;
      }
    });
    $("#gallery-button").click(function () {
      $("html").css("scroll-behavior", "smooth");
      document.documentElement.scrollTop =
        300 + $(".atbd_listing_details").height();
      if ($(window).width() < 992) {
        document.documentElement.scrollTop =
          200 + $(".atbd_listing_details").height();
      }
    });
    $("#reviews-button").click(function () {
      $("html").css("scroll-behavior", "smooth");
      document.documentElement.scrollTop =
        standardHeight +
        $(".atbd_listing_details").height() +
        $(".atbd_listing_gallery").height();
      if ($(window).width() < 992) {
        document.documentElement.scrollTop =
          standardHeight +
          $(".atbd_listing_details").height() +
          $(".atbd_listing_gallery").height();
      }
    });
    $("#sessions-button").click(function () {
      $("html").css("scroll-behavior", "smooth");
      document.documentElement.scrollTop = 260;
      if ($(window).width() < 992) {
        document.documentElement.scrollTop =
          standardHeight +
          $(".atbd_listing_details").height() +
          $(".atbd_listing_gallery").height() +
          $(".atbd_review_module").height() +
          $(".atbd_review_form").height();
      }
    });
  }

  UNSAFE_componentWillMount() {
    const id = this.props.match?.params?.activityId;
    this.setState((prevState) => ({
      ...prevState,
      path: this.props.history,
    }));
    this.props.getListing();
    this.props.setViewCnt(id);
  }

  componentDidUpdate() {
    $(".bg_image_holder").each(function () {
      var $this = $(this);
      var imgLink = $this.children().attr("src");
      $this
        .css({
          "background-image": "url('" + imgLink + "')",
          opacity: "1",
        })
        .children();
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let avatar = [];
    const id = nextProps.match?.params?.activityId;
    const filter =
      nextProps.list.filter((value) => value.listing_id === id)?.[0] ?? {};
    if (!isEmpty(filter)) {
      db.collection("reviews")
        .where("id_listing", "==", filter.listing_id)
        .where("status", "==", "0")
        .get()
        .then((res) => {
          const reviews = res.docs.map((doc) => doc.data());
          this.setState({
            reviews: reviews,
          });
        });
      if (filter.img !== "") {
        filter.img.map((item) => {
          const element = {
            original: item,
            thumbnail: item,
          };
          return avatar.push(element);
        });
      } else {
        const element = {
          original: "",
          thumbnail: "",
        };
        return avatar.push(element);
      }
      this.setState({
        list: nextProps.list.listing,
        filter: filter,
        image: avatar,
      });
    } else {
      this.props.history.push("/");
    }
  }

  scrollListener = (e) => {
    var bannerHeight = $(".bg_image_holder").height();
    var standardHeight =
      bannerHeight -
      $(".top-book-panel").height() -
      $(".top-menu-area").height() -
      20;
    var scrollTop = document.documentElement.scrollTop;
    if (scrollTop > standardHeight) {
      $(".top-book-panel").removeClass("translate");
      $(".booking-now").addClass("hidden");
      // $(".top-menu-area").addClass("top-effect-menu");
      $(".btn-book").css("z-index", "4");
    } else {
      $(".top-book-panel").addClass("translate");
      $(".booking-now").removeClass("hidden");
      // $(".top-menu-area").removeClass("top-effect-menu");
      $(".btn-book").css("z-index", "-1");
    }
  };

  bookNow = () => {
    $("html").css("scroll-behavior", "unset");
    $(window).scrollTop(0);
    $(".short-control").addClass("hidden");
    $("#booking-modal").addClass("is-visible");
  };

  goBack = () => {
    $(window).scrollTop(0);
    $(".short-control").removeClass("hidden");
    $("#booking-modal").removeClass("is-visible");
  };

  render() {
    const light = this.props.logo[0].light;
    // $(window).scrollTop(0);
    const { filter } = this.state;
    // console.log(filter, "filter");
    return (
      <Fragment>
        {/* Top Hidden Header */}
        <div className="top-book-panel translate short-control">
          <div className="container">
            <div className="top-header-grid">
              <div className="hidden-sm">
                <div className="top-img">
                  {Object.entries(filter).length > 0 && (
                    <img src={filter.img[0]} alt="" />
                  )}
                </div>
              </div>
              <div className="pt-20">
                <span className="top-title">{filter.title}</span>
                {this.state.reviews.length === 0 ? (
                  <span className="hidden-sm">
                    <i className="la la-star"></i>
                    <MultiLang text="no_reviews_yet" />
                  </span>
                ) : (
                  <span className="hidden-sm">
                    <i className="la la-star"></i>
                    <MultiLang text="reviews" /> :{this.state.reviews.length}
                  </span>
                )}
                <span className="hidden-sm" style={{ marginLeft: "10px" }}>
                  <i className="la la-coffee"></i> {filter.category}
                </span>
                <div className="top-linker">
                  <ul>
                    <li id="about-button">
                      <MultiLang text="about" />
                    </li>
                    <li className="side-bar"></li>
                    <li id="gallery-button">
                      <MultiLang text="gallery" />
                    </li>
                    <li className="side-bar"></li>
                    <li id="reviews-button">
                      <MultiLang text="reviews" />
                    </li>
                    <li className="side-bar"></li>
                    <li id="sessions-button">
                      <MultiLang text="sessions" />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-left">
                <div className="row">
                  <div className="col-md-6 top-price">
                    <span>
                      <MultiLang text="price" />:
                    </span>
                    <h2 style={{ color: "#358804" }}>
                      {this.props.currency} {filter.displayPrice}
                    </h2>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="btn btn-gradient btn-gradient-two btn-book"
                      onClick={this.bookNow}
                    >
                      <MultiLang text="book" />{" "}
                      <span className="hidden-xs">
                        <MultiLang text="now" />!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Header section start */}
        <section className="listing-details-wrapper bgimage short-control">
          <div className="bg_image_holder">
            {Object.entries(filter).length > 0 && (
              <img src={filter.img[0]} alt="" />
            )}
            {/* <img src={detailBack} alt="" /> */}
          </div>
          <div className="mainmenu-wrapper">
            <Header
              logo={light}
              class="menu--light"
              history={this.props.history}
            />
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
          <div className="listing-info content_above">
            <div className="container">
              <div className="row">
                {Object.entries(filter).length > 0 ? (
                  <BreadcrumbSingle
                    filter={filter}
                    currency={this.props.currency}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Header section end */}

        <section className="directory_listiing_detail_area single_area section-bg section-padding-strict short-control">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <ContentStory content={filter} />
                <div className="atbd_content_module atbd_listing_gallery cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-image"></span>
                        <MultiLang text="gallery" />
                      </h4>
                    </div>
                  </div>
                  <div className="custom-loader">
                    <Loader
                      type="Oval"
                      color="#afdb30"
                      height={70}
                      width={70}
                      timeout={2000}
                    />
                  </div>
                  <ImageGallery items={this.state.image} />
                </div>
                {/* about end */}

                <Review
                  listing_data={this.state.filter}
                  history={this.props.history}
                  activityid={this.props.match?.params?.activityId}
                />
                <AddReview
                  listing_data={this.state.filter}
                  activityid={this.props.match?.params?.activityId}
                />
              </div>

              <div className="col-lg-4" id="available-sessions">
                <div
                  className="btn btn-xs btn-gradient btn-gradient-two btn-block booking-now"
                  onClick={this.bookNow}
                >
                  <MultiLang text="book" /> <MultiLang text="now" />
                </div>
                <div
                  className="widget atbd_widget widget-card cu-radius"
                  id="sessions-panel"
                >
                  <div
                    className="atbdp-widget-listing-contact"
                    style={{ position: "relative" }}
                  >
                    {Object.entries(filter).length > 0 ? (
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          <h4 className="font-weight-bold  m-0 text-black">
                            <MultiLang text="avaliable_sessions" /> :
                          </h4>
                        </FormLabel>
                        <RadioGroup
                          aria-label="sessions"
                          name="sessions"
                          value={this.state.selSession}
                          onChange={(e) =>
                            this.setState({ selSession: e.target.value })
                          }
                        >
                          <FormControlLabel
                            value={filter?.sessions[0]?.id || "main"}
                            control={<Radio />}
                            label={`${moment(
                              filter.sessions[0].start_date
                            ).format("MMM D, hh:mm a")} ~ ${moment(
                              filter.sessions[0].end_date
                            ).format("MMM D, YYYY hh:mm a")}`}
                          />
                          <Collapse in={this.state.open}>
                            {filter.sessions.length > 0 &&
                              filter.sessions
                                .slice(1, filter.sessions.length)
                                .map((item, key) => {
                                  return (
                                    <div
                                      key={key}
                                      className="d-flex flex-direction-column"
                                    >
                                      <FormControlLabel
                                        value={item?.id || "main"}
                                        control={<Radio />}
                                        label={`${moment(
                                          item.start_date
                                        ).format("MMM D, hh:mm a")} ~ ${moment(
                                          item.end_date
                                        ).format("MMM D, YYYY hh:mm a")}`}
                                      />
                                    </div>
                                  );
                                })}
                          </Collapse>
                          {filter.sessions.length > 0 && (
                            <span
                              className="showmore-sessions"
                              onClick={() =>
                                this.setState((prev) => ({
                                  open: !prev.open,
                                }))
                              }
                            >
                              <MultiLang text="show_more" />{" "}
                              <MultiLang text="sessions" />
                            </span>
                          )}
                        </RadioGroup>
                      </FormControl>
                    ) : (
                      <p></p>
                    )}
                    {Object.entries(filter).length > 0 &&
                    filter.camp_type === 2 ? (
                      <div className="atbd_avatar_wrapper">
                        <div className="atbd_review_avatar virtual-img-div">
                          <img
                            className="virtual-img"
                            src={filter.user}
                            alt=""
                          />
                        </div>
                        <div className="atbd_name_time p-top-15">
                          <h5 className="p-bottom-10">
                            <MultiLang text="virtual_camp" />
                          </h5>
                          <p className="review_time m-bottom-0">
                            <MultiLang text="link_to_the_activity_will" />
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="atbd_avatar_wrapper">
                        <div className="atbd_review_avatar virtual-img-div">
                          <img
                            className="virtual-img"
                            src={filter.user}
                            alt=""
                          />
                        </div>
                        <div className="atbd_name_time p-top-15">
                          <h5 className="p-bottom-10">
                            <MultiLang text="in_person" />
                          </h5>
                          <p className="review_time p-left-10 m-bottom-0">
                            <MultiLang text="your_reservation_with_Qrcode" />
                          </p>
                        </div>
                        <div className="atbd_name_time p-top-15">
                          <h5 className="p-bottom-10">
                            <MultiLang text="covid_precautions" />
                          </h5>
                          <p className="review_time p-left-10 m-bottom-0">
                            {filter.covid_precautions === undefined
                              ? "We are following local and federal guidelines to keep you safe during your activity."
                              : filter.covid_precautions}
                          </p>
                        </div>
                      </div>
                    )}
                    {filter.video_url !== "" && (
                      <p className="font-style p-top-0">
                        <MultiLang text="video" /> :
                        <a
                          className="p-left-10"
                          href={"https://" + filter.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {filter.video_url}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="widget atbd_widget widget-card cu-radius"
                  id="side-panel"
                >
                  <div className="atbd_widget_title">
                    <h4>
                      <span className="la la-user"></span>
                      <MultiLang text="supplier_info" />
                    </h4>
                  </div>
                  {/* <!-- ends: .atbd_widget_title --> */}
                  <SellerInfo data={this.state.filter} path={this.state.path} />
                </div>
                {/* end Supplier Info */}

                <div className="widget atbd_widget widget-card cu-radius">
                  <div className="atbd_widget_title">
                    <h4>
                      <span className="la la-list-alt"></span>
                      <MultiLang text="similar_listings" />
                    </h4>
                    <NavLink
                      to="/all-listings-grid"
                      onClick={(e) => sessionStorage.removeItem("searchData")}
                    >
                      <MultiLang text="view_all" />
                    </NavLink>
                  </div>
                  {/*<!-- ends: .atbd_widget_title -->*/}
                  <div className="atbd_categorized_listings atbd_similar_listings">
                    <SimilarListing
                      list={this.props.list}
                      category_name={this.state.filter}
                      currency={this.props.currency}
                    />
                  </div>
                </div>
                {/* end similar listing */}

                <div className="widget atbd_widget widget-card cu-radius">
                  <div className="atbd_widget_title">
                    <h4>
                      <span className="la la-list-alt"></span>
                      <MultiLang text="popular_listings" />
                    </h4>
                    <NavLink
                      to="/all-listings-grid"
                      onClick={(e) => sessionStorage.removeItem("searchData")}
                    >
                      <MultiLang text="view_all" />
                    </NavLink>
                  </div>
                  {/*<!-- ends: .atbd_widget_title -->*/}
                  <div className="atbd_categorized_listings atbd_popular_listings">
                    <PopularListing
                      list={this.props.list}
                      currency={this.props.currency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <BookNow
          detailData={filter}
          history={this.props.history}
          cartId={this.props.match?.params?.activityId}
          selSession={this.state.selSession}
        />
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    list: state.list.listing,
    logo: state.logo,
    currency: state.app.currency.currency,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getListing: () => dispatch(getListing()),
    setViewCnt: (id) => dispatch(setViewCnt(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingDetails);
