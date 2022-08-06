require("dotenv").config({ path: "./.env" });
const express = require("express");
const path = require("path");
const compression = require("compression");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
const moment = require("moment");
const admin = require("firebase-admin");
const cron = require("node-cron");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const xml2js = require("xml2js");
const secret_key = process.env.SECRET_KEY;
const secret_crypto_key = process.env.SECRET_CRYPTO_KEY;
const CryptoJS = require("crypto-js");

const rateLimit = require("express-rate-limit");

const serviceAccount = require("./config/firebaseAdminConfig/kidsapp-c8292-firebase-adminsdk-402t9-8fd5914121.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kidsapp-c8292.firebaseio.com",
  });
}
const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);
// const stripe = require("stripe")("sk_test_0jGrsyVDxUoCle8EETZq5ySw00Qd6Micr5");
const stripe = require("stripe")(
  "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"
);

const sendEmailSIB = (email, name, image, title, id, userid, bookingid) => {
  const linkUrl = `https://www.activities.app/questionnaire/${id}/${userid}`;
  let htmlContent =
    "<div style='width:375px; border:1px solid #eee; margin-right:auto;margin-left:auto;'><div style='text-align:center;padding: 25px 0 20px 0;background-color:#fbfcfd'><img src='https://d2qkgxa95zeei2.cloudfront.net/dist/img/app-logo.png' style='width:200px;'></div><div style='margin:0;height: 150px;'>";
  htmlContent += `<img src=${image} style='width:100%;height:100%;object-fit:cover;border-radius: none;'>`;
  htmlContent +=
    "</div><div style='padding: 0 32px'><p style='font-size:16px;line-height:1.5rem;text-align:justify;margin-top:0;padding-top:20px'>You recently attended an activity which was booked on Activities App.</p><p style='font-size:16px;line-height:1.5rem;text-align:justify;'>We would like to learn more about your experience to benefit you and others in the future. We will only ask 2 questions.</p><p style='font-size:16px;line-height:1.5rem;text-align:justify;'>Please take a few minutes to complete the survey.</p><p style='font-size:16px;line-height:1.5rem;text-align:justify;'>Thank you in advance for taking the time to share your thoughts.</p><p style='margin:10px 0;font-size:16px;line-height:1.5rem;text-align:center;'>Yours sincerely<br />The Activities App Team<br/><p><div style='text-align:center;margin:30px 0'>";
  htmlContent += `<a href=${linkUrl} target='_blank' style='border:1px solid #afdb30;text-decoration:none;background-color:#afdb30;color:#fff;padding:10px 40px;font-size:16px;border-radius:3px;'>Take the Survey</a></div></div></div>`;

  axios
    .post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Activities App",
          email: "support@activities.app",
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        replyTo: { email: "support@activities.app" },
        htmlContent: htmlContent,
        subject: `Tell us about ${title} by Activities Team`,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key":
            "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",
        },
      }
    )
    .then((res) => {
      db.collection("booking")
        .doc(bookingid)
        .update({
          sended_email: true,
        })
        .then((res) => {
          console.log(res, "success");
        })
        .catch((error) => {
          console.log(error.message, "sended_email");
        });
    })
    .catch((error) => {
      console.log(error.message, "error");
    });
};

const verifyToken = (req, res, next) => {
  const url = req.originalUrl;
  if (req.originalUrl.includes("api/")) {
    const bearToken = req.headers["authorization"];
    if (!bearToken)
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });
    const email = req.query.email;
    const token = bearToken.split(" ")[1];

    const bytes = CryptoJS.AES.decrypt(token, secret_crypto_key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    jwt.verify(
      decrypted,
      secret_key + "@_arc_@" + email,
      function (err, decoded) {
        if (err)
          return res
            .status(400)
            .send({ auth: false, message: "Failed to authenticate token." });
        // if everything good, save to request for use in other routes
        const { email, advertiserid } = decoded;
        const advertiserId = advertiserid.split("").reverse().join("");

        req.advertiserid = advertiserId;
        req.email = email;

        if (req.advertiserid) {
          next();
        } else {
          return res
            .status(500)
            .send({ auth: false, message: "No advertiser Id provided" });
        }
      }
    );
  } else if (url.includes("action")) {
    console.log("hello");
    res.sendFile(path.resolve(__dirname, "build/index.html"));
  } else {
    next();
  }
};

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 50,
  message: "You have exceeded the 100 requests in 24 hrs limit!",
  headers: true,
});

const getAdvertiserActivities = (advertiserid) => {
  return new Promise((resolve, reject) => {
    db.collection("ad_listing")
      .where("advertiser_id", "==", advertiserid)
      .get()
      .then((activitiesRes) => {
        let activities = [];
        if (!activitiesRes.empty) {
          activities = activitiesRes.docs.map((doc) => doc.data());
        }
        resolve(activities);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// sendEmailSIB("enginechair1959@gmail.com", "Tony engine", "https://firebasestorage.googleapis.com/v0/b/kidsapp-c8292.appspot.com/o/ad_images%2Fad_2021-01-1_paddleboard-yoga.jpg?alt=media&token=a9074d56-b61d-493f-8122-acd65ecc9d2b", "Paddleboard Yoga", "JBSAVuVv583R3BAM5OYA", "noho7NBmkKMV0hSb3MpsmDtpPIO2", "XisqJJ27LPijm3dn8ZxV");

const generateSitemap = () => {
  fs.readFile("build/sitemap.xml", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(data, (err, result) => {
      if (err) {
        throw err;
      }
      // print JSON object
      db.collection("ad_listing")
        .where("status", "==", "0")
        .onSnapshot(async (res) => {
          if (!res.empty) {
            let activities = res.docs.map((doc) => doc.data());
            activities = activities.filter((item) => item.advertiser_id !== "");
            await Promise.all(
              activities.map(async (item, index) => {
                let res = await db
                  .collection("advertiser")
                  .doc(item.advertiser_id)
                  .get();
                const userData = res.data();
                const username = Boolean(userData.name)
                  ? userData.name.replace(/&/g, "").replace(/ /g, "-")
                  : "name";
                const category_name = Boolean(item.category_name)
                  ? item.category_name.replace(/&/g, "").replace(/ /g, "-")
                  : "category";
                const title = Boolean(item.ad_title)
                  ? item.ad_title.replace(/&/g, "").replace(/ /g, "-")
                  : "activity";
                const city = Boolean(item.address.city)
                  ? item.address.city.replace(/&/g, "").replace(/ /g, "-")
                  : Boolean(item.address.state)
                  ? item.address.state.replace(/&/g, "").replace(/ /g, "-")
                  : "city";
                // item.address.city !== ""
                //   ? item.address.city
                //   : item.address.state !== ""
                //   ? item.address.state
                //   : null;
                let newUrl = `https://www.activities.app/listing-details/${city}/${category_name}/${username}/${title}/${item.id}`;
                const checkXml = result.urlset.url.filter(
                  (urlInfo) => urlInfo.loc[0] === newUrl
                );
                if (checkXml.length === 0) {
                  result.urlset.url.push({
                    loc: [newUrl],
                  });
                }
              })
            );

            // convert SJON objec to XML
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);

            // write updated XML string to a file
            fs.writeFile("build/sitemap.xml", xml, (err) => {
              if (err) {
                throw err;
              }

              console.log(`Updated XML is written to a new file.`);
            });
          }
        });
    });
  });
};

const checkDateAndUpdate = async (sessions = [], docid) => {
  try {
    const curDate = moment().unix();
    const maxSession = sessions.sort(
      (a, b) => moment(a.end_date).unix() - moment(b.end_date).unix()
    )[sessions.length - 1];
    await Promise.all(
      sessions.map(async (sess) => {
        const localTimeStart = moment(sess.start_date).unix();
        const localTimeEnd = moment(sess.end_date).unix();
        let updateDate = {};
        //end and start date is the same
        if (
          moment(sess.start_date).format("YYYY-MM-DD") ===
          moment(sess.end_date).format("YYYY-MM-DD")
        ) {
          if (curDate > localTimeStart) {
            const start_date =
              moment(maxSession.start_date)
                .add(1, "days")
                .format("YYYY-MM-DD") + ` ${sess.start_time}`;
            const end_date =
              moment(maxSession.end_date).add(1, "days").format("YYYY-MM-DD") +
              ` ${sess.end_time}`;
            updateDate = {
              start_date: moment(start_date, "YYYY-MM-DD HH:mm").toDate(),
              end_date: moment(end_date, "YYYY-MM-DD HH:mm").toDate(),
            };
            // console.log("equal----------<", updateDate, start_date, end_date);
          }
        } else {
          if (curDate > localTimeStart) {
            //next date of start date is the same the end_date: start and end date is updated with max session start date + 1, +2 days.
            if (
              moment(sess.start_date).add(1, "days").format("YYYY-MM-DD") ===
              moment(sess.end_date).format("YYYY-MM-DD")
            ) {
              const start_date =
                moment(maxSession.start_date)
                  .add(1, "days")
                  .format("YYYY-MM-DD") + ` ${sess.start_time}`;
              const end_date =
                moment(maxSession.end_date)
                  .add(2, "days")
                  .format("YYYY-MM-DD") + ` ${sess.end_time}`;

              updateDate = {
                start_date: moment(start_date, "YYYY-MM-DD HH:mm").toDate(),
                end_date: moment(end_date, "YYYY-MM-DD HH:mm").toDate(),
              };
              // console.log("next date is equal --------->", updateDate);
            } else {
              //next of start date is not same with end date : only add 1 day of start date
              const start_date = moment(sess.start_date)
                .add(1, "days")
                .format("YYYY-MM-DD HH:mm");
              updateDate = {
                start_date: moment(start_date, "YYYY-MM-DD HH:mm").toDate(),
              };
              if (curDate > localTimeEnd) {
                const end_date =
                  moment(maxSession.end_date)
                    .add(1, "days")
                    .format("YYYY-MM-DD") + ` ${sess.end_time}`;
                updateDate = {
                  ...updateDate,
                  ...{
                    end_date: moment(end_date, "YYYY-MM-DD HH:mm").toDate(),
                  },
                };
              }
              // console.log("not equal-0---------->", updateDate, start_date);
            }
          }
        }
        if (!Object.keys(updateDate).length === false) {
          if (sess.id) {
            await db
              .collection("ad_listing")
              .doc(docid)
              .collection("sessions")
              .doc(sess.id)
              .update(updateDate);
          } else {
            await db.collection("ad_listing").doc(docid).update(updateDate);
          }
        }
      })
    );
    return { status: true };
  } catch (error) {
    console.log(error, "error");
    return { status: false };
  }
};

cron.schedule("0 23 * * *", async function () {
  try {
    console.log("run payment cature function");
    const paymentTransactionDoc = await db
      .collection("user_payment_transaction")
      .where("status", "==", "requires_capture")
      .get();
    if (!paymentTransactionDoc.empty) {
      const paymentTransactionInfo = paymentTransactionDoc.docs.map((doc) =>
        doc.data()
      );
      paymentTransactionInfo.forEach(async (item) => {
        const bookingDoc = await db
          .collection("booking")
          .where("transaction_id", "==", item.id)
          .get();
        // const activitiyDoc = await db.collection("ad_listing").doc(item.ad_listing_id).get();
        if (!bookingDoc.empty) {
          let startDate = null;
          const currentDate = moment().unix();
          const bookingInfo = bookingDoc.docs.map((doc) => doc.data());
          if (bookingInfo[0]["extra_session_id"] === "") {
            const activityDoc = await db
              .collection("ad_listing")
              .doc(bookingInfo[0].ad_id)
              .get();
            if (activityDoc.exists) {
              const activityData = activityDoc.data();
              startDate = activityData.start_date;
            }
          } else {
            const activityDoc = await db
              .collection("ad_listing")
              .doc(bookingInfo[0].ad_id)
              .collection("sessions")
              .doc(bookingInfo[0]["extra_session_id"])
              .get();
            if (activityDoc.exists) {
              const activityData = activityDoc.data();
              startDate = activityData.start_date;
            }
          }
          if (startDate) {
            if (
              bookingInfo[0]["status"] !== "2" &&
              startDate.seconds - currentDate < 86400
            ) {
              const paymentIntents = await stripe.paymentIntents.retrieve(
                item.id
              );
              if (
                paymentIntents.status !== "canceled" &&
                paymentIntents.livemode === true
              ) {
                const paymentIntent = await stripe.paymentIntents.capture(
                  item.id
                );
                const newPayment = await db
                  .collection("user_payment_transaction")
                  .doc(item.id)
                  .set(paymentIntent, { merge: true });
                console.log(newPayment, "newPayment");
              } else {
                await db
                  .collection("user_payment_transaction")
                  .doc(item.id)
                  .set(paymentIntents, { merge: true });
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

cron.schedule("0 22 * * *", async function () {
  try {
    console.log("cron cycle of activity run...");
    const adRes = await db
      .collection("ad_listing")
      .where("status", "==", "0")
      .get();
    if (!adRes.empty) {
      const adlisting = await adRes.docs.map((doc) => doc.data());
      await Promise.all(
        adlisting.map(async (list) => {
          let allSessions = [];
          const extraSessionRes = await db
            .collection("ad_listing")
            .doc(list.id)
            .collection("sessions")
            .get();
          if (!extraSessionRes.empty) {
            const extraSession = extraSessionRes.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            extraSession.map(async (session) => {
              session["start_date"] = moment(
                session.start_date.seconds * 1000 +
                  session.start_date.nanoseconds / 1000000000
              ).format("YYYY-MM-DD HH:mm");
              session["end_date"] = moment(
                session.end_date.seconds * 1000 +
                  session.end_date.nanoseconds / 1000000000
              ).format("YYYY-MM-DD HH:mm");
              allSessions = [...allSessions, session];
            });
          }
          const startDate = moment(
            (list.start_date.seconds +
              list.start_date.nanoseconds / 1000000000) *
              1000
          ).format("YYYY-MM-DD HH:mm");
          const endDate = moment(
            (list.end_date.seconds + list.end_date.nanoseconds / 1000000000) *
              1000
          ).format("YYYY-MM-DD HH:mm");
          allSessions = [
            ...allSessions,
            {
              start_date: startDate,
              end_date: endDate,
              start_time: list.start_time,
              end_time: list.end_time,
            },
          ];
          // promises.push(checkDateAndUpdate(allSessions, list.id));
          // await checkDateAndUpdate(allSessions, list.id);
          await checkDateAndUpdate(allSessions, list.id);
        })
      );
    }
  } catch (error) {
    console.log(error, "error");
  }
});

cron.schedule("0 10 * * *", async function () {
  try {
    console.log("check mail sended");
    const bookingsRes = await db
      .collection("booking")
      .where("status", "==", "0")
      .get();
    if (!bookingsRes.empty) {
      const curDate = moment().unix();
      const bookings = bookingsRes.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      bookings.forEach(async (item) => {
        let startDate = null;
        let activityImage = "";
        const sendEamil =
          item.sended_email === undefined ? false : item.sended_email;
        if (!sendEamil) {
          const activityRes = await db
            .collection("ad_listing")
            .doc(item.ad_id)
            .get();
          if (activityRes.exists) {
            activityImage =
              activityRes.data().picture.length > 0
                ? activityRes.data().picture[0]
                : "";
            if (item.extra_session_id !== "") {
              const extraActivityRes = await db
                .collection("ad_listing")
                .doc(item.ad_id)
                .collection("sessions")
                .doc(item.extra_session_id)
                .get();
              if (extraActivityRes.exists) {
                startDate = extraActivityRes.data().start_date;
              }
            } else {
              startDate = activityRes.data().start_date;
            }
          }
          if (startDate !== null && curDate - startDate.seconds > 86400) {
            const userRes = await db.collection("user").doc(item.user_id).get();
            if (userRes.exists) {
              const userEmail = userRes.data().email;
              const name = userRes.data().name;
              sendEmailSIB(
                userEmail,
                name,
                activityImage,
                activityRes.data().ad_title,
                activityRes.data().id,
                item.user_id,
                item.id
              );
            }
          }
        }
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app
  .use(compression())
  .use(bodyParser.json({ type: "*/*" }))
  .use(cors())
  .options("*", cors())
  .use(express.static(path.resolve(__dirname, "build")))
  .get("*", [verifyToken, createAccountLimiter], async (req, res) => {
    try {
      const advertiser_email = req.query.email;
      const { advertiserid, email } = req;
      if (advertiser_email === email) {
        if (req.originalUrl.includes("api/activities")) {
          const activities = await getAdvertiserActivities(advertiserid);
          res.status(200).send(activities);
        } else if (req.originalUrl.includes("api/bookings")) {
          let bookings = [];
          const { advertiserid } = req;
          const bookingRes = await db
            .collection("booking")
            .where("advertiser_id", "==", advertiserid)
            .where("status", "==", "0")
            .get();
          if (!bookingRes.empty) {
            const bookinglist = bookingRes.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            await Promise.all(
              bookinglist.map(async (item) => {
                const activityRes = await db
                  .collection("ad_listing")
                  .doc(item.ad_id)
                  .get();
                if (activityRes.exists) {
                  item["activity"] = activityRes.data();
                  bookings.push(item);
                }
              })
            );
          }
          res.status(200).send(bookings);
        } else {
          res.sendFile(path.resolve(__dirname, "build/index.html"));
        }
      } else {
        res.status(403).send({
          error: "Your Email and APIkKEY is not matched.Please try again",
        });
      }
    } catch (error) {
      console.log(error, "error");
      res.status(500).send({ status: false, msg: error.message });
    }
  })
  //for payment
  .post("/api/test", async (req, res) => {
    try {
      const { id, bookingData, email } = req.body;
      const customers = await stripe.customers.list();
      let userInfo = customers.data.filter((item) => item.email === email);
      if (userInfo.length === 0) {
        const customer = await stripe.customers.create({
          email: email,
          payment_method: id,
        });
        userInfo = [customer];
      }
      let transactionInfo = [];
      await Promise.all(
        bookingData.map(async (item) => {
          let amount = item.price,
            couponType = "";
          if (item.coupon_code !== "") {
            const couponDoc = await db
              .collection("coupon")
              .doc(item.coupon_code)
              .get();
            couponType = couponDoc.data().type_coupon;
            await db
              .collection("coupon")
              .doc(item.coupon_code)
              .update({ used: increment });
            amount = item.price_paid;
          }
          if (item.price_paid !== undefined) {
          }
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: item.priceCurrency
              ? item.priceCurrency.toLowerCase()
              : "usd",
            payment_method_types: {
              0: "card",
            },
            customer: userInfo[0].id,
            metadata: { advertiserId: item.listingData.advertiser_id },
            capture_method: "manual",
          });
          const paymentIntentconfirm = await stripe.paymentIntents.confirm(
            paymentIntent.id,
            {
              payment_method: id,
              save_payment_method: "true",
            }
          );
          if (couponType !== "" && couponType === "advertiser") {
            await db.collection("booking").doc(item.id).update({
              transaction_id: paymentIntentconfirm.id,
              status: "0",
              price: item.price_paid,
            });
          } else {
            await db.collection("booking").doc(item.id).update({
              transaction_id: paymentIntentconfirm.id,
              price: item.price,
              status: "0",
            });
          }
          transactionInfo = [...transactionInfo, paymentIntentconfirm];
        })
      );
      res.json({ paymentIntent: transactionInfo });
    } catch (error) {
      res.json(error);
    }
  })
  .post("/api/attachPaymentMethod", async (req, res) => {
    try {
      const pm = req.body.pm;
      const email = req.body.email;
      const customers = await stripe.customers.list();
      const userInfo = customers.data.filter((item) => item.email === email);
      if (userInfo.length === 0) {
        const customer = await stripe.customers.create({
          email: email,
          payment_method: pm,
        });
        res.json({ customer: customer.id });
      } else {
        const customer = await stripe.paymentMethods.attach(pm, {
          customer: userInfo[0].id,
        });
        res.json({ customer: customer.customer });
      }
    } catch (error) {
      res.json({ msg: error });
    }
  })
  .post("/api/detachPaymentMethod", async (req, res) => {
    try {
      const pm = req.body.pm;
      const email = req.body.email;
      const customers = await stripe.customers.list();
      const userInfo = customers.data.filter((item) => item.email === email);
      if (userInfo.length === 0) {
      } else {
        await stripe.paymentMethods.detach(pm);
      }
      res.json({ msg: true });
    } catch (error) {
      res.json({ msg: error });
    }
  })
  .post("/api/create-subscription", async (req, res) => {
    try {
      const { customerId, paymentMethodId, priceId } = req.body;
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId.paymentMethodId,
        },
      });
      //create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: process.env[priceId] }],
        expand: ["latest_invoice.payment_intent"],
      });
      res.json(subscription);
    } catch (error) {
      console.log(error);
      // res.json(error);
    }
  })
  .post("/api/retry-invoice", async (req, res) => {
    try {
      await stripe.paymentMethods.attach(req.body.paymentMethodId, {
        customer: req.body.customerId,
      });
      await stripe.customers.update(req.body.customerId, {
        invoice_settings: {
          default_payment_method: req.body.paymentMethodId,
        },
      });
    } catch (error) {
      // in case card_decline error
      return res
        .status("402")
        .send({ result: { error: { message: error.message } } });
    }

    const invoice = await stripe.invoices.retrieve(req.body.invoiceId, {
      expand: ["payment_intent"],
    });
    res.send(invoice);
  })
  .post("/api/cancelBooking", async (req, res) => {
    try {
      const { chargeId, activityId, extraId } = req.body;

      const paymentIntent = await stripe.paymentIntents.cancel(chargeId);
      if (extraId === "") {
        await db
          .collection("ad_listing")
          .doc(activityId)
          .update({ remaing_availability: increment });
      } else {
        await db
          .collection("ad_listing")
          .doc(activityId)
          .collection("sessions")
          .doc(extraId)
          .update({ remaing_availability: increment });
      }
      res.json(paymentIntent);
    } catch (error) {
      console.log(error, "refund");

      res.json(error);
    }
  })
  .post("/api/boostPaid", async (req, res) => {
    const pm = req.body.pm;
    const email = req.body.email;
    const amount = req.body.amount;
    const customers = await stripe.customers.list();
    let userInfo = customers.data.filter((item) => item.email === email);
    if (userInfo.length === 0) {
      const customer = await stripe.customers.create({
        email: email,
        payment_method: pm,
      });
      userInfo = [customer];
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: {
        0: "card",
      },
      customer: userInfo[0].id,
    });
    const paymentIntentconfirm = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: pm,
        save_payment_method: "true",
      }
    );
    res.json(paymentIntentconfirm);
  })
  .post("/api/getIpAddress", async (req, res) => {
    const ipAddress = await axios.get("https://api.ipify.org/?format=json");
    res.send(ipAddress.data.ip);
  })
  .post("/api/create-accesstoken", async (req, res) => {
    try {
      const { advertiserid, email } = req.body;
      if (!advertiserid || !email) {
        res.status(401).send({ error: "Please authenticate!" });
      } else {
        const secretId = advertiserid.split("").reverse().join("");

        const api_key = jwt.sign(
          { advertiserid: secretId, email: email },
          secret_key + "@_arc_@" + email,
          {}
        );

        const encrypted = CryptoJS.AES.encrypt(
          api_key,
          secret_crypto_key
        ).toString();

        await db
          .collection("advertiser")
          .doc(advertiserid)
          .update({ api_key: encrypted });
        res.status(201).send({ apiKey: encrypted });
      }
    } catch (error) {
      res
        .status(403)
        .send({ error: "Advertiser don't exist. Please try again" });
    }
  })
  .put(
    "/api/activity/:activityid",
    [verifyToken, createAccountLimiter],
    async (req, res) => {
      try {
        const { activityid } = req.params;
        const { advertiserid, email } = req;
        if (!email || !activityid) {
          res.status(404).send({ error: "Invalid the url" });
        } else {
          const activityRes = await db
            .collection("ad_listing")
            .doc(activityid)
            .get();
          if (activityRes.exists) {
            const activity = activityRes.data();
            const {
              option_field1_title,
              option_field2_title,
              ad_title,
              ad_description,
              video,
              custom_terms,
            } = req.body;

            activity["option_field1_title"] =
              option_field1_title === "" || option_field1_title
                ? option_field1_title
                : activity.option_field1_title;
            activity["option_field2_title"] =
              option_field2_title === "" || option_field2_title
                ? option_field2_title
                : activity.option_field2_title;
            activity["ad_title"] =
              ad_title === "" || ad_title ? ad_title : activity.ad_title;
            activity["ad_description"] =
              ad_description === "" || ad_description
                ? ad_description
                : activity.ad_description;
            activity["video"] = video === "" || video ? video : activity.video;
            console.log(activity["video"], "video");
            activity["custom_terms"] =
              custom_terms === "" || custom_terms
                ? custom_terms
                : activity.custom_terms;
            await db
              .collection("ad_listing")
              .doc(activityid)
              .set(activity, { merge: true });
            res.status(200).send(activity);
          } else {
            res.status(404).send({
              error: "Could not access activity. Please Check activityID.",
            });
          }
        }
        console.log(activityid, advertiserid);
        res.status(200).send();
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    }
  )
  .post("/advertiser-add-card", (req, res) => {
    var advertiser_id = req.body.advertiser_id;
    var payment_method_id = req.body.payment_method_id;
    var customer;
    console.log(advertiser_id);

    if (advertiser_id && payment_method_id) {
      var query = db
        .collection("advertiser")
        .where("id", "==", advertiser_id)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            res.json({ status: 401, message: "Invalid input data", data: "" });
          } else {
            snapshot.forEach((doc) => {
              var stripe_id = doc.data().stripe_id;
              if (stripe_id === undefined) {
                stripe_id = "";
              }
              if (stripe_id === "") {
                stripe.customers
                  .create({
                    email: doc.data().email,
                  })
                  .then((customer) => {
                    console.log(customer.id);

                    db.collection("advertiser")
                      .doc(advertiser_id)
                      .update({ stripe_id: customer.id })
                      .then(() => {
                        stripe.paymentMethods
                          .retrieve(payment_method_id)
                          .then((paymentMethod) => {
                            const customerSource = customer;

                            db.collection("advertiser_payment_method")
                              .doc(paymentMethod.id)
                              .set(paymentMethod, { merge: true })
                              .then(() => {
                                db.collection("advertiser_payment_method")
                                  .doc(paymentMethod.id)
                                  .update({ advertiser_id: advertiser_id })
                                  .then(() => {
                                    res.json({
                                      status: 200,
                                      message: "Payment method added",
                                      data: "",
                                    });
                                  });
                              });
                          });
                      });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                customer = stripe.customers.retrieve(stripe_id);
                stripe.paymentMethods
                  .retrieve(payment_method_id)
                  .then((paymentMethod) => {
                    const customerSource = customer;

                    db.collection("advertiser_payment_method")
                      .doc(paymentMethod.id)
                      .set(paymentMethod, { merge: true })
                      .then(() => {
                        db.collection("advertiser_payment_method")
                          .doc(paymentMethod.id)
                          .update({ advertiser_id: advertiser_id })
                          .then(() => {
                            res.json({
                              status: 200,
                              message: "Payment method added",
                              data: "",
                            });
                          });
                      });
                  });
              }
            });
          }
        })
        .catch((err) => {
          res.json({
            status: 401,
            message: "Error getting documents order",
            data: "",
          });
        });
    } else {
      res.json({ status: 401, message: "Missing parameters", data: "" });
    }
  })
  .post("/api/cancel-user-booking-payment-from-user", async (req, res) => {
    var user_id = req.body.user_id;
    var booking_id = req.body.booking_id;

    if (user_id && booking_id) {
      await db
        .collection("booking")
        .doc(booking_id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            res.json({ status: 401, message: "Invalid input data", data: "" });
          } else {
            var transaction_id = doc.data().transaction_id;
            var ad_id = doc.data().ad_id;
            var extra_session_id = doc.data().extra_session_id;
            user_id = doc.data().user_id;

            console.log("transaction_id : " + transaction_id);

            if (transaction_id == "") {
              res.json({
                status: 401,
                message: "Invalid input data",
                data: "",
              });
            } else {
              db.collection("user_payment_transaction")
                .where("id", "==", transaction_id)
                .get()
                .then((snapshot) => {
                  if (snapshot.empty) {
                    res.json({
                      status: 401,
                      message: "Invalid input data",
                      data: "",
                    });
                  } else {
                    snapshot.forEach((docData) => {
                      var payment_intent =
                        docData.data().charges["data"][0]["payment_intent"];

                      console.log("payment_intent : " + payment_intent);

                      stripe.paymentIntents
                        .cancel(payment_intent)
                        .then((paymentRefund) => {
                          console.log("paymentRefund : " + paymentRefund);

                          db.collection("user_payment_transaction")
                            .doc(paymentRefund.id)
                            .set(paymentRefund, { merge: true })
                            .then(() => {
                              console.log(paymentRefund + ":paymentRefund");
                              db.collection("user_payment_transaction")
                                .doc(paymentRefund.id)
                                .update({ user_id: user_id })
                                .then(() => {
                                  db.collection("booking")
                                    .doc(booking_id)
                                    .update({
                                      status: "2",
                                      cancel_transaction_id: paymentRefund.id,
                                    })
                                    .then(() => {
                                      //check extra_session_id
                                      console.log("getseat:");
                                      if (extra_session_id === "") {
                                        db.collection("ad_listing")
                                          .where("id", "==", ad_id)
                                          .get()
                                          .then((snapshot) => {
                                            snapshot.forEach((getDocData) => {
                                              var getSeat =
                                                getDocData.data()
                                                  .remaing_availability;
                                              getSeat = getSeat + 1;
                                              console.log(
                                                "getSeat : " + getSeat
                                              );

                                              db.collection("ad_listing")
                                                .doc(ad_id)
                                                .update({
                                                  remaing_availability: getSeat,
                                                })
                                                .then(() => {
                                                  res.json({
                                                    status: 200,
                                                    message:
                                                      "Payment Refund successfully completed",
                                                    data: "",
                                                  });
                                                });
                                            });
                                          })
                                          .catch((err) => {});
                                      } else {
                                        db.collection("ad_listing")
                                          .doc(ad_id)
                                          .collection("sessions")
                                          .doc(extra_session_id)
                                          .get()
                                          .then((getDocData) => {
                                            var getSeat =
                                              getDocData.data()
                                                .remaing_availability;
                                            getSeat = getSeat + 1;
                                            console.log(
                                              "getSeat of extra_session : " +
                                                getSeat
                                            );

                                            db.collection("ad_listing")
                                              .doc(ad_id)
                                              .collection("sessions")
                                              .doc(extra_session_id)
                                              .update({
                                                remaing_availability: getSeat,
                                              })
                                              .then(() => {
                                                res.json({
                                                  status: 200,
                                                  message:
                                                    "Payment Refund successfully completed",
                                                  data: "",
                                                });
                                                //--
                                              });
                                          })
                                          .catch((err) => {});
                                      }
                                    });
                                });
                            });
                        })
                        .catch((error) => {
                          console.log("error : " + error);

                          res.json({
                            status: 401,
                            message:
                              "Refund request cancelled, Please try again",
                            data: "",
                          });
                        });
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: 401,
                    message: "Error getting transaction documents",
                    data: "",
                  });
                });
            }
          }
        })
        .catch((err) => {
          res.json({
            status: 401,
            message: "Error getting booking documents",
            data: "",
          });
        });
    } else {
      res.json({ status: 401, message: "Missing parameters", data: "" });
    }
  })
  .post(
    "/api/cancel-camp-user-booking-payment-from-advertiser",
    async (req, res) => {
      var ad_id = req.body.ad_id;
      //var advertiser_id = req.body.advertiser_id;
      //var amount = req.body.amount;
      var curDate = moment().unix();

      if (ad_id) {
        await db
          .collection("booking")
          .where("ad_id", "==", ad_id)
          .where("status", "==", "0")
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              res.json({
                status: 401,
                message: "Invalid input data",
                data: "",
              });
            } else {
              snapshot.forEach(async (doc) => {
                var transaction_id = doc.data().transaction_id;
                var booking_id = doc.id;
                var ad_id = doc.data().ad_id;
                var user_id = doc.data().user_id;
                var advertiser_id = doc.data().advertiser_id;
                var extra_session_id = doc.data().extra_session_id;
                var start_date = null;
                if (extra_session_id !== "") {
                  var activityRes = await db
                    .collection("ad_listing")
                    .doc(ad_id)
                    .collection("sessions")
                    .doc(extra_session_id)
                    .get();
                  if (activityRes.exists) {
                    start_date = activityRes.data().start_date.seconds;
                  }
                } else {
                  var activityDoc = await db
                    .collection("ad_listing")
                    .doc(ad_id)
                    .get();
                  if (activityDoc.exists) {
                    start_date = activityDoc.data().start_date.seconds;
                  }
                }

                console.log(
                  "transaction_id : " + transaction_id,
                  "start Date:" + start_date
                );

                if (transaction_id !== "") {
                  db.collection("user_payment_transaction")
                    .doc(transaction_id)
                    .get()
                    .then(async (snapshot) => {
                      if (snapshot.exists) {
                        var paymentRefund = null;
                        var payment_intent =
                          snapshot.data().charges["data"][0]["payment_intent"];
                        var amount = snapshot.data().amount / 100;
                        amount = parseFloat(amount);

                        console.log("payment_intent : " + payment_intent);
                        if (snapshot.data().status === "requires_capture") {
                          paymentRefund = await stripe.paymentIntents.cancel(
                            payment_intent
                          );
                        } else if (
                          snapshot.data().status === "succeeded" &&
                          start_date &&
                          curDate - start_date < 86400
                        ) {
                          console.log("hello");
                          paymentRefund = await stripe.refunds.create({
                            amount: amount,
                            payment_intent: payment_intent,
                            refund_application_fee: false,
                          });
                        }
                        if (paymentRefund) {
                          console.log(paymentRefund + ":paymentRefund");
                          db.collection("user_payment_transaction")
                            .doc(paymentRefund.id)
                            .set(paymentRefund, { merge: true })
                            .then(() => {
                              db.collection("user_payment_transaction")
                                .doc(paymentRefund.id)
                                .update({ user_id: user_id })
                                .then(() => {
                                  db.collection("booking")
                                    .doc(booking_id)
                                    .update({
                                      status: "2",
                                      cancel_transaction_id: paymentRefund.id,
                                    })
                                    .then(() => {
                                      db.collection("advertiser")
                                        .doc(advertiser_id)
                                        .get((docAdvertiserData) => {
                                          var site_credit =
                                            docAdvertiserData.data();
                                          if (
                                            paymentRefund.status === "succeeded"
                                          ) {
                                            site_credit = site_credit - amount;
                                          }
                                          console.log(
                                            site_credit + " : site credit",
                                            amount
                                          );
                                          db.collection("advertiser")
                                            .doc(advertiser_id)
                                            .update({
                                              site_credit: site_credit,
                                            });
                                        });
                                    });
                                });
                            })
                            .catch((error) => {
                              console.log(error, "merge paymentRefund");
                            });
                        }
                      }
                    })
                    .catch((err) => {
                      console.log(err, "payment_transaction");
                      // res.json({
                      //   status: 401,
                      //   message: 'Error getting transaction documents',
                      //   data: '',
                      // })
                    });
                }
              });
            }
          })
          .catch((err) => {
            res.json({
              status: 401,
              message: "Error getting booking documents",
              data: "",
            });
          });
        await db
          .collection("ad_listing")
          .doc(ad_id)
          .update({ status: "4" })
          .then(() => {
            res.json({
              status: 200,
              message: "Payment Refund successfully completed",
              data: "",
            });
          });
      } else {
        res.json({ status: 401, message: "Missing parameters", data: "" });
      }
    }
  )
  .post("/user-make-payment", (req, res) => {
    var user_id = req.body.user_id;
    var payment_method_id = req.body.payment_method_id;
    var amount = req.body.amount;
    var booking_id = req.body.booking_id;
    // var application_fee_amount = 0 //req.body.application_fee_amount;
    var application_fee_amount = req.body.application_fee_amount;
    var advertiser_id = req.body.advertiser_id;

    var customer;
    console.log(amount);
    amount = parseFloat(amount);
    application_fee_amount = parseFloat(application_fee_amount);

    if (user_id && payment_method_id && amount && booking_id && advertiser_id) {
      var query = db
        .collection("user")
        .where("id", "==", user_id)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            res.json({
              status: 401,
              message: "Invalid input data",
              data: "",
            });
          } else {
            snapshot.forEach((doc) => {
              var stripe_id = doc.data().stripe_id;
              var email_id = doc.data().email;
              if (stripe_id == "") {
                res.json({
                  status: 401,
                  message: "Error getting while get the stripe id",
                  data: "",
                });
              } else {
                // console.log(
                //   application_fee_amount,
                //   advertiser_id,
                //   booking_id,
                //   amount,
                //   payment_method_id,
                //   user_id,
                //   "hello world"
                // );
                stripe.paymentIntents
                  .create({
                    amount: amount,
                    currency: "usd",
                    payment_method_types: ["card"],
                    customer: stripe_id,
                    capture_method: "manual",
                    // application_fee_amount: application_fee_amount,
                  })
                  .then((response) => {
                    const resPayment = stripe.paymentIntents
                      .confirm(response.id, {
                        payment_method: payment_method_id,
                        save_payment_method: true,
                      })
                      .then((responsePayment) => {
                        console.log(responsePayment, "response");
                        db.collection("user_payment_transaction")
                          .doc(responsePayment.id)
                          .set(responsePayment, { merge: true })
                          .then(() => {
                            db.collection("user_payment_transaction")
                              .doc(responsePayment.id)
                              .update({
                                user_id: user_id,
                                application_booking_fees:
                                  application_fee_amount,
                              })
                              .then(() => {
                                db.collection("booking")
                                  .doc(booking_id)
                                  .update({
                                    transaction_id: responsePayment.id,
                                    status: "0",
                                    fee: application_fee_amount,
                                  })
                                  .then(() => {
                                    // new NotificationController().sendMailToUserAboutBookCamp(
                                    //   user_id,
                                    //   booking_id
                                    // );
                                    // new NotificationController().sendMailToAdvertiserAboutBookCamp(
                                    //   advertiser_id,
                                    //   booking_id
                                    // );
                                    res.json({
                                      status: 200,
                                      message: "Payment successfully completed",
                                      data: responsePayment.id,
                                    });
                                  });
                              });
                          });
                      })
                      .catch((error) => {
                        console.log(error, "error");
                        res.json({
                          status: 401,
                          message:
                            "Error getting while updating the payment data",
                          data: "",
                        });
                      });
                  })
                  .catch((error) => {
                    res.json({
                      status: 401,
                      message: "Error getting while making payment",
                      data: "",
                    });
                  }); //
              }
            });
          }
        })
        .catch((err) => {
          res.json({
            status: 401,
            message: "Error getting documents",
            data: "",
          });
        });
    } else {
      res.json({ status: 401, message: "Missing parameters", data: "" });
    }
  })

  //end

  .listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
    generateSitemap();
  });
