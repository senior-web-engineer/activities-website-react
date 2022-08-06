import { db } from "../../services/firebase";
import toastr from "toastr";

export const getFaq = () => async (dispatch) => {
  try {
    const faqres = await db
      .collection("basic")
      .where("page", "==", "faq")
      .where("status", "==", "1")
      .get();
    if (!faqres.empty) {
      const faqData = faqres.docs.map((doc) => doc.data());
      dispatch({ type: "SET_FAQ_DATA", payload: faqData });
    }
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getAboutUs = () => async (dispatch) => {
  try {
    const aboutusRes = await db
      .collection("basic")
      .where("page", "==", "aboutus")
      .where("status", "==", "1")
      .get();
    if (!aboutusRes.empty) {
      const aboutus = aboutusRes.docs.map((doc) => doc.data());
      dispatch({ type: "SET_ABOUTUS", payload: aboutus[0] });
    }
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getUserTerms = () => async (dispatch) => {
  try {
    const usertermsRes = await db
      .collection("basic")
      .where("page", "==", "user-terms-conditions")
      .where("status", "==", "1")
      .get();
    if (!usertermsRes.empty) {
      const userterms = usertermsRes.docs.map((doc) => doc.data());
      dispatch({ type: "SET_USER_TERMS_CONDITIONS", payload: userterms[0] });
    }
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getAdvertiserTerms = () => async (dispatch) => {
  try {
    const advertiserTermsRes = await db
      .collection("basic")
      .where("page", "==", "advertiser-terms-conditions")
      .where("status", "==", "1")
      .get();
    if (!advertiserTermsRes.empty) {
      const advertiserterms = advertiserTermsRes.docs.map((doc) => doc.data());
      dispatch({
        type: "SET_ADVERTISER_TERMS_CONDITIONS",
        payload: advertiserterms[0],
      });
    }
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getPrivacy = () => async (dispatch) => {
  try {
    const privacyRes = await db
      .collection("basic")
      .where("page", "==", "privacy")
      .where("status", "==", "1")
      .get();
    if (!privacyRes.empty) {
      const privacy = privacyRes.docs.map((doc) => doc.data());
      dispatch({
        type: "SET_PRIVACY",
        payload: privacy[0],
      });
    }
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getSupportDetail = () => async (dispatch) => {
  try {
    let support = {};
    const supportRes = await db
      .collection("basic")
      .where("page", "==", "support")
      .where("status", "==", "1")
      .get();
    if (!supportRes.empty) {
      const data = supportRes.docs.map((doc) => doc.data());
      support = data[0];
    }
    dispatch({ type: "SET_SUPPORT", payload: support });
  } catch (error) {
    console.log(error, "support error");
  }
};
