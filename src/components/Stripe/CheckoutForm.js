import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toastr from "toastr";
import { makeStyles } from "@material-ui/core";
import { Button } from "@material-ui/core";
import $ from "jquery";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import * as Actions from "../../Store/action/widget";

const useStyles = makeStyles((theme) => ({
  hasMarginY: {
    margin: theme.spacing(0, 0),
  },
}));

const useOptions = () => {
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "18px",
          color: "#424770",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    []
  );
  return options;
};

const CheckoutForm = (props) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  let elements = useElements();
  const options = useOptions();
  const classes = useStyles();
  const [completed, setCompleted] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });
    if (payload.paymentMethod) {
      dispatch(Actions.setPaymentMethod(payload));
    } else {
      toastr.warning("Oops! Failed creae payment method.");
    }
    $("#add-card").removeClass("is-visible");
    $("body").removeClass("modal-open");
    elements.getElement(CardNumberElement).clear();
    elements.getElement(CardCvcElement).clear();
    elements.getElement(CardExpiryElement).clear();
  };

  const handleClose = () => {
    $("#add-card").removeClass("is-visible");
    $("body").removeClass("modal-open");
    elements.getElement(CardNumberElement).clear();
    elements.getElement(CardCvcElement).clear();
    elements.getElement(CardExpiryElement).clear();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <label>Card number :</label>
          <CardNumberElement
            options={options}
            onChange={(event) => {
              setCompleted({ ...completed, ...{ number: event.complete } });
            }}
          />
        </div>
        <div className="col-md-7 mt-10">
          <label>Expiration date :</label>
          <CardExpiryElement
            options={options}
            onChange={(event) => {
              setCompleted({ ...completed, ...{ exp: event.complete } });
            }}
          />
        </div>
        <div className="col-md-5 mt-10">
          <label>CVC :</label>
          <CardCvcElement
            options={options}
            onChange={(event) => {
              setCompleted({ ...completed, ...{ cvc: event.complete } });
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="add-card-button">
            <Button
              type="submit"
              disabled={
                !stripe || !(completed.number && completed.exp && completed.cvc)
              }
              variant="contained"
              color="primary"
              fullWidth
              className={classes.hasMarginY}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="add-card-button">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.hasMarginY}
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
