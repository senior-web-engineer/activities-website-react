import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import defaultImage from "../../assets/img/Banners/merchantsupportheader.png";
import { Footer } from "../layout/footer";
import Header from "../layout/header";
import SearchIcon from "@material-ui/icons/Search";
import { getMerchantSupport } from "../../Store/action/listing";
import { getBannerImage } from "../../Store/action/categories";
import { useTranslation } from "react-i18next";

function MerchantInfoDetail() {
  const history = useHistory();
  const { t } = useTranslation();
  const logo = useSelector((state) => state.logo);
  const merchantInfo = useSelector((state) => state.list.merchantInfo);
  const [merchantInfoDetail, setMerchantInfoDetail] = useState(null);
  const [load, setLoad] = useState(true);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(null);
  const [trendingData, setTrendingData] = useState(null);
  const [relativeData, setRelativeData] = useState(null);
  const [showRelativeCount, setShowRelativeCount] = useState(5);
  const [showTrendingCount, setShowTrendingCount] = useState(5);
  const heroImage = useSelector((state) => state.category.hero_image);

  useEffect(() => {
    dispatch(getBannerImage("/merchant"));
    dispatch(getMerchantSupport());
    const script = document.createElement("script");
    script.src = "/assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  useEffect(() => {
    setMerchantInfoDetail(history.location.state);
  }, [history]);

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    if (merchantInfo && merchantInfoDetail) {
      setRelativeData(
        merchantInfo.filter((item) => item.type === merchantInfoDetail.type)
      );
      setTrendingData(merchantInfo.slice(0, 5));
    }
  }, [merchantInfo, merchantInfoDetail]);

  useEffect(() => {
    if (merchantInfo && merchantInfo.length > 0) {
      const filterData = merchantInfo.filter((item) => {
        return (
          item.question.toLowerCase().includes(search.toLowerCase()) && item
        );
      });
      setOptions(filterData);
    }
    if (search === "") {
      setOptions(null);
    }
  }, [search, merchantInfo]);

  const initalState = (item) => {
    setSearch("");
    setOptions(null);
    setMerchantInfoDetail(item);
    history.push({
      pathname: `${item.question.replace(/ /g, "-")}`,
      state: item,
    });
    setShowRelativeCount(5);
    setShowTrendingCount(5);
  };

  return (
    <>
      <section className="position-relative overflow-hidden">
        {!load && (
          <img
            className="w-100"
            style={{ objectFit: "cover" }}
            src={heroImage || defaultImage}
            alt=""
            height="480"
          />
        )}
        <div className="homepage-slider-div">
          <div className="mainmenu-wrapper">
            <Header
              logo={logo[0].light}
              class="menu--light"
              history={history}
            />
            <div className="directory_content_area">
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 offset-lg-1 merchant-search-section">
                    <div className="search_title_area mb-3">
                      <div className="d-flex justify-content-center align-items-center p-2">
                        <img
                          src={logo[0].light}
                          alt=""
                          className="merchant-logo"
                        />
                        <h3 className="search-merchant-title">
                          {t("providers")}
                        </h3>
                      </div>
                      <h1 className="merchant-help-comment col-sm-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2">
                        {t("how_can_we_help")}?
                      </h1>
                    </div>
                    <div className="search_form col-sm-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2">
                      <div className="input-group input-group-sm mb-3 position-relative">
                        <input
                          type="text"
                          className="form-control merchant-search-input"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text search-icon"
                            id="inputGroup-sizing-sm"
                          >
                            <SearchIcon className="pointer" size="large" />
                          </span>
                        </div>
                        {options && (
                          <div className="merchant-search-result">
                            <ul>
                              {options.length > 0 ? (
                                options.map((item, key) => {
                                  return (
                                    <li
                                      key={key}
                                      onClick={() => initalState(item)}
                                    >
                                      {item.question}
                                    </li>
                                  );
                                })
                              ) : (
                                <li>
                                  {" "}
                                  {t("no_result_for")} {search}
                                  {t("articles")}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="directory_listiing_detail_area single_area section-bg section-padding-strict short-control">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="atbd_content_module atbd_listing_details cu-radius">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-file-text-o"></span>
                      {merchantInfoDetail?.question ?? ""}
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: merchantInfoDetail?.answer ?? "",
                    }}
                  ></div>
                </div>
                <div className="atbdb_content_module_contents"></div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="widget atbd_widget widget-card cu-radius">
                <div className="atbd_widget_title">
                  <h4>
                    <span className="la la-list-alt"></span>
                    {t("related_articles")}
                  </h4>
                  <NavLink
                    to="#"
                    onClick={() => setShowRelativeCount(relativeData.length)}
                  >
                    {t("view_all")}
                  </NavLink>
                </div>
                <div className="atbd_categorized_listings atbd_popular_listings">
                  {relativeData && (
                    <ul className="listings relative-post">
                      {relativeData.length > 0 ? (
                        relativeData
                          .slice(0, showRelativeCount)
                          .map((item, key) => {
                            return (
                              <li
                                className="pointer"
                                key={key}
                                onClick={() => initalState(item)}
                              >
                                {item.question}
                              </li>
                            );
                          })
                      ) : (
                        <li>{t("there_is_no_data")}</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className="widget atbd_widget widget-card cu-radius">
                <div className="atbd_widget_title">
                  <h4>
                    <span className="la la-list-alt"></span>{" "}
                    {t("trending_articles")}
                  </h4>
                  <NavLink
                    to="#"
                    onClick={() => setShowTrendingCount(trendingData.length)}
                  >
                    {t("view_all")}
                  </NavLink>
                </div>
                <div className="atbd_categorized_listings atbd_popular_listings">
                  {trendingData && (
                    <ul className="listings relative-post">
                      {trendingData.length > 0 ? (
                        trendingData
                          .slice(0, showTrendingCount)
                          .map((item, key) => {
                            return (
                              <li
                                className="pointer"
                                key={key}
                                onClick={() => initalState(item)}
                              >
                                {item.question}
                              </li>
                            );
                          })
                      ) : (
                        <li>{t("there_is_no_data")}</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default MerchantInfoDetail;
