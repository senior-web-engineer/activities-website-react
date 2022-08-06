import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import QRCode from "qrcode.react";
import CircularProgress from "@material-ui/core/CircularProgress";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import defaultImage from "../../../../assets/img/default-img.svg";
import * as Actions from "../../../../Store/action/widget";
import toastr from "toastr";
import { MultiLang } from "../widget";

export default function CalendaDetail(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [calendarData, setCalendarData] = useState(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setCalendarData(props.events);
    const startDate = moment(props.events.start).unix();
    const currentDate = moment().unix();
    if (
      startDate - currentDate < 86400 ||
      props.events.bookingData.status === "2"
    ) {
      setDisableBtn(true);
    }
    setOpen(props.open);
  }, [props]);

  const selectChatRoom = (chatRoomId) => {
    if (props.events.bookingData.status === "2") {
      toastr.info("This booking is canceled!");
      return false;
    } else {
      sessionStorage.setItem("chatRoomId", JSON.stringify(chatRoomId));
      props.history.push("/chat");
    }
  };

  const downloadQR = (id) => {
    const canvas = document.getElementById(id);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = id + " .png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const cancelBooking = (bookingId, transId, extraSessionId) => {
    setLoad(true);
    setDisableBtn(true);
    dispatch(Actions.cancelBooking(bookingId, transId, extraSessionId)).then(
      (res) => {
        // if (res) {
        props.onclose(false);
        setLoad(false);
        // }
      }
    );
    // dispatch(Actions.cancelBooking(bookingId, transId, extraSessionId));
    // props.onclose(false);
    // setLoad(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle className="calendar-title">
          <MultiLang text="booking_info" />
          <div
            className="calendar-chat"
            onClick={(e) => selectChatRoom(calendarData.chatRoomId)}
          >
            <FontAwesome name="comments" size="lg" /> <MultiLang text="chat" />{" "}
            <MultiLang text="now" />
          </div>
          <div className="calendar-close" onClick={(e) => props.onclose(false)}>
            <FontAwesome name="times-circle" size="lg" />
          </div>
        </DialogTitle>
        <DialogContent>
          {calendarData && (
            <div>
              <div className="row" style={{ position: "relative" }}>
                <div className="col-md-5">
                  <div className="user-ordered-img">
                    <img
                      src={
                        calendarData
                          ? calendarData.listingData.picture[0]
                          : defaultImage
                      }
                      alt=""
                    />
                  </div>
                  {calendarData.listingData.camp_type === 2 && (
                    <div className="virtual-mark1">
                      <MultiLang text="virtual" />
                    </div>
                  )}
                  <div>
                    <label>
                      <b>
                        <MultiLang text="childname" />
                      </b>{" "}
                      : {calendarData.bookingData.child_name}{" "}
                      {calendarData.bookingData.surname}
                    </label>
                    <label>
                      <b>
                        <MultiLang text="id" /> :
                      </b>{" "}
                      {calendarData.bookingData.id}
                    </label>
                    <label>
                      <b>
                        <MultiLang text="date" />:
                      </b>{" "}
                      {calendarData.bookingData.date}
                    </label>
                    <label>
                      <b>
                        <MultiLang text="childdob" />:
                      </b>{" "}
                      {calendarData.bookingData.child_dob}
                    </label>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-12 cart-description">
                      <p style={{ marginTop: 20 }}>
                        <FontAwesome name="tablet" />{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <MultiLang text="title" /> :
                        </span>{" "}
                        {calendarData.listingData.ad_title}
                      </p>
                      <p>
                        <FontAwesome name="tags" />{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <MultiLang text="category" /> :
                        </span>{" "}
                        {calendarData.listingData.category_name}
                      </p>

                      <p>
                        <FontAwesome name="dollar-sign" />{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <MultiLang text="price" /> :
                        </span>{" "}
                        {calendarData.listingData.price}
                      </p>
                      <p>
                        <FontAwesome name="map-marker" />{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <MultiLang text="address" /> :
                        </span>{" "}
                        <span></span>
                      </p>
                      <p className="user-booking-info">
                        {calendarData.listingData.address &&
                          calendarData.listingData.address.street +
                            ", " +
                            calendarData.listingData.address.city +
                            ", " +
                            calendarData.listingData.address.state +
                            ", " +
                            calendarData.listingData.address.country}
                      </p>
                      <p>
                        <FontAwesome name="calendar" />
                        <span style={{ fontWeight: "bold" }}>Session :</span>
                      </p>
                      <p className="user-booking-info">
                        {moment(
                          calendarData.listingData.start_date.seconds * 1000
                        ).format("MM/DD/YYYY")}{" "}
                        : {calendarData.listingData.start_time} ~{" "}
                        {moment(
                          calendarData.listingData.end_date.seconds * 1000
                        ).format("MM/DD/YYYY")}{" "}
                        : {calendarData.listingData.end_time}
                      </p>
                      {calendarData.listingData.video !== "" && (
                        <p className="font-style p-top-0">
                          <VideoLibraryIcon />
                          <span className="p-left-5">
                            <b>
                              <MultiLang text="video" /> :
                            </b>
                          </span>
                          <a
                            className="p-left-10"
                            href={"https://" + calendarData.listingData.video}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {calendarData.listingData.video}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="qr-code">
                  <QRCode
                    id={calendarData.bookingData.id}
                    value={calendarData.bookingData.id}
                    size={100}
                    level={"H"}
                    includeMargin={true}
                  />
                  <Button
                    onClick={(e) => downloadQR(calendarData.bookingData.id)}
                    style={{ width: "140px" }}
                  >
                    {" "}
                    <FontAwesome name="download" size="lg" />
                    <MultiLang text="qr" />{" "}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {calendarData && calendarData.listingData.camp_type === 2 && (
            <div className="virtual-link">
              <label>
                <MultiLang text="virtual_link" />:
              </label>
              <a
                href={
                  calendarData.listingData.virtual_link === ""
                    ? "https://whereby.com/ticketmarket"
                    : "https://" + calendarData.listingData.virtual_link
                }
                rel="noopener noreferrer"
              >
                {calendarData.listingData.virtual_link !== ""
                  ? calendarData.listingData.virtual_link
                  : "whereby.com/ticketmarket"}
              </a>
            </div>
          )}
          <Button
            variant="contained"
            color="secondary"
            className="cu-button-outline"
            autoFocus
            onClick={(e) =>
              cancelBooking(
                calendarData.bookingData.id,
                calendarData.bookingData.transaction_id,
                calendarData.bookingData.extra_session_id
              )
            }
            disabled={disableBtn}
          >
            <FontAwesome name="trash" size="lg" />
            <MultiLang text="cancel_booking" />
          </Button>
          {load && <CircularProgress size={24} className="disable-spin" />}
        </DialogActions>
      </Dialog>
    </div>
  );
}
