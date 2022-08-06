import React, { Fragment, Component } from "react";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { connect } from "react-redux";
import Header from "../layout/header";
import FontAwesome from "react-fontawesome";
import { NavLink } from "react-router-dom";
import back from "../../assets/img/Banners/blog-header.png";
import { MultiLang } from "components/content/element/widget";

class Thankyou extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
  }
  render() {
    const light = this.props.logo[0].light;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage">
          <div className="bg_image_holder">
            <img src={back} alt="" />
          </div>
          <div className="mainmenu-wrapper">
            <Header
              logo={light}
              class="menu--light"
              history={this.props.history}
            />
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
          <BreadcrumbWraper title="" />
        </section>
        {/* Header section end */}
        <div className="section-bg thx">
          <div className="thx-body">
            <FontAwesome name="check-circle" />
            <h1>
              <MultiLang text="thanks_booking" />
            </h1>
            <p>
              <MultiLang text="check_calendar_booking" />
            </p>
          </div>
          <div className="confirm-button mt-2">
            <NavLink
              onClick={(e) => sessionStorage.removeItem("searchData")}
              to="/all-listings-grid/search/"
              className="btn btn-gradient btn-gradient-two mb-30"
            >
              <MultiLang text="explorer_activities" />
            </NavLink>
          </div>
        </div>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cardInfo: state.widget.payment_data,
    logo: state.logo,
  };
};

export default connect(mapStateToProps)(Thankyou);
