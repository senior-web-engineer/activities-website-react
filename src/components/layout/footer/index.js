import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import appleButton from "../../../assets/img/app-store-badge-en-us.svg";
import googleButton from "../../../assets/img/google-play-badge-en-us.svg";
// import { db, storage } from "services/firebase";

export class Footer extends Component {
  // handleChange = async (e) => {
  //   console.log(e.target.files[0]);
  //   const file = e.target.files[0];
  //   let snapshot = await storage.ref().child(`test_csv/${file.name}`).put(file);
  //   const url = await snapshot.ref.getDownloadURL();
  //   db.collection("csv_files")
  //     .add({
  //       status: "0",
  //       timestamp: new Date(),
  //       url: url,
  //     })
  //     .then((docref) => {
  //       db.collection("csv_files").doc(docref.id).update({ id: docref.id });
  //     });
  // };
  render() {
    return (
      <Fragment>
        {/* <input type="file" onChange={this.handleChange} /> */}
        <div
          className="modal fade show"
          id="modal-item-remove"
          tabIndex="-1"
          role="dialog"
          style={{ display: "none", paddingRight: "17px" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body text-center p-top-40 p-bottom-50">
                <span className="la la-exclamation-circle color-warning"></span>
                <h1 className="display-3 m-bottom-10">Are you sure?</h1>
                <p className="m-bottom-30">
                  Do you really want to delete this item?
                </p>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary m-right-15"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger">
                    Yes, Delete it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer id="footer" className="footer-three footer-grey p-top-95 ">
          <div className="footer-top p-bottom-25">
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-lg-4 col-sm-6">
                  <div className="widget widget_pages">
                    <h2 className="widget-title">
                      <MultiLang text="explore" />
                    </h2>
                    <ul className="list-unstyled">
                      <li className="page-item">
                        <NavLink to="/about">
                          <MultiLang text="about_us" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/faqs">
                          <MultiLang text="faq" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/support">
                          <MultiLang text="support" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/merchant-support">
                          <MultiLang text="provider_support" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/new-providers-information">
                          <MultiLang text="provider_information" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/privacy-policy">
                          <MultiLang text="privacy_policy" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/terms-conditions">
                          <MultiLang text="terms_conditions" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/provider-terms-conditions">
                          <MultiLang text="service_provider_terms" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink
                          to="/all-listings-grid"
                          onClick={(e) =>
                            sessionStorage.removeItem("searchData")
                          }
                        >
                          <MultiLang text="all_activities" />
                        </NavLink>
                      </li>
                      <li className="page-item">
                        <NavLink to="/press">
                          <MultiLang text="press" />
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6">
                  <div className="widget widget_social">
                    <h2 className="widget-title">Connect with Us</h2>
                    <ul className="list-unstyled social-list">
                      <li>
                        <a
                          href="mailto:support@activities.app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="mail">
                            <i className="la la-envelope" />
                          </span>{" "}
                          Contact Support
                        </a>
                        {/* <NavLink onClick={noAction} to="/mail">
                          <span className="mail">
                            <i className="la la-envelope" />
                          </span>{" "}
                          Contact Support
                        </NavLink> */}
                      </li>
                      <li>
                        <a
                          href="https://twitter.com/Activities_App"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="twitter">
                            <i className="fab fa-twitter" />
                          </span>{" "}
                          Twitter
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.facebook.com/Activities-App-103000531321891"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="facebook">
                            <i className="fab fa-facebook-f" />
                          </span>{" "}
                          Facebook
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/activities_app/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="instagram">
                            <i className="fab fa-instagram" />
                          </span>{" "}
                          Instagram
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6">
                  <div className="widget widget_text">
                    <h2 className="widget-title">
                      <MultiLang text="activities_on_mobile" />
                    </h2>
                    <div className="textwidget">
                      <p>
                        <MultiLang text="footer_download_app" />
                      </p>
                      <ul className="list-unstyled store-btns">
                        <li className="padding-5">
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
                        <li className="padding-5">
                          <a
                            target="_blank"
                            href="https://play.google.com/store/apps/details?id=app.activities.activities "
                            rel="noopener noreferrer"
                            style={{ borderRadius: "30px" }}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ends: .footer-top */}
          <div className="footer-bottom">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="footer-bottom--content">
                    <NavLink to="/" className="footer-logo">
                      <img src="./assets/img/logo.jpg" alt="" />
                    </NavLink>
                    <p className="m-0 copy-text">
                      {" "}
                      ©2021 <MultiLang text="activities" />
                    </p>
                    <ul className="list-unstyled lng-list">
                      {/* <li><NavLink onClick={noAction} to="/english">English</NavLink></li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ends: .footer-bottom */}
        </footer>
        {/* ends: .footer */}
      </Fragment>
    );
  }
}
