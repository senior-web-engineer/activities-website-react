import React, { Fragment } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// import $ from 'jquery';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { RadioGroup } from "@material-ui/core";
import "react-phone-input-2/lib/style.css";
import logo from "../../assets/img/black-for-provider.png";
import back from "../../assets/img/signup-back.jpg";
import SignUpCorporation from "../content/element/card/sign-up-corporation";
import SignUpIndividual from "../content/element/card/sign-up-individual";
import SignUpLic from "../content/element/card/sign-up-lic";
import SignUpOther from "../content/element/card/sign-up-other";
import SignUpPartnership from "../content/element/card/sign-up-partnership";
import Img from "react-cool-img";
import loadinggif from "../../assets/img/loading.gif";
import {
  signUp,
  signInWithGoogle,
  signInWithFacebook,
} from "../../Store/action/auth";

class SignUpAdv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      business_type: "",
    };
    this.setStateFromInput = this.setStateFromInput.bind(this);
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

  render() {
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content">
            <NavLink to="/" onClick={(e) => e.preventDefault()}>
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="login-content" style={{ minHeight: "855px" }}>
              <div className="login-header">
                <h4
                  style={{
                    padding: "20px 0",
                    color: "#fff",
                    lineHeight: "1.3",
                  }}
                >
                  Please Confirm your Information for Security
                </h4>
              </div>
              <div className="login-body">
                <div className="custom-container1 mt-10">
                  <h4>Select a type</h4>
                  <RadioGroup
                    aria-label="delaied"
                    name="delaied"
                    value={this.state.business_type}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          className="cu-icon-color"
                          onClick={(e) => {
                            this.setState({ business_type: e.target.value });
                          }}
                        />
                      }
                      label="Individual"
                      value="Individual"
                    />
                    <FormControlLabel
                      value="Partnership"
                      control={
                        <Radio
                          className="cu-icon-color"
                          onClick={(e) =>
                            this.setState({ business_type: e.target.value })
                          }
                        />
                      }
                      label="Partnership"
                    />
                    <FormControlLabel
                      value="Corporation"
                      control={
                        <Radio
                          className="cu-icon-color"
                          onClick={(e) =>
                            this.setState({ business_type: e.target.value })
                          }
                        />
                      }
                      label="Corporation"
                    />
                    <FormControlLabel
                      value="Llc"
                      control={
                        <Radio
                          className="cu-icon-color"
                          onClick={(e) =>
                            this.setState({ business_type: e.target.value })
                          }
                        />
                      }
                      label="Llc"
                    />
                    <FormControlLabel
                      value="Other"
                      control={
                        <Radio
                          className="cu-icon-color"
                          onClick={(e) =>
                            this.setState({ business_type: e.target.value })
                          }
                        />
                      }
                      label="Other"
                    />
                  </RadioGroup>
                </div>
                <div className="custom-container1">
                  {this.state.business_type === "Corporation" && (
                    <SignUpCorporation
                      type="resignup"
                      history={this.props.history}
                    />
                  )}
                  {this.state.business_type === "Llc" && (
                    <SignUpLic type="resignup" history={this.props.history} />
                  )}
                  {this.state.business_type === "Partnership" && (
                    <SignUpPartnership
                      type="resignup"
                      history={this.props.history}
                    />
                  )}
                  {this.state.business_type === "Other" && (
                    <SignUpOther type="resignup" history={this.props.history} />
                  )}
                  {this.state.business_type === "Individual" && (
                    <SignUpIndividual
                      type="resignup"
                      history={this.props.history}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="signup-back" alt="">
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
    users: state.users,
  };
};
const mapDispatchToProp = (dispatch) => {
  return {
    signInWithGoogle: (userCheck) => dispatch(signInWithGoogle(userCheck)),
    signInWithFacebook: (userCheck) => dispatch(signInWithFacebook(userCheck)),
    signUp: (userData, callback, userCheck) =>
      dispatch(signUp(userData, callback, userCheck)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(SignUpAdv);
