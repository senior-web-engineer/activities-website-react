import { RadioGroup } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import { compose } from "redux";
import toastr from "toastr";
import { setBusinessInfo } from "../../../Store/action/auth";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";
export class BusinessProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone_number: "",
      avatar: "",
      business_type: "Individual",
      business_name: "",
      business_phone_number: "",
      business_address: "",
    };
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      email: user.email,
      name: user.name,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
      business_type:
        user.business_type !== undefined
          ? user.business_type
          : this.state.business_type,
      business_phone_number:
        user.business_phone_number !== undefined
          ? user.business_phone_number
          : this.state.business_phone_number,
      business_address:
        user.business_address !== undefined
          ? user.business_address
          : this.state.business_address,
      business_name:
        user.business_name !== undefined
          ? user.business_name
          : this.state.business_name,
    }));
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
    document.addEventListener("keydown", this.escFunction, false);
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    if (!addressObject.address_components) {
      toastr.info("Select location correctly!");
      return false;
    }
    this.setState({
      business_address: addressObject.formatted_address,
    });
  }

  setBusinessProfile = () => {
    if (
      this.state.business_name === "" ||
      this.state.business_address === "" ||
      this.state.business_phone_number === ""
    ) {
      toastr.info("Write your business information!");
      return false;
    }
    this.props.setBusinessInfo(this.state);
  };
  render() {
    const { t } = this.props;
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
                <SideBar select={7} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-building"></span>
                          <MultiLang text="business_profile" />
                        </h4>
                      </div>
                    </div>
                    <div className="col-md-8 cu-input-padding">
                      <div className="atbdp-radio-list cu-widthdraw-title">
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
                                  this.setState({
                                    business_type: e.target.value,
                                  });
                                }}
                              />
                            }
                            label={t("Individual")}
                            value="Individual"
                          />
                          <FormControlLabel
                            value="Partnership"
                            control={
                              <Radio
                                className="cu-icon-color"
                                onClick={(e) => {
                                  this.setState({
                                    business_type: e.target.value,
                                  });
                                }}
                              />
                            }
                            label={t("Partnership")}
                          />
                          <FormControlLabel
                            value="Corporation"
                            control={
                              <Radio
                                className="cu-icon-color"
                                onClick={(e) => {
                                  this.setState({
                                    business_type: e.target.value,
                                  });
                                }}
                              />
                            }
                            label={t("Corporation")}
                          />
                          <FormControlLabel
                            value="Llc"
                            control={
                              <Radio
                                className="cu-icon-color"
                                onClick={(e) => {
                                  this.setState({
                                    business_type: e.target.value,
                                  });
                                }}
                              />
                            }
                            label={t("Llc")}
                          />
                          <FormControlLabel
                            value="Other"
                            control={
                              <Radio
                                className="cu-icon-color"
                                onClick={(e) => {
                                  this.setState({
                                    business_type: e.target.value,
                                  });
                                }}
                              />
                            }
                            label={t("Other")}
                          />
                        </RadioGroup>
                      </div>
                      <div className="cu-widthdraw">
                        <h5 className="mb-10 mt-10">
                          {" "}
                          <MultiLang text="business_name" />
                        </h5>
                        <input
                          type="text"
                          className="form-control cu-radius"
                          value={this.state.business_name}
                          onChange={(e) =>
                            this.setState({ business_name: e.target.value })
                          }
                          required
                        />
                        <h5 className="mb-10 mt-10">
                          {" "}
                          <MultiLang text="business_address" />
                        </h5>
                        <input
                          type="text"
                          id="autocomplete"
                          className="form-control cu-radius"
                          defaultValue={this.state.business_address}
                          required
                          placeholder={t("address")}
                        />
                        <h5 className="mb-10 mt-10">
                          {" "}
                          <MultiLang text="telephone_num" />
                        </h5>
                        <PhoneInput
                          country={"us"}
                          value={this.state.business_phone_number}
                          onChange={(phone) =>
                            this.setState({ business_phone_number: phone })
                          }
                        />
                      </div>

                      <button
                        className="btn btn-block btn-gradient btn-gradient-two btn-lg claim-btn cu-radius cu-hover cu-widthdraw"
                        style={{ width: "50%", marginTop: "20px" }}
                        onClick={this.setBusinessProfile}
                      >
                        <MultiLang text="save_settings" />
                      </button>
                    </div>
                  </div>
                </div>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setBusinessInfo: (info) => dispatch(setBusinessInfo(info)),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(BusinessProfile);
