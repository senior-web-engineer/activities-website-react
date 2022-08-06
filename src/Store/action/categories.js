import { db } from "../../services/firebase";
import { SET_CATEGORY_DATA } from "../action/actionTypes";
import toastr from "toastr";

export const getCategories = () => async (dispatch) => {
  try {
    let categories = [];
    let groupData = [];
    const querySnapshot = await db
      .collection("category")
      .where("status", "==", 0)
      .get();
    if (!querySnapshot.empty) {
      const categoryData = querySnapshot.docs.map((doc) => doc.data());
      let webCategories = categoryData.filter(
        (item) => item.category_webimage !== "" && item.category_webimage
      );

      if (webCategories.length === 0) {
        webCategories = categoryData.filter(
          (item) => item.category_image !== ""
        );
        await Promise.all(
          webCategories.map(async (item, key) => {
            const categoryCntDoc = await db
              .collection("ad_listing")
              .where("category_name", "==", item.category_name)
              .where("status", "==", "0")
              .get();
            const categoryCnt = categoryCntDoc.size;
            const data = {
              id: key + 1,
              category_id: item.id,
              category: item.category_name,
              list: categoryCnt,
              img: item.category_image,
            };
            categories.push(data);
          })
        );
      } else {
        await Promise.all(
          webCategories.map(async (item, key) => {
            const categoryCntDoc = await db
              .collection("ad_listing")
              .where("category_name", "==", item.category_name)
              .where("status", "==", "0")
              .get();
            const categoryCnt = categoryCntDoc.size;
            const data = {
              id: key + 1,
              category_id: item.id,
              category: item.category_name,
              list: categoryCnt,
              img: item.category_webimage,
            };
            categories.push(data);
          })
        );
      }
    }
    const campAgeRangeRes = await db
      .collection("camp_age_range")
      .where("status", "==", "1")
      .get();
    if (!campAgeRangeRes.empty) {
      groupData = campAgeRangeRes.docs.map((doc) => doc.data());
    }

    dispatch({
      type: SET_CATEGORY_DATA,
      payload: { categories, groupData },
    });
  } catch (error) {
    toastr.warning(error.message);
    console.log(error);
  }
};

export const getBannerImageForWeb = async (
  url = "",
  onFinish = console.log,
  onError = console.log
) => {
  try {
    await db
      .collection("banners")
      .where("route", "==", url)
      .where("status", "==", "0")
      .where("application", "==", "web")
      .onSnapshot((res) => {
        if (!res.empty) {
          const bannerData = res.docs.map((doc) => doc.data());
          if (url === "/homepage") {
            let heroData = [];
            bannerData.forEach((item) => {
              heroData.push(item.image);
            });
            onFinish(heroData);
          } else {
            onFinish(bannerData[0].image);
          }
        } else {
          onFinish(null);
        }
      });
  } catch (error) {
    console.log(error, "error");
    onError(error);
  }
};

export const getBannerImage = (page) => async (dispatch) => {
  db.collection("banners")
    .where("route", "==", page)
    .where("status", "==", "0")
    .where("application", "==", "web")
    .onSnapshot((querySnapshot) => {
      if (!querySnapshot.empty) {
        const bannerData = querySnapshot.docs.map((doc) => doc.data());
        if (page === "/homepage") {
          let heroData = [];
          bannerData.forEach((item) => {
            heroData.push(item.image);
          });
          dispatch({ type: "SET_HERO_IMAGE", payload: heroData });
        } else {
          dispatch({ type: "SET_HERO_IMAGE", payload: bannerData[0].image });
        }
      }
    });
};

export const getHeaderMessage = () => async (dispatch) => {
  try {
    const headermessageRes = await db.collection("header_message").get();
    if (!headermessageRes.empty) {
      const headermessage = headermessageRes.docs.map((doc) => doc.data());
      dispatch({ type: "SET_HEADER_MESSAGE", payload: headermessage });
    }
  } catch (error) {
    console.log(error.message);
  }
};
