import React, { Fragment, Component } from "react";
// import Avatar from "@material-ui/core/Avatar";
import ChatSendBox from "./chat-send-box";
// import { ChatFeed, Message } from "react-chat-ui-withchattime";
import { getChatMessage } from "../../../Store/action/chatAction";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { connect } from "react-redux";
import moment from "moment";
import avatar from "../../../assets/img/default.jpg";

class ChatMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      is_typing: false,
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  }
  componentDidUpdate() {
    let chatContainer = document.querySelector("div.chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let chatMessages = [];
    let userFlag = true;
    let previos_user = "";
    nextProps.messages &&
      nextProps.messages.forEach((element) => {
        const currentDate = moment().unix();
        let date = "";
        let offsetDate = currentDate - moment(element.created_at).unix();
        if (offsetDate > 86400) {
          date = moment(element.created_at).format("MM/DD HH:mm");
        } else {
          date = moment(element.created_at).format("HH:mm");
        }

        if (element.send_from === this.state.user.id) {
          userFlag = true;
          chatMessages.push(
            // new Message(
            {
              id: 0,
              message: element.message,
              // senderName: <Avatar src={this.state.user.profile_picture} />,
              img: avatar,
              dateFormat: date,
            }
            // )
          );
        } else {
          if (userFlag || element.send_from !== previos_user) {
            chatMessages.push({
              id: 1,
              message: element.message,
              img: element?.picture_url || avatar,
              dateFormat: date,
            });
            userFlag = false;
            previos_user = element.send_from;
          } else {
            chatMessages.push({
              id: 1,
              img: "",
              message: element.message,
              dateFormat: date,
            });
          }
        }
      });
    this.setState((prevState) => ({ ...prevState, messages: chatMessages }));
  }
  render() {
    const role = JSON.parse(sessionStorage.getItem("role"));

    return (
      <Fragment>
        <div className="atbd_author_module">
          <div className="atbd_content_module chat-main-layout">
            <div className="container chat-container">
              {this.state.messages &&
                this.state.messages.length > 0 &&
                this.state.messages.map((item, key) => {
                  return item.id === 1 ? (
                    <div className="d-flex justify-content-start" key={key}>
                      {item.img !== "" ? (
                        <div>
                          <img src={item.img} alt="" className="avatar" />
                        </div>
                      ) : (
                        <div className="avatar"></div>
                      )}
                      <div className="chat-content-container">
                        <div
                          className="chat-div"
                          style={{ background: "#d38610" }}
                        >
                          <h6 className="chat-content">{item.message}</h6>
                          <div className="d-flex justify-content-end align-items-center">
                            <h6 style={{ fontSize: "11px" }}>
                              {item.dateFormat}
                            </h6>
                            <h6 className="p-left-10">
                              <DoneAllIcon
                                style={{ fontSize: 14 }}
                                color="secondary"
                              />
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end" key={key}>
                      <div className="chat-content-container">
                        <div className="chat-div">
                          <h6 className="chat-content">{item.message}</h6>
                          <div className="d-flex justify-content-end align-items-center">
                            <h6 style={{ fontSize: "11px" }}>
                              {item.dateFormat}
                            </h6>
                            <h6 className="p-left-10">
                              <DoneAllIcon
                                style={{ fontSize: 14 }}
                                color="secondary"
                              />
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {/* <ChatFeed
                messages={this.state.messages} // Boolean: list of message objects
                isTyping={this.state.is_typing} // Boolean: is the recipient typing
                hasInputField={false} // Boolean: use our input, or use your own
                showSenderName // show the name of the user who sent the message
                bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
                bubbleStyles={{
                  text: {
                    fontSize: 12,
                  },
                }}
              />  */}
            </div>
            <ChatSendBox role={role} />
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    messages: state.chat.messages,
  };
};
const mapActionsToProps = { getChatMessage };
export default connect(mapStateToProps, mapActionsToProps)(ChatMain);
