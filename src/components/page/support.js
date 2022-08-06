import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getSupportDetail } from "../../Store/action/basicAction";
import { Footer } from "../layout/footer";
import SideBar from "./profile/sidebar-component";

class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone_number: "",
      avater: "",
    };
  }
  componentDidMount() {
    this.props.getSupportDetail();
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }

  render() {
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
          {/* <!-- ends: .mainmenu-wrapper --> */}
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={20} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-user-secret cu-icon-color"></span>
                          <MultiLang text="support" />
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents content-radius">
                      {this.props.support && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              Object.entries(this.props.support).length > 0
                                ? this.props.support.content
                                : "There is not yet.",
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_author_module -->*/}{" "}
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
    login: state.login,
    logo: state.logo,
    support: state.basic.support,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSupportDetail: () => dispatch(getSupportDetail()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Support);
