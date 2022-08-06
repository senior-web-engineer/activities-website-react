import { newDate } from "lib/dateLib";
import axios from "axios";
import toastr from "toastr";
import { db } from "../../services/firebase";
import { base64ImageUpload } from "./imageUpload";

export const addEmailCampaignHistory = async (
  data = {},
  onFinish = console.log,
  onError = console.log
) => {
  try {
    const id = data?.id ?? "";
    const newData = data?.data ?? {};
    await db.collection("email_campaigns").doc("id").set({});
    const res = await db
      .collection("email_campaigns")
      .doc(id)
      .set(
        {
          [String(Math.random()).substr(2)]: newData,
        },
        { merge: true }
      );
    onFinish(res);
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};

export const getCampaignHistory = async (
  data = {},
  onFinish = console.log,
  onError = console.log
) => {
  try {
    const id = data?.id ?? "";
    const res = await db.collection("email_campaigns").doc(id).get();
    onFinish(res?.data());
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};

export const convertBase64toUrl = async (htmlString = "") => {
  let promises = [];
  const regEx = /src="data:image\/([^;]+);base64,([^"]+)"/g;
  String(htmlString).replace(regEx, (match, p1, p2, pos, all) => {
    // p2 will be base64 image data so save data and allocation id
    const newId = String(newDate().getTime()) + "." + p1;
    const contentType = "image/" + p1;
    const url = base64ImageUpload({
      name: newId,
      data: p2,
      contentType: contentType,
    });
    promises.push(url);
  });
  const promised = await Promise.all(promises);

  return String(htmlString).replace(regEx, () => `src="${promised.shift()}" `);
};

export const sendEmail = async (
  data = {},
  htmlContent,
  onFinish = console.log,
  onError = console.log
) => {
  try {
    axios
      .post(
        "https://api.sendinblue.com/v3/smtp/email",
        {
          sender: {
            name: data.name,
            email: data.email,
          },
          to: [
            {
              email: "provider.setup@activities.app",
              name: "James Quaid",
            },
          ],
          replyTo: { email: data.email },
          htmlContent: htmlContent,
          subject: `You have received a provider information`,
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
        onFinish({ success: true });
      });
  } catch (error) {
    toastr.warning(error.message);
    onError(error);
  }
};
