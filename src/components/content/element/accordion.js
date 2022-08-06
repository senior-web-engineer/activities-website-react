import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
const noAction = (e) => e.preventDefault();
export class Accordion extends Component {
  render() {
    return (
      <Fragment>
        <div className="atbdb_content_module_contents">
          <div className="atbdp-accordion">
            <div className="accordion-single selected">
              <h3 className="faq-title">
                <NavLink onClick={noAction} to="/at_demo">
                  Question number one
                </NavLink>
              </h3>
              <p className="ac-body" style={{ display: "block" }}>
                Ensuring productivity and growth is essential for architecture
                and engineering teams. The industry requires a high level of
                precision, full legal compliance
              </p>
            </div>
            <div className="accordion-single">
              <h3 className="faq-title">
                <NavLink onClick={noAction} to="/at_demo">
                  Question number two and others
                </NavLink>
              </h3>
              <p className="ac-body" style={{ display: "none" }}>
                Ensuring productivity and growth is essential for architecture
                and engineering teams. The industry requires a high.
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export class Accordion2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  render() {
    return (
      <Fragment>
        <div className="atbdb_content_module_contents">
          <div className="atbdp-accordion">
            {this.props.faqData.length > 0 &&
              this.props.faqData.map((item, key) => {
                return (
                  <div
                    className={`accordion-single ${
                      this.state.selected === key ? "selected" : ""
                    } `}
                    key={key}
                    onClick={() => this.setState({ selected: key })}
                  >
                    <h3 className="faq-title">
                      <NavLink to="/at_demo" onClick={noAction}>
                        {item.title}
                      </NavLink>
                    </h3>
                    <p
                      className={`ac-body ${
                        this.state.selected === key ? "d-block" : "d-none"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </Fragment>
    );
  }
}
