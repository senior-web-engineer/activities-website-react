import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import image from "../../assets/img/Banners/terms-conditions-header.png";
import { getUserTerms } from "../../Store/action/basicAction";
import { getBannerImage } from "../../Store/action/categories";
import { useTranslation } from "react-i18next";

export default function TermsConditions() {
  const dispatch = useDispatch();
  const history = useHistory();
  const logo = useSelector((state) => state.logo);
  const [load, setLoad] = useState(true);
  const userTerms = useSelector((state) => state.basic.user_terms);
  const heroImage = useSelector((state) => state.category.hero_image);
  const { t } = useTranslation();
  useEffect(() => {
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    dispatch(getUserTerms());
    dispatch(getBannerImage("/terms-conditions"));
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
        <BreadcrumbWraper title={t("terms_conditions")} />
      </section>
      {/* Header section end */}
      <section className="payment_receipt section-bg section-padding-strict">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="payment_receipt--wrapper content-radius">
                <div className="payment_receipt--contents">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: userTerms?.user_terms_conditions ?? "",
                    }}
                  ></div>
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
