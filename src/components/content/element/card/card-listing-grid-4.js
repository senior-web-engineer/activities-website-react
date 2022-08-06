import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import moment from "moment";
import React, { Component, Fragment } from "react";
import Img from "react-cool-img";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import toastr from "toastr";

import loadinggif from "../../../../assets/img/loading.gif";
import { setFavouriteData } from "../../../../Store/action/favourite";
import { getListing } from "../../../../Store/action/listing";
import { MultiLang } from "../widget";

class ListingCardGrid4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
    this.nextSession = this.nextSession.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const listingData = nextProps.list.listing;
    let data = [];
    listingData.length > 0 &&
      listingData.forEach((item) => {
        if (item.boost_date_limit !== undefined) {
          const currentDate = moment().unix();
          if (currentDate < item.boost_date_limit.seconds) {
            data.push(item);
          }
        }
      });
    this.setState({ list: data });
  }

  UNSAFE_componentWillMount() {
    this.props.getListing();
  }

  nextSession = (id) => {
    const adLists = this.state.list;
    adLists.map((item) => {
      if (item.listing_id === id) {
        if (item.selSessionKey === item.sessions.length - 1) {
          item["selSessionKey"] = 0;
        } else {
          item["selSessionKey"] = item.selSessionKey + 1;
        }
      }
      return item;
    });
    this.setState({ list: adLists });
  };

  setFavorite = (id) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toastr.info("Please sign in page!");
      return false;
    }
    this.state.list
      .filter((item) => item.id === id)
      .forEach((item) => (item.favFlag = !item.favFlag));
    const data = this.state.list.filter((item) => item.id === id);
    this.setState({
      list: this.state.list,
    });
    this.props.setFavouriteData(data);
  };

  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    const { list } = this.state;
    return (
      <div className="row">
        <div className="container">
          <Slider {...settings}>
            {list.length > 0 &&
              list.map((value, key) => {
                const {
                  img,
                  user,
                  category,
                  author,
                  listing_id,
                  url,
                  rating,
                  title,
                  location,
                  displayPrice,
                  sessions,
                  selSessionKey,
                  // availability,
                  // remaing_availability,
                  id,
                  favFlag,
                  camp_type,
                  // virtual_link,
                  video_url,
                } = value;
                return (
                  <div className="col-lg-12 col-sm-12" key={key}>
                    <div className="atbd_single_listing ">
                      <article className="atbd_single_listing_wrapper">
                        <figure className="atbd_listing_thumbnail_area">
                          <div className="atbd_listing_image">
                            <NavLink
                              to={{
                                pathname: url,
                                state: { params: { listing_id: listing_id } },
                              }}
                            >
                              <Img
                                placeholder={loadinggif}
                                src={img[0]}
                                cache
                                alt=""
                              />
                            </NavLink>
                          </div>
                          {/*<!-- ends: .atbd_listing_image -->*/}
                          <div className="atbd_author atbd_author--thumb">
                            <a href=" ">
                              <img
                                src={user}
                                style={{ width: "40px" }}
                                alt="AuthorImage"
                              />
                              <span className="custom-tooltip">{user}</span>
                            </a>
                          </div>
                          {camp_type === 2 && (
                            <div className="virtual-mark">
                              <MultiLang text="virtual" />
                            </div>
                          )}
                          {displayPrice === 0 && (
                            <div className="free-listing-mark">
                              <span>free activity</span>
                            </div>
                          )}
                          {/*<!-- ends: .atbd_thumbnail_overlay_content -->*/}
                        </figure>
                        <div className="atbd_listing_info">
                          <Fragment>
                            <div
                              className="atbd_content_upper best-listing-info"
                              style={{ height: "122px" }}
                            >
                              <h4 className="atbd_listing_title">
                                <NavLink
                                  to={{
                                    pathname: url,
                                    state: {
                                      params: { listing_id: listing_id },
                                    },
                                  }}
                                >
                                  {title}
                                </NavLink>
                              </h4>
                              <div className="atbd_card_action">
                                {rating >= 0 && (
                                  <div className="atbd_listing_meta">
                                    <span className="atbd_meta atbd_listing_rating">
                                      {/* {rating === 0 ? "No Rating" : rating} */}
                                      {/* <i className="la la-star"></i> */}
                                      <h2
                                        className="price-title"
                                        style={{ color: "#fff" }}
                                      >
                                        {displayPrice === 0
                                          ? "Free"
                                          : `${this.props.currency} ${displayPrice}`}
                                      </h2>
                                    </span>
                                  </div>
                                )}
                                {/*<!-- ends: .atbd listing meta -->*/}
                                <h5 className="card-category">
                                  <i className="la la-tag"></i>
                                  {category}
                                </h5>
                              </div>
                              {/* {camp_type === 2 && virturl_link !== "" && (
                                <p className="font-style p-top-0">
                                  <a
                                    className="p-left-10"
                                    href={"https://" + virtual_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {virtual_link}
                                  </a>
                                </p>
                              )} */}
                              {video_url !== "" && (
                                <p className="font-style p-top-0">
                                  <a
                                    className="p-left-10"
                                    href={"https://" + video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {video_url}
                                  </a>
                                </p>
                              )}
                            </div>
                            {/*<!-- end .atbd_content_upper -->*/}
                            <div className="atbd_listing_bottom_content">
                              <div className="listing-meta">
                                <div className="like-button">
                                  <div
                                    className="atbd_content_right"
                                    onClick={(e) => this.setFavorite(id)}
                                  >
                                    {favFlag ? (
                                      <i
                                        className="la la-heart liked"
                                        id="grid-like"
                                      ></i>
                                    ) : (
                                      <i
                                        className="la la-heart-o"
                                        id="grid-like"
                                      ></i>
                                    )}
                                  </div>
                                </div>
                                <p>
                                  <span>
                                    <MultiLang text="by" /> :{" "}
                                  </span>
                                  {author}
                                </p>
                                <div
                                  className="d-flex flex-nowrap"
                                  style={{ height: "53px" }}
                                >
                                  <p style={{ whiteSpace: "nowrap" }}>
                                    <span>
                                      <MultiLang text="address" />:{" "}
                                    </span>
                                  </p>
                                  <p className="p-left-5 text-break">
                                    {" "}
                                    {location}
                                  </p>
                                </div>
                                {/* <div className="d-flex justify-content-between">
                                  <p>
                                    <span>Availability : </span> {availability}
                                  </p>
                                  <p>
                                    <span>Remaining : </span>{" "}
                                    {remaing_availability}
                                  </p>
                                </div> */}
                                <p>
                                  <span
                                    className="next-session"
                                    onClick={() => this.nextSession(listing_id)}
                                  >
                                    <MultiLang text="next" />{" "}
                                    <MultiLang text="session" />
                                    <i className="la la-arrow-right"></i>
                                  </span>
                                </p>
                                <p className="p-left-15 size_14">
                                  {`${moment(
                                    sessions[selSessionKey].start_date
                                  ).format("MMM D, hh:mm a")} ~ ${moment(
                                    sessions[selSessionKey].end_date
                                  ).format("MMM D, YYYY hh:mm a")}`}
                                </p>
                              </div>
                            </div>
                          </Fragment>
                        </div>
                        {/*<!-- ends: .atbd_listing_info -->*/}
                      </article>
                      {/*<!-- atbd_single_listing_wrapper -->*/}
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
        {list.length > 0 && (
          <div className="col-lg-12 text-center m-top-55">
            <NavLink
              // onClick={noAction}
              onClick={(e) => sessionStorage.removeItem("searchData")}
              to="all-listings-grid"
              className="btn btn-gradient btn-gradient-two"
            >
              Explore All
            </NavLink>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    list: state.list,
    currency: state.app.currency.currency,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getListing: () => dispatch(getListing()),
    setFavouriteData: (data) => dispatch(setFavouriteData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListingCardGrid4);
