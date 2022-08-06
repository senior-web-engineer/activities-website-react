import $ from "jquery";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getListing } from "../../Store/action/listing";
import { BreadcrumbSingle } from "../content/element/breadcrumb";
import { AddReviewCSV, ReviewCSV } from "../content/element/review";
import { SellerInfoCSV } from "../content/element/SellerInfo";
import {
  MultiLang,
  PopularListingCSV,
  SimilarListingCSV,
} from "../content/element/widget";
import { Footer } from "../layout/footer";
import Header from "../layout/header";

export default function ListingCSVDetails(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const currency = useSelector(
    (state) => state?.app?.currency?.currency ?? "$"
  );
  const list = useSelector((state) => state?.list?.listing ?? []);
  const light = useSelector((state) => state?.logo[0].light);
  const [activityInfo, setActivityInfo] = useState({});
  const [reviews] = useState([]);
  const [images, setImages] = useState([]);

  const scrollListener = (e) => {
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

  const setWindowsHeight = () => {
    var bannerHeight = $(".bg_image_holder").height();
    var standardHeight =
      bannerHeight -
      $(".top-book-panel").height() -
      $(".top-menu-area").height() -
      20;
    window.addEventListener("scroll", scrollListener);
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
  };

  // const goBack = () => {
  //   $(window).scrollTop(0);
  //   $(".short-control").removeClass("hidden");
  //   $("#booking-modal").removeClass("is-visible");
  // };

  useEffect(() => {
    dispatch(getListing());
    setWindowsHeight();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { companyName, category, city } = props?.match?.params ?? {};
    setActivityInfo(
      (prev) =>
        (list ?? []).filter(
          (item) =>
            (item?.company
              ? item?.company
                  .replace(/\//g, "")
                  .replace(/&/g, "")
                  .replace(/-/g, "")
              : "company") === companyName.replace(/-/g, " ") &&
            (item?.category
              ? item?.category
                  .replace(/\//g, "")
                  .replace(/&/g, "")
                  .replace(/-/g, "")
              : "category") === category.replace(/-/g, " ") &&
            (item?.city
              ? item?.city
                  .replace(/\//g, "")
                  .replace(/&/g, "")
                  .replace(/-/g, "")
              : "city") === city.replace(/-/g, " ")
        )?.[0] ?? {}
    );
  }, [list, props]);

  useEffect(() => {
    if ((activityInfo?.img ?? []).length > 0) {
      setImages((prev) =>
        activityInfo.img.map((item) => {
          return { original: item, thumbnail: item };
        })
      );
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
  }, [activityInfo]);

  return (
    <div>
      {Object.entries(activityInfo)?.length > 0 ? (
        <>
          {/* Top Hidden Header */}
          <div className="top-book-panel translate short-control">
            <div className="container">
              <div className="top-header-grid">
                <div className="hidden-sm">
                  <div className="top-img">
                    {Object.entries(activityInfo).length > 0 && (
                      <img src={activityInfo.img[0] ?? ""} alt="" />
                    )}
                  </div>
                </div>
                <div className="pt-20">
                  <span className="top-title">
                    {activityInfo?.company ?? ""}
                  </span>
                  {reviews.length === 0 ? (
                    <span className="hidden-sm">
                      <i className="la la-star"></i>
                      <MultiLang text="no_reviews_yet" />
                    </span>
                  ) : (
                    <span className="hidden-sm">
                      <i className="la la-star"></i>
                      <MultiLang text="reviews" /> :{reviews.length}
                    </span>
                  )}
                  <span className="hidden-sm" style={{ marginLeft: "10px" }}>
                    <i className="la la-coffee"></i>{" "}
                    {activityInfo?.category ?? ""}
                  </span>
                  <div className="top-linker">
                    <ul>
                      {Boolean(activityInfo?.description) && (
                        <>
                          <li id="about-button">
                            <MultiLang text="about" />
                          </li>
                          <li className="side-bar"></li>
                        </>
                      )}
                      <li id="gallery-button">
                        <MultiLang text="gallery" />
                      </li>
                      <li className="side-bar"></li>
                      <li id="reviews-button">
                        <MultiLang text="reviews" />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border-left">
                  {Boolean(activityInfo?.activityType) ? (
                    <div className="d-flex justify-content-center pt-20">
                      <div
                        className="btn btn-gradient btn-gradient-two"
                        // onClick={this.bookNow}
                        onClick={() =>
                          history.push({
                            pathname: "/sign-up-claim",
                            state: { activity: activityInfo },
                          })
                        }
                      >
                        <MultiLang text="Claim Listing" />{" "}
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-6 top-price">
                        <span>
                          <MultiLang text="price" />:
                        </span>
                        <h2 style={{ color: "#358804" }}>
                          {currency} {activityInfo.displayPrice}
                        </h2>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="btn btn-gradient btn-gradient-two btn-book"
                          onClick={() =>
                            history.push({
                              pathname: "/sign-up-claim",
                              state: { activity: activityInfo },
                            })
                          }
                        >
                          <MultiLang text="book" />{" "}
                          <span className="hidden-xs">
                            <MultiLang text="now" />!
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <section className="listing-details-wrapper bgimage short-control">
            <div className="bg_image_holder">
              {Object.entries(activityInfo).length > 0 && (
                <img src={activityInfo.img[0] ?? ""} alt="" />
              )}
              {/* <img src={detailBack} alt="" /> */}
            </div>
            <div className="mainmenu-wrapper">
              <Header logo={light} class="menu--light" history={history} />
            </div>
            {/* <!-- ends: .mainmenu-wrapper --> */}
            <div className="listing-info content_above">
              <div className="container">
                <div className="row">
                  {Object.entries(activityInfo).length > 0 ? (
                    <BreadcrumbSingle
                      filter={activityInfo}
                      currency={currency}
                      activityType="csv"
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
                  {/* <ContentStory content={filter} /> */}
                  {Boolean(activityInfo?.description) && (
                    <div className="atbd_content_module atbd_listing_details cu-radius">
                      <div className="atbd_content_module__tittle_area">
                        <div className="atbd_area_title">
                          <h4>
                            <span className="la la-file-text-o"></span>
                            <MultiLang text="about" />
                          </h4>
                        </div>
                      </div>
                      <div className="atbdb_content_module_contents">
                        <p>{activityInfo?.description ?? ""}</p>
                      </div>
                    </div>
                  )}
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
                    <ImageGallery items={images} lazyLoad={true} />
                  </div>
                  <ReviewCSV activityInfo={activityInfo} history={history} />
                  <AddReviewCSV activityInfo={activityInfo} />
                </div>

                <div className="col-lg-4" id="available-sessions">
                  <div
                    className="btn btn-xs btn-gradient btn-gradient-two btn-block booking-now"
                    onClick={() =>
                      history.push({
                        pathname: "/sign-up-claim",
                        state: { activity: activityInfo },
                      })
                    }
                  >
                    <MultiLang text="Claim Listing" />
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
                    <SellerInfoCSV companyInfo={activityInfo} />
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
                    <div className="atbd_categorized_listings atbd_similar_listings">
                      <SimilarListingCSV
                        category={activityInfo?.category ?? ""}
                        currency={currency}
                      />
                    </div>
                  </div>
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
                    <div className="atbd_categorized_listings atbd_popular_listings">
                      <PopularListingCSV currency={currency} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="listing-details-wrapper bgimage short-control">
            <div className="bg_image_holder">
              {Object.entries(activityInfo).length > 0 && (
                <img src={activityInfo.img[0] ?? ""} alt="" />
              )}
              {/* <img src={detailBack} alt="" /> */}
            </div>
            <div className="mainmenu-wrapper">
              <Header logo={light} class="menu--light" history={history} />
            </div>
            {/* <!-- ends: .mainmenu-wrapper --> */}
            <div className="listing-info content_above">
              <div className="container">
                <div className="row">
                  {Object.entries(activityInfo).length > 0 ? (
                    <BreadcrumbSingle
                      filter={activityInfo}
                      currency={currency}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </section>
          <div className="custom-loader">
            <Loader type="Oval" color="#afdb30" height={70} width={70} />
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
