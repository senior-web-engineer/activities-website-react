import React from "react";
import { MultiLang } from "./widget";
import { useTranslation } from "react-i18next";
// const noAction = (e) => e.preventDefault();
export default function Subscribe() {
  const { t } = useTranslation();
  return (
    <section className="subscribe-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h1>
              <MultiLang text="subscribe_title" />
            </h1>
            <p>
              <MultiLang text="subscribe_desc1" />
            </p>
            <form action="/" className="subscribe-form m-top-40">
              <div className="form-group">
                <span className="la la-envelope-o"></span>
                <input
                  type="text"
                  placeholder={`${t("subscribe_desc2")}`}
                  required
                />
              </div>
              <button className="btn btn-gradient btn-gradient-one">
                <MultiLang text="subscribe_desc3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
