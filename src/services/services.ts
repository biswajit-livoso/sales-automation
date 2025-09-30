import { client } from "./axiosClient";

export function register(payLoad:any) {
    return client.post("/auth/register", payLoad);
  }
export function login(payLoad:any) {
    return client.post("/auth/login", payLoad);
  }
export function me() {
    return client.get("/users/me");
  }
export function allUsers() {
    return client.get("/users/admin");
  }