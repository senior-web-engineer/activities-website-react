import React, { Component, Fragment } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "react-dropdown-select";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux";
import {
  getActivityLists,
  setStaff,
} from "../../../../Store/action/staffManagement";
import toastr from "toastr";
import $ from "jquery";
import { MultiLang } from "../widget";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
const initialState = {
  activityLists: [],
  name: "",
  email: "",
  activityId: "",
  password: "",
  checkins: false,
  emergency: false,
  list_participants: false,
  total_participants: false,
};
class AddStaff extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.escFunction = this.escFunction.bind(this);
  }
  handleSubmit = () => {
    if (this.state.email === "" || this.state.name === "") {
      toastr.info("Write staff information!");
      return false;
    }
    if (this.state.password === "" || this.state.password.length < 6) {
      toastr.info("Write staff password and must 6 letters");
      return false;
    }
    if (this.state.activityId === "") {
      toastr.info("Select activity!");
      return false;
    } else {
      this.props.setStaff(this.state).then((res) => {
        if (res) {
          window.location.href = "/staff-management";
        }
      });
    }
  };

  escFunction(event) {
    if (event.keyCode === 27) {
      $(".custom-modal").removeClass("is-visible");
      $("body").removeClass("modal-open");
    }
  }
  UNSAFE_componentWillReceiveProps(nexProps) {
    this.setState({
      activityLists: nexProps.activityLists.activityLists,
    });
  }

  componentDidMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.props.getActivityLists(user.id);
    $(".add-staff").on("click", function (e) {
      e.preventDefault();
      $("#add-staff-modal").addClass("is-visible");
      $("body").addClass("modal-open");
    });
    $(".cancel-button").on("click", function (e) {
      e.preventDefault();
      $("#add-staff-modal").removeClass("is-visible");
      $("body").removeClass("modal-open");
    });
    $(".overlay").on("click", function (e) {
      e.preventDefault();
      $("#add-staff-modal").removeClass("is-visible");
      $("body").removeClass("modal-open");
    });
    document.addEventListener("keydown", this.escFunction, false);
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <div className="custom-modal" id="add-staff-modal">
          <div className="overlay"></div>
          <div className="staff-modal">
            <div className="staff-modal-header">
              <h4>
                <MultiLang text="add_staff" />
              </h4>
            </div>
            <div className="staff-madal-body">
              <div className="modal-detail">
                <div className="row">
                  <div className="col-sm-7">
                    <label>
                      <MultiLang text="email" /> :
                    </label>
                    <input
                      type="email"
                      placeholder={t("staff_email")}
                      className="card-number-input"
                      value={this.state.email}
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                      required
                    />
                  </div>
                  <div className="col-sm-5">
                    <label>
                      <MultiLang text="full_name" /> :
                    </label>
                    <input
                      type="text"
                      placeholder={t("staff_name")}
                      className="card-number-input"
                      value={this.state.name}
                      onChange={(e) => {
                        this.setState({ name: e.target.value });
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 mt-10">
                <label>
                  <MultiLang text="pwd" /> :
                </label>
                <input
                  type="password"
                  placeholder={t("staff_pwd")}
                  className="card-number-input"
                  value={this.state.password}
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                  required
                />
              </div>
              <div className="select-activity">
                <label>
                  <MultiLang text="select_activity" /> :
                </label>
                <Select
                  searchable={false}
                  placeholder={t("select_activity")}
                  options={this.state.activityLists}
                  onChange={(values) =>
                    this.setState({ activityId: values[0].value })
                  }
                />
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
                        checked={this.state.checkins}
                        onChange={(e) =>
                          this.setState({ checkins: !this.state.checkins })
                        }
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
                        checked={this.state.emergency}
                        onChange={(e) =>
                          this.setState({ emergency: !this.state.emergency })
                        }
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
                        checked={this.state.list_participants}
                        onChange={(e) =>
                          this.setState({
                            list_participants: !this.state.list_participants,
                          })
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
                        checked={this.state.total_participants}
                        onChange={(e) =>
                          this.setState({
                            total_participants: !this.state.total_participants,
                          })
                        }
                      />
                    }
                    label={t("total_num_of_participants")}
                  />
                </div>
              </div>
            </div>
            <div className="staff-modal-footer">
              <div className="footer-contoller">
                <div>
                  <div className="btn-gradient btn-outline-success btn btn-md btn-icon icon-left cancel-button">
                    <FontAwesome name="times" />
                    <MultiLang text="cancel" />
                  </div>
                </div>
                <div>
                  <div
                    className="btn-gradient btn-gradient-two btn btn-md btn-icon icon-left"
                    onClick={this.handleSubmit}
                  >
                    <FontAwesome name="save" />
                    <MultiLang text="save" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    activityLists: state.staff,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getActivityLists: (id) => dispatch(getActivityLists(id)),
    setStaff: (data) => dispatch(setStaff(data)),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(AddStaff);
