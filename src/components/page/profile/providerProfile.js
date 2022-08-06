import React from "react";
import brandBanner from "assets/img/blog.jpg";
import { BreadcrumbWraper } from "components/content/element/breadcrumb";
import ProviderActivities from "components/content/element/card/provider-activities";
import Review from "components/content/element/dashboard/review";
import { SectionTitleImg } from "components/content/element/section-title-img";
import Header from "components/layout/header";

export default function ProviderProfile(props) {
  const providername = (props?.match?.params?.providername || "").replace(
    /-/g,
    " "
  );
  return (
    <>
      <section className="header-breadcrumb bgimage list-overlay">
        <div
          className="bg_image_holder"
          style={{ backgroundImage: `url(${brandBanner})`, opacity: 1 }}
        ></div>
        <div className="mainmenu-wrapper">
          <Header class="menu--light" />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={providername} />
      </section>
      <section
        className="listing-cards section-bg section-padding"
        style={{ paddingBottom: "10px" }}
      >
        <div className="container">
          <SectionTitleImg
            title={`${providername} Activities`}
            content={"Find out the activities as you mind"}
          />
          <div className="row">
            <div className="listing-cards-wrapper col-lg-12">
              <div className="row">
                <ProviderActivities
                  providerId={props?.location?.state?.providerId || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
              <h3>The Reviews of {providername}</h3>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 m-bottom-30">
              <Review providerId={props?.location?.state || ""} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
