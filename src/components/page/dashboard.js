import Grid from "@material-ui/core/Grid";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigStat from "../../components/content/element/dashboard/BigStat/BigStat";
import GoogleBarChart from "../../components/content/element/dashboard/google-barChart";
import GoogleChart from "../../components/content/element/dashboard/google-chart";
import MaterialChart from "../../components/content/element/dashboard/material-ui-chart";
import Review from "../../components/content/element/dashboard/review";
import * as Actions from "../../Store/action/dashboardAction";
import { Footer } from "../layout/footer";
import SideBar from "./profile/sidebar-component";

function Dashboard(props) {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.dashboard.activities);
  const cntActivities =
    useSelector((state) => state.dashboard?.cntActivities) ?? null;
  useEffect(() => {
    dispatch(Actions.getActivities());
    dispatch(Actions.getCntActivites());
    const script = document.createElement("script");
    script.src = "/assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  return (
    <>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
      </section>

      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select={17} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-building"></span>
                        <MultiLang text="welcom_activities_app" />
                      </h4>
                    </div>
                  </div>
                  <div className="atbd_content_module p-4">
                    {/* {claimLists?.length > 0 && <ClaimMessage />} */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <div
                          className="d-flex flex-column"
                          style={{
                            height: "100%",
                            borderRadius: "20px",
                            boxShadow: "0 0 10px #00000020",
                            padding: "1.5rem",
                          }}
                        >
                          <h4 className="pl-4 mt-3 mb-3">
                            <MultiLang text="add_first_activity" />
                            <a href="/add-activities">
                              <u>
                                {" "}
                                <MultiLang text="here" />
                              </u>
                            </a>
                          </h4>
                          <h4 className="pl-4 mt-3 mb-3">
                            <MultiLang text="remember_to" />
                            <a href="/insurance-info">
                              <u>
                                {" "}
                                <MultiLang text="upload_insurance" />{" "}
                              </u>
                            </a>
                            <MultiLang text="validate_account" />
                          </h4>
                          <h4 className="pl-4 mt-3 mb-3">
                            <MultiLang text="for_help_support" /> (
                            <a href="/merchant-support">
                              <u>
                                <MultiLang text="click_here" />
                              </u>
                            </a>
                            ){" "}
                          </h4>
                          {cntActivities && (
                            <h4 className="pl-4 mb-3">
                              <a href="/add-activities">
                                {cntActivities > 0 ? (
                                  <u>Add a New Activity</u>
                                ) : (
                                  <u>Add your first Activity Here</u>
                                )}
                              </a>
                            </h4>
                          )}
                        </div>
                      </Grid>
                      {activities.length > 0 &&
                        activities.map((stat, key) => (
                          <Grid item xs={12} sm={6} md={6} lg={6} key={key}>
                            <BigStat {...stat} />
                          </Grid>
                        ))}
                      <Grid item xs={12} sm={12} md={12}>
                        <MaterialChart />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <GoogleChart />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <GoogleBarChart />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Review />
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default Dashboard;
