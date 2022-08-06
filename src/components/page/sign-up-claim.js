import { RadioGroup } from "@material-ui/core";
// import $ from 'jquery';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import React, { useEffect, useState } from "react";
import Img from "react-cool-img";
import "react-phone-input-2/lib/style.css";
import { NavLink, useHistory } from "react-router-dom";
import logo from "../../assets/img/black-for-provider.png";
import loadinggif from "../../assets/img/loading.gif";
import back from "../../assets/img/sign-page.jpg";
import SignUpCorporation from "../content/element/card/sign-up-corporation";
import SignUpIndividual from "../content/element/card/sign-up-individual";
import SignUpLic from "../content/element/card/sign-up-lic";
import SignUpOther from "../content/element/card/sign-up-other";
import SignUpPartnership from "../content/element/card/sign-up-partnership";
import { Footer } from "components/layout/footer";
import Subscribe from "components/content/element/subscribe";

export default function SignUpClaim(props) {
  const history = useHistory();
  const [businessType, setBusinessType] = useState("");

  // const setStateFromInput = (event) => {
  //   var obj = {};
  //   obj[event.target.name] = event.target.value;
  //   this.setState(obj);
  // };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
  }, [props]);

  return (
    <>
      <div className="full-screen auth-page">
        <div className="auth-content">
          <NavLink to="/">
            <img src={logo} className="auth-logo" alt="" />
          </NavLink>
          <div className="login-content" style={{ minHeight: "855px" }}>
            <div className="login-header">
              {/* <NavLink to="/sign-in-advertiser"> */}
              <h3 className="selected">Provider Sign Up</h3>
              {/* </NavLink>
            <h3 className="selected">Sign Up</h3> */}
            </div>
            <div className="login-body">
              <div className="custom-container1 mt-10">
                {!Boolean(businessType) && (
                  <>
                    <h4>Select a type</h4>
                    <RadioGroup
                      aria-label="delaied"
                      name="delaied"
                      value={businessType}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            className="cu-icon-color"
                            onClick={(e) => setBusinessType(e.target.value)}
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
                            onClick={(e) => setBusinessType(e.target.value)}
                          />
                        }
                        label="Partnership"
                      />
                      <FormControlLabel
                        value="Corporation"
                        control={
                          <Radio
                            className="cu-icon-color"
                            onClick={(e) => setBusinessType(e.target.value)}
                          />
                        }
                        label="Corporation"
                      />
                      <FormControlLabel
                        value="Llc"
                        control={
                          <Radio
                            className="cu-icon-color"
                            onClick={(e) => setBusinessType(e.target.value)}
                          />
                        }
                        label="Llc"
                      />
                      <FormControlLabel
                        value="Other"
                        control={
                          <Radio
                            className="cu-icon-color"
                            onClick={(e) => setBusinessType(e.target.value)}
                          />
                        }
                        label="Other"
                      />
                    </RadioGroup>
                  </>
                )}
              </div>
              <div className="custom-container1">
                {businessType === "Corporation" && (
                  <SignUpCorporation
                    history={history}
                    businessInfo={props?.location?.state?.activity ?? {}}
                  />
                )}
                {businessType === "Llc" && (
                  <SignUpLic
                    history={history}
                    businessInfo={props?.location?.state?.activity ?? {}}
                  />
                )}
                {businessType === "Partnership" && (
                  <SignUpPartnership
                    history={history}
                    businessInfo={props?.location?.state?.activity ?? {}}
                  />
                )}
                {businessType === "Other" && (
                  <SignUpOther
                    history={history}
                    businessInfo={props?.location?.state?.activity ?? {}}
                  />
                )}
                {businessType === "Individual" && (
                  <SignUpIndividual
                    history={history}
                    businessInfo={props?.location?.state?.activity ?? {}}
                  />
                )}
                <div className="line"></div>
                {Boolean(businessType) && (
                  <div>
                    <h5
                      className="to-advertiser pointer"
                      onClick={() => setBusinessType("")}
                    >
                      back
                    </h5>
                  </div>
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
      <Subscribe />
      <Footer />
    </>
  );
}
