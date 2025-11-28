import {factories} from '@strapi/strapi';
import {CustomError} from '../../../utils/CustomError';

export default factories.createCoreController(
    'api::factura.factura',
    ({strapi}) => ({
      async createVenta(ctx) {
        try {
          const data = ctx.request.body;

          // Llamar al servicio que maneja toda la transacción
          const factura =
              await strapi.service('api::factura.factura').createVenta(data);

          ctx.body = {
            status: 'success',
            data: factura,
          };
        } catch (error) {
          strapi.log.error('ERROR en createVenta:', error);

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
