/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { getCategories } from "../../Store/action/categories";
import { Category } from "../content/element/widget";
import { getBannerImage } from "../../Store/action/categories";
import { getPressList } from "../../Store/action/blogActions";
import pressImg from "../../assets/img/Banners/press-header.png";
import { useTranslation } from "react-i18next";

export default function PressDetail(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoad] = useState(true);
  const logo = useSelector((state) => state.logo);
  const categoryList = useSelector((state) => state.category.categories);
  const [pressDetail, setPressDetail] = useState(null);
  const pressDataList = useSelector((state) => state.blog.press_data);
  const heroImage = useSelector((state) => state.category.hero_image);
  const { t } = useTranslation();

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    if (categoryList.length === 0) {
      dispatch(getCategories());
    }
    dispatch(getBannerImage("/press"));
    dispatch(getPressList());
  }, [dispatch, categoryList.length]);

  useEffect(() => {
    const id = props?.location?.state?.pressid ?? "";
    if (pressDataList) {
      const pressData = pressDataList.filter((item) => item.id === id);
      setPressDetail(pressData[0]);
    }
  }, [props, pressDataList]);

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
          <h1 className="page-title press-title">{t("press_release")}</h1>
        </div>
      </section>
      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="atbd_content_module atbd_listing_details cu-radius">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-file-text-o"></span>
                      {pressDetail?.title ?? ""}
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: pressDetail?.content ?? "",
                    }}
                  ></div>
                </div>
                <div className="atbdb_content_module_contents"></div>
              </div>
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <div className="sidebar">
                <Category
                  list={categoryList}
                  onViewAll={() => history.push("/press-all")}
                  filterCategory={(id) => {
                    history.push({
                      pathname: "/press-all",
                      state: {
                        categroy_id: id,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
