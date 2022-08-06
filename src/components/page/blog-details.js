import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../layout/header";
import { Footer } from "../layout/footer";
import { connect } from "react-redux";
import { BreadcrumbWraper } from "../content/element/breadcrumb";
import { Category, PopularPost, RecentPost } from "../content/element/widget";
import DetailsContent from "../container/blog-details";
import { getCategories } from "../../Store/action/categories";
import { getBannerImage } from "../../Store/action/categories";
import { getBlogList } from "../../Store/action/blogActions";
import blogBannerImage from "../../assets/img/Banners/blog-header.png";

const BlogDetails = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const categoryList = useSelector((state) => state.category.categories);
  let blogList = useSelector((state) => state.blog.blog_list);
  const [selectedBlog, setSelectedBlog] = useState({});
  const [relativeBlog, setRelativeBlog] = useState([]);
  // const [load, setLoad] = useState(true);
  const light = props.logo[0].light;
  // const heroImage = useSelector((state) => state.category.hero_image);
  // useEffect(() => {
  //   setLoad(false);
  // }, [heroImage]);
  useEffect(() => {
    const id = props?.location?.state?.category_id ?? "";
    const tag_id = props?.location?.state?.tag_id ?? "";
    const title = props?.match?.params?.title ?? "";
    if (id !== "" || title !== "") {
      const filter = Object.values(blogList).filter((value) => {
        return value.id === id || value.title.replace(/ /g, "-") === title;
      });
      let relativeBlog = [];
      if (tag_id !== "") {
        blogList.forEach((item) => {
          if (item.tag_id) {
            const data = item.tag_id.filter(
              (tid) => tid === tag_id && id !== item.id
            );
            if (data.length > 0) {
              relativeBlog.push(item);
            }
          }
        });
      } else {
        blogList.length > 0 &&
          blogList.forEach((item) => {
            if (
              item.category_id !== undefined &&
              filter[0]?.category_id !== undefined &&
              item?.category_id &&
              filter[0]?.category_id
            ) {
              const data = filter[0].category_id.filter(
                (cate_id) => item.category_id[0] === cate_id && item.id !== id
              );
              if (data.length > 0) {
                relativeBlog.push(item);
              }
            }
            if (item.tag_id && filter[0]?.tag_id.length > 0) {
              const data = item.tag_id.filter(
                (tid) => tid === filter[0].tag_id[0] && id !== item.id
              );
              if (data.length > 0) {
                relativeBlog.push(item);
              }
            }
          });
      }
      setSelectedBlog(filter[0]);
      setRelativeBlog(relativeBlog);
    }
  }, [blogList, props]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBlogList());
    dispatch(getBannerImage("/blog-details"));
    // eslint-disable-next-line
  }, []);

  const fitlerByCategoryId = (category_id) => {
    props.history.push({
      pathname: "/blog-grid-list",
      state: { category_id },
    });
  };

  return (
    <Fragment>
      {/* Header section start */}
      <section className="header-breadcrumb bgimage">
        <div
          className="bg_image_holder"
          style={{
            backgroundImage: `url(${blogBannerImage})`,
            opacity: "1",
          }}
        ></div>
        <div className="mainmenu-wrapper">
          <Header logo={light} class="menu--light" history={props.history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <BreadcrumbWraper title={selectedBlog ? selectedBlog.title : ""} />
      </section>
      {/* Header section end */}

      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <DetailsContent
                contents={selectedBlog}
                relative={relativeBlog}
                history={props.history}
              />
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <div className="sidebar">
                {/* <!-- search widget --> */}
                <div className="widget-wrapper">
                  <div className="search-widget">
                    <form action="#">
                      <div className="input-group">
                        <input type="text" className="fc--rounded" />
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
                    history={props.history}
                  />
                  <PopularPost blog={blogList} />
                  <RecentPost blog={blogList} />
                  {/* <ConnentFollow /> */}
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
export default connect(mapStateToProps)(BlogDetails);
