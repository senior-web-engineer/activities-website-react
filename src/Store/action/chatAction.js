import { newDate } from "lib/dateLib";
import firebase, { db } from "../../services/firebase";
import types from "./actionTypes";
import toastr from "toastr";
import moment from "moment";
let roomId = "";
let chatRoomsUpdate = [];

export const getChatRoom = () => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    await db
      .collection("chat")
      .where("type", "==", "private")
      .onSnapshot(async (res) => {
        let chatRooms = [];
        const data = res.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filterData = data.filter((item) =>
          role === "user"
            ? item.users_occupants[0] === user.id
            : item.advertiser_id === user.id
        );
        if (filterData.length > 0) {
          await Promise.all(
            filterData.map(async (item) => {
              const blockDoc = await db
                .collection("chat_block")
                .where("advertiser_id", "==", item.advertiser_id)
                .where("user_id", "==", item.users_occupants[0])
                .get();
              const blockData = blockDoc.docs.map((item) => item.data());
              const element = {
                id: item.id,
                status: blockData.length === 0 ? "0" : blockData[0].status,
                ad_img: item.advertiser_image_url,
                title: item.advertise_title,
                advertiser_id: item.advertiser_id,
                user_id: item.users_occupants[0],
                lastMessage: item.last_message,
                date:
                  item.last_message_at === ""
                    ? ""
                    : moment().format("MM/DD/YYYY"),
              };
              chatRooms = [...chatRooms, element];
            })
          );
          chatRoomsUpdate = chatRooms;

          dispatch({
            type: types.GET_CHAT_ROOMS_SUCCESS,
            payload: chatRooms,
          });
          chatRooms = [];
        }
      });
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const getGroupChatRooms = () => async (dispatch) => {
  try {
    let groupChatRooms;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    await db
      .collection("chat")
      .where("type", "==", "group")
      .onSnapshot(async (res) => {
        const filterData = res.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        let chatData = [];
        if (role === "user") {
          filterData.forEach((item) => {
            item.users_occupants.forEach((id) => {
              if (id === user.id) {
                chatData = [...chatData, item];
              }
            });
          });
        } else {
          chatData = filterData.filter(
            (item) => item.advertiser_id === user.id
          );
        }
        await Promise.all(
          chatData.map(async (item) => {
            const activityDoc = await db
              .collection("ad_listing")
              .doc(item.activity_id)
              .get();
            if (activityDoc.exists) {
              const activityData = activityDoc.data();
              let userImg = [];
              groupChatRooms = [];
              await Promise.all(
                item.users_occupants.map(async (id) => {
                  const res = await db.collection("user").doc(id).get();
                  if (res.exists) {
                    const img = res.data().profile_picture;
                    userImg = [...userImg, img];
                  }
                  return userImg;
                })
              );
              item["userImg"] = userImg;
              item["activityImg"] =
                activityData.picture && activityData.picture.length > 0
                  ? activityData.picture[0]
                  : "";
              groupChatRooms = [...groupChatRooms, item];
              return groupChatRooms;
            }
          })
        );
        dispatch({ type: types.GET_GROUP_CHAT_ROOMS, payload: groupChatRooms });
      });
  } catch (error) {}
};

export const getChatUser = () => async (dispatch) => {
  db.collection(`advertiser`).onSnapshot((querySnapshot) => {
    let users = querySnapshot.docs.map((doc) => doc.data());
    return dispatch({
      type: types.GET_USER_SUCCESS,
      payload: users,
    });
  });
};

export const getChatMessage = (data, type) => async (dispatch) => {
  roomId = data;
  let blockFlag = "0";
  await db
    .collection(`chat/${roomId}/chat_messages`)
    .orderBy("created_at", "asc")
    .onSnapshot((querySnapshot) => {
      let chatMessages = querySnapshot.docs.map((doc) => doc.data());
      return dispatch({
        type: types.GET_CHAT_MESSAGE_SUCCESS,
        payload: chatMessages,
      });
    });
  const chatDoc = await db.collection("chat").doc(roomId).get();
  const chatData = chatDoc.data();
  const chatBlockDoc = await db
    .collection("chat_block")
    .where("advertiser_id", "==", chatData.advertiser_id)
    .where("user_id", "==", chatData.users_occupants[0])
    .get();
  const chatBlockData = chatBlockDoc.docs.map((item) => item.data());
  if (chatBlockData.length > 0) {
    blockFlag = chatBlockData[0].status;
  }
  dispatch({
    type: "SET_BLOCK_FLAG",
    payload: { flag: blockFlag, type: type },
  });
};

export const sendMessage = (data) => async (dispatch) => {
  if (roomId === "") {
    toastr.info("Select room!");
    return false;
  }
  let user = JSON.parse(sessionStorage.getItem("user"));
  await db.collection(`chat/${roomId}/chat_messages`).add({
    message: data,
    picture_url: user.profile_picture ?? "",
    send_from: user.id,
    sender_name: user.name,
    created_at: newDate(
      firebase.firestore.Timestamp.now().seconds * 1000
    ).toISOString(),
  });
  await db.collection("chat").doc(roomId).update({
    last_message: data,
    last_message_at: newDate().toISOString(),
  });
  //notification part
  setNotification();
};

export const getUnreadMessageCount = () => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    await db.collection("chat").onSnapshot(async (res) => {
      const data = res.docs.map((doc) => doc.data());
      const userMessages = data.filter((item) =>
        role === "user"
          ? item.users_occupants[0] === user.id
          : item.advertiser_id === user.id
      );
      let cnt = 0;
      if (userMessages.length > 0) {
        userMessages.map((item) => (cnt += item.last_message_unread_at));
      }
      dispatch({
        type: types.SET_UNREAD_MESSAGE_COUNT,
        payload: cnt,
      });
    });
  } catch (error) {
    toastr.warning(error.message);
  }
};

export const setNotification = async () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = JSON.parse(sessionStorage.getItem("role"));
  const res = await db.collection("chat").doc(roomId).get();
  const chatInfo = res.data();
  let notificationData;
  if (chatInfo.type === "private") {
    if (role === "user") {
      notificationData = {
        advertiser_id: chatInfo.advertiser_id,
        date: moment().format("MM/DD/YYYY"),
        icon: "Icons.directions_bus",
        id: "",
        chat_id: roomId,
        is_read: "0",
        message: "You've new message from " + user.name,
      };
    } else {
      notificationData = {
        user_id: chatInfo.users_occupants[0],
        date: moment().format("MM/DD/YYYY"),
        icon: "Icons.directions_bus",
        id: "",
        chat_id: roomId,
        is_read: "0",
        message: "You've new message from " + user.name,
      };
    }

    const res = await db
      .collection(
        role === "user" ? "advertiser_notification" : "user_notification"
      )
      .add(notificationData);
    await db
      .collection(
        role === "user" ? "advertiser_notification" : "user_notification"
      )
      .doc(res.id)
      .update({ id: res.id });
  } else {
    if (role === "user") {
      notificationData = {
        advertiser_id: chatInfo.advertiser_id,
        date: moment().format("MM/DD/YYYY"),
        icon: "Icons.directions_bus",
        id: "",
        chat_id: roomId,
        is_read: "0",
        message: "You've new message from " + user.name,
      };
      const res = await db
        .collection("advertiser_notification")
        .add(notificationData);
      await db
        .collection("advertiser_notification")
        .doc(res.id)
        .update({ id: res.id });
    } else {
      await Promise.all(
        chatInfo.users_occupants.map(async (item) => {
          const data = {
            user_id: item,
            date: moment().format("MM/DD/YYYY"),
            icon: "Icons.directions_bus",
            id: "",
            chat_id: roomId,
            is_read: "0",
            message: "You've new message from " + user.name,
          };
          const res = await db.collection("user_notification").add(data);
          await db
            .collection("user_notification")
            .doc(res.id)
            .update({ id: res.id });
        })
      );
    }
  }
};

export const setBlockChat =
  (flag, status, advertiser_id, user_id, role) => async (dispatch) => {
    let blockStatus = "";
    const blockDoc = await db
      .collection("chat_block")
      .where("advertiser_id", "==", advertiser_id)
      .where("user_id", "==", user_id)
      .get();
    const blockData = blockDoc.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    if (blockData.length > 0) {
      if (status === "0" && role === "user") {
        blockStatus = "2";
      }
      if (status === "0" && role === "advertiser") {
        blockStatus = "1";
      }
      if (status === "1" && role === "user") {
        blockStatus = "3";
      }
      if (status === "1" && role === "advertiser") {
        blockStatus = "0";
      }
      if (status === "2" && role === "user") {
        blockStatus = "0";
      }
      if (status === "2" && role === "advertiser") {
        blockStatus = "3";
      }
      if (status === "3" && role === "user") {
        blockStatus = "1";
      }
      if (status === "3" && role === "advertiser") {
        blockStatus = "2";
      }
      await db
        .collection("chat_block")
        .doc(blockData[0].id)
        .update({ status: blockStatus });
    } else {
      if (status === "0" && role === "user") {
        blockStatus = "2";
      }
      if (status === "0" && role === "advertiser") {
        blockStatus = "1";
      }
      const docRef = await db.collection("chat_block").add({
        id: "",
        advertiser_id: advertiser_id,
        user_id: user_id,
        status: blockStatus,
      });
      await db
        .collection("chat_block")
        .doc(docRef.id)
        .update({ id: docRef.id });
    }

    dispatch({
      type: "SET_BLOCK_FLAG",
      payload: { flag: blockStatus, type: "private" },
    });
  };

export const setSelChatRoomId = (roomid) => async (dispatch) => {
  if (roomid) {
    dispatch({ type: "SET_SELECT_CHATROOMID", payload: roomid });
  }
};

export const setMessageDefault = () => async (dispatch) => {
  dispatch({
    type: types.GET_CHAT_MESSAGE_SUCCESS,
    payload: [],
  });
};

// export const getUnreadMessage = (userId, role) => async (dispatch) => {
//   db.collection("chat")
//     .where("type", "==", "private")
//     .onSnapshot(async (snapshot) => {
//       let flag = true;
//       await snapshot.docChanges().forEach(async (change, index) => {
//         if (change.type === "modified") {
//           const msgDoc = await db
//             .collection(`chat/${change.doc.id}/chat_messages`)
//             .orderBy("createdAt", "desc")
//             .get();
//           const messages = msgDoc.docs.map((doc) => doc.data());
//           if (messages[0].sendFrom !== userId && flag) {
//             const message = `You have received message ${messages[0].senderName}`;

//             dispatch({ type: "UNREAD_MESSAGE", payload: message });
//             flag = false;
//           }
//         }
//       });
//     });
// };

export const chatBlockList = () => async (dispatch) => {
  let newChatRooms = [];
  await Promise.all(
    chatRoomsUpdate.map(async (item) => {
      const Doc = await db
        .collection("chat_block")
        .where("advertiser_id", "==", item.advertiser_id)
        .where("user_id", "==", item.user_id)
        .get();
      const data = Doc.docs.map((doc) => doc.data());
      if (data.length > 0) {
        item["status"] = data[0].status;
        newChatRooms = [...newChatRooms, item];
      } else {
        newChatRooms = [...newChatRooms, item];
      }
    })
  );
  dispatch({
    type: types.GET_CHAT_ROOMS_SUCCESS,
    payload: newChatRooms,
  });
};

export const setDefaultBlock = () => async (dispatch) => {
  dispatch({ type: "SET_BLOCK_FLAG", payload: { flag: "0", type: "group" } });
};
