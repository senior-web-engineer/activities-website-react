import React, { Fragment, Component } from "react";
import Header from "../../layout/header";
import { Footer } from "../../layout/footer";
import { connect } from "react-redux";
import SideBar from "./sidebar-component";
import { EditAccount } from "./auth-profile";
import { Notification } from "./notification-setting";
import { PaymentSetting } from "./payment-infomation";
import { Favorite } from "./favorite-component";
import avatar from "../../../assets/img/profile-avatar.jpg";
import FontAwesome from "react-fontawesome";
import { CalenderComponent } from "./calender-component";
import { Withdraw } from "./balance-component";
import { BusinessProfile } from "./business-profile";
import { ActiveProgress } from "./active-progress";
import MyActivities from "./my-activities";

class AuthProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { select: 1 };
    this.renderComponent = this.renderComponent.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ select: newProps.match.params.id });
  }

  renderComponent() {
    switch (this.state.select) {
      case "1":
        return <EditAccount />;
      case "2":
        return <CalenderComponent />;
      case "3":
        return <Favorite />;
      case "4":
        return <PaymentSetting />;
      case "5":
        return <Notification />;
      case "6":
        return <staffManagement />;
      case "7":
        return <BusinessProfile />;
      case "8":
        return <Withdraw />;
      case "9":
        return <MyActivities />;
      case "10":
        return <MyActivities />;
      case "11":
        return <ActiveProgress />;
      default:
        return <EditAccount />;
    }
  }

  render() {
    const light = this.props.logo[0].light;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <div className="mainmenu-wrapper">
            <Header
              logo={light}
              class="menu--light"
              history={this.props.history}
            />
          </div>
          <div className="profile-avatar">
            <img src={avatar} alt="" />
          </div>
          <div className="profile-info">
            <h2>
              <FontAwesome name="envelope" style={{ paddingRight: "12px" }} />
              jwquaid@ulm-ltd.com
            </h2>
            <h5>
              <FontAwesome name="phone" style={{ paddingRight: "12px" }} />
              +19495623343
            </h5>
          </div>
          {/* <!-- ends: .mainmenu-wrapper --> */}
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar
                  onClick={(e) => this.renderComponent(e)}
                  select={this.state.select}
                />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
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
    list: state.list,
    login: state.login,
    logo: state.logo,
  };
};
export default connect(mapStateToProps)(AuthProfile);
