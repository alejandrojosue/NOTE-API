import type {Config as QRCodeConfig} from 'strapi-plugin-qr-code/dist/server/src/config'

module.exports = ({env}) => ({
  'qr-code': {
    enabled: true,
    config: {
      contentTypes: [{
        uid: 'api::producto.producto',
        computeValue: (uid, status, document) => {
          return `http://localhost:1337/api/${uid.split('.')[1]}s?documentId=${
              document.documentId}`
        },
      }],
    } satisfies QRCodeConfig,
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'NOTE Soporte <soporte.notehn@gmail.com>',
        defaultReplyTo: 'NOTE Soporte <soporte.notehn@gmail.com>',
      },
    },
  },
  // ...
});