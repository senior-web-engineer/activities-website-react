import { newDate } from "lib/dateLib"; // import { GOOGLE_SIGN_SUCCESS } from "../actionTypes";
import { isEmpty } from "lodash";
import moment from "moment";
import publicIp from "public-ip";
import toastr from "toastr";

import firebase, {
  auth,
  db,
  facebookProvider,
  googleProvider,
  storage,
} from "../../services/firebase";
import { sendNewProviderEmail } from "./sendInBlueAction";

let user = {};
// let childImage = [];
export const signInWithGoogle =
  (userType, history, businessType = "", type = "", businessInfo = {}) =>
  async (dispatch) => {
    try {
      let ip = "91.218.96.148";
      const ipRes = await publicIp.v4();
      const flag = ipRes.includes("188.43");
      if (!flag) {
        ip = ipRes;
      }
      const res = await auth.signInWithPopup(googleProvider);
      if (type !== "") {
        const userInfo = {
          id: res.user.uid,
          name: res.additionalUserInfo.profile.name,
          profile_picture: res.additionalUserInfo.profile.picture,
          email: res.additionalUserInfo.profile.email,
          timestamp: newDate(),
          site_credit: 0,
          status: "0",
          allow_account: true,
          holdon_account: false,
          rating: 0,
          business_type: businessType,
          login_type: "2",
          date: moment().format("MM/DD/YYYY"),
          stripe_id: "",
          registered: true,
          ip: ip,
          subscription_plan: "",
        };
        await db
          .collection("advertiser")
          .doc(res.user.uid)
          .set(userInfo, { merge: true });
        sessionStorage.setItem("role", JSON.stringify(userType));
        sessionStorage.setItem("user", JSON.stringify(userInfo));
        // addSIBContact(userInfo)
        history.push("/business-profile");
        toastr.success("Sign in successfully with advertiser");
      } else if (res.additionalUserInfo.isNewUser) {
        if (userType === "user") {
          const userInfo = {
            id: res.user.uid,
            name: res.additionalUserInfo.profile.name,
            profile_picture: res.additionalUserInfo.profile.picture,
            login_type: "2",
            status: "0",
            phone_number: "",
            email: res.additionalUserInfo.profile.email,
            timestamp: newDate(),
            ip: ip,
          };
          await db
            .collection("user")
            .doc(res.user.uid)
            .set(userInfo, { merge: true });
          setBookingData(res.user.id);
          sessionStorage.setItem("role", JSON.stringify(userType));
          sessionStorage.setItem("user", JSON.stringify(userInfo));
          // addSIBContact(userInfo)
          history.push("/");
          toastr.success("Sign in successfully with user");
          // toastr.success("Please wait for allowing by admin!");
        } else {
          const userInfo = {
            id: res.user.uid,
            name: res.additionalUserInfo.profile.name,
            profile_picture: res.additionalUserInfo.profile.picture,
            email: res.additionalUserInfo.profile.email,
            timestamp: newDate(),
            site_credit: 0,
            status: "0",
            allow_account: true,
            holdon_account: false,
            rating: 0,
            registered: true,
            business_type: businessType,
            login_type: "2",
            date: moment().format("MM/DD/YYYY"),
            stripe_id: "",
            ip: ip,
            subscription_plan: "",
          };
          await db
            .collection("advertiser")
            .doc(res.user.uid)
            .set(userInfo, { merge: true });
          sessionStorage.setItem("role", JSON.stringify(userType));
          sessionStorage.setItem("user", JSON.stringify(userInfo));
          // addSIBContact(userInfo)
          if (!isEmpty(businessInfo)) {
            setClaimActivity(businessInfo, res.user.uid);
          }
          history.push("/business-profile");
          toastr.success("Sign in successfully with advertiser");
        }
      } else {
        const doc = await db.collection(userType).doc(res.user.uid).get();
        console.log(doc, userType, res, "hello----");
        user = doc.data();
        if (!user) {
          toastr.warning("You are not registered as " + userType);
          return false;
        }
        setSign(userType, history, user);
      }
    } catch (error) {
      toastr.warning(error.message);
      return;
    }
  };

export const signInWithFacebook =
  (userType, history, businessType, type = "", businessInfo = {}) =>
  async (dispatch) => {
    try {
      const ip = await publicIp.v4();
      const res = await auth.signInWithPopup(facebookProvider);
      if (type !== "") {
        const userInfo = {
          id: res.user.uid,
          name: res.additionalUserInfo.profile.name,
          profile_picture: res.additionalUserInfo.profile.picture,
          email: res.additionalUserInfo.profile.email,
          timestamp: newDate(),
          site_credit: 0,
          status: "0",
          rating: 0,
          registered: true,
          allow_account: true,
          holdon_account: false,
          business_type: businessType,
          login_type: "1",
          date: moment().format("MM/DD/YYYY"),
          stripe_id: "",
          ip: ip,
          subscription_plan: "",
        };
        await db
          .collection("advertiser")
          .doc(res.user.uid)
          .set(userInfo, { merge: true });
        sessionStorage.setItem("user", JSON.stringify("user"));
        sessionStorage.setItem("role", JSON.stringify(userType));
        // addSIBContact(userInfo)
        sendNewProviderEmail(userInfo?.email, userInfo?.name);
        history.push("/business-profile");
        toastr.success("Sign in successfully with advertiser");
      } else if (res.additionalUserInfo.isNewUser) {
        if (userType === "user") {
          const userInfo = {
            id: res.user.uid,
            name: res.additionalUserInfo.profile.name,
            profile_picture: res.additionalUserInfo.profile.picture,
            login_type: "0",
            status: "0",
            phone_number: "",
            email: res.additionalUserInfo.profile.email,
            timestamp: newDate(),
            ip: ip,
          };
          await db
            .collection("user")
            .doc(res.user.uid)
            .set(userInfo, { merge: true });
          setBookingData(res.user.id);
          sessionStorage.setItem("role", JSON.stringify(userType));
          sessionStorage.setItem("user", JSON.stringify(userInfo));
          // addSIBContact(userInfo)
          history.push("/");
          toastr.success("Sign in successfully with user");
          // toastr.success("Please wait for allowing by admin!");
        } else {
          const userInfo = {
            id: res.user.uid,
            name: res.additionalUserInfo.profile.name,
            profile_picture: res.additionalUserInfo.profile.picture,
            email: res.additionalUserInfo.profile.email,
            timestamp: newDate(),
            site_credit: 0,
            status: "0",
            rating: 0,
            registered: true,
            allow_account: true,
            holdon_account: false,
            business_type: businessType,
            login_type: "1",
            date: moment().format("MM/DD/YYYY"),
            stripe_id: "",
            ip: ip,
            subscription_plan: "",
          };
          await db
            .collection("advertiser")
            .doc(res.user.uid)
            .set(userInfo, { merge: true });
          sessionStorage.setItem("user", JSON.stringify("user"));
          sessionStorage.setItem("role", JSON.stringify(userType));
          // addSIBContact(userInfo)
          if (!isEmpty(businessInfo)) {
            setClaimActivity(businessInfo, res.user.uid);
          }
          sendNewProviderEmail(userInfo?.email, userInfo?.name);
          history.push("/business-profile");
          toastr.success("Sign in successfully with advertiser");
        }
      } else {
        const doc = await db.collection(userType).doc(res.user.uid).get();
        user = doc.data();
        if (!user) {
          toastr.warning("You are not registered as " + userType);
          return false;
        }
        setSign(userType, history, user);
      }
    } catch (error) {
      toastr.warning(error.message);
      return;
    }
    return userType;
  };

export const signUp =
  (userData, history, userType, type = "", businessInfo = {}) =>
  async (dispatch) => {
    try {
      const ip = await publicIp.v4();
      let res = null;
      if (type !== "") {
        res = await auth.signInWithEmailAndPassword(
          userData.email,
          userData.password
        );
      } else {
        res = await auth.createUserWithEmailAndPassword(
          userData.email,
          userData.password
        );
      }
      if (userType === "user") {
        const user = {
          id: res.user.uid,
          name: userData.name,
          profile_picture: "",
          login_type: "0",
          email: userData.email,
          status: "0",
          phone_number: userData.phone,
          timestamp: newDate(),
          ip: ip,
        };
        await db.collection(userType).doc(res.user.uid).set(user);
        setBookingData(res.user.uid);
        // sessionStorage.setItem("user", JSON.stringify(user));
        // sessionStorage.setItem("role", JSON.stringify(userType));
        // toastr.success("Sign in successfully with user");
      } else {
        const extraInfo = {
          timestamp: newDate(),
          site_credit: 0,
          rating: 0,
          login_type: "0",
          status: "0",
          date: moment().format("MM/DD/YYYY"),
          id: res.user.uid,
          allow_account: true,
          holdon_account: false,
          stripe_id: "",
          subscription_plan: "",
          registered: true,
          profile_picture: "",
          ip: ip,
        };
        userData = { ...userData, ...extraInfo };
        delete userData.password;
        await db.collection(userType).doc(res.user.uid).set(userData);
        if (!isEmpty(businessInfo)) {
          setClaimActivity(businessInfo, res.user.uid);
        }
        userData["sign_type"] = "password";
        sendNewProviderEmail(userData?.email, userData?.name);
      }
      history.push({
        pathname: "/verify-email-check",
        state: {
          email: res.user.email,
          verifyStatus: res.user.emailVerified,
          type: userType,
          userData: userData,
        },
      });
      // addSIBContact(userData)
    } catch (error) {
      toastr.warning(error.message);
      return;
    }
    return true;
  };

// export const reSignUp = (userData, history, userType) => async (dispatch) => {
//   try {
//     const ip = await publicIp.v4();
//     const res = await auth.createUserWithEmailAndPassword(
//       userData.email,
//       userData.password
//     );
//     if (userType === "user") {
//       const user = {
//         id: res.user.uid,
//         name: userData.name,
//         profile_picture: "",
//         login_type: "0",
//         email: userData.email,
//         status: "0",
//         phone_number: userData.phone,
//         timestamp: newDate(),
//         ip: ip,
//       };
//       await db.collection(userType).doc(res.user.uid).set(user);
//       setBookingData(res.user.uid);
//       // sessionStorage.setItem("user", JSON.stringify(user));
//       // sessionStorage.setItem("role", JSON.stringify(userType));
//       // toastr.success("Sign in successfully with user");
//     } else {
//       const extraInfo = {
//         timestamp: newDate(),
//         site_credit: 0,
//         rating: 0,
//         login_type: "0",
//         status: "0",
//         date: moment().format("MM/DD/YYYY"),
//         id: res.user.uid,
//         allow_account: true,
//         holdon_account: false,
//         stripe_id: "",
//         subscription_plan: "",
//         profile_picture: "",
//         ip: ip,
//       };
//       userData = { ...userData, ...extraInfo };
//       delete userData.password;
//       await db.collection(userType).doc(res.user.uid).set(userData);
//       userData["sign_type"] = "password";
//       sendNewProviderEmail(userData?.email, userData?.name);
//     }
//     history.push({
//       pathname: "/verify-email-check",
//       state: {
//         email: res.user.email,
//         verifyStatus: res.user.emailVerified,
//         type: userType,
//         userData: userData,
//       },
//     });
//     // addSIBContact(userData)
//   } catch (error) {
//     toastr.warning(error.message);
//     return;
//   }
//   return true;
// };

export const signIn = (userData, history) => async (dispatch) => {
  try {
    const res = await auth.signInWithEmailAndPassword(
      userData.email,
      userData.password
    );
    const doc = await db.collection(userData.userType).doc(res.user.uid).get();
    //check the use registered in database
    if (!doc.exists) {
      toastr.warning("You are not registered as " + userData.userType);
      return false;
    }
    const registered = doc?.data()?.email || false;
    if (registered) {
      const phone_verificated = doc.data()?.phone_verificated ?? false;
      if (res.user.emailVerified || phone_verificated) {
        const doc = await db
          .collection(userData.userType)
          .doc(res.user.uid)
          .get();
        const user = doc.data();
        if (!user) {
          toastr.warning("You are not registered as " + userData.userType);
          return false;
        }
        setSign(userData.userType, history, user);
      } else {
        history.push({
          pathname: "/verify-email-check",
          state: {
            email: res.user.email,
            type: userData.userType,
          },
        });
      }
    } else if (userData.userType === "advertiser") {
      history.push("/confirm-provider-information");
    }
  } catch (error) {
    toastr.warning(error.message);
    return;
  }
  return true;
};

export const forgotPassword = (email) => async (dispatch) => {
  auth
    .sendPasswordResetEmail(email)
    .then((res) => {
      toastr.success("Please check your mail box!");
    })
    .catch(function (error) {
      toastr.warning(error.message);
      return;
    });
};

export const logOut = () => async (dispatch) => {
  try {
    auth.signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "/";
    });
  } catch {}
};

export const updateAccount = (userData) => async (dispatch) => {
  try {
    console.log(userData, "userDatae");
    let newUser;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    const signType = user.sign_type;
    delete userData.avatar;
    delete userData.compressedAvatar;
    newUser = user;
    if (typeof userData.displayAvatar !== "string") {
      if (
        typeof userData.displayAvatar[0] !== "string" &&
        userData.displayAvatar.length > 0
      ) {
        const storageRef = storage.ref();
        let file_name =
          "user_" +
          newDate().toISOString().slice(0, 10) +
          "_" +
          userData.displayAvatar[0].name;
        let image_url = `advertiser_profile_picture/${file_name}`;
        if (role === "user") {
          image_url = `profile_picture/${file_name}`;
        }
        let snapshot = await storageRef
          .child(image_url)
          .put(userData.displayAvatar[0]);
        newUser["profile_picture"] = await snapshot.ref.getDownloadURL();
      } else if (userData.displayAvatar.length === 0) {
        newUser["profile_picture"] = "";
      }
    }
    if (role === "user") {
      newUser.city = userData.city;
      newUser.address = userData.address;
    } else {
      if (typeof userData.address === "string") {
        newUser.address = userData.prevAddress;
      } else {
        newUser.address = userData.address;
      }
    }
    newUser.name = userData.name;
    newUser.phone_number = userData.phone_number;
    newUser["timestamp"] = newDate();
    delete newUser.sign_type;
    if (userData.curpassword !== "" && userData.newpassword !== "") {
      await auth.signInWithEmailAndPassword(
        userData.email,
        userData.curpassword
      );
      let user = auth.currentUser;
      await user.updatePassword(userData.newpassword);
    }
    await db.collection(role).doc(user.id).update(newUser);
    newUser["sign_type"] = signType;
    sessionStorage.setItem("user", JSON.stringify(newUser));
    toastr.success("Update successfully!");
    window.location.href = "/edit-account";
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const setBusinessInfo = (info) => async (dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const doc = await db.collection("advertiser").doc(user.id).get();
  let userInfo = doc.data();
  delete info.name;
  delete info.avatar;
  delete info.phone_number;
  userInfo = { ...userInfo, ...info };
  await db.collection("advertiser").doc(user.id).set(userInfo);
  toastr.success("Business information is added successfully!");
  sessionStorage.setItem("user", JSON.stringify(userInfo));
};

const setBookingData = async (id) => {
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
  const ip = await publicIp.v4();
  if (bookingData && bookingData.length > 0) {
    await Promise.all(
      bookingData.map(async (item) => {
        // let imageUrl = "";
        const advertiserDoc = await db
          .collection("advertiser")
          .doc(item.listingData.advertiser_id)
          .get();
        const advertiserInfo = advertiserDoc.data();
        let bookingFee = 12.9;
        if (advertiserInfo.booking_fees_id) {
          const now = moment().unix();
          if (advertiserInfo.booking_fees_limit_date.seconds > now) {
            const bookingFeeDoc = await db
              .collection("booking_fees")
              .doc(advertiserInfo.booking_fees_id)
              .get();
            bookingFee = bookingFeeDoc.data().fees;
          }
        }
        const insurance_file =
          advertiserInfo.insurance_file === undefined
            ? ""
            : advertiserInfo.insurance_file;
        // if (item.child_image.length > 0) {
        //   const file = item.child_image[0].file;
        //   let file_name = moment().format("YYYY-MM-DD") + "_" + file.name;
        //   let snapshot = await storage
        //     .ref()
        //     .child(`attendees/${file_name}`)
        //     .put(file);
        //   imageUrl = await snapshot.ref.getDownloadURL();
        // }
        const element = {
          ad_id: item.listingData.listing_id,
          advertiser_id: item.listingData.advertiser_id,
          cancel_transaction_id: "",
          insurance_file: insurance_file,
          child_dob: moment(item.child_dob).format("MM/DD/YYYY"),
          coupon_code: "",
          qr_code: "",
          status: "1",
          price: item.price,
          fee: bookingFee,
          child_image: "",
          ip: ip,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          transaction_id: "",
          user_id: id,
          date: moment().format("MM/DD/YYYY"),
          address: item.address,
          child_allergy: item.child_allergy,
          child_gender: item.child_allergy,
          child_medication: item.child_allergy,
          child_name: item.child_name,
          extra_session_id:
            item.extra_session_id === "main" ? "" : item.extra_session_id,
          extra_session_title: item.extra_session_title,
          emergency_contact_number_1: item.emergency_contact_number_1,
          emergency_contact_number_2: item.emergency_contact_number_2,
          option_field1_title: item.option_field1_title,
          option_field2_title: item.option_field2_title,
          guardians: item.guardians,
          surname: item.surname,
        };
        const checkDoc = await db
          .collection("booking")
          .where("ad_id", "==", item.listingData.listing_id)
          .where("user_id", "==", id)
          .where("status", "==", "1")
          .get();
        const checkData = checkDoc.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (checkData.length > 0) {
          await db.collection("booking").doc(checkData[0].id).set(element);
        } else {
          await db.collection("booking").add(element);
        }
      })
    );
    return true;
  }
  return true;
};

const setSign = (userType, history, user) => {
  const url = JSON.parse(sessionStorage.getItem("url"));
  const activityId = JSON.parse(sessionStorage.getItem("activityId"));
  user["sign_type"] = "password";
  if (userType === "user") {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("role", JSON.stringify(userType));
    setBookingData(user.id);
    if (url) {
      if (activityId) {
        history.push({
          pathname: url,
          state: {
            params: { listing_id: activityId },
          },
        });
      } else if (url === "manage-plan") {
        history.push("/");
      } else {
        history.push(url);
      }
    } else {
      history.push("/");
    }
    toastr.success("Sign in successfully with user!");
  } else {
    if (user.allow_account === false) {
      history.push("/");
      toastr.warning(
        "This account is temporarily blocked, contact your system administrator."
      );
      return false;
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("role", JSON.stringify(userType));
      if (url) {
        history.push(url);
      } else {
        toastr.success("Sign in successfully with advertiser!");
        history.push("/advertiser-dashboard");
      }
    }
  }
};

export const setInsuranceInfo =
  (advertiser, file, history) => async (dispatch) => {
    const adDoc = await db.collection("advertiser").doc(advertiser.id).get();
    if (adDoc.exists) {
      const fileName =
        "insurance_" +
        advertiser.id +
        "_" +
        moment().format("YYYY-MM-DD hh:mm:ss") +
        "_" +
        file.name;
      // const insuranceInfo = adDoc.data().insurances;
      let snapshot = await storage
        .ref()
        .child(`insurances/${fileName}`)
        .put(file);
      const url = await snapshot.ref.getDownloadURL();
      const element = {
        insuranceUrl: url,
        date: moment().format("ddd, MM/DD/YYYY hh:mm:ss A"),
      };
      let insurances = [];
      if (
        adDoc.data().insurances === undefined ||
        adDoc.data().insurances.length === 0
      ) {
        insurances.push(element);
      } else {
        insurances = adDoc.data().insurances;
        insurances.push(element);
      }
      advertiser["insurances"] = insurances;
      sessionStorage.setItem("user", JSON.stringify(advertiser));
      await db
        .collection("advertiser")
        .doc(advertiser.id)
        .update({ insurances: insurances });
      history.push("/insurance-info");
      toastr.success("Your insurance information send successfully!");
      return insurances;
    }
  };

export const deleteInsuranceInfo =
  (insuranceInfo, deletedData) => async (dispatch) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const adDoc = await db.collection("advertiser").doc(user.id).get();
      if (adDoc.exists) {
        let picturePath = decodeURIComponent(
          deletedData.insuranceUrl.split("/").pop().split("?").shift()
        );
        if (Boolean(picturePath)) {
          await firebase
            .storage()
            .ref()
            .child(picturePath ?? "")
            .delete();
        }
        if (user.insurances.length === 1) {
          await db.collection("advertiser").doc(user.id).update({
            insurances: firebase.firestore.FieldValue.delete(),
          });
          delete user.insurances;
        } else {
          user["insurances"] = insuranceInfo;
          await db
            .collection("advertiser")
            .doc(user.id)
            .update({ insurances: insuranceInfo });
        }
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.log(error);
      toastr.warning(error.message);
      return false;
    }
    return true;
  };

export const getUserInfo = () => async (dispatch) => {
  const curUser = firebase.auth().currentUser;
  const role = JSON.parse(sessionStorage.getItem("role"));
  if (role && curUser) {
    db.collection(role).onSnapshot((querySnapshot) => {
      const userList = querySnapshot.docs.map((doc) => doc.data());
      if (user) {
        const currentUser = userList.filter(
          (item) => item?.id === curUser?.uid
        );
        if (currentUser.length > 0) {
          dispatch({ type: "SET_CURRENT_USER", payload: currentUser[0] });
          sessionStorage.setItem("user", JSON.stringify(currentUser[0]));
        }
      }
    });
  }
};
//claim listing activity
const setClaimActivity = async (businessInfo, userid) => {
  try {
    const docRef = await db.collection("ad_listing").add({
      address: businessInfo?.address,
      ad_title: businessInfo?.company,
      ad_description: businessInfo?.description,
      camp_type: 1,
      category_name: businessInfo?.category,
      date: moment().format("MM/DD/YYYY"),
      timestamp: newDate(),
      status: "6",
      is_feature_day_remaining: 0,
      is_feature_plan: "",
      is_feature: "1",
      advertiser_id: userid,
      ad_click: 0,
      ad_view: 0,
      company: businessInfo?.company ?? "",
    });
    await db.collection("ad_listing").doc(docRef.id).update({
      id: docRef.id,
    });
  } catch (error) {
    console.log(error, "signup claim");
  }
};
