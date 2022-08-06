import React from "react";
import { Switch, Route } from "react-router";

export default (
  <Switch>
    <Route exact path="/" />
    <Route path="/all-listings-grid" />
    <Route path="/all-listings-list" />
    <Route path="/merchant-support" />
    {/* <Route path="/merchant-support-detail/:question" /> */}
    <Route path="/listing-details/:city/:category/:advertiserName/:activityName/:activityId" />
    <Route path="/faqs" />
    <Route path="/about" />
    <Route path="/checkout" />
    <Route path="/cart" />
    <Route path="/blog-grid-list" />
    {/* <Route path="/blog-details/:title" /> */}
    <Route path="/privacy-policy" />
    <Route path="/terms-conditions" />
    <Route path="/provider-terms-conditions" />
    <Route path="/forgot-password" />
    <Route path="/sign-in" />
    <Route path="/sign-in-advertiser" />
    <Route path="/sign-up" />
    <Route path="/sign-up-advertiser" />
    <Route path="/pricing-plans" />
    <Route path="/action" />
    <Route path="/support" />
    <Route path="/verify-email-check" />
    {/* <Route path="/questionnaire/:id/:userid" /> */}
    <Route path="/press" />
    <Route path="/press-all" />
    {/* <Route path="/press-release/:title" /> */}
    <Route path="/add-activities" />
    <Route path="/my-activities" />
    {/* <Route path="/order-detail/:id" /> */}
    <Route path="/staff-management" />
    <Route path="/boost-ads" />
    <Route path="/manage-plan" />
    <Route path="/business-profile" />
    {/* <Route path="/balance-withdraw" /> */}
    <Route path="/insurance-info" />
    <Route path="/notification-list" />
    <Route path="/support-home" />
    <Route path="/chat" />
    <Route path="/my-orders" />
    <Route path="/thankyou" />
    <Route path="/edit-account" />
    <Route path="/my-calendar" />
    <Route path="/my-favorite" />
    <Route path="/accesskey-management" />
    <Route path="/email-marketing" />
    <Route path="/advertiser-dashboard" />
    <Route path="/payment-information" />
    <Route path="/guide-document" />
    <Route path="/notification-setting" />
  </Switch>
);
