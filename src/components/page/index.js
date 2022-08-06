import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { compose } from "redux";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";

import heroBanner from "../../assets/img/back1.jpg";
// import prev from "../../assets/img/left-arrow.svg";
// import next from "../../assets/img/right-arrow.svg";
import { getBlogList } from "../../Store/action/blogActions";
import { getBannerImage } from "../../Store/action/categories";
import AdvSearch from "../content/element/advance-search";
import BlogGrid4 from "../content/element/card/card-blog-grid4";
import CardCategoryGrid4 from "../content/element/card/card-category-grid-4";
import CardListingGrid4 from "../content/element/card/card-listing-grid-4";
import CardListingGrid5 from "../content/element/card/card-listing-grid-5";
import { ContentBlockHome } from "../content/element/content-block";
import { HowItWorks } from "../content/element/how-it-woks";
import { SectionTitle } from "../content/element/section-title";
import { SectionTitleImg } from "../content/element/section-title-img";
import { Footer } from "../layout/footer";
import Header from "../layout/header";
import brandApp from "../../assets/img/brand-app.webp";
import { withTranslation } from "react-i18next";
import { MultiLang } from "components/content/element/widget";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
// function SamplePrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         width: "50px",
//         height: "50px",
//         position: "absolute",
//         marginLeft: "60px",
//         zIndex: "100",
//       }}
//       onClick={onClick}
//     >
//       <img src={prev} alt="" />
//     </div>
//   );
// }
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingData: {},
      categories: {},
      load: true,
      heroImage: [],
    };
    this.blogRef = React.createRef();
    this.googleAppRef = React.createRef();
    this.merchantRef = React.createRef();
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.getBannerImage("/homepage");
    this.props.getBlogList();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.heroImage !== this.state.heroImage) {
      this.setState({ load: false, heroImage: nextProps.heroImage });
    }
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      speed: 2000,
      autoplaySpeed: 4000,
      autoplay: true,
      slidesToScroll: 1,
      lazyLoad: true,
      // nextArrow: "none",
      // prevArrow: "none",
    };
    const light = this.props.logo[0].light;
    const { heroImage } = this.state;
    const { t } = this.props;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="intro-wrapper bgimage overlay overlay--dark">
          <Slider {...settings}>
            {!this.state.load &&
              (heroImage &&
              typeof heroImage === "object" &&
              heroImage.length > 0 ? (
                heroImage.map((img, key) => {
                  return (
                    <div key={key}>
                      <img
                        className="lazyload homepage-slider-img"
                        data-src={img}
                        alt=""
                      />
                    </div>
                  );
                })
              ) : (
                <div>
                  <img
                    className="lazyload homepage-slider-img"
                    data-src={heroBanner}
                    alt=""
                  />
                </div>
              ))}
          </Slider>
          <div className="homepage-slider-div">
            <div className="mainmenu-wrapper" style={{ zIndex: 999 }}>
              {/* <Header1 /> */}
              <Header
                logo={light}
                class="menu--light"
                history={this.props.history}
                propsRef={this.blogRef}
                googleAppRef={this.googleAppRef}
                merchantRef={this.merchantRef}
              />
            </div>
            {/* <!-- ends: .mainmenu-wrapper --> */}
            <AdvSearch history={this.props.history} />
          </div>
        </section>
        {/* Header section end */}

        {/* Category section start */}
        <section className="categories-cards section-padding-two">
          <div className="container">
            <SectionTitle
              title={t("bes_in")}
              title1={t("categories")}
              content={t("discover_the_very_best")}
            />
            <div className="row">
              <CardCategoryGrid4 history={this.props.history} />
            </div>
          </div>
        </section>
        {/* Category section end */}

        {/* Listing section start */}
        <section className="listing-cards section-bg section-padding">
          <div className="container">
            <SectionTitleImg
              title={t("this_months_featuered_activities")}
              content={t("whats_featured_in_your_area")}
            />
            <CardListingGrid4 />
          </div>
        </section>
        {/* Listing section end */}

        <ContentBlockHome googleRef={this.googleAppRef} />

        {/* Listing section start */}
        <section className="listing-cards section-bg section-padding">
          <div className="container">
            <SectionTitleImg
              title={t("check_out_these_latest_activities")}
              content={t("latest_activities_added_in_your_area")}
            />
            <div className="row">
              <div className="listing-cards-wrapper col-lg-12">
                <div className="row">
                  <CardListingGrid5 />
                  <div className="col-lg-12 text-center m-top-55">
                    <NavLink
                      onClick={(e) => sessionStorage.removeItem("searchData")}
                      to="/all-listings-grid/search/"
                      className="btn btn-gradient btn-gradient-two btn-explore"
                    >
                      {t("explore_all")}
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Listing section end */}

        <HowItWorks merchantRef={this.merchantRef} />
        <section
          className="blog-area blog-grid section-padding-strict section-bg"
          ref={this.blogRef}
        >
          <div className="container">
            <SectionTitleImg title={t("blog_title")} />
            <div className="">
              <BlogGrid4 blog={this.props.blog} />
              {this.props.blog && this.props.blog.length > 0 && (
                <div className="col-lg-12 text-center">
                  <NavLink
                    to="/blog-grid-list"
                    className="btn btn-gradient btn-gradient-two btn-explore"
                  >
                    {t("explore_all")}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </section>
        <section
          className="lazyload brand-section"
          data-bg={brandApp}
          onClick={() => this.props.history.push("/personaliezed-mobile-app")}
        >
          <div className="container">
            <div className="branded-app-built">
              <h1>
                <MultiLang text="need_a_personalized_app" />
                <br />
                <MultiLang text="built_for_your_business" />
              </h1>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    heroImage: state.category.hero_image,
    logo: state.logo,
    blog: state.blog.blog_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBannerImage: (page) => dispatch(getBannerImage(page)),
    getBlogList: () => dispatch(getBlogList()),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(Index);
