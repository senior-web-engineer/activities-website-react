import React, { useEffect, Fragment } from "react";
const Loading = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./assets/js/bundle-0c6e0e19e1.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <Fragment>
      <div>Loading....</div>
    </Fragment>
  );
};
export default Loading;
