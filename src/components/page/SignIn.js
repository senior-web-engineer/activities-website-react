import React, { Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// import $ from 'jquery';
import logo from "../../assets/img/logo@2.png";
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
    };
  }
  render() {
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="login-content">
              <div className="login-header">
                <h3>Sign In</h3>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  <form action="/">
                    <input
                      type="email"
                      className="form-control login-input email-icon"
                      placeholder="Email"
                      required
                    />
                    <input
                      type="password"
                      className="form-control login-input lock-icon"
                      placeholder="Password"
                      required
                    />
                    <div className="normal-sign">
                      <button className="btn btn-sign" type="submit">
                        Sign In
                      </button>
                    </div>
                  </form>
                  <NavLink to="/">
                    <h5 className="text-button">Forgot Password?</h5>
                  </NavLink>

                  <div className="facebook-sign">
                    <button className="btn btn-facebook">
                      Sign In with facebook
                    </button>
                  </div>
                  <div className="google-sign">
                    <button className="btn btn-google">
                      Sign In with Google
                    </button>
                  </div>
                  <div>
                    <NavLink to="/sign-up">
                      <h5 className="to-signup">
                        Don't you have any account?
                        <span style={{ color: "#358804" }}> Sign Up</span>
                      </h5>
                    </NavLink>
                  </div>
                  <div className="line"></div>
                  <div>
                    <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isAdvetisor"
                      />
                      <label className="custom-control-label is-advetisor">
                        Advetisor?
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="login-back"></div>
        </div>
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
    signInWithGoogle: () => dispatch(signInWithGoogle()),
    signInWithFacebook: () => dispatch(signInWithFacebook()),
    signIn: (email, password) => dispatch(signIn(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(SignIn);
