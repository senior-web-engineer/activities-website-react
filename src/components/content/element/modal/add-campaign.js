import "grapesjs/dist/css/grapes.min.css";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useState } from "react";
import { Editor } from "react-grapesjs";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import striptags from "striptags";
import toastr from "toastr";

import {
  addEmailCampaignHistory,
  convertBase64toUrl,
} from "../../../../Store/action/emailCampaignActions";
import { sendEmailSIB } from "../../../../Store/action/sendInBlueAction";

export default function AddCampaign({
  contacts = [],
  onFinish = console.log,
  ...props
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [formData, setFormData] = useState({});
  const [emailContent, setEmailContent] = useState("");
  const [textContent, setTextContent] = useState("");
  // const limitLength = 1020000;

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (emailContent?.length > limitLength) {
    //   toastr.warning("This email content is too large.");
    //   return;
    // }
    toastr.info("Just seconds.");
    convertBase64toUrl(emailContent).then((html) => {
      sendEmailSIB({
        to: contacts.map((contact) => ({
          email: contact?.email,
          name: contact?.name,
        })),
        replyTo: formData?.replyTo ?? "",
        subject: formData?.subject ?? "",
        htmlContent: html,
        // attaches: attaches,
        onFinish: () => {
          addEmailCampaignHistory(
            {
              id: user?.id ?? "",
              data: {
                contacts: contacts,
                ...formData,
                htmlContent: emailContent,
                textContent: textContent,
              },
            },
            () => {
              handleClose();
              onFinish();
              toastr.success("Successfully Sent.");
            },
            () => {
              handleClose();
              toastr.warning("Unknow error.");
            }
          );
        },
        onError: console.log,
      });
    });
  };

  const handleClose = () => {
    props.closeModal();
    localStorage.removeItem("gjs-css");
    localStorage.removeItem("gjs-html");
    localStorage.removeItem("gjs-styles");
    localStorage.removeItem("gjs-assets");
    localStorage.removeItem("gjs-components");
  };

  const handleUpdate = (editor = {}) => {
    const tmpContent = editor.runCommand("gjs-get-inlined-html");
    // if (tmpContent?.length > limitLength) {
    //   toastr.warning(
    //     "This email content is too large. It will not show correctly."
    //   );
    //   return;
    // }
    setTextContent(striptags(editor.getHtml()));
    setEmailContent(tmpContent);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e?.target ?? {};
    setFormData((s) => ({
      ...s,
      [name]: value ?? "",
    }));
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={props.open}
        onClose={props.closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Campaign</DialogTitle>
        <ValidatorForm
          // ref="form"
          onSubmit={handleSubmit}
          onError={(errors) =>
            toastr.warning(errors?.[0]?.props?.errorMessages?.join("<br/>"))
          }
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
            <TextValidator
              label="Subject"
              onChange={handleChangeForm}
              name="subject"
              fullWidth
              value={formData?.subject ?? ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextValidator
              label="replyTo"
              onChange={handleChangeForm}
              name="replyTo"
              fullWidth
              value={formData?.replyTo ?? ""}
              validators={["required", "isEmail"]}
              errorMessages={["this field is required", "email is not valid"]}
            />
            <br />
            <div>
              <Editor
                id="test"
                presetType="newsletter"
                onUpdate={handleUpdate}
                height={window.innerHeight - 350}
                storageManager={{ type: null }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Add
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  );
}
