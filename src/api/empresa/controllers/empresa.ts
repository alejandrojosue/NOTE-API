/**
 * empresa controller
 */

import { factories } from '@strapi/strapi';
import { CustomError } from '../../../utils/CustomError';

export default factories.createCoreController('api::empresa.empresa', ({ strapi }) => ({
  async getBranches(ctx) {
    try {
      const user = ctx.params.user;
      const companyWithBranches = await strapi.service('api::empresa.empresa').getBranchesByUser({ user });
      ctx.body = {
        status: 'success',
        data: companyWithBranches,
      };
    } catch (error) {
      strapi.log.error('ERROR en getBranchesByUser:', error);
      
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
