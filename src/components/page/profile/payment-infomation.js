import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import FontAwesome from "react-fontawesome";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import {
  deletePaymentMethod,
  getPaymentInfo,
} from "../../../Store/action/widget";
import AddCard from "../../content/element/modal/add-card";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";
class PaymentSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone_number: "",
      avater: "",
      isDialogOpen: true,
      current_card_data: [],
      cardInfo: [],
    };
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      current_card_data: nextProps.paymentData,
      cardInfo: nextProps.paymentData,
    });
  }
  UNSAFE_componentWillMount() {
    this.props.getPaymentInfo();
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }
  cardDelete = (key) => {
    let data = this.state.cardInfo;
    this.props.deletePaymentMethod(data[key].id);
    data.splice(key, 1);
    this.setState({ current_card_data: data });
  };
  render() {
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={4} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-credit-card"></span>
                          <MultiLang text="payment_info" />
                        </h4>
                        <button
                          type="button"
                          className="btn btn-outline-success cu-radius add-card-btn"
                        >
                          <FontAwesome name="credit-card" />
                          <MultiLang text="add_card" />
                        </button>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      <form className="needs-validation">
                        <div className="form-row">
                          <div
                            className="container"
                            style={{ paddingBottom: "9px" }}
                          >
                            <div className="card-lists cu-payment-title">
                              <div></div>
                              <div>
                                <label>
                                  <MultiLang text="card_num" />
                                </label>
                              </div>
                              <div>
                                <label>
                                  <MultiLang text="action" />
                                </label>
                              </div>
                            </div>
                            <div className="custom-loader">
                              <Loader
                                type="Oval"
                                color="#afdb30"
                                height={70}
                                width={70}
                                timeout={1000}
                              />
                            </div>
                            {this.state.current_card_data.length > 0 ? (
                              this.state.current_card_data.map((item, key) => {
                                return (
                                  <div className="card-lists" key={key}>
                                    <div className="pt-25">
                                      <img
                                        className="card-brand"
                                        src={require(`../../../assets/img/card-brand/${item.card.brand}.png`)}
                                        alt=""
                                      />
                                    </div>
                                    <div className="pt-20">
                                      <h5 className="card-number">
                                        {"xxxx - xxxx - xxxx - " +
                                          item.card.last4}
                                      </h5>
                                    </div>
                                    <div
                                      className="pt-30"
                                      style={{ textAlignLast: "center" }}
                                    >
                                      <div
                                        onClick={(e) => this.cardDelete(key)}
                                      >
                                        <i className="la la-trash la-2x cu-setting-icon"></i>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="no-list">
                                <label>
                                  <MultiLang text="there_is_not_yet" />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AddCard history={this.props.history} />
        <Footer />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    paymentData: state.widget.payment_data,
    login: state.login,
    logo: state.logo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaymentInfo: () => dispatch(getPaymentInfo()),
    deletePaymentMethod: (id) => dispatch(deletePaymentMethod(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentSetting);
