import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// const stripePromise = loadStripe("pk_test_iapJ0WOQZWhT8vPUUrscmAz600DloNSONq");
const stripePromise = loadStripe("pk_live_WSMUr0n7KNhYEZAwaWBoWx5C00OGwZKnMS");
// p2wuqGbKNpMsGjrewnWt;
const StripeElement = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};
export default StripeElement;
