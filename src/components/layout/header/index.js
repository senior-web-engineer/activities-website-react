import { Badge, ClickAwayListener, Collapse } from "@material-ui/core";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { ReactSVG } from "react-svg";
import defaultAvatar from "../../../assets/img/default.jpg";
import ChinaFlag from "../../../assets/img/flag/svg/china.svg";
import FranceFlag from "../../../assets/img/flag/svg/france.svg";
import GermanFlag from "../../../assets/img/flag/svg/german.svg";
import PortugalFlag from "../../../assets/img/flag/svg/portugal.svg";
import SpainFlag from "../../../assets/img/flag/svg/spain.svg";
import USFlag from "../../../assets/img/flag/svg/UnitedState.svg";
import Logo from "../../../assets/img/logo-white.jpg";
import mobileLogo from "../../../assets/img/logo@mobile.png";
// import mobileAppPrompt from "../../../assets/img/app-prompt.svg";
import { getUserInfo, logOut } from "../../../Store/action/auth";
import { getMetaData } from "../../../Store/action/listing";
import { getAdvNotification, getCartInfo } from "../../../Store/action/widget";
import FullScreenDialog from "./FullWidtdModal";
import SideBar from "./sidebar";
import { useTranslation } from "react-i18next";
import { MultiLang } from "components/content/element/widget";
import { setCurrency } from "Store/action/appAction";
import { getListing } from "Store/action/listing";
// import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
// import { settings } from "../../../config";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";
// import leftArrow from "assets/img/left-arrow.svg";
// import rightArrow from "assets/img/right-arrow.svg";
import { getHeaderMessage } from "Store/action/categories";

// const PrevArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         width: "30px",
//         marginTop: "-8px",
//         position: "absolute",
//         marginLeft: "35px",
//         zIndex: "100",
//       }}
//       onClick={onClick}
//     >
//       <img src={leftArrow} alt="" />
//     </div>
//   );
// };

// const NextArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         width: "30px",
//         position: "absolute",
//         marginRight: "-15px",
//         marginTop: "-8px",
//         zIndex: "100",
//         right: "0 !important",
//       }}
//       onClick={onClick}
//     >
//       <img src={rightArrow} alt="" />
//     </div>
//   );
// };

// const settings = {
//   dots: false,
//   infinite: true,
//   speed: 100,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   autoplay: true,
//   nextArrow: <NextArrow />,
//   prevArrow: <PrevArrow />,
// };

export function SelectDropdown({
  lists,
  cols,
  icon,
  title,
  titleFontSize,
  currency,
  align,
  onChange,
}) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleSelectItem = (item) => {
    setOpen(false);
    if (item?.path) {
      history.push(item.path);
    } else if (item?.icon) {
      i18n.changeLanguage(item?.value ?? "en");
      sessionStorage.setItem(
        "language",
        JSON.stringify({
          icon: item.icon,
          title: item.title,
          value: item.value ?? "en",
        })
      );
      onChange({ icon: item.icon, title: item.title }, "lang");
    } else {
      onChange(
        { title: item.title, currency: item.currency, value: item.value },
        "curr"
      );
    }
  };
  return (
    <div className="select-dropdown">
      <div className="select-dropdown-title" onClick={handleOpen}>
        <button>
          {align === "left" && (
            <ArrowForwardIosRoundedIcon style={{ marginRight: 10 }} />
          )}
          <div>
            {icon && <ReactSVG src={icon} />}
            <span
              className="pr-2"
              style={{ fontSize: titleFontSize ? titleFontSize : 16 }}
            >
              <MultiLang text={title} />
              {currency && <span>({currency})</span>}
            </span>
          </div>
          {align !== "left" && <ArrowForwardIosRoundedIcon />}
        </button>
      </div>
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Collapse in={open}>
            <div
              className={`select-dropdown-body cols-${cols}`}
              style={{ left: `${align === "left" ? "0" : ""}` }}
            >
              {lists?.map((item, key) => (
                <div
                  className="drop-item"
                  key={key}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="drop-item-content">
                    {item.icon && (
                      <div className="icon">
                        <ReactSVG src={item.icon} />
                      </div>
                    )}
                    <span>
                      <MultiLang text={item.title} />
                    </span>
                    {item.currency && (
                      <span className="currency">{item.currency}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Collapse>
        </ClickAwayListener>
      )}
    </div>
  );
}
export default function Header(props) {
  const dispatch = useDispatch();
  const cartInfo = useSelector((state) => state.widget.cartData).length;
  const notificationData = useSelector(
    (state) => state.widget.adv_notification
  );
  // const headerMessages =
  //   useSelector((state) => state.app)?.header_messages || [];
  // const appPrompt = useSelector((state) => state?.app?.appPrompt);
  const unreadMsgCnt = useSelector((state) => state.widget.unreadMsg);
  const metaData = useSelector((state) => state.list.metaData);
  const currencyData = useSelector((state) => state.app.currency);

  const [user] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [role] = useState(JSON.parse(sessionStorage.getItem("role")));
  const [cartCnt, setCartCnt] = useState(0);
  const [notificationCnt, setNotificationCnt] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clopen, setClOpen] = useState(false);
  // const [currencyData, setCurrencyData] = useState({
  //   title: "USD",
  //   currency: "$",
  // });
  const [languageData, setLanguageData] = useState(
    JSON.parse(sessionStorage.getItem("language")) ?? {
      icon: USFlag,
      title: "English",
    }
  );
  const [fullScreenTitle, setFullScreenTitle] = useState("");
  const [lists, setLists] = useState([]);
  const handleSelectCL = (title, list) => {
    setFullScreenTitle(title);
    setClOpen(true);
    setLists(list);
  };

  const handleSelectDesktopCL = (data, type) => {
    if (type === "lang") {
      setLanguageData(data);
    } else {
      setCurrency(dispatch, data);
    }
  };

  const signOut = (e) => {
    e.preventDefault();
    dispatch(logOut());
  };

  useEffect(() => {
    dispatch(getUserInfo());
    dispatch(getMetaData());
    dispatch(getHeaderMessage());
    if (user) {
      dispatch(getAdvNotification());
    } else {
      const cartCnt = JSON.parse(sessionStorage.getItem("cartCnt"));
      setCartCnt(cartCnt);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      const notiList = notificationData.filter(
        (item) => item?.is_read === "0"
      ).length;
      setNotificationCnt(notiList);
    }
    // eslint-disable-next-line
  }, [notificationData]);

  useEffect(() => {
    setCartCnt(cartInfo);
  }, [cartInfo]);

  useEffect(() => {
    if (currencyData?.title) {
      dispatch(getListing(currencyData?.value || "USD"));
    }
    if (user) {
      dispatch(getCartInfo(currencyData?.value || "USD"));
    }
    // eslint-disable-next-line
  }, [currencyData]);

  return (
    <>
      {Object.entries(metaData).length > 0 && (
        <MetaTags>
          <meta name="description" content={metaData.description} />
          <meta property="og:title" content={metaData.title} />
          <meta property="og:image" content={metaData.img} />
          <meta property="og:url" content={metaData.url} />
          <meta property="og:keywords" content={metaData.keywords} />
        </MetaTags>
      )}
      <div
        className="header top-menu-area"
        style={{
          background: Boolean(props?.background) ? props.background : "",
        }}
      >
        {/* {appPrompt && (
          <div className="app-prompt-download">
            <div className="d-flex justify-around-between align-items-center">
              <div className="app-prompt-logo">
                <img src={mobileAppPrompt} />
              </div>
              <div className="app-prompt-desc">
                <h3>Lorem ipsum dolor sit amet, adipiscing elit.</h3> 
              </div>
            </div>
            <div className="app-download">
              <button>Download</button>
            </div>
            <div className="app-prompt-close">
              <CloseOutlinedIcon
                onClick={() => {
                  dispatch({ type: "SET_APP_PROMPT", payload: false });
                }}
              />
            </div>
          </div>
        )}
        
        {headerMessages.length > 0 && (
          <>
            <div className="header-message">
              {headerMessages.map((item, key) => (
                <div className="message-item" key={key}>
                  <i className={item.icon}></i>
                  <p className="mb-0 pl-3">{item.message}</p>
                </div>
              ))}
            </div>
            <div className="header-message-mobile">
              <Slider {...settings}>
                {headerMessages.map((item, key) => (
                  <div className="message-item-mobile" key={key}>
                    <i className={item.icon}></i>
                    <p className="mb-0 pl-3">{item.message}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </>
        )} */}
        <div className="header-content">
          <div className="header-section">
            <div className="header-logo-link">
              {role !== "advertiser" ? (
                <NavLink to="/">
                  <img src={Logo} alt="logoImage" className="img-fluid" />
                </NavLink>
              ) : (
                <NavLink to="#">
                  <img src={Logo} alt="logoImage" className="img-fluid" />
                </NavLink>
              )}
            </div>
          </div>
          <div className="header-section">
            <div className="header-menu-item" style={{ marginRight: 15 }}>
              <SelectDropdown
                title="find_an_activity"
                lists={leftMenuItems}
                cols={2}
                titleFontSize={20}
              />
            </div>
            <div className="header-menu-item" style={{ marginLeft: 15 }}>
              <SelectDropdown
                title="list_an_activity"
                cols={2}
                titleFontSize={20}
                lists={rightMenuItems}
              />
            </div>
          </div>
          <div className="header-section">
            <div className="menu-item">
              <SelectDropdown
                title={languageData?.title || "EN"}
                icon={languageData?.icon ?? USFlag}
                lists={languages}
                cols={1}
                onChange={(data, type) => handleSelectDesktopCL(data, type)}
              />
            </div>
            <div className="menu-item">
              <SelectDropdown
                title={currencyData?.title || "USD"}
                currency={currencyData.currency ?? "$"}
                cols={2}
                lists={currencies}
                onChange={(data, type) => handleSelectDesktopCL(data, type)}
              />
            </div>
            <div className="menu-item pointer">
              <NavLink to="/cart">
                {cartCnt > 0 ? (
                  <Badge badgeContent={cartCnt} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                ) : (
                  <ShoppingCartIcon />
                )}
              </NavLink>
            </div>
            <div className="menu-item">
              {user ? (
                <div className="author-info">
                  <div className="note-alert">
                    {notificationCnt > 0 && <span>{notificationCnt}</span>}
                  </div>
                  <div className="author-avatar">
                    <img
                      src={user?.profile_picture || defaultAvatar}
                      alt=""
                      className="rounded-circle header-avatar w-100 h-100"
                    />
                  </div>
                  <ul className="list-unstyled">
                    {role === "advertiser" && (
                      <li>
                        <NavLink
                          to="/#"
                          onClick={() =>
                            (window.location.href = "/add-activities")
                          }
                        >
                          <i className="la la-plus pr-10"></i>
                          <MultiLang text="add_activity" />
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink to="/edit-account">
                        <i className="la la-user pr-10"></i>
                        <MultiLang text="my_profile" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/notification-list">
                        <span className="la la-bell-o pr-10"></span>
                        <MultiLang text="notifications" />
                        <div className="note-alert left-alert">
                          {notificationCnt > 0 && (
                            <span>{notificationCnt}</span>
                          )}
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/chat">
                        <span className="la la-comment pr-10"></span>
                        <MultiLang text="chat" />
                        <div
                          className="note-alert left-alert"
                          style={{ marginLeft: "84px" }}
                        >
                          {unreadMsgCnt > 0 && <span>{unreadMsgCnt}</span>}
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/" onClick={signOut}>
                        <i className="la la-user pr-10"></i>
                        <MultiLang text="logout" />
                      </NavLink>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <NavLink to="/sign-in" style={{ color: "white" }}>
                    <MultiLang text="login" />
                  </NavLink>
                  <span className="p-1 text-white">or</span>
                  <NavLink to="/sign-up" style={{ color: "white" }}>
                    <MultiLang text="sing_up" />
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="header-mobile">
          <div className="header-mobile-logo">
            <div className="mobile-logo">
              {role !== "advertiser" ? (
                <NavLink to="/">
                  <img src={mobileLogo} alt="logoImage" />
                </NavLink>
              ) : (
                <NavLink to="#">
                  <img src={mobileLogo} alt="logoImage" />
                </NavLink>
              )}
            </div>
          </div>
          <div className="header-mobile-nav">
            <div
              className="mobile-nav-item"
              onClick={() => handleSelectCL("Language", languages)}
            >
              <div className="pr-1">
                <ReactSVG src={languageData?.icon} />
                <span>{languageData?.title}</span>
              </div>
              <ArrowForwardIosRoundedIcon />
            </div>
            <div
              className="mobile-nav-item"
              onClick={() => handleSelectCL("Currency", currencies)}
            >
              <div>
                <span className="pr-1">
                  <MultiLang text={currencyData?.title} />(
                  <strong>{currencyData.currency}</strong>)
                </span>
              </div>
              <ArrowForwardIosRoundedIcon />
            </div>
            <div className="mobile-nav-item pointer">
              <div className="mobile-cart">
                <NavLink to="/cart">
                  {cartCnt > 0 ? (
                    <Badge badgeContent={cartCnt} color="error">
                      <ShoppingCartIcon style={{ width: 22, height: 22 }} />
                    </Badge>
                  ) : (
                    <ShoppingCartIcon style={{ width: 22, height: 22 }} />
                  )}
                </NavLink>
              </div>
            </div>
            <div className="mobile-nav-item">
              <div className="mobile-user">
                <MenuIcon
                  style={{ width: 24, height: 24 }}
                  onClick={() => setSidebarOpen(true)}
                />
                <SideBar
                  open={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  onOpenSide={() => setSidebarOpen(true)}
                  notificationCnt={notificationCnt}
                  msgCnt={unreadMsgCnt}
                  findActivityData={leftMenuItems}
                  listActivityData={rightMenuItems}
                />
              </div>
            </div>
          </div>
        </div>
        <FullScreenDialog
          open={clopen}
          onClose={() => setClOpen(false)}
          title={fullScreenTitle}
          lists={lists}
          selCurrency={currencyData}
          selLanguage={languageData}
          selItem={""}
          onChange={(data, type) => handleSelectDesktopCL(data, type)}
          onSignOut={() => signOut()}
        />
      </div>
    </>
  );
}

const leftMenuItems = [
  {
    path: "/all-listings-grid/search/",
    title: "all_activities",
  },
  {
    path: "/all-listings-grid/search/activities?category=Personal-Trainer",
    title: "personal_trainer",
  },
  {
    path: "/all-listings-grid/search/activities?category=Swimming-Less",
    title: "summer_camps",
  },
  {
    path: "/all-listings-grid/search/activities?category=Sports-Clubs",
    title: "sports_and_recreation",
  },
  {
    path: "/all-listings-grid/search/activities?category=Music",
    title: "music_and_arts",
  },
  {
    path: "/blog-grid-list",
    title: "blog",
  },
  {
    path: "/sign-in",
    title: "get_my_ticket",
  },
  {
    path: "/support",
    title: "user_support",
  },
];

const rightMenuItems = [
  { path: "/sign-up-advertiser", title: "sign_login" },
  {
    path: "/blog-details/It’s-Free-to-List-Activities-on-Activities-App",
    title: "get_more_customers",
  },
  {
    path: "/blog-details/How-to-Turn-Your-Hobby-into-A-New-Business-with-Activities-App",
    title: "marketing_mad_easy",
  },
  {
    path: "/blog-details/Become-an-Activities-App-Premier-Partner",
    title: "business_analytics",
  },
  {
    path: "/blog-details/How-to-Set-Up-Your-Business-on-Activities-App",
    title: "staff_attendee features",
  },
  {
    path: "/blog-details/How-To-Use-Your-QR-Check-In-Tool",
    title: "mobile_ticketing",
  },
  { path: "/blog-grid-list", title: "blog" },
  {
    path: "/blog-details/Become-an-Activities-App-Premier-Partner",
    title: "upto_in_free_social_media",
  },
  { path: "/personaliezed-mobile-app", title: "brand_mobile_app" },
];

const languages = [
  {
    icon: USFlag,
    title: "English",
    value: "en",
  },
  {
    icon: PortugalFlag,
    title: "Português",
    value: "po",
  },
  {
    icon: SpainFlag,
    title: "Española",
    value: "sp",
  },
  {
    icon: GermanFlag,
    title: "Deutsch",
    value: "de",
  },
  {
    icon: FranceFlag,
    title: "Française",
    value: "fr",
  },
  {
    // icon: "../../../assets/img/flag/svg/china.svg",
    icon: ChinaFlag,
    title: "普通话",
    value: "ch",
  },
];

const currencies = [
  { title: "russian_ruble", currency: "₽", value: "RUB" },
  { title: "euro", currency: "€", value: "EUR" },
  { title: "us_dollar", currency: "$", value: "USD" },
  { title: "british_pound", currency: "£", value: "GBP" },
  { title: "australian_dollor", currency: "A$", value: "AUD" },
  { title: "swss_franc", currency: "CHF", value: "CHF" },
  { title: "uae_dirham", currency: "د.إ", value: "AED" },
  { title: "argentine_peso", currency: "AR$", value: "ARS" },
  { title: "bulgarian_lev", currency: "лв", value: "BGN" },
  { title: "canadian_dollor", currency: "C$", value: "CAD" },
  { title: "childean_peso", currency: "CL$", value: "CLP" },
  { title: "chiness_yuan", currency: "RMB¥", value: "CNY" },
  { title: "colombian_peso", currency: "COL$", value: "COP" },
  { title: "czech_koruna", currency: "Kč", value: "CZK" },
  { title: "danish_krone", currency: "DKK", value: "DKK" },
  { title: "egyptian_pound", currency: "E£", value: "EGP" },
  { title: "hongkong_dollar", currency: "HK$", value: "HKD" },
  { title: "croatian_kuna", currency: "kn", value: "HRK" },
  { title: "hungarian_forint", currency: "Ft", value: "HUF" },
];
