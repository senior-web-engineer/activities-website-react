import React, { useEffect, useState } from "react";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "assets/table_trust.css";
import { MultiLang } from "./widget";
const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 1,
  speed: 2000,
  autoplaySpeed: 4000,
  autoplay: true,
  slidesToScroll: 1,
  lazyLoad: true,
  // nextArrow: "none",
  // prevArrow: "none",
};
const items = [
  {
    id: 0,
    title: "trus_check_title1",
    flags: {
      item1: true,
      item2: true,
      item3: true,
      item4: true,
      item5: true,
      item6: true,
    },
  },
  {
    id: 1,
    title: "trus_check_title2",
    flags: {
      item1: false,
      item2: true,
      item3: false,
      item4: true,
      item5: true,
      item6: true,
    },
  },
  {
    id: 2,
    title: "trus_check_title3",
    flags: {
      item1: false,
      item2: false,
      item3: false,
      item4: false,
      item5: false,
      item6: true,
    },
  },
  {
    id: 3,
    title: "trus_check_title4",
    flags: {
      item1: false,
      item2: false,
      item3: false,
      item4: true,
      item5: false,
      item6: true,
    },
  },
];
export default function TrustUs() {
  const [pined, setPined] = useState(0);
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    setSliderList((prev) => [
      ...items.slice(0, pined),
      ...items.slice(pined + 1, items.length),
    ]);
  }, [pined]);

  return (
    <div className="trust-section">
      <div className="trust-deskop">
        <div className="trust-us container">
          <div className="header_container">
            <div className="custom_panel">
              <div className="panel_header">
                <MultiLang text="trus_check_title1" />
              </div>
            </div>
            <div className="custom_panel">
              <div className="panel_header">
                <MultiLang text="trus_check_title2" />
              </div>
            </div>
            <div className="custom_panel">
              <div className="panel_header">
                <MultiLang text="trus_check_title3" />{" "}
              </div>
            </div>
            <div className="custom_panel">
              <div className="panel_header">
                <MultiLang text="trus_check_title4" />
              </div>
            </div>
          </div>
          <table className="w-100" style={{ background: "#afdb30" }}>
            <colgroup>
              <col />
              <col className="col_field" />
              <col className="col_field" />
              <col className="col_field" />
              <col className="col_field" />
            </colgroup>
            <tbody>
              <tr className="col_custom_header">
                <td className="col_title">
                  <MultiLang text="trus_title1" />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="col_title">
                  <MultiLang text="trus_title2" />{" "}
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="col_title">
                  <MultiLang text="trus_title3" />{" "}
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="col_title">
                  <MultiLang text="trus_title4" />
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="col_title">
                  <MultiLang text="trus_title5" />
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="col_title">
                  <MultiLang text="trus_title6" />
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CloseIcon className="closed-icon" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="col_title">
                  <MultiLang text="trus_title7" />
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
                <td>
                  <div>
                    <CheckIcon className="checked-icon" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="trust-desc">
          <p>
            <MultiLang text="trus_title8" />
          </p>
        </div>
      </div>
      <div className="trust-mobile">
        <div className="trust-mobile-header">
          <MultiLang text="trus_title1" />
        </div>
        <div className="list-container">
          <div className="trust-list-item">
            <MultiLang text="trus_title2" />
          </div>
          <div className="trust-list-item">
            <MultiLang text="trus_title3" />
          </div>
          <div className="trust-list-item">
            <MultiLang text="trus_title4" />
          </div>
          <div className="trust-list-item">
            <MultiLang text="trus_title5" />
          </div>
          <div className="trust-list-item">
            <MultiLang text="trus_title6" />
          </div>
          <div className="trust-list-item">
            <MultiLang text="trus_title7" />
          </div>
        </div>
        <div className="trust-list-desc">
          <MultiLang text="trus_title8" />
        </div>
        <div className="trust-list-container">
          <div className="m-right-10">
            <TrustItem item={items?.[pined]} pined={pined} />
          </div>
          <div className="items-slider" style={{ width: "83px" }}>
            <Slider {...settings}>
              {sliderList.map((item, key) => (
                <TrustItem
                  item={item}
                  pined={pined}
                  key={key}
                  handleSelectPin={(value) => setPined(value)}
                />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustItem({
  pined = 0,
  item = {},
  handleSelectPin = console.log,
}) {
  return (
    <div className="trust-mobile-item">
      <div className="trust-mobile-item-header">
        <MultiLang text={item?.title ?? ""} />
      </div>
      <div className="trust-mobile-item-pin">
        {/* <button
          className={`${
            Boolean(pined === item.id) ? "disabled-background" : "pointer"
          }`}
          onClick={() => handleSelectPin(item.id)}
          disabled={Boolean(pined === item.id)}
        ></button> */}
      </div>
      <div style={{ background: "#f0de88", width: "100%" }}>
        {Object.values(item.flags).map((value, index) => (
          <div className="trust-list-item value-item" key={index}>
            {Boolean(value) ? (
              <CheckIcon className="checked-icon" />
            ) : (
              <CloseIcon className="closed-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
