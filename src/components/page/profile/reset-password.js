import React, { Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/img/logo@2.png";
import { auth } from "../../../services/firebase";
import { forgotPassword } from "../../../Store/action/auth";
import FontAwesome from "react-fontawesome";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
// import Img from "react-cool-img";
// import loadinggif from "../../../assets/img/loading.gif";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      erro: "",
      email: "",
      success: "",
      validCode: null,
      verifiedCode: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    auth.verifyPasswordResetCode(this.props.actionCode).then(
      (email) => {
        this.setState({ email, validCode: true, verifiedCode: true });
      },
      (error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        this.setState({
          error: error.message,
          validCode: false,
          verifiedCode: true,
        });
      }
    );
  }

  handleChange = (event) => {
    this.setState({ password: event.target.value });
  };

  resetPassword = (event) => {
    event.preventDefault();
    const { actionCode } = this.props;
    const newPassword = this.state.password;
    auth.confirmPasswordReset(actionCode, newPassword).then(
      () => {
        this.setState({ success: true });
      },
      (error) => {
        this.setState({ error: error.message });
      }
    );
    // this.props.resetpassword(this.state.email);
    // this.props.history.push("/sign-in");
  };

  render() {
    const {
      email,
      error,
      password,
      success,
      validCode,
      verifiedCode,
    } = this.state;
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content mobile-forgot">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="forgot-content">
              <div className="login-header">
                <h3>Reset Password</h3>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  {success ? (
                    <div className="m-top-30">
                      <div class="alert alert-success">
                        <strong>Success!</strong> You can now sign in with your
                        new password
                      </div>
                      <div>
                        <NavLink to="/sign-in-user">
                          <h5 className="to-advertiser">Sign In</h5>
                        </NavLink>
                      </div>
                    </div>
                  ) : (
                    verifiedCode &&
                    validCode && (
                      <div className="m-top-30">
                        <h3>Reset your password</h3>
                        <div className="p-top-15">
                          for <span>{email}</span>
                        </div>
                        <form onSubmit={this.resetPassword}>
                          {error && (
                            <div class="alert alert-error">
                              <strong>Error!</strong> {error}
                            </div>
                          )}
                          <input
                            type="password"
                            className="form-control forgot-input lock-icon"
                            placeholder="Password"
                            value={password}
                            onChange={this.handleChange}
                            required
                          />
                          <div className="normal-sign">
                            <button className="btn btn-sign" type="submit">
                              <RotateLeftIcon />
                              Reset Password
                            </button>
                          </div>
                        </form>
                      </div>
                    )
                  )}
                  {verifiedCode && !validCode && (
                    <div className="ResetPassword m-top-30">
                      <h3>Try resetting your password again</h3>
                      <p className="error">{error}</p>
                      <input
                        type="email"
                        className="form-control forgot-input email-icon"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                        required
                      />
                      <div className="normal-sign">
                        <button
                          className="btn btn-sign"
                          onClick={(e) => this.props.forgotPassword(email)}
                        >
                          <FontAwesome name="send" />
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="forgot-back">
            <Img
              placeholder={loadinggif}
              src={back}
              className="auth-backimg"
              cache
              alt=""
            />
          </div> */}
          <div className="forgot-back"></div>
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
    forgotPassword: (email) => dispatch(forgotPassword(email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ResetPassword);
