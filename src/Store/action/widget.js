import { newDate } from "lib/dateLib";
import axios from "axios";
import moment from "moment";
import publicIp from "public-ip";
import toastr from "toastr";

import firebase, { db } from "../../services/firebase";
import {
  getPriceOfCurrency,
  setGeneralLoading,
  setPageLoading,
} from "./appAction";

export const setChatRooms = (data, path, id) => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const res = await db.collection("chat").where("type", "==", "private").get();
  const chatData = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  const checkData = chatData.filter(
    (item) => item.users_occupants[0] === user.id && id === item.activity_id
  );
  if (checkData.length === 0) {
    const res = await db.collection("chat").add({
      activity_id: data.listing_id,
      advertiser_id: id,
      advertise_title: data.title,
      advertiser_image_url: data.img.length === 0 ? "" : data.img[0],
      created_at: newDate().toISOString(),
      last_message: "",
      last_message_at: newDate().toISOString(),
      last_message_read_at: 0,
      type: "private",
      user_name: user.name,
      user_image_url: user.profile_picture,
      users_occupants: [user.id],
    });
    sessionStorage.setItem("chatRoomId", JSON.stringify(res.id));
  } else {
    sessionStorage.setItem("chatRoomId", JSON.stringify(checkData[0].id));
  }
  path.push("/chat");
};

export const setCartInfo = (data) => async (dispatch) => {
  let imageUrl = "";
  const user = JSON.parse(sessionStorage.getItem("user"));
  let ip = "91.218.96.148";
  const ipRes = await publicIp.v4();
  const flag = ipRes.includes("188.43");
  if (!flag) {
    ip = ipRes;
  }
  const advertiserDoc = await db
    .collection("advertiser")
    .doc(data.listingData.advertiser_id)
    .get();
  const advertiserInfo = advertiserDoc.data();
  let bookingFee = 12.9;
  const now = moment().unix();
  if (advertiserInfo.booking_fees_id) {
    if (advertiserInfo.booking_fees_limit_date.seconds > now) {
      const bookingFeeDoc = await db
        .collection("booking_fees")
        .doc(advertiserInfo.booking_fees_id)
        .get();
      bookingFee = bookingFeeDoc.data().fees;
    }
  }
  // if (
  //   advertiserInfo.fee_group === "" &&
  //   advertiserInfo.advertiser_fee_id !== ""
  // ) {
  //   bookingFee = 6.6;
  // }
  // if (advertiserInfo.fee_group === "standard plan") {
  //   bookingFee = 9.9;
  // }
  const insurance_file =
    advertiserInfo.insurance_file === undefined
      ? ""
      : advertiserInfo.insurance_file;
  const element = {
    ad_id: data.listingData.listing_id,
    address: data.address,
    price: data.price,
    fee: bookingFee,
    insurance_file: insurance_file,
    advertiser_id: data.listingData.advertiser_id,
    cancel_transaction_id: "",
    child_allergy: data.child_allergy,
    child_dob: moment(data.child_dob).format("MM/DD/YYYY"),
    child_gender: data.child_gender,
    child_medication: data.child_medication,
    child_name: data.child_name,
    coupon_code: "",
    ip: ip,
    extra_session_id:
      data.extra_session_id === "main" ? "" : data.extra_session_id,
    extra_session_title: data.extra_session_title,
    emergency_contact_number_1: data.emergency_contact_number_1,
    emergency_contact_number_2: data.emergency_contact_number_2,
    option_field1_title: data.option_field1_title,
    option_field2_title: data.option_field2_title,
    guardians: data.guardians,
    qr_code: "",
    status: "1",
    child_image: imageUrl,
    surname: data.surname,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    transaction_id: "",
    user_id: user.id,
    date: moment().format("MM/DD/YYYY"),
  };
  const checkDoc = await db
    .collection("booking")
    .where("ad_id", "==", data.listingData.listing_id)
    .where("user_id", "==", user.id)
    .where("status", "==", "1")
    .get();
  const checkData = checkDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  if (checkData.length > 0) {
    await db.collection("booking").doc(checkData[0].id).set(element);
  } else {
    await db.collection("booking").add(element);
  }
};

export const getCartInfo =
  (userCurrency = "USD") =>
  async (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    await db
      .collection("booking")
      .where("user_id", "==", user.id)
      .where("status", "==", "1")
      .onSnapshot(async (res) => {
        let cartData = res.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        }));
        if (cartData.length > 0) {
          await Promise.all(
            cartData.map(async (item, key) => {
              let price = 0;
              const doc = await db
                .collection("ad_listing")
                .doc(item.ad_id)
                .get();
              price = doc.data().price;
              if (Boolean(item?.extra_session_id)) {
                const extraActivityDoc = await db
                  .collection("ad_listing")
                  .doc(item?.ad_id)
                  .collection("sessions")
                  .doc(item?.extra_session_id)
                  .get();
                if (extraActivityDoc.exists) {
                  price = extraActivityDoc.data().price;
                }
              }
              const listingData = doc.data();
              const sessionsDoc = await db
                .collection("ad_listing")
                .doc(item.ad_id)
                .collection("sessions")
                .get();
              if (
                listingData.address !== undefined &&
                listingData.address !== ""
              ) {
                listingData["address"] =
                  listingData.address.street +
                  ", " +
                  listingData.address.city +
                  ", " +
                  listingData.address.state +
                  ", " +
                  listingData.address.country;
              }
              let sessions = sessionsDoc.docs.map((item) => ({
                ...item.data(),
                id: item.id,
              }));
              if (sessions.length > 0) {
                sessions = sessions.map((item) => {
                  item["start_date"] = moment(
                    item.start_date.seconds * 1000
                  ).format("MM/DD/YYYY");
                  item["end_date"] = moment(
                    item.end_date.seconds * 1000
                  ).format("MM/DD/YYYY");
                  return item;
                });
              }
              let couponType = "";
              if (item.coupon_code !== "") {
                const couponDoc = await db
                  .collection("coupon")
                  .doc(item.coupon_code)
                  .get();
                couponType = couponDoc.data().type_coupon;
              }
              const couponCodeDoc = await db
                .collection("coupon")
                .where("ad_listing_id", "==", item.ad_id)
                .where("type_coupon", "==", "advertiser")
                .where("status", "==", "1")
                .get();
              let couponList = [];
              if (!couponCodeDoc.empty) {
                const dbCouponList = couponCodeDoc.docs.map((doc) => ({
                  ...doc.data(),
                  id: doc.id,
                }));
                dbCouponList.forEach((item) => {
                  if (
                    item.limit_date.seconds > moment().unix() &&
                    item.used !== item.availability
                  ) {
                    couponList = [...couponList, item];
                  }
                });
              }
              const displayPrice = await getPriceOfCurrency(
                listingData?.price_currency,
                userCurrency,
                listingData.price
              );
              const adverDoc = await db
                .collection("advertiser")
                .doc(listingData.advertiser_id)
                .get();
              const adver_name = adverDoc.data().name;
              const element = {
                category: listingData.category_name,
                img: listingData.picture,
                title: listingData.ad_title,
                price: listingData.price,
                advertiser_id: listingData.advertiser_id,
                author: adver_name,
                location: listingData.address,
                couponList: couponList,
                couponType: couponType,
                listing_id: listingData.id,
                remaing_availability: listingData.remaing_availability,
                start_time: listingData.start_time,
                end_time: listingData.end_time,
                extraSessions: sessions,
                camp_type: listingData.camp_type,
                start_date: moment(
                  listingData.start_date.seconds * 1000
                ).format("MM/DD/YYYY"),
                end_date: moment(listingData.end_date.seconds * 1000).format(
                  "MM/DD/YYYY"
                ),
              };
              // if (cartData[key].discount !== undefined) {
              //   delete cartData[key].discount;
              // }
              // if (cartData[key].used_coupon_id !== undefined) {
              //   delete cartData[key].used_coupon_id;
              // }
              cartData[key]["price"] = price;
              cartData[key]["listingData"] = element;
              cartData[key]["displayPrice"] = displayPrice;
              cartData[key]["priceCurrency"] = (
                listingData?.price_currency || "USD"
              ).toLowerCase();
              cartData[key].child_dob = moment(
                cartData[key]["child_dob"],
                "MM/DD/YYYY"
              ).format("YYYY-MM-DD");
            })
          );
        }
        dispatch({ type: "GET_CART_INFO", payload: cartData });
      });
  };

export const deleteCartInfo = (id) => async (dispatch) => {
  await db.collection("booking").doc(id).delete();
};
//payment information part
export const deletePaymentMethod = (id) => async (dispatch) => {
  try {
    const role = JSON.parse(sessionStorage.getItem("role"));
    const user = JSON.parse(sessionStorage.getItem("user"));
    await db
      .collection(
        role === "user" ? "user_payment_method" : "advertiser_payment_method"
      )
      .doc(id)
      .delete();
    toastr.success("Delete card successfully!");
    await axios
      .post(`/api/detachPaymentMethod`, {
        pm: id,
        email: user.email,
      })
      .then((response) => {})
      .catch((error) => {
        toastr.warning(error.message);
      });
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const setPaymentMethod = (data, history) => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    data.paymentMethod[role === "user" ? "user_id" : "advertiser_id"] = user.id;
    await axios
      .post(`/api/attachPaymentMethod`, {
        email: user.email,
        pm: data.paymentMethod.id,
      })
      .then(async (response) => {
        await db
          .collection(role === "user" ? "user" : "advertiser")
          .doc(user.id)
          .update({ stripe_id: response.data.customer });
        user["stripe_id"] = response.data.customer;
        sessionStorage.setItem("user", JSON.stringify(user));
      })
      .catch((error) => {
        toastr.warning(error.message);
      });
    await db
      .collection(
        role === "user" ? "user_payment_method" : "advertiser_payment_method"
      )
      .doc(data.paymentMethod.id)
      .set(data.paymentMethod);
    toastr.success("The card has been successfully registered!");
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getPaymentInfo = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    return false;
  }
  const role = JSON.parse(sessionStorage.getItem("role"));
  await db
    .collection(
      role === "user" ? "user_payment_method" : "advertiser_payment_method"
    )
    .onSnapshot((res) => {
      const payData = res.docs.map((doc) => doc.data());
      if (role === "user") {
        const filter = payData.filter((item) => item.user_id === user.id);
        dispatch({ type: "GET_PAYMENT_METHOD", payload: filter });
      } else {
        const filter = payData.filter((item) => item.advertiser_id === user.id);
        dispatch({ type: "GET_PAYMENT_METHOD", payload: filter });
      }
    });
};
//booking list crud part
export const bookingPay =
  (id, history, bookingData, adminCouponList) => async (dispatch) => {
    try {
      const increment = firebase.firestore.FieldValue.increment(-1);
      const user = JSON.parse(sessionStorage.getItem("user"));
      let paymentInfo = await axios.post(`/api/test`, {
        id,
        bookingData,
        email: user.email,
        adminCouponList: adminCouponList,
      });
      if (paymentInfo.status === 200) {
        console.log(paymentInfo.data, "paymentInfo");
        paymentInfo = paymentInfo.data.paymentIntent;
        await Promise.all(
          paymentInfo.map(async (item, index) => {
            item["user_id"] = user.id;
            item["application_booking_fees"] = bookingData[index].fee;
            item["advertiser_id"] = bookingData[index].advertiser_id;
            item["camp_name"] = bookingData[index].listingData.title;
            item["user_name"] = user.name;
            item["ad_listing_id"] = bookingData[index].listingData.listing_id;
            item["transaction_date"] = newDate();
            await db
              .collection("user_payment_transaction")
              .doc(item.id)
              .set(item);
            if (bookingData[index].extra_session_id === "") {
              await db
                .collection("ad_listing")
                .doc(bookingData[index].listingData.listing_id)
                .update({
                  remaing_availability: increment,
                });
            } else {
              await db
                .collection("ad_listing")
                .doc(bookingData[index].listingData.listing_id)
                .collection("sessions")
                .doc(bookingData[index].extra_session_id)
                .update({
                  remaing_availability: increment,
                });
            }
            //notification set part
            const res = await db.collection("advertiser_notification").add({
              advertiser_id: bookingData[index].advertiser_id,
              date: moment().format("MM/DD/YYYY"),
              icon: "Icons.notifications",
              booking_id: bookingData[index].id,
              id: "",
              is_read: "0",
              message:
                "Congrats!, You've got more booking " +
                bookingData[index].listingData.title,
            });
            await db
              .collection("advertiser_notification")
              .doc(res.id)
              .update({ id: res.id });
            const userres = await db.collection("user_notification").add({
              user_id: user.id,
              date: moment().format("MM/DD/YYYY"),
              booking_id: bookingData[index].id,
              icon: "Icons.notifications",
              id: "",
              is_read: "0",
              message:
                "Congrats!, Your seat is booked " +
                bookingData[index].listingData.title,
            });
            await db
              .collection("user_notification")
              .doc(userres.id)
              .update({ id: userres.id });
          })
        );
        const res = await db
          .collection("chat")
          .where("type", "==", "group")
          .get();
        const chatData = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const prviateRes = await db
          .collection("chat")
          .where("type", "==", "private")
          .get();
        const privateChatData = prviateRes.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        await Promise.all(
          bookingData.map(async (booking) => {
            const filter = chatData.filter(
              (item) => item.activity_id === booking.listingData.listing_id
            );
            if (filter.length > 0) {
              let userLists = filter[0].users_occupants;
              const userCheck = userLists.filter(
                (userId) => userId === user.id
              );
              if (userCheck.length === 0) {
                userLists = [...userLists, user.id];
                await db
                  .collection("chat")
                  .doc(filter[0].id)
                  .update({ users_occupants: userLists });
              }
            } else {
              const element = {
                activity_id: booking.listingData.listing_id,
                advertise_title: booking.listingData.title,
                advertiser_id: booking.advertiser_id,
                advertiser_image_url:
                  booking.listingData.img !== undefined ||
                  booking.listingData.img.length > 0
                    ? booking.listingData.img[0]
                    : "",
                created_at: newDate().toISOString(),
                last_message: "",
                last_message_at: newDate().toISOString(),
                type: "group",
                user_image_url: user.profile_picture,
                user_name: "",
                users_occupants: [user.id],
              };
              await db.collection("chat").add(element);
            }
            const privateFilter = privateChatData.filter(
              (item) =>
                item.activity_id === booking.listingData.listing_id &&
                item.users_occupants[0] === user.id
            );
            if (privateFilter.length === 0) {
              const element = {
                activity_id: booking.listingData.listing_id,
                advertise_title: booking.listingData.title,
                advertiser_id: booking.advertiser_id,
                advertiser_image_url:
                  booking.listingData.img !== undefined ||
                  booking.listingData.img.length > 0
                    ? booking.listingData.img[0]
                    : "",
                created_at: newDate().toISOString(),
                last_message: "",
                last_message_at: newDate().toISOString(),
                type: "private",
                user_image_url: user.profile_picture,
                user_name: user.name,
                users_occupants: [user.id],
              };
              await db.collection("chat").add(element);
            }
          })
        );
        sessionStorage.removeItem("bookingData");
        sessionStorage.removeItem("cartCnt");
        toastr.success("Booking was successful!");
        history.push("/thankyou");
      } else {
        console.log(paymentInfo);
      }
    } catch (error) {
      toastr.warning(error.message);
    }
  };

export const getBookingLists =
  (id, listingId = "", userCurrency) =>
  async (dispatch) => {
    await db
      .collection("booking")
      .where("advertiser_id", "==", id)
      .where("status", "==", "0")
      .where("ad_id", "==", listingId)
      .onSnapshot(async (querySnapshot) => {
        let bookingLists = [];
        if (!querySnapshot.empty) {
          const myBookingLists = querySnapshot.docs.map((doc) => doc.data());
          await Promise.all(
            myBookingLists.map(async (item) => {
              const transDoc = await db
                .collection("user_payment_transaction")
                .doc(item.transaction_id)
                .get();
              if (transDoc.exists) {
                const transData = transDoc.data();
                if (transData.status === "succeeded") {
                  const transactionStatus = "Paid-Card";
                  const date = newDate(transData.created * 1000).toDateString();
                  const displayPrice = await getPriceOfCurrency(
                    transData.currency,
                    userCurrency,
                    item.price
                  );
                  const withdrawInfo = {
                    amount: item.price,
                    displayPrice: displayPrice,
                    transactionStatus: transactionStatus,
                    date: date,
                    camp_name: transData.camp_name,
                    userName: transData.user_name ?? item.child_name,
                    transaction_id: transData.id,
                    ad_listingId: transData.ad_listing_id,
                    fee: Number(item.fee),
                    status: "4",
                  };
                  bookingLists = [...bookingLists, withdrawInfo];
                }
              }
            })
          );
        }
        await db
          .collection("advertiser_withdraw")
          .where("advertiser_id", "==", id)
          .where("ad_listing_id", "==", listingId)
          .onSnapshot((querySnapshot) => {
            const withdrawRequest = querySnapshot.docs.map((doc) => doc.data());
            dispatch({
              type: "MY_BOOKING_LISTS",
              payload: {
                transactionLogs: bookingLists,
                withdrawLogs: withdrawRequest,
              },
            });
          });
      });
    setGeneralLoading(dispatch, false);
  };

export const getBookingOrderList =
  (id, userCurrency = "USD") =>
  async (dispatch) => {
    const res = await db.collection("ad_listing").doc(id).get();
    if (res.exists) {
      const adData = res.data();
      const advertiser = JSON.parse(sessionStorage.getItem("user"));
      let bookingFee = "12.9";
      if (advertiser.fee_group === "" && advertiser.advertiser_fee_id !== "") {
        bookingFee = "6.6";
      }
      if (advertiser.fee_group === "standard plan") {
        bookingFee = "9.9";
      }
      await db
        .collection("booking")
        .where("ad_id", "==", id)
        .where("status", "==", "0")
        .onSnapshot(async (res) => {
          const bookingData = res.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          let orderList = [];
          const activityData = {
            picture: adData.picture,
            category_name: adData.category_name,
            title: adData.ad_title,
          };
          if (bookingData.length > 0) {
            await Promise.all(
              bookingData.map(async (item) => {
                const date = moment(item.timestamp.seconds * 1000).format(
                  "ddd, MM/DD/YYYY hh:mm:ss A"
                );
                let amount = item.price;
                if (
                  item.used_coupon_id !== undefined &&
                  item.discount !== undefined
                ) {
                  amount = item.price - item.discount;
                }
                const displayPrice = await getPriceOfCurrency(
                  item?.price_currency || "USD",
                  userCurrency,
                  amount
                );
                const element = {
                  bookingId: item.id,
                  picture: adData.picture,
                  title: adData.ad_title,
                  option1: adData.option_field1_title,
                  option2: adData.option_field2_title,
                  answer1: item.option_field1_title,
                  answer2: item.option_field2_title,
                  displayPrice: displayPrice,
                  displayNetPrice: (displayPrice * (100 - bookingFee)) / 100,
                  category_name: adData.category_name,
                  date: date,
                  fee: bookingFee,
                  userName: item.child_name + " " + item.surname,
                  paid: amount,
                  netAmount: (amount * (100 - bookingFee)) / 100,
                  ad_id: item.ad_id,
                  user_id: item.user_id,
                  // data: item,
                };
                orderList = [...orderList, element];
              })
            );
          }
          dispatch({
            type: "SET_ORDER_LIST",
            payload: { orderList, activityData },
          });
          setPageLoading(dispatch, false);
        });
    }
  };

export const getUsersInfo = async (ids = []) => {
  if (Boolean(ids?.length > 0)) {
    const users = await db.collection("user").where("id", "in", ids).get();
    return users?.docs?.map((doc) => doc.data());
  } else {
    return [];
  }
};

export const cancelBooking =
  (bookingId, transId, extraSessionId) => async (dispatch) => {
    let flag;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const transDoc = await db
      .collection("user_payment_transaction")
      .doc(transId)
      .get();

    const transData = transDoc.data();
    await axios
      .post(`/api/cancel-user-booking-payment-from-user`, {
        booking_id: bookingId,
        user_id: user.id,
        amount: 200,
      })
      .then(async (res) => {
        console.log(res, "res");
        const response = res;
        if (response.data.status === 200) {
          const res = await db.collection("advertiser_notification").add({
            advertiser_id: transData.advertiser_id,
            date: moment().format("MM/DD/YYYY"),
            icon: "Icons.notifications",
            id: "",
            booking_id: bookingId,
            is_read: "0",
            message: user.name + " canceled your " + transData.camp_name,
          });
          await db
            .collection("advertiser_notification")
            .doc(res.id)
            .update({ id: res.id });
          //notification setting.
          toastr.success("Booking is canceled sucessfully");
          flag = true;
        } else {
          flag = false;
        }
      })
      .catch((error) => {
        flag = false;
        console.log(error, "cancel");
        toastr.warning(error.message);
      });
    return flag;
  };

export const myCalendar = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  await db
    .collection("booking")
    .where("user_id", "==", user.id)
    .onSnapshot(async (querySnapshot) => {
      const bookingData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const myBooking = bookingData.filter(
        (item) => item.status === "0" || item.status === "2"
      );
      let myCalData = [];
      await Promise.all(
        myBooking.map(async (item, index) => {
          let chatRoomId = "";
          const advDoc = await db
            .collection("ad_listing")
            .doc(item.ad_id)
            .get();
          const listingData = advDoc.data();
          if (Boolean(item.extra_session_id)) {
            const advExtraDoc = await db
              .collection("ad_listing")
              .doc(item.ad_id)
              .collection("sessions")
              .doc(item.extra_session_id)
              .get();
            if (advExtraDoc.exists) {
              listingData["start_date"] = advExtraDoc.data().start_date;
              listingData["end_date"] = advExtraDoc.data().end_date;
            }
          }
          await db
            .collection("chat")
            .where("activity_id", "==", item.ad_id)
            .where("type", "==", "private")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach(function (doc) {
                if (doc.data().users_occupants[0] === user.id) {
                  chatRoomId = doc.id;
                }
              });
            });
          let startDate =
            moment(listingData.start_date.seconds * 1000).format("YYYY-MM-DD") +
            " " +
            listingData.start_time;
          let endDate =
            moment(listingData.end_date.seconds * 1000).format("YYYY-MM-DD") +
            " " +
            listingData.end_time;

          const element = {
            id: index + 1,
            listingData: listingData,
            chatRoomId: chatRoomId,
            bookingData: item,
            title:
              item.status === "2"
                ? listingData.ad_title + " - Canceled"
                : listingData.ad_title,
            start: newDate(startDate),
            end: newDate(endDate),
          };
          myCalData = [...myCalData, element];
        })
      );
      dispatch({ type: "SET_CALENDAR_DATA", payload: myCalData });
    });
};

//cancel activity page
export const cancelActivity = (id) => async (dispatch) => {
  await axios
    .post(
      `https://us-central1-kidsapp-c8292.cloudfunctions.net/app/cancel-camp-user-booking-payment-from-advertiser`,
      {
        ad_id: id,
      }
    )
    .then((res) => {
      toastr.success("Cancel is successfully!");
    });
};

//notification part
export const getAdvNotification = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = JSON.parse(sessionStorage.getItem("role"));
  if (user) {
    await db
      .collection(
        role === "user" ? "user_notification" : "advertiser_notification"
      )
      .orderBy("date", "asc")
      .onSnapshot((querySnapshot) => {
        const notification = querySnapshot.docs.map((doc) => doc.data());
        const userNotification = notification.filter(
          (item) =>
            user.id === (role === "user" ? item.user_id : item.advertiser_id)
        );
        if (userNotification.length > 0) {
          userNotification.map(async (item) => {
            if (item.booking_id !== undefined && item.booking_id !== "") {
              const adDoc = await db
                .collection("booking")
                .doc(item.booking_id)
                .get();
              if (adDoc.exists) {
                const adData = adDoc.data();
                if (adData.status !== "5") {
                  item["ad_id"] = adData.ad_id;
                }
              }
            }
            return item;
          });
        }
        const unreadMsg = notification.filter(
          (item) =>
            user.id === (role === "user" ? item.user_id : item.advertiser_id) &&
            item.is_read === "0" &&
            item.booking_id === undefined
        );
        dispatch({
          type: "ADVERTISER_NOTIFICATION",
          payload: {
            notificationCnt: userNotification,
            msgCnt: unreadMsg.length,
          },
        });
      });
  }
};

export const setReadNotification = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = JSON.parse(sessionStorage.getItem("role"));
  if (user) {
    const notiDocs = await db
      .collection(
        role === "user" ? "user_notification" : "advertiser_notification"
      )
      .get();
    const data = notiDocs.docs.map((doc) => doc.data());
    const filterData = data.filter(
      (item) =>
        item.is_read === "0" &&
        (role === "user" ? item.user_id : item.advertiser_id) === user.id
    );
    if (filterData.length > 0) {
      await Promise.all(
        filterData.map(async (item) => {
          await db
            .collection(
              role === "user" ? "user_notification" : "advertiser_notification"
            )
            .doc(item.id)
            .update({ is_read: "1" });
        })
      );
    }
  }
};

export const setReadMsg = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = JSON.parse(sessionStorage.getItem("role"));
  if (user) {
    const notiDocs = await db
      .collection(
        role === "user" ? "user_notification" : "advertiser_notification"
      )
      .get();
    const data = notiDocs.docs.map((doc) => doc.data());
    const filterData = data.filter(
      (item) =>
        item.is_read === "0" &&
        (role === "user" ? item.user_id : item.advertiser_id) === user.id &&
        item.is_read === "0" &&
        item.booking_id === undefined
    );
    if (filterData.length > 0) {
      await Promise.all(
        filterData.map(async (item) => {
          await db
            .collection(
              role === "user" ? "user_notification" : "advertiser_notification"
            )
            .doc(item.id)
            .update({ is_read: "1" });
        })
      );
    }
  }
};

// add bank account infomation
export const setBoostCamp =
  (id, cardId, selBoostId, boostInfo) => async (dispatch) => {
    let flag;
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const date = moment()
        .add(boostInfo.day, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      const res = await axios.post(`/api/boostPaid`, {
        email: user.email,
        pm: cardId,
        amount: boostInfo.fees,
      });
      const transactionInfo = res.data;
      const adDataDoc = await db.collection("ad_listing").doc(id).get();
      const adData = adDataDoc.data();

      const boostPaymentDoc = await db
        .collection("advertiser_boost_payments")
        .add({
          ad_subscription_id: selBoostId,
          ad_subscription_plan_name: boostInfo.plan_name,
          advertiser_id: user.id,
          camp_id: id,
          camp_name: adData.ad_title,
          price_paid: boostInfo.fees,
          timestamp: newDate(),
          upgrade_date_limit: newDate(date),
          transaction_id: transactionInfo.id,
        });

      await db
        .collection("ad_listing")
        .doc(id)
        .update({
          boost_date_limit: newDate(date),
          transaction_id: transactionInfo.id,
          ad_boost_payment_id: boostPaymentDoc.id,
        });
      const docref = await db.collection("slider_images").add({
        camp_id: id,
        date_limit: newDate(date),
        id: "",
        image: adData.picture.length > 0 ? adData.picture[0] : "",
        status: 0,
      });
      await db
        .collection("slider_images")
        .doc(docref.id)
        .update({ id: docref.id });
      transactionInfo["advertiser_id"] = user.id;
      await db
        .collection("advertiser_payment_transaction")
        .doc(transactionInfo.id)
        .set(transactionInfo);
      toastr.success("Boost Ads successfully!");
      flag = true;
    } catch (error) {
      toastr.warning(error.message);
      return false;
    }
    return flag;
  };

//upgrade account information
export const setUpgradeAccount =
  (upgradeInfo, paymentMethodId) => async (dispatch) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const date = moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss");
      const trasRes = await axios.post(`/api/boostPaid`, {
        email: user.email,
        pm: paymentMethodId,
        amount: upgradeInfo.fees,
      });
      const transactionInfo = trasRes.data;
      const upgradeRes = await db
        .collection("advertiser_upgrade_payments")
        .add({
          ad_subscription_id: upgradeInfo.id,
          ad_subscription_plan_name: upgradeInfo.plan_name,
          advertiser_id: user.id,
          price_paid: upgradeInfo.fees,
          upgrade_date_limit: newDate(date),
          timestamp: newDate(),
          transaction_id: transactionInfo.id,
        });
      await db
        .collection("advertiser")
        .doc(user.id)
        .update({
          is_feature: "0",
          is_feature_day: upgradeInfo.day,
          is_feature_day_remaining: upgradeInfo.day,
          ad_subscription_id: upgradeInfo.id,
          ad_upgrade_payment_id: upgradeRes.id,
          upgrade_date_limit: newDate(date),
          transaction_id: transactionInfo.id,
        });
      await db
        .collection("advertiser_payment_transaction")
        .doc(transactionInfo.id)
        .set(transactionInfo);
      const newDoc = await db.collection("advertiser").doc(user.id).get();
      const newAdvertiserInfo = newDoc.data();
      sessionStorage.setItem("user", JSON.stringify(newAdvertiserInfo));
      toastr.success("Upgrade account successfully!");
    } catch (error) {
      console.log(error, "upgrade account");
    }
  };

//get Booking List
export const getOrderList =
  (userCurrency = "USD") =>
  async (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      await db
        .collection("booking")
        .where("status", "==", "0")
        .where("user_id", "==", user.id)
        .onSnapshot(async (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          const bookingList = data.filter((item) => item.transaction_id !== "");
          let orderData = [];
          if (bookingList.length > 0) {
            await Promise.all(
              bookingList.map(async (item) => {
                let session = {};
                const transDoc = await db
                  .collection("user_payment_transaction")
                  .doc(item.transaction_id)
                  .get();
                const adDoc = await db
                  .collection("ad_listing")
                  .doc(item.ad_id)
                  .get();
                const adData = adDoc.data();
                if (transDoc.exists && Boolean(adData)) {
                  const transData = transDoc.data();
                  const displayPrice = await getPriceOfCurrency(
                    transData.currency,
                    userCurrency,
                    transData.amount / 100,
                    "order"
                  );
                  if (!Boolean(item.extra_session_id)) {
                    const startDate = moment(
                      adData.start_date.seconds * 1000
                    ).format("MM/DD/YYYY");
                    const endDate = moment(
                      adData.end_date.seconds * 1000
                    ).format("MM/DD/YYYY");
                    session = {
                      startDate: startDate,
                      endData: endDate,
                      startTime: adData.start_time,
                      endTime: adData.end_time,
                    };
                  } else {
                    const extraSessionDoc = await db
                      .collection("ad_listing")
                      .doc(item.ad_id)
                      .collection("sessions")
                      .doc(item.extra_session_id)
                      .get();
                    if (extraSessionDoc.exists) {
                      const extraSessionData = extraSessionDoc.data();
                      const startDate = moment(
                        extraSessionData.start_date.seconds * 1000
                      ).format("MM/DD/YYYY");
                      const endDate = moment(
                        extraSessionData.end_date.seconds * 1000
                      ).format("MM/DD/YYYY");
                      session = {
                        startDate: startDate,
                        endData: endDate,
                        startTime: extraSessionData.start_time,
                        endTime: extraSessionData.end_time,
                      };
                    }
                  }
                  const element = {
                    campTitle: adData.ad_title,
                    img: adData.picture.length > 0 ? adData.picture[0] : "",
                    displayPrice: displayPrice,
                    session: session,
                    transData: transData,
                    attendee: item.child_name + " " + item.surname,
                    video: adData.video,
                    date: moment(item.timestamp.seconds * 1000).format(
                      "dd,MM/DD/YYYY"
                    ),
                  };
                  orderData.push(element);
                }
              })
            );
          }
          dispatch({ type: "USER_ORDER_LIST", payload: orderData });
          setPageLoading(dispatch, false);
        });
    }
  };

export const getAdminCouponList = () => async (dispatch) => {
  try {
    await db
      .collection("coupon")
      .where("type_coupon", "==", "admin")
      .onSnapshot((res) => {
        const adminCouponList = res.docs.map((doc) => doc.data());
        dispatch({ type: "SET_ADMIN_COUPON", payload: adminCouponList });
      });
  } catch (error) {
    toastr.warning(error.message);
  }
};
