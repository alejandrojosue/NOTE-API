import {factories} from '@strapi/strapi';
import {CustomError} from '../../../utils/CustomError';

export default factories.createCoreController('api::empresa.empresa', ({strapi}) => ({
  async getDashboardData(ctx) {
   try {
    const data = ctx.request.body;
    const dashboardData = await strapi
      .service('api::empresa.empresa')
      .getDashboardData(data);

    ctx.body = {
      status: 'success',
      data: dashboardData,
    };
   } catch (error) {
    strapi.log.error('ERROR en getDashboardData:', error);

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
  }
}));