import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import AddIcon from "@material-ui/icons/Add";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import toastr from "toastr";
import * as Actions from "../../../../Store/action/bankAction";
import { MultiLang } from "../widget";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    borderRadius: "5px !important",
    height: "38px !important",
  },
  dialog: {
    textAlign: "center",
    background: "#afdb30",
    "& h2": {
      color: "#fff !important",
    },
  },
  TextField: {
    marginBottom: theme.spacing(2),
  },
}));
export default function AddBankInfo() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [accountNumber, setaccountNumber] = React.useState(null);
  const [routingNumber, setroutingNumber] = React.useState(null);
  const classes = useStyles();
  const { t } = useTranslation();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const setSave = () => {
    if (!accountNumber || !routingNumber || !accountName) {
      toastr.info("You must write all field correctly");
      return false;
    }
    dispatch(Actions.addBankInfo(accountName, accountNumber, routingNumber));
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        className="btn btn-gradient btn-gradient-two claim-btn cu-radius cu-hover cu-widthdraw"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        <MultiLang text="add_bank_account" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.dialog} id="form-dialog-title">
          <MultiLang text="create_bank_account" />
        </DialogTitle>
        <DialogContent>
          <TextField
            className={classes.TextField}
            margin="dense"
            id="name"
            label={t("write_account_name")}
            type="text"
            onChange={(e) => setAccountName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            className={classes.TextField}
            margin="dense"
            id="name"
            label={t("write_account_num")}
            onChange={(e) => setaccountNumber(e.target.value)}
            type="number"
            onInput={(e) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 6);
            }}
            fullWidth
            required
          />
          <TextField
            className={classes.TextField}
            margin="dense"
            id="name"
            label={t("write_routing_num")}
            type="number"
            onChange={(e) => setroutingNumber(e.target.value)}
            onInput={(e) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 6);
            }}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => setOpen(false)}
            startIcon={<CancelIcon />}
          >
            <MultiLang text="cancel" />
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="small"
            onClick={setSave}
            startIcon={<SaveIcon />}
          >
            <MultiLang text="save" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
