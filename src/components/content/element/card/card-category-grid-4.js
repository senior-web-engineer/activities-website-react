import React, { Component, Fragment } from "react";
import Img from "react-cool-img";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

import loadinggif from "../../../../assets/img/loading.gif";
import { getCategories } from "../../../../Store/action/categories";

class CategoryCardGrid4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCount: 6,
    };
    this.showMore = this.showMore.bind(this);
  }
  componentDidMount() {
    this.props.getCategories();
  }

  showMore = () => {
    this.setState((state) => ({
      ...state,
      showCount: Number(this.state?.showCount ?? 6) + 6,
    }));
  };

  setCategory = (cateName = "") => {
    this.props.history.push(
      `/all-listings-grid/search/activities?category=${cateName
        .replace(/ /g, "-")
        ?.replace(/&/g, "")}`
    );
  };

  render() {
    const { category, t } = this.props;
    return (
      <Fragment>
        {Object.values(category.categories)
          .slice(0, this.state?.showCount ?? 6)
          .map((value, key) => {
            const { img, category, icon } = value;
            return (
              <div
                onClick={(e) => this.setCategory(category)}
                className="col-lg-4 col-sm-6"
                key={key}
              >
                <div className="category-single category--img pointer">
                  <figure className="category--img4">
                    <Img
                      placeholder={loadinggif}
                      src={img}
                      className="category-img"
                      cache
                      alt=""
                    />
                    <figcaption className="overlay-bg">
                      <div className="d-flex justify-content-center align-items-center flex-column">
                        <div className="icon">
                          <span className={"la " + icon}></span>
                        </div>
                        <h4 className="cat-name">{category}</h4>
                        <p className="badge badge-pill badge-success text-center">
                          {t("show")} {t("listings")}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </div>
                {/*<!-- ends: .category-single -->*/}
              </div>
            );
          })}
        {Boolean(
          this.state?.showCount < Object.values(category.categories)?.length
        ) && (
          <div className="col-lg-12 text-center m-top-55">
            <button
              onClick={this.showMore}
              className="btn btn-gradient btn-gradient-two btn-explore"
            >
              {t("show_more")}
            </button>
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    category: state.category,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: () => dispatch(getCategories()),
  };
};
export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(CategoryCardGrid4);
