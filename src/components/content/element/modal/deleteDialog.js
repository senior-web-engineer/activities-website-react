import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useDispatch } from "react-redux";
import * as Action from "../../../../Store/action/listing";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#444",
    color: "#fff !important",
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}))(Tooltip);

export default function DeleteDialog(props) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleDelete = () => {
    dispatch(Action.deleteActivity(props.activityId));
    setOpen(false);
    dispatch(Action.getMyListing(user.id));
  };
  return (
    <div>
      <LightTooltip title="Delete">
        <IconButton
          className="cu-act-icnbtn"
          size="small"
          onClick={() => setOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </LightTooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you really remove this activity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="cu-button-outline"
            autoFocus
            onClick={() => setOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            className="cu-button-outline"
            onClick={() => handleDelete()}
            color="primary"
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
