import React, { Fragment } from "react";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import { MultiLang } from "../widget";

export default function CardListingCSV({
  item = {},
  currency = "us",
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
                    params: { csvfile: item },
                  },
                }}
              >
                <LazyLoad>
                  <img src={item?.img?.[0] ?? "#"} alt="" />
                </LazyLoad>
              </NavLink>
            </div>
            {/*<!-- ends: .atbd_listing_image -->*/}
            {/* <div className="atbd_author atbd_author--thumb">
              <a href=" ">
                <img
                  src={item?.user ?? avatar}
                  style={{ width: "40px" }}
                  alt=""
                />
                <span className="custom-tooltip">{item?.author ?? ""}</span>
              </a>
            </div> */}
          </figure>
          {/*<!-- ends: .atbd_listing_thumbnail_area -->*/}
          <div className="atbd_listing_info">
            <Fragment>
              <div className="atbd_content_upper">
                <h4 className="atbd_listing_title blog-title-clip">
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
                </h4>
                <div className="atbd_card_action">
                  <h5 className="card-category">
                    <i className="la la-tag"></i>
                    {item?.category ?? ""}
                  </h5>
                </div>
                {/* {item?.video_url && (
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
                )} */}
              </div>
              {/*<!-- end .atbd_content_upper -->*/}

              <div className="atbd_listing_bottom_content">
                {/* <div className="like-button">
                    <div
                      className="atbd_content_right"
                      onClick={(e) => this.setFavorite(item?.id ?? "")}
                    >
                      {item?.favFlag ? (
                        <i className="la la-heart liked" id="grid-like"></i>
                      ) : (
                        <i className="la la-heart-o" id="grid-like"></i>
                      )}
                    </div>
                  </div> */}
                {/* {Boolean(item?.author) && (
                    <p>
                      <span>
                        <MultiLang text="by" /> :{" "}
                      </span>
                      {item?.author || "Not Yet"}
                    </p>
                  )} */}
                <div
                  className="d-flex flex-nowrap"
                  style={{ height: "70px", color: "#333" }}
                >
                  <p style={{ whiteSpace: "nowrap" }}>
                    <MultiLang text="address" />:{" "}
                  </p>
                  <p className="p-left-5 text-break"> {item?.location ?? ""}</p>
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
