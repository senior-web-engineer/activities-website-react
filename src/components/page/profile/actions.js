import React from "react";
// import RecoverEmail from "./RecoverEmail";
import ResetPassword from "./reset-password";
import VerifyEmail from "./verify-email";

// mode - The user management action to be completed
// oobCode - A one-time code, used to identify and verify a request
// apiKey - Your Firebase project's API key, provided for convenience

const Action = (props) => {
  // Get the action to complete.
  const mode = new URLSearchParams(props.location.search).get("mode");

  // Get the one-time code from the query parameter.
  const actionCode = new URLSearchParams(props.location.search).get("oobCode");

  // (Optional) Get the API key from the query parameter.
  // const apiKey = props.location.query.apiKey;

  // Handle the user management action.
  switch (mode) {
    // case "recoverEmail":
    //   // Display reset password handler and UI.
    //   return <RecoverEmail actionCode={actionCode} />;
    case "resetPassword":
      // Display email recovery handler and UI.
      return <ResetPassword actionCode={actionCode} history={props.history} />;
    case "verifyEmail":
      // Display email verification handler and UI.
      return <VerifyEmail actionCode={actionCode} />;
    default:
      // Error: invalid mode.
      return (
        <div className="Action">
          <h1>Error encountered</h1>
          <p>The selected page mode is invalid.</p>
        </div>
      );
  }
};

export default Action;
