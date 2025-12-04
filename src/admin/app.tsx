import type { StrapiApp } from '@strapi/strapi/admin';
import * as Icons from '@strapi/icons';
export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    translations: {
      es: {
        'Auth.form.welcome.title': 'Bienvenido a NOTE',
        'Auth.form.welcome.subtitle': 'El corazón de tu gestión electrónica',
        'Auth.form.email.label': 'Correo electrónico',
        'Auth.form.password.label': 'Contraseña',
        'Auth.form.login.button': 'Iniciar sesión',
      }
    },
  },
  bootstrap(app: StrapiApp) {
    app.addMenuLink({
      to: '/admin/audits', // o una URL externa
      icon: Icons.ClockCounterClockwise, // ícono de @strapi/icons
      intlLabel: {
        id: 'audit.menu.title',
        defaultMessage: 'Auditoría',
      },
      // Component: async () => import('./pages/AuditoriasPage/index'),
      Component: async () => import('./pages/auditPage'),
      permissions: [{ action: 'plugin::content-manager.explorer.read', subject: 'api::audit.audit' }],
    });

    app.addMenuLink({
      to: '/send-emails',               // ruta en el admin
      icon: Icons.Mail,                // icono de @strapi/icons
      intlLabel: {
        id: 'send-emails.plugin.name',
        defaultMessage: 'Enviar Correos',
      },
      Component: async () => import('../plugins/send-emails/admin/pages/SendEmailsPage'), // tu página
      permissions: [],                  // permisos opcionales
    });

    const cmPlugin = app.getPlugin('content-manager');
    if (!cmPlugin) {
      console.warn('No se encontró el plugin content-manager');
      return;
    }
  },
};

