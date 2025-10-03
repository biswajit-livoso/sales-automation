import { client } from "./axiosClient";

export function register(payLoad: any) {
  return client.post("/auth/register", payLoad);
}
export function login(payLoad: any) {
  return client.post("/auth/login", payLoad);
}
export function me() {
  return client.get("/users/me");
}
export function allUsers() {
  return client.get("/users/admin");
}
export function addVendor(payload: any) {
  return client.post("/vendors", payload);
}
export function getAllVendors() {
  return client.get("/vendors");
}
export function updateVendor(id: string, payload: any) {
  return client.post(`/vendors/${id}`, payload);
}
export function deleteVendor(id: string) {
  return client.delete(`/vendors/${id}`);
}
export function getVendor(id: string) {
  return client.get(`/vendors/${id}`);
}
export function addProduct(payload: any) {
  return client.post("/products", payload);
}
export function getAllProducts() {
  return client.get("/products");
}
export function updateProduct(id: string, payload: any) {
  return client.post(`/products/${id}`, payload);
}
export function deleteProduct(id: string) {
  return client.delete(`/products/${id}`);
}
export function getProduct(id: string) {
  return client.get(`/products/${id}`);
}
export function createVisit(payload: any) {
  return client.post(`/visits/start`, payload);
}
export function currentVisit() {
  return client.get(`/visits/ongoing`);
}
export function closeVisit(id: string, payload: any) {
  return client.post(`/visits/end/${id}`, payload);
}
export function myVisits() {
  return client.get(`/visits/me/v`);
}
