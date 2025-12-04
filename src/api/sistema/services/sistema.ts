/**
 * sistema service
 */

import {factories} from '@strapi/strapi';

import {CustomError} from '../../../utils/CustomError';

export default factories.createCoreService(
    'api::sistema.sistema',
    ({strapi}) => ({
      async sendEmail(data) {
        // Aquí iría la lógica para enviar el correo electrónico
        // Por ejemplo, usando un servicio de terceros o SMTP

        if (!data?.subject || !data?.message) {
          throw new CustomError('Asunto y mensaje son obligatorios', 400);
        }

        const {subject, message} = data as {
          subject: string;
          message: string
        };

        const users =
            await strapi.db.query('plugin::users-permissions.user').findMany({
              select: ['email', 'username'],
              where: {
                email: {
                  $ne: 'notiene@notiene.com',
                },
              },
            });

        let emailsSent = 0;
        for (const user of users) {
          await strapi.plugin('email').service('email').send({
            to: user.email,
            subject,
            text: message,
            html: `<div style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
                   <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:auto;background:white;border-radius:8px;overflow:hidden;">
                     <tr>
                       <td style="background:#2563eb;padding:20px;text-align:center;color:white;">
                         <h1 style="margin:0;font-size:24px;">{{title}}</h1>
                       </td>
                     </tr>

                     <tr>
                       <td style="padding:30px;">
                         <p style="font-size:16px;color:#333;line-height:24px;margin:0 0 20px 0;">
                           Hola,
                         </p>

                         <p style="font-size:16px;color:#333;line-height:24px;margin:0 0 20px 0;">
                           {{message}}
                         </p>

                         <div style="text-align:center;margin:30px 0;">
                           <a href="{{buttonUrl}}" 
                              style="background:#2563eb;color:white;padding:12px 25px;text-decoration:none;
                                     border-radius:6px;font-size:16px;display:inline-block;">
                             Ver más detalles
                           </a>
                         </div>

                         <p style="font-size:14px;color:#666;line-height:22px;margin:30px 0 0 0;text-align:center;">
                           Si no deseas recibir más promociones, simplemente ignora este mensaje.
                         </p>
                       </td>
                     </tr>

                     <tr>
                       <td style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777;">
                         © {{year}} NOTE. Todos los derechos reservados.
                       </td>
                     </tr>
                   </table>
                 </div>
`
          });
          // Ejemplo básico (sin implementación real):
          strapi.log.info(`Enviando correo a: ${user.to}`);
          strapi.log.info(`Asunto: ${data.subject}`);
          strapi.log.info(`Mensaje: ${data.message}`)
          emailsSent++;
        }

        const res = {
          total: emailsSent,
        };

        return res;
      },
    }));
