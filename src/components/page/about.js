import React, { Fragment, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbAbout } from "../content/element/breadcrumb";
import { ContentBlockAbout } from "../content/element/content-block";
import Subscribe from "../content/element/subscribe";
import { getAboutUs } from "../../Store/action/basicAction";

const About = (props) => {
  const light = props.logo[0].light;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAboutUs());
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);
  return (
    <Fragment>
      {/* Header section start */}
      <section className="about-wrapper bg-gradient-ps">
        <div className="mainmenu-wrapper">
          <Header logo={light} class="menu--light" history={props.history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbAbout />
      </section>
      <ContentBlockAbout content={props.aboutus} />

      <Subscribe />
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    logo: state.logo,
    aboutus: state.basic.aboutus,
  };
};

export default connect(mapStateToProps)(About);
