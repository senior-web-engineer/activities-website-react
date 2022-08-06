import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import image from "../../assets/img/Banners/privacy-header.png";
import { getPrivacy } from "../../Store/action/basicAction";
import { getBannerImage } from "../../Store/action/categories";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const logo = useSelector((state) => state.logo);
  const [load, setLoad] = useState(true);
  const privacy = useSelector((state) => state.basic.privacy);
  const heroImage = useSelector((state) => state.category.hero_image);

  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    dispatch(getPrivacy());
    dispatch(getBannerImage("/privacy"));
  }, [dispatch]);

  return (
    <Fragment>
      {/* Header section start */}
      <section className="header-breadcrumb bgimage">
        {!load && (
          <div
            className="bg_image_holder"
            style={{
              backgroundImage: `url(${heroImage || image})`,
              opacity: "1",
            }}
          ></div>
        )}
        <div className="mainmenu-wrapper">
          <Header logo={logo[0].light} class="menu--light" history={history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={t("privacy_policy")} />
      </section>
      {/* Header section end */}
      <section className="payment_receipt section-bg section-padding-strict">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="payment_receipt--wrapper content-radius">
                <div className="payment_receipt--contents">
                  <h2 className="atbd_thank_you">{t("privacy_policy")}</h2>
                  <div className="atbd_payment_instructions">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: privacy?.content ?? "",
                      }}
                    ></div>
                  </div>
                </div>
                {/*<!-- ends: .payment_receipt--contents -->*/}
              </div>
              {/*<!-- ends: .payment_receipt--wrapper -->*/}
            </div>
            {/*<!-- ends: .col-lg-10 -->*/}
          </div>
        </div>
      </section>
      {/*<!-- ends: .atbd_payment_recipt -->*/}

      <Footer />
    </Fragment>
  );
}
