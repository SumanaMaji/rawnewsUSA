import axios from "axios";
import { Environment } from "../../utils/environment";
import { apiStart, apiEnd, accessDenied, apiError } from "redux/actions/common";
import { refreshAccessToken } from "azure/MsalFunctions";

export default function apiCall(
  url,
  method,
  dispatch,
  data = {},
  onSuccess = () => {},
  onFailure = () => {},
  label,
  headers = {}
) {
  // axios default configs
  axios.defaults.baseURL = Environment.BASE_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  //axios.defaults.headers.common["Authorization"] = getAccessToekn();

  if (label) {
    dispatch(apiStart(label));
  }

  axios
    .request({
      url,
      method,
      headers,
      data,
    })
    .then((response) => {
      dispatch(onSuccess(response));
    })
    .catch((error) => {
      dispatch(onFailure(error));

      if (error.response && error.response.status === 403) {
        dispatch(accessDenied(window.location.pathname));
      }
    })
    .finally(() => {
      if (label) {
        dispatch(apiEnd(label));
      }
    });
}

// declare a request interceptor
axios.interceptors.request.use(
  async (config) => {
    // perform a task before the request is sent
    // console.info(
    //   `API CALL[${config.method}]:${config.baseURL}${config.url} , DATA: ${config.data}`
    // );
    const token = await  refreshAccessToken(); //getAccessToekn();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // handle the error
    console.error(`API CALL ERROR : ${error}`);
    return Promise.reject(error);
  }
);

// declare a response interceptor
axios.interceptors.response.use(
  (response) => {
    // do something with the response data
    //console.info("API RESPONSE");
   // console.info(response.data);
    return response;
  },
  (error) => {
    // handle the error
    console.error(`API CALL ERROR : ${error}`);
    // handle the response error
    return Promise.reject(error);
  }
);

const getAccessToekn = () => {
  const tokenObjeect = localStorage.getItem("access_token");
  debugger;
  // JSON.parse(
  //   localStorage.getItem(
  //     "601dd866-c33e-4178-b42c-64a2ef294ee9.6ce6bce5-e99a-47c5-b068-13f6bbaa2f0d-login.windows.net-accesstoken-b87bddfc-188f-46f0-a93f-c582bacf71c6-6ce6bce5-e99a-47c5-b068-13f6bbaa2f0d-api://b87bddfc-188f-46f0-a93f-c582bacf71c6/user_impersonation"
  //   )
  // );
  if (tokenObjeect) {
    return `Bearer ${tokenObjeect.secret}`;
  }

  console.error("✉️ ", "Access toekn not found. Redirected to home page");

};
