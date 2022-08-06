import moment from "moment";
import React, { Fragment } from "react";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import avatar from "../../../../assets/img/default.jpg";
import { MultiLang } from "../widget";

export default function CardListingDatabase({
  item = {},
  currency = "$",
  handleSelectFavorite = console.log(),
  nextSession = console.log(),
  className = "",
}) {
  return (
    <div className={className}>
      <div className="atbd_single_listing ">
        <article className="atbd_single_listing_wrapper">
          <figure className="atbd_listing_thumbnail_area">
            <div className="atbd_listing_image">
              <NavLink
                to={{
                  pathname: item?.url ?? "",
                  state: {
                    params: { listing_id: item?.listing_id ?? "" },
                  },
                }}
              >
                <LazyLoad>
                  <img src={item?.img?.[0] ?? "#"} alt="" />
                </LazyLoad>
              </NavLink>
            </div>
            {/*<!-- ends: .atbd_listing_image -->*/}
            <div className="atbd_author atbd_author--thumb">
              <a href=" ">
                <img
                  src={item?.user ?? avatar}
                  style={{ width: "40px" }}
                  alt=""
                />
                <span className="custom-tooltip">{item?.author ?? ""}</span>
              </a>
            </div>
            {item?.camp_type === 2 && (
              <div className="virtual-mark">
                <MultiLang text="virtual" />
              </div>
            )}
            {item?.displayPrice === 0 && (
              <div className="free-listing-mark">
                <span>free activity</span>
              </div>
            )}
          </figure>
          {/*<!-- ends: .atbd_listing_thumbnail_area -->*/}
          <div className="atbd_listing_info">
            <Fragment>
              <div className="atbd_content_upper best-listing-info">
                <h4 className="atbd_listing_title blog-title-clip">
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
                    {item?.title ? item.title : item?.company ?? ""}
                  </NavLink>
                </h4>
                <div className="atbd_card_action">
                  {item?.displayPrice >= 0 && (
                    <div className="atbd_listing_meta">
                      <h2 className="atbd_meta atbd_listing_rating price-title color-white">
                        {item?.displayPrice === 0
                          ? "Free"
                          : `${currency} ${item?.displayPrice}`}
                      </h2>
                      {/* <span className="atbd_meta atbd_listing_rating">
                                  {rating === 0 ? "No Rating" : rating}
                                  <i className="la la-star"></i>
                                </span> */}
                    </div>
                  )}
                  {/*<!-- ends: .atbd listing meta -->*/}
                  <h5 className="card-category">
                    <i className="la la-tag"></i>
                    {item?.category ?? ""}
                  </h5>
                </div>
                {item?.video_url && (
                  <p className="font-style p-top-0">
                    <a
                      className="p-left-10"
                      href={"https://" + item?.video_url ?? ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.video_url ?? ""}
                    </a>
                  </p>
                )}
              </div>
              {/*<!-- end .atbd_content_upper -->*/}
              <div
                className="atbd_listing_bottom_content"
                style={{ minHeight: "170px" }}
              >
                <div className="listing-meta">
                  <div className="like-button">
                    <div
                      className="atbd_content_right"
                      onClick={(e) => handleSelectFavorite(item?.id ?? "")}
                    >
                      {item?.favFlag ? (
                        <i className="la la-heart liked" id="grid-like"></i>
                      ) : (
                        <i className="la la-heart-o" id="grid-like"></i>
                      )}
                    </div>
                  </div>
                  {Boolean(item?.author) && (
                    <p>
                      <span>
                        <MultiLang text="by" /> :{" "}
                      </span>
                      {item?.author || "Not Yet"}
                    </p>
                  )}
                  <div
                    className="d-flex flex-nowrap"
                    style={{ height: "53px" }}
                  >
                    <p style={{ whiteSpace: "nowrap" }}>
                      <MultiLang text="address" />:{" "}
                    </p>
                    <p className="p-left-5 text-break">
                      {" "}
                      {item?.location ?? ""}
                    </p>
                  </div>
                  {item?.sessions?.length > 0 && (
                    <>
                      <p onClick={(e) => nextSession(item?.listing_id ?? "")}>
                        <span className="next-session">
                          <MultiLang text="next" /> <MultiLang text="session" />
                          <i className="la la-arrow-right"></i>
                        </span>
                      </p>
                      <p className="pl-20 size_14">
                        {`${moment(
                          item?.sessions[item?.selSessionKey].start_date
                        ).format("MMM D, hh:mm a")} ~ ${moment(
                          item?.sessions[item?.selSessionKey].start_date
                        ).format("MMM D, YYYY hh:mm a")}`}
                      </p>
                    </>
                  )}
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
}
