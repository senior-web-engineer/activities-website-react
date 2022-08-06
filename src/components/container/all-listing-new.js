import { Grid } from "@material-ui/core";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCategories } from "../../Store/action/categories";
import ListingCardGrid12 from "../content/element/card/card-listing-grid-12";
import ListingCardGrid6 from "../content/element/card/card-listing-grid-6";
import AllListingHeader from "./all-listing-header";
import AllListingSidebar from "./all-listing-sidebar";
// import { Pagination } from "../content/element/pagination";
// let autocomplete = null;

export default function Listing(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch("");
  const [filterList, setFilterList] = useState([]);
  const [categoryName, setCategoryName] = useState("all");
  const [lookingData, setLookingData] = useState("");
  const [location, setLocation] = useState("");
  const [load, setLoad] = useState(true);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);
  const [rating, setRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [headerType, setHeaderType] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({});
  const list = useSelector((state) => state?.list?.listing ?? []);
  // const [mQuery, setMQuery] = useState({
  //   matches: window.innerWidth < 959 ? true : false,
  // });
  // const [mobilteFilterOpen, setMobilteFilterOpen] = useState(true);
  // const setAll = () => {
  //   sessionStorage.removeItem("searchData");
  //   setFilterList(list);
  //   setLookingData("");
  //   setLocation("");
  //   setCategoryName("");
  // };

  // const mobileFilter = (e) => {
  //   $("#listing-top-banner").addClass("hidden");
  //   $("#footer").addClass("hidden");
  //   $("#listing-content").addClass("hidden");
  //   $("#listing-filter").removeClass("filter-hidden");
  //   $("#listing-title").addClass("hidden");
  // };

  const returnBack = (e) => {
    $("#listing-top-banner").removeClass("hidden");
    $("#footer").removeClass("hidden");
    $("#listing-content").removeClass("hidden");
    $("#listing-filter").addClass("filter-hidden");
    $("#listing-title").removeClass("hidden");
  };

  // const handlePlaceSelect = () => {
  //   let addressObject = autocomplete.getPlace();
  // 	console.log(addressObject, "addressObject")
  //   const address = addressObject.address_components;
  //   if (!addressObject.address_components) {
  //     toastr.info("Select location correctly!");
  //     return false;
  //   }
  //   const value = address[0].long_name.toLowerCase();
  //   setLocation(address[0].long_name);
  //   // setFilterList(prev => (prev??[])?.filte"cr((item) => item?.location?.toLowerCase()?.includes(value)))
  //   setFilterList((prev) =>
  //     (prev ?? [])?.filter((item) =>
  //       item?.location?.toLowerCase()?.includes(value)
  //     )
  //   );
  // };

  const handleChangSorting = (type) => {
    let newArr = [];
    switch (type) {
      case "high":
        newArr = filterList?.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
        setFilterList((prev) => newArr.slice());
        break;
      case "low":
        newArr = filterList?.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
        setFilterList((prev) => newArr.slice());
        break;
      case "a-z":
        newArr = filterList?.sort((a, b) => {
          const textA = a?.title ?? a?.company ?? "";
          const textB = b?.title ?? b?.company ?? "";
          if (textA.length < textB.length) return -1;
          if (textA.length > textB.length) return 1;
          return 0;
        });
        setFilterList((prev) => newArr.slice());
        break;
      case "z-a":
        newArr = filterList?.sort((a, b) => {
          const textA = a?.title ?? a?.company ?? "";
          const textB = b?.title ?? b?.company ?? "";
          if (textA < textB) return 1;
          if (textA > textB) return -1;
          return 0;
        });
        setFilterList((prev) => newArr.slice());
        break;
      default:
        setFilterList((prev) => list);
    }
  };
  // console.log(filterList, "filterList");
  const handleChangeLookingData = (value = "") => {
    setFilterOptions((prev) => ({ ...(prev ?? {}), title: value }));
    // setFilterList((prev) => {
    //   return value === ""
    //     ? list
    //     : (prev ?? [])?.filter((item) =>
    //         (item?.title ? item?.company ?? "" : "")
    //           ?.toLowerCase()
    //           .includes(value.toLowerCase())
    //       );
    // });
    setLookingData(value);
  };

  // filter by category
  const handleChangeCategory = (category = "") => {
    // e.preventDefault();
    setCategoryName(category);

    setFilterOptions((prev) => {
      console.log(prev, "prev");
      if (category === "All") {
        return { ...(prev ?? {}), category: "" };
      } else {
        return { ...(prev ?? {}), category: category };
      }
    });
    // setFilterList((prev) => {
    //   if (category !== "All") {
    //     return (list ?? [])?.filter((item) =>
    //       item?.category?.includes(category)
    //     );
    //   } else {
    //     return list;
    //   }
    // });
    // history.push(`/all-listings-grid/${category.replace(/ /g, "-")}`);
  };

  const handleChangePrice = (event, newValue) => {
    setMin(newValue[0]);
    setMax(newValue[1]);
    setFilterOptions((prev) => {
      if (newValue[0] === 0 && newValue[1] === 5000)
        return { ...(prev ?? {}), min: "", max: "" };
      if (newValue[0] === 0)
        return { ...(prev ?? {}), min: "", max: newValue[1] };
      if (newValue[1] === 5000)
        return { ...(prev ?? {}), max: "", min: newValue[0] };
      return {
        ...(prev ?? {}),
        min: newValue[0],
        max: newValue[1],
      };
    });
  };

  const handleOpenNow = () => {
    setOpenNow((prev) => !prev);
    setFilterOptions((prev) => ({ ...(prev ?? {}), openNow: !openNow }));
  };

  const handleChangeRating = (newValue = 0) => {
    setRating(newValue);
    setFilterOptions((prev) => {
      if (!Boolean(newValue)) {
        return { ...(prev ?? {}), rating: "" };
      } else {
        return { ...(prev ?? {}), rating: newValue };
      }
    });
  };

  const handleChangeLocation = (value = "") => {
    setLocation(value);
    setFilterOptions((prev) => ({ ...(prev ?? {}), location: value }));
  };

  // const searchDataFilter = (list = [], searchData = {}) => {
  //   setLookingData(searchData?.looking_data ?? "");
  //   setCategoryName(searchData?.category_name ?? "all");
  //   setLocation(searchData?.location ?? "");
  //   if (loadingCount === 1) {
  //     sessionStorage.removeItem("searchData");
  //   }
  // };

  const setFilterOptionsFuc = () => {
    const search = history?.location?.search ?? "";
    const filterItems = search?.split("?")?.[1]?.split("&") ?? [];
    let newFilterItems = {};
    if (filterItems.length > 0) {
      (filterItems ?? []).forEach((item) => {
        const key = item?.split("=")?.[0];
        const value = item?.split("=")?.[1];
        newFilterItems = { ...newFilterItems, ...{ [key]: value } };
      });
    }
    console.log(newFilterItems, "newFilterItems");
    setFilterOptions((prev) => newFilterItems);
    setLookingData(newFilterItems?.title?.replace(/-/g, " ") ?? "");
    setCategoryName(newFilterItems?.category?.replace(/-/g, " ") ?? "all");
    setLocation(newFilterItems?.location?.replace(/-/g, " ") ?? "");
    setRating(newFilterItems?.rating ?? 0);
    setOpenNow(newFilterItems?.openNow ?? false);
  };
  //set the new url
  const updateFilterUrl = () => {
    let updateUrl = "";
    if (Object.entries(filterOptions)?.length > 0 && !load) {
      Object.keys(filterOptions ?? {}).forEach((key) => {
        if (Boolean(filterOptions[key])) {
          if (key === "rating" || key === "min" || key === "max") {
            updateUrl += `${key}=${filterOptions[key]}&`;
          } else if (key === "openNow") {
            updateUrl += `openNow=${filterOptions[key]}&`;
          } else {
            updateUrl += `${key}=${filterOptions[key]
              ?.replace(/ /g, "-")
              ?.replace(/&/g, "")}&`;
          }
        }
      });
      updateUrl = updateUrl?.slice(0, updateUrl?.length - 1);
      window.history.pushState(
        null,
        null,
        `/all-listings-grid/search/activities${
          updateUrl.length > 0 ? `?${updateUrl}` : ""
        }`
      );
    }
  };
  //click filter button
  const handleSearchFilterAll = () => {
    filterActivitiesWithOptions();
  };
  //filter activities with url search options
  const filterActivitiesWithOptions = () => {
    let newItems = [];
    if (Object.keys(filterOptions)?.length > 0) {
      list.forEach((item) => {
        const flags = Object.keys(filterOptions).map((key) => {
          if (key === "rating") {
            return (
              Number(item?.[key] || 0) >= Number(filterOptions?.[key] || 0)
            );
          }
          if (key === "min") {
            return (
              Number(item?.price || 0) >= Number(filterOptions?.[key] || 0)
            );
          }
          if (key === "max") {
            return (
              Number(item?.price || 0) <= Number(filterOptions?.[key] || 5000)
            );
          }
          if (key === "openNow") {
            if (Boolean(filterOptions[key])) {
              const curDate = moment().unix();
              const openNowItem = (item?.sessions ?? []).filter(
                (session) =>
                  moment(session?.start_date).unix() - curDate < 86400 &&
                  moment(session?.start_date).unix() - curDate > 0
              );
              return openNowItem?.length > 0 ? true : false;
            } else {
              return true;
            }
          }
          return item?.[key]
            ?.replace(/&/g, "")
            .toLowerCase()
            .includes(
              filterOptions?.[key]
                ?.replace(/-/g, " ")
                ?.replace(/&/g, "")
                .toLowerCase()
            );
        });
        if (!flags.includes(false)) newItems.push(item);
      });
      setFilterList(newItems);
      if (loadingCount > 1) {
        setLoad(false);
      }
    } else {
      setFilterList((prev) => list);
      if (loadingCount > 1) {
        setLoad(false);
      }
    }
  };

  useEffect(() => {
    dispatch(getCategories());
    // setSearchData((prev) => searchInfo ?? {});
    setFilterOptionsFuc();
    // let mediaQuery = window.matchMedia("(max-width: 959px)");
    // mediaQuery.addListener(setMQuery);
    // // this is the cleanup function to remove the listener
    // return () => mediaQuery.removeListener(setMQuery);
    // let google = window.google;
    // autocomplete = new google.maps.places.Autocomplete(
    //   document.getElementById("autocomplete"),
    //   { types: ["(regions)"] }
    // );
    // autocomplete.addListener("place_changed", handlePlaceSelect);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateFilterUrl();
    filterActivitiesWithOptions();
    setLoadingCount((prev) => prev + 1);
    //eslint-disable-next-line
  }, [list, filterOptions]);

  return (
    <>
      <section className="all-listing-wrapper section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <AllListingHeader
                count={(filterList ?? [])?.length}
                headerType={headerType}
                handleChangeHeaderType={(type) => setHeaderType((prev) => type)}
                handleSorting={(type) => handleChangSorting(type)}
                // mobileFilter={mobilteFilterOpen}
              />
            </div>{" "}
            <div className="col-lg-12 listing-items">
              {/* <div className="row"> */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4}>
                  <AllListingSidebar
                    handleChangePrice={handleChangePrice}
                    handleLookingData={handleChangeLookingData}
                    handleCategory={handleChangeCategory}
                    handleLocation={handleChangeLocation}
                    openNow={openNow}
                    min={min}
                    max={max}
                    lookingData={lookingData}
                    categoryName={categoryName}
                    location={location}
                    handleOpenNow={handleOpenNow}
                    returnBack={returnBack}
                    rating={rating}
                    handleFilterAll={handleSearchFilterAll}
                    handleChangeRating={handleChangeRating}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                  <div className="order-lg-1 order-0" id="listing-content">
                    {load ? (
                      <div className="custom-loader">
                        <Loader
                          type="Oval"
                          color="#afdb30"
                          height={70}
                          width={70}
                        />
                      </div>
                    ) : filterList?.length > 0 ? (
                      !headerType ? (
                        <ListingCardGrid6 list={filterList} />
                      ) : (
                        <ListingCardGrid12 list={filterList} />
                      )
                    ) : (
                      <div className="col-lg-12">
                        <div className="alert alert-success" role="alert">
                          {t("data_not_find")}
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          {/* </div> */}
        </div>
      </section>
    </>
  );
}
