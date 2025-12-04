export default {
  routes: [
    {
      method: 'POST',
      path: '/dashboard',
      handler: 'dashboard.getDashboardData',
      config: {
        policies: [],
      },
    },
  ],
};
