import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux";
import { myCalendar } from "../../../Store/action/widget";
import CalendarDetail from "../../content/element/modal/calendar-detail";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

class CalenderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone_number: "",
      avater: "",
      calendarData: [],
      showModal: false,
      targetData: {},
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ calendarData: nextProps.calendarData });
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.myCalendar();
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      email: user.email,
      name: user.name,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }

  closeModal = (flag) => {
    this.setState({ showModal: flag });
  };

  eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = "#fa8b0c";
    if (event.bookingData.status === "2") {
      backgroundColor = "#8b8b8b";
    }
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  render() {
    const localizer = momentLocalizer(moment);
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={2} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <FontAwesome name="calendar" />
                          <MultiLang text="my_calendar" />
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      <Calendar
                        localizer={localizer}
                        events={this.state.calendarData}
                        selectable={true}
                        eventPropGetter={this.eventStyleGetter}
                        onSelectEvent={(e) => {
                          this.setState({ targetData: e, showModal: true });
                        }}
                        editable={true}
                        style={{ height: 500 }}
                      />
                      {this.state.showModal && (
                        <CalendarDetail
                          events={this.state.targetData}
                          history={this.props.history}
                          open={this.state.showModal}
                          onclose={this.closeModal}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_author_module -->*/}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    calendarData: state.widget.calendar_data,
    logo: state.logo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    myCalendar: () => dispatch(myCalendar()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CalenderComponent);
