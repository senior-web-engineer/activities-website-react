import { makeStyles } from "@material-ui/core";
import { BreadcrumbWraper } from "components/content/element/breadcrumb";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getBannerImageForWeb } from "Store/action/categories";
import toastr from "toastr";
import avoideImg from "../../assets/img/brand-avoid-cost.png";
import brandBanner from "../../assets/img/brand-banner.png";
import Slider1 from "../../assets/img/brand-slider1.png";
import Slider2 from "../../assets/img/brand-slider2.png";
import Slider3 from "../../assets/img/brand-slider3.png";
import brandMobileImg from "../../assets/img/list-baner-grid-back.jpg";
import loadingImg from "../../assets/img/loading.gif";
import { settings } from "../../config";
import { sendEmail } from "../../Store/action/emailCampaignActions";
import { Footer } from "../layout/footer";
import Header from "../layout/header";
import leftArrow from "assets/img/left-arrow.svg";
import rightArrow from "assets/img/right-arrow.svg";

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

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        width: "30px",
        marginTop: "-35px",
        height: "30px",
        position: "absolute",
        marginLeft: "22px",
        zIndex: "100",
      }}
      onClick={onClick}
    >
      <img src={leftArrow} alt="" />
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        width: "30px",
        height: "30px",
        position: "absolute",
        marginRight: "-30px",
        marginTop: "-35px",
        zIndex: "100",
        right: "0 !important",
      }}
      onClick={onClick}
    >
      <img src={rightArrow} alt="" />
    </div>
  );
}

export default function BrandMobileApp() {
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [bannerImg, setBannerImg] = useState(null);
  const { t } = useTranslation();
  let settingSlider = {
    ...settings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const getBannerImageOfPage = () => {
    getBannerImageForWeb(
      "/whitelabel",
      (res) => {
        setBannerImg(res);
        setLoading(false);
      },
      (error) => {
        console.log(error, "error");
        setLoading(false);
      }
    );
  };

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

  useEffect(() => {
    getBannerImageOfPage();
  }, []);

  return (
    <>
      <section className="header-breadcrumb bgimage">
        {loading ? (
          <div
            className="bg_image_holder"
            style={{ backgroundImage: `url(${loadingImg})`, opacity: 1 }}
          ></div>
        ) : (
          <div
            className="bg_image_holder"
            style={{
              backgroundImage: `url(${bannerImg || brandMobileImg})`,
              opacity: 1,
            }}
          ></div>
        )}
        <div className="mainmenu-wrapper">
          <Header class="menu--light" />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={t("personalized_mobile_app")} />
      </section>
      <div className="personalized-app">
        <div
          className="top-yellow-wave"
          style={{ background: `url(${brandBanner})` }}
        >
          <div className="custom-container1">
            <div className="personalized-description">
              <h1>{t("need_personalized_app_built")}</h1>
              <p>{t("with_our_custom_built")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="avoid-cost-time">
        <div className="custom-container1">
          <div className="avoid-cost-content">
            <div className="avoid-img">
              <img src={avoideImg} alt="" />
            </div>
            <div className="avoid-description">
              <h2>{t("avoid_cost_time")}</h2>
              <p>
                {t("average_app_build")}
                <br />
                <span>
                  <strong>{t("not_with_activities_app")}</strong>.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="brandapp-cost section-bg">
        <h1>{t("avaliable_from_month")}</h1>
      </div>
      <div className="brandapp-slider mb-5">
        <div className="custom-container1">
          <div className="brandapp-slider-description">
            <p>{t("easy_step_launch")}</p>
            <h5>{t("personalized_app")}</h5>
          </div>
          <div className="brandapp-sldier-content">
            <Slider {...settingSlider}>
              <div className="slider-img-brandapp p-2">
                <img src={Slider1} alt="" className="w-100" width="100" />
                <p>{t("we_design_it")}</p>
              </div>
              <div className="slider-img-brandapp p-2">
                <img src={Slider2} alt="" width="100" className="w-100" />
                <p>{t("approve_it")}</p>
              </div>
              <div className="slider-img-brandapp p-2">
                <img src={Slider3} alt="" width="100" className="w-100" />
                <p>{t("app_launched")}</p>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      <section className="section-bg pt-5 pb-5">
        <div className="container">
          <h1 className="text-center p-3">{t("request_call_back")}</h1>
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
