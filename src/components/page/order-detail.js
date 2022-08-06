import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setPageLoading } from "Store/action/appAction";
import defaultImage from "../../assets/img/default-img.svg";
import * as Actions from "../../Store/action/widget";
import { Footer } from "../layout/footer";
import SideBar from "./profile/sidebar-component";

function OrderDetail(props) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { t } = useTranslation();
  const orderList = useSelector((state) => state.widget.orderList);
  const currency = useSelector((state) => state.app.currency);
  const activityData = useSelector((state) => state.widget.activityData);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const isLoading = useSelector((state) => state.app?.isPageLoading || false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    setPageLoading(dispatch, true);
    return () => {
      document.body.removeChild(script);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(Actions.getBookingOrderList(id, currency?.value || "USD"));
    //eslint-disable-next-line
  }, [id, currency]);

  useEffect(() => {
    if (orderList.length > 0) {
      let paid = 0,
        netAmout = 0;
      orderList.forEach((item) => {
        paid += item.displayPrice;
        netAmout += item.displayNetPrice;
      });
      setTotalNetAmount(netAmout.toFixed(2));
      setTotalPaid(paid.toFixed(2));
    } else {
      setTotalNetAmount(0);
      setTotalPaid(0);
    }
  }, [orderList]);

  return (
    <Fragment>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
      </section>
      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select="" />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-user"></span>
                        <MultiLang text="my_order_lists" />
                      </h4>
                      <h4>
                        <label className="total-booking-count">
                          <MultiLang text="total" />{" "}
                          <MultiLang text="Bookings" /> :
                        </label>
                        {orderList.length}
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    {isLoading ? (
                      <div className="custom-loader">
                        <Loader
                          type="Oval"
                          color="#afdb30"
                          height={70}
                          width={70}
                          timeout={3000}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="ordered-img">
                              <img
                                src={
                                  Object.entries(activityData).length > 0 &&
                                  activityData.picture.length > 0
                                    ? activityData.picture[0]
                                    : defaultImage
                                }
                                alt=""
                              />
                              <div className="text-center">
                                <h3 className="m-top-5">
                                  {activityData.title}
                                </h3>
                                <label>{activityData.category_name}</label>
                              </div>
                            </div>
                          </div>
                          {orderList.length > 0 ? (
                            <div className="col-md-8 mb-10">
                              <div className="grid-2 total-payment-body">
                                <div className="total-payment">
                                  <h5>{t("total_paid_amount")}</h5>
                                  <h2>
                                    {currency.currency} {totalPaid}
                                  </h2>
                                  <label>{t("without_charing_fee")}</label>
                                </div>
                                <div className="total-payment">
                                  <h5>{t("total_net_amount")}</h5>
                                  <h2>
                                    {currency.currency} {totalNetAmount}
                                  </h2>
                                  <label>{t("avalable_for_withdrawing")}</label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-md-8">
                              <h4>{t("there_is_no_reservation")}</h4>
                            </div>
                          )}
                        </div>
                        {orderList.length > 0 && (
                          <div className="row scroller">
                            {orderList.map((item, key) => {
                              return (
                                <div
                                  className="col-md-12 grid-2 oderd-card"
                                  key={key}
                                >
                                  <div className="align-left">
                                    <h5>{item.userName}</h5>
                                    <p>{item.date}</p>
                                    <p>id: {item.bookingId}</p>
                                    <p>{item.option1}</p>
                                    <p>{item.option2}</p>
                                  </div>
                                  <div className="align-right">
                                    <p>
                                      {t("amount_paid")}: {currency.currency}{" "}
                                      {item.displayPrice}
                                    </p>
                                    <p>
                                      {t("fee")}: -{item.fee}%
                                    </p>
                                    <p>
                                      <span>{t("net_amount")}: </span>
                                      {currency.currency}{" "}
                                      {item.displayNetPrice.toFixed(2)}
                                    </p>
                                    <p>{item.answer1 || t("no_answer")}</p>
                                    <p>{item.answer2 || t("no_answer")}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
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
export default OrderDetail;
