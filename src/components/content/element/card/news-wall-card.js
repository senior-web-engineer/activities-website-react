import React, { Component, Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import defaultImage from "../../../../assets/img/blog/4.jpg"; 
import image1 from "../../../../assets/img/card/1.jpg";
import iamge2 from "../../../../assets/img/card/2.jpg";
import image3 from "../../../../assets/img/card/3.jpg";
const noAction = (e) => e.preventDefault();

class NewsWallCard extends Component {
  filterBlogByTag = (category_id, tag_id, title) => {
    const { history } = this.props;
    history.push({
      pathname: `/blog-details/${title.replace(/ /g, "-")}`,
      state: { category_id, tag_id },
    });
  };

  render() { 
    return (
      <Fragment>  
        <div className="col-lg-4 col-md-6">
          <div className="grid-single">
            <div className="card post--card shadow-sm">
              <figure>
                {/* <NavLink
                  to={{
                    pathname: `/blog-details/${item.title.replace(
                      / /g,
                      "-"
                    )}`,
                    state: { category_id: item.id },
                  }}
                > */}
                <NavLink to="#">
                  <img
                    src={image1}
                    alt=""
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </NavLink>
              </figure>
              <div className="card-body" style={{ height: "150px" }}>
                <h6>
                  {/* <NavLink
                    to={{
                      pathname: `/blog-details/${item.title.replace(
                        / /g,
                        "-"
                      )}`,
                      state: { category_id: item.id },
                    }}
                  > */}
                  <NavLink to="#">
                    {"Welcoming the Renowned Quilters of Gee’s Bend to the Etsy Community"}
                  </NavLink>
                </h6>
                <ul className="post-meta d-flex list-unstyled">
                  <li>{"10/21/2021 11:20"}</li>
                  <li>
                    in{" "}
                    <NavLink
                      to="#"
                      // to={{
                      //   pathname: `/blog-details/${item.title.replace(
                      //     / /g,
                      //     "-"
                      //   )}`,
                      //   state: { category_id: item.id },
                      // }}
                      onClick={noAction}
                    >
                      Paddleboard
                    </NavLink>
                  </li>
                </ul> 
              </div>
            </div>
          </div>
        </div> 
        
        <div className="col-lg-4 col-md-6">
          <div className="grid-single">
            <div className="card post--card shadow-sm">
              <figure>
                {/* <NavLink
                  to={{
                    pathname: `/blog-details/${item.title.replace(
                      / /g,
                      "-"
                    )}`,
                    state: { category_id: item.id },
                  }}
                > */}
                <NavLink to="#">
                  <img
                    src={image1}
                    alt=""
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </NavLink>
              </figure>
              <div className="card-body" style={{ height: "150px" }}>
                <h6>
                  {/* <NavLink
                    to={{
                      pathname: `/blog-details/${item.title.replace(
                        / /g,
                        "-"
                      )}`,
                      state: { category_id: item.id },
                    }}
                  > */}
                  <NavLink to="#">
                    {"Welcoming the Renowned Quilters of Gee’s Bend to the Etsy Community"}
                  </NavLink>
                </h6>
                <ul className="post-meta d-flex list-unstyled">
                  <li>{"10/21/2021 11:20"}</li>
                  <li>
                    in{" "}
                    <NavLink
                      to="#"
                      // to={{
                      //   pathname: `/blog-details/${item.title.replace(
                      //     / /g,
                      //     "-"
                      //   )}`,
                      //   state: { category_id: item.id },
                      // }}
                      onClick={noAction}
                    >
                      Paddleboard
                    </NavLink>
                  </li>
                </ul> 
              </div>
            </div>
          </div>
        </div> 
        
        <div className="col-lg-4 col-md-6">
          <div className="grid-single">
            <div className="card post--card shadow-sm">
              <figure> 
                <NavLink to="#">
                  <img
                    src={image1}
                    alt=""
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </NavLink>
              </figure>
              <div className="card-body" style={{ height: "150px" }}>
                <h6> 
                  <NavLink to="#">
                    {"Welcoming the Renowned Quilters of Gee’s Bend to the Etsy Community"}
                  </NavLink>
                </h6>
                <ul className="post-meta d-flex list-unstyled">
                  <li>{"10/21/2021 11:20"}</li>
                  <li>
                    in{" "}
                    <NavLink
                      to="#" 
                      onClick={noAction}
                    >
                      Paddleboard
                    </NavLink>
                  </li>
                </ul> 
              </div>
            </div>
          </div>
        </div> 
      </Fragment>
    );
  }
}

export default withRouter(NewsWallCard);
