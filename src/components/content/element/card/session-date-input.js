import { newDate } from "lib/dateLib";
import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid #c5c5c5",
    borderRadius: "30px",
    justifyContent: "center",
    paddingLeft: "1.2rem",
    marginTop: "0",
    marginBottom: "0",
    "& .MuiInput-underline:before": {
      display: "none !important",
    },
    "& .MuiInput-underline:after": {
      display: "none !important",
    },
  },
}));

export default function SessionDateInput({ date, handleSetDate }) {
  const classes = useStyles();
  const handleChangeDate = (date) => {
    const selDate = newDate(date),
      mnth = ("0" + (selDate.getMonth() + 1)).slice(-2),
      day = ("0" + selDate.getDate()).slice(-2);
    const newSelDate = [selDate.getFullYear(), mnth, day].join("-");
    handleSetDate(newSelDate);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        className={`${classes.root} form-control atbdp_faqs_quez`}
        format="MM/dd/yyyy"
        margin="normal"
        value={newDate(moment(date).unix() * 1000)}
        onChange={handleChangeDate}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
