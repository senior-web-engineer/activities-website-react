import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import $ from "jquery";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  deleteStaff,
  getStaffLists,
} from "../../../Store/action/staffManagement";
import AddStaff from "../../content/element/modal/add-staff";
import EditStaff from "../../content/element/modal/edit-staff";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

export class staffManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone_number: "",
      avater: "",
      staffLists: [],
      lists: [],
      selectedId: null,
      open: false,
    };
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.props.getStaffLists(user.id);
    this.setState((prevState) => ({
      ...prevState,
      email: user.email,
      name: user.name,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      staffLists: nextProps.staffLists.staffLists,
      lists: nextProps.staffLists.staffLists,
    });
  }
  handleDelete = (id) => {
    const deleteDoc = this.state.lists[id];
    this.state.lists.splice(id, 1);
    this.setState({ staffLists: this.state.lists });
    this.props.deleteStaff(deleteDoc.id);
  };
  handleUpdate = (id) => {
    $(".edit-icon").on("click", function (e) {
      e.preventDefault();
      $("#edit-staff-modal").addClass("is-visible");
      $("body").addClass("modal-open");
    });
    this.setState({ selectedId: id, open: true });
  };

  render() {
    const { selectedId, staffLists } = this.state;
    return (
      <Fragment>
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
        </section>
        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={6} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-users"></span>
                          <MultiLang text="staff_management" />
                        </h4>
                      </div>
                      <div className="add-staff">
                        + <MultiLang text="add_staff" />
                      </div>
                    </div>

                    <div className="atbdb_content_module_contents">
                      <div className="container">
                        <table className="table table-responsive-sm  center">
                          <thead>
                            <tr>
                              <th>
                                <MultiLang text="email" />
                              </th>
                              <th>
                                <MultiLang text="name" />
                              </th>
                              <th>
                                <MultiLang text="activity_title" />
                              </th>
                              <th>
                                <MultiLang text="action" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.staffLists.length > 0 &&
                              this.state.staffLists.map((item, key) => {
                                return (
                                  <tr key={key}>
                                    <td className="email">{item.email}</td>
                                    <td>{item.name}</td>
                                    <td>{item.ad_title}</td>
                                    <td>
                                      <div className="table-action">
                                        <i
                                          className="la la-edit la-2x cu-setting-circle-icon edit-icon"
                                          onClick={(e) => {
                                            this.handleUpdate(key);
                                          }}
                                        ></i>
                                        <i
                                          className="la la-trash la-2x cu-setting-circle-icon"
                                          onClick={(e) =>
                                            this.handleDelete(key)
                                          }
                                        ></i>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <EditStaff
          staffInfo={staffLists[selectedId]}
          open={this.state.open}
          onClose={(e) => this.setState({ open: false })}
        />
        <AddStaff />
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    staffLists: state.staff,
    logo: state.logo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getStaffLists: (id) => dispatch(getStaffLists(id)),
    deleteStaff: (id) => dispatch(deleteStaff(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(staffManagement);
