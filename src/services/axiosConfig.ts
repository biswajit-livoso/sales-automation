import axios from "axios";
import { logout } from "./axiosClient";
import { decryptResponse } from "./utils";

export function createAxiosClient({ options, getCurrentAccessToken }: any) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      const token = getCurrentAccessToken();
      if (token) {
        config.headers.token = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      try {
        decryptResponse(response); // just call this; it mutates the response
        return response;
      } catch (decryptionError) {
        console.error("Decryption error:", decryptionError);
        throw new Error("Failed to decrypt response");
      }
    },
    async (error) => {
      console.log("Axios error:", error);
      if (error.response === undefined) {
        alert("Internet failure or server disconnected");
        return Promise.reject(error);
      } else if (error.response.status === 401) {
        logout();
        return axios(error.config);
      }
      return Promise.reject(error);
    }
  );

  return client;
}
