import React, { Component, Fragment } from "react";
import appleButton from "../../../assets/img/app-store-badge-en-us.svg";
import aboutusbottom from "../../../assets/img/Banners/about-us-bottom.png";
import sideimg from "../../../assets/img/downloadapp.webp";
import googleButton from "../../../assets/img/google-play-badge-en-us.svg";
import plus from "../../../assets/img/plus.svg";
import { useTranslation } from "react-i18next";


// import sideimg from '../../../assets/img/phone-people.jpg'
export function ContentBlockHome(props) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <section
        id="sectionGoogleApp"
        className="cta section-padding border-bottom"
        ref={props.googleRef}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>
                  {t("why_download_the")}
                  <span>{t("activities")}</span> {t("app?")}
                </h2>
                <p>{t("plan_urs_and_urs_family")}</p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="row align-items-center">
                <div className="col-lg-5 offset-lg-1 col-md-5 mt-5 mt-md-0 discover-activity">
                  <h1 style={{ color: "#28a359" }} className="mb-3 mt-5 ">
                    {t("discover_activities")}
                  </h1>
                  <ul className="feature-list-wrapper list-unstyled discover-activity-content">
                    <li>
                      <div className="list-content d-flex">
                        <div className="d-flex justify-content-center align-items-center">
                          <img src={plus} alt="" width="20" height="20" />
                        </div>
                        <h3 className="discover-activity-description">
                          {t("experience_all_ages")}
                        </h3>
                      </div>
                    </li>
                    <li>
                      <div className="list-content d-flex">
                        <div className="d-flex justify-content-center align-items-center">
                          <img src={plus} alt="" width="20" height="20" />
                        </div>
                        <h3 className="discover-activity-description">
                          {t("contactless_bookings")}
                        </h3>
                      </div>
                    </li>
                    <li>
                      <div className="list-content d-flex">
                        <div className="d-flex justify-content-center align-items-center">
                          <img src={plus} alt="" width="20" height="20" />
                        </div>
                        <h3 className="discover-activity-description">
                          {t("chat_with_organizers")}
                        </h3>
                      </div>
                    </li>
                    <li>
                      <div className="list-content d-flex">
                        <div className="d-flex justify-content-center align-items-center">
                          <img src={plus} alt="" width="20" height="20" />
                        </div>
                        <h3 className="discover-activity-description">
                          {t("re_ignite_ur_social_life")}
                        </h3>
                      </div>
                    </li>
                  </ul>
                  {/*<!-- ends: .feature-list-wrapper -->*/}
                  <ul className="action-btns list-unstyled mb-3">
                    <li>
                      <a
                        target="_blank"
                        href="https://apps.apple.com/app/id1501612336#?platform=iphone"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={appleButton}
                          width="150"
                          alt=""
                          className="applebtn"
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href="https://play.google.com/store/apps/details?id=app.activities.activities "
                        rel="noopener noreferrer"
                      >
                        <img
                          src={googleButton}
                          alt=""
                          width="145"
                          className="googlebtn"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6 col-md-7">
                  <img data-src={sideimg} alt="" className="lazyload banner-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export class ContentBlockAbout extends Component {
  render() {
    return (
      <Fragment>
        <section className="about-contents section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 contents-wrapper">
                <div className="contents">
                  <div className="row align-items-center">
                    <div className="col-lg-5 col-sm-6">
                      <img src={aboutusbottom} alt="" />
                    </div>
                    <div className="col-lg-6 offset-lg-1 col-sm-6 mt-5 mt-md-0">
                      {Object.entries(this.props.content).length > 0 && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.props.content.content,
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/*<!-- ends: .content-block -->*/}
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
