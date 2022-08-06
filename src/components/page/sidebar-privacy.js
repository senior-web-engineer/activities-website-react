import AccountHeader from "components/content/element/accountHeader";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Footer } from "../layout/footer";
import SideBar from "./profile/sidebar-component";

class SidebarPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone_number: "",
      avater: "",
    };
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email,
      avatar: user.profile_picture,
      phone_number: user.phone_number,
    }));
  }
  render() {
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
                <SideBar select={19} />
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12 m-bottom-30">
                <div className="atbd_author_module">
                  <div className="atbd_content_module cu-radius">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <span className="la-clipboard-check cu-icon-color"></span>
                          Privacy & Policy
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents content-radius">
                      <p>
                        Activities App is a technology based service provider,
                        which allows persons seeking to participate in activity
                        based programs to search for activity programs of their
                        interest. Activities App is committed to protecting your
                        privacy and confidential information acquired through
                        this Application and by its Service Providers. You
                        acknowledge that you have read this Privacy statement of
                        Activities App by Go Talk LLC, and agree to its terms.
                      </p>
                      <p>
                        We collect various information about you through your
                        use of this Application, both personal and non-personal.
                        Personal information includes matters such as your name,
                        address, telephone number, e-mail address and birthdate.
                        This type of personal information may be acquired when
                        you create an account with Activities App by entering
                        your personal information into a form; through your
                        e-mails and communication with us; and your
                        participation in surveys and marketing or promotional
                        events. Other personal information may include credit
                        and debit card information when entering into a
                        transaction with another person through the Application.
                        We may share or disclose your personal identifiable
                        information with third parties, including Service
                        Providers in connection with data processing and storage
                        of customer information, third parties and links to
                        third parties you engage with in use of this Application
                        and any promotional and marketing events such as
                        contents, coupons, games or other such programs of the
                        third party, as required by law including subpoena,
                        those you authorize us to provide information to, law
                        enforcement or other governmental agency if we in our
                        sole discretion determine a violation of law or risk of
                        bodily harm exists, and to enforce or protect the terms
                        of the privacy policy.
                      </p>
                      <p>
                        Non-personal information may include certain
                        geographical and demographic information and information
                        regarding your usage history and tendencies. We collect
                        this type of non-personal information through your IP
                        Address, “Cookies” and web beacons when you are using
                        the Application. The information acquired through these
                        technical means does not provide any personal
                        identifiable information about you, but merely your
                        usage history, patterns, tendencies and habits. This
                        information is used by us to better serve your customer
                        needs, to provide technical support, to better provide
                        you with marketing and promotional items, to help in
                        making changes to the Application and to help us better
                        address your needs as a user of this Application.
                      </p>
                      <p>
                        If you are a California resident who has provided
                        personal identifiable information on this Application,
                        you may request information regarding our disclosures to
                        third parties, if any, of your personal identifiable
                        information. Said requests can be made by contacting us
                        at the contact information provided below and titling
                        said request “Request for California Privacy
                        Information” on the message or subject line.
                      </p>
                    </div>
                  </div>
                </div>
                {/*<!-- ends: .atbd_author_module -->*/}{" "}
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
    list: state.list,
    login: state.login,
    logo: state.logo,
  };
};
export default connect(mapStateToProps)(SidebarPrivacy);
