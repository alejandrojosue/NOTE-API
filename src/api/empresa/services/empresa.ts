/**
 * empresa service
 */

import { factories } from '@strapi/strapi';
import { CustomError } from '../../../utils/CustomError';

const getLast12MonthsRanges = (): Array<{month, firstDay, lastDay}> => {
  const ranges = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const year = now.getFullYear();
    const month = now.getMonth() - i;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59);

    ranges.push({
      month: firstDay.toLocaleString("es-HN", { month: "long", year: "numeric" }),
      firstDay,
      lastDay,
    });
  }

  return ranges.reverse(); // opcional: para que vaya de más viejo → más reciente
}

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
      cantidadFacturas: configContable ? rangoFinal - rangoInicial + 1 : 0,
      facturasUsadas: configContable ? correlativoActual - rangoInicial : 0,
      facturasDisponibles: configContable ? rangoFinal - correlativoActual : 0,
    };

    // 2️⃣ Contar productos activos en inventario
    const productosActivosPromise = strapi.db.query('api::inventario.inventario').count({
      where: {
        empresa,
        sucursal,
        producto: { activo: true },
      },
    });

    const totalEarn = async (monthStart: Date, monthEnd: Date) => {
      
      const Invoice = await strapi.db.query('api::factura.factura').findMany({
        where: {
          empresa,
          sucursal,
          estado: { $ne: 'CANCELADO' },
          createdAt: { $gte: monthStart, $lte: monthEnd },
        },
      })
      return (Invoice).reduce((acc, item)=> acc + (item?.valorGanancia || 0), 0)
    }

    const totalTax = async (monthStart: Date, monthEnd: Date) => {
      const InvoiceDetails = await strapi.db.query('api::factura.factura').findMany({
        where: {
          empresa,
          sucursal,
          estado: { $ne: 'CANCELADO' },
          noConstRegExonerado: { $in: ['0000', null, ""] },
          createdAt: { $gte: monthStart, $lte: monthEnd },
        },
      });
      return (InvoiceDetails).reduce((acc, item)=> acc + ((item?.totalImpuestoQ || 0) + (item?.totalImpuestoD || 0)), 0)
    }

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

    // Sumar totales de los últimos 12 meses
    const rangesDate = getLast12MonthsRanges();

    const getTotalsLast12Months = async () => {
      const results = [];

      for (const r of rangesDate) {
        const totalMes = await sumField(
          "total",
          r.firstDay,
          r.lastDay,
          true // excluir cancelados
        );

        const totalEarnMonth = await totalEarn(
          r.firstDay,
          r.lastDay,
        )

        const totalTaxMonth = await totalTax(
          r.firstDay,
          r.lastDay,
        )

        // separar nombre y año
        const [monthName,, year] = r.month.split(" ");

        results.push({
          monthName,
          year,
          sales: totalMes,
          earn: totalEarnMonth,
          tax: totalTaxMonth,
          firstDay: r.firstDay,
          lastDay: r.lastDay,
        });
      }

      return results;
    };

    const totalsLast12MonthsPromise = getTotalsLast12Months();

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

    const productosBajosPromise = await strapi.db.query('api::inventario.inventario').findMany({
      where: {
        empresa: { id: empresa },
        sucursal: { id: sucursal },
        producto: { activo: true },
      },
      populate: { producto: true },
    });

    const productosBajoExistencia = productosBajosPromise
    .filter(item => item !== null && item.existencia < item.existenciaMinima)
    .map(item => ({
          id: item.id,
          documentId: item.documentId,
          nombre: item.producto.nombre,
          slug: item.producto.slug,
          unidadMedida: item.unidadMedida,
          existencia: item.existencia,
          existenciaMinima: item.existenciaMinima,
        }));
      

    dashboardData.productosBajoExistencia = productosBajoExistencia;


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
      gananciasMesActual,
      gananciasMesAnterior,
      productosActivos,
      totalsLast12Months
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
      totalEarn(firstDayCurrentMonth, lastDayCurrentMonth),
      totalEarn(firstDayPrevMonth, lastDayPrevMonth),
      productosActivosPromise,
      totalsLast12MonthsPromise
    ]);

    const impuestosMesActual = impuestosMesActualQ + impuestosMesActualD;
    const impuestosMesAnterior = impuestosMesAnteriorQ + impuestosMesAnteriorD;
    
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
      gananciasMesActual,
      gananciasMesAnterior,
      totalsLast12Months
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
