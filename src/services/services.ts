import { client } from "./axiosClient";

export function register(payLoad: any) {
  return client.post("/auth/register", payLoad);
}
export function updateUser(id: string, payLoad: any) {
  return client.patch(`/auth/register/${id}`, payLoad);
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
export function addParty(payload: any) {
  return client.post("/parties", payload);
}
export function getAllParties() {
  return client.get("/parties");
}
export function updateParty(id: string, payload: any) {
  return client.post(`/parties/${id}`, payload);
}
export function deleteParty(id: string) {
  return client.delete(`/parties/${id}`);
}
export function getParty(id: string) {
  return client.get(`/parties/${id}`);
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
export function updateVisit(id: string, payload: any) {
  return client.post(`/visits/update/${id}`, payload);
}
export function getAllVisits() {
  return client.get(`/visits/admin`);
}
export function getVisitsToday() {
  return client.get(`/visits/today/admin`);
}
export function getCategories() {
  return client.get(`/categories`);
}
export function addCategory(payload: any) {
  return client.post(`/categories`, payload);
}
export function addPurchase(payload: any) {
  return client.post(`/purchases`, payload);
}
export function updatePurchase(id: string, payload: any) {
  return client.post(`/purchases/${id}`, payload);
}
export function allPurchase() {
  return client.get(`/purchases`);
}
