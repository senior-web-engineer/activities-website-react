const es2015 = require("babel-preset-es2015");
const presetReact = require("babel-preset-react");

require("babel-register")({
  presets: [es2015, presetReact],
});
// require("babel-register")({
//   presets: ["es2015", "react"],
// });

const router = require("./routerList").default;
const Sitemap = require("react-router-sitemap").default;

const db = require("../src/services/firebase");

function generateSitemap() {
  let data = [];
  db.collection("ad_listing")
    .where("status", "<", "2")
    .onSnapshot(async (res) => {
      let listing = res.docs.map((doc) => doc.data());
      listing = listing.filter((item) => item.advertiser_id !== "");
      await Promise.all(
        listing.map(async (item, index) => {
          let res = await db
            .collection("advertiser")
            .doc(item.advertiser_id)
            .get();
          const userData = res.data();
          // let location = "";
          data.push({
            city:
              item.address.city !== ""
                ? item.address.city
                : item.address.state !== ""
                ? item.address.state
                : null,
            category: item.category_name,
            advertiserName: userData.name,
            activityName: item.ad_title,
          });

          // parseAddress(item.address, function (error, addressObj) {
          //   console.log(addressObj, "addressObj");

          //   const address = {
          //     city: addressObj.city,
          //     state: addressObj.state,
          //   };
          //   const { city, state } = address;
          //   location = city === null ? state : city;
          //   data.push({
          //     city: location,
          //     category: item.category_name,
          //     advertiserName: userData.name,
          //     activityName: item.ad_title,
          //   });
          //   // console.log(data, "before");
          // });
        })
      );
      const paramsConfig = {
        "/listing-details/:city/:category/:advertiserName/:activityName": data,
      };
      console.log("Okay");
      return new Sitemap(router)
        .applyParams(paramsConfig)
        .build("https://www.activities.app/")
        .save("./public/sitemap.xml");
    });
}

generateSitemap();
