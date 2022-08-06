import { newDate } from "lib/dateLib";
import firebase, { db } from "../../services/firebase";
import { staffTypes } from "../action/actionTypes";
import toastr from "toastr";
export const getActivityLists = (id) => async (dispatch) => {
  const res = await db.collection("ad_listing").get();
  const data = res.docs.map((doc) => doc.data());
  let advData = [];
  data.length > 0 &&
    data.map((item) => {
      if (item.advertiser_id === id) {
        const element = {
          label: item.ad_title + " ( " + item.category_name + " )",
          value: item.id,
        };
        advData = [...advData, element];
      }
      return advData;
    });
  dispatch({ type: staffTypes.GET_ACTIVITY_LISTS, payload: advData });
};

export const setStaff = (data) => async (dispatch) => {
  try {
    const staffdocs = await db.collection("advertiser_staff").get();
    const staffLists = staffdocs.docs.map((doc) => doc.data());
    const filter = staffLists.filter((item) => item.email === data.email);
    if (filter.length === 0) {
      // await auth.createUserWithEmailAndPassword(data.email, data.password);
    }
    const user = JSON.parse(sessionStorage.getItem("user"));

    const staffInfo = {
      active_camp_id: data.activityId,
      address: "",
      advertiser_id: user.id,
      city: "",
      date: newDate().toISOString(),
      email: data.email,
      name: data.name,
      phone_number: "",
      phone_verificated: false,
      pincode: "",
      profile_picture: "",
      role: "0",
      status: "0",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",
      permission_checkins: data.checkins,
      permission_emergency: data.emergency,
      permission_list_participants: data.list_participants,
      permission_total_participants: data.total_participants,
    };
    const docRef = await db.collection("advertiser_staff").add(staffInfo);
    await db.collection("advertiser_staff").doc(docRef.id).update({
      id: docRef.id,
    });
    toastr.success("Add staff successfully!");
  } catch (error) {
    toastr.warning(error.message);
    return false;
  }
  return true;
};

export const getStaffLists = (id) => async (dispatch) => {
  const staffdocs = await db.collection("advertiser_staff").get();
  const staffLists = staffdocs.docs.map((doc) => doc.data());
  const filter = staffLists.filter(
    (item) => item.advertiser_id === id && item.active_camp_id !== ""
  );
  let data = [];
  await Promise.all(
    filter.map(async (item) => {
      const adDoc = await db
        .collection("ad_listing")
        .doc(item.active_camp_id)
        .get();
      const advData = adDoc.data();
      if (advData !== undefined) {
        item["category_name"] = advData.category_name;
        item["ad_title"] = advData.ad_title;
        data.push(item);
      }
    })
  );
  dispatch({ type: staffTypes.STAFF_LISTS, payload: data });
};

export const deleteStaff = (id) => async (dispatch) => {
  try {
    await db
      .collection("advertiser_staff")
      .doc(id)
      .delete()
      .then((res) => {
        toastr.success("Delete staff sucessfully!");
      });
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const updateStaff = (data) => async (dispatch) => {
  try {
    await db.collection("advertiser_staff").doc(data.docId).update({
      permission_checkins: data.permission_checkins,
      permission_emergency: data.permission_emergency,
      permission_list_participants: data.permission_list_participants,
      permission_total_participants: data.permission_total_participants,
      active_camp_id: data.active_camp_id,
      name: data.name,
      email: data.email,
      date: newDate().toISOString(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    toastr.success("Staff permission changed successfully!");
  } catch (error) {
    toastr.warning(error.message);
    return false;
  }
  return true;
};
