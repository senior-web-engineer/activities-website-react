import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
// import defaultImage from "../../assets/img/blog/4.jpg";
import defaultAvatar from "../../assets/img/default.jpg";
import { setReviewById } from "../../Store/action/blogActions";
import LabelIcon from "@material-ui/icons/Label";
import toastr from "toastr";
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { settings } from "../../config";
import { isEmpty } from "lodash";
import { Skeleton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

const noAction = (e) => {
  e.preventDefault();
};

const DetailsContent = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [review, setReview] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    const review = JSON.parse(sessionStorage.getItem("blogReview"));
    if (review) {
      setReview(review);
    }
  }, []);

  const handleSetReview = (id) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      if (!review) {
        toastr.info("Write your review!");
        return false;
      } else {
        dispatch(
          setReviewById(id, review, user.id, props.contents.title, history)
        );
        setReview("");
      }
    } else {
      sessionStorage.setItem("url", JSON.stringify(window.location.pathname));
      sessionStorage.setItem("blogReview", JSON.stringify(review));
      props.history.push("/sign-in");
    }
  };

  const filterBlogByTag = (category_id, tag_id, title) => {
    history.push({
      pathname: `/blog-details/${title.replace(/ /g, "-")}`,
      state: { category_id, tag_id },
    });
  };

  return (
    <>
      {isEmpty(props.contents) ? (
        <div>
          <Skeleton animation="wave" variant="rect" height={300} />
          <Skeleton animation="wave" height={50} />
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={50} />
        </div>
      ) : (
        <>
          <div className="post-details">
            <div className="post-head">
              <img src={props?.contents?.img_url ?? ""} alt="" />
            </div>
            <div className="post-content">
              <div className="post-header">
                <h3>{props?.contents?.title ?? ""}</h3>
                <div className="d-flex">
                  <label>{props?.contents?.date ?? ""}</label>
                  <label className="p-left-15">
                    {props?.contents?.category_name ?? ""}
                  </label>
                  <label className="p-left-15">
                    {props.contents &&
                      props.contents.blog_reviews_data &&
                      props.contents.blog_reviews_data.length}{" "}
                    {t("comments")}
                  </label>
                </div>
                <div style={{ borderBottom: "1px solid #ccc" }}>
                  {props.contents &&
                    props.contents.tag_info &&
                    props.contents.tag_info.length > 0 && (
                      <LabelIcon className="m-bottom-10" />
                    )}
                  {props.contents &&
                    props.contents.tag_info &&
                    props.contents.tag_info.length > 0 &&
                    props.contents.tag_info.map((item, key) => {
                      return (
                        <label
                          className="badge badge-success pointer m-left-10 m-bottom-10"
                          key={key}
                          onClick={() =>
                            filterBlogByTag(
                              props.contents.id,
                              item.tag_id,
                              props.contents.title
                            )
                          }
                        >
                          {item.tag_name}
                        </label>
                      );
                    })}
                </div>
              </div>
              <div className="post-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: props?.contents?.description ?? "",
                  }}
                ></div>
              </div>
            </div>
          </div>
          {/*<!-- ends: .post-details -->*/}
          <div className="post-bottom d-flex justify-content-end">
            <div className="social-share d-flex align-items-center">
              <span className="m-right-15">{t("share_post")}: </span>
              <ul className="social-share list-unstyled">
                <li>
                  <NavLink
                    to="/at_demo"
                    onClick={noAction}
                    className="facebook"
                  >
                    <span className="fab fa-facebook-f"></span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/at_demo" onClick={noAction} className="twitter">
                    <span className="fab fa-twitter"></span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/at_demo"
                    onClick={noAction}
                    className="linkedin"
                  >
                    <span className="fab fa-linkedin-in"></span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/at_demo" onClick={noAction} className="gplus">
                    <span className="fab fa-google-plus-g"></span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          {/*<!-- ends: .post-pagination -->*/}
          <div className="related-post m-top-60">
            <div className="related-post--title">
              {props.relative && props.relative.length > 0 ? (
                <h4>{t("relative_post")}</h4>
              ) : (
                <h4>{t("there_are_no_relative_post")}</h4>
              )}
            </div>
            <div className="">
              <Slider {...settings}>
                {props.relative &&
                  props.relative.length > 0 &&
                  props.relative.map((value, key) => {
                    return (
                      <div className="col-lg-12 col-sm-12" key={key}>
                        <div className="single-post">
                          <div style={{ height: "150px" }}>
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
                                style={{
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </NavLink>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="p-3">
                              <h6 className="m-0 blog-title-clip">
                                <NavLink
                                  to={{
                                    pathname: `/blog-details/${value.title.replace(
                                      / /g,
                                      "-"
                                    )}`,
                                    state: { category_id: value.id },
                                  }}
                                >
                                  {value.title}
                                </NavLink>
                              </h6>
                              <p className="text-overflow mb-0">
                                <span>{value.date}</span> - In{" "}
                                <NavLink to="/at_demo" onClick={noAction}>
                                  {value.category_name}
                                </NavLink>
                              </p>
                            </div>
                            <div className="px-2">
                              {value.tag_info.length > 0 &&
                                value.tag_info.map((tagInfo, key) => {
                                  return (
                                    <span
                                      className="badge badge-success pointer m-left-10 m-bottom-10"
                                      key={key}
                                      onClick={() =>
                                        filterBlogByTag(
                                          value.id,
                                          tagInfo.tag_id,
                                          value.title
                                        )
                                      }
                                    >
                                      {tagInfo.tag_name}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
          {/*<!-- ends: .related-post -->*/}
          <div className="comments-area m-top-60">
            <div className="comment-title">
              {props.contents &&
              props.contents.blog_reviews_data &&
              props.contents.blog_reviews_data.length > 0 ? (
                <h4>
                  {props.contents.blog_reviews_data.length} {t("comments")}
                </h4>
              ) : (
                <h4>{t("there_are_no_comments")}</h4>
              )}
            </div>
            <div className="comment-lists">
              <ul className="media-list list-unstyled">
                {props.contents &&
                  props.contents.blog_reviews_data &&
                  props.contents.blog_reviews_data.length > 0 &&
                  props.contents.blog_reviews_data.map((item, key) => {
                    return (
                      <li className="depth-1" key={key}>
                        <div className="media">
                          <div>
                            <NavLink
                              to="/at_demo"
                              onClick={noAction}
                              className="cmnt_avatar"
                            >
                              <img
                                src={
                                  item.user_profile_picture === ""
                                    ? defaultAvatar
                                    : item.user_profile_picture
                                }
                                alt=""
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                                className="media-object rounded-circle"
                              />
                            </NavLink>
                          </div>
                          <div className="media-body">
                            <div className="media_top">
                              <div className="heading_left">
                                <NavLink to="/at_demo" onClick={noAction}>
                                  <h6 className="media-heading">
                                    {item.user_name}
                                  </h6>
                                </NavLink>
                                <span>
                                  {moment(item.timestamp.seconds * 1000).format(
                                    "ll"
                                  )}
                                </span>
                              </div>
                            </div>
                            <p>{item.review}</p>
                          </div>
                        </div>
                        {/*<!-- ends: .media -->*/}
                      </li>
                    );
                  })}
                {/*<!-- ends: .depth-1 -->*/}
              </ul>
              {/*<!-- ends: .media-list -->*/}
            </div>
          </div>
          {/*<!-- ends: .comment-area -->*/}
          <div className="comment-form cardify m-top-60 m-bottom-40 margin-md-60 border">
            <div className="comment-title">
              <h5>{t("leave_reply")}</h5>
              <span>
                {t("your_mail_address_will_not")}
                <span className="color-primary">*</span>
              </span>
            </div>

            <div className="comment_form_wrapper m-top-40">
              <div className="row">
                <div className="col-md-12">
                  <textarea
                    className="form-control m-bottom-30"
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    value={review}
                  ></textarea>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handleSetReview(props?.contents?.id ?? "")}
                  >
                    {t("post_comment")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*<!-- ends: .comment-form -->*/}
        </>
      )}
    </>
  );
};
export default DetailsContent;
