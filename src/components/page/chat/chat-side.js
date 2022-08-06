import React, { Component, Fragment } from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { db } from "../../../services/firebase";
import avatar from "../../../assets/img/default.jpg";
import FontAwesome from "react-fontawesome";
import defaultActivityImg from "../../../assets/img/default-activity.jpg";
import {
  getChatRoom,
  getGroupChatRooms,
  getChatMessage,
  setBlockChat,
  setDefaultBlock,
  setSelChatRoomId,
  chatBlockList,
} from "../../../Store/action/chatAction";
import { AvatarGroup } from "@material-ui/lab";
import $ from "jquery";
import { MultiLang } from "components/content/element/widget";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

class ChatSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      lastMessages: [],
      lastGroupMessages: [],
      selectedId: "",
      displayMenu: "",
      blockFlag: [],
      activeChatId: "",
    };
    this.selectAct = this.selectAct.bind(this);
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.getChatRoom();
    this.props.getGroupChatRooms();
    const selectedChatRoom = JSON.parse(sessionStorage.getItem("chatRoomId"));
    if (selectedChatRoom) {
      this.selectAct(selectedChatRoom);
      sessionStorage.removeItem("chatRoomId");
    }
  }
  async componentDidMount() {
    await db.collection("chat_block").onSnapshot((res) => {
      this.props.chatBlockList();
      if (this.state.selectedId !== "") {
        this.props.getChatMessage(this.state.selectedId, "private");
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let lastMessages = [],
      lastGroupMessages = [],
      messages = nextProps.messages;
    const selLastMessage =
      messages === null
        ? ""
        : messages.length > 0
        ? messages[messages.length - 1].message
        : "";
    if (nextProps.rooms && nextProps.rooms.length > 0) {
      let blockFlag = [];
      nextProps.rooms.forEach((item) => {
        let advertiserFlag = false;
        let userFlag = false;
        if (item.status === "1") {
          advertiserFlag = true;
        } else if (item.status === "2") {
          userFlag = true;
        } else if (item.status === "3") {
          advertiserFlag = true;
          userFlag = true;
        }
        blockFlag = [
          ...blockFlag,
          {
            id: item.id,
            status: item.status,
            advertiserFlag: advertiserFlag,
            userFlag: userFlag,
          },
        ];
      });
      this.setState({ blockFlag: blockFlag });
      nextProps.rooms.map((item) => {
        if (item.id === this.state.selectedId) {
          return (lastMessages = [...lastMessages, selLastMessage]);
        } else {
          return (lastMessages = [...lastMessages, item.lastMessage]);
        }
      });
    }
    if (nextProps.groupRooms && nextProps.groupRooms.length > 0) {
      nextProps.groupRooms.map((item) => {
        if (item.id === this.state.selectedId) {
          return (lastGroupMessages = [...lastGroupMessages, selLastMessage]);
        } else {
          return (lastGroupMessages = [
            ...lastGroupMessages,
            item.last_message,
          ]);
        }
      });
    }
    this.setState((prevState) => ({
      ...prevState,
      lastMessages: lastMessages,
      lastGroupMessages: lastGroupMessages,
    }));
  }

  selectAct = (roomId, type) => {
    this.setState({ selectedId: roomId, activeChatId: roomId });
    this.props.setSelChatRoomId(roomId);
    this.props.getChatMessage(roomId, type);
    this.mobileFilter();
  };

  mobileFilter = (e) => {
    $(".bgimage").removeClass("hidden");
    $("#footer").removeClass("hidden");
    $(".atbd_author_module").removeClass("hidden");
    $(".atbd_widget").addClass("filter-hidden");
    $("#listing-title").removeClass("hidden");
  };

  showDropdownMenu = (event, id) => {
    event.preventDefault();
    this.setState({ displayMenu: id });
  };

  setBlock = (flag, status, adv_id, user_id, role, elementId) => {
    this.props.setBlockChat(flag, status, adv_id, user_id, role);
  };

  setDefault = (type) => {
    if (this.state.selectedId !== "") {
      this.props.getChatMessage(this.state.selectedId, type);
    }
  };

  hideDropdownMenu = () => {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  };

  render() {
    const role = JSON.parse(sessionStorage.getItem("role"));
    const { t } = this.props;
    return (
      <Fragment>
        <div className="widget atbd_widget widget-card chat-side-layout filter-hidden">
          <div className="dashboard-nav chat-side-header">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <p className="return-filter" onClick={this.mobileFilter}>
                    <i className="la la-arrow-circle-o-left"></i>
                  </p>
                  <div className="dashboard-nav-area">
                    <ul
                      className="nav"
                      id="dashboard-tabs"
                      role="tablist"
                      style={{ width: "100%", display: "inline-flex" }}
                    >
                      <li className="nav-item chat-side-nab">
                        <a
                          className="nav-link active"
                          id="all-advertisers"
                          data-toggle="tab"
                          href="#advertisers"
                          role="tab"
                          onClick={() => {
                            this.setDefault("private");
                          }}
                          aria-controls="advertisers"
                          aria-selected="true"
                        >
                          {role && role === "user" ? (
                            <MultiLang text="providers" />
                          ) : (
                            <MultiLang text="users" />
                          )}
                        </a>
                      </li>
                      <li className="nav-item chat-side-nab">
                        <a
                          className="nav-link"
                          id="activities-tab"
                          data-toggle="tab"
                          href="#activities"
                          role="tab"
                          onClick={() => {
                            this.props.setDefaultBlock();
                          }}
                          aria-controls="activities"
                          aria-selected="false"
                        >
                          <MultiLang text="activities" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/*<!-- ends: .col-lg-12 -->*/}
              </div>
            </div>
          </div>
          {/*<!-- ends: .dashboard-nav -->*/}
          <div className="tab-content" id="dashboard-tabs-content">
            <div
              className="tab-pane fade show active"
              id="advertisers"
              role="tabpanel"
              aria-labelledby="all-advertisers"
            >
              <div className="container">
                <div className="search-wrapper">
                  <div className="search_module">
                    <span className="icon-left" id="basic-addon9">
                      <i className="la la-search"></i>
                    </span>
                    <div className="search_area">
                      <form action="/">
                        <div className="input-group input-group-light">
                          <input
                            type="text"
                            className="form-control search_field top-search-field"
                            placeholder={t("search")}
                            autoComplete="off"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .search-wrapper -->*/}
                <div className="chat-side2">
                  {this.props.rooms &&
                    this.props.rooms.map((element, i) => {
                      return (
                        <div
                          className={
                            this.state.activeChatId === element.id
                              ? "chat-side-item1 chat-side-normal active-chat"
                              : "chat-side-item1 chat-side-normal"
                          }
                          onClick={(e) => this.selectAct(element.id, "private")}
                          key={i}
                        >
                          <Avatar
                            sizes="26px"
                            alt="Remy Sharp"
                            src={element.ad_img}
                          />

                          <div className="m-left-5 w-100">
                            <div className="d-flex justify-content-between position-relative">
                              <h5 className="chat-user">{element.title}</h5>
                              <div className="d-flex justify-content-end">
                                <h6
                                  className="p-top-5"
                                  style={{ fontSize: 12 }}
                                >
                                  {element.date}
                                </h6>
                                <div className="chat-action-icon">
                                  <IconButton
                                    className="dropdown"
                                    size="small"
                                    aria-label="add an alarm"
                                    onClick={(e) =>
                                      this.showDropdownMenu(e, element.id)
                                    }
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                  {this.state.displayMenu === element.id ? (
                                    <ul>
                                      <li>
                                        <div className="d-flex">
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={
                                                  role === "user"
                                                    ? this.state.blockFlag[i]
                                                        .userFlag
                                                    : this.state.blockFlag[i]
                                                        .advertiserFlag
                                                }
                                                onChange={(e) =>
                                                  this.setBlock(
                                                    e.target.checked,
                                                    element.status,
                                                    element.advertiser_id,
                                                    element.user_id,
                                                    role,
                                                    element.id
                                                  )
                                                }
                                                name="checkedG"
                                              />
                                            }
                                            label={
                                              <span style={{ fontSize: 14 }}>
                                                Bock Chat
                                              </span>
                                            }
                                          />
                                          <FontAwesome
                                            onClick={this.hideDropdownMenu}
                                            name="times"
                                            id="top-close"
                                          />
                                        </div>
                                      </li>
                                    </ul>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <h6 className="last-messages">
                                {this.state.lastMessages[i] === ""
                                  ? "Connecting chat success!"
                                  : this.state.lastMessages[i]}
                              </h6>
                              {this.state.lastMessages[i] !== "" && (
                                <h6 className="m-right-10">
                                  <DoneAllIcon
                                    style={{ fontSize: 14, color: "#4eb152" }}
                                    color="secondary"
                                  />
                                </h6>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/*<!-- ends: .tab-pane -->*/}
            <div
              className="tab-pane fade p-bottom-30"
              id="activities"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="container">
                <div className="search-wrapper">
                  <div className="search_module">
                    <span className="icon-left" id="basic-addon9">
                      <i className="la la-search"></i>
                    </span>
                    <div className="search_area">
                      <form action="/">
                        <div className="input-group input-group-light">
                          <input
                            type="text"
                            className="form-control search_field top-search-field"
                            placeholder="Search a people"
                            autoComplete="off"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .search-wrapper -->*/}

                <div
                  className="container chat-side-container"
                  style={{
                    paddingTop: "20px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {this.props.groupRooms &&
                    this.props.groupRooms.map((element, i) => {
                      return (
                        <div className="position-relative" key={i}>
                          <div
                            className={`row group-chat-side ${
                              this.state.activeChatId === element.id
                                ? "active-chat"
                                : ""
                            }`}
                            onClick={(e) => this.selectAct(element.id, "group")}
                          >
                            <div>
                              <AvatarGroup max={3}>
                                {element.userImg.map((item, key) => {
                                  return (
                                    <Avatar
                                      alt="Remy Sharp"
                                      src={item === "" ? avatar : item}
                                      key={key}
                                    />
                                  );
                                })}
                              </AvatarGroup>
                            </div>
                            <div>
                              <h5 className="last-msg">
                                {element.advertise_title}
                              </h5>
                              <h6 className="last-msg">
                                {this.state.lastGroupMessages[i] === ""
                                  ? "Connecting chat success!"
                                  : this.state.lastGroupMessages[i]}
                              </h6>
                            </div>
                            <div className="group-overlay">
                              <img
                                src={
                                  element.activityImg === ""
                                    ? defaultActivityImg
                                    : element.activityImg
                                }
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/*<!-- ends: .tab-pane -->*/}
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    messages: state.chat.messages,
    rooms: state.chat.rooms,
    groupRooms: state.chat.groupChatRooms,
  };
};
const mapActionsToProps = {
  getChatRoom,
  getChatMessage,
  getGroupChatRooms,
  setBlockChat,
  chatBlockList,
  setDefaultBlock,
  setSelChatRoomId,
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapActionsToProps)
)(ChatSide);
