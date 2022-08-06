import { newDate } from "lib/dateLib";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import toastr from "toastr";

import { addGroupMember } from "../../../../Store/action/contactActions";

export default function AddContact({
  onCreate = console.log,
  selectedGroupKey = "",
  groups = {},
  ...props
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const selectedGroup = groups?.[selectedGroupKey] ?? {};

  const handleClose = () => {
    props.closeModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toastr.info("Just seconds.");
    addGroupMember(
      {
        id: user?.id ?? "",
        data: {
          ...groups,
          [selectedGroupKey]: {
            ...selectedGroup,
            members: {
              ...(selectedGroup?.members ?? {}),
              [newDate().getTime()]: {
                name: name,
                email: email,
                group: selectedGroupKey,
              },
            },
          },
        },
      },
      () => {
        toastr.success("successfully added.");
        onCreate();
        setEmail("");
        setName("");
        handleClose();
      },
      () => {
        handleClose();
      }
    );
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={props.open}
        onClose={props.closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Contact</DialogTitle>
        <ValidatorForm
          // ref="form"
          onSubmit={handleSubmit}
          onError={(errors) => console.log(errors)}
        >
          <DialogContent>
            <TextValidator
              label="Email"
              onChange={handleEmail}
              name="email"
              fullWidth
              value={email ?? ""}
              style={{ marginBottom: 20 }}
              validators={["required", "isEmail"]}
              errorMessages={["this field is required", "email is not valid"]}
            />
            <TextValidator
              label="Name"
              onChange={handleName}
              name="name"
              fullWidth
              value={name ?? ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
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
