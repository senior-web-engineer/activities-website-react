import React, { Component, Fragment } from "react";
import FontAwesome from "react-fontawesome";
import { NavLink, withRouter } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";

// Font icons
class NavItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: true,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  UNSAFE_componentWillMount() {
    const role = JSON.parse(sessionStorage.getItem("role"));
    if (role) {
      if (role === "advertiser") {
        this.setState({
          permission: false,
        });
      }
    }
  }

  handleScroll = () => {
    if (this.props && this.props.propsRef !== undefined) {
      this.props.propsRef.current.scrollIntoView();
    } else {
      window.location.href = "/blog-grid-list";
    }
  };

  handleScrollGoogleApp = () => {
    if (this.props && this.props.googleAppRef !== undefined) {
      this.props.googleAppRef.current.scrollIntoView();
    }
  };

  handleScrollMerchant = () => {
    if (this.props && this.props.merchantRef !== undefined) {
      this.props.merchantRef.current.scrollIntoView();
    }
  };

  render() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return (
      <Fragment>
        <ul className="navbar-nav">
          {this.state.permission && (
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
          )}
          {this.state.permission && (
            <li className="dropdown has_dropdown">
              <a
                className="dropdown-toggle"
                href=" "
                id="drop3"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Browse
              </a>
              <ul className="dropdown-menu" aria-labelledby="drop3">
                <li>
                  <NavLink
                    to="/all-listings-grid"
                    onClick={(e) => sessionStorage.removeItem("searchData")}
                  >
                    <FontAwesome name="list" style={{ paddingRight: "10px" }} />
                    All Activites
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/merchant-support">
                    <FontAwesome name="info" style={{ paddingRight: "10px" }} />
                    Provider Information
                  </NavLink>
                </li>
                {!user && (
                  <li>
                    <NavLink to="/pricing-plans">
                      <FontAwesome
                        name="dollar-sign"
                        style={{ paddingRight: "10px" }}
                      />
                      Pricing Plans
                    </NavLink>
                  </li>
                )}
              </ul>
            </li>
          )}
          <li className="d-flex align-items-center">
            <p className="text-white mb-0 pointer" onClick={this.handleScroll}>
              Blog
            </p>
          </li>
          <li style={{ borderBottom: "none", paddingTop: "19px" }}>
            {this.props.location.pathname === "/" ? (
              <div className="btn btn-xs btn-gradient btn-gradient-one app-store-group top-app">
                <a
                  href="https://apps.apple.com/app/id1501612336#?platform=iphone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  <span className="la la-apple text-white"></span> App Store
                </a>
                <span className="button-group-bar"></span>
                <a
                  href="https://play.google.com/store/apps/details?id=app.activities.activities "
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  <span className="la la-android text-white"></span> Google Play
                </a>
              </div>
            ) : (
              <NavHashLink to="/#sectionGoogleApp">
                <div
                  className="btn btn-xs btn-gradient btn-gradient-one app-store-group top-app"
                  // onClick={this.handleScrollGoogleApp}
                >
                  <span className="la la-apple"></span> App Store
                  <span className="button-group-bar"></span>
                  <span className="la la-android"></span> Google Play
                </div>
              </NavHashLink>
            )}
            <NavHashLink to="/#providerInformation">
              <div
                className="btn btn-xs btn-gradient merchant-button"
                // onClick={this.handleScrollMerchant}
              >
                {/* <NavLink to="#" className="merchant-info"> */}
                <span className="la la-info"></span>Provider Information
                {/* </NavLink> */}
              </div>
            </NavHashLink>
          </li>
        </ul>
      </Fragment>
    );
  }
}

export default withRouter(NavItem);
