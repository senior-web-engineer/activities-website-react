import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import { useForm } from "react-hook-form";
import * as Actions from "../../../../Store/action/auth";
import toastr from "toastr";
import parseAddress from "parse-address-string";
let autocomplete = null;

function SignUpLic(props) {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      business_name: props?.businessInfo?.company ?? "",
    },
  });
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let google = window.google;
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );
    autocomplete.addListener("place_changed", handlePlaceSelect);
    handleSetAddress(props?.businessInfo?.address ?? "");
    setPhone(
      props?.businessInfo?.phone_number
        ? `+1 ${props?.businessInfo?.phone_number}`
        : ""
    );
  }, [props]);

  const handleSetAddress = async (address) => {
    parseAddress(address, (err, addressObj) => {
      addressObj["street"] = addressObj["street_address1"];
      addressObj["suburb"] = "";
      delete addressObj.street_address1;
      setAddress(addressObj);
    });
  };

  const handlePlaceSelect = () => {
    let addressObject = autocomplete.getPlace();
    let address = addressObject.address_components;
    if (!address) {
      toastr.info("Please check password!");
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
    setAddress(place);
  };

  const onSubmit = (data) => {
    let businessInfo = props?.businessInfo ?? {};
    businessInfo["address"] = address;
    data["address"] = address;
    data["phone_number"] = phone;
    data["business_type"] = "Llc";
    if (data.name === "" || data.email === "") {
      toastr.info("Please check email and name!");
      return false;
    }
    if (data.password.length < 7 || data.password !== data.repassword) {
      toastr.info("Plesase correctly password!");
      return false;
    } else if (
      address === "" ||
      !Boolean(address?.city) ||
      !Boolean(address?.country)
    ) {
      toastr.info("Please correctly address!");
      return false;
    }
    delete data.repassword;
    // dispatch(
    //   Actions.signUp(
    //     data,
    //     () => props.history.push(url ? url : "my-activities"),
    //     "advertiser"
    //   )
    // );
    dispatch(
      Actions.signUp(
        data,
        props.history,
        "advertiser",
        props?.type ?? "",
        businessInfo
      )
    );
  };

  const socialSign = (e, param) => {
    let businessInfo = props?.businessInfo ?? {};
    businessInfo["address"] = address;
    e.preventDefault();
    if (param === "google") {
      dispatch(
        Actions.signInWithGoogle(
          "advertiser",
          props.history,
          "Llc",
          props?.type ?? "",
          businessInfo ?? {}
        )
      );
    } else {
      dispatch(
        Actions.signInWithFacebook(
          "advertiser",
          props.history,
          "Llc",
          props?.type ?? "",
          businessInfo ?? {}
        )
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <input
          type="text"
          name="name"
          className="form-control login-input user-icon"
          placeholder="Name of Company"
          ref={register}
          required
        /> */}
        <input
          type="text"
          name="business_name"
          className="form-control login-input user-icon"
          placeholder="Name of Company"
          ref={register}
          required
        />
        <input
          type="text"
          name="entity_jurisdiction"
          className="form-control login-input user-icon"
          placeholder="Jurisdiction of entity(e.g. CA or Ny...)"
          ref={register}
          required
        />
        <input
          type="text"
          name="name"
          className="form-control login-input user-icon"
          placeholder="Name of Manager"
          ref={register}
          required
        />
        <input
          type="text"
          name="applicant_position"
          className="form-control login-input user-icon"
          placeholder="Position of applicant"
          ref={register}
          required
        />
        <PhoneInput
          country={"us"}
          value={phone}
          onChange={(phone) => setPhone(phone)}
        />
        <input
          type="email"
          name="email"
          className="form-control login-input email-icon"
          // value={this.state.email}
          ref={register}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          className="form-control login-input lock-icon"
          placeholder="Password"
          // value={this.state.password}
          ref={register}
          required
        />
        <input
          type="password"
          name="repassword"
          className="form-control login-input lock-icon"
          placeholder="Confirm Password"
          ref={register}
          required
        />
        <input
          id="autocomplete"
          className="form-control login-input address-icon"
          placeholder="address"
          // defaultValue={address}
          defaultValue={props?.businessInfo?.address ?? ""}
          type="text"
        />
        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary sign-check">
          <input
            type="checkbox"
            name="term_policy"
            className="custom-control-input"
            id="tag9"
            required
          />
          <label className="custom-control-label sign-prity" htmlFor="tag9">
            {" "}
            I agree to{" "}
            <a
              href="https://www.activities.app/provider-terms-conditions"
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
          onClick={(e) => socialSign(e, "linkedin")}
        >
          Sign Up with facebook
        </button>
      </div>
      <div className="google-sign">
        <button
          className="btn btn-google"
          onClick={(e) => socialSign("google")}
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}
export default SignUpLic;
