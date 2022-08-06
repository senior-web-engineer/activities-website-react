import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// import $ from 'jquery';
import logo from "../../assets/img/logo@2.png";
import back from "../../assets/img/sign-page.jpg";
import Img from "react-cool-img";
import loadinggif from "../../assets/img/loading.gif";
import { CircularProgress } from "@material-ui/core";
import { Footer } from "components/layout/footer";
import Subscribe from "components/content/element/subscribe";

import {
  signIn,
  signInWithGoogle,
  signInWithFacebook,
} from "../../Store/action/auth";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
    };
    this.setStateFromInput = this.setStateFromInput.bind(this);
    this.signUser = this.signUser.bind(this);
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

  signUser = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const userData = {
      email: this.state.email,
      password: this.state.password,
      userType: "user",
    };
    this.props.signIn(userData, this.props.history).then(() => {
      this.setState({ loading: false });
    });
  };

  socialSign = (param) => {
    if (param === "google") {
      this.props.signInWithGoogle("user", this.props.history);
    } else {
      this.props.signInWithFacebook("user", this.props.history);
    }
  };

  render() {
    return (
      <>
        <div className="full-screen auth-page">
          <div className="auth-content">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="login-content">
              <div className="login-header">
                <h3 className="selected">User Sign In</h3>
                <NavLink to="/sign-up">
                  <h3>Sign Up</h3>
                </NavLink>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  <form onSubmit={this.signUser}>
                    <input
                      type="email"
                      name="email"
                      className="form-control login-input email-icon"
                      placeholder="Email"
                      onChange={this.setStateFromInput}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      className="form-control login-input lock-icon"
                      placeholder="Password"
                      onChange={this.setStateFromInput}
                      required
                    />
                    <div className="normal-sign position-relative">
                      <button
                        className="btn btn-sign"
                        type="submit"
                        disabled={this.state.loading}
                      >
                        User Sign In
                      </button>
                      {this.state.loading && (
                        <CircularProgress className="loading-circle-bar" />
                      )}
                    </div>
                  </form>
                  <NavLink to="/forgot-password">
                    <h5 className="text-button">Forgot Password?</h5>
                  </NavLink>

                  <div className="facebook-sign">
                    <button
                      className="btn btn-facebook"
                      onClick={() => this.socialSign()}
                    >
                      Sign In with facebook
                    </button>
                  </div>
                  <div className="google-sign">
                    <button
                      className="btn btn-google"
                      onClick={() => this.socialSign("google")}
                    >
                      Sign In with Google
                    </button>
                  </div>
                  <div></div>
                  <div className="line"></div>
                  <div>
                    <NavLink to="/sign-in-advertiser">
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
      </>
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
    signIn: (userData, history) => dispatch(signIn(userData, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(SignIn);
