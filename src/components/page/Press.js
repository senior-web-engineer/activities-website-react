import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { SectionTitleImg } from "../content/element/section-title-img";
import contactus from "../../assets/img/contact-us.png";
import { getBannerImage } from "../../Store/action/categories";
import pressImg from "../../assets/img/Banners/press-header.png";
import { getPressList } from "../../Store/action/blogActions";
import { useTranslation } from "react-i18next";

export default function Press() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const logo = useSelector((state) => state.logo);
  const [load, setLoad] = useState(true);
  const pressData = useSelector((state) => state.blog.press_data);
  const heroImage = useSelector((state) => state.category.hero_image);

  const handlePressDetail = (title, id) => {
    history.push({
      pathname: `/press-release/${title.replace(/ /g, "-")}`,
      state: { pressid: id },
    });
  };

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    dispatch(getPressList());
    dispatch(getBannerImage("/press"));
  }, [dispatch]);

  return (
    <>
      <section className="header-breadcrumb bgimage press-session list-overlay">
        {!load && (
          <div
            className="bg_image_holder"
            style={{
              backgroundImage: `url(${heroImage || pressImg})`,
              opacity: "1",
            }}
          ></div>
        )}
        <div className="mainmenu-wrapper">
          <Header logo={logo[0].light} class="menu--light" history={history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <div className="breadcrumb-wrapper content_above text-center">
          <h2 className="page-title press-title">{t("press_info")}</h2>
        </div>
      </section>
      <section className="cta section-padding border-bottom">
        <div className="container">
          <div className="row">
            <div className="clo-lg-12">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-6">
                  <img src={contactus} alt="" className="banner-image" />
                </div>
                <div className="col-lg-5 offset-lg-1 col-md-6 mt-5 mt-md-0 text-center">
                  <p style={{ fontSize: "20px", lineHeight: "2rem" }}>
                    {t("press_desc")}{" "}
                    <a
                      href="mailto:press@activities.app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      press@activities.app
                    </a>
                    .
                  </p>
                  <a
                    className="mt-4 btn btn-primary"
                    href="mailto:press@activities.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    press@activities.app
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-area blog-grid section-padding-strict section-bg">
        <div className="container">
          <SectionTitleImg title="Press Releases" />
          <div className="row press-news-content">
            <div className="col-lg-10 col-md-10 col-lg-offset-1 col-md-offset-1">
              {pressData && (
                <ul>
                  {pressData.length > 0 ? (
                    pressData.slice(0, 5).map((item, key) => {
                      return (
                        <li
                          key={key}
                          onClick={() => handlePressDetail(item.title, item.id)}
                        >
                          {item.title}
                        </li>
                      );
                    })
                  ) : (
                    <p>{t("coming_soon")}</p>
                  )}
                </ul>
              )}
            </div>
            {/* {this.props.blog && this.props.blog.length > 0 && ( */}
            <div className="col-lg-12 text-center">
              <NavLink
                to="/press-all"
                className="btn btn-gradient btn-gradient-two btn-explore"
              >
                {t("explore_all")}
              </NavLink>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
