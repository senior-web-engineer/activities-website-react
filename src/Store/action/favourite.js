import { newDate } from "lib/dateLib";
import { db } from "../../services/firebase";
import toastr from "toastr";
export const setFavouriteData = (data) => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (data[0].favFlag) {
      const docRef = await db.collection("favourites_ad").add({
        ad_id: data[0].listing_id,
        status: 0,
        user_id: user.id,
        date: newDate().toLocaleDateString().slice(0, 10),
        id: "",
      });
      await db
        .collection("favourites_ad")
        .doc(docRef.id)
        .update({ id: docRef.id });
    } else {
      const res = await db.collection("favourites_ad").get();
      const favData = res.docs.map((doc) => doc.data());
      const selectAdv = favData.filter(
        (item) => item.ad_id === data[0].listing_id && item.user_id === user.id
      );
      if (selectAdv.length > 0) {
        await db.collection("favourites_ad").doc(selectAdv[0].id).delete();
      }
    }
  } catch (error) {
    toastr.warning(error.message);
  }
};
export const getFavourite = () => async (dispatch) => {
  try {
    let favouriteData = [];
    const user = JSON.parse(sessionStorage.getItem("user"));
    const res = await db.collection("favourites_ad").get();
    const favData = res.docs.map((doc) => doc.data());
    const userFavData = favData.filter((item) => item.user_id === user.id);
    await Promise.all(
      userFavData.map(async (item) => {
        const doc = await db.collection("ad_listing").doc(item.ad_id).get();
        const res = doc.data();
        if (res !== undefined) {
          const listingData = {
            title: res.ad_title,
            categoryName: res.category_name,
            price: res.price,
            docid: item.id,
          };
          favouriteData = [...favouriteData, listingData];
        }
      })
    );
    dispatch({
      type: "GET_FAVOURITE_DATA",
      payload: favouriteData,
    });
  } catch (error) {
    toastr.warning(error.message);
  }
};
export const deleteFavourite = (id) => async (dispatch) => {
  await db
    .collection("favourites_ad")
    .doc(id)
    .delete()
    .then((res) => {
      toastr.success("Delete favourite activity successfully!");
    })
    .catch((error) => {
      toastr.warning(error.message);
    });
};
