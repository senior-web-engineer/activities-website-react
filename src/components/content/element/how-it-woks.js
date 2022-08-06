import React, { Component, Fragment } from "react";
import { useTranslation } from "react-i18next";
import sideimg from "../../../assets/img/list-activity-free.webp";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
// const noAction = e => e.preventDefault();
export function HowItWorks(props) {
  const { t } = useTranslation();
  return (
    <>
      <section
        id="providerInformation"
        // className="cta section-padding border-bottom how-it-works"
        className="cta section-padding border-bottom"
        ref={props.merchantRef}
      >
        <div className="container">
          <div className="row">
            <div
              className="lazyload col-lg-12 free-activity"
              data-bg={sideimg}
            >
              <div className="free-activity-description">
                <h1>
                  {t("list_ur")} <br /> {t("activity_for_free")}
                </h1>
                <h3>{t("chat_direct_in_app")}</h3>
                <p>
                  {t("free_marketing")} <br />
                  {t("and_business_tools")}
                </p>
                <div className="learn-more">
                  <button>{t("learn_more")}</button>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
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
                      <img src="./assets/img/about-img1.png" alt="" />
                    </div>
                    <div className="col-lg-6 offset-lg-1 col-sm-6 mt-5 mt-md-0">
                      <h1>About Our Community and Our Expertise</h1>
                      <p>
                        Excepteur sint occaecat cupidatat non proident sunt in
                        culpa officia runmollit anim laborum occaecat cupidatat
                        proident. Cupidatat non proident sunt in culpa officia
                        deserunt.
                      </p>
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .contents -->*/}
                <div className="contents">
                  <div className="row align-items-center">
                    <div className="col-lg-5 col-sm-6">
                      <h1>
                        Why List on <span>Activities</span>
                      </h1>
                      <ul className="list-unstyled list-features p-top-15">
                        <li>
                          <div className="list-count">
                            <span>1</span>
                          </div>
                          <div className="list-content">
                            <h4>Easy Registration</h4>
                            <p>
                              Excepteur sint occaecat cupidatat non proident
                              sunt in culpa officia deserunt mollit.
                            </p>
                          </div>
                        </li>
                        <li>
                          <div className="list-count">
                            <span>2</span>
                          </div>
                          <div className="list-content">
                            <h4>Promote your Listing</h4>
                            <p>
                              Excepteur sint occaecat cupidatat non proident
                              sunt in culpa officia deserunt mollit.
                            </p>
                          </div>
                        </li>
                        <li>
                          <div className="list-count">
                            <span>3</span>
                          </div>
                          <div className="list-content">
                            <h4>Great Sales Benefits</h4>
                            <p>
                              Excepteur sint occaecat cupidatat non proident
                              sunt in culpa officia deserunt mollit.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6 offset-lg-1 text-right col-sm-6 mt-5 mt-md-0">
                      <img src="./assets/img/about-img2.png" alt="" />
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .contents -->*/}
              </div>
              {/*<!-- ends: .content-block -->*/}
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
