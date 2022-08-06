import Slider from "@material-ui/core/Slider";
import ScheduleIcon from "@material-ui/icons/Schedule";
import Rating from "@material-ui/lab/Rating";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function AllListingSidebar({
  returnBack = console.log(),
  handleChangePrice = console.log(),
  handleLookingData = console.log(),
  handleCategory = console.log(),
  handleLocation = console.log(),
  handleOpenNow = console.log(),
  handleFilterAll = console.log(),
  categoryName = "all",
  location = "",
  handleChangeRating = console.log(),
  lookingData = "",
  min = 0,
  max = 50000,
  rating = 0,
  openNow = false,
  ...props
}) {
  const { t } = useTranslation();
  const categories = useSelector((state) => state?.category?.categories ?? []);
  const styles = {
    openNowBtn: {
      padding: "10px 15px",
      borderRadius: "4px",
      border: "1px solid #afdb30",
    },
    activeOpenNowBtn: {
      border: "none",
      padding: "10px 15px",
      background: "#afdb30",
      borderRadius: "4px",
    },
  };

  return (
    <div className="order-lg-0 order-1 mt-lg-0 mb-3" id="listing-filter">
      <div className="listings-sidebar">
        <div className="search-area default-ad-search">
          <div className="form-group">
            <input
              type="text"
              placeholder={t("what_are_you_looking_for.placeholder")}
              className="form-control"
              // onChange={e => filterFuc(e.target.value, "All", "")}
              onChange={(e) => {
                handleLookingData(e.target.value);
              }}
              value={lookingData}
            />
          </div>
          <div className="form-group">
            <div className="select-basic">
              <select
                className="form-control"
                onChange={(e) => handleCategory(e.target.value)}
                value={categoryName}
              >
                <option value="All">{t("select_a_cateogry_list")}</option>
                {categories.map((value, key) => {
                  return (
                    <option key={key} value={value.category?.replace(/&/g, "")}>
                      {value.category}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="position-relative">
              <input
                id="autocomplete"
                value={location}
                className="form-control location-name"
                onChange={(e) => handleLocation(e.target.value)}
                type="text"
                placeholder={t("please_wirte_city_or_zip_code")}
              />
              <button type="submit" className="locator">
                <span className="la la-crosshairs"></span>
              </button>
            </div>
          </div>
          <div className="form-group p-bottom-10">
            <div className="price-range rs-primary">
              <p className="d-flex justify-content-between">
                <span>{t("price_range")}: </span>
                <span style={{ color: "#358804" }}>{`$${min} - $${max}`}</span>
              </p>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 5000]}
                  onChange={(event, newValue) =>
                    handleChangePrice(event, newValue)
                  }
                  max={5000}
                />
              </div>
            </div>
          </div>
          <div className="justify-content-between align-items-center d-flex">
            <h5 className="mb-2">{t("filter_by_ratings")}</h5>
            <div className="sort-rating">
              <Rating
                name="size-large"
                value={rating}
                size="large"
                onChange={(event, newValue) => handleChangeRating(newValue)}
              />
            </div>
          </div>
          <div className="check-btn mt-3">
            <div
              className="pointer"
              style={openNow ? styles.activeOpenNowBtn : styles.openNowBtn}
              onClick={handleOpenNow}
            >
              <span
                className="color-success"
                style={{ color: openNow ? "#fff" : "#358804" }}
              >
                <ScheduleIcon />
                {t("open_now")}
              </span>
            </div>
            {/* <div
              className="btn-checkbox active-color-secondary"
              onClick={}
            >
              <label>
                <input type="checkbox" value="1" />
                <span className="color-success">
                  <RefreshIcon />
                  {t("Reset All")}
                </span>
              </label>
            </div> */}
          </div>
          <div
            className="btn btn-gradient btn-gradient-two btn-block btn-icon icon-right m-top-40"
            onClick={handleFilterAll}
          >
            {t("serach_filter")}{" "}
            <span className="la la-long-arrow-right"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
