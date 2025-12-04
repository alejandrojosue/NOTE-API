/**
 * empresa service
 */

import { factories } from '@strapi/strapi';
import { CustomError } from '../../../utils/CustomError';

export default factories.createCoreService('api::empresa.empresa', ({ strapi }) => ({
  async getDashboardData({ empresa, sucursal }) {
    if (!empresa) throw new CustomError('Empresa no válida.', 400);
    if (!sucursal) throw new CustomError('Sucursal no válida.', 400);

    // 1️⃣ Obtener sucursal y config contable
    const sucursalData = await strapi.db.query('api::sucursal.sucursal').findOne({
      where: { id: sucursal, activa: true },
      populate: { config_contable: true },
    });
    if (!sucursalData) throw new CustomError('Sucursal no disponible.');

    const configContable = sucursalData.config_contable;
    const correlativoActual = Number(configContable?.correlativoActual || 0);
    const rangoInicial = Number(configContable?.rangoInicial || 0);
    const rangoFinal = Number(configContable?.rangoFinal || 0);

    const dashboardData: any = {
      cantidadFacturas: rangoFinal - rangoInicial + 1,
      facturasUsadas: correlativoActual - rangoInicial,
      facturasDisponibles: rangoFinal - correlativoActual,
    };

    // 2️⃣ Contar productos activos en inventario
    const productosActivosPromise = strapi.db.query('api::inventario.inventario').count({
      where: {
        empresa,
        sucursal,
        producto: { activo: true },
      },
    });

    // 3️⃣ Preparar fechas del mes actual y anterior
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
    const lastDayCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const firstDayPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // 4️⃣ Función helper para sumar total, totalImpuestoQ y totalImpuestoD
    const sumField = async (field: 'total' | 'totalImpuestoQ' | 'totalImpuestoD', monthStart: Date, monthEnd: Date, excludeCancelado = false, excludeExonerado = false) => {
      const filters: any = {
        empresa: { id: empresa },
        sucursal: { id: sucursal },
        createdAt: { $gte: monthStart, $lte: monthEnd },
      };
      if (excludeCancelado) filters.estado = { $ne: 'CANCELADO' };
      if (excludeExonerado) filters.noConstRegExonerado = { $in: ['0000', null, ""] };

      const facturas = await strapi.db.query('api::factura.factura').findMany({
        where: filters
      });
      return facturas.reduce((acc, f) => acc + Number(f[field] || 0), 0);
    };

    // 5️⃣ Contar facturas
    const countFacturas = async (monthStart: Date, monthEnd: Date, estado?: string) => {
      const where: any = {
        empresa: { id: empresa },
        sucursal: { id: sucursal },
        createdAt: { $gte: monthStart, $lte: monthEnd },
      };
      if (estado) where.estado = estado;
      return strapi.db.query('api::factura.factura').count({ where });
    };

    // 6️⃣ Ejecutar todas las métricas en paralelo
    const [
      facturasCanceladasMesActual,
      facturasCanceladasMesAnterior,
      cantidadFacturasMesActual,
      cantidadFacturasMesAnterior,
      totalVentasMesActual,
      totalVentasMesAnterior,
      impuestosMesActualQ,
      impuestosMesAnteriorQ,
      impuestosMesActualD,
      impuestosMesAnteriorD,
      productosActivos,
    ] = await Promise.all([
      countFacturas(firstDayCurrentMonth, lastDayCurrentMonth, 'CANCELADO'),
      countFacturas(firstDayPrevMonth, lastDayPrevMonth, 'CANCELADO'),
      countFacturas(firstDayCurrentMonth, lastDayCurrentMonth),
      countFacturas(firstDayPrevMonth, lastDayPrevMonth),
      sumField('total', firstDayCurrentMonth, lastDayCurrentMonth, true),
      sumField('total', firstDayPrevMonth, lastDayPrevMonth, true),
      sumField('totalImpuestoQ', firstDayCurrentMonth, lastDayCurrentMonth, true, true),
      sumField('totalImpuestoQ', firstDayPrevMonth, lastDayPrevMonth, true, true),
      sumField('totalImpuestoD', firstDayCurrentMonth, lastDayCurrentMonth, true, true),
      sumField('totalImpuestoD', firstDayPrevMonth, lastDayPrevMonth, true, true),
      productosActivosPromise,
    ]);

    const impuestosMesActual = impuestosMesActualQ + impuestosMesActualD;
    const impuestosMesAnterior = impuestosMesAnteriorQ + impuestosMesAnteriorD;

    // 7️⃣ Combinar y devolver datos
    return {
      ...dashboardData,
      productosActivos,
      facturasCanceladasMesActual,
      facturasCanceladasMesAnterior,
      cantidadFacturasMesActual,
      cantidadFacturasMesAnterior,
      totalVentasMesActual,
      totalVentasMesAnterior,
      impuestosMesActual,
      impuestosMesAnterior,
    };
  },

  async getBranchesByUser({ user }: { user: number }) {
    if (!user) throw new CustomError('Usuario no válido.', 400);
    const empresa = await strapi.db.query('api::empresa.empresa').findOne({
      where: { users_permissions_user: { id: user }, estado: true },
    });
    if (!empresa) throw new CustomError('Empresa no encontrada para el usuario dado.', 404);

    const sucursales = await strapi.db.query('api::sucursal.sucursal').findMany({
      where: { empresa: empresa.id, activa: true },
    });
    empresa.sucursales = sucursales;
    return empresa;
  }
}));
