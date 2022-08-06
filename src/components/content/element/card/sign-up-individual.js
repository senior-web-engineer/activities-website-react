import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/content/element/card/CustomDatePicker";
import moment from "moment";
import parseAddress from "parse-address-string";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch } from "react-redux";
import toastr from "toastr";
import * as Actions from "../../../../Store/action/auth";
let autocomplete = null;

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root": {
      height: 40,
      borderRadius: 30,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#333",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #c5c5c5",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #c5c5c5",
    },
    marginBottom: "10px",
  },
}));

function SignUpIndividual(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [birth_date, setBirthDate] = useState(moment().format("YYYY-MM-DD"));
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [business_name, setBusinessName] = useState("");
  const [termFlag, setTermFlag] = useState(false);

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
    setBusinessName(props?.businessInfo?.company);
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

  const signUp = (e) => {
    let businessInfo = props?.businessInfo ?? {};
    businessInfo["address"] = address;
    e.preventDefault();
    if (name === "" || email === "") {
      toastr.info("Please check email and name!");
      return false;
    }
    if (password !== repassword || password.length < 7) {
      toastr.info("Please check password!");
      return false;
    }
    if (
      address === "" ||
      !Boolean(address?.city) ||
      !Boolean(address?.country)
    ) {
      toastr.info("Please correctly address!");
      return false;
    }
    if (!termFlag) {
      toastr.info("Please check Term and Policy");
      return false;
    }
    const userInfo = {
      name: name,
      business_type: "Individual",
      birth_date: moment(birth_date, "YYYY-MM-DD").format("MM/DD/YYYY"),
      phone_number: phone,
      address: address,
      business_name: business_name,
      email: email,
      password: password,
    };
    dispatch(
      Actions.signUp(
        userInfo,
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
          "Individual",
          props?.type ?? "",
          businessInfo ?? {}
        )
      );
    } else {
      dispatch(
        Actions.signInWithFacebook(
          "advertiser",
          props.history,
          "Individual",
          props?.type ?? "",
          businessInfo ?? {}
        )
      );
    }
  };

  return (
    <div>
      <form>
        <input
          type="text"
          name="name"
          className="form-control login-input user-icon"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="business_name"
          className="form-control login-input user-icon"
          placeholder="Business Name"
          value={business_name}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        {/* <input
          type="date"
          name="birth_date"
          className="form-control login-input user-icon"
          placeholder="Birth Date"
          value={birth_date}
          onChange={(e) => setBirthDate(e.target.value)}
        /> */}
        <label className="d-flex">Date of Birth</label>
        {/* <TextField
          className={`${classes.root} form-control`}
          id="outlined-required"
          type="date"
          // label="Date of Birth"
          variant="outlined"
          value={birth_date}
          onChange={(e) => setBirthDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        /> */}
        <CustomDatePicker
          value={birth_date}
          className={`${classes.root} form-control`}
          onChange={(e) => {
            console.log(e);
            setBirthDate(e);
          }}
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          className="form-control login-input lock-icon"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="repassword"
          className="form-control login-input lock-icon"
          placeholder="Confirm Password"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
        />
        <input
          id="autocomplete"
          className="form-control login-input address-icon"
          placeholder="address"
          defaultValue={props?.businessInfo?.address ?? ""}
          type="text"
        />
        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary sign-check">
          <input
            type="checkbox"
            name="term_policy"
            className="custom-control-input"
            id="tag9"
            onChange={(e) => setTermFlag((prevState) => !prevState)}
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
          <button className="btn btn-sign" type="submit" onClick={signUp}>
            Sign Up
          </button>
        </div>
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
            onClick={(e) => socialSign(e, "google")}
          >
            Sign Up with Google
          </button>
        </div>
      </form>
    </div>
  );
}
export default SignUpIndividual;
