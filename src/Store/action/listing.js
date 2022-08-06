import { corsAnywhere } from "config";
import getCSV from "get-csv";
import { newDate } from "lib/dateLib";
import moment from "moment";
import { getPriceOfCurrency } from "Store/action/appAction";
import toastr from "toastr";
import avatar from "../../assets/img/default.jpg";
import firebase, { db } from "../../services/firebase";
import { SET_LISTING_DATA } from "../action/actionTypes";
import { setPageLoading, SortByData } from "./appAction";

export const getListing =
  (userCurrency = "USD") =>
  async (dispatch) => {
    // await db.collection("csv_files").doc("cdwFIgRWASaQhU7F8Tep").delete();
    try {
      let favData = [],
        i = 1;
      const user = JSON.parse(sessionStorage.getItem("user"));
      const favDoc = await db.collection("favourites_ad").get();
      const favListing = favDoc.docs.map((doc) => doc.data());
      if (user) {
        favData = favListing.filter((item) => item.user_id === user.id);
      }
      const docReview = await db.collection("reviews").get();
      const reviews = docReview.docs.map((doc) => doc.data());
      await db
        .collection("ad_listing")
        .where("status", "in", ["0", "6"])
        .onSnapshot(async (res) => {
          let adv_listing = [];
          const curDate = moment().unix();
          let AllListing = res.docs.map((doc) => doc.data());
          let listing = AllListing.filter(
            (item) => item.advertiser_id !== "" && item?.status === "0"
          );
          await Promise.all(
            listing.map(async (item, index) => {
              let userAvatar;
              // let dateOverflag = false;
              const sessionsDoc = await db
                .collection("ad_listing")
                .doc(item.id)
                .collection("sessions")
                .orderBy("start_date", "asc")
                .get();
              let sessions = sessionsDoc.docs.map((item) => ({
                ...item.data(),
                id: item.id,
              }));
              if (sessions.length > 0) {
                const sessionRes = await getExtraSessions(
                  sessions,
                  item.price_currency,
                  userCurrency
                );
                sessions = sessionRes.newSessions;
                // dateOverflag = sessionRes.dateOverflag;
              }
              let allSessions = [
                {
                  start_date: moment(
                    (item.start_date.seconds +
                      item.start_date.nanoseconds / 1000000000) *
                      1000
                  ).format("MM/DD/YYYY HH:mm"),
                  end_date: moment(
                    (item.end_date.seconds +
                      item.end_date.nanoseconds / 1000000000) *
                      1000
                  ).format("MM/DD/YYYY HH:mm"),
                  start_time: item.start_time,
                  end_time: item.end_time,
                },
                ...sessions,
              ];
              allSessions = allSessions.sort((a, b) => {
                return (
                  moment(a.start_date).unix() - moment(b.start_date).unix()
                );
              });
              let checkFav = false;
              let res = await db
                .collection("advertiser")
                .doc(item.advertiser_id)
                .get();
              const userData = res.data();
              if (userData.booking_fees_limit_date !== undefined) {
                if (userData.booking_fees_limit_date.seconds < curDate) {
                  await db
                    .collection("advertiser")
                    .doc(item.advertiser_id)
                    .update({
                      booking_fees_id: firebase.firestore.FieldValue.delete(),
                      booking_fees_limit_date:
                        firebase.firestore.FieldValue.delete(),
                    });
                }
              }
              const filterReviews = reviews.filter(
                (review) => review.id_listing === item.id
              );
              // Calcuate Rating
              const sum =
                filterReviews.length > 0
                  ? filterReviews
                      .map((rev) => rev.rating)
                      .reduce((ele, cur) => ele + cur)
                  : 0;
              const rating =
                sum > 0 ? (sum / filterReviews.length).toFixed(1) : 0;
              if (favData.length > 0) {
                const result = favData.filter(
                  (element) => element.ad_id === item.id
                );
                checkFav = result.length > 0 ? true : false;
              }
              userAvatar = userData?.profile_picture || avatar;

              const couponCodeDoc = await db
                .collection("coupon")
                .where("ad_listing_id", "==", item.id)
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
              const url = `/listing-details/${item?.address?.city || "city"}/${
                item?.category_name || "category"
              }/${userData?.name || "name"}/${item.ad_title || "activity"}/${
                item.id ?? ""
              }`;
              const location =
                (item?.address?.street ? item.address.street + ", " : "") +
                (item?.address?.city ? item.address.city + ", " : "") +
                (item?.address?.state ? item.address.state + ", " : "") +
                (item?.address?.country ? item.address.country : "");
              let changedPrice = await getPriceOfCurrency(
                item?.price_currency || "USD",
                userCurrency,
                Number(item.price)
              );
              const element = {
                img: item.picture,
                user: userAvatar,
                ad_description: item.ad_description,
                listing_id: item.id,
                id: i++,
                title: item.ad_title,
                rating: rating,
                boost_date_limit:
                  item.boost_date_limit === undefined
                    ? ""
                    : item.boost_date_limit,
                price: item.price,
                priceCurrency: item?.price_currency || "usd",
                displayPrice: changedPrice,
                author: userData?.name || "",
                couponList: couponList,
                location: location,
                phone: userData?.phone || "",
                category: item.category_name,
                icon: "futbol",
                start_time: item.start_time,
                availability: item.availability,
                remaing_availability: item.remaing_availability,
                end_time: item.end_time,
                favFlag: checkFav,
                start_date: moment(
                  (item.start_date.seconds +
                    item.start_date.nanoseconds / 1000000000) *
                    1000
                ).format("MM/DD/YYYY HH:mm"),
                end_date: moment(
                  (item.end_date.seconds +
                    item.end_date.nanoseconds / 1000000000) *
                    1000
                ).format("MM/DD/YYYY HH:mm"),
                adver_name: userData?.name || "",
                adver_email: userData?.email || "",
                adver_phone: userData?.phone_number || "",
                advertiser_id: item.advertiser_id,
                adver_address: userData?.address || "",
                posted_date: item.date,
                extraSessions: sessions,
                sessions: allSessions,
                selSessionKey: 0,
                company: item?.company ?? "",
                option_field1_title: item?.option_field1_title || "",
                option_field2_title: item?.option_field2_title || "",
                custom_terms: item?.custom_terms || "",
                url: url.replace(/ /g, "-"),
                virtual_link: item?.virtual_link || "",
                camp_type: item?.camp_type || "",
                video_url: item.video,
                covid_precautions: item.covid_precautions,
              };
              adv_listing = [...adv_listing, element];
              // }
            })
          );
          //get the csv files.
          let csvJsonData = [];
          const csvRes = await db
            .collection("csv_files")
            .where("status", "==", "0")
            .get();
          if (!res.empty) {
            const csvfileUrls = csvRes.docs.map((doc) => doc.data());
            console.log(csvfileUrls, "csvFilseUrls");
            await Promise.all(
              csvfileUrls.map(async (item, index) => {
                const resJSON = await new Promise((resolve, reject) => {
                  getCSV(`${corsAnywhere}${item.url}`)
                    .then((row) => resolve(row))
                    .catch((err) => resolve([]));
                });
                // const resJSON = await getCSV(`${corsAnywhere}${item.url}`);
                console.log(item.url, "index :", index);
                adv_listing = [...adv_listing, ...resJSON];
              })
            );
            adv_listing.forEach((ele) => {
              if (Boolean(ele?.listing_id)) {
                csvJsonData = [...csvJsonData, ele];
              } else {
                const claimCheck =
                  AllListing?.filter(
                    (item) =>
                      item.category_name === ele.category &&
                      (item?.company ?? "").includes(ele.company)
                  )?.length > 0
                    ? true
                    : false;
                if (
                  Boolean(ele.images) &&
                  Number(ele?.images?.length) > 0 &&
                  !claimCheck
                ) {
                  const category = ele?.category
                    ? ele?.category
                        ?.replace(/\//g, "")
                        .replace(/&/g, "")
                        .replace(/-/g, "")
                    : "category";
                  const company = ele?.company
                    ? ele?.company
                        .replace(/\//g, "")
                        .replace(/&/g, "")
                        .replace(/-/g, "")
                    : "company";
                  const city = ele?.city
                    ? ele?.city
                        .replace(/\//g, "")
                        .replace(/&/g, "")
                        .replace(/-/g, "")
                    : "city";
                  const url = `/listing-details/${city ?? "city"}/${
                    category ?? "category"
                  }/${company ?? "company"}`;
                  csvJsonData = [
                    ...csvJsonData,
                    {
                      ...ele,
                      activityType: "claim",
                      location: ele.address,
                      img: ele?.images?.split(",")?.slice(0, 3) ?? [],
                      title: ele.company,
                      url: url.replace(/ /g, "-"),
                    },
                  ];
                }
              }
            });
          }

          dispatch({
            type: SET_LISTING_DATA,
            payload: csvJsonData,
          });
        });
    } catch (error) {
      toastr.warning(error.message);
    }
  };

export const getMyListing =
  (id, userCurrency = "USD") =>
  async (dispatch) => {
    try {
      await db
        .collection("ad_listing")
        .where("advertiser_id", "==", id)
        .onSnapshot(async (doc) => {
          // if (!doc.empty) {
          const myData = doc.docs
            .map((doc) => doc.data())
            .filter((item) => item.id !== "");
          let myDataLists = [];
          myData.length > 0 &&
            (await Promise.all(
              myData.map(async (item) => {
                if (item.id !== "") {
                  const extraDoc = await db
                    .collection(`ad_listing/${item.id}/sessions`)
                    .orderBy("start_date", "asc")
                    .get();
                  const sessions = extraDoc.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                  }));
                  item["sessions"] = sessions;
                  item["displayPrice"] = await getPriceOfCurrency(
                    item?.price_currency || "USD",
                    userCurrency,
                    item.price
                  );
                  myDataLists = [...myDataLists, item];
                } else {
                  myDataLists.push(item);
                }
              })
            ));
          dispatch({
            type: "SET_MYLISTING",
            payload: SortByData(
              myDataLists.filter((item) => item.status !== "5"),
              "timestamp"
            ),
          });
          setPageLoading(dispatch, false);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

export const getActivityLists = (id) => async (dispatch) => {
  try {
    console.log(id, "id");
    const res = await db.collection("ad_listing").get();
    if (!res.empty) {
      const listing = res.docs.map((doc) => doc.data());
      let filter = listing.filter((item) => item.id === id);
      if (filter.length > 0) {
        const sessionsDoc = await db
          .collection("ad_listing")
          .doc(filter[0].id)
          .collection("sessions")
          .get();
        const sessions = sessionsDoc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        filter[0]["sessions"] = sessions;
      }
      console.log(id, "filter");

      dispatch({ type: "GET_ACTIVITY_LISTING", payload: filter });
    }
  } catch (error) {
    toastr.info(error.message);
  }
};

export const deleteActivity = (id) => async (dispatch) => {
  try {
    await db.collection("ad_listing").doc(id).update({ status: "5" });
    toastr.success("Activity deleted successfully!");
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getMetaData = () => async (dispatch) => {
  await db
    .collection("ad_listing")
    .where("status", "==", "0")
    .onSnapshot(async (res) => {
      const listingData = res.docs.map((item) => item.data());
      let metaData;
      let title = "",
        description = "",
        url = "",
        keywords = "",
        img = "";
      if (listingData.length > 0) {
        await Promise.all(
          listingData.map(async (item) => {
            const userDoc = await db
              .collection("advertiser")
              .doc(item.advertiser_id)
              .get();
            const user = userDoc.data();
            let ad_keywords = "",
              ad_url;
            if (typeof item.address === "string" && item.address !== "") {
              const data = item.address.split(",");
              data.forEach((address) => {
                ad_keywords = ad_keywords + address + ",";
              });
              ad_url = `https://www.activities.app/${data[0]}/${item.category_name}/${user.name}/${item.ad_title}`;
            } else if (item.address === "object") {
              ad_keywords =
                item.address.city +
                "," +
                item.address.street +
                "," +
                item.address.state +
                "," +
                item.address.country +
                "," +
                item.address.postal_code +
                ",";
              ad_url = `https://www.activities.app/${item.address.city}/${item.category_name}/${user.name}/${item.ad_title}`;
            }
            ad_keywords =
              ad_keywords + item.category_name + "," + item.remember_bring;
            title = title + item.ad_title + ",";
            description = description + item.ad_description + ",";
            url = url + ad_url + ",";
            keywords = keywords + ad_keywords + ",";
            img = img + (item.picture.length > 0 && item.picture[0]) + ",";
          })
        );
        metaData = {
          title: title,
          description: description,
          url: url,
          keywords: keywords,
          img: img,
        };
        dispatch({ type: "SET_META_DATA", payload: metaData });
      }
    });
};

export const setViewCnt = (id) => async (dispatch) => {
  const listingDoc = await db.collection("ad_listing").doc(id).get();
  const listingData = listingDoc.data();
  await db
    .collection("ad_listing")
    .doc(id)
    .update({
      ad_click: listingData.ad_click + 1,
      ad_view: listingData.ad_view + 1,
    });
};

export const setQuestionnaire =
  (id, userid, rating, comment, history) => async (dispatch) => {
    const userRes = await db.collection("user").doc(userid).get();
    if (userRes.exists) {
      const user = userRes.data();
      const data = {
        rating: rating,
        review: comment,
        profile_picture: user?.profile_picture ?? "",
        name: user.name,
        id_user: userid,
        id_listing: id,
        date: newDate(),
        status: "1",
      };
      db.collection("reviews")
        .doc()
        .set(data)
        .then((res) => {
          toastr.success("successfully your comment. Thank you!");
          history.push("/");
        });
    } else {
      toastr.warning("Your account deleted!");
    }
  };

export const getActivityImage = (activityId) => async (dispatch) => {
  try {
    const activityRes = await db.collection("ad_listing").doc(activityId).get();
    let image = "";
    if (activityRes.exists) {
      const activity = activityRes.data();
      image = activity.picture.length > 0 ? activity.picture[0] : "";
    }
    dispatch({ type: "SET_ACTIVITY_IMAGE", payload: image });
  } catch (error) {
    console.log(error.message, "comment questionnaire");
  }
};

export const getMerchantSupport = () => async (dispatch) => {
  try {
    let merchantInfo = [];
    const merchantInfoRes = await db
      .collection("merchant_support")
      .where("status", "==", "1")
      .get();
    if (!merchantInfoRes.empty) {
      merchantInfo = merchantInfoRes.docs.map((doc) => doc.data());
      merchantInfo = merchantInfo.sort(function (a, b) {
        return a.timestamp.seconds - b.timestamp.seconds;
      });
    }
    dispatch({ type: "SET_MERCHANT_INFO", payload: merchantInfo });
  } catch (error) {
    console.log(error.message);
  }
};

const getExtraSessions = async (
  sessions = [],
  currency = "USD",
  userCurrency = "USD"
) => {
  let newSessions = [];
  const curDate = moment().unix();
  let dateOverflag = false;
  await Promise.all(
    sessions.map(async (session) => {
      const endDate1 = moment(
        (session.end_date.seconds + session.end_date.nanoseconds / 1000000000) *
          1000
      ).format("YYYY-MM-DD HH:mm");
      const endDateLocalTimestamp1 = moment(endDate1).unix();
      if (curDate < endDateLocalTimestamp1) {
        dateOverflag = true;
      }
      session["start_date"] = moment(session.start_date.seconds * 1000).format(
        "MM/DD/YYYY HH:mm"
      );
      session["end_date"] = moment(session.end_date.seconds * 1000).format(
        "MM/DD/YYYY HH:mm"
      );
      session["displayPrice"] = await getPriceOfCurrency(
        currency,
        userCurrency,
        Number(session.price)
      );
      newSessions = [...newSessions, session];
    })
  );
  return { newSessions, dateOverflag };
};
