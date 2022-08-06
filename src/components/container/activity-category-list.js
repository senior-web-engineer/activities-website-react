import Slider from "@material-ui/core/Slider";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { setPageLoading, SortByData } from "Store/action/appAction";
import toastr from "toastr";
import { getCategories } from "../../Store/action/categories";
import ListingCardGrid6 from "../content/element/card/card-listing-grid-6";

let autocomplete = null;
const noAction = (e) => e.preventDefault();

export default function ActivityList(props) {
  const dispatch = useDispatch();
  const [filterList, setFilterList] = useState([]);
  const [filterByName, setFilterByName] = useState(null);
  const [location, setLocation] = useState("");
  const [lookingData, setlookingData] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);
  const history = useHistory();

  const isLoading = useSelector((state) => state.app?.isPageLoading || false);
  const categoryList = useSelector((state) => state.category)?.categories || [];
  const list = useSelector((state) => state.list)?.listing || [];
  const { t } = useTranslation();

  const mobileFilter = () => {
    $("#listing-top-banner").addClass("hidden");
    $("#footer").addClass("hidden");
    $("#listing-content").addClass("hidden");
    $("#listing-filter").removeClass("filter-hidden");
    $("#listing-title").addClass("hidden");
  };

  const returnBack = (e) => {
    $("#listing-top-banner").removeClass("hidden");
    $("#footer").removeClass("hidden");
    $("#listing-content").removeClass("hidden");
    $("#listing-filter").addClass("filter-hidden");
    $("#listing-title").removeClass("hidden");
  };

  const sorting = (e) => {
    e.preventDefault();

    switch (e.target.getAttribute("href")) {
      case "heigh":
        setFilterList(SortByData(filterByName, "price").slice());
        break;
      case "low":
        setFilterList(SortByData(filterByName, "price").reverse().slice());
        break;
      case "a-z":
        setFilterList(
          filterByName
            .sort((a, b) => {
              if (a.title < b.title) return -1;
              if (a.title > b.title) return 1;
              return 0;
            })
            .slice()
        );
        break;
      case "z-a":
        setFilterList(
          filterByName
            .sort((a, b) => {
              if (a.title < b.title) return 1;
              if (a.title > b.title) return -1;
              return 0;
            })
            .slice()
        );
        break;
      default:
    }
  };

  // filter by category
  const handleChangeCateogry = (e) => {
    // e.preventDefault();
    console.log(e.target.value, "value");
    const filter = filterByName.filter(
      (item) => item.category === e.target.value
    );
    if (e.target.value !== "All") {
      setFilterList(filter);
      setCategoryName(e.target.value);
      history.push(`/all-listings-grid/${e.target.value.replace(/ /g, "-")}`);
    } else {
      setFilterList(filter);
      setCategoryName(e.target.value);
      history.push(`/all-listings-grid`);
    }
  };

  const handleChangePrice = (event, newValue) => {
    setMin(newValue[0]);
    setMax(newValue[1]);
    setFilterList(
      filterByName.filter(
        (item1) => item1.price >= newValue[0] && item1.price <= newValue[1]
      )
    );
  };

  const handleOpenNow = () => {
    const curDate = moment().unix();
    const openNowData = filterByName.filter((item) => {
      const openNowItem = item.sessions.filter(
        (session) =>
          moment(session.start_date).unix() - curDate < 86400 &&
          moment(session.start_date).unix() - curDate > 0
      );
      return openNowItem.length > 0 && item;
    });
    setFilterList(openNowData);
  };

  const search = (e) => {
    e.preventDefault();
    const value = e.target.value.toLowerCase();
    setFilterList(
      filterByName.filter((item) => item?.title.toLowerCase().includes(value))
    );
    setlookingData(e.target.value);
  };

  const setAll = () => {
    setFilterList(filterByName);
  };

  const handlePlaceSelect = () => {
    let addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;
    if (!addressObject.address_components) {
      toastr.info("Select location correctly!");
      return false;
    }
    const value = address[0].long_name;
    setFilterList(
      categoryList.filter((item) =>
        item?.location.toLowerCase().includes(value?.toLowerCase()) ? item : ""
      )
    );
    setLocation(value);
  };

  useEffect(() => {
    setPageLoading(dispatch, true);
    dispatch(getCategories());
    let google = window.google;
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      { types: ["(regions)"] }
    );
    autocomplete.addListener("place_changed", handlePlaceSelect);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const categoryname = props?.match?.params?.categoryname?.replace(/-/g, " ");
    if (filterByName !== null) {
      setPageLoading(dispatch, false);
    }
    setFilterList(list.filter((item) => item?.category === categoryname));
    setFilterByName(list.filter((item) => item?.category === categoryname));
    setCategoryName(categoryname);
    // eslint-disable-next-line
  }, [props, list]);

  return (
    <>
      <section className="all-listing-wrapper section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="atbd_generic_header" id="listing-title">
                <div className="atbd_generic_header_title">
                  <h4>{t("all_items")}</h4>
                  <p>
                    {t("total_listing_find")}: {filterList.length}
                  </p>
                </div>
                <div
                  className="atbd_listing_action_btn btn-toolbar"
                  role="toolbar"
                >
                  {/* <!-- Views dropdown --> */}
                  <div className="view-mode">
                    <NavLink
                      className="action-btn active"
                      to="all-listings-grid"
                    >
                      <span className="la la-th-large"></span>
                    </NavLink>
                    <NavLink className="action-btn" to="all-listings-list">
                      <span className="la la-list"></span>
                    </NavLink>
                  </div>
                  <div className="phone-filter">
                    <p className="action-btn active" onClick={mobileFilter}>
                      <span className="la la-filter"></span>
                    </p>
                  </div>
                  <div className="action-btn listing-all" onClick={setAll}>
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
                      <a className="dropdown-item" onClick={sorting} href="a-z">
                        {t("a_z")}
                      </a>
                      <a className="dropdown-item" onClick={sorting} href="z-a">
                        {t("z_a")}
                      </a>
                      <a className="dropdown-item" onClick={sorting} href="low">
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
              </div>
            </div>{" "}
            <div className="col-lg-12 listing-items">
              <div className="row">
                <div
                  className="col-lg-4 order-lg-0 order-1 mt-5 mt-lg-0 filter-hidden"
                  id="listing-filter"
                >
                  <div className="listings-sidebar">
                    <div className="search-area default-ad-search">
                      <p className="return-filter" onClick={returnBack}>
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
                          value={lookingData}
                        />
                      </div>
                      {/*<!-- ends: .form-group -->*/}

                      <div className="form-group">
                        <div className="select-basic">
                          <select
                            className="form-control"
                            onChange={handleChangeCateogry}
                            // onChange={e => this.filterFuc("", e.target.value, "")}
                            value={categoryName}
                          >
                            <option value="All">
                              All Cateogry
                              {/* {t("All Category")}
                               */}
                            </option>
                            {categoryList.map((value, key) => {
                              return (
                                <option key={key} value={value?.category}>
                                  {value?.category}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="position-relative">
                          <input
                            id="autocomplete"
                            value={location}
                            className="form-control location-name"
                            onChange={(e) => setLocation(e.target.value)}
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
                              {"$" + min + " - "}
                              {"$" + max}{" "}
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
                <div
                  className="col-lg-8 order-lg-1 order-0"
                  id="listing-content"
                >
                  {isLoading ? (
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
                      {filterList.length > 0 ? (
                        <ListingCardGrid6 list={filterList} />
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
    </>
  );
}
