import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import Img from "react-cool-img";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import toastr from "toastr";
import avatar from "../../../../assets/img/default.jpg";
import loadinggif from "../../../../assets/img/loading.gif";
import { setFavouriteData } from "../../../../Store/action/favourite";
import { MultiLang } from "../widget";

const noAction = (e) => {
  e.preventDefault();
};
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

export default function ProviderActivities({ providerId }) {
  const dispatch = useDispatch();
  const [providerActivities, setProviderActivities] = useState([]);
  const list = useSelector((state) => state.list)?.listing || [];
  const currency = useSelector((state) => state.app)?.currency;

  useEffect(() => {
    setProviderActivities(
      list.filter((item) => item?.advertiser_id === providerId)
    );
    // eslint-disable-next-line
  }, [list]);

  const nextSession = (id) => {
    const adLists = providerActivities;
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
    setProviderActivities(adLists);
  };

  const setFavorite = (id) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toastr.info("Please sign in page!");
      return false;
    }
    providerActivities
      .filter((item) => item.id === id)
      .forEach((item) => (item.favFlag = !item.favFlag));
    const data = providerActivities.filter((item) => item.id === id);
    setProviderActivities(providerActivities.slice());
    dispatch(setFavouriteData(data));
  };

  return (
    <div className="container">
      <Slider {...settings}>
        {providerActivities &&
          providerActivities.length > 0 &&
          providerActivities.map((value, key) => {
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
              video_url,
              favFlag,
              camp_type,
              // extraSession,
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
                        <NavLink to="/#" onClick={noAction}>
                          <img
                            src={user ? user : avatar}
                            style={{ width: "40px" }}
                            alt="AuthorImage"
                          />
                          <span className="custom-tooltip">{author}</span>
                        </NavLink>
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
                    </figure>
                    {/*<!-- ends: .atbd_listing_thumbnail_area -->*/}
                    <div className="atbd_listing_info">
                      <Fragment>
                        <div className="atbd_content_upper best-listing-info">
                          <h4 className="atbd_listing_title">
                            <NavLink
                              to={{
                                pathname: url,
                                state: { params: { listing_id: listing_id } },
                              }}
                            >
                              {title}
                            </NavLink>
                          </h4>
                          <div className="atbd_card_action">
                            {rating >= 0 && (
                              <div className="atbd_listing_meta">
                                <h2 className="atbd_meta atbd_listing_rating price-title color-white">
                                  {displayPrice === 0
                                    ? "Free"
                                    : `${currency?.currency
                                    }${" "}${displayPrice}`}
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
                              {category}
                            </h5>
                          </div>
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
                        </div>
                        {/*<!-- end .atbd_content_upper -->*/}
                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <div className="like-button">
                              <div
                                className="atbd_content_right"
                                onClick={(e) => setFavorite(id)}
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
                                {" "}
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
                              <p className="p-left-5 text-break"> {location}</p>
                            </div>
                            <p>
                              <span
                                className="next-session"
                                onClick={() => nextSession(listing_id)}
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
                                sessions[selSessionKey].start_date
                              ).format("MMM D, YYYY hh:mm a")}`}
                            </p>
                          </div>
                        </div>
                      </Fragment>
                    </div>
                  </article>
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
}
