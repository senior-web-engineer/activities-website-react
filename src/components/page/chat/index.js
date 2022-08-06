import React, { Fragment, Component } from "react";
import Header from "../../layout/header";
import { Footer } from "../../layout/footer";
import { BreadcrumbWraper } from "../../content/element/breadcrumb";
import { connect } from "react-redux";
import ChatSide from "./chat-side";
import ChatMain from "./chat-main";
import bannerBack from "../../../assets/img/chat-back.jpg";
import { setReadMsg } from "../../../Store/action/widget";
import { getBannerImage } from "../../../Store/action/categories";
import $ from "jquery";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

class AuthProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { select: 1 };
    this.renderComponent = this.renderComponent.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.getBannerImage("/chat");
    this.props.setReadMsg();
    this.renderComponent();
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

  renderComponent() {
    switch (this.state.select) {
      case 1:
        return <ChatMain />;
      default:
        return "";
    }
  }
  mobilefriends = (e) => {
    e.preventDefault();
    $(".bgimage").addClass("hidden");
    $("#footer").addClass("hidden");
    $(".atbd_author_module").addClass("hidden");
    $(".atbd_widget").removeClass("filter-hidden");
    $("#listing-title").addClass("hidden");
  };
  render() {
    const light = this.props.logo[0].light;
    const { t } = this.props;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage">
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
          <BreadcrumbWraper title={t("chat")} />
        </section>
        <div className="mobile-friends" onClick={this.mobilefriends}>
          <span className="la la-users">...</span>
        </div>
        {/* Header section end */}
        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-5 m-bottom-30">
                <ChatSide />
              </div>
              <div className="col-lg-8 col-md-12 m-bottom-30">
                {this.renderComponent()}
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
    heroImage: state.category.hero_image,
    list: state.list,
    logo: state.logo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerImage: (page) => dispatch(getBannerImage(page)),
    setReadMsg: () => dispatch(setReadMsg()),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(AuthProfile);
