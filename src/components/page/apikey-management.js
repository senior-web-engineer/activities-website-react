import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import axios from "axios";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import toastr from "toastr";
import firebase, { db } from "../../services/firebase";
import { Footer } from "../layout/footer";
import SideBar from "../page/profile/sidebar-component";

function ApiKeyManagement() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const history = useHistory();
  const [apikey, setApikey] = useState(null);
  const copytext = React.useRef();

  const createApikey = async () => {
    db.collection("advertiser")
      .doc(user.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const apikey = doc.data()?.api_key ?? "";
          if (apikey === "") {
            axios
              .post("https://www.activities.app/api/create-accesstoken", {
                advertiserid: user.id,
                email: user.email,
              })
              .then((res) => {
                if (res.status === 201) {
                  toastr.success("ApiKey created successfully.");
                  setApikey(res.data.api_key);
                }
              })
              .catch((error) => {
                console.log(error.message);
              });
          } else {
            toastr.info(
              "APIKEY already exists. Please delete old key and create a new key."
            );
          }
        } else {
          toastr.warning("You are not registed as advertiser");
        }
      })
      .catch((error) => {
        toastr.warning(error.message);
      });
  };

  const handleApikeyCopy = () => {
    var textArea = document.createElement("textarea");
    textArea.value = copytext.current.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    toastr.success("Apikey copied to clipboard");
  };

  const handleDeleteApikey = (userid) => {
    db.collection("advertiser")
      .doc(userid)
      .update({
        api_key: firebase.firestore.FieldValue.delete(),
      })
      .then((res) => {
        toastr.success("Deleted Apikey Successfully.");
        setApikey(null);
      })
      .catch((error) => {
        toastr.warning(error.message);
      });
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const role = JSON.parse(sessionStorage.getItem("role"));
    if (role !== "advertiser") {
      history.push("/");
    } else {
      db.collection("advertiser")
        .doc(user.id)
        .get()
        .then((doc) => {
          const userinfo = doc.data();
          setApikey(userinfo?.api_key ?? "");
        })
        .catch((error) => {
          toastr.warning(error.message);
        });
    }
  });

  return (
    <>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
        {/* <!-- ends: .mainmenu-wrapper --> */}
      </section>

      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select={18} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-shirtsinbulk cu-icon-color"></span>
                        <MultiLang text="api_management" />
                      </h4>
                      <button
                        className="btn btn-xs btn-gradient btn-gradient-two"
                        onClick={createApikey}
                      >
                        <span className="la la-plus"></span>Create APIKey
                      </button>
                    </div>
                  </div>

                  <div className="atbdb_content_module_contents">
                    {apikey !== null && (
                      <>
                        {apikey === "" ? (
                          <p>
                            <MultiLang text="create_api_key" />
                          </p>
                        ) : (
                          <div className="apikey-content">
                            <div className="d-flex align-items-center">
                              <h4>
                                <MultiLang text="apikey" /> :{" "}
                              </h4>
                            </div>
                            <div>
                              <DeleteForeverIcon
                                style={{ fontSize: "2rem" }}
                                className="pointer"
                                onClick={() => handleDeleteApikey(user.id)}
                              />
                            </div>
                            <div className="w-100 p-top-15">
                              <span ref={copytext} className="text-break">
                                {apikey}
                              </span>
                              <FileCopyIcon
                                className="ml-2 pointer"
                                onClick={handleApikeyCopy}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/*<!-- ends: .atbd_author_module -->*/}{" "}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default ApiKeyManagement;
