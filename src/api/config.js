import axios from 'axios';
import LocalStorageServices, { STORAGE_KEYS } from '../helpers/LocalStorageServices';

export const API_URL = 'https://apiw1.sunny.solutions';
export const IMAGE_URL = 'https://sunny-cloud.sfo3.cdn.digitaloceanspaces.com/';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (params) => {
    if (params._retry) {
      return params;
    }
    const accessToken = LocalStorageServices.getItem(STORAGE_KEYS.accessToken);
    if (accessToken) {
      params.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(params.method.toUpperCase(), params.url);
    return params;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const oldRefreshToken = LocalStorageServices.getItem(STORAGE_KEYS.refreshToken);
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: oldRefreshToken,
          });
          const { accessToken, refreshToken } = data;

          LocalStorageServices.setItem(STORAGE_KEYS.accessToken, accessToken);
          LocalStorageServices.setItem(STORAGE_KEYS.refreshToken, refreshToken);

          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          resolve(api(originalRequest));
        } catch (e) {
          processQueue(e, null);
          reject(e);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  },
);
