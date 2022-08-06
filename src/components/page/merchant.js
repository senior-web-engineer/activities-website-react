import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import defaultImage from "../../assets/img/Banners/merchantsupportheader.png";
import { Footer } from "../layout/footer";
import Header from "../layout/header";
import { getBannerImage } from "../../Store/action/categories";
import { getMerchantSupport } from "../../Store/action/listing";
import { useTranslation } from "react-i18next";
// import merchantheader from '../../assets/img/merchant-support-header.png'

function MerchantInfo() {
  const history = useHistory();
  const { t } = useTranslation();
  const merchantInfo = useSelector((state) => state.list.merchantInfo);
  const [partnerData, setPartnerData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [support, setSupportData] = useState(null);
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(true);
  const [options, setOptions] = useState(null);
  const logo = useSelector((state) => state.logo);
  const dispatch = useDispatch();
  const heroImage = useSelector((state) => state.category.hero_image);

  useEffect(() => {
    dispatch(getMerchantSupport());
    dispatch(getBannerImage("/merchant"));
  }, [dispatch]);

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    if (merchantInfo) {
      setPartnerData(merchantInfo.filter((item) => item.type === "partnering"));
      setServiceData(merchantInfo.filter((item) => item.type === "service"));
      setSupportData(merchantInfo.filter((item) => item.type === "support"));
    }
  }, [merchantInfo]);

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
                                      onClick={() =>
                                        history.push({
                                          pathname: `merchant-support-detail/${item.question.replace(
                                            / /g,
                                            "-"
                                          )}`,
                                          state: item,
                                        })
                                      }
                                    >
                                      {item.question}
                                    </li>
                                  );
                                })
                              ) : (
                                <li>
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
          <div className="atbd_content_module atbd_review_form cu-radius mb-4 mt-4">
            <div className="atbdb_content_module_contents atbd_give_review_area">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="support-section">
                    <div className="support-section-title">
                      <h3>{t("partnering_with_activities_app")}</h3>
                    </div>
                    <div className="support-section-content">
                      {partnerData && (
                        <ul>
                          {partnerData.length > 0 ? (
                            partnerData.map((item, key) => {
                              return (
                                <li
                                  key={key}
                                  onClick={() => {
                                    history.push({
                                      pathname: `merchant-support-detail/${item.question.replace(
                                        / /g,
                                        "-"
                                      )}`,
                                      state: item,
                                    });
                                  }}
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
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="support-section">
                    <div className="support-section-title">
                      <h3>{t("adding_updateing_services")}</h3>
                    </div>
                    <div className="support-section-content">
                      {serviceData && (
                        <ul>
                          {serviceData.length > 0 ? (
                            serviceData.map((item, key) => {
                              return (
                                <li
                                  key={key}
                                  onClick={() => {
                                    history.push({
                                      pathname: `merchant-support-detail/${item.question.replace(
                                        / /g,
                                        "-"
                                      )}`,
                                      state: item,
                                    });
                                  }}
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
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="support-section">
                    <div className="support-section-title">
                      <h3>{t("provider_support")}</h3>
                    </div>
                    <div className="support-section-content">
                      {support && (
                        <ul>
                          {support.length > 0 ? (
                            support.map((item, key) => {
                              return (
                                <li
                                  key={key}
                                  onClick={() => {
                                    history.push({
                                      pathname: `merchant-support-detail/${item.question.replace(
                                        / /g,
                                        "-"
                                      )}`,
                                      state: item,
                                    });
                                  }}
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
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default MerchantInfo;