import {factories} from '@strapi/strapi';
import {CustomError} from '../../../utils/CustomError';

export default factories.createCoreController(
    'api::sistema.sistema',
    ({strapi}) => ({
      async sendEmail(ctx) {
        try {
          const data = ctx.request.body;
              await strapi.service('api::sistema.sistema').sendEmail(data);
          ctx.body = {
            status: 'success',
            data: {},
          };
        } catch (error) {
          strapi.log.error('ERROR en sendEmail:', error);

          if (error instanceof CustomError) {
            ctx.status = error.status;
            ctx.body = {
              status: 'error',
              message: error.message,
            };
          } else {
            ctx.status = 500;
            ctx.body = {
              status: 'error',
              message: 'Ha ocurrido un error inesperado.',
            };
          }
        }
      },
    }));
