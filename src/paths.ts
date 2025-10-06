// Centralized application route paths
export const paths = {
  root: '/',
  login: '/login',

  // User
  dashboard: '/dashboard',
  leads: '/leads',
  visits: '/visits',
  users: '/users',
  userDetail: (id: string | number) => `/users/${id}`,

  // Admin
  admin: '/admin',
  adminVisits: '/admin/visits',

  // Catalog
  vendors: '/vendors',
  products: '/products',

  // Misc
  analytics: '/analytics',
  settings: '/settings',
} as const;

export type AppPathKey = keyof typeof paths;
