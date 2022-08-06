import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import moment from "moment";
import React, { Component, Fragment } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { getTotalBookingPay } from "../../../Store/action/bankAction";
import { getBookingLists } from "../../../Store/action/widget";
import AddBankInfo from "../../content/element/modal/addBankInfo";
import QuickWithdraw from "../../content/element/modal/quickWithdraw";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

export class Withdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone_number: "",
      avater: "",
      total: 0,
      transactionLogs: [],
      withdrawLogs: [],
      amount: "",
      load: true,
    };
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.props.getBookingLists(user.id);
    this.props.getTotalBookingPay();
    this.setState((prevState) => ({
      ...prevState,
      email: user.email,
      name: user.name,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      total: nextProps.total,
      transactionLogs: nextProps.myBookingLists.transactionLogs,
      withdrawLogs: nextProps.myBookingLists.withdrawLogs,
      load: false,
    });
  }
  render() {
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
          {/* <!-- ends: .mainmenu-wrapper --> */}
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          {this.state.load && (
            <div className="custom-loader">
              <Loader type="Oval" color="#afdb30" height={100} width={100} />
            </div>
          )}
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={8} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30 withdraw-panel">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-balance-scale"></span>{" "}
                          <MultiLang text="balance_withraw" />
                        </h4>
                        <AddBankInfo />
                        <div>
                          <font
                            className="cu-icon-color"
                            style={{ fontSize: "18px" }}
                          >
                            <MultiLang text="avalable_balance" />
                          </font>
                          <font style={{ fontSize: "24px" }}>
                            $ {this.state.total}
                          </font>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-8 cu-input-padding">
                      <h5 className="cu-widthdraw-title">
                        <MultiLang text="quick_withdraw" />
                      </h5>
                      <QuickWithdraw />
                    </div>
                    <div className="dashboard-nav">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="dashboard-nav-area">
                              <ul
                                className="nav"
                                id="dashboard-tabs"
                                role="tablist"
                              >
                                <li className="nav-item">
                                  <a
                                    className="nav-link active"
                                    id="transaction-logs"
                                    data-toggle="tab"
                                    href="#transaction"
                                    role="tab"
                                    aria-controls="transaction"
                                    aria-selected="true"
                                  >
                                    {" "}
                                    <MultiLang text="transaction_logs" />
                                  </a>
                                </li>
                                <li className="nav-item">
                                  <a
                                    className="nav-link"
                                    id="withdraw-logs"
                                    data-toggle="tab"
                                    href="#withdraw"
                                    role="tab"
                                    aria-controls="withdraw"
                                    aria-selected="false"
                                  >
                                    {" "}
                                    <MultiLang text="withdraw_logs" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/*<!-- ends: .col-lg-12 -->*/}
                        </div>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents tab-content">
                      <div
                        className="row tab-pane fade show active"
                        id="transaction"
                        role="tabpanel"
                        aria-labelledby="transaction-logs"
                      >
                        <div className="col-md-12 col-sm-12 scroller">
                          <table className="table center table-responsive-md withdraw">
                            <thead>
                              <tr>
                                <th>
                                  <MultiLang text="purhcass_date" />
                                </th>
                                <th>
                                  <MultiLang text="status" />
                                </th>
                                <th>
                                  <MultiLang text="value" />
                                </th>
                                <th>
                                  <MultiLang text="fee" />
                                </th>
                                <th>
                                  <MultiLang text="your_money" />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.transactionLogs &&
                                this.state.transactionLogs.length > 0 &&
                                this.state.transactionLogs.map((item, key) => {
                                  return (
                                    <tr key={key}>
                                      <td>
                                        {item.userName}
                                        <br />
                                        {item.date}
                                      </td>
                                      <td>
                                        <button className="btn paid-button">
                                          {item.transactionStatus}
                                        </button>
                                      </td>
                                      <td>$ {item.amount}</td>
                                      <td>{item.fee}%</td>
                                      <td>
                                        $ {item.amount * (1 - item.fee / 100)}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div
                        className="row tab-pane fade"
                        id="withdraw"
                        role="tabpanel"
                        aria-labelledby="withdraw-logs"
                      >
                        <div className="col-md-12 col-sm-12 scroller">
                          <table className="table center table-responsive-md withdraw">
                            <thead>
                              <tr>
                                <th>
                                  <MultiLang text="purhcass_date" />
                                </th>
                                <th>
                                  <MultiLang text="status" />
                                </th>
                                <th>
                                  <MultiLang text="amount" />
                                </th>
                                <th>
                                  <MultiLang text="value" />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.withdrawLogs &&
                                this.state.withdrawLogs.length > 0 &&
                                this.state.withdrawLogs.map((item, key) => {
                                  return (
                                    <tr key={key}>
                                      <td>
                                        {typeof item.date !== "string"
                                          ? moment
                                              .unix(item.date.seconds)
                                              .format("MM/DD/YYYY")
                                          : item.date}
                                      </td>
                                      <td>
                                        <button className="btn withdrawal-button">
                                          <MultiLang text="" />{" "}
                                          {item.account_number}
                                        </button>
                                      </td>
                                      <td>$ {item.amount}</td>
                                      <td>
                                        {item.status === "1" ? (
                                          <div>
                                            <span
                                              className="badge badge-danger pointer"
                                              data-tip
                                              data-for="pending"
                                            >
                                              <MultiLang text="pending" />
                                            </span>
                                            <ReactTooltip
                                              id="pending"
                                              aria-haspopup="true"
                                              backgroundColor="#825f65"
                                            >
                                              <p>
                                                <MultiLang text="pending_desc" />
                                              </p>
                                            </ReactTooltip>
                                          </div>
                                        ) : item.status === "2" ? (
                                          <div>
                                            <span
                                              className="badge badge-warning"
                                              data-tip
                                              data-for="refused"
                                            >
                                              {" "}
                                              <MultiLang text="refused" />
                                            </span>
                                            <ReactTooltip
                                              id="refused"
                                              aria-haspopup="true"
                                              backgroundColor="#fa8b0c"
                                            >
                                              <p>
                                                <MultiLang text="refused_desc" />
                                              </p>
                                            </ReactTooltip>
                                          </div>
                                        ) : item.status === "3" ? (
                                          <div>
                                            <span
                                              className="badge badge-info"
                                              data-tip
                                              data-for="wire"
                                            >
                                              <MultiLang text="in_progress" />
                                            </span>
                                            <ReactTooltip
                                              id="wire"
                                              aria-haspopup="true"
                                              backgroundColor="#3a7dfd"
                                            >
                                              <p>
                                                <MultiLang text="progress_desc" />
                                              </p>
                                            </ReactTooltip>
                                          </div>
                                        ) : (
                                          <div>
                                            <span
                                              className="badge badge-success"
                                              data-tip
                                              data-for="success"
                                            >
                                              <MultiLang text="paid" />
                                            </span>
                                            <ReactTooltip
                                              id="success"
                                              aria-haspopup="true"
                                              backgroundColor="#afdb30"
                                            >
                                              <p>
                                                <MultiLang text="paid_desc" />
                                              </p>
                                            </ReactTooltip>
                                          </div>
                                        )}
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
        </section>
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    logo: state.logo,
    myBookingLists: state.widget.myBooking_lists,
    total: state.bank.total,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getBookingLists: (id) => dispatch(getBookingLists(id)),
    getTotalBookingPay: () => dispatch(getTotalBookingPay()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
