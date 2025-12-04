export default [
  'strapi::logger',
  'strapi::errors',
   {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://qr.geranios.note.com'],   // <--- SOLO TU FRONTEND
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'User-Agent',
        'DNT',
        'Cache-Control',
        'X-Requested-With',
        'If-Modified-Since',
        'Keep-Alive',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  },
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
