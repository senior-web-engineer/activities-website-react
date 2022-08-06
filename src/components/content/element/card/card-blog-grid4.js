import LabelIcon from "@material-ui/icons/Label";
import React, { Component, Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { settings } from "../../../../config";
import defaultImage from "../../../../assets/img/blog/4.jpg";

const noAction = (e) => e.preventDefault();

class BlogGrid4 extends Component {
  filterBlogByTag = (category_id, tag_id, title) => {
    const { history } = this.props;
    history.push({
      pathname: `/blog-details/${title.replace(/ /g, "-")}`,
      state: { category_id, tag_id },
    });
  };
  render() {
    const { blog } = this.props;

    return (
      <Fragment>
        <Slider {...settings}>
          {blog &&
            blog.length > 0 &&
            blog.map((item, key) => {
              return (
                <div className="col-lg-12 col-sm-12" key={key}>
                  <div className="grid-single">
                    <div className="card post--card shadow-sm">
                      <figure>
                        <NavLink
                          to={{
                            pathname: `/blog-details/${item.title.replace(
                              / /g,
                              "-"
                            )}`,
                            state: { category_id: item.id },
                          }}
                        >
                          <img
                            src={item.img_url ?? defaultImage}
                            alt=""
                            style={{ height: "250px", objectFit: "cover" }}
                          />
                        </NavLink>
                      </figure>
                      <div className="card-body p-4">
                        <h6>
                          <NavLink
                            to={{
                              pathname: `/blog-details/${item.title.replace(
                                / /g,
                                "-"
                              )}`,
                              state: { category_id: item.id },
                            }}
                          >
                            {item.title}
                          </NavLink>
                        </h6>
                        <ul className="post-meta d-flex list-unstyled">
                          <li>{item.date}</li>
                          <li>
                            in{" "}
                            <NavLink
                              to={{
                                pathname: `/blog-details/${item.title.replace(
                                  / /g,
                                  "-"
                                )}`,
                                state: { category_id: item.id },
                              }}
                              onClick={noAction}
                            >
                              {item.category_name}
                            </NavLink>
                          </li>
                        </ul>
                        <div className="d-flex justify-content-start">
                          <div className="padding-0">
                            {item.tag_info.length > 0 && <LabelIcon />}
                          </div>
                          <div className="padding-0">
                            {item.tag_info.length > 0 &&
                              item.tag_info.map((tagInfo, key) => {
                                return (
                                  <span
                                    className="badge badge-success pointer m-left-10 m-bottom-10"
                                    key={key}
                                    onClick={() =>
                                      this.filterBlogByTag(
                                        item.id,
                                        tagInfo.tag_id,
                                        item.title
                                      )
                                    }
                                  >
                                    {tagInfo.tag_name}
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      </Fragment>
    );
  }
}

export default withRouter(BlogGrid4);
