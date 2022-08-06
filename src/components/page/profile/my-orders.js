import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Fragment, useEffect, useState } from "react";
import FontAwesome from "react-fontawesome";
import Pagination from "react-js-pagination";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch, useSelector } from "react-redux";
import { setPageLoading } from "Store/action/appAction";
import defaultImage from "../../../assets/img/detail-back.jpg";
import { getOrderList } from "../../../Store/action/widget";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

export default function MyOrders() {
  const list = useSelector((state) => state.widget.userOrderList);
  const currency = useSelector((state) => state.app.currency);
  const isLoading = useSelector((state) => state.app?.isPageLoading || false);
  const totalPage = useSelector((state) => state.widget.userOrderList).length;

  const [activePage, setActivePage] = useState(1);
  const [startNum, setStartNum] = useState(0);
  const [arrayData, setArrayData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    setPageLoading(dispatch, true);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(getOrderList(currency.value || "USD"));
    //eslint-disable-next-line
  }, [currency]);

  useEffect(() => {
    setArrayData(list);
  }, [list]);

  const handlePageChange = (e) => {
    setActivePage(e);
    setStartNum(e - 1);
    setArrayData(list);
  };
  return (
    <Fragment>
      <section className="header-breadcrumb bgimage profile-back">
        <AccountHeader />
      </section>
      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5 m-bottom-30">
              <SideBar select={16} />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module cu-radius">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-list cu-icon-color"></span>
                        <MultiLang text="my_order_lists" />
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
                    ) : list.length > 0 ? (
                      arrayData
                        .slice(startNum * 4, startNum * 4 + 4)
                        .map((item, key) => {
                          return (
                            <div className="item-card" key={startNum * 4 + key}>
                              <div className="p-2 order-image">
                                <img
                                  src={
                                    item.img === "" ? defaultImage : item.img
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="p-2 order-content">
                                <p className="m-0">
                                  <b>
                                    <MultiLang text="title" />:{" "}
                                  </b>
                                  {item.campTitle}
                                </p>
                                <p className="m-0">
                                  <b>
                                    <MultiLang text="session" />:{" "}
                                  </b>{" "}
                                  {item.session.startDate}{" "}
                                  {item.session.startTime} ~{" "}
                                  {item.session.endDate} {item.session.endTime}
                                </p>
                                {item.video !== "" && (
                                  <p className="font-style p-0">
                                    <span>
                                      <b>
                                        <MultiLang text="video" />:{" "}
                                      </b>
                                    </span>{" "}
                                    <a
                                      href={"https://" + item.video}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.video}
                                    </a>
                                  </p>
                                )}
                                <p className="m-0">
                                  <span>
                                    <b>
                                      <MultiLang text="orders" />:{" "}
                                    </b>
                                  </span>{" "}
                                  {item.transData.id}
                                </p>
                                <p className="m-0">
                                  <span>
                                    <b>
                                      <MultiLang text="attendee" />:{" "}
                                    </b>
                                  </span>
                                  {item.attendee}
                                </p>
                                <div className="mb-0 d-flex justify-content-between">
                                  <span>
                                    <b>
                                      <MultiLang text="date" />:
                                    </b>{" "}
                                    {item.date}
                                  </span>
                                  <div className="order-card-bottom">
                                    <img
                                      src={require(`assets/img/card-brand/${
                                        item?.transData?.charges?.data[0]
                                          ?.payment_method_details?.card
                                          ?.brand ?? "visa"
                                      }.png`)}
                                      className="visa-card mr-2"
                                      alt=""
                                    />
                                    <h2 className="px-2">
                                      {currency.currency} {item.displayPrice}
                                    </h2>
                                    <a
                                      href={
                                        item?.transData?.charges?.data[0]
                                          ?.receipt_url ?? ""
                                      }
                                      target="_blank"
                                      className="px-2 stripe-link"
                                      rel="noopener noreferrer"
                                    >
                                      <FontAwesome name="bars" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <p>
                        <MultiLang text="there_is_not_yet" />.
                      </p>
                    )}
                    {list.length > 0 && (
                      <div className="p-left-15">
                        <Pagination
                          prevPageText="Prev"
                          nextPageText="Next"
                          firstPageText="First"
                          lastPageText="Last"
                          activePage={activePage}
                          itemsCountPerPage={4}
                          totalItemsCount={totalPage}
                          pageRangeDisplayed={3}
                          itemClass="page-item"
                          linkClass="page-link"
                          onChange={(e) => handlePageChange(e)}
                        />
                      </div>
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
    </Fragment>
  );
}
