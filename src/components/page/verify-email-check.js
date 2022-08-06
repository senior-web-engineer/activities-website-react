import "react-phone-input-2/lib/style.css";

import React, { Fragment } from "react";
import Img from "react-cool-img";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import toastr from "toastr";

import loadinggif from "../../assets/img/loading.gif";
import logo from "../../assets/img/logo@2.png";
import back from "../../assets/img/sign-page.jpg";
import { auth } from "../../services/firebase";

class VerifyEmailCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSent: false,
      email: "",
      type: "",
    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    auth.onAuthStateChanged((user) => {
      if (!user) {
        // this.props.history.push("/");
      } else {
        this.setState({ user });
      }
    });
  }

  UNSAFE_componentWillMount() {
    const user = auth.currentUser;
    // const email = this.props.location.state.email;
    // const type = this.props.location.state.type;
    this.setState({ email: user.email });
  }

  verifyEmail = () => {
    auth.currentUser.sendEmailVerification().then(() => {
      this.setState({ emailSent: true });
      toastr.success("Please check mail box!");
    });
  };

  render() {
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="login-content position-relative">
              <div className="login-header">
                <h3>Verify Email</h3>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  <div className="mt-5">
                    <div>Email: {this.state.email}</div>
                    {this.state.emailSent && (
                      <div className="text-success mt-3 mb-2">
                        Verification email sent!
                      </div>
                    )}
                    <button
                      className="btn btn-xs btn-gradient btn-gradient-two m-top-10"
                      onClick={this.verifyEmail}
                    >
                      <FontAwesome name="send" />
                      SEND VERIFICATION EMAIL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="signup-back">
            <Img
              placeholder={loadinggif}
              src={back}
              className="auth-backimg"
              cache
              alt=""
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    logo: state.logo,
  };
};

export default connect(mapStateToProps)(VerifyEmailCheck);
