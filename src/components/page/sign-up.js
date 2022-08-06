import "react-phone-input-2/lib/style.css";

import React, { Fragment } from "react";
import Img from "react-cool-img";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import toastr from "toastr";

import loadinggif from "../../assets/img/loading.gif";
import logo from "../../assets/img/logo@2.png";
import back from "../../assets/img/sign-page.jpg";
import {
  signInWithFacebook,
  signInWithGoogle,
  signUp,
} from "../../Store/action/auth";
import { addSIBContact } from "../../Store/action/sendInBlueAction";
import { Footer } from "components/layout/footer";
import Subscribe from "components/content/element/subscribe";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      surname: "",
      name: "",
      email: "",
      password: "",
      repassword: "",
      phone: "",
      term_policy: "",
    };
    this.setStateFromInput = this.setStateFromInput.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
  }
  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  socialSign = (param) => {
    if (param === "google") {
      this.props.signInWithGoogle("user", this.props.history);
    } else {
      this.props.signInWithFacebook("user", this.props.history);
    }
  };

  createUser = (e) => {
    e.preventDefault();
    if (
      this.state.password !== this.state.repassword ||
      this.state.password.length < 7
    ) {
      toastr.info("Confirm password!");
      return false;
    }
    const userData = {
      email: this.state.email,
      password: this.state.password,
      name: this.state.firstname + " " + this.state.surname,
      phone: this.state.phone,
    };
    const url = JSON.parse(sessionStorage.getItem("url"));
    if (url) {
      this.props.signUp(userData, this.props.history, "user");
    } else {
      this.props.signUp(userData, this.props.history, "user");
    }
    this.props.addSIBContact(userData, console.log, "user");
  };
  render() {
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="login-content" style={{ minHeight: "855px" }}>
              <div className="login-header">
                <NavLink to="/sign-in">
                  <h3>User Sign In</h3>
                </NavLink>
                <h3 className="selected">Sign Up</h3>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  <form onSubmit={this.createUser}>
                    <input
                      type="text"
                      name="firstname"
                      className="form-control login-input user-icon"
                      placeholder="First Name"
                      onChange={this.setStateFromInput}
                      required
                    />
                    <input
                      type="text"
                      name="surname"
                      className="form-control login-input user-icon"
                      placeholder="Surname"
                      onChange={this.setStateFromInput}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      className="form-control login-input email-icon"
                      value={this.state.email}
                      onChange={this.setStateFromInput}
                      placeholder="Email"
                      required
                    />
                    <PhoneInput
                      country={"us"}
                      onChange={(phone) => this.setState({ phone: phone })}
                    />
                    <input
                      type="password"
                      name="password"
                      className="form-control login-input lock-icon"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.setStateFromInput}
                      required
                    />
                    <input
                      type="password"
                      name="repassword"
                      onChange={this.setStateFromInput}
                      className="form-control login-input lock-icon"
                      placeholder="Confirm Password"
                      required
                    />
                    <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary sign-check">
                      <input
                        type="checkbox"
                        name="term_policy"
                        className="custom-control-input"
                        id="tag9"
                        onChange={this.setStateFromInput}
                        required
                      />
                      <label
                        className="custom-control-label sign-prity"
                        htmlFor="tag9"
                      >
                        I agree to{" "}
                        <a
                          href="https://www.activities.app/terms-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline" }}
                        >
                          Terms of Use
                        </a>{" "}
                        and{" "}
                        <a
                          href="https://www.activities.app/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline" }}
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <div className="normal-sign">
                      <button type="submit" className="btn btn-sign">
                        Sign Up
                      </button>
                    </div>
                  </form>
                  <div className="facebook-sign">
                    <button
                      className="btn btn-facebook"
                      onClick={() => this.socialSign()}
                    >
                      Sign Up with facebook
                    </button>
                  </div>
                  <div className="google-sign">
                    <button
                      className="btn btn-google"
                      onClick={() => this.socialSign("google")}
                    >
                      Sign Up with Google
                    </button>
                  </div>
                  {/* <div>
                    <NavLink to="/sign-in">
                      <h5 className="to-signup">
                        Do you have an account?
                        <span style={{ color: "#358804" }}> Sign In</span>
                      </h5>
                    </NavLink>
                  </div> */}
                  <div className="line"></div>
                  <div>
                    <NavLink to="/sign-up-advertiser">
                      <h5 className="to-advertiser">Provider?</h5>
                    </NavLink>
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
        <Subscribe />
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    logo: state.logo,
    users: state.users,
  };
};
const mapDispatchToProp = (dispatch) => {
  return {
    signInWithGoogle: (userCheck, history) =>
      dispatch(signInWithGoogle(userCheck, history)),
    signInWithFacebook: (userCheck, history) =>
      dispatch(signInWithFacebook(userCheck, history)),
    signUp: (userData, callback, userCheck) =>
      dispatch(signUp(userData, callback, userCheck)),
    addSIBContact: (userData, callback, userCheck) =>
      dispatch(addSIBContact(userData, callback, userCheck)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(SignUp);
