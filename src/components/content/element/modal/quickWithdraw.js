import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import DialogActions from "@material-ui/core/DialogActions";
import clsx from "clsx";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import { RadioGroup } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CancelIcon from "@material-ui/icons/Cancel";
import Radio from "@material-ui/core/Radio";
import toastr from "toastr";
import * as Actions from "../../../../Store/action/bankAction";
import { MultiLang } from "../widget";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    borderRadius: "30px !important",
    height: "38px !important",
  },
  withdraw: {
    width: "30%",
    marginTop: "20px",
    marginLeft: "30px",
  },
  dialog: {
    textAlign: "center",
    background: "#afdb30",
    "& h2": {
      color: "#fff !important",
    },
  },
}));
export default function QuickWithdraw() {
  const dispatch = useDispatch();
  const bankInfo = useSelector((state) => state.bank.bank_info);
  const totalMoney = useSelector((state) => state.bank.total);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState("");
  const [amount, setAmount] = useState("");
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    Actions.getBankAccount(dispatch);
  }, [dispatch]);

  const accountDel = (id) => {
    dispatch(Actions.deleteBankAccount(id));
  };
  const setSave = () => {
    if (!checked || amount > totalMoney || amount === "") {
      toastr.info(
        "You must select bank account information or withdraw Money is over"
      );
      return false;
    }
    dispatch(Actions.advertiserWithdraw(checked, amount));
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
        className={clsx(
          classes.withdraw,
          "btn btn-block btn-gradient btn-gradient-two btn-lg claim-btn cu-radius cu-hover cu-widthdraw"
        )}
        onClick={handleClickOpen}
      >
        {" "}
        <MultiLang text="withdraw" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.dialog} id="form-dialog-title">
          <MultiLang text="withdraw" />
        </DialogTitle>
        <DialogContent>
          <div>
            <h5 className="withdraw-total">
              <MultiLang text="avaliable_money" /> : $ {totalMoney}
            </h5>
            <input
              type="number"
              className="form-control cu-radius withdraw-input"
              onChange={(e) => setAmount(e.target.value)}
              // onChange={(e) =>
              //     this.setState({ business_address: e.target.value })
              // }
              required
            />
          </div>
          <h5 className="withdraw-total">
            <MultiLang text="select_bank_account" />{" "}
          </h5>
          <RadioGroup aria-label="delaied" name="delaied" value={checked}>
            <div className="row bank-info-box">
              {bankInfo && bankInfo.length > 0 ? (
                bankInfo.map((item, key) => {
                  return (
                    <div className="col-md-12" key={key}>
                      <FormControlLabel
                        value="Male"
                        control={
                          <Radio
                            className="cu-icon-color"
                            value={item.id}
                            onChange={(e) => {
                              e.preventDefault();
                              setChecked(e.target.value);
                            }}
                          />
                        }
                        label={item.name_of_account}
                      />
                      <div
                        className="bank-account-box"
                        onClick={(e) => setChecked(item.id)}
                      >
                        <h6>
                          <MultiLang text="account_num" /> :{" "}
                          {item.account_number}
                        </h6>
                        <h6 className="mb-10">
                          <MultiLang text="routing_num" /> :{" "}
                          {item.routing_number}{" "}
                        </h6>
                        <div
                          className="bank-remove"
                          onClick={(e) => accountDel(item.id)}
                        >
                          <IconButton className="cu-act-icnbtn" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h5 className="p-lg-4 color-gplus">
                  <MultiLang text="no_bank_info" />
                  <br /> <MultiLang text="create_bank_info" />
                </h5>
              )}
            </div>
          </RadioGroup>
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
            <MultiLang text="withdraw" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
