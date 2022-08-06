import React, { Component, Fragment } from "react";
import StripeForm from "../../../../components/Stripe/StripeElement";
import $ from "jquery";
import toastr from "toastr";
class AddCard extends Component {
  escFunction(event) {
    if (event.keyCode === 27) {
      $("#add-card").removeClass("is-visible");
      $("body").removeClass("modal-open");
    }
  }
  componentDidMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    $(".add-card-btn").on("click", function (e) {
      if (user) {
        e.preventDefault();
        $("#add-card").addClass("is-visible");
        $("body").addClass("modal-open");
      } else {
        toastr.info("You have to sign in!");
      }
    });
    $(".cancel-button").on("click", function (e) {
      e.preventDefault();
      $("#add-card").removeClass("is-visible");
      $("body").removeClass("modal-open");
    });
    $(".overlay").on("click", function (e) {
      e.preventDefault();
      $("#add-card").removeClass("is-visible");
      $("body").removeClass("modal-open");
    });
    document.addEventListener("keydown", this.escFunction, false);
  }
  render() {
    return (
      <Fragment>
        <div className="custom-modal" id="add-card">
          <div className="overlay"></div>
          <div className="staff-modal">
            <div className="staff-modal-header">
              <h4>Add Card</h4>
            </div>
            <div className="staff-madal-body">
              <div className="modal-detail">
                <StripeForm history={this.props.history} />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddCard;
