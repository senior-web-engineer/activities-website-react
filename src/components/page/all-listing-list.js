import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import ListingList from "../container/all-listing-list";
import { connect } from "react-redux";
import bannerBack from "../../assets/img/list-baner-grid-back.jpg";
import $ from "jquery";
import { getBannerImage } from "../../Store/action/categories";
import { useTranslation } from "react-i18next";

const AllListingList = (props) => {
  const light = props.logo[0].light;
  const dispatch = useDispatch();
  const heroImage = useSelector((state) => state.category.hero_image);
  const [load, setLoad] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getBannerImage("/all-activities"));
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  useEffect(() => {
    $(".bg_image_holder").each(function () {
      var imgLink = $(this).children().attr("src");
      $(this)
        .css({
          "background-image": "url('" + imgLink + "')",
          opacity: "1",
        })
        .children();
    });
    setLoad(false);
  }, [heroImage]);

  return (
    <Fragment>
      {/* Header section start */}
      <section className="header-breadcrumb bgimage list-overlay">
        <div className="bg_image_holder">
          {!load && (
            <img src={heroImage !== "" ? heroImage : bannerBack} alt="" />
          )}
        </div>
        <div className="mainmenu-wrapper">
          <Header logo={light} class="menu--light" history={props.history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={t("all_activities")} />
      </section>
      {/* Header section end */}
      <ListingList />
      <Footer />
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    logo: state.logo,
  };
};

export default connect(mapStateToProps)(AllListingList);
