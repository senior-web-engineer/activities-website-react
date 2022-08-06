import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import moment from "moment";
import React, { Component } from "react";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import toastr from "toastr";
import { setFavouriteData } from "../../../../Store/action/favourite";
import { getListing } from "../../../../Store/action/listing";
import { MultiLang } from "../widget";

//card-listing
class ListingCardGrid12 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      arrayData: [],
      totalpage: 0,
      activePage: 1,
      startNum: 0,
    };
  }

  componentDidMount() {
    this.setState({
      list: this.props.list,
      totalpage: this.props.list.length,
      arrayData: this.props.list,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list,
      totalpage: nextProps.list.length,
      arrayData: nextProps.list,
      activePage: 1,
      startNum: 0,
    });
  }

  nextSession = (id) => {
    const adLists = this.state.arrayData;
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
    this.setState({ arrayData: adLists });
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

  handlePageChange = (e) => {
    this.setState({
      activePage: e,
      startNum: e - 1,
      arrayData: this.state.list,
    });
  };

  render() {
    return (
      <>
        <div className="row">
          {this.state.arrayData
            .slice(this.state.startNum * 6, this.state.startNum * 6 + 6)
            .map((item, key) => {
              return (
                <div className="col-lg-12" key={this.state.startNum * 6 + key}>
                  <div className="atbd_single_listing atbd_listing_list">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image cu-image">
                          {Boolean(item?.activityType) ? (
                            <NavLink
                              to={{
                                pathname: item?.url ?? "",
                                state: {
                                  params: { csvfile: item },
                                },
                              }}
                            >
                              <img src={item?.img?.[0] ?? "#"} alt="" />
                            </NavLink>
                          ) : (
                            <NavLink
                              to={{
                                pathname: item?.url ?? "",
                                state: {
                                  params: {
                                    listing_id: item?.listing_id ?? "",
                                  },
                                },
                              }}
                            >
                              <img src={item?.img?.[0] ?? "#"} alt="" />
                            </NavLink>
                          )}
                        </div>
                        {item?.camp_type === 2 && (
                          <div className="virtual-mark">
                            <MultiLang text="virtual" />
                          </div>
                        )}
                        {item?.displayPrice === 0 && (
                          <div
                            className="free-listing-mark"
                            style={{ borderTopRightRadius: 0 }}
                          >
                            <span>free activity</span>
                          </div>
                        )}
                      </figure>
                      <div className="atbd_listing_info cu-article">
                        <div className="atbd_content_upper">
                          <div className="d-flex justify-content-between">
                            <h4 className="atbd_listing_title">
                              {Boolean(item?.activityType) ? (
                                <NavLink
                                  to={{
                                    pathname: item?.url ?? "",
                                    state: {
                                      params: { csvfile: item },
                                    },
                                  }}
                                >
                                  {item?.company ?? ""}
                                </NavLink>
                              ) : (
                                <NavLink
                                  to={{
                                    pathname: item?.url ?? "",
                                    state: {
                                      params: {
                                        listing_id: item?.listing_id ?? "",
                                      },
                                    },
                                  }}
                                >
                                  {item?.title ?? ""}
                                </NavLink>
                              )}
                            </h4>
                            {item?.displayPrice && (
                              <h1 className="price-title">
                                {item?.displayPrice === 0
                                  ? "Free"
                                  : `${this.props.currency} ${item?.displayPrice}`}
                              </h1>
                            )}
                          </div>

                          <div className="atbd_listing_data_list">
                            <ul>
                              <li>
                                <p>
                                  <span className="la la-user"></span>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "black",
                                      paddingRight: "10px",
                                    }}
                                  >
                                    <MultiLang text="by" /> :{" "}
                                  </span>
                                  {item?.author || "Not yet"}
                                </p>
                              </li>
                              <li>
                                <p style={{ whiteSpace: "nowrap" }}>
                                  <span className="la la-map-marker"></span>
                                  <MultiLang text="address" /> :{" "}
                                  {item?.location}
                                </p>
                              </li>
                              {item?.sessions?.length > 0 && (
                                <li>
                                  <div className="d-flex">
                                    <span className="la la-calendar-check-o p-top-5 p-right-5"></span>
                                    <p className="m-bottom-0">
                                      {" "}
                                      {`${moment(
                                        item?.sessions[item?.selSessionKey]
                                          .start_date
                                      ).format("MMM D, hh:mm a")} ~ ${moment(
                                        item?.sessions[item?.selSessionKey]
                                          .start_date
                                      ).format("MMM D, YYYY hh:mm a")}`}
                                    </p>
                                    <i
                                      className="la la-arrow-left"
                                      style={{ paddingTop: "7px" }}
                                    ></i>
                                    <p
                                      className="next-session m-bottom-0"
                                      style={{ marginLeft: "10px" }}
                                      onClick={(e) =>
                                        this.nextSession(item?.listing_id)
                                      }
                                    >
                                      <MultiLang text="next" />{" "}
                                      <MultiLang text="session" />
                                    </p>
                                  </div>
                                </li>
                              )}
                              {Boolean(item?.video_url) && (
                                <li>
                                  <div className="font-style p-0">
                                    <VideoLibraryIcon
                                      style={{ fontSize: 14, color: "#358804" }}
                                    />
                                    <a
                                      className="p-left-10"
                                      href={"https://" + item?.video_url ?? ""}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item?.video_url ?? ""}
                                    </a>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="atbd_listing_bottom_content">
                          <div className="atbd_content_left d-flex">
                            <div className="atbd_listing_category">
                              <span>
                                {/* <FontAwesome name={item?.icon ?? "futbol"} /> */}
                                {item?.category}
                              </span>
                            </div>
                            {item?.rating >= 0 && (
                              <div className="atbd_listing_meta">
                                <span className="atbd_meta atbd_listing_rating">
                                  {item?.rating === 0 ? (
                                    <MultiLang text="no_rating" />
                                  ) : (
                                    item?.rating
                                  )}
                                  <i className="la la-star"></i>
                                </span>
                              </div>
                            )}
                          </div>
                          {item?.activityType && (
                            <ul className="atbd_content_right">
                              <li
                                className="atbd_save"
                                onClick={(e) =>
                                  this.setFavorite(item?.id ?? "")
                                }
                              >
                                {item?.favFlag ? (
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
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              );
            })}
        </div>
        {this.state.arrayData?.length > 0 && (
          <div className="p-left-15">
            <Pagination
              prevPageText="Prev"
              nextPageText="Next"
              firstPageText="First"
              lastPageText="Last"
              activePage={this.state.activePage}
              itemsCountPerPage={6}
              totalItemsCount={this.state.totalpage}
              pageRangeDisplayed={5}
              itemClass="page-item"
              linkClass="page-link"
              onChange={(e) => this.handlePageChange(e)}
            />
          </div>
        )}
      </>
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
    getListing: () => dispatch(getListing()),
    setFavouriteData: (data) => dispatch(setFavouriteData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListingCardGrid12);
