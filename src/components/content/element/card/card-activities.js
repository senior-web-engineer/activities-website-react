import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CachedIcon from "@material-ui/icons/Cached";
import EditIcon from "@material-ui/icons/Edit";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import ViewList from "@material-ui/icons/ViewList";
import moment from "moment";
import React, { Fragment } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import defaultImage from "../../../../assets/img/faq-back.jpg";
import DeleteDialog from "../modal/deleteDialog";
import OffDialog from "../modal/offDialog";
import { MultiLang } from "../widget";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#444",
    color: "#fff !important",
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}))(Tooltip);

export default function MyActivitiesCard(props) {
  const currency = useSelector((state) => state.app.currency.currency);
  const history = useHistory();

  const handleEdit = (id, item) => {
    sessionStorage.setItem("editId", JSON.stringify(id));
    // dispatch(getActivityLists(id));
    history.push({ pathname: "/add-activities", state: { list: item } });
  };

  const withdrawActivity = (listingId) => {
    history.push(`/balance-withdraw/${listingId}`);
  };

  const reload = () => {
    window.location.href = "/my-activities";
  };
  const curDate = moment().unix();
  return (
    <Fragment>
      {props?.list?.map((item, key) => {
        return (
          <div className="col-lg-12" key={key}>
            <div className="atbd_single_listing atbd_listing_list my-activities-card">
              <article className="atbd_single_listing_wrapper">
                <figure className="atbd_listing_thumbnail_area">
                  <div
                    className="atbd_listing_image cu-image"
                    style={{ minHeight: "180px" }}
                  >
                    <img
                      src={
                        item?.picture?.length > 0 ? item?.picture : defaultImage
                      }
                      alt="listingimage"
                    />
                    <div className="listing-prices">
                      {currency} {item?.displayPrice || ""}
                    </div>
                    {Boolean(item?.boost_date_limit) &&
                      curDate < item?.boost_date_limit?.seconds && (
                        <div className="boost-mark">
                          <MultiLang text="boost_paid_to" />
                          {moment(
                            item?.boost_date_limit?.seconds * 1000
                          ).format("MM.DD.YYYY")}
                        </div>
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
                    <div>
                      <div className="cu-inline-block">
                        <h4 className="atbd_listing_title">
                          {item?.ad_title || ""}
                        </h4>
                      </div>
                      <div className="cu-inline-block cu-float-right cu-display-flex">
                        <OffDialog listingId={item?.id || ""} />

                        <LightTooltip title="Edit">
                          <IconButton
                            className="cu-act-icnbtn"
                            size="small"
                            onClick={(e) => handleEdit(item?.id ?? "", item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </LightTooltip>

                        <DeleteDialog activityId={item?.id ?? ""} />

                        <LightTooltip title="Refresh">
                          <IconButton
                            className="cu-act-icnbtn"
                            size="small"
                            onClick={reload}
                          >
                            <CachedIcon />
                          </IconButton>
                        </LightTooltip>
                        {item?.status !== "6" && (
                          <>
                            <LightTooltip title="Booking List">
                              <IconButton
                                className="cu-act-icnbtn"
                                size="small"
                                onClick={(e) =>
                                  history.push(
                                    `/order-detail/${item?.id ?? ""}`
                                  )
                                }
                              >
                                <ViewList />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip title="Goto Withdraw">
                              <IconButton
                                className="cu-act-icnbtn"
                                size="small"
                                onClick={(e) =>
                                  withdrawActivity(item?.id ?? "")
                                }
                              >
                                <AttachMoneyIcon />
                              </IconButton>
                            </LightTooltip>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="atbd_listing_data_list">
                      <ul>
                        <li className="m-top-15">
                          <p>
                            <i className="la la-map-marker p-right-5"></i>
                            {item?.address &&
                              `${item?.address?.street || ""}, ${
                                item?.address?.city || ""
                              }, ${item?.address?.state || ""}, ${
                                item?.address?.country || ""
                              }`}
                          </p>
                        </li>
                        {Boolean(item?.boost_date_limit) && (
                          <li>
                            <p className="m-top-10">
                              <i className="la la-star p-right-5"></i>
                              <MultiLang text="boost_paid_to" />{" "}
                              {moment(
                                item?.boost_date_limit?.seconds * 1000
                              ).format("ddd, MM DD YYYY")}
                            </p>
                          </li>
                        )}

                        <li>
                          <div className="d-flex">
                            <i className="la la-calendar-o p-top-5"></i>
                            {Boolean(item?.start_date) &&
                            Boolean(item?.end_date) ? (
                              <div className="p-left-5">
                                <div>
                                  <p>
                                    {moment(
                                      (item?.start_date?.seconds +
                                        item?.start_date?.nanoseconds /
                                          1000000000) *
                                        1000
                                    ).format("MM/DD/YYYY HH:mm")}{" "}
                                    ~{" "}
                                    {moment(
                                      (item?.end_date?.seconds +
                                        item?.end_date?.nanoseconds /
                                          1000000000) *
                                        1000
                                    ).format("MM/DD/YYYY HH:mm")}
                                  </p>
                                  <div className="d-flex p-left-30">
                                    <p>
                                      <MultiLang text="Availability" /> :{" "}
                                      {item?.availability || 0}
                                    </p>
                                    <p className="p-left-10">
                                      <MultiLang text="Remaining" /> :{" "}
                                      {item?.remaing_availability || 0}
                                    </p>
                                  </div>
                                </div>
                                {item?.sessions &&
                                  item?.sessions.length > 0 &&
                                  item?.sessions.map((sess, key) => {
                                    return (
                                      <div key={key}>
                                        <p>
                                          {moment(
                                            (sess.start_date.seconds +
                                              sess.start_date.nanoseconds /
                                                1000000000) *
                                              1000
                                          ).format("MM/DD/YYYY")}{" "}
                                          ~{" "}
                                          {moment(
                                            (sess.end_date.seconds +
                                              sess.end_date.nanoseconds /
                                                1000000000) *
                                              1000
                                          ).format("MM/DD/YYYY")}
                                        </p>
                                        <div className="d-flex p-left-30">
                                          <p>
                                            <MultiLang text="Availability" /> :{" "}
                                            {sess.availability}
                                          </p>
                                          <p className="p-left-10">
                                            <MultiLang text="Remaining" /> :{" "}
                                            {sess.remaing_availability}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              <p className="ml-2">Not yet</p>
                            )}
                          </div>
                        </li>

                        <li>
                          <div className="d-flex justify-content-between">
                            {Boolean(item?.video) && (
                              <p className="font-style p-0">
                                <VideoLibraryIcon fontSize="small" />
                                <a
                                  className="p-left-10"
                                  href={"https://" + item?.video || ""}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item?.video}
                                </a>
                              </p>
                            )}
                            {item?.status === "1" && (
                              <span
                                style={{ marginLeft: "auto" }}
                                className="badge badge-danger"
                              >
                                <MultiLang text="under_review" />
                              </span>
                            )}
                            {item?.status === "6" && (
                              <span
                                style={{ marginLeft: "auto" }}
                                className="badge badge-danger"
                              >
                                <MultiLang text="claimed" />
                              </span>
                            )}
                            {item?.status === "2" && (
                              <span
                                style={{ marginLeft: "auto" }}
                                className="badge badge-info"
                              >
                                <MultiLang text="complete" />
                              </span>
                            )}
                            {item?.status === "0" && (
                              <span
                                style={{ marginLeft: "auto" }}
                                className="badge badge-success"
                              >
                                <MultiLang text="active" />
                              </span>
                            )}
                            {item?.status === "3" && (
                              <span
                                style={{ marginLeft: "auto" }}
                                className="badge badge-warning"
                              >
                                <MultiLang text="cancel" />
                              </span>
                            )}
                          </div>
                        </li>
                      </ul>
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
