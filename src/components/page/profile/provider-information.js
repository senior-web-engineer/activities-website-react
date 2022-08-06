import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import toastr from "toastr";
import image from "../../../assets/img/Banners/support.png";
import { sendEmail } from "../../../Store/action/emailCampaignActions";
import { BreadcrumbProviderInformation } from "../../content/element/breadcrumb";
import { Footer } from "../../layout/footer";
import Header from "../../layout/header";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root": {
      borderRadius: "30px",
    },
    "& .MuiOutlinedInput-notchedOutline:hover": {
      borderColor: "#afdb30 !important",
    },
    height: "100%",
  },
  telPhone: {
    "& .react-tel-input": {
      height: "51px",
      "& .form-control": {
        height: "51px !important",
      },
    },
  },
}));

export default function ProviderInformation() {
  const history = useHistory();
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const light = useSelector((state) => state?.logo?.[0].light);
  const { t } = useTranslation();

  const handleChangeForm = (e) => {
    const { name, value } = e?.target ?? {};
    setFormData((s) => ({
      ...s,
      [name]: value ?? "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone_number) {
      toastr.info("Phone number is required!");
      return false;
    }
    const htmlContent = `<div style='width:375px; border:1px solid #eee; margin-right:auto;margin-left:auto;'>
    <h1 style="padding-left: 10px;">Hi, James</h1>
    <p style="font-size: 20px; padding-left: 10px">You have received request from Provider</p>
    <div style='text-align:left;padding: 25px 0 20px 0;background-color:#fbfcfd'>
      <h2>name: ${formData.name}  </h2>
      <h2>Business Email: ${formData.email}</h2>
      <h2>Business Name: ${formData.company_name}</h2>
      <h2>Phone Number: ${formData.phone_number}</h2>
      <p style="font-size:20px;">Please contact </p>
    </div></div>`;
    sendEmail(
      formData,
      htmlContent,
      (res) => {
        toastr.success("Email sended successfully to admin!");
        history.push("/");
      },
      (error) => {}
    );
  };

  useEffect(() => {}, []);

  return (
    <>
      <section className="header-breadcrumb bgimage list-overlay">
        <div
          className="bg_image_holder"
          style={{ backgroundImage: `url(${image})`, opacity: "1" }}
        ></div>
        <div className="mainmenu-wrapper">
          <Header logo={light} class="menu--light" history={history} />
        </div>
        <BreadcrumbProviderInformation />
      </section>
      <section className="about-contents section-padding section-bg pt-2 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 col-sm-12 contents-wrapper">
              <ValidatorForm
                onSubmit={handleSubmit}
                onError={(errors) =>
                  toastr.warning(
                    errors?.[0]?.props?.errorMessages?.join("<br/>")
                  )
                }
              >
                <div className="col-md-12 mb-12 cu-input-padding">
                  <label>{t("name")} : </label>
                  <TextValidator
                    type="text"
                    name="name"
                    className={`form-control cu-radius ${classes.root}`}
                    placeholder={t("name")}
                    value={formData.name || ""}
                    onChange={handleChangeForm}
                    validators={["required"]}
                    errorMessages={[`${t("this_is_required")}`]}
                    variant="outlined"
                  />
                </div>
                <div className="col-md-12 mb-12 cu-input-padding">
                  <label>{t("company_name")} : </label>
                  <TextValidator
                    type="text"
                    name="company_name"
                    className={`form-control cu-radius ${classes.root}`}
                    placeholder={t("company_name")}
                    value={formData.company_name || ""}
                    onChange={handleChangeForm}
                    validators={["required"]}
                    errorMessages={[`${t("this_is_required")}`]}
                    variant="outlined"
                  />
                </div>
                <div className="col-md-12 mb-12 cu-input-padding">
                  <label>{t("company_email")} : </label>
                  <TextValidator
                    onChange={handleChangeForm}
                    name="email"
                    className={`form-control cu-radius ${classes.root}`}
                    value={formData.email || ""}
                    placeholder={t("company_email")}
                    validators={["required", "isEmail"]}
                    errorMessages={[
                      `${t("this_is_required")}`,
                      `${t("email_is_not_valid")}`,
                    ]}
                    variant="outlined"
                  />
                </div>
                <div
                  className={`col-md-12 mb-12 cu-input-padding ${classes.telPhone}`}
                >
                  <label>{t("phone_number")} : </label>
                  <PhoneInput
                    country={"us"}
                    value={formData.phone_number}
                    onChange={(phone) =>
                      setFormData((s) => ({
                        ...s,
                        phone_number: phone,
                      }))
                    }
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-gradient btn-gradient-two btn-lg"
                    type="submit"
                  >
                    {t("submit")}
                  </button>
                </div>
              </ValidatorForm>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
