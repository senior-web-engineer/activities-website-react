import AccountHeader from "components/content/element/accountHeader";
import ProfileUpload from "components/content/element/profileUpload";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import { compose } from "redux";
import toastr from "toastr";
import { updateAccount } from "../../../Store/action/auth";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      displayAvatar: "",
      avatar: "",
      phone_number: "",
      prevAddress: {},
      address: "",
      city: "",
      curpassword: "",
      newpassword: "",
    };
    this.setStateFromInput = this.setStateFromInput.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }

  componentDidMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let addressInfo = "";
    if (user.address !== undefined) {
      if (typeof user.address === "object") {
        addressInfo =
          user.address.street +
          ", " +
          user.address.city +
          ", " +
          user.address.state +
          ", " +
          user.address.country;
      } else {
        addressInfo = user.address;
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      displayAvatar: user?.profile_picture || "",
      avatar: user?.profile_picture || "",
      phone_number:
        user.phone_number !== undefined
          ? user.phone_number
          : this.state.phone_number,
      address: addressInfo,
      prevAddress: user.address,
      city: user.city !== undefined ? user.city : this.state.city,
    }));
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  }

  handlePlaceSelect() {
    const role = JSON.parse(sessionStorage.getItem("role"));
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    if (!address) {
      toastr.info("Select address correctly!");
      return false;
    }
    let addressForm = {
      street_number: "short_name",
      route: "long_name",
      sublocality: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      country: "short_name",
      postal_code: "short_name",
    };
    address.forEach((item) => {
      const addressType = item.types[0];
      addressForm[addressType] = item[addressForm[addressType]];
    });
    if (addressForm.street_number === "short_name") {
      addressForm["street_number"] = "";
    }
    if (addressForm.route === "long_name") {
      addressForm["route"] = "";
    }
    const place = {
      street: addressForm.street_number + " " + addressForm.route,
      city: addressForm.locality === "long_name" ? "" : addressForm.locality,
      state:
        addressForm.administrative_area_level_1 === "short_name"
          ? ""
          : addressForm.administrative_area_level_1,
      country: addressForm.country === "short_name" ? "" : addressForm.country,
      suburb: "",
    };
    if (role === "advertiser") {
      this.setState({ address: place, prevAddress: place });
    } else {
      // address.forEach((item) => {
      //   if (item["types"][0] === "locality") {
      //     cityName = item["long_name"];
      //   }
      // });
      this.setState({
        address: addressObject.formatted_address,
        city: place.city,
      });
    }
  }

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };
  setAccount = () => {
    this.props.updateAccount(this.state);
  };

  imageCompress = (avatar) => {
    console.log(avatar, "avatar");
    this.setState({ displayAvatar: avatar });
  };

  render() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
        </section>
        {/* Header section end */}
        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={1} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-user"></span>{" "}
                          <MultiLang text="edit_account" />
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      <div className="needs-validation">
                        <div className="form-row">
                          <div className="col-md-6 cu-input-padding">
                            <label>
                              <MultiLang text="profile_picture" /> :
                            </label>
                            <ProfileUpload
                              avatar={
                                this.state.avatar === ""
                                  ? []
                                  : [this.state.avatar]
                              }
                              handleChangeImages={this.imageCompress}
                            />
                          </div>
                          <div className="col-md-12 mb-12 cu-input-padding">
                            <label>
                              <MultiLang text="name" />
                            </label>
                            <input
                              type="text"
                              name="name"
                              className="form-control cu-radius"
                              placeholder="User Name"
                              value={this.state.name}
                              onChange={this.setStateFromInput}
                              required
                            />
                          </div>
                          <div className="col-md-12 mb-12 cu-input-padding">
                            <label>
                              <MultiLang text="email" />
                            </label>
                            <input
                              name="email"
                              type="text"
                              className="form-control cu-radius"
                              placeholder="Email"
                              value={this.state.email}
                              onChange={this.setStateFromInput}
                              required
                              disabled
                            />
                          </div>
                          <div className="col-md-12 mb-12 cu-input-padding">
                            <label>
                              <MultiLang text="phone" />
                            </label>
                            <PhoneInput
                              country={"us"}
                              value={this.state.phone_number}
                              onChange={(phone) =>
                                this.setState({ phone_number: phone })
                              }
                            />
                          </div>
                          <div className="col-md-12 mb-12 cu-input-padding">
                            <label>
                              <MultiLang text="address" />
                            </label>
                            <input
                              id="autocomplete"
                              className="form-control"
                              defaultValue={this.state.address}
                              ref="input"
                              type="text"
                            />
                          </div>
                          <div className="col-md-6 mb-12 cu-input-padding">
                            <label>
                              <MultiLang text="current_pwd" />
                            </label>
                            <input
                              name="curpassword"
                              type="password"
                              className="form-control cu-radius"
                              onChange={this.setStateFromInput}
                              required
                              disabled={
                                user.sign_type === "social" ? true : false
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-12 cu-input-padding">
                            <label>
                              <MultiLang text="new_pwd" />
                            </label>
                            <input
                              name="newpassword"
                              type="password"
                              className="form-control cu-radius"
                              onChange={this.setStateFromInput}
                              required
                              disabled={
                                user.sign_type === "social" ? true : false
                              }
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-gradient btn-gradient-two btn-lg claim-btn cu-radius cu-hover mt-10"
                          onClick={this.setAccount}
                        >
                          <MultiLang text="save_settings" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_author_module -->*/}
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
    categories: state.category,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateAccount: (userData) => dispatch(updateAccount(userData)),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(EditAccount);
