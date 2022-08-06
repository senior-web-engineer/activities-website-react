import { newDate } from "lib/dateLib";
import React, { Component, Fragment } from "react";
import toastr from "toastr";
import { Player } from "video-react";
import aboutUSImg from "../../../assets/img/Banners/about-us-top.png";
import image from "../../../assets/img/video_Player.png";
import "../../../assets/video.css";
import { db } from "../../../services/firebase";
import { MultiLang } from "./widget";

const noAction = (e) => e.preventDefault();
export class BreadcrumbWraper extends Component {
  render() {
    return (
      <Fragment>
        <div className="breadcrumb-wrapper content_above">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h1 className="page-title">{this.props.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export class BreadcrumbSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
    };
  }
  UNSAFE_componentWillMount() {
    if (Boolean(this.props?.filter?.listing_id ?? "")) {
      db.collection("reviews")
        .where("id_listing", "==", this.props.filter.listing_id)
        .get()
        .then((res) => {
          const reviews = res.docs.map((doc) => doc.data());
          this.setState({
            reviews: reviews,
          });
        });
    }
  }
  setFavourite = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toastr.info("Please sign in!");
      return false;
    }
    const favData = {
      date: newDate().toLocaleDateString().slice(0, 10),
      status: 0,
      user_id: user.id,
      id: "",
      ad_id: this.props.filter.listing_id,
    };
    const res = await db.collection("favourites_ad").get();
    const checkData = res.docs.map((doc) => doc.data());
    const checkData2 = checkData.filter(
      (item) =>
        item.user_id === user.id && item.ad_id === this.props.filter.listing_id
    );
    if (checkData2.length === 0) {
      const docRef = await db.collection("favourites_ad").add(favData);
      db.collection("favourites_ad")
        .doc(docRef.id)
        .update({
          id: docRef.id,
        })
        .then(() => {
          toastr.success("Successfully adding in your favorite list!");
        })
        .catch((error) => {
          toastr.warning(error.message);
        });
    } else {
      toastr.info("This acitivity is saved for you");
    }
  };
  render() {
    const { category, badge, title, displayPrice } = this.props.filter;
    return (
      <Fragment>
        <div className="col-lg-8 col-md-7">
          <ul className="list-unstyled listing-info--badges">
            <li>
              <span className={"atbd_badge atbd_badge_" + badge}>{badge}</span>
            </li>
            {/* <li>
              <span className="atbd_badge atbd_badge_popular">Popular</span>

            </li> */}
          </ul>
          <h1>{title}</h1>
          <ul className="list-unstyled listing-info--meta">
            <li>
              <div className="average-ratings">
                {this.state.reviews.length !== 0 ? (
                  <span>
                    <strong>{this.state.reviews.length}</strong>
                    <MultiLang text="reviews" />
                  </span>
                ) : (
                  <span>
                    <strong>
                      <MultiLang text="no_reviews_yet" />
                    </strong>
                  </span>
                )}
              </div>
            </li>
            <li>
              <div className="atbd_listing_category">
                {/* <FontAwesome name={icon ?? ""} className="detail-category" /> */}
                {category}
              </div>
            </li>
            {!Boolean(this.props?.activityType) && (
              <li>
                <div className="detail-price">
                  {Boolean(displayPrice)
                    ? `${this.props.currency} ${displayPrice}`
                    : "free"}
                </div>
              </li>
            )}
          </ul>
          {/*<!-- ends: .listing-info-meta -->*/}
        </div>
        <div className="col-lg-4 col-md-5 d-flex align-items-end justify-content-start justify-content-md-end">
          <div className="atbd_listing_action_area">
            <div className="atbd_action atbd_save">
              <div className="action_button">
                <div onClick={this.setFavourite} className="atbdp-favourites">
                  <span className="la la-heart-o"></span>
                  <MultiLang text="save" />
                </div>
              </div>
            </div>
            <div className="atbd_action atbd_share dropdown">
              <span
                className="dropdown-toggle"
                id="social-links"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                role="menu"
              >
                <span className="la la-share"></span>Share
              </span>
              <div
                className="atbd_director_social_wrap dropdown-menu"
                aria-labelledby="social-links"
              >
                <ul className="list-unstyled">
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-facebook-f color-facebook"></span>
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-twitter color-twitter"></span>
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-pinterest-p color-pinterest"></span>
                      Pinterest
                    </a>
                  </li>
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-google-plus-g color-gplus"></span>
                      Google Plus
                    </a>
                  </li>
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-linkedin-in color-linkedin"></span>
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-tumblr color-tumblr"></span>Tumblr
                    </a>
                  </li>
                  <li>
                    <a onClick={noAction} href=" " target="_blank">
                      <span className="fab fa-vk color-vk"></span>VKontakte
                    </a>
                  </li>
                </ul>
              </div>
              {/* <!--Ends social share--> */}
            </div>
          </div>
          {/* <!-- ends: .atbd_listing_action_area --> */}
        </div>
      </Fragment>
    );
  }
}

export class BreadcrumbAbout extends Component {
  render() {
    return (
      <Fragment>
        <div className="about-intro content_above">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-6"></div>
              <div className="col-lg-6 offset-lg-1 col-md-6 offset-md-0 col-sm-8 offset-sm-2">
                <img src={aboutUSImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export class BreadcrumbProviderInformation extends Component {
  render() {
    return (
      <div className="about-intro content_above">
        <div className="container">
          <div className="row align-items-center justify-content-center d-flex">
            <div className="col-lg-6 col-md-8 col-sm-8 d-flex justify-content-center mb-3 react-video-section">
              <Player
                playIsline={false}
                src={require("../../../assets/activities_presentation.mp4")}
                fluid={false}
                height={303}
                width={"100%"}
                poster={image}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
