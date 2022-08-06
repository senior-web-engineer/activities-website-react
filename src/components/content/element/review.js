import { newDate } from "lib/dateLib";
import React, { Component, Fragment, useState } from "react";
import StarRatings from "react-star-ratings";
import { db } from "../../../services/firebase";
import toastr from "toastr";
import avatar from "../../../assets/img/default.jpg";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import moment from "moment";
import { MultiLang } from "./widget";

export class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      report: false,
      reportcontent: "",
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    db.collection("reviews")
      .where("id_listing", "==", nextProps.listing_data.listing_id)
      .where("status", "==", "0")
      .get()
      .then((res) => {
        const reviews = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        this.setState({
          reviews: reviews,
        });
      });
  }

  setReport = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.setState({ report: !this.state.report });
    } else {
      sessionStorage.setItem(
        "activityId",
        JSON.stringify(this.props.activityid)
      );
      sessionStorage.setItem("url", JSON.stringify(window.location.pathname));
      toastr.info("You must sign in here!");
      this.props.history.push("/sign-in");
    }
  };

  handleReport = (e, item) => {
    e.preventDefault();
    if (this.state.reportcontent !== "") {
      const user = JSON.parse(sessionStorage.getItem("user"));
      db.collection("reviews")
        .add({
          review_id: item.id,
          status: "1",
          reported_review: this.state.reportcontent,
          reported_date: newDate(),
          reported_user: user.id,
          reported_email: user.email,
        })
        .then((res) => {
          db.collection("reviews")
            .doc(item.id)
            .update({ status: "1" })
            .then(() => {
              toastr.success("Report request sended to admin successfully!");
              sessionStorage.removeItem("activityId");
              sessionStorage.removeItem("url");
              this.setState({
                report_content: "",
                report: false,
              });
            })
            .catch((error) => {
              toastr.warning("Please try again!");
            });
        })
        .catch((error) => {
          toastr.warning("Please try again!");
        });
    }
  };

  createRate = (cnt) => {
    let rating = [];
    for (let i = 1; i <= cnt; i++) {
      rating.push(
        <li key={i}>
          <span className="rate_active"></span>
        </li>
      );
    }
    if (cnt < 5) {
      for (let j = cnt + 1; j <= 5; j++) {
        rating.push(
          <li key={j}>
            <span className="rate_disable"></span>
          </li>
        );
      }
    }
    return rating;
  };

  render() {
    const { reviews } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    return (
      <Fragment>
        <div className="atbd_content_module atbd_review_module cu-radius">
          <div className="atbd_content_module__tittle_area">
            <div className="atbd_area_title">
              <h4>
                <span className="la la-star-o"></span>
                {reviews && reviews.length} <MultiLang text="reviews" />
              </h4>
              <label
                htmlFor="review_content"
                className="btn btn-primary btn-icon-left btn-sm not_empty"
              >
                <span className="la la-star-o"></span>{" "}
                <MultiLang text="add_a_review" />
              </label>
            </div>
          </div>
          <div className="atbdb_content_module_contents">
            <Loader
              type="Oval"
              color="#afdb30"
              height={70}
              width={70}
              timeout={1000}
            />
            {reviews.length > 0 &&
              reviews.map((item, key) => {
                return (
                  <div id="client_review_list" key={key}>
                    <div className="atbd_single_review atbdp_static">
                      <div className="atbd_review_top">
                        <div className="atbd_avatar_wrapper">
                          <div className="atbd_review_avatar">
                            {item.profile_picture === "" ? (
                              <img
                                alt=""
                                src={avatar}
                                style={{ width: "40px" }}
                                className="avatar avatar-32 photo"
                              />
                            ) : (
                              <img
                                alt=""
                                src={item.profile_picture}
                                style={{ width: "40px" }}
                                className="avatar avatar-32 photo"
                              />
                            )}
                          </div>
                          <div className="atbd_name_time">
                            <p>{item.name}</p>
                            <span className="review_time">
                              {moment(item.date.seconds * 1000).format("ll")}
                            </span>
                          </div>
                        </div>
                        <div className="atbd_rated_stars">
                          <ul>{this.createRate(Number(item.rating))}</ul>
                        </div>
                      </div>
                      <div className="review_content">
                        <p>{item.review}</p>
                        <p
                          className="reply pointer"
                          onClick={() => this.setReport()}
                        >
                          <span className="la la-mail-reply-all"></span>
                          <MultiLang text="report" />
                        </p>
                      </div>
                      {user && (
                        <div
                          className={`review_reply_form ${
                            this.state.report ? "active" : ""
                          }`}
                        >
                          <div className="atbd_review_avatar">
                            <img
                              alt=""
                              src={user?.avatar ?? avatar}
                              className="avatar avatar-32 photo"
                            />
                          </div>
                          <form>
                            <textarea
                              placeholder="Message"
                              className="form-control"
                              value={this.state.reportcontent}
                              onChange={(e) =>
                                this.setState({ reportcontent: e.target.value })
                              }
                            ></textarea>
                            <button
                              type="submit"
                              className="btn btn-sm btn-secondary"
                              style={{ borderRadius: "5px" }}
                              onClick={(e) => this.handleReport(e, item)}
                            >
                              <MultiLang text="report" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* <!-- ends: .atbd_content_module --> */}
      </Fragment>
    );
  }
}

export class AddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      login: true,
      message: "",
      rating: 1,
    };
  }
  UNSAFE_componentWillMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const reviewData = JSON.parse(sessionStorage.getItem("reviewData"));
    if (reviewData) {
      this.setState({
        rating: reviewData.rating,
        message: reviewData.message,
      });
    }
    if (user) {
      if (user.avatar === null) {
        this.setState({
          avatar: "",
          login: true,
        });
      } else {
        this.setState({
          avatar: user.profile_picture,
          login: true,
        });
      }
    } else {
      this.setState({
        login: false,
      });
    }
  }
  addReview = async (e) => {
    e.preventDefault();
    if (this.state.login) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const data = {
        rating: this.state.rating.toString(),
        review: this.state.message,
        profile_picture: this.state.avatar,
        name: user.name,
        id_user: user.id,
        id_listing: this.props.listing_data.listing_id,
        date: newDate(),
        status: "1",
      };
      await db
        .collection("reviews")
        .doc()
        .set(data)
        .then((res) => {
          toastr.success("successfully your review.");
        });
      sessionStorage.removeItem("reviewData");
      this.setState({
        message: "",
        rating: 1,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toastr.info("please signIn your account!");
      const reviewData = {
        rating: this.state.rating,
        message: this.state.message,
      };
      sessionStorage.setItem("reviewData", JSON.stringify(reviewData));
      sessionStorage.setItem("url", JSON.stringify(window.location.pathname));
      sessionStorage.setItem(
        "activityId",
        JSON.stringify(this.props.activityid)
      );
      window.location.href = "/sign-in";
    }
  };
  render() {
    return (
      <Fragment>
        <div className="atbd_content_module atbd_review_form  cu-radius">
          <div className="atbd_content_module__tittle_area">
            <div className="atbd_area_title">
              <h4>
                <span className="la la-star"></span>
                <MultiLang text="add_a_review" />
              </h4>
            </div>
          </div>
          <div className="atbdb_content_module_contents atbd_give_review_area">
            {/* <!-- ends: .atbd_notice --> */}
            <form onSubmit={this.addReview} id="atbdp_review_form">
              <div className="atbd_review_rating_area">
                {/* <!--It should be displayed on the left side --> */}
                <div className="atbd_review_update_rating">
                  <span>
                    <MultiLang text="rating" />:{" "}
                  </span>
                  <div className="atbd_rating_stars">
                    <div className="br-wrapper br-theme-fontawesome-stars m-left-15">
                      <StarRatings
                        rating={this.state.rating}
                        starRatedColor="#afdb30"
                        changeRating={(newRating) => {
                          this.setState({ rating: newRating });
                        }}
                        numberOfStars={5}
                        starDimension="20px"
                        starSpacing="5px"
                        onStarHover={() => this.setState({ color: "#afdb30" })}
                        name="rating"
                      />
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_review_update_rating -->*/}
              </div>
              {/*<!-- ends: .atbd_review_rating_area -->*/}
              <div className="form-group">
                <textarea
                  name="content"
                  id="review_content"
                  className="form-control"
                  value={this.state.message}
                  onChange={(e) => {
                    this.setState({ message: e.target.value });
                  }}
                  required
                ></textarea>
              </div>
              {/* <!--If current user has a review then show him update and delete button--> */}
              <button
                className="btn btn-gradient btn-gradient-one"
                type="submit"
                id="atbdp_review_form_submit"
              >
                <MultiLang text="submit_review" />
              </button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export const AddReviewCSV = ({ activityInfo = {} }) => {
  const [rating, setRating] = useState(1);
  const [message, setMessage] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user")) ?? null;

  const addReview = async (e) => {
    e.preventDefault();
    if (user) {
      const data = {
        rating: rating.toString(),
        review: message,
        profile_picture: user?.profile_picture ?? "",
        name: user.name,
        id_user: user.id,
        id_listing: this.props.listing_data.listing_id,
        date: newDate(),
        status: "1",
        reviewer: this.props.listing_data?.advertiser_id,
      };
      await db
        .collection("reviews")
        .doc()
        .set(data)
        .then((res) => {
          toastr.success("successfully your review.");
        });
      sessionStorage.removeItem("reviewData");
      setMessage("");
      setRating(1);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toastr.info("please signIn your account!");
      const reviewData = {
        rating: rating,
        message: message,
      };
      sessionStorage.setItem("reviewData", JSON.stringify(reviewData));
      sessionStorage.setItem("url", JSON.stringify(window.location.pathname));
      sessionStorage.setItem(
        "activityId",
        JSON.stringify(this.props.activityid)
      );
      window.location.href = "/sign-in";
    }
  };

  return (
    <div className="atbd_content_module atbd_review_form  cu-radius">
      <div className="atbd_content_module__tittle_area">
        <div className="atbd_area_title">
          <h4>
            <span className="la la-star"></span>
            <MultiLang text="add_a_review" />
          </h4>
        </div>
      </div>
      <div className="atbdb_content_module_contents atbd_give_review_area">
        <form onSubmit={addReview} id="atbdp_review_form">
          <div className="atbd_review_rating_area">
            <div className="atbd_review_update_rating">
              <span>
                <MultiLang text="rating" />:{" "}
              </span>
              <div className="atbd_rating_stars">
                <div className="br-wrapper br-theme-fontawesome-stars m-left-15">
                  <StarRatings
                    rating={rating}
                    starRatedColor="#afdb30"
                    changeRating={(newRating) => setRating(newRating)}
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="5px"
                    name="rating"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <textarea
              name="content"
              id="review_content"
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            className="btn btn-gradient btn-gradient-one"
            type="submit"
            id="atbdp_review_form_submit"
          >
            <MultiLang text="submit_review" />
          </button>
        </form>
      </div>
    </div>
  );
};

export const ReviewCSV = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [reviews] = useState([]);
  const [report, setReport] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const handleSelectReport = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setReport((prev) => !prev);
    } else {
      sessionStorage.setItem(
        "activityId",
        JSON.stringify(this.props.activityid)
      );
      sessionStorage.setItem("url", JSON.stringify(window.location.pathname));
      toastr.info("You must sign in here!");
      this.props.history.push("/sign-in");
    }
  };

  const handleReport = (e, item) => {
    e.preventDefault();
    if (reportContent !== "") {
      const user = JSON.parse(sessionStorage.getItem("user"));
      db.collection("reviews")
        .add({
          review_id: item.id,
          status: "1",
          reported_review: reportContent,
          reported_date: newDate(),
          reported_user: user.id,
          reported_email: user.email,
        })
        .then((res) => {
          db.collection("reviews")
            .doc(item.id)
            .update({ status: "1" })
            .then(() => {
              toastr.success("Report request sended to admin successfully!");
              sessionStorage.removeItem("activityId");
              sessionStorage.removeItem("url");
              setReport(false);
              setReportContent("");
            })
            .catch((error) => {
              toastr.warning("Please try again!");
            });
        })
        .catch((error) => {
          toastr.warning("Please try again!");
        });
    }
  };

  const createRate = (cnt) => {
    let rating = [];
    for (let i = 1; i <= cnt; i++) {
      rating.push(
        <li key={i}>
          <span className="rate_active"></span>
        </li>
      );
    }
    if (cnt < 5) {
      for (let j = cnt + 1; j <= 5; j++) {
        rating.push(
          <li key={j}>
            <span className="rate_disable"></span>
          </li>
        );
      }
    }
    return rating;
  };

  return (
    <div className="atbd_content_module atbd_review_module cu-radius">
      <div className="atbd_content_module__tittle_area">
        <div className="atbd_area_title">
          <h4>
            <span className="la la-star-o"></span>
            {reviews && reviews.length} <MultiLang text="reviews" />
          </h4>
          <label
            htmlFor="review_content"
            className="btn btn-primary btn-icon-left btn-sm not_empty"
          >
            <span className="la la-star-o"></span>{" "}
            <MultiLang text="add_a_review" />
          </label>
        </div>
      </div>
      <div className="atbdb_content_module_contents">
        <Loader
          type="Oval"
          color="#afdb30"
          height={70}
          width={70}
          timeout={1000}
        />
        {reviews.length > 0 &&
          reviews.map((item, key) => {
            return (
              <div id="client_review_list" key={key}>
                <div className="atbd_single_review atbdp_static">
                  <div className="atbd_review_top">
                    <div className="atbd_avatar_wrapper">
                      <div className="atbd_review_avatar">
                        <img
                          alt=""
                          src={item?.profile_picture ?? avatar}
                          style={{ width: "40px" }}
                          className="avatar avatar-32 photo"
                        />
                      </div>
                      <div className="atbd_name_time">
                        <p>{item?.name ?? ""}</p>
                        <span className="review_time">
                          {moment(item?.date.seconds * 1000).format("ll")}
                        </span>
                      </div>
                    </div>
                    <div className="atbd_rated_stars">
                      <ul>{createRate(Number(item?.rating))}</ul>
                    </div>
                  </div>
                  <div className="review_content">
                    <p>{item?.review}</p>
                    <p className="reply pointer" onClick={handleSelectReport}>
                      <span className="la la-mail-reply-all"></span>
                      {/* setReport(prev => !prev); */}
                    </p>
                  </div>
                  {user && (
                    <div
                      className={`review_reply_form ${report ? "active" : ""}`}
                    >
                      <div className="atbd_review_avatar">
                        <img
                          alt=""
                          src={user?.avatar ?? avatar}
                          className="avatar avatar-32 photo"
                        />
                      </div>
                      <form>
                        <textarea
                          placeholder="Message"
                          className="form-control"
                          value={reportContent}
                          onChange={(e) => setReportContent(e.target.value)}
                        ></textarea>
                        <button
                          type="submit"
                          className="btn btn-sm btn-secondary"
                          style={{ borderRadius: "5px" }}
                          onClick={(e) => handleReport(e, item)}
                        >
                          <MultiLang text="report" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
