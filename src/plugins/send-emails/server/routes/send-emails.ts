import { sendPromotion } from '../controllers/mail';

export default [
  {
    method: 'POST',
    path: '/send-promotion',  // → /api/send-emails/send-promotion
    handler: sendPromotion,
    config: {
      auth: true, // true si quieres login
      policies: [],
    },
  },
];
