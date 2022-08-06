import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import activityImg from "../../../../assets/img/1.png";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import * as Actions from "../../../../Store/action/dashboardAction";
import moment from "moment";
import ReportModal from "../modal/reportModal";
import { MultiLang } from "../widget";
import { useTranslation } from "react-i18next";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "20px",
  },
}));

function Review() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [selReview, setSelReview] = React.useState(null);
  const reviews = useSelector((state) => state.dashboard.reviewsData);
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(Actions.getReviews());
  }, [dispatch]);

  return (
    <div
      style={{
        borderRadius: "20px",
        boxShadow:
          "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
      }}
    >
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label={t("most_reviews")} {...a11yProps(0)} />
            <Tab label={t("all_reviews")} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <div className="p-bottom-10">
            {reviews.length > 0 &&
              reviews.slice(0, 3).map((item, key) => {
                return (
                  <div key={key}>
                    <div className="review-card">
                      <div className="activity-image">
                        <img src={item.image[0] ?? activityImg} alt="" />
                      </div>
                      <div className="review-content p-left-15 w-100">
                        <div className="d-flex justify-content-between">
                          <Rating
                            name="customized-empty"
                            className="review-rating"
                            value={parseFloat(item.rating)}
                            precision={0.5}
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            readOnly
                          />
                          <p className="review-date m-0">
                            {moment(item.date.seconds * 1000).format(
                              "MM/DD/YYYY HH:MM"
                            )}
                          </p>
                        </div>
                        <p className="review-comment">{item.review}</p>
                        <p
                          className="reply pointer m-0"
                          style={{ color: "#afdb30" }}
                          onClick={() => {
                            setOpen(true);
                            setSelReview(item);
                          }}
                        >
                          <span className="la la-mail-reply-all"></span>
                          <MultiLang text="report" />
                        </p>
                      </div>
                    </div>
                    <hr className="m-0 p-left-15"></hr>
                  </div>
                );
              })}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {reviews.length > 0 &&
            reviews.slice(0, 6).map((item, key) => {
              return (
                <div key={key}>
                  <div className="review-card">
                    <div className="activity-image">
                      <img src={item.image[0] ?? activityImg} alt="" />
                    </div>
                    <div className="review-content p-left-15 w-100">
                      <div className="d-flex justify-content-between">
                        <Rating
                          name="customized-empty"
                          className="review-rating"
                          value={parseFloat(item.rating)}
                          precision={0.5}
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          readOnly
                        />
                        <p className="review-date m-0">
                          {moment(item.date.seconds * 1000).format(
                            "MM/DD/YYYY HH:MM"
                          )}
                        </p>
                      </div>
                      <p className="review-comment">{item.review}</p>
                      <p
                        className="reply pointer m-0"
                        style={{ color: "#afdb30" }}
                        onClick={() => {
                          setOpen(true);
                          setSelReview(item);
                        }}
                      >
                        <span className="la la-mail-reply-all"></span>Report
                      </p>
                    </div>
                  </div>
                  <hr className="m-0 p-left-15"></hr>
                </div>
              );
            })}
        </TabPanel>
      </div>
      <ReportModal
        open={open}
        onClose={() => setOpen(false)}
        reviewData={selReview}
      />
    </div>
  );
}
export default Review;
