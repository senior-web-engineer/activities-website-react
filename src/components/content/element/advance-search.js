import React, { Component, Fragment } from "react";
import Select from "react-dropdown-select";
import { compose } from "redux";
import { connect } from "react-redux";
import toastr from "toastr";
import appleButton from "../../../assets/img/app-store-badge-en-us.svg";
import googleButton from "../../../assets/img/google-play-badge-en-us.svg";
import { getCategories } from "../../../Store/action/categories";
import { withTranslation } from "react-i18next";

let listing_data;
const initialState = {
  category_list: [],
  title: "",
  category: "all",
  location: "",
};
class AdvSearch extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.autocomplete = null;
  }
  componentDidMount() {
    this.props.getCategories();
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      { types: ["(regions)"] }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    listing_data = [];
    nextProps.categories.categories.map((item) => {
      const element = {
        value: item.category,
        label: item.category,
      };
      return (listing_data = [...listing_data, element]);
    });
    this.setState((prevState) => ({
      ...prevState,
      category_list: listing_data,
    }));
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;
    if (!addressObject.address_components) {
      toastr.info("Select location correctly!");
      return false;
    }
    this.setState({
      location: address[0].long_name,
    });
  }
  searchData = () => {
    let filter_data = this.state;
    delete filter_data.category_list;
    let filterOptions = "";
    Object.keys(filter_data ?? {}).forEach((key) => {
      if (Boolean(filter_data[key])) {
        filterOptions += `${key}=${filter_data[key]
          ?.replace(/ /g, "-")
          .replace(/&/g, "")}&`;
      }
      return filterOptions;
    });
    filterOptions = filterOptions?.slice(0, filterOptions?.length - 1);
    // sessionStorage.setItem("searchData", JSON.stringify(filter_data));
    this.props.history.push({
      pathname: `/all-listings-grid/search/activities`,
      search: `${filterOptions}`,
      // params: { searchData: filter_data },
    });
  };
  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <div className="directory_content_area">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className="search_title_area">
                  <h1 className="title">
                    {t("ad_search_title_h1")}
                    <span className="title-image"></span>
                  </h1>
                  <p className="sub_title">{t("ad_search_sub_title")}</p>
                </div>
                {/* ends: .search_title_area */}
                <div className="search_form">
                  <div className="atbd_seach_fields_wrapper">
                    <div className="single_search_field search_query">
                      <input
                        className="form-control search_fields"
                        style={{ borderRadius: "5px" }}
                        value={this.state.title}
                        type="text"
                        placeholder={t("what_are_you_looking_for.placeholder")}
                        onChange={(e) =>
                          this.setState({ title: e.target.value })
                        }
                      />
                    </div>
                    <div className="single_search_field custom-selectgroup">
                      <Select
                        searchable={false}
                        placeholder={t("select_a_cateogry_list")}
                        options={this.state.category_list}
                        onChange={(values) =>
                          this.setState({ category: values[0].value })
                        }
                      />
                    </div>
                    <div className="single_search_field search_query">
                      <input
                        id="autocomplete"
                        className="search_fields"
                        value={this.state.location}
                        onChange={(e) =>
                          this.setState({ location: e.target.value })
                        }
                        type="text"
                        placeholder={t("please_wirte_city_or_zip_code")}
                      />
                    </div>
                    <div className="atbd_submit_btn">
                      <button
                        className="btn btn-block btn-gradient btn-gradient-one btn-md btn_search"
                        onClick={this.searchData}
                      >
                        {t("search")}
                      </button>
                    </div>
                  </div>
                  <div className="apple-google-bnt d-flex justify-content-center align-itmes-center">
                    <div className="apple-bnt pr-4">
                      <a
                        href="https://apps.apple.com/app/id1501612336#?platform=iphone"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={appleButton} width="150" alt="" />
                      </a>
                    </div>
                    <div className="apple-bnt">
                      <a
                        href="https://play.google.com/store/apps/details?id=app.activities.activities "
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={googleButton} width="145" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
                {/* ends: .search_div */}
              </div>
              {/* ends: .col-lg-10 */}
            </div>
          </div>
        </div>
        {/* ends: .directory_search_area */}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    categories: state.category,
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
)(AdvSearch);
