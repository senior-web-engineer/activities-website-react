import Header from "components/layout/header";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

export default function AccountHeader() {
  // const [user] = useState(JSON.parse(sessionStorage.getItem("user")) ?? {});
  const logo = useSelector((state) => state.logo[0].light);
  const history = useHistory();
  return (
    <>
      <div className="mainmenu-wrapper">
        <Header logo={logo} class="menu--light" history={history} />
      </div>
      {/* <div className="profile-avatar">
        <img src={user?.avatar || avatar} alt="" />
      </div>
      <div className="profile-info">
        <h2>
          <FontAwesome name="envelope" style={{ paddingRight: "12px" }} />
          {user.email}
        </h2>
        <h5>
          <FontAwesome name="user" style={{ paddingRight: "12px" }} />
          {user.name}
        </h5>
        <h5>
          <FontAwesome name="phone" style={{ paddingRight: "12px" }} />
          {user.phone_number ? (
            user.phone_number
          ) : (
            <MultiLang text="no_phone_yet" />
          )}
        </h5>
      </div> */}
    </>
  );
}
