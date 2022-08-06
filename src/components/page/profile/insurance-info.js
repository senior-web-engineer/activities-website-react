import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { updateAccount } from "../../../Store/action/auth";
import InsuranceInfo from "../../content/element/insurance-upload";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

let user;
class InsuranceInfomation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      avatar: "",
      phone_number: "",
      insuranceInfo: {},
    };
    this.setStateFromInput = this.setStateFromInput.bind(this);
  }

  setInsuranceInfo = (file) => {
    this.setState({ insuranceInfo: file });
  };

  UNSAFE_componentWillMount() {
    user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      avatar: user.profile_picture,
      phone_number:
        user.phone_number !== undefined
          ? user.phone_number
          : this.state.phone_number,
    }));
  }

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

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
                <SideBar select={14} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-user"></span>
                          <MultiLang text="insurance_info" />
                        </h4>
                      </div>
                      <div className="atbdb_content_module_contents insurance-body">
                        <div className="needs-validation">
                          <InsuranceInfo history={this.props.history} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_author_module -->*/}
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
    logo: state.logo,
    categories: state.category,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateAccount: (userData) => dispatch(updateAccount(userData)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsuranceInfomation);
