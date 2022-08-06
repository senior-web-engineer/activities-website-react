export const sendInBlueAPI = {
  // send blue API
  baseUrl: "https://api.sendinblue.com/v3",
  emailAPIKey:
    "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",
};

export const IS_SAFARI = window.navigator.userAgent.indexOf("Safari") > 0;

export const appDomain = "https://www.activities.app/";

export const corsAnywhere = "https://blooming-wildwood-02009.herokuapp.com/";

export const settings = {
  dots: false,
  infinite: true,
  speed: 100,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
