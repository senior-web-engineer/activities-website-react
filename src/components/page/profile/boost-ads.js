import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/slider.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/ui/core";
import "jquery-ui/ui/widgets/slider";
import React, { Fragment, useEffect } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { setPageLoading } from "Store/action/appAction";
import { getMyListing } from "../../../Store/action/listing";
import BoostCard from "../../content/element/card/card-boost";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

export default function BoostAds() {
  const currency = useSelector((state) => state.app.currency);
  const myList = useSelector((state) => state.list.myListing).filter(
    (item) => item.status === "0"
  );
  const history = useHistory();
  const isLoading = useSelector((state) => state.app?.isPageLoading || false);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    setPageLoading(dispatch, true);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(getMyListing(user.id, currency?.value || "USD"));
    //eslint-disable-next-line
  }, [currency]);

  return (
    <Fragment>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
      </section>

      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select={15} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <MultiLang text="boost_ads" />
                      </h4>
                    </div>

                    <div className="dashboard-nav chat-side-header">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="dashboard-nav-area">
                              <ul
                                className="nav"
                                id="dashboard-tabs"
                                role="tablist"
                                style={{ width: "100%" }}
                              ></ul>
                            </div>
                          </div>
                          {/*<!-- ends: .col-lg-12 -->*/}
                        </div>
                      </div>
                    </div>
                    {/*<!-- ends: .dashboard-nav -->*/}
                  </div>

                  <div className="col-md-12 cu-input-padding">
                    <section
                      className="all-listing-wrapper"
                      style={{ marginTop: "45px" }}
                    >
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12 listing-items">
                            <div className="row">
                              <div className="col-lg-12 order-lg-1 order-0">
                                <div className="row">
                                  {isLoading ? (
                                    <div className="custom-loader">
                                      <Loader
                                        type="Oval"
                                        color="#afdb30"
                                        height={70}
                                        width={70}
                                      />
                                    </div>
                                  ) : myList.length > 0 ? (
                                    <BoostCard list={myList} url={history} />
                                  ) : (
                                    <div className="col-lg-12">
                                      <div
                                        className="alert alert-success"
                                        role="alert"
                                      >
                                        <MultiLang text="there_is_not_yet" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
}
