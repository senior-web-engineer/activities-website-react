import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { SectionTitle } from "../content/element/section-title";
import { Accordion2 } from "../content/element/accordion";
import { getBannerImage } from "../../Store/action/categories";
import back from "../../assets/img/Banners/FAQ-header.png";
import { getFaq } from "../../Store/action/basicAction";
import { useTranslation } from "react-i18next";

export default function Faqs() {
  const dispatch = useDispatch();
  const history = useHistory();
  const logo = useSelector((state) => state.logo);
  const [load, setLoad] = useState(true);
  const faqData = useSelector((state) => state.basic.faq);
  const heroImage = useSelector((state) => state.category.hero_image);
  const { t } = useTranslation();

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    dispatch(getFaq());
    dispatch(getBannerImage("/faq"));
  }, [dispatch]);

  return (
    <Fragment>
      {/* Header section start */}
      <section className="header-breadcrumb bgimage">
        {!load && (
          <div
            className="bg_image_holder"
            style={{
              backgroundImage: `url(${heroImage || back})`,
              opacity: "1",
            }}
          ></div>
        )}
        <div className="mainmenu-wrapper">
          <Header logo={logo[0].light} class="menu--light" history={history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={t("faq")} />
      </section>
      {/* Header section end */}

      <section className="faq-wrapper section-padding border-bottom">
        <div className="container">
          <SectionTitle
            title={t("your_questions")}
            content={t("find_answer")}
          />

          <div className="row">
            <div className="col-lg-12">
              <div className="faq-contents">
                <div
                  className="atbd_content_module atbd_faqs_module"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-question-circle"></span>
                        {t("listing_faqs")}
                      </h4>
                    </div>
                  </div>
                  <Accordion2 faqData={faqData} />
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
