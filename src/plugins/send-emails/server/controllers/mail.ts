import { Context } from 'koa';

export const sendPromotion = async (ctx: Context) => {
  const { subject, message } = ctx.request.body as { subject: string; message: string };

  if (!subject || !message) {
    ctx.status = 400;
    ctx.body = { message: 'Asunto y mensaje son obligatorios' };
    return;
  }

  try {
    const users = await strapi.db.query('plugin::users-permissions.user').findMany({
      select: ['email', 'username'],
    });

    for (const user of users) {
      await strapi.plugin('email').service('email').send({
        to: user.email,
        subject,
        text: message,
      });
    }

    ctx.body = { message: 'Correos enviados correctamente', total: users.length };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = { message: `Error al enviar correos: ${err.message}` };
  }
};
