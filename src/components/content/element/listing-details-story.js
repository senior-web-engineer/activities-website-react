import React, { Component, Fragment } from "react";
import { MultiLang } from "./widget";

export class ContentStory extends Component {
  render() {
    return (
      <Fragment>
        <div className="atbd_content_module atbd_listing_details cu-radius">
          <div className="atbd_content_module__tittle_area">
            <div className="atbd_area_title">
              <h4>
                <span className="la la-file-text-o"></span>
                <MultiLang text="about" />
              </h4>
            </div>
          </div>
          <div className="atbdb_content_module_contents">
            <p>{this.props.content.ad_description}</p>
          </div>
        </div>
      </Fragment>
    );
  }
}
