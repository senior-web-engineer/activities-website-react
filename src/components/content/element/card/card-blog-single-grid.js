import React, { Component, Fragment } from "react";
import LabelIcon from "@material-ui/icons/Label";
import { NavLink, withRouter } from "react-router-dom";

class BlogSingle extends Component {
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
        {blog && blog.length > 0
          ? blog.map((item, key) => {
              return (
                <div className={"blog-single"} key={key}>
                  <div className="card post--card post--card2 ">
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
                          src={item.img_url}
                          alt=""
                          style={{ height: "550px", objectFit: "cover" }}
                        />
                      </NavLink>
                      <figcaption>
                        <NavLink
                          to={{
                            pathname: `/blog-details/${item.title.replace(
                              / /g,
                              "-"
                            )}`,
                            state: { category_id: item.id },
                          }}
                        >
                          <i className="la la-image"></i>
                        </NavLink>
                      </figcaption>
                    </figure>
                    <div className="card-body">
                      <h3>
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
                      </h3>
                      <div className="d-flex">
                        <label>{item.date}</label>
                        <label className="p-left-15">
                          {item.category_name}
                        </label>
                        <label className="p-left-15">
                          {item.blog_reviews_data.length} Comments
                        </label>
                      </div>
                      <div style={{ borderBottom: "1px solid #ccc" }}>
                        {item.tag_info.length > 0 && (
                          <LabelIcon className="m-bottom-10" />
                        )}
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
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          : // <div class="alert alert-primary" role="alert">
            //   There is no Blog!
            // </div>
            null}
      </Fragment>
    );
  }
}

export default withRouter(BlogSingle);
