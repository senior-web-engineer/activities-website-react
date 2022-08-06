import toastr from "toastr";

import { db } from "../../services/firebase";

export const addGroup = async (
  data = {},
  onFinish = console.log,
  onError = console.log
) => {
  try {
    const id = data?.id ?? "";
    const newGroup = {
      name: data?.name ?? "",
      members: [],
    };
    const res = await db
      .collection("email_contacts")
      .doc(id)
      .set(
        {
          [String(Math.random()).substr(2)]: newGroup,
        },
        { merge: true }
      );
    onFinish(res);
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};

export const getGroups = async (
  data = {},
  onFinish = console.log,
  onError = console.log
) => {
  try {
    const id = data?.id ?? "";
    const res = await db.collection("email_contacts").doc(id).get();
    onFinish(res?.data());
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};

export const updateGroup = async (
  data = {},
  onFinish = console.log,
  onError = console.log
) => {
  try {
    const id = data?.id ?? "";
    const res = await db
      .collection("email_contacts")
      .doc(id)
      .set(data?.data ?? {});
    onFinish(res?.data());
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};

export const addGroupMember = async (
  data = {},
  onFinish = console.log,
  onError = console.log
) => {
  try {
    const id = data?.id ?? "";
    const res = await db
      .collection("email_contacts")
      .doc(id)
      .set(data?.data ?? {});
    onFinish(res?.data());
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};
