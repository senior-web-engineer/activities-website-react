import React, { Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import logo from "../../assets/img/logo@2.png";
import { forgotPassword } from "../../Store/action/auth";

class ForgotPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
  }

  handleChange = (event) => {
    this.setState({ email: event.target.value });
  };
  forgotPassword = () => {
    this.props.forgotPassword(this.state.email);
    this.props.history.push("/");
  };

  render() {
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content mobile-forgot">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="forgot-content">
              <div className="login-header">
                <h3>Forgot Password?</h3>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  <form onSubmit={this.forgotPassword}>
                    <input
                      type="email"
                      className="form-control forgot-input email-icon"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
                    />
                    <div className="normal-sign">
                      <button className="btn btn-sign" type="submit">
                        <FontAwesome name="send" />
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProp)(ForgotPass);
