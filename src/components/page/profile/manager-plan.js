import { RadioGroup } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/core/styles";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import FontAwesome from "react-fontawesome";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch, useSelector } from "react-redux";
import toastr from "toastr";
import { db } from "../../../services/firebase";
import {
  getPaymentInfo,
  setUpgradeAccount,
} from "../../../Store/action/widget";
import AddCard from "../../content/element/modal/add-card";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";
const stripePromise = loadStripe("pk_test_iapJ0WOQZWhT8vPUUrscmAz600DloNSONq");

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    animation: "none !important",
  },
}));

const ManagerPlanForm = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const user = JSON.parse(sessionStorage.getItem('user'))
  const user = useSelector((state) => state.auth.currentUser);
  const [status, setStatus] = useState(false);
  const [selUpgradeid, setSelUpgradeid] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const paymentData = useSelector((state) => state.widget.payment_data);
  const [upgradeInfo, setUpgradeInfo] = useState([]);

  const setPricingPlan = (upgradeInfo) => {
    if (paymentMethodId === "") {
      toastr.info("Select your card");
      return false;
    }
    setStatus(true);
    dispatch(setUpgradeAccount(upgradeInfo, paymentMethodId))
      .then((res) => {
        setStatus(false);
      })
      .catch((error) => {
        toastr.warning(error.message);
        console.log(error, "upgrade account");
      });
    // dispatch(setSubscription(upgradeInfo, customerId, paymentMethodId, stripe))
  };

  useEffect(() => {
    dispatch(getPaymentInfo());
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  useEffect(() => {
    db.collection("ad_subscription")
      .where("type", "==", "upgrade")
      .get()
      .then((res) => {
        if (!res.empty) {
          let data = res.docs.map((doc) => doc.data());
          data = data.sort((a, b) => {
            return b.fees - a.fees;
          });
          data.map((item) => {
            const description = item.description.replace(/\\n/g, "<br/>");
            item["description"] = description;
            return item;
          });
          setUpgradeInfo(data);
        }
      })
      .catch((error) => {
        setUpgradeInfo([]);
      });
  }, []);
  console.log(user, "user");
  return (
    <Fragment>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
      </section>
      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select={13} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-credit-card"></span>
                        <MultiLang text="manage_pricing_plan" />
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <div className="row">
                      {upgradeInfo.length > 0 &&
                        upgradeInfo
                          .slice(0)
                          .reverse()
                          .map((item, key) => {
                            return (
                              <div className="col-md-3" key={key}>
                                <div className="pricing-panel-subtitle">
                                  <span>{item.plan_name}</span>
                                  {user &&
                                    user.ad_subscription_id &&
                                    moment().unix() <
                                    user.upgrade_date_limit.seconds &&
                                    user.ad_subscription_id === item.id && (
                                      <div className="actived-sign">
                                        <span className="la la-check"></span>
                                        <span>
                                          <MultiLang text="actived" />
                                        </span>
                                      </div>
                                    )}
                                </div>
                                <div className="pricing-panel">
                                  <div className="pricing-header">
                                    <h3 className="text-center">
                                      <sup>$</sup>
                                      <span>{item.fees}</span>
                                      <small className="pl-2">
                                        {/* Free Until Jan 2022 * */}
                                        <MultiLang text="per_month" />
                                      </small>
                                    </h3>
                                  </div>
                                  <div className="pricing-body">
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: item.description,
                                      }}
                                    ></p>
                                  </div>
                                  <div className="pricing-footer position-relative">
                                    <button
                                      className="btn btn-block btn-outline-secondary price_action--btn"
                                      onClick={(e) => {
                                        setPricingPlan(item);
                                        setSelUpgradeid(item.id);
                                      }}
                                    >
                                      <MultiLang text="submit" />
                                    </button>
                                    {status && selUpgradeid === item.id && (
                                      <CircularProgress
                                        className={classes.root}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                    <div className="row">
                      <div className="col-md-6 offset-md-3">
                        <form className="needs-validation">
                          <div className="form-row">
                            <div
                              className="container"
                              style={{ paddingBottom: "9px" }}
                            >
                              <div className="cu-payment-title">
                                <div style={{ marginTop: 20 }}>
                                  <h4>
                                    <MultiLang text="card_num" />
                                  </h4>
                                </div>
                                <div className="pricing-add-card">
                                  <button
                                    type="button"
                                    className="btn btn-outline-success cu-radius add-card-btn"
                                  >
                                    <FontAwesome name="credit-card" />
                                    <MultiLang text="add_card" />
                                  </button>
                                </div>
                              </div>
                              <div className="custom-loader">
                                <Loader
                                  type="Oval"
                                  color="#afdb30"
                                  height={70}
                                  width={70}
                                  timeout={1000}
                                />
                              </div>
                              <div className="card-list">
                                <RadioGroup aria-label="delaied" name="delaied">
                                  {paymentData && paymentData.length > 0 ? (
                                    paymentData.map((item, key) => {
                                      return (
                                        <FormControlLabel
                                          key={key}
                                          value={"card" + key}
                                          onChange={(e) =>
                                            setPaymentMethodId(item.id)
                                          }
                                          control={
                                            <Radio className="cu-icon-color" />
                                          }
                                          label={
                                            "xxxx-xxxx-xxxx-" + item.card.last4
                                          }
                                        />
                                      );
                                    })
                                  ) : (
                                    <p className="no-list">
                                      <MultiLang text="there_is_not_yet" />
                                    </p>
                                  )}
                                </RadioGroup>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AddCard />
      <Footer />
    </Fragment>
  );
};

const ManagerPlan = (props) => (
  <Elements stripe={stripePromise}>
    <ManagerPlanForm {...props} />
  </Elements>
);

export default ManagerPlan;
