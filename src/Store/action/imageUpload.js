import $ from "jquery";
import { newDate } from "lib/dateLib";
import moment from "moment";
import toastr from "toastr";
import { db, storage } from "../../services/firebase";

let imageData = [];
export const ImageUploadData = (data) => async (dispatch) => {
  imageData = [];
  data &&
    data.map((item) => {
      if (typeof item === "string") {
        imageData = [...imageData, item];
      } else {
        imageData = [...imageData, item.file];
      }
      return item;
    });
  // dispatch({ type: "SET_IMAGE", payload: imageData });
};

export const FirebaseUpload = (allData, history) => async (dispatch) => {
  try {
    let firebaseUrl = [];
    const age_group = allData.age_group_list.filter(
      (item) => item.name === allData.group_name
    );
    let extraSessions = [];
    if (allData.sessions.length > 0) {
      allData.sessions.forEach((item) => {
        item.start_date = newDate(
          moment(item.start_date).format("YYYY-MM-DD") + " " + item.start_time
        );
        item.end_date = newDate(
          moment(item.end_date).format("YYYY-MM-DD") + " " + item.start_time
        );
        item.remaing_availability = Number(item.remaing_availability);
        item.price = Number(item.price);
        item.availability = Number(item.availability);
        extraSessions.push(item);
      });
    }
    if (allData.camp_type === "2") {
      delete allData.covid_precautions;
    }
    delete allData.term_flag;
    delete allData.sessions;
    delete allData.category_list;
    delete allData.age_group_list;
    delete allData.group_name;
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      allData["advertiser_id"] = user.id;
    }
    const storageRef = storage.ref();
    await Promise.all(
      allData?.picture.length > 0 &&
        allData.picture.map(async (file) => {
          if (typeof file !== "string") {
            let file_name =
              "ad_" + newDate().toISOString().slice(0, 9) + "_" + file.name;
            let snapshot = await storageRef
              .child(`ad_images/${file_name}`)
              .put(file);
            const url = await snapshot.ref.getDownloadURL();
            firebaseUrl = [...firebaseUrl, url];
          } else {
            firebaseUrl = [...firebaseUrl, file];
          }
        })
    );

    if (typeof allData.address === "string") {
      allData["address"] = allData.prevAddress;
    }
    allData.picture = firebaseUrl;
    allData.start_date = newDate(
      moment(allData.start_date).format("YYYY-MM-DD") + " " + allData.start_time
    );
    allData.end_date = newDate(
      moment(allData.end_date).format("YYYY-MM-DD") + " " + allData.end_time
    );
    allData.age_group = age_group[0];
    allData.status = allData?.status === "6" ? "1" : allData.status;
    allData.price = Number(allData.price);
    allData.availability = Number(allData.availability);
    allData.remaing_availability = Number(allData.remaing_availability);
    allData["timestamp"] = newDate();
    allData["date"] = moment().format("MM/DD/YYYY");
    allData["price_currency"] =
      JSON.parse(localStorage.getItem("store"))?.currency?.value || "USD";
    allData.rating = 0;
    delete allData.prevAddress;
    const editId = JSON.parse(sessionStorage.getItem("editId"));
    if (editId) {
      allData.id = editId;
      await db
        .collection("ad_listing")
        .doc(editId)
        .set({ ...allData }, { merge: true });
      const sessionsDoc = await db
        .collection(`ad_listing/${editId}/sessions`)
        .get();
      const curSessions = sessionsDoc.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (curSessions.length > 0) {
        curSessions.map(async (item) => {
          await db
            .collection("ad_listing")
            .doc(editId)
            .collection("sessions")
            .doc(item.id)
            .delete();
        });
      }
      if (extraSessions.length > 0) {
        extraSessions.map(async (item) => {
          await db
            .collection("ad_listing")
            .doc(editId)
            .collection("sessions")
            .add(item);
        });
      }
      sessionStorage.removeItem("editId");
    } else {
      const docRef = await db.collection("ad_listing").add(allData);
      await db.collection("ad_listing").doc(docRef.id).update({
        id: docRef.id,
      });
      if (extraSessions.length > 0) {
        extraSessions.map(async (item) => {
          await db
            .collection("ad_listing")
            .doc(docRef.id)
            .collection("sessions")
            .add(item);
        });
      }
    }
    toastr.success("Successfully adding your activity!");
    $("#normal-submit").removeClass("hidden");
    $("#uploading").addClass("hidden");
    setTimeout(() => {
      history.push("/my-activities");
    }, 1500);
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const base64ImageUpload = async ({
  name = "",
  data = "",
  contentType = "image/jpg",
}) => {
  const storageRef = storage.ref();
  let image = await storageRef
    .child("email_images/" + name)
    .putString(data, "base64", { contentType: contentType });
  return await image.ref.getDownloadURL();
};
