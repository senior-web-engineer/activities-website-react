import React, { Fragment, Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import SendIcon from "@material-ui/icons/Send";
import { connect } from "react-redux";
import InputAdornment from "@material-ui/core/InputAdornment";
import { sendMessage } from "../../../Store/action/chatAction";

class ChatSendBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMsg: "",
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  sendMessage = () => {
    if (this.state.sendMsg === "") {
      return false;
    }
    this.props.sendMessage(this.state.sendMsg);
    this.setState({ sendMsg: "" });
  };
  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      if (this.state.sendMsg === "") {
        return false;
      }
      this.props.sendMessage(this.state.sendMsg);
      this.setState({ sendMsg: "" });
    }
  };
  render() {
    const { status } = this.props;
    return (
      <Fragment>
        {status.type === "private" ? (
          <OutlinedInput
            className="chat-send-box"
            id="standard-send-message"
            value={this.state.sendMsg}
            onKeyUp={this.handleKeyUp}
            disabled={status.flag === "0" ? false : true}
            placeholder={
              status.flag === "0" ? "" : "You cannot chat with this account"
            }
            type="text"
            style={{ height: "45px", width: "100%" }}
            onChange={(e) => this.setState({ sendMsg: e.target.value })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  style={{ outline: "none", color: "#358804" }}
                  aria-label="toggle password visibility"
                  onClick={this.sendMessage}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <OutlinedInput
            className="chat-send-box"
            id="standard-send-message"
            value={this.state.sendMsg}
            onKeyUp={this.handleKeyUp}
            type="text"
            style={{ height: "45px", width: "100%" }}
            onChange={(e) => this.setState({ sendMsg: e.target.value })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  style={{ outline: "none", color: "#358804" }}
                  aria-label="toggle password visibility"
                  onClick={this.sendMessage}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.chat.block_flag,
  };
};
const mapActionsToProps = { sendMessage };

export default connect(mapStateToProps, mapActionsToProps)(ChatSendBox);
