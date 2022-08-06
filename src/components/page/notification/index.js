import React, { Fragment, Component } from "react";
import Header from "../../layout/header";
import { Footer } from "../../layout/footer";
import { BreadcrumbWraper } from "../../content/element/breadcrumb";
import { connect } from "react-redux";
import NotificationList from "./notificationList";
import { getBannerImage } from "../../../Store/action/categories";
import bannerBack from "../../../assets/img/notification-back.jpg";
import $ from "jquery";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

class NotificationIndex extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.getBannerImage("/notification");
  }

  componentDidUpdate() {
    $(".bg_image_holder").each(function () {
      var imgLink = $(this).children().attr("src");
      $(this)
        .css({
          "background-image": "url('" + imgLink + "')",
          opacity: "1",
        })
        .children();
    });
  }

  render() {
    const light = this.props.logo[0].light;
    const { t } = this.props;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage overlay">
          <div className="bg_image_holder">
            <img
              src={
                this.props.heroImage !== "" ? this.props.heroImage : bannerBack
              }
              alt=""
            />
          </div>
          <div className="mainmenu-wrapper">
            <Header
              logo={light}
              class="menu--light"
              history={this.props.history}
            />
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
          <BreadcrumbWraper title={t("notifications")} />
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 m-bottom-30">
                <NotificationList history={this.props.history} />
              </div>
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
    list: state.list,
    logo: state.logo,
    heroImage: state.category.hero_image,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBannerImage: (page) => dispatch(getBannerImage(page)),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(NotificationIndex);
