import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { getListing } from "../../Store/action/listing";
import { getCategories } from "../../Store/action/categories";
import ListingCardGrid6 from "../content/element/card/card-listing-grid-6";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import $ from "jquery";
import toastr from "toastr";
import Slider from "@material-ui/core/Slider";
import moment from "moment";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
// import { Pagination } from "../content/element/pagination";
const noAction = (e) => e.preventDefault();

class Listing extends Component {
  constructor(props) {
    super(props);
    this.mobileFilter = this.mobileFilter.bind(this);
    this.returnBack = this.returnBack.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }
  state = {
    list: [],
    filter_list: [],
    cate: [],
    count: 0,
    data: {},
    category_name: "",
    looking_data: "",
    location: "",
    load: true,
    searched: false,
    min: 0,
    max: 5000,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ cate: nextProps.cate });
    const searchData = JSON.parse(sessionStorage.getItem("searchData"));
    if (nextProps.list.listing !== this.props.list.listing) {
      if (searchData) {
        const filter = nextProps.list.listing.filter((item) => {
          return searchData.location === ""
            ? searchData.looking_data === ""
              ? searchData.category_name === "all"
                ? item
                : item.category === searchData.category_name
              : searchData.category_name === "all"
              ? item.title
                  .toLowerCase()
                  .includes(searchData.looking_data.toLowerCase())
              : item.category === searchData.category_name &&
                item.title
                  .toLowerCase()
                  .includes(searchData.looking_data.toLowerCase())
            : searchData.looking_data === ""
            ? searchData.category_name === "all"
              ? item.location
                  .toLowerCase()
                  .includes(searchData.location.toLowerCase())
              : item.category === searchData.category_name &&
                item.location
                  .toLowerCase()
                  .includes(searchData.location.toLowerCase())
            : searchData.category_name === "all"
            ? item.location
                .toLowerCase()
                .includes(searchData.location.toLowerCase()) &&
              item.title
                .toLowerCase()
                .includes(searchData.looking_data.toLowerCase())
            : item.category === searchData.category_name &&
              item.location
                .toLowerCase()
                .includes(searchData.location.toLowerCase()) &&
              item.title
                .toLowerCase()
                .includes(searchData.looking_data.toLowerCase());
        });
        this.setState({
          list: filter,
          load: false,
          filter_list: nextProps.list.listing,
          category_name: searchData.category_name,
          looking_data: searchData.looking_data,
          location: searchData.location,
        });
        sessionStorage.removeItem("searchData");
      } else {
        this.setState({
          load: false,
          list: nextProps.list.listing,
          filter_list: nextProps.list.listing,
        });
      }
    }
  }

  componentDidMount() {
    this.props.getCategories();
    this.props.getListing();
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      { types: ["(regions)"] }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  }

  setAll = () => {
    sessionStorage.removeItem("searchData");
    this.setState({
      list: this.state.filter_list,
      looking_data: "",
      location: "",
      category_name: "All",
    });
  };

  mobileFilter = (e) => {
    $("#listing-top-banner").addClass("hidden");
    $("#footer").addClass("hidden");
    $("#listing-content").addClass("hidden");
    $("#listing-filter").removeClass("filter-hidden");
    $("#listing-title").addClass("hidden");
  };

  returnBack = (e) => {
    $("#listing-top-banner").removeClass("hidden");
    $("#footer").removeClass("hidden");
    $("#listing-content").removeClass("hidden");
    $("#listing-filter").addClass("filter-hidden");
    $("#listing-title").removeClass("hidden");
  };

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;
    if (!addressObject.address_components) {
      toastr.info("Select location correctly!");
      return false;
    }
    const value = address[0].long_name.toLowerCase();
    this.setState({
      list: Object.values(this.state.filter_list).filter(function (item) {
        return item.location.toLowerCase().includes(value) ? item : "";
      }),
      location: address[0].long_name,
    });
  }

  render() {
    // sorting here
    const { t } = this.props;
    const sort = [];
    Object.values(this.state.filter_list).map((item) => {
      return sort.push(item);
    });

    const sorting = (e) => {
      e.preventDefault();
      switch (e.target.getAttribute("href")) {
        case "heigh":
          this.setState({
            list: sort.sort(function (a, b) {
              var textA = a.price;
              var textB = b.price;

              if (textA < textB) return 1;
              if (textA > textB) return -1;
              return 0;
            }),
          });

          break;
        case "low":
          this.setState({
            list: sort.sort(function (a, b) {
              var textA = a.price;
              var textB = b.price;

              if (textA < textB) return -1;
              if (textA > textB) return 1;
              return 0;
            }),
          });
          break;
        case "a-z":
          this.setState({
            list: sort.sort(function (a, b) {
              var textA = a.title;
              var textB = b.title;

              if (textA < textB) return -1;
              if (textA > textB) return 1;
              return 0;
            }),
          });
          break;

        case "z-a":
          this.setState({
            list: sort.sort(function (a, b) {
              var textA = a.title;
              var textB = b.title;

              if (textA < textB) return 1;
              if (textA > textB) return -1;
              return 0;
            }),
          });
          break;
        default:
          this.setState({
            list: this.state.cate,
          });
      }
    };
    // sorting end
    // filter by search
    const search = (e) => {
      e.preventDefault();
      const value = e.target.value.toLowerCase();
      this.setState({
        list: Object.values(this.state.filter_list).filter(function (item) {
          return item.title.toLowerCase().includes(value) ? item : "";
        }),
        looking_data: e.target.value,
      });
    };

    // filter by category
    const category = (e) => {
      // e.preventDefault();
      const filter = Object.values(this.state.filter_list).filter((item) => {
        return item.category === e.target.value;
      });
      if (e.target.value !== "All") {
        this.setState({
          list: filter,
          category_name: e.target.value,
        });
      } else {
        this.setState({
          list: this.state.filter_list,
          category_name: e.target.value,
        });
      }
    };

    const handleChangePrice = (event, newValue) => {
      this.setState({
        min: newValue[0],
        max: newValue[1],
        list: Object.values(this.state.filter_list).filter((item1) => {
          return item1.price >= newValue[0] && item1.price <= newValue[1];
        }),
      });
    };

    const handleOpenNow = () => {
      const curDate = moment().unix();
      const openNowData = this.state.filter_list.filter((item) => {
        const openNowItem = item.sessions.filter(
          (session) =>
            moment(session.start_date).unix() - curDate < 86400 &&
            moment(session.start_date).unix() - curDate > 0
        );
        return openNowItem.length > 0 && item;
      });
      this.setState({
        list: openNowData,
      });
    };

    return (
      <Fragment>
        <section className="all-listing-wrapper section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="atbd_generic_header" id="listing-title">
                  <div className="atbd_generic_header_title">
                    <h4>{t("all_items")}</h4>
                    <p>
                      {t("total_listing_find")}:{" "}
                      {Object.values(this.state.list).length}
                    </p>
                  </div>
                  {/*<!-- ends: .atbd_generic_header_title -->*/}
                  <div
                    className="atbd_listing_action_btn btn-toolbar"
                    role="toolbar"
                  >
                    {/* <!-- Views dropdown --> */}
                    <div className="view-mode">
                      <NavLink
                        className="action-btn active"
                        to="all-listings-grid"
                        onClick={(e) => sessionStorage.removeItem("searchData")}
                      >
                        <span className="la la-th-large"></span>
                      </NavLink>
                      <NavLink className="action-btn" to="all-listings-list">
                        <span className="la la-list"></span>
                      </NavLink>
                    </div>
                    <div className="phone-filter">
                      <p
                        className="action-btn active"
                        onClick={this.mobileFilter}
                      >
                        <span className="la la-filter"></span>
                      </p>
                    </div>
                    <div
                      className="action-btn listing-all"
                      onClick={this.setAll}
                    >
                      {t("view_all")}
                    </div>
                    {/* <!-- Orderby dropdown --> */}
                    <div className="dropdown">
                      <a
                        className="action-btn dropdown-toggle"
                        href=" "
                        role="button"
                        id="dropdownMenuLink2"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {t("sort_by")} <span className="caret"></span>
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuLink2"
                      >
                        <a
                          className="dropdown-item"
                          onClick={sorting}
                          href="a-z"
                        >
                          {t("a_z")}
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={sorting}
                          href="z-a"
                        >
                          {t("z_a")}
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={sorting}
                          href="low"
                        >
                          {t("price_low_hight")}
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={sorting}
                          href="heigh"
                        >
                          {t("price_high_low")}
                        </a>
                      </div>
                    </div>
                  </div>
                  {/*<!-- ends: .atbd_listing_action_btn -->*/}
                </div>
                {/*<!-- ends: .atbd_generic_header -->*/}
              </div>{" "}
              {/*<!-- ends: .col-lg-12 -->*/}
              <div className="col-lg-12 listing-items">
                <div className="row">
                  <div
                    className="col-lg-4 order-lg-0 order-1 mt-5 mt-lg-0 filter-hidden"
                    id="listing-filter"
                  >
                    <div className="listings-sidebar">
                      <div className="search-area default-ad-search">
                        <p className="return-filter" onClick={this.returnBack}>
                          <i className="la la-arrow-circle-o-left"></i>
                        </p>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder={t(
                              "what_are_you_looking_for.placeholder"
                            )}
                            className="form-control"
                            onChange={search}
                            // onChange={e => this.filterFuc(e.target.value, "All", "")}
                            value={this.state.looking_data}
                          />
                        </div>
                        {/*<!-- ends: .form-group -->*/}

                        <div className="form-group">
                          <div className="select-basic">
                            <select
                              className="form-control"
                              onChange={category}
                              // onChange={e => this.filterFuc("", e.target.value, "")}
                              value={this.state.category_name}
                            >
                              <option value="All">
                                {t("select_a_cateogry_list")}
                              </option>
                              {Object.values(this.state.cate).map(
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
                          <div className="position-relative">
                            <input
                              id="autocomplete"
                              value={this.state.location}
                              className="form-control location-name"
                              onChange={(e) =>
                                this.setState({ location: e.target.value })
                              }
                              type="text"
                              placeholder={t("please_wirte_city_or_zip_code")}
                            />
                            <button type="submit" className="locator">
                              <span className="la la-crosshairs"></span>
                            </button>
                          </div>
                        </div>

                        <div className="form-group p-bottom-10">
                          <div className="price-range rs-primary">
                            <p className="d-flex justify-content-between">
                              <span>{t("price_range")}: </span>
                              <span style={{ color: "#358804" }}>
                                {"$" + this.state.min + " - "}
                                {"$" + this.state.max}{" "}
                              </span>
                            </p>
                            <Slider
                              defaultValue={[0, 5000]}
                              onChange={handleChangePrice}
                              max={5000}
                            />
                          </div>
                        </div>

                        <div className="check-btn">
                          <div
                            className="btn-checkbox active-color-secondary"
                            onClick={handleOpenNow}
                          >
                            <label>
                              <input type="checkbox" value="1" />
                              <span className="color-success">
                                <i className="la la-clock-o"></i>
                                {t("open_now")}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="filter-checklist">
                          <h5>{t("filter_by_ratings")}</h5>
                          <div className="sort-rating">
                            <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck7"
                              />
                              <label
                                className="custom-control-label pt-0"
                                htmlFor="customCheck7"
                              >
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck8"
                              />
                              <label
                                className="custom-control-label pt-0"
                                htmlFor="customCheck8"
                              >
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck9"
                              />
                              <label
                                className="custom-control-label pt-0"
                                htmlFor="customCheck9"
                              >
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck10"
                              />
                              <label
                                className="custom-control-label pt-0"
                                htmlFor="customCheck10"
                              >
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck11"
                              />
                              <label
                                className="custom-control-label pt-0"
                                htmlFor="customCheck11"
                              >
                                <span className="active">
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck12"
                              />
                              <label
                                className="custom-control-label pt-0"
                                htmlFor="customCheck12"
                              >
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                                <span>
                                  <i className="la la-star"></i>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {/*!-- ends: .filter-checklist -->*/}
                        <a
                          href=" "
                          onClick={noAction}
                          className="btn btn-gradient btn-gradient-two btn-block btn-icon icon-right m-top-40"
                        >
                          {t("serach_filter")}{" "}
                          <span className="la la-long-arrow-right"></span>
                        </a>
                        {/*<!-- ends: form -->*/}
                      </div>
                    </div>
                  </div>{" "}
                  {/* wiget */}
                  <div
                    className="col-lg-8 order-lg-1 order-0"
                    id="listing-content"
                  >
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
                    ) : (
                      <div className="">
                        {Object.values(this.state.list).length > 0 ? (
                          <ListingCardGrid6 list={this.state.list} />
                        ) : (
                          <div className="col-lg-12">
                            <div className="alert alert-success" role="alert">
                              {t("data_not_find")}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.list,
    cate: state.category.categories,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getListing: () => dispatch(getListing()),
    getCategories: () => dispatch(getCategories()),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(Listing);
