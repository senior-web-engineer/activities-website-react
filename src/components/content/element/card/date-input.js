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
    "& .MuiInput-underline:before": {
      display: "none !important",
    },
    "& .MuiInput-underline:after": {
      display: "none !important",
    },
  },
}));

export default function MaterialUIPickers({ date, handleSetDate }) {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        className={`${classes.root} form-control`}
        format="MM/dd/yyyy"
        margin="normal"
        value={newDate(moment(date).unix() * 1000)}
        onChange={handleSetDate}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
