import { newDate } from "lib/dateLib";
import { db } from "../../services/firebase";
import moment from "moment";

export const getActivities = () => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const bookingRes = await db
      .collection("booking")
      .where("advertiser_id", "==", user.id)
      .get();

    let monthlyBookings = [],
      dayBookings = [],
      weeklyBookings = [],
      prevMonthlyBookings = [],
      adListing = [],
      views = 0;
    if (!bookingRes.empty) {
      const bookings = bookingRes.docs.map((doc) => doc.data());
      const firstday = moment().subtract(6, "days").unix(); // First day is the day of the month - the day of the week
      const lastday = moment().unix();

      monthlyBookings = bookings.filter(
        (item) =>
          moment().format("YYYY-MM") ===
          moment(item.timestamp.seconds * 1000).format("YYYY-MM")
      );
      dayBookings = bookings.filter(
        (item) =>
          moment().format("YYYY-MM-DD") ===
          moment(item.timestamp.seconds * 1000).format("YYYY-MM-DD")
      );
      weeklyBookings = bookings.filter(
        (item) =>
          moment(item.timestamp.seconds * 1000).unix() > firstday &&
          moment(item.timestamp.seconds * 1000).unix() < lastday
      );
      prevMonthlyBookings = bookings.filter(
        (item) =>
          moment().subtract(1, "months").format("YYYY-MM") ===
          moment(item.timestamp.seconds * 1000).format("YYYY-MM")
      );
    }
    const adListingRes = await db
      .collection("ad_listing")
      .where("advertiser_id", "==", user.id)
      .get();

    if (!adListingRes.empty) {
      const adListing = adListingRes.docs.map((doc) => doc.data());
      adListing.forEach((item) => {
        views += item.ad_view;
      });
    }
    const completeListing = adListing.filter((item) => item.status === "2");

    let percent;
    if (prevMonthlyBookings.length === 0) {
      percent = monthlyBookings.length;
    } else {
      percent = monthlyBookings.length - prevMonthlyBookings.length;
    }
    const bookingInfo = [
      {
        id: 1,
        product: "Activities",
        total: {
          monthly: monthlyBookings.length,
          weekly: weeklyBookings.length,
          daily: dayBookings.length,
          percent: { value: percent, profit: percent > 0 ? true : false },
        },
        color: "primary",
        activitiesInfo: {
          registrations: adListingRes.size,
          completed: completeListing.length,
          views: views,
        },
      },
    ];
    dispatch({ type: "SET_DASHBOARD_INFO", payload: bookingInfo });
  } catch (error) {
    console.log(error.message);
  }
};

export const getBalanceInfo = () => async (dispatch) => {
  let total = 0,
    pendingMoney = 0,
    withdrawMoney = 0,
    dailyTotal = 0,
    weeklyTotal = 0,
    monthlyTotal = 0;
  let pending = [],
    withdraw = [],
    advertiserPaymentInfo;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const bookingRes = await db
    .collection("booking")
    .where("advertiser_id", "==", user.id)
    .where("status", "==", "0")
    .get();
  if (!bookingRes.empty) {
    const bookings = bookingRes.docs.map((doc) => doc.data());
    await Promise.all(
      bookings.map(async (item) => {
        const paymentInfoRes = await db
          .collection("user_payment_transaction")
          .doc(item.transaction_id)
          .get();
        if (paymentInfoRes.exists) {
          const paymentInfo = paymentInfoRes.data();
          if (paymentInfo.status === "succeeded") {
            total = total + (paymentInfo.amount * (100 - item.fee)) / 10000;
          }
        }
      })
    );
    const advertiserPaymentInfoRes = await db
      .collection("advertiser_withdraw")
      .where("advertiser_id", "==", user.id)
      .get();
    if (!advertiserPaymentInfoRes.empty) {
      advertiserPaymentInfo = advertiserPaymentInfoRes.docs.map((doc) =>
        doc.data()
      );
      pending = advertiserPaymentInfo.filter(
        (item) => item.status === "1" || item.status === "3"
      );
      withdraw = advertiserPaymentInfo.filter((item) => item.status === "0");

      if (pending.length > 0) {
        pending.forEach((item) => {
          pendingMoney += parseFloat(item.amount);
        });
      }
      if (withdraw.length > 0) {
        withdraw.forEach((item) => {
          withdrawMoney += parseFloat(item.amount);
        });
      }
      const weeklyData = [];
      for (let i = 1; i <= 7; i++) {
        const weekData = withdraw.filter(
          (item) =>
            moment(item.date).format("YYYY-MM-DD") ===
            moment()
              .subtract(7 - i, "days")
              .format("YYYY-MM-DD")
        );
        let amount = 0;
        weekData.forEach((item) => {
          amount += Number(item.amount);
        });
        weeklyData.push(amount);
      }
      const dailyData = withdraw.filter(
        (item) =>
          moment(item.date).format("YYYY-MM-DD") ===
          moment().format("YYYY-MM-DD")
      );
      const monthlyData = withdraw.filter(
        (item) =>
          moment(item.date).format("YYYY-MM") === moment().format("YYYY-MM")
      );
      weeklyData.forEach((item) => {
        weeklyTotal += item;
      });
      dailyData.forEach((item) => {
        dailyTotal += Number(item.amount);
      });
      monthlyData.forEach((item) => {
        monthlyTotal += Number(item.amount);
      });
    }
    const balanceInfo = {
      curBalance: parseFloat(total - withdrawMoney).toFixed(2),
      availabeBalance: (total - withdrawMoney - pendingMoney).toFixed(2),
      total: {
        daily: dailyTotal,
        monthly: monthlyTotal,
        weekly: weeklyTotal,
      },
    };
    dispatch({ type: "SET_BALANCE_INFO", payload: balanceInfo });
  }
};

export const getLineChartData = (param) => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const bookingInfoRes = await db
    .collection("booking")
    .where("advertiser_id", "==", user.id)
    .get();
  const bookingInfo = bookingInfoRes.docs.map((doc) => doc.data());
  const dailyData = getDailyData(bookingInfo);
  const monthlyData = getMonthlyData(bookingInfo);
  const weeklyData = getWeeklyData(bookingInfo);
  const lineChartData = {
    dailyData: dailyData,
    monthlyData: monthlyData,
    weeklyData: weeklyData,
  };
  dispatch({ type: "SET_LINE_CHART", payload: lineChartData });
};

export const getBookingInfoBarChart = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const bookingInfoRes = await db
    .collection("booking")
    .where("advertiser_id", "==", user.id)
    .get();
  const bookingInfo = bookingInfoRes.docs.map((doc) => doc.data());
  const activeBooking = bookingInfo.filter((item) => item.status === "0");
  const cancelledBooking = bookingInfo.filter((item) => item.status === "2");
  let completeBooking = [];

  await Promise.all(
    bookingInfo.map(async (item) => {
      const paymentInfoRes = await db
        .collection("user_payment_transaction")
        .where("status", "==", "succeeded")
        .where("id", "==", item.transaction_id);
      if (paymentInfoRes.length > 0) {
        completeBooking.push(item);
      }
    })
  );

  await Promise.all(
    bookingInfo.map(async (item) => {
      const paymentInfoRes = await db
        .collection("user_payment_transaction")
        .where("status", "==", "succeeded")
        .where("id", "==", item.transaction_id);
      if (paymentInfoRes.length > 0) {
        completeBooking.push(item);
      }
    })
  );

  const activeDailyCount = getBookingCount(getDailyData(activeBooking));
  const completeDailyCount = getBookingCount(getDailyData(completeBooking));
  const canceledDailyCount = getBookingCount(getDailyData(cancelledBooking));

  const activeWeeklyCount = getBookingCount(getWeeklyData(activeBooking));
  const completeWeeklyCount = getBookingCount(getWeeklyData(completeBooking));
  const canceledWeeklyCount = getBookingCount(getWeeklyData(cancelledBooking));

  const activeMonthlyCount = getBookingCount(getMonthlyData(activeBooking));
  const completeMonthlyCount = getBookingCount(getMonthlyData(completeBooking));
  const canceledMonthlyCount = getBookingCount(
    getMonthlyData(cancelledBooking)
  );

  const barChartData = {
    dailyData: [
      ["Daily", "Active Bookings", "Completed Bookings", "Cancelled Bookings"],
      ["active", activeDailyCount, 0, 0],
      ["complete", 0, completeDailyCount, 0],
      ["canceled", 0, 0, canceledDailyCount],
    ],
    weeklyData: [
      ["weekly", "Active Bookings", "Completed Bookings", "Cancelled Bookings"],
      ["active", activeWeeklyCount, 0, 0],
      ["complete", 0, completeWeeklyCount, 0],
      ["canceled", 0, 0, canceledWeeklyCount],
    ],
    monthlyData: [
      [
        "Monthly",
        "Active Bookings",
        "Completed Bookings",
        "Cancelled Bookings",
      ],
      ["active", activeMonthlyCount, 0, 0],
      ["complete", 0, completeMonthlyCount, 0],
      ["canceled", 0, 0, canceledMonthlyCount],
    ],
  };
  dispatch({ type: "SET_BAR_CHART_DATA", payload: barChartData });
};

export const getReviews = () => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const reviewRes = await db
    .collection("reviews")
    .where("status", "==", "0")
    .get();
  if (!reviewRes.empty) {
    const reviews = reviewRes.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    await Promise.all(
      reviews.map(async (item) => {
        const adInfo = await db
          .collection("ad_listing")
          .doc(item.id_listing)
          .get();
        item["advertiser"] = adInfo.data().advertiser_id;
        item["image"] = adInfo.data().picture;
        return item;
      })
    );
    let myReviews = reviews.filter((item) => item.advertiser === user.id);
    myReviews = myReviews.sort(function (a, b) {
      return newDate(a.date) - newDate(b.date);
    });
    dispatch({ type: "SET_MY_REVIEWS", payload: myReviews });
  }
};

export const getCntActivites = () => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const resActivities = await db
      .collection("ad_listing")
      .where("advertiser_id", "==", user.id ?? "")
      .get();
    const cntActivities = resActivities.size;
    dispatch({ type: "SET_CLAIM_LIST", payload: cntActivities });
  } catch (error) {
    console.log(error, "error");
  }
};

const getDailyData = (arrayData) => {
  const dailyDataList = [];
  for (let i = 0; i < 31; i++) {
    const dailyData = arrayData.filter(
      (item) =>
        moment(item.timestamp.seconds * 1000).format("YYYY-MM-DD") ===
        moment()
          .subtract(31 - i, "days")
          .format("YYYY-MM-DD")
    );
    dailyDataList.push({ key: i + 1, value: dailyData.length });
  }
  return dailyDataList;
};

const getMonthlyData = (arrayData) => {
  let monthlyData = [];
  const curDate = newDate();
  for (let i = 0; i < 12; i++) {
    const monthData = arrayData.filter(
      (item) =>
        moment(item.timestamp.seconds * 1000).format("YYYY-MM") ===
        moment(curDate).subtract(i, "months").format("YYYY-MM")
    );
    monthlyData.push({ key: i + 1, value: monthData.length });
  }
  return monthlyData;
};

const getWeeklyData = (arrayData) => {
  const weeklyData = [];
  var curr = newDate(); // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  let firstday = newDate(curr.setDate(first));

  for (let i = 0; i < 52; i++) {
    const firstDay = moment(firstday)
      .subtract(i * 7, "days")
      .format("YYYY-MM-DD");
    let weeklyTotal = 0;
    for (let j = 0; j < 7; j++) {
      const weeklyData = arrayData.filter(
        (item) =>
          moment(item.timestamp.seconds * 1000).format("YYYY-MM-DD") ===
          moment(firstDay).add(j, "days").format("YYYY-MM-DD")
      );
      weeklyTotal += weeklyData.length;
    }
    weeklyData.push({ key: i + 1, value: weeklyTotal });
  }
  return weeklyData;
};

const getBookingCount = (arrayData) => {
  let total = 0;
  arrayData.map((item) => (total += Number(item.value)));
  return total;
};
