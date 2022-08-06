import React, { Component, Fragment } from "react";
// import { connect } from 'react-redux';
// import { LogInAc } from '../../../../Store/action/loginAction';
// import $ from 'jquery';

class Notification extends Component {
  render() {
    return (
      <Fragment>
        <div
          className="modal fade"
          id="notification_modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="notification_modal_label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h5
                  className="modal-title"
                  id="notification_modal_label"
                  style={{ fontSize: "18px" }}
                >
                  <i className="la la-sticky-note" />
                  Notification
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body" style={{ padding: "16px" }}>
                Lacinia eget consectetur sed, convallis at tellus. Vivamus magna
                justo, lacinia eget consectetur sed, convallis at tellus.
                Vestibulum ac diam... Lacinia eget consectetur sed, convallis at
                tellus. Vivamus magna justo, lacinia eget consectetur sed,
                convallis at tellus. Vestibulum ac diam... Lacinia eget
                consectetur sed, convallis at tellus. Vivamus magna justo,
                lacinia eget consectetur sed, convallis at tellus. Vestibulum ac
                diam... Lacinia eget consectetur sed, convallis at tellus.
                Vivamus magna justo, lacinia eget consectetur sed, convallis at
                tellus. Vestibulum ac diam...
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default Notification;
