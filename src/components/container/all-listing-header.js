import { ClickAwayListener, Collapse, Paper } from "@material-ui/core";
// import FilterListIcon from "@material-ui/icons/FilterList";
import SortIcon from "@material-ui/icons/Sort";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AllListingHeader({
  count = 0,
  headerType = false,
  handleChangeHeaderType = console.log,
  handleSorting = console.log(),
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  // const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="atbd_generic_header" id="listing-title">
      <div className="atbd_generic_header_title">
        <h4>{t("all_items")}</h4>
        <p>{Boolean(count) ? `${t("total_listing_find")} : ${count}` : ""}</p>
      </div>
      <div className="atbd_listing_action_btn btn-toolbar" role="toolbar">
        <div className="view-mode">
          <div
            className={`action-btn ${!headerType && "active"} pointer`}
            to="all-listings-grid"
            onClick={(e) => {
              sessionStorage.removeItem("searchData");
              handleChangeHeaderType(false);
            }}
          >
            <span className="la la-th-large"></span>
          </div>
          <div
            className={`action-btn pointer ${headerType && "active"}`}
            to="all-listings-list"
            onClick={() => handleChangeHeaderType(true)}
          >
            <span className="la la-list"></span>
          </div>
        </div>
        {/* <button className="mobile-filter">
          <FilterListIcon />
        </button> */}
        <div className="position-relative">
          <button
            className="sortby-btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            <SortIcon />
          </button>
          {open && (
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Collapse in={open}>
                <Paper className="sortby-content">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      handleSorting("a-z");
                      setOpen(false);
                    }}
                  >
                    {t("a_z")}
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      handleSorting("z-a");
                      setOpen(false);
                    }}
                  >
                    {t("z_a")}
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      handleSorting("low");
                      setOpen(false);
                    }}
                  >
                    {t("price_low_hight")}
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      handleSorting("high");
                      setOpen(false);
                    }}
                  >
                    {t("price_high_low")}
                  </div>
                </Paper>
              </Collapse>
            </ClickAwayListener>
          )}
        </div>
        {/* <div className="dropdown pointer">
          <div
            className="action-btn dropdown-toggle"
            href=" "
            role="button"
            id="dropdownMenuLink2"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {t("sort_by")} <span className="caret"></span>
          </div>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
            <div className="dropdown-item" onClick={() => handleSorting("a-z")}>
              {t("a_z")}
            </div>
            <div className="dropdown-item" onClick={() => handleSorting("z-a")}>
              {t("z_a")}
            </div>
            <div className="dropdown-item" onClick={() => handleSorting("low")}>
              {t("price_low_hight")}
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleSorting("high")}
            >
              {t("price_high_low")}
            </div>
          </div>
        </div> */}
      </div>
      {/* <MobileFilter open={mobileOpen} onClose={() => setMobileOpen(false)} /> */}
    </div>
  );
}
