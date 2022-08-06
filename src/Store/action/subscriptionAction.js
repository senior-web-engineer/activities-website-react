import { db } from "../../services/firebase";
import axios from "axios";
import toastr from "toastr";
let customerId, priceId, stripe;

const handlePaymentThatRequiresCustomerAction = (
  subscription,
  invoice,
  priceId,
  paymentMethodId,
  isRetry
) => {
  if (subscription && subscription.status === "active") {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  }
  const paymentIntent = invoice
    ? invoice.payment_intent
    : subscription.latest_invoice.payment_intent;
  if (
    paymentIntent.status === "requires_action" ||
    (isRetry === true && paymentIntent.status === "requires_payment_method")
  ) {
    return stripe
      .confirmCardPayment(paymentIntent.client_secret, {
        payment_method: paymentMethodId,
      })
      .then((result) => {
        if (result.error) {
          // start code flow to handle updating the payment details
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc)
          throw result;
        } else {
          if (result.paymentIntent.status === "succeeded") {
            // There's a risk of the customer closing the window before callback
            // execution. To handle this case, set up a webhook endpoint and
            // listen to invoice.payment_succeeded. This webhook endpoint
            // returns an Invoice.
            return {
              priceId: priceId,
              subscription: subscription,
              invoice: invoice,
              paymentMethodId: paymentMethodId,
            };
          }
        }
      });
  } else {
    // No customer action needed
    return { subscription, priceId, paymentMethodId };
  }
};

const handleRequiresPaymentMethod = (
  subscription,
  paymentMethodId,
  priceId
) => {
  if (subscription.status === "active") {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  } else if (
    subscription.latest_invoice.payment_intent.status ===
    "requires_payment_method"
  ) {
    // Using localStorage to store the state of the retry here
    // (feel free to replace with what you prefer)
    // Store the latest invoice ID and status
    localStorage.setItem("latestInvoiceId", subscription.latest_invoice.id);
    localStorage.setItem(
      "latestInvoicePaymentIntentStatus",
      subscription.latest_invoice.payment_intent.status
    );
    throw new Error("Your card was declined.");
  } else {
    return { subscription, priceId, paymentMethodId };
  }
};

const retryInvoiceWithNewPaymentMethod = async ({
  paymentMethodId,
  invoiceId,
}) => {
  await axios
    .post(`api/retry-invoice`, {
      customerId: customerId,
      paymentMethodId: paymentMethodId,
      invoiceId: invoiceId,
    })
    .then((result) => {
      return {
        // Use the Stripe 'object' property on the
        // returned result to understand what object is returned.
        invoice: result,
        paymentMethodId: paymentMethodId,
        priceId: priceId,
        isRetry: true,
      };
    })
    .then(handlePaymentThatRequiresCustomerAction)
    .then(onSubscriptionComplete)
    .catch((error) => {
      console.log(error);
      toastr.warning(error.message);
    });
};

const onSubscriptionComplete = async (result) => {
  if (result && !result.subscription) {
    const subscription = { id: result.invoice.subscription };
    result.subscription = subscription;
    localStorage.clear();
  }
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userDataDoc = await db.collection("advertiser").doc(user.id).get();
  const userData = userDataDoc.data();
  const subDoc = await db
    .collection("ad_subscription")
    .where("plan_name", "==", priceId)
    .get();
  const subscriptionData = subDoc.docs.map((doc) => doc.data());
  userData["subscription_plan"] = subscriptionData[0].id;
  userData["fee_group"] = "standard plan";
  userData["advertiser_fee_id"] = "GXKqhpvOadHmS6Gmim6I";
  await db.collection("advertiser").doc(user.id).set(userData);
  toastr.success("Set subscription successfully!");
};

const createSubscription = async (paymentMethodId) => {
  await axios
    .post(`/api/create-subscription`, {
      customerId: customerId,
      paymentMethodId: paymentMethodId,
      priceId: priceId.toUpperCase(),
    })
    .then((result) => {
      return {
        subscription: result.data,
        paymentMethodId: paymentMethodId,
        priceId: priceId.toUpperCase(),
      };
    })
    .then(handlePaymentThatRequiresCustomerAction)
    .then(handleRequiresPaymentMethod)
    .then(onSubscriptionComplete)
    .catch((error) => {
      toastr.warning(error.message);
    });
};

export const setSubscription = (type, customer, cardId, stripeInfo) => async (
  dispatch
) => {
  stripe = stripeInfo;
  priceId = type;
  customerId = customer;

  const latestInvoicePaymentIntentStatus = localStorage.getItem(
    "latestInvoicePaymentIntentStatus"
  );
  if (latestInvoicePaymentIntentStatus === "requires_payment_method") {
    // Update the payment method and retry invoice payment
    const invoiceId = localStorage.getItem("latestInvoiceId");
    retryInvoiceWithNewPaymentMethod({
      paymentMethodId: cardId,
      invoiceId: invoiceId,
    });
    return;
  }
  // Create the subscription
  createSubscription({
    paymentMethodId: cardId,
  });
};
