import React from "react";
import { useSelector } from "react-redux";
import Header from "components/layout/header";
import { Footer } from "components/layout/footer";
import Subscribe from "components/content/element/subscribe";
import plusIcon from "assets/img/landing/plus.svg";
import service1 from "assets/img/landing/service1.png";
import service2 from "assets/img/landing/service2.png";
import service3 from "assets/img/landing/service3.png";
import service4 from "assets/img/landing/service4.png";
import serviceBackground from "assets/img/landing/service-background.png";
import topBackground from "assets/img/landing/top-background1.png";
import { ReactSVG } from "react-svg";
// import Plyr from "plyr-react";
import "assets/plyr-react.css";
import { NavLink } from "react-router-dom";
import { Grid } from "@material-ui/core";
import TrustUs from "./trustUs";
import { MultiLang } from "components/content/element/widget";
import ReactPlayer from "react-player";

const items = [
  "lan_desc1",
  "lan_desc2",
  "lan_desc3",
  "lan_desc4",
  "lan_desc5",
  "lan_desc6",
];

const styles = {
  backgroundImg: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: "100%",
    zIndex: -1,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    width: 250,
  },
};

export default function ListActivityLanding() {
  const light = useSelector((state) => state.logo[0].light);
  return (
    <div>
      <Header logo={light} className="menu--light" background="#afdb30" />
      <div className="grow-activity">
        <div className="container">
          <div className="grow-list-section d-flex">
            <div className="grow-items">
              <div className="grow-items-content">
                {items.map((item, key) => (
                  <div
                    className="grow-item d-flex align-items-center"
                    key={key}
                  >
                    <ReactSVG src={plusIcon} />
                    <p
                      className="item-desc mb-0 p-1"
                      style={{ fontSize: "16px" }}
                    >
                      <MultiLang text={item} />
                    </p>
                  </div>
                ))}
              </div>
              <NavLink to="/all-listings-grid/search/">
                <button className="link-button mx-auto d-flex">
                  <MultiLang text="pop_list_btn" />
                </button>
              </NavLink>
            </div>
            <div className="grow-video">
              <ReactPlayer
                className="react-player"
                url={"https://www.youtube.com/watch?v=sxcoxlxHfD8"}
                width="100%"
                height="100%"
              />
              {/* <Plyr
                source={{
                  type: "video",
                  sources: [{ src: "sxcoxlxHfD8", provider: "youtube" }],
                }}
                options={{ youtube: { noCookie: true } }}
              /> */}
            </div>
          </div>
        </div>
        <div
          className="grow-hustle-section"
          style={{
            backgroundImage: `url(${serviceBackground})`,
            backgroundSize: "100% 100%",
          }}
        >
          <div className="top-background">
            <img
              src={topBackground}
              style={styles.topBackground}
              width="100%"
              alt="top-background"
            />
          </div>
          <div className="container">
            <div className="grow-hustle-service">
              <h2 className="grow-hustle-title text-center mb-3">
                <MultiLang text="lan_ser_title" />
              </h2>
              <p className="text-center mb-1">
                <MultiLang text="lan_ser_desc1" />
              </p>
              <p className="text-center">
                <MultiLang text="lan_ser_desc2" />
              </p>
            </div>
            <div className="grow-service-section d-flex flex-wrap p-top-60">
              <Grid container>
                <Grid item xs={12} sm={6} md={3}>
                  <div className="service-card mx-2 my-2">
                    <h4 className="text-center">
                      <MultiLang text="ser_title1" />
                    </h4>
                    <div className="service-img d-flex justify-content-center algin-items-center my-3">
                      <img
                        src={service2}
                        width="180"
                        height="180"
                        alt="service-image2"
                      />
                    </div>
                    <p className="text-center">
                      <MultiLang text="ser_desc1" />
                    </p>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <div className="service-card mx-2 my-2">
                    <h4 className="text-center">
                      <MultiLang text="ser_title2" />
                    </h4>
                    <div className="service-img d-flex justify-content-center algin-items-center my-3">
                      <img
                        src={service4}
                        width="180"
                        height="180"
                        alt="service-image4"
                      />
                    </div>
                    <p className="text-center">
                      <MultiLang text="ser_desc2" />
                    </p>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <div className="service-card mx-2 my-2">
                    <h4 className="text-center">
                      <MultiLang text="ser_title3" />
                    </h4>
                    <div className="service-img d-flex justify-content-center algin-items-center my-3">
                      <img
                        src={service1}
                        width="180"
                        height="180"
                        alt="service-image1"
                      />
                    </div>
                    <p className="text-center">
                      <MultiLang text="ser_desc3" />
                    </p>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <div className="service-card mx-2 my-2">
                    <h4 className="text-center">
                      <MultiLang text="ser_title4" />
                    </h4>
                    <div className="service-img d-flex justify-content-center algin-items-center my-3">
                      <img
                        src={service3}
                        width="180"
                        height="180"
                        alt="service-image3"
                      />
                    </div>
                    <p className="text-center">
                      <MultiLang text="ser_desc4" />
                    </p>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="grow-service-description mx-auto">
              <p className="text-center mb-2">
                <MultiLang text="lan_ser_desc3" />
              </p>
              <p className="text-center mb-2">
                <MultiLang text="lan_ser_desc4" />
              </p>
              <p className="text-center mb-2">
                <MultiLang text="lan_ser_desc5" />
              </p>
              <p className="text-center mb-2">
                <MultiLang text="lan_ser_desc6" />
              </p>
            </div>
            <div className="p-bottom-30">
              <NavLink to="/all-listings-grid/search/">
                <button className="link-button mx-auto d-flex">
                  <MultiLang text="pop_list_btn" />
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <TrustUs />
      <Subscribe />
      <Footer />
    </div>
  );
}
