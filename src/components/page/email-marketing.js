import { Collapse, Fab, IconButton } from "@material-ui/core";
import { Add, Check, Delete } from "@material-ui/icons";
import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import toastr from "toastr";
import { getGroups, updateGroup } from "../../Store/action/contactActions";
import { getCampaignHistory } from "../../Store/action/emailCampaignActions";
import { getMyListing } from "../../Store/action/listing";
import AddCampaign from "../content/element/modal/add-campaign";
import AddContact from "../content/element/modal/add-contact";
import AddContactGroup from "../content/element/modal/add-contact-group";
import SideBar from "../page/profile/sidebar-component";

export function ApproveSwitch({
  title = [],
  approved = false,
  onChange = console.log,
  ...props
}) {
  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <span style={{ width: 100 }}>
          {approved ? title?.[0] ?? "Approved" : title?.[1] ?? "Deny"}
        </span>
        <Switch onChange={onChange} checked={approved} width={50} height={24} />
      </label>
    </div>
  );
}

export default function EmailMarketing(props) {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [addModal, setAddModal] = useState(false);
  const [addCampaign, setAddCampaign] = useState(false);
  const [contacts, setContacts] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [openContact, setOpenContact] = useState(true);
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroupKeyList, setSeletedGroupKeyList] = useState([]);
  const myActivities = useSelector((state) => state?.list?.myListing) ?? [];

  const closeModal = () => {
    setAddModal(false);
  };

  const handleAdd = () => {
    if (selectedGroupKeyList.length !== 1) {
      toastr.warning("Select one contact group then try again.");
      return;
    }
    setAddModal(true);
  };

  const closeCampaignModal = () => {
    setAddCampaign(false);
  };

  const handleAddCampaign = () => {
    if (user.holdon_account) {
      toastr.warning(
        "Your account is currently blocked, please contact the Administrator"
      );
      return false;
    }
    if (
      (myActivities ?? []).filter(
        (activity) => String(activity?.status) === "0"
      ).length < 1
    ) {
      toastr.warning("You have no approved activities yet.");
      return false;
    }
    if (Object.keys(contacts ?? {}).length) {
      setAddCampaign(true);
    } else {
      toastr.warning("Select at least one group to send.");
    }
  };

  const handleLoadCSV = (data, file) => {
    if (selectedGroupKeyList?.length === 1) {
      toastr.info("Just seconds.");
      const groupKey = selectedGroupKeyList?.[0];
      let tmpGroups = { ...groups };
      (data ?? []).forEach((row) => {
        tmpGroups[groupKey] = {
          ...(tmpGroups?.[groupKey] ?? {}),
          members: {
            ...(tmpGroups?.[groupKey]?.members ?? {}),
            [String(Math.random()).substr(2)]: {
              name: row?.name ?? "",
              email: row?.email ?? "",
              group: groupKey,
            },
          },
        };
      });
      updateGroup({ id: user?.id ?? "", data: tmpGroups }, (res) => {
        initGroups();
        toastr.success(`Successfully imported(${data?.length ?? 0}).`);
      });
    } else {
      toastr.warning("Select one group to import.");
    }
  };

  const handleDeleteContact = (key) => {
    const groupKey = contacts?.[key]?.group;
    toastr.info("Just seconds");
    let tmpGroups = { ...groups };
    delete tmpGroups?.[groupKey]?.members?.[key];
    updateGroup({ id: user?.id ?? "", data: tmpGroups }, (res) => {
      initGroups();
      toastr.success("Successfully deleted.");
    });
  };

  const toggleOpenContact = () => {
    setOpenContact((s) => !Boolean(s));
  };

  const handleOpenAddGroup = () => {
    setOpenAddGroup(true);
  };

  const handleDeleteGroup = (key) => {
    toastr.info("Just seconds");
    let tmpGroups = { ...groups };
    delete tmpGroups[key];
    updateGroup({ id: user?.id ?? "", data: tmpGroups }, (res) => {
      initGroups();
      toastr.success("Successfully deleted.");
    });
  };

  const handleSelectGroup = (key) => {
    const index = selectedGroupKeyList.findIndex((item) => item === key);
    if (index >= 0) {
      setSeletedGroupKeyList((cs) => [
        ...cs.slice(0, index),
        ...cs.slice(index + 1, cs?.length ?? 0),
      ]);
    } else {
      setSeletedGroupKeyList((cs) => [...cs, key]);
    }
  };

  const initGroups = () => {
    getGroups({ id: user?.id ?? "" }, (res) => {
      setGroups(() => ({ ...res } ?? {}));
      setSeletedGroupKeyList((keys) => {
        return keys.filter((key) => {
          if (res?.[key]) {
            return true;
          } else {
            return false;
          }
        });
      });
    });
  };

  const initContact = () => {
    setContacts(() => {});
    selectedGroupKeyList.forEach((key) => {
      const group = groups?.[key];
      setContacts((cts) => ({ ...cts, ...(group?.members ?? {}) }));
    });
  };

  const initCampaigns = () => {
    getCampaignHistory({ id: user?.id ?? "" }, (res) => {
      setCampaigns(Object.keys(res ?? {}).map((key) => res?.[key] ?? {}));
    });
  };

  useEffect(() => {
    initContact();
    // eslint-disable-next-line
  }, [selectedGroupKeyList]);

  useEffect(() => {
    initGroups();
    initCampaigns();
    dispatch(getMyListing(user.id));
    // eslint-disable-next-line
  }, []);

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
              <SideBar select={21} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="author-info-area section-padding-strict section-bg">
                <div className="atbd_author_module m-0">
                  <div className="email-marketing">
                    <div className="atbd_content_module cu-radius">
                      <div className="atbd_content_module__tittle_area">
                        <div className="atbd_area_title">
                          <h4>
                            <span className="la la-users cu-icon-color"></span>{" "}
                            <MultiLang text="contact_list" />
                            <button
                              className="btn btn-xs btn-gradient btn-gradient-two"
                              style={{ position: "absolute", right: "40px" }}
                              onClick={toggleOpenContact}
                            >
                              {Boolean(openContact) ? "Collapse" : "Expand"}
                            </button>
                          </h4>
                        </div>
                      </div>

                      <div className="email-marketing-body">
                        <Collapse
                          in={Boolean(openContact)}
                          style={{ width: "100%" }}
                        >
                          <div className="email-content">
                            <div className="email-content-header">
                              <h2>
                                <MultiLang text="contact_list" />
                              </h2>
                              <div>
                                <CSVReader
                                  label="Import CSV"
                                  cssClass="btn btn-xs btn-gradient btn-gradient-two"
                                  cssLabelClass="m-0"
                                  parserOptions={{
                                    header: true,
                                    dynamicTyping: true,
                                    skipEmptyLines: true,
                                  }}
                                  onFileLoaded={handleLoadCSV}
                                  inputStyle={{ display: "none" }}
                                />
                                <CSVLink
                                  data={(Object.keys(contacts ?? {}) ?? []).map(
                                    (key) => ({
                                      name: contacts?.[key]?.name ?? "",
                                      email: contacts?.[key]?.email ?? "",
                                    })
                                  )}
                                  filename={`contact_list_${moment().format(
                                    "MMDDYYYYHHmmss"
                                  )}.csv`}
                                >
                                  <button
                                    className="btn btn-xs btn-gradient btn-gradient-two"
                                    style={{ marginRight: 10, marginLeft: 10 }}
                                  >
                                    {" "}
                                    <MultiLang text="export_csv" />
                                  </button>
                                </CSVLink>
                                <button
                                  className="btn btn-xs btn-gradient btn-gradient-two"
                                  style={{ marginRight: 10 }}
                                  onClick={handleAdd}
                                >
                                  {" "}
                                  <MultiLang text="add_contact" />
                                </button>
                                <button
                                  className="btn btn-xs btn-gradient btn-gradient-two"
                                  style={{ marginRight: 10 }}
                                  onClick={handleAddCampaign}
                                >
                                  {" "}
                                  <MultiLang text="current_list" />
                                </button>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <h4 className="label-fab">
                                  {" "}
                                  <MultiLang text="groups" />
                                  <Fab
                                    size="small"
                                    color="primary"
                                    onClick={handleOpenAddGroup}
                                    style={{ color: "#fff", float: "right" }}
                                  >
                                    <Add />
                                  </Fab>
                                  <br />
                                </h4>
                                <div className="widget atbd_widget widget-card cu-radius cu-sidebar">
                                  <div>
                                    {Boolean(Object.keys(groups)?.length) ? (
                                      (Object.keys(groups) ?? []).map(
                                        (key, groupIndex) => {
                                          const group = groups?.[key] ?? {};
                                          return (
                                            <div
                                              key={key ?? groupIndex}
                                              className={
                                                "atbd_widget_title " +
                                                (selectedGroupKeyList.findIndex(
                                                  (item) => item === key
                                                ) >= 0
                                                  ? "cu-side-active"
                                                  : "cu-side")
                                              }
                                              onClick={() => {
                                                handleSelectGroup(key);
                                              }}
                                            >
                                              <h4 className="cu-font-size break-word">
                                                <span className="la la-users cu-icon-color cu-icon"></span>
                                                {selectedGroupKeyList.findIndex(
                                                  (item) => item === key
                                                ) >= 0 ? (
                                                  <Check />
                                                ) : (
                                                  ""
                                                )}{" "}
                                                {group?.name ?? ""}
                                                <IconButton
                                                  onClick={() =>
                                                    handleDeleteGroup(key)
                                                  }
                                                  className="action-tool"
                                                >
                                                  <Delete />
                                                </IconButton>
                                              </h4>
                                            </div>
                                          );
                                        }
                                      )
                                    ) : (
                                      <div>
                                        {" "}
                                        <MultiLang text="no_group" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                <table className="table center table-responsive-md withdraw">
                                  <thead>
                                    <tr>
                                      <th>
                                        <MultiLang text="no" />
                                      </th>
                                      <th>
                                        <MultiLang text="email" />
                                      </th>
                                      <th>
                                        <MultiLang text="name" />
                                      </th>
                                      <th>
                                        <MultiLang text="delete" />
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Boolean(
                                      Object.keys(contacts ?? {})?.length
                                    ) ? (
                                      (Object.keys(contacts ?? {}) ?? []).map(
                                        (key, index) => {
                                          const contact = contacts?.[key] ?? {};
                                          return (
                                            <tr key={contact?.id ?? index}>
                                              <td>{index + 1}</td>
                                              <td>{contact?.email}</td>
                                              <td>{contact?.name}</td>
                                              <td>
                                                <IconButton
                                                  onClick={() =>
                                                    handleDeleteContact(key)
                                                  }
                                                >
                                                  <Delete />
                                                </IconButton>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    ) : (
                                      <tr>
                                        <td colSpan={4}>
                                          {" "}
                                          <MultiLang text="there_is_no_contact" />
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="author-info-area section-padding-strict section-bg">
                <div className="atbd_author_module">
                  <div className="email-marketing">
                    <div className="atbd_content_module cu-radius">
                      <div className="email-marketing-body">
                        <div className="email-content">
                          <div className="email-content-header">
                            <h2>
                              <span className="la la-envelope cu-icon-color"></span>{" "}
                              <MultiLang text="campaign_list" />
                            </h2>
                          </div>
                          <div className="">
                            <table className="table center table-responsive-md withdraw">
                              <thead>
                                <tr>
                                  <th>
                                    <MultiLang text="no" />
                                  </th>
                                  <th>
                                    <MultiLang text="subject" />
                                  </th>
                                  <th>
                                    <MultiLang text="to" />
                                  </th>
                                  <th>
                                    <MultiLang text="reply_to" />
                                  </th>
                                  <th>
                                    <MultiLang text="status" />
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {(campaigns ?? []).map((campaign, index) => {
                                  return (
                                    <tr key={campaign?.id ?? index}>
                                      <td>{index + 1}</td>
                                      <td>{campaign?.subject ?? ""}</td>
                                      <td>
                                        ({campaign?.contacts?.length ?? 0}):
                                        {campaign?.contacts?.map(
                                          (contact) => `${contact?.email}, `
                                        )}
                                      </td>
                                      <td>{campaign?.replyTo ?? ""}</td>
                                      <td>
                                        <MultiLang text="sent" />
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
            </div>
          </div>
        </div>
        <AddContact
          open={addModal}
          closeModal={closeModal}
          onCreate={initGroups}
          selectedGroupKey={selectedGroupKeyList?.[0]}
          groups={groups}
        />
        <AddCampaign
          open={addCampaign}
          closeModal={closeCampaignModal}
          contacts={Object.keys(contacts ?? {}).map((key) => contacts?.[key])}
          onFinish={initCampaigns}
        />
        <AddContactGroup
          open={openAddGroup}
          closeModal={() => setOpenAddGroup(false)}
          onCreate={initGroups}
        />
      </section>
    </>
  );
}
