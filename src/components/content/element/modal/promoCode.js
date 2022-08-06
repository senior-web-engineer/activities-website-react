import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FontAwesome from "react-fontawesome";
import toastr from "toastr";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";

const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export default function PromoCode(props) {
  const [promoCodeList, setPromoCodeList] = useState([]);
  const [selCoupon, setSelCoupon] = useState("");
  useEffect(() => {
    setPromoCodeList(props.promoCodeList);
  }, [props]);

  const setCoupon = () => {
    if (selCoupon === "") {
      toastr.info("Select coupon code!");
      return false;
    }
    const selCouponInfo = promoCodeList.filter((item) => item.id === selCoupon);
    props.onSetCouponInfo(selCouponInfo);
    setSelCoupon("");
  };

  return (
    <div>
      <Dialog open={props.open} maxWidth="lg">
        <DialogTitle className="calendar-title">
          Coupons
          <div
            className="top-cross-boost"
            onClick={(e) => props.onClose(false)}
          >
            <FontAwesome name="times" id="top-close" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="d-flex flex-column" style={{ width: "300px" }}>
            {promoCodeList && promoCodeList.length > 0 ? (
              promoCodeList.map((item, key) => {
                return (
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={selCoupon}
                    onChange={(e) => setSelCoupon(e.target.value)}
                    key={key}
                  >
                    <FormControlLabel
                      value={item.id}
                      control={<GreenRadio />}
                      label={item.code}
                    />
                  </RadioGroup>
                );
              })
            ) : (
              <p className="p-3">There is no Coupons in this Camp!</p>
            )}
          </div>
          <div className="text-right">
            <button
              className="btn btn-xs btn-gradient btn-gradient-two"
              onClick={setCoupon}
            >
              <FontAwesome name="send" />
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
