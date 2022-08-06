import loadable from "@loadable/component";
import LinearProgress from "@material-ui/core/LinearProgress";
import AllPagePopup from "components/content/element/allPagePopup";
import { createBrowserHistory } from "history";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { Route, Router, Switch } from "react-router-dom";
import loadingImg from "../assets/img/logo-white.jpg";

export const LoadingPage = () => {
  return (
    <div
      className="w-100 bg-dark d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <img
        src={loadingImg}
        alt=""
        className="mb-4"
        style={{ width: "250px" }}
      />
      <div className="loading-spinner">
        <LinearProgress />
      </div>
    </div>
  );
};

const Index = loadable(() => import("./page"), {
  fallback: <LoadingPage />,
});
const SignIn = loadable(() => import("./page/sign-in"), {
  fallback: <LoadingPage />,
});
const About = loadable(() => import("./page/about"), {
  fallback: <LoadingPage />,
});
const AddActivities = loadable(() => import("./page/add-activities"), {
  fallback: <LoadingPage />,
});
const AdvertiserTerms = loadable(() => import("./page/advertiser-terms"), {
  fallback: <LoadingPage />,
});
const AllBlogGrid = loadable(() => import("./page/all-blog-grid"), {
  fallback: <LoadingPage />,
});
// const AllListingGrid = loadable(() => import("./page/all-listing-grid"), {
//   fallback: <LoadingPage />,
// });
const AllListingGridNew = loadable(
  () => import("./page/all-listing-grid-new"),
  {
    fallback: <LoadingPage />,
  }
);
const AllListingList = loadable(() => import("./page/all-listing-list"), {
  fallback: <LoadingPage />,
});
const ApiDocument = loadable(() => import("./page/api-document"), {
  fallback: <LoadingPage />,
});
const ApiKeyManagement = loadable(() => import("./page/apikey-management"), {
  fallback: <LoadingPage />,
});
const BlogDetails = loadable(() => import("./page/blog-details"), {
  fallback: <LoadingPage />,
});
const Cart = loadable(() => import("./page/cart"), {
  fallback: <LoadingPage />,
});
const Chat = loadable(() => import("./page/chat"), {
  fallback: <LoadingPage />,
});
const CheckoutBasic = loadable(() => import("./page/checkout"), {
  fallback: <LoadingPage />,
});
const AdvertiserDashboard = loadable(() => import("./page/dashboard"), {
  fallback: <LoadingPage />,
});
const EmailMarketing = loadable(() => import("./page/email-marketing"), {
  fallback: <LoadingPage />,
});
const Faq = loadable(() => import("./page/faq"), {
  fallback: <LoadingPage />,
});
const Forgot = loadable(() => import("./page/forgot-password"), {
  fallback: <LoadingPage />,
});
const ListingDetails = loadable(() => import("./page/listing-details"), {
  fallback: <LoadingPage />,
});
const ListingCSVDetails = loadable(
  () => import("./page/listing-details-csv-new"),
  {
    fallback: <LoadingPage />,
  }
);
const MerchantInfo = loadable(() => import("./page/merchant"), {
  fallback: <LoadingPage />,
});
const MerchantInfoDetail = loadable(() => import("./page/merchant-detail"), {
  fallback: <LoadingPage />,
});
const Notification = loadable(() => import("./page/notification"), {
  fallback: <LoadingPage />,
});
const OrderDetail = loadable(() => import("./page/order-detail"), {
  fallback: <LoadingPage />,
});
const Press = loadable(() => import("./page/Press"), {
  fallback: <LoadingPage />,
});
const PressAll = loadable(() => import("./page/press-all"), {
  fallback: <LoadingPage />,
});
const PressDetail = loadable(() => import("./page/press-detail"), {
  fallback: <LoadingPage />,
});
const PricingPlan = loadable(() => import("./page/pricing-plan"), {
  fallback: <LoadingPage />,
});
const Privacy = loadable(() => import("./page/privacy"), {
  fallback: <LoadingPage />,
});
const Actions = loadable(() => import("./page/profile/actions"), {
  fallback: <LoadingPage />,
});
const WithdrawActivity = loadable(
  () => import("./page/profile/WithdrawActivity"),
  {
    fallback: <LoadingPage />,
  }
);
const BoostAds = loadable(() => import("./page/profile/boost-ads"), {
  fallback: <LoadingPage />,
});
const BusinessProfile = loadable(
  () => import("./page/profile/business-profile"),
  {
    fallback: <LoadingPage />,
  }
);
const EditAccount = loadable(() => import("./page/profile/edit-account"), {
  fallback: <LoadingPage />,
});
const InsuranceInformation = loadable(
  () => import("./page/profile/insurance-info"),
  {
    fallback: <LoadingPage />,
  }
);
// const BookNow = loadable(() => import("./page/book-panel"), {
//   fallback: <LoadingPage />,
// });
const managePlan = loadable(() => import("./page/profile/manager-plan"), {
  fallback: <LoadingPage />,
});
const MyActivities = loadable(() => import("./page/profile/my-activities"), {
  fallback: <LoadingPage />,
});
const MyCalendar = loadable(() => import("./page/profile/my-calendar"), {
  fallback: <LoadingPage />,
});
const MyFavorite = loadable(() => import("./page/profile/my-favorite"), {
  fallback: <LoadingPage />,
});
const MyOrders = loadable(() => import("./page/profile/my-orders"), {
  fallback: <LoadingPage />,
});
const NotificationSetting = loadable(
  () => import("./page/profile/notification-setting"),
  {
    fallback: <LoadingPage />,
  }
);
const PaymentInformation = loadable(
  () => import("./page/profile/payment-infomation"),
  {
    fallback: <LoadingPage />,
  }
);
const ProviderInformation = loadable(
  () => import("./page/profile/provider-information"),
  {
    fallback: <LoadingPage />,
  }
);
const staffManagement = loadable(
  () => import("./page/profile/staff-management"),
  {
    fallback: <LoadingPage />,
  }
);
const Questionnaire = loadable(() => import("./page/questionnaire"), {
  fallback: <LoadingPage />,
});
const SignInAdvertiser = loadable(() => import("./page/sign-in-advertiser"), {
  fallback: <LoadingPage />,
});
const SignUp = loadable(() => import("./page/sign-up"), {
  fallback: <LoadingPage />,
});
const SignUpClaim = loadable(() => import("./page/sign-up-claim"), {
  fallback: <LoadingPage />,
});
const SignUpAdvertiser = loadable(() => import("./page/sign-up-advertiser"), {
  fallback: <LoadingPage />,
});
const Support = loadable(() => import("./page/support"), {
  fallback: <LoadingPage />,
});
const SupportHome = loadable(() => import("./page/support-home"), {
  fallback: <LoadingPage />,
});
const TermsConditions = loadable(() => import("./page/TermsConditions"), {
  fallback: <LoadingPage />,
});
const Thankyou = loadable(() => import("./page/thankyou"), {
  fallback: <LoadingPage />,
});
const VerifyEmailCheck = loadable(() => import("./page/verify-email-check"), {
  fallback: <LoadingPage />,
});
const BrandMobileApp = loadable(() => import("./page/brand-app"), {
  fallback: <LoadingPage />,
});
// const ActivityCategoryList = loadable(() => import("./page/category-list"), {
//   fallback: <LoadingPage />,
// });
const ReSignUpAdvertiser = loadable(
  () => import("./page/re-sign-up-advertiser"),
  {
    fallback: <LoadingPage />,
  }
);
const GrowListLandingPage = loadable(
  () => import("components/content/element/list-landing-page"),
  {
    fallback: <LoadingPage />,
  }
);

export const history = createBrowserHistory();

const RequireAuth = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    return children;
  }
  return <Redirect to="/sign-in" />;
};

function App(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.app?.isLoading ?? true);
  const [open, setOpen] = useState(true);
  const ignorePages = [
    "listings",
    "/listing-details",
    "/grow-activity",
    "/edit-account",
    "/sign-up-advertiser",
    "/sign-up",
    "/sign-in",
    "/sign-in-advertiser",
    "/privacy-policy",
    "/forgot-password",
    "/provider-terms-conditions",
    "/terms-conditions",
    "/insurance-info",
    "/business-profile",
    "/advertiser-dashboard",
    "/my-activities",
    "/boost-ads",
    "/manage-plan",
    "/payment-information",
    "/notification-setting",
    "/staff-management",
    "/email-marketing",
    "/accesskey-management",
    "/guide-document",
    "/support-home",
    "/add-activities",
    "/notification-list",
    "/chat",
    "/my-calendar",
    "/my-favorite",
    "/my-orders",
    "/payment-information",
    "/notification-setting",
    "/support-home",
    "/notification-list",
    "/chat",
  ];

  const setloading = (value = false) =>
    dispatch({ type: "SET_APP", payload: { isLoading: value ?? false } });

  useEffect(() => {
    demoAsyncCall().then(() => setloading(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const pathname = history?.location?.pathname ?? "";
    const checkpage = ignorePages
      .map((item) => pathname?.includes(item))
      .includes(true);
    if (checkpage) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    return history.listen((location) => {
      setloading(true);
      demoAsyncCall().then(() => setloading(false));
      const pathname = location?.pathname ?? "";
      const checkpage = ignorePages
        .map((item) => pathname?.includes(item))
        .includes(true);
      if (checkpage) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <Router basename={process.env.PUBLIC_URL} history={history}>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route
              exact
              path="/all-listings-grid/:categoryname"
              component={AllListingGridNew}
            />
            <Route
              exact
              path="/all-listings-grid/search/:activities/"
              component={AllListingGridNew}
            />
            {/* <Route path="/all-listings-grid" component={AllListingGrid} /> */}
            <Route path="/all-listings-list" component={AllListingList} />
            <Route path="/merchant-support" component={MerchantInfo} />
            <Route
              path="/merchant-support-detail/:question"
              component={MerchantInfoDetail}
            />
            <Route
              path="/listing-details/:city/:category/:advertiserName/:activityName/:activityId"
              component={ListingDetails}
            />
            <Route
              exact={true}
              path="/listing-details/:city/:category/:companyName"
              component={ListingCSVDetails}
            />
            <Route path="/faqs" component={Faq} />
            <Route path="/about" component={About} />
            <Route path="/checkout" component={CheckoutBasic} />
            <Route path="/cart" component={Cart} />
            <Route path="/blog-grid-list" component={AllBlogGrid} />
            <Route path="/blog-details/:title" component={BlogDetails} />
            <Route path="/privacy-policy" component={Privacy} />
            <Route path="/terms-conditions" component={TermsConditions} />
            <Route
              path="/provider-terms-conditions"
              component={AdvertiserTerms}
            />
            <Route path="/forgot-password" component={Forgot} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-in-advertiser" component={SignInAdvertiser} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-up-claim" component={SignUpClaim} />
            <Route path="/sign-up-advertiser" component={SignUpAdvertiser} />
            <Route
              path="/confirm-provider-information"
              component={ReSignUpAdvertiser}
            />
            <Route path="/pricing-plans" component={PricingPlan} />
            <Route path="/action" component={Actions} />
            <Route path="/support" component={SupportHome} />
            <Route path="/verify-email-check" component={VerifyEmailCheck} />
            <Route
              path="/questionnaire/:id/:userid"
              component={Questionnaire}
            />
            <Route path="/press" component={Press} />
            <Route path="/press-all" component={PressAll} />
            <Route path="/press-release/:title" component={PressDetail} />
            <Route
              path="/new-providers-information"
              component={ProviderInformation}
            />
            <Route
              path="/personaliezed-mobile-app"
              component={BrandMobileApp}
            />
            <Route
              path="/grow-activity"
              exact={true}
              component={GrowListLandingPage}
            />
            <RequireAuth>
              <Route path="/add-activities" component={AddActivities} />
              <Route path="/my-activities" component={MyActivities} />
              <Route path="/order-detail/:id" component={OrderDetail} />
              <Route path="/staff-management" component={staffManagement} />
              <Route path="/boost-ads" component={BoostAds} />
              <Route path="/manage-plan" component={managePlan} />
              <Route path="/business-profile" component={BusinessProfile} />
              {/* <Route path="/balance-withdraw" component={BalanceWithdraw} /> */}
              <Route
                path="/balance-withdraw/:listingId"
                component={WithdrawActivity}
              />
              <Route path="/insurance-info" component={InsuranceInformation} />
              <Route path="/notification-list" component={Notification} />
              <Route path="/support-home" component={Support} />
              <Route path="/chat" component={Chat} />
              <Route path="/my-orders" component={MyOrders} />
              <Route path="/thankyou" component={Thankyou} />
              <Route path="/edit-account" component={EditAccount} />
              <Route path="/my-calendar" component={MyCalendar} />
              <Route path="/my-favorite" component={MyFavorite} />
              <Route
                path="/accesskey-management"
                component={ApiKeyManagement}
              />
              <Route path="/email-marketing" component={EmailMarketing} />
              <Route
                path="/advertiser-dashboard"
                component={AdvertiserDashboard}
              />
              <Route
                path="/payment-information"
                component={PaymentInformation}
              />
              <Route path="/guide-document" component={ApiDocument} />
              <Route
                path="/notification-setting"
                component={NotificationSetting}
              />
            </RequireAuth>
          </Switch>
          <AllPagePopup open={open} onClose={() => setOpen(false)} />
        </>
      )}
    </Router>
  );
}
export default App;

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 1000));
}
