export default {
  routes: [
    {
      method: 'GET',
      path: '/get-branches/:user',
      handler: 'empresa.getBranches',
      config: {
        policies: [],
      },
    },
  ],
};
