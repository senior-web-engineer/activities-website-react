import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import back from "../../assets/img/Banners/merchantsupportheader.png";
import { db } from "../../services/firebase";
import { getBannerImage } from "../../Store/action/categories";

const PricingPlan = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const heroImage = useSelector((state) => state.category.hero_image);
  const light = props.logo[0].light;
  const [load, setLoad] = useState(true);
  const [upgradeInfo, setUpgradeInfo] = useState([]);

  useEffect(() => {
    dispatch(getBannerImage("/pricing-plan"));
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    db.collection("ad_subscription")
      .where("type", "==", "upgrade")
      .get()
      .then((res) => {
        if (!res.empty) {
          let data = res.docs.map((doc) => doc.data());
          // data = data.filter((item) => item.fees !== 0);
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

  const handleCheckout = () => {
    sessionStorage.setItem("url", JSON.stringify("manage-plan"));
    history.push("/sign-in-advertiser");
  };

  return (
    <Fragment>
      {/* Header section start */}
      <section className="header-breadcrumb bgimage list-overlay">
        {!load && (
          <div
            className="bg_image_holder"
            style={{
              backgroundImage: `url(${heroImage || back})`,
              opacity: "1",
            }}
          ></div>
        )}
        <div className="mainmenu-wrapper">
          <Header logo={light} class="menu--light" history={props.history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title="Pricing Plans" />
      </section>
      {/* Header section end */}

      <section className="section-padding-1_7 section-bg">
        <div className="container">
          <div className="row align-items-center">
            {upgradeInfo.length > 0 &&
              upgradeInfo
                .slice(0)
                .reverse()
                .map((item, key) => {
                  return (
                    <div className="col-md-3" key={key}>
                      <div className="pricing pricing--1 ">
                        <div className="pricing__title">
                          <h4>{item.plan_name}</h4>
                        </div>
                        <div className="pricing__price rounded">
                          <p className="pricing_value">
                            <sup>$</sup>
                            <span>{item.fees}</span>
                            <small className="pl-2">
                              {/* Free Until Jan 2022 * */}Per Month
                            </small>
                          </p>
                        </div>
                        <div className="pricing__features">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></p>
                          <div className="price_action m-top-25">
                            <button
                              className="btn btn-block btn-outline-secondary price_action--btn"
                              onClick={handleCheckout}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      <Footer />
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    logo: state.logo,
  };
};
export default connect(mapStateToProps)(PricingPlan);
