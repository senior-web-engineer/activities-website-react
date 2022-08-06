import "react-phone-input-2/lib/style.css";

import React, { Component, Fragment } from "react";
import { useSelector } from "react-redux";
import FontAwesome from "react-fontawesome";
import Autocomplete from "react-google-autocomplete";
import PhoneInput from "react-phone-input-2";
import { NavLink } from "react-router-dom";

import image from "../../../assets/img/default-img.svg";
import SessionDateInput from "./card/session-date-input";
import { useTranslation } from "react-i18next";

export function MultiLang({ text }) {
  const { t } = useTranslation();
  return <>{t(`${text}`)}</>;
}

export function SimilarListingCSV({ category = "", currency = "$" }) {
  const activities = useSelector((state) => state?.list?.listing) ?? [];
  return (
    <ul className="listings">
      {activities?.length > 0 &&
        activities
          .filter((item) => item.category.includes(category))
          ?.slice(0, 4)
          .map((value, key) => {
            const params = Boolean(value?.activityType)
              ? { params: { csvfile: value } }
              : { params: { listing_id: value.listing_id } };
            return (
              <li key={key}>
                <div className="atbd_left_img">
                  <NavLink
                    to={{
                      pathname: value.url,
                      state: params,
                    }}
                  >
                    <div className="thumbnail">
                      <img
                        className="portrait"
                        src={value.img ? value.img?.[0] ?? "" : image}
                        style={{ width: "90px" }}
                        alt="listingimage"
                      />
                    </div>
                  </NavLink>
                </div>
                <div className="atbd_right_content">
                  <div className="cate_title">
                    <h4>
                      <NavLink
                        to={{
                          pathname: value.url,
                          state: params,
                        }}
                      >
                        {value?.title ? value?.title : value?.company ?? ""}
                      </NavLink>
                    </h4>
                  </div>
                  {Boolean(value?.price) && (
                    <p className="listing_value">
                      <span>
                        {currency}
                        {value?.price ?? ""}
                      </span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
    </ul>
  );
}

export function PopularListingCSV({ currency = "$" }) {
  const activities = useSelector((state) => state?.list?.listing) ?? [];
  return (
    <>
      <ul className="listings">
        {activities.length > 0 &&
          activities.slice(0, 4).map((value, key) => {
            return (
              <li key={key}>
                <div className="atbd_left_img">
                  <NavLink
                    to={{
                      pathname: value.url,
                      state: {
                        params: { listing_id: value.listing_id },
                      },
                    }}
                  >
                    <div className="thumbnail">
                      <img
                        className="portrait"
                        src={value.img}
                        style={{ width: "90px" }}
                        alt="listingimage"
                      />
                    </div>
                  </NavLink>
                </div>
                <div className="atbd_right_content">
                  <div className="cate_title">
                    <h4>
                      <NavLink
                        to={{
                          pathname: value.url,
                          state: {
                            params: { listing_id: value.listing_id },
                          },
                        }}
                      >
                        {value.title}
                      </NavLink>
                    </h4>
                  </div>
                  <p className="listing_value">
                    <span>
                      {currency}
                      {value.price}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
}

class SimilarListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      simliarListing: [],
      image: "",
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const name = nextProps.category_name.category;
    const filterData = nextProps.list.filter((item) => item.category === name);
    this.setState({
      simliarListing: filterData,
    });
  }
  render() {
    const { simliarListing } = this.state;
    return (
      <Fragment>
        <ul className="listings">
          {simliarListing.length > 0 &&
            Object.values(simliarListing)
              .slice(0, 4)
              .map((value, key) => {
                return (
                  <li key={key}>
                    <div className="atbd_left_img">
                      <NavLink
                        to={{
                          pathname: value.url,
                          state: { params: { listing_id: value.listing_id } },
                        }}
                      >
                        <div className="thumbnail">
                          <img
                            className="portrait"
                            src={value.img ? value.img : image}
                            style={{ width: "90px" }}
                            alt="listingimage"
                          />
                        </div>
                      </NavLink>
                    </div>
                    <div className="atbd_right_content">
                      <div className="cate_title">
                        <h4>
                          <NavLink
                            to={{
                              pathname: value.url,
                              state: {
                                params: { listing_id: value.listing_id },
                              },
                            }}
                          >
                            {value.title}
                          </NavLink>
                        </h4>
                      </div>
                      <p className="listing_value">
                        <span>${value.price}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
        </ul>
      </Fragment>
    );
  }
}

class PopularListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popularListing: [],
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const filterData = nextProps.list.filter((item) => item.price > 30);
    this.setState({
      popularListing: filterData,
    });
  }
  render() {
    const { popularListing } = this.state;
    return (
      <Fragment>
        <ul className="listings">
          {popularListing.length > 0 &&
            Object.values(popularListing)
              .slice(0, 4)
              .map((value, key) => {
                return (
                  <li key={key}>
                    <div className="atbd_left_img">
                      <NavLink
                        to={{
                          pathname: value.url,
                          state: {
                            params: { listing_id: value.listing_id },
                          },
                        }}
                      >
                        <div className="thumbnail">
                          <img
                            className="portrait"
                            src={value.img}
                            style={{ width: "90px" }}
                            alt="listingimage"
                          />
                        </div>
                      </NavLink>
                    </div>
                    <div className="atbd_right_content">
                      <div className="cate_title">
                        <h4>
                          <NavLink
                            to={{
                              pathname: value.url,
                              state: {
                                params: { listing_id: value.listing_id },
                              },
                            }}
                          >
                            {value.title}
                          </NavLink>
                        </h4>
                      </div>
                      <p className="listing_value">
                        <span>${value.price}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
        </ul>
      </Fragment>
    );
  }
}

export function SessionDate(props) {
  const { t } = useTranslation();
  return (
    <Fragment>
      {props.sessions.length > 0 &&
        props.sessions.map((item, i) => {
          return (
            <div
              className="directorist row atbdp_faqs_wrapper cu-input-padding session-modified m-left-10"
              id="faqsID-0"
              key={i}
            >
              <div className="col-md-4 col-sm-12 mb-20">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    <MultiLang text="session_name" />
                  </label>
                  <input
                    type="text"
                    name="session_name"
                    className="form-control"
                    value={item.session_title}
                    onChange={(e) => props.onUpdate(i, e.target.value, "ti")}
                    placeholder={t("session_name")}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12 mb-20">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    <MultiLang text="pricing" /> (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => props.onUpdate(i, e.target.value, "pr")}
                    className="form-control"
                    placeholder={t("pricing")}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12 mb-20">
                <div className="form-group">
                  <label className="form-label">
                    <MultiLang text="attendees" />
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    className="form-control"
                    value={item.availability}
                    onChange={(e) => props.onUpdate(i, e.target.value, "att")}
                    placeholder={t("enter_attendees_num")}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12 col-sm-12 mb-20">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    <MultiLang text="session_desc" />
                  </label>
                  <input
                    type="text"
                    name="session-description"
                    className="form-control"
                    value={item.session_description}
                    onChange={(e) => props.onUpdate(i, e.target.value, "des")}
                    placeholder={t("session_desc")}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-sm-7">
                    <div className="form-group">
                      <SessionDateInput
                        date={item.start_date}
                        handleSetDate={(exStartDate) =>
                          props.onUpdate(i, exStartDate, "sd")
                        }
                      />
                      {/* <input
                          type="date"
                          placeholder="Start"
                          value={item.start_date}
                          onChange={(e) => {
                            props.onUpdate(i, e.target.value, "sd");
                          }}
                          className="form-control atbdp_faqs_quez"
                        /> */}
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="form-group">
                      <input
                        type="time"
                        placeholder="Start"
                        onChange={(e) =>
                          props.onUpdate(i, e.target.value, "st")
                        }
                        value={item.start_time}
                        className="form-control atbdp_faqs_quez"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-sm-7">
                    <div className="form-group">
                      <SessionDateInput
                        date={item.end_date}
                        handleSetDate={(exEndDate) =>
                          props.onUpdate(i, exEndDate, "ed")
                        }
                      />
                      {/* <input
                          type="date"
                          placeholder="Start"
                          value={item.end_date}
                          onChange={(e) =>
                            props.onUpdate(i, e.target.value, "ed")
                          }
                          className="form-control atbdp_faqs_quez"
                        /> */}
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="form-group">
                      <input
                        type="time"
                        value={item.end_time}
                        onChange={(e) =>
                          props.onUpdate(i, e.target.value, "et")
                        }
                        placeholder="Start"
                        className="form-control atbdp_faqs_quez"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <i
                className="la la-trash la-2x session-icon mt-10"
                onClick={() => props.onDelete(i)}
              ></i>
            </div>
          );
        })}
    </Fragment>
  );
}

class ParentInfo extends Component {
  render() {
    return (
      <Fragment>
        {this.props.padd.map((item, key) => {
          return (
            <div
              className="row guardian-info mb-10 m-right-0 m-left-0"
              key={key}
            >
              <div className="info-cross">
                <FontAwesome
                  name="times"
                  onClick={(e) => this.props.pdelete(key)}
                />
              </div>
              <div className="col-md-6">
                <label>
                  <MultiLang text="name" /> :
                </label>
                <input
                  type="text"
                  className="form-control cu-radius"
                  placeholder={this.props.placename}
                  value={item.name}
                  onChange={(e) =>
                    this.props.pupdate(key, e.target.value, "gu")
                  }
                  required
                />
              </div>
              <div className="col-md-6 book-phone">
                <label>
                  <MultiLang text="phone" /> :
                </label>
                <PhoneInput
                  country={"us"}
                  value={item.phone}
                  onChange={(phone) => this.props.pupdate(key, phone, "ph")}
                />
              </div>
              <div className="col-md-12 pt-20">
                <label>
                  <MultiLang text="address" /> :
                </label>
                <Autocomplete
                  onPlaceSelected={(place) => {
                    this.props.pupdate(key, place.formatted_address, "ad");
                  }}
                  className="form-control cu-radius"
                  defaultValue={item.address || ""}
                  types={["(regions)"]}
                  placeholder={this.props.placeaddress}
                  required
                  // componentRestrictions={{ country: "us" }}
                />
                {/* <input
                  type="text"
                  name="address"
                  className="form-control cu-radius"
                  placeholder="Please enter address"
                  value={item.address}
                  onChange={(e) =>
                    this.props.pupdate(key, e.target.value, "ad")
                  }
                  required
                /> */}
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }
}

export function PopularPost(props) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="widget-wrapper">
        <div className="widget-default">
          <div className="widget-header">
            <h6 className="widget-title">{t("popular_post")}</h6>
          </div>
          <div className="widget-content">
            <div className="sidebar-post">
              {props.blog &&
                props.blog.length > 0 &&
                Object.values(props.blog)
                  .slice(0, 4)
                  .map((value, key) => {
                    return (
                      <div className="post-single" key={key}>
                        <div className="d-flex align-items-center">
                          <NavLink
                            to={{
                              pathname: `/blog-details/${value.title.replace(
                                / /g,
                                "-"
                              )}`,
                              state: { category_id: value.id },
                            }}
                          >
                            <img
                              src={value.img_url}
                              alt=""
                              style={{ width: "90px" }}
                            />
                          </NavLink>
                          <p>
                            <span>{value.date}</span>{" "}
                            <span>{value.category_name}</span>
                          </p>
                        </div>
                        <NavLink
                          to={{
                            pathname: `/blog-details/${value.title.replace(
                              / /g,
                              "-"
                            )}`,
                            state: { category_id: value.id },
                          }}
                          className="post-title"
                        >
                          {value.title.split("").slice(0, 30)}
                        </NavLink>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export function RecentPost(props) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="widget-wrapper">
        <div className="widget-default">
          <div className="widget-header">
            <h6 className="widget-title">{t("popular_post")}</h6>
          </div>
          <div className="widget-content">
            <div className="sidebar-post">
              {props.blog &&
                props.blog.length > 0 &&
                Object.values(props.blog)
                  .slice(0, 4)
                  .map((value, key) => {
                    return (
                      <div className="post-single" key={key}>
                        <div className="d-flex align-items-center">
                          <NavLink
                            to={{
                              pathname: `/blog-details/${value.title.replace(
                                / /g,
                                "-"
                              )}`,
                              state: { category_id: value.id },
                            }}
                          >
                            <img
                              src={value.img_url}
                              alt=""
                              style={{ width: "90px" }}
                            />
                          </NavLink>
                          <p>
                            <span>{value.date}</span>{" "}
                            <span>{value.category_name}</span>
                          </p>
                        </div>
                        <NavLink
                          to={{
                            pathname: `/blog-details/${value.title.replace(
                              / /g,
                              "-"
                            )}`,
                            state: { category_id: value.id },
                          }}
                          className="post-title"
                        >
                          {value.title.split("").slice(0, 30)}
                        </NavLink>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export function Category(props) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="widget-wrapper">
        <div className="widget-default">
          <div
            className="widget-header d-flex justify-content-between align-items-center "
            style={{ borderBottom: "1px solid #e3e6ef" }}
          >
            <h6 className="widget-title" style={{ borderBottom: "none" }}>
              {t("categories")}
            </h6>
            <h6 className="p-right-20 pointer" onClick={props.onViewAll}>
              {t("view_all")}
            </h6>
          </div>
          <div className="widget-content">
            <div className="category-widget">
              <ul>
                {props.list &&
                  props.list.length > 0 &&
                  props.list.map((item, key) => {
                    return (
                      <li className="arrow-list4" key={key}>
                        <p
                          className="pointer"
                          onClick={(e) =>
                            props.filterCategory(item.category_id)
                          }
                          to="/at_demo"
                        >
                          {item.category}
                        </p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export { SimilarListing, PopularListing, ParentInfo };
