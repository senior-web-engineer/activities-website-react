import { newDate } from "lib/dateLib";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import toastr from "toastr";
import { db } from "../../../../services/firebase";

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
export default function QuickWithdraw(props) {
  const classes = useStyles();
  const [reportContent, setReportContent] = useState("");

  const setSave = () => {
    if (reportContent !== "") {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const reviewData = props.reviewData;
      db.collection("reviews")
        .add({
          reported_review: reportContent,
          reported_date: newDate(),
          reported_user: user.id,
          reported_email: user.email,
          review_id: reviewData.id,
          status: "1",
        })
        .then((res) => {
          db.collection("reviews")
            .doc(reviewData.id)
            .update({
              status: "1",
            })
            .then(() => {
              toastr.success("Report request sended to admin successfully!");
              props.onClose();
            })
            .catch((error) => {
              console.log(error.message);
            });
        })
        .catch((error) => {
          toastr.warning("Please try again!");
        });
    } else {
      toastr.info("Write report content!");
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        aria-labelledby="form-dialog-title"
        className="report-dialog"
      >
        <DialogTitle className={classes.dialog} id="form-dialog-title">
          Report Review
        </DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <p>Report Content : </p>
            <textarea
              className="form-control cu-radius withdraw-input"
              onChange={(e) => setReportContent(e.target.value)}
              value={reportContent}
              rows="5"
              placeholder="write report content here"
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => props.onClose()}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="small"
            onClick={setSave}
            startIcon={<SaveIcon />}
          >
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
