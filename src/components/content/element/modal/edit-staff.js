import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import toastr from "toastr";
import Checkbox from "@material-ui/core/Checkbox";
// import Select from "react-dropdown-select";
import FontAwesome from "react-fontawesome";
import * as Actions from "../../../../Store/action/staffManagement";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MultiLang } from "../widget";
import { useTranslation } from "react-i18next";

export default function AddStaff(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activityLists = useSelector((state) => state.staff.activityLists);
  const [name, setName] = useState("");
  const [docId, setDocId] = useState("");
  const [email, setEmail] = useState("");
  const [activityId, setActivityId] = useState("");
  const [checkins, setCheckins] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [totalParticipants, setTotalParticipants] = useState(false);
  const [listParticipants, setListParticipants] = useState(false);

  useEffect(() => {
    setDocId(props?.staffInfo?.id ?? "");
    setName(props?.staffInfo?.name ?? "");
    setEmail(props?.staffInfo?.email ?? "");
    setActivityId(props?.staffInfo?.active_camp_id ?? "");
    setCheckins(props?.staffInfo?.permission_checkins ?? false);
    setEmergency(props?.staffInfo?.permission_emergency ?? "");
    setTotalParticipants(
      props?.staffInfo?.permission_total_participants ?? false
    );
    setListParticipants(
      props?.staffInfo?.permission_list_participants ?? false
    );
  }, [props]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(Actions.getActivityLists(user.id));
  }, [dispatch]);

  const handleSubmit = () => {
    if (activityId === "") {
      toastr.info("Select activity");
      return false;
    }
    const data = {
      permission_checkins: checkins,
      permission_emergency: emergency,
      permission_list_participants: listParticipants,
      permission_total_participants: totalParticipants,
      active_camp_id: activityId,
      email: email,
      name: name,
      docId: docId,
    };
    dispatch(Actions.updateStaff(data)).then((res) => {
      if (res) {
        props.onClose();
        const user = JSON.parse(sessionStorage.getItem("user"));
        dispatch(Actions.getStaffLists(user.id));
      }
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={(e) => props.onClose()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle className="calendar-title">
        <MultiLang text="edit_staff" />
        <div
          className="calendar-close pointer"
          onClick={(e) => props.onClose()}
        >
          <FontAwesome name="times-circle" size="lg" />
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="staff-madal-body">
          <div className="modal-detail">
            <div className="d-flex justify-contents-center align-items-center">
              <label className="font-weight-bold">
                <MultiLang text="email" />:
              </label>
              <input
                type="email"
                placeholder={t("staff_email")}
                className="form-control m-left-20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-contents-center align-items-center m-top-10 m-bottom-10">
              <label className="font-weight-bold">
                <MultiLang text="full_name" /> :
              </label>
              <input
                type="text"
                placeholder={t("staff_name")}
                className="form-control m-left-20"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="p-2">
            <FormControl variant="outlined" fullWidth={true}>
              <Select
                native
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
              >
                {activityLists &&
                  activityLists.length > 0 &&
                  activityLists.map((item, key) => {
                    return (
                      <option key={key} value={item.value}>
                        {item.label}
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className="edit-role">
            <label>
              <MultiLang text="permission" /> :
            </label>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="checkins"
                    className="cu-icon-color"
                    checked={checkins}
                    onChange={(e) => setCheckins((prevState) => !prevState)}
                  />
                }
                label={t("see_team_member")}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="emergency"
                    className="cu-icon-color"
                    checked={emergency}
                    onChange={(e) => setEmergency((prevState) => !prevState)}
                  />
                }
                label={t("emergency_contact_data")}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="list_participants"
                    className="cu-icon-color"
                    checked={listParticipants}
                    onChange={(e) =>
                      setListParticipants((prevState) => !prevState)
                    }
                  />
                }
                label={t("see_list_of_participants")}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="total_participants"
                    className="cu-icon-color"
                    checked={totalParticipants}
                    onChange={(e) =>
                      setTotalParticipants((prevState) => !prevState)
                    }
                  />
                }
                label={t("total_num_of_participants")}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div
          className="btn-gradient btn-gradient-two btn btn-md btn-icon icon-left"
          onClick={handleSubmit}
        >
          <FontAwesome name="save" />
          <MultiLang text="save" />
        </div>
      </DialogActions>
    </Dialog>
  );
}
