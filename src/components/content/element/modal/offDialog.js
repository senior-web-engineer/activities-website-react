import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as Actions from "../../../../Store/action/widget";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#444",
    color: "#fff !important",
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}))(Tooltip);

export default function OffDialog(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const cancelActivity = (id) => {
    dispatch(Actions.cancelActivity(id));
    setOpen(false);
  };
  return (
    <div>
      <LightTooltip title="Cancel Activity">
        <IconButton
          className="cu-act-icnbtn"
          size="small"
          onClick={() => setOpen(true)}
        >
          <HighlightOffIcon />
        </IconButton>
      </LightTooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle>Cancelation Activity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really cancel this activity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="primary">
            CANCEL
          </Button>
          <Button
            onClick={() => cancelActivity(props.listingId)}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
