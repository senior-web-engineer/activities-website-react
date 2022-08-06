import { newDate } from "lib/dateLib";
import { db } from "../../services/firebase";
import toastr from "toastr";
import moment from "moment";

export const getBlogList = () => async (dispatch) => {
  try {
    const blogDoc = await db
      .collection("blog")
      .orderBy("timestamp", "desc")
      .get();
    if (!blogDoc.empty) {
      let blogData = blogDoc.docs.map((doc) => doc.data());
      blogData = blogData.filter((item) => item.status === "1");
      if (blogData.length > 0) {
        await Promise.all(
          blogData.map(async (item) => {
            let category_names = "";
            let tag_names = [];
            if (item.category_id) {
              category_names = await getCategoryNames(item.category_id);
            }
            if (item.tag_id) {
              tag_names = await getTagNames(item.tag_id);
            }
            const blogReviewDoc = await db
              .collection("blog_reviews")
              .where("blog_id", "==", item.id)
              .where("status", "==", "1")
              .get();
            if (!blogReviewDoc.empty) {
              item["blog_reviews_data"] = blogReviewDoc.docs.map((doc) =>
                doc.data()
              );
            } else {
              item["blog_reviews_data"] = [];
            }
            item["category_name"] = category_names;
            item["tag_info"] = tag_names;
            item["date"] = moment(item.timestamp.seconds * 1000).format("ll");
            return item;
          })
        );
      }
      dispatch({ type: "SET_BLOG_LIST", payload: blogData });
    }
  } catch (error) {
    toastr.warning(error.message);
    console.log(error.message);
  }
};

export const setReviewById =
  (blog_id, review, user_id, blog_title, history) => async (dispatch) => {
    try {
      const userDoc = await db.collection("user").doc(user_id).get();
      const user = userDoc.data();
      const docRef = await db.collection("blog_reviews").add({
        id: "",
        blog_id: blog_id,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        blog_title: blog_title,
        user_profile_picture: user.profile_picture,
        review: review,
        timestamp: newDate(),
        status: "0",
      });
      await db.collection("blog_reviews").doc(docRef.id).update({
        id: docRef.id,
      });
      toastr.success("Blog added successfully");
      sessionStorage.removeItem("blogReview");
      sessionStorage.removeItem("url");
      history.push({
        pathname: `/blog-details/${blog_title.replace(/ /g, "-")}`,
        state: { category_id: blog_id },
      });
    } catch (error) {
      console.log(error.message);
      toastr.error(error.message);
    }
  };

export const getPressList = () => async (dispatch) => {
  try {
    let pressData = [];
    const pressRes = await db
      .collection("press_release")
      .orderBy("timestamp", "desc")
      .get();
    if (!pressRes.empty) {
      pressData = pressRes.docs.map((doc) => doc.data());
      pressData = pressData.filter((item) => item.status === "0");
    }
    dispatch({ type: "SET_PRESS_DATA", payload: pressData });
  } catch (error) {
    console.log("press", error);
  }
};

const getCategoryNames = async (id) => {
  let category_names = [];
  await Promise.all(
    id.map(async (item) => {
      const categoryDoc = await db.collection("category").doc(item).get();
      if (categoryDoc.exists) {
        category_names.push(categoryDoc.data().category_name);
      }
    })
  );
  return category_names.toString();
};

const getTagNames = async (tagid) => {
  let tag_names = [];
  await Promise.all(
    tagid.map(async (item) => {
      const tagDoc = await db.collection("tags").doc(item).get();
      if (tagDoc.exists) {
        tag_names.push({ tag_name: tagDoc.data().tag_name, tag_id: item });
      }
    })
  );
  return tag_names;
};
