import axios from "axios";

export const setGeneralLoading = (
  dispatch = console.log("no dispatch"),
  value = false
) => {
  dispatch({ type: "SET_APP", payload: { isLoading: value ?? false } });
};

export const setAppPromptSetting = (dispatch, value = false) => {
  dispatch({ type: "SET_APP_PROMPT", payload: { appPrompt: value ?? false } });
};

export const setPageLoading = (
  dispatch = console.log("no dispatch"),
  value = false
) => {
  dispatch({
    type: "SET_PAGE_LOADING",
    payload: { isPageLoading: value ?? false },
  });
};

export const setCurrency = (
  dispatch = console.log("no dispatch"),
  value = {}
) => {
  dispatch({ type: "SET_CURRENCY", payload: { currency: value } });
};

export const setLanguage = (
  dispatch = console.log("no dispatch"),
  value = {}
) => {
  dispatch({ type: "SET_LANGUAGE", payload: { language: value } });
};

export const getPriceOfCurrency = (
  currency = "USD",
  userCurrency = "USD",
  amount,
  params
) => {
  // console.log(params, currency, userCurrency, amount);
  if (currency.toUpperCase() !== userCurrency.toUpperCase()) {
    const config = {
      method: "get",
      url: "https://fixer-fixer-currency-v1.p.rapidapi.com/convert?from=USD&to=EUR&amount=120",
      headers: {
        "x-rapidapi-key": "3c0631026bmsh2edcdb75bfc4c61p1a87dbjsn8ec559ca56be",
        "x-rapidapi-host": "fixer-fixer-currency-v1.p.rapidapi.com",
        useQueryString: "true",
      },
      params: {
        from: currency,
        to: userCurrency.toUpperCase(),
        amount: amount,
      },
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then((res) => {
          if (res.data.success) {
            resolve(Number(parseFloat(res.data.result).toFixed(1)));
          } else {
            resolve(Number(amount));
          }
        })
        .catch((error) => {
          resolve(Number(amount));
        });
    });
  } else {
    return Number(amount);
  }
};

export const SortByData = (data = [], field) => {
  data.sort((a, b) => {
    return a.field - b.field;
  });
  return data;
};
