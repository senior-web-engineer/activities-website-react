import React, { Component, Fragment } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import { getActivityLists } from "../../../../Store/action/listing";
import defaultImage from "../../../../assets/img/faq-back.jpg";
import BoostAds from "../../../content/element/modal/boost-ads";
import couponImg from "../../../../assets/img/coupon.svg";
import starred from "../../../../assets/img/starred.svg";
import CouponLists from "../../../content/element/modal/coupon-lists";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import moment from "moment";
import { MultiLang } from "../widget";

class CardBoost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reload: false,
      open: false,
      copen: false,
    };
  }
  closeBoostModal = (flag) => {
    this.setState({ open: flag });
    this.setState({ copen: flag });
  };
  render() {
    const { list } = this.props;
    const curDate = moment().unix();
    return (
      <Fragment>
        {this.state.reload && (
          <div className="custom-loader">
            <Loader
              type="Oval"
              color="#afdb30"
              height={70}
              width={70}
              timeout={1500}
            />
          </div>
        )}
        {list.map((value, key) => {
          const {
            id,
            picture,
            ad_title,
            address,
            start_date,
            displayPrice,
            end_date,
            boost_date_limit,
            camp_type,
            ad_view,
            ad_click,
            video,
          } = value;
          return (
            <div className="col-lg-12" key={key}>
              <div className="atbd_single_listing atbd_listing_list my-activities-card">
                <article className="atbd_single_listing_wrapper">
                  <figure className="atbd_listing_thumbnail_area">
                    <div className="atbd_listing_image cu-image">
                      <img
                        src={picture.length > 0 ? picture : defaultImage}
                        alt="listingimage"
                      />
                      {boost_date_limit !== undefined &&
                        curDate < boost_date_limit.seconds && (
                          <div className="boost-mark">
                            <MultiLang text={"boost_paid_to"} />
                            {moment(boost_date_limit.seconds * 1000).format(
                              "MM.DD.YYYY"
                            )}
                          </div>
                        )}
                    </div>
                    <div className="listing-prices">
                      {this.props.currency} {displayPrice}
                    </div>
                    {camp_type === 2 && (
                      <div className="virtual-mark">
                        <MultiLang text="virtual" />
                      </div>
                    )}
                    {displayPrice === 0 && (
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
                      <div>
                        <div className="cu-inline-block">
                          <h4 className="atbd_listing_title">{ad_title}</h4>
                        </div>
                        <div className="cu-inline-block cu-float-right cu-display-flex">
                          {/* <button
                            className="ads-btn"
                            onClick={(e) =>
                              this.setState({ open: !this.state.open })
                            }
                          >
                            Make Featured
                          </button> */}
                        </div>
                      </div>
                      {/*<!-- End atbd listing meta -->*/}
                      <div className="atbd_listing_data_list">
                        <ul>
                          <p className="m-top-10">
                            <i className="la la-map-marker p-right-5"></i>
                            {address &&
                              address.street +
                                ", " +
                                address.city +
                                ", " +
                                address.state +
                                ", " +
                                address.country}
                          </p>
                          {boost_date_limit !== undefined && (
                            <p className="m-top-10 p-right-5">
                              <span className="la la-star"></span>Boost paid to{" "}
                              {moment(boost_date_limit.seconds * 1000).format(
                                "ddd, MM DD YYYY"
                              )}
                            </p>
                          )}
                          <li>
                            <p>
                              <i className="la la-calendar-o m-right-5"></i>
                              {moment(
                                (start_date.seconds +
                                  start_date.nanoseconds / 1000000000) *
                                  1000
                              ).format("MM/DD/YYYY HH:mm")}{" "}
                              ~{" "}
                              {moment(
                                (end_date.seconds +
                                  end_date.nanoseconds / 1000000000) *
                                  1000
                              ).format("MM/DD/YYYY HH:mm")}
                            </p>
                          </li>
                          {video && (
                            <li>
                              <p className="font-style p-0">
                                <VideoLibraryIcon fontSize="small" />
                                <a
                                  className="p-left-10"
                                  href={"https://" + video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {video}
                                </a>
                              </p>
                            </li>
                          )}
                        </ul>
                      </div>
                      <div
                        className="m-top-10"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "33.33% 33.33% 33.33%",
                        }}
                      >
                        <div className="text-center">
                          <span>
                            <MultiLang text="views" />
                          </span>
                          <div className="view-cnt">{ad_view}</div>
                        </div>
                        <div className="text-center">
                          <span>
                            {" "}
                            <MultiLang text="clicks" />
                          </span>
                          <div className="view-cnt">{ad_click}</div>
                        </div>
                        <div className="text-center">
                          <span>
                            {" "}
                            <MultiLang text="conversation" />
                          </span>
                          <div className="view-cnt">23</div>
                        </div>
                      </div>
                      <BoostAds
                        flag={this.state.open}
                        onClose={this.closeBoostModal}
                        id={id}
                        address={address}
                      />
                      <CouponLists
                        flag={this.state.copen}
                        onClose={this.closeBoostModal}
                        id={id}
                      />
                      <div className="d-flex justify-content-around m-top-10">
                        <button
                          className="boost-btn"
                          onClick={(e) =>
                            this.setState({ open: !this.state.open })
                          }
                        >
                          <img src={starred} alt="" />
                          <MultiLang text="make-featured" />
                        </button>
                        <button
                          className="boost-btn"
                          onClick={(e) => {
                            this.setState({ copen: !this.state.copen });
                          }}
                        >
                          <img src={couponImg} alt="" />
                          <MultiLang text="cupons" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          );
        })}
      </Fragment>
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
    getActivityLists: (id) => dispatch(getActivityLists(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CardBoost);
