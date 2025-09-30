import { createAxiosClient } from "./axiosConfig";
import { jwtDecode } from "jwt-decode";
type AppJwtClaims = {
  id?: number;
  name?: string;
  userType?: string;
  roll?: string;
  email_id?: string;
  profileImage?: string;
  coverImage?: string;
  lastName?: string;
  createdAt?: string;
  followers?: number;
  following?: number;
};

const BASE_URL = "http://localhost:5000/api/v1/";

export function getCurrentAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isLoggedIn() {
  if (localStorage.getItem("accessToken")) {
    return true;
  } else {
    return false;
  }
}

export async function logout() {
  localStorage.clear();
  window.location.href = "/login";
  return 0;
}

export function setCurrentAccessToken(accessToken:any) {
  return localStorage.setItem("accessToken", accessToken);
}

export function getUserName() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode<AppJwtClaims>(token);
    // console.log("user Details bro!=",decoded)
    return decoded.name || "";
  } else {
    return "";
  }
}

export function getUserId() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode<AppJwtClaims>(token);
    return decoded.id || 0;
  } else {
    return 0;
  }
}

export function getUserType() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode<AppJwtClaims>(token);
    return decoded.userType || "";
  } else {
    return "";
  }
}

export function getUserRoll() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode<AppJwtClaims>(token);
    // console.log(decoded);
    return decoded.roll || "";
  } else {
    return "";
  }
}

export function getUserEmail() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode<AppJwtClaims>(token);
    return decoded.email_id || "";
  } else {
    return "";
  }
}

export function getUserDetails() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    try {
      let res = jwtDecode<AppJwtClaims>(token);
      return {
        profileImage: res.profileImage,
        email: res.email_id,
        coverImage: res.coverImage,
        firstName: res.name,
        lastName: res.lastName,
        createdAt: res.createdAt,
        followers: res.followers,
        following: res.following,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  } else {
    return null;
  }
}

export const client = createAxiosClient({
  options: {
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {},
  },
  getCurrentAccessToken,
});
