import { newDate } from "lib/dateLib";
import firebase, { db } from "../../services/firebase";
import toastr from "toastr";
import moment from "moment";
import { getPriceOfCurrency, setPageLoading } from "./appAction";
export const addBankInfo =
  (name, rountingNum, accountNum) => async (dispatch) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      await db.collection("advertiser_bank_accounts").add({
        account_number: accountNum,
        advertiser_id: user.id,
        name_of_account: name,
        routing_number: rountingNum,
      });
      toastr.success("Creating bank account successfully");
    } catch (error) {
      toastr.warning(error.message);
    }
  };

export const getBankAccount = async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  await db
    .collection("advertiser_bank_accounts")
    .where("advertiser_id", "==", user.id)
    .onSnapshot((res) => {
      const bankInfo = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      dispatch({ type: "SET_BANK_INFO", payload: bankInfo });
    });
};
export const deleteBankAccount = (id) => async (dispatch) => {
  await db.collection("advertiser_bank_accounts").doc(id).delete();
  toastr.success("Delete bank account successfully");
};

export const getTotalBookingPay =
  (listingId = "", userCurrency) =>
  async (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    await db
      .collection("booking")
      .where("status", "==", "0")
      .where("advertiser_id", "==", user.id)
      .where("ad_id", "==", listingId)
      .onSnapshot(async (querySnapshot) => {
        if (!querySnapshot.empty) {
          let total = 0,
            withdrawedMoney;
          const bookingData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          await Promise.all(
            bookingData.map(async (item) => {
              const transactionDoc = await db
                .collection("user_payment_transaction")
                .doc(item.transaction_id)
                .get();
              if (transactionDoc.exists) {
                const transactionData = transactionDoc.data();
                if (transactionData.status === "succeeded") {
                  const displayPrice = await getPriceOfCurrency(
                    transactionData.currency,
                    userCurrency,
                    item.price
                  );
                  // total += item.price * (1 - item.fee / 100);
                  total += displayPrice * (1 - item.fee / 100);
                }
              }
            })
          );
          await db
            .collection("advertiser_withdraw")
            .where("advertiser_id", "==", user.id)
            .where("ad_listing_id", "==", listingId)
            .onSnapshot(async (withdoc) => {
              withdrawedMoney = 0;
              if (!withdoc.empty) {
                const withdrawedData = withdoc.docs.map((doc) => doc.data());
                withdrawedData.forEach((item) => {
                  if (item.status === "2") {
                    total = total + Number(item.amount);
                  } else {
                    withdrawedMoney += Number(item.amount);
                  }
                });
              }
              total = total - withdrawedMoney;
              dispatch({ type: "SET_TOTAL_MONEY", payload: total.toFixed(2) });
              await db
                .collection("advertiser")
                .doc(user.id)
                .update({ site_credit: total });
              user["site_credit"] = total;
              sessionStorage.setItem("user", JSON.stringify(user));
              setPageLoading(dispatch, false);
            });
        }
      });
  };

export const advertiserWithdraw = (id, amount) => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const bankInfoDoc = await db
    .collection("advertiser_bank_accounts")
    .doc(id)
    .get();
  const bankInfo = bankInfoDoc.data();
  //transaction id and date type modified
  if (Object.entries(bankInfo).length > 0) {
    const withdrawInfo = {
      advertiser_id: user.id,
      amount: Number(amount),
      advertiser_bank_accounts_id: id,
      name_of_account: bankInfo.name_of_account,
      date: moment().format("ddd, MM/DD/YYYY hh:mm:ss A"),
      id: "",
      refuse_reason: "",
      status: "1",
      transaction_id: "",
      routing_number: bankInfo.routing_number,
      account_number: bankInfo.account_number,
    };
    const docRef = await db.collection("advertiser_withdraw").add(withdrawInfo);
    await db
      .collection("advertiser_withdraw")
      .doc(docRef.id)
      .update({ id: docRef.id });
    toastr.success(
      "The withdraw request is delivered successfully to the admin"
    );
  } else {
    toastr.info("You bank account is not correct!");
  }
};

export const getCouponLists = (id) => async (dispatch) => {
  try {
    await db
      .collection("coupon")
      .where("ad_listing_id", "==", id)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
        } else {
          const couponLists = querySnapshot.docs.map((doc) => doc.data());
          dispatch({ type: "GET_COUPON_LIST", payload: couponLists });
        }
      });
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const addCouponInfo =
  (perValue, fixedValue, code, availability, limitDate, id) =>
  async (dispatch) => {
    let returnValue = {};
    try {
      const ref = await db.collection("coupon").add({
        ad_listing_id: id,
        availability: parseInt(availability),
        code: code,
        discount: fixedValue === "" ? null : parseInt(fixedValue),
        limit_date: newDate(limitDate),
        percentage: perValue === "" ? null : parseInt(perValue),
        status: "0",
        type_coupon: "advertiser",
        used: 0,
        id: "",
      });
      await db.collection("coupon").doc(ref.id).update({ id: ref.id });
      returnValue = { msg: "sucess", type: true };
    } catch (error) {
      returnValue = { msg: error.message, type: false };
    }
    return returnValue;
  };

export const deleteCoupon = (id) => async (dispatch) => {
  try {
    await db.collection("coupon").doc(id).delete();
    toastr.success("Coupon deleted!");
  } catch (error) {
    toastr.warning(error.message);
  }
  return;
};

export const setCouponInfo =
  (type, couponData, bookingData) => async (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let newBookingData = [];
    if (type === "advertiser") {
      await Promise.all(
        bookingData.map(async (item) => {
          if (item.listingData.listing_id === couponData[0].ad_listing_id) {
            if (couponData[0].discount) {
              item["price_paid"] = item.price - couponData[0].discount;
            } else if (couponData[0].percentage) {
              item["price_paid"] =
                item.price -
                Number((item.price * couponData[0].percentage) / 100).toFixed(
                  2
                );
            }
            item["coupon_code"] = couponData[0].id;
            if (user) {
              await db.collection("booking").doc(item.id).update({
                price_paid: item["price_paid"],
                coupon_code: couponData[0].id,
              });
            }
          } else if (item.coupon_code !== "") {
            const couponDoc = await db
              .collection("coupon")
              .doc(item.coupon_code)
              .get();
            if (couponDoc.data().type_coupon === "admin") {
              item["coupon_code"] = "";
              delete item.price_paid;
              await db.collection("booking").doc(item.id).update({
                price_paid: firebase.firestore.FieldValue.delete(),
                coupon_code: "",
              });
            }
          }
          newBookingData.push(item);
        })
      );
      dispatch({ type: "GET_CART_INFO", payload: newBookingData });
    } else if (type === "admin") {
      let totalAmount = 0;
      bookingData.forEach((item) => {
        totalAmount += item.price;
      });
      await Promise.all(
        bookingData.map(async (item) => {
          if (couponData[0].discount) {
            item["price_paid"] =
              item.price -
              (parseFloat(couponData[0].discount) / totalAmount) * item.price;
          } else if (couponData[0].percentage) {
            item["price_paid"] =
              item.price -
              (parseFloat(item.price) * couponData[0].percentage) / 100;
          }
          item["coupon_code"] = couponData[0].id;
          if (user) {
            await db.collection("booking").doc(item.id).update({
              price_paid: item["price_paid"],
              coupon_code: couponData[0].id,
            });
          }
          newBookingData.push(item);
        })
      );
    }
    sessionStorage.setItem("bookingData", JSON.stringify(newBookingData));
    window.location.href = "/checkout";
  };
