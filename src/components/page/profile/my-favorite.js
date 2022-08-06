import AccountHeader from "components/content/element/accountHeader";
import { MultiLang } from "components/content/element/widget";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { deleteFavourite, getFavourite } from "../../../Store/action/favourite";
import { Footer } from "../../layout/footer";
import SideBar from "./sidebar-component";

class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone_number: "",
      avater: "",
      listData: [],
    };
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    this.props.getFavourite();
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState((prevState) => ({
      ...prevState,
      listData: nextProps.favouriteList,
    }));
  }
  deleteFav = (id) => {
    const deleteDoc = this.state.listData[id];
    this.state.listData.splice(id, 1);
    this.setState((prevState) => ({
      ...prevState,
      listData: this.state.listData,
    }));
    this.props.deleteFavourite(deleteDoc.docid);
  };
  render() {
    const { listData } = this.state;
    return (
      <Fragment>
        {/* Header section start */}
        <section className="header-breadcrumb bgimage profile-back">
          <AccountHeader />
        </section>
        {/* Header section end */}

        <section className="author-info-area section-padding-strict section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5 m-bottom-30">
                <SideBar select={3} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la la-heart"></span>
                          <MultiLang text="my_favorite" />
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-6 cu-header ">
                            <MultiLang text="activity" />{" "}
                            <MultiLang text="name" />
                          </div>
                          <div className="col-md-2 cu-header ">
                            <MultiLang text="category" />
                          </div>
                          <div className="col-md-2 cu-header ">
                            <MultiLang text="price" /> ($)
                          </div>
                          <div className="col-md-2 cu-header ">
                            <MultiLang text="action" />
                          </div>
                        </div>
                        {listData.length > 0 ? (
                          listData.map((item, key) => {
                            return (
                              <div className="row cu-row" key={key}>
                                <div
                                  className="col-md-6  cu-body"
                                  style={{ color: "#358804" }}
                                >
                                  {item.title}
                                </div>
                                <div className="col-md-2  cu-body">
                                  {item.categoryName}
                                </div>
                                <div className="col-md-2  cu-body">
                                  {item.price}
                                </div>
                                <div
                                  className="col-md-2  cu-body"
                                  onClick={(e) => this.deleteFav(key)}
                                >
                                  <i className="la la-trash la-2x cu-setting-icon"></i>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="com-md-12">
                            <div className="no-list">
                              <label>
                                <MultiLang text="there_is_not_yet" />
                              </label>
                            </div>
                          </div>
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
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    favouriteList: state.favourite.favouriteList,
    logo: state.logo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getFavourite: () => dispatch(getFavourite()),
    deleteFavourite: (id) => dispatch(deleteFavourite(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
