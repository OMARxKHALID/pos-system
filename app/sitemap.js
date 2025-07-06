export default function sitemap() {
  const baseUrl = "http://localhost:3000";

  // Main pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Admin protected routes
  const adminRoutes = [
    "/admin/dashboard",
    "/admin/menu",
    "/admin/category",
    "/admin/orders",
    "/admin/users",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // API routes (for documentation purposes)
  const apiRoutes = [
    "/api/auth",
    "/api/categories",
    "/api/menu",
    "/api/orders",
    "/api/users",
    "/api/dashboard",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.3,
  }));

  return [...routes, ...adminRoutes, ...apiRoutes];
}
