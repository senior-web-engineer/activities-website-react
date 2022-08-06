import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ProviderTermsDialog({
  open,
  handleClose,
  termCondition,
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"sm"}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Provider Terms & Conditions"}
        </DialogTitle>
        <DialogContent>
          <div>
            <textarea
              className="camp-term-text p-3"
              defaultValue={termCondition}
              name="custom_terms"
              rows="10"
              disabled
            ></textarea>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
