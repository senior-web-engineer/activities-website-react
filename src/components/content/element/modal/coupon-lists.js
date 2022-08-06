import { newDate } from "lib/dateLib";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FontAwesome from "react-fontawesome";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import * as Actions from "../../../../Store/action/bankAction";
import startImg from "../../.../../../../assets/img/starred.svg";
import toastr from "toastr";

export default function CouponLists(props) {
  const dispatch = useDispatch();
  const couponData = useSelector((state) => state.bank.couponLists);
  const [couponList, setCouponList] = useState(null);
  const [addFlag, setAddFlag] = useState(false);
  const [code, setCode] = useState("");
  const [fixedValue, setFixedValue] = useState("");
  const [perValue, setPerValue] = useState("");
  const [availability, setAvailability] = useState("");
  const [limitDate, setLimitDate] = useState(moment().format("YYYY-MM-DD"));
  const [type, setType] = useState("per");

  useEffect(() => {
    dispatch(Actions.getCouponLists(props.id));
    //eslint-disable-next-line
  }, [props.id]);

  useEffect(() => {
    setCouponList(couponData);
  }, [couponData]);

  const handleDeleteCoupon = (id) => {
    dispatch(Actions.deleteCoupon(id)).then((res) => {
      props.onClose(false);
      const data = couponData;
      const index = couponData.findIndex((coupon) => coupon.id === id);
      setCouponList([
        ...data.slice(0, index),
        ...data.slice(index + 1, data.length),
      ]);
    });
  };

  const addCoupon = () => {
    if (perValue === "" && fixedValue === "") {
      toastr.info("You must insert coupon value");
      return false;
    }
    if (code === "" || availability === "") {
      toastr.info("Please check all field!");
      return false;
    }
    dispatch(
      Actions.addCouponInfo(
        perValue,
        fixedValue,
        code,
        availability,
        limitDate,
        props.id
      )
    ).then((res) => {
      if (res.type) {
        toastr.success("Coupon added");
        setAddFlag(false);
      } else {
        toastr.warning(res.msg);
      }
    });
  };
  return (
    <div>
      <Dialog open={props.flag} maxWidth="lg">
        <DialogTitle className="calendar-title">
          Coupons
          <div
            className="top-cross-boost"
            onClick={(e) => {
              setAddFlag(false);
              props.onClose(false);
            }}
          >
            <FontAwesome name="times" id="top-close" />
          </div>
        </DialogTitle>
        {!addFlag ? (
          <DialogContent>
            {couponList && couponList.length > 0 ? (
              couponList.map((item, key) => {
                return (
                  <div
                    className={
                      item.limit_date.seconds < moment().unix()
                        ? "coupon-card d-flex bg-danger p-2 rounded mb-2"
                        : item.used >= item.availability
                        ? "coupon-card d-flex bg-success p-2 rounded mb-2"
                        : item.status === "1"
                        ? "coupon-card d-flex bg-white p-2 rounded mb-2 active"
                        : item.status === "0"
                        ? "coupon-card d-flex bg-warning p-2 rounded mb-2"
                        : ""
                    }
                    key={key}
                  >
                    <div className="d-flex flex-column justify-content-center px-2">
                      <img src={startImg} alt="" />
                      {item.limit_date.seconds < moment().unix() ? (
                        <small>Expired</small>
                      ) : item.used >= item.availability ? (
                        <small>Complete</small>
                      ) : item.status === "1" ? (
                        <small>Active</small>
                      ) : item.status === "0" ? (
                        <small>InActive</small>
                      ) : null}
                    </div>
                    <div
                      className="d-flex flex-column"
                      style={{ width: "300px" }}
                    >
                      <div className="d-flex justify-content-between font-weight-bold mb-2">
                        <span>{item.code}</span>
                        <span>Used: {item.used}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <small>
                          Date limit:{" "}
                          {newDate(
                            item.limit_date.seconds * 1000
                          ).toDateString()}
                        </small>
                        <small>Availity: {item.availability}</small>
                      </div>
                      <div className="d-flex justify-content-center font-weight-bold">
                        {item.percentage === null
                          ? "Fixed Value: $"
                          : "Percentage: "}{" "}
                        {item.percentage === null
                          ? item.discount.toFixed(2)
                          : item.percentage.toFixed(2)}{" "}
                        %
                      </div>
                    </div>
                    <div
                      className="d-flex align-items-start justify-content-end px-2 pointer"
                      onClick={(e) => handleDeleteCoupon(item.id)}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-3">There is no Coupons in this Camp!</p>
            )}
            <div className="featured-card-list">
              <button
                className="boost-btn-pay"
                onClick={(e) => setAddFlag(true)}
              >
                Add Coupon
              </button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="add-coupon">
            <img src="" alt="" />
            <p>Add discount coupons to your events and make promotions.</p>
            <p>They can have fixed or percentage values.</p>
            <p>
              They can oly be used in this Camp until the stock is valid and
              before the expiration date.
            </p>
            <div className="d-flex justify-content-between">
              <FormControlLabel
                checked={type === "per" ? true : false}
                label="Percentage"
                onChange={(e) => setType("per")}
                control={<Radio color="primary" />}
              />
              {type === "per" && (
                <input
                  type="text"
                  placeholder="%"
                  value={perValue}
                  onChange={(e) => setPerValue(e.target.value)}
                />
              )}
            </div>
            <div className="d-flex justify-content-between">
              <FormControlLabel
                checked={type === "fixed" ? true : false}
                label="Fixed&nbsp;Value"
                onChange={(e) => setType("fixed")}
                control={<Radio color="primary" />}
              />
              {type === "fixed" && (
                <input
                  type="text"
                  value={fixedValue}
                  placeholder="$"
                  onChange={(e) => setFixedValue(e.target.value)}
                />
              )}
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Availability"
              />
            </div>
            <div className="mb-2">
              <input
                type="date"
                value={limitDate}
                onChange={(e) => setLimitDate(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <button onClick={addCoupon}>Save New</button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
