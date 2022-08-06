import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CheckIcon from "assets/img/check-icon.svg";
import { ReactSVG } from "react-svg";
import backgroundImg from "assets/img/businessPopup.jpg";
import { NavLink } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { MultiLang } from "components/content/element/widget";

const businessDescription = [
  "pop_desc1",
  "pop_desc2",
  "pop_desc3",
  "pop_desc4",
  "pop_desc5",
  "pop_desc6",
];

const styles = {
  backgroundImg: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    opacity: 0.3,
  },
  objectFit: {
    objectFit: "cover",
  },
};

export default function AllPagePopup({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <div className="popup-content">
        <div className="close-popup" onClick={onClose}>
          <CloseIcon />
        </div>
        <div style={styles.backgroundImg}>
          <img
            src={backgroundImg}
            className="w-100 h-100"
            style={styles.objectFit}
            alt="allpopup background"
          />
        </div>
        <div className="position-relative" style={{ zIndex: 1 }}>
          <h1 className="title">
            <MultiLang text="pop_let_s" />
            <span style={{ color: "#afdb30" }}>
              <MultiLang text="pop_build" />
            </span>{" "}
            <MultiLang text="pop_your_business" />
          </h1>
          {businessDescription.map((item, index) => (
            <div className="d-flex align-items-center" key={index}>
              <div className="m-right-20 d-flex align-items-center">
                <ReactSVG src={CheckIcon ?? ""} alt="business popup" />
              </div>
              <p className="description">
                <MultiLang text={item} />
              </p>
            </div>
          ))}
          <NavLink
            to="/grow-activity"
            className="d-flex justify-content-center"
          >
            <button className="link-button">
              <MultiLang text="pop_list_btn" />
            </button>
          </NavLink>
        </div>
      </div>
    </Dialog>
  );
}
