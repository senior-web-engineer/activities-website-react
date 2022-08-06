import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { connect } from "react-redux";
import BlogSingle from "../content/element/card/card-blog-single-grid";
import { Category, PopularPost, RecentPost } from "../content/element/widget";
import { getCategories } from "../../Store/action/categories";
import { getBlogList } from "../../Store/action/blogActions";
import { getBannerImage } from "../../Store/action/categories";
import $ from "jquery";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import blogImage from "../../assets/img/blog.jpg";
import { useTranslation } from "react-i18next";

const AllBlogGrid = (props) => {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(true);
  const history = useHistory();
  const categoryList = useSelector((state) => state.category.categories);
  const blogList = useSelector((state) => state.blog.blog_list);
  const heroImage = useSelector((state) => state.category.hero_image);
  const [filterBlog, setFilterBlog] = useState([]);
  const [loader, setLoader] = useState(true);
  const light = props.logo[0].light;
  const { t } = useTranslation();

  useEffect(() => {
    $(".bg_image_holder").each(function () {
      var imgLink = $(this).children().attr("src");
      $(this)
        .css({
          "background-image": "url('" + imgLink + "')",
          opacity: "1",
        })
        .children();
    });
    setLoad(false);
  }, [heroImage]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBlogList());
    dispatch(getBannerImage("/blog"));
  }, [dispatch]);

  useEffect(() => {
    if (props.location.state && props.location.state.category_id) {
      const selCategory_id = props.location.state.category_id;
      let data = [];
      blogList.forEach((item) => {
        if (item.category_id) {
          const flag = item.category_id.filter(
            (element) => element === selCategory_id
          );
          if (flag.length > 0) {
            data.push(item);
          }
        }
      });
      setFilterBlog(data);
      setLoader(false);
    } else {
      setFilterBlog(blogList);
      setLoader(false);
    }
  }, [blogList, props]);

  const fitlerByCategoryId = (category_id) => {
    let data = [];
    blogList.forEach((item) => {
      if (item.category_id) {
        const flag = item.category_id.filter(
          (element) => element === category_id
        );
        if (flag.length > 0) {
          data.push(item);
        }
      }
    });
    setFilterBlog(data);
  };

  return (
    <Fragment>
      {/* Header section start */}
      <section className="header-breadcrumb bgimage">
        <div className="bg_image_holder">
          {!load && <img src={heroImage || blogImage} alt="" />}
        </div>
        <div className="mainmenu-wrapper">
          <Header logo={light} class="menu--light" history={props.history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={t("all_blog_list")} />
      </section>
      {/* Header section end */}
      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {loader ? (
                <div className="custom-loader">
                  <Loader
                    type="Oval"
                    color="#afdb30"
                    height={70}
                    width={70}
                    timeout={3000}
                  />
                </div>
              ) : (
                <>
                  <div className="blog-posts">
                    <BlogSingle blog={filterBlog} />
                  </div>
                </>
              )}
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <div className="sidebar">
                {/* <!-- search widget --> */}
                <div className="widget-wrapper">
                  <div className="search-widget">
                    <form action="#">
                      <div className="input-group">
                        <input
                          type="text"
                          className="fc--rounded"
                          placeholder="Search"
                        />
                        <button type="submit">
                          <i className="la la-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>

                  <Category
                    list={categoryList}
                    filterCategory={fitlerByCategoryId}
                    onViewAll={() => history.push("/blog-grid-list")}
                  />
                  <PopularPost blog={blogList} />
                  <RecentPost blog={blogList} />
                </div>
                {/*<!-- ends: .widget-wrapper -->*/}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    logo: state.logo,
  };
};
export default connect(mapStateToProps)(AllBlogGrid);
