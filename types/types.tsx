export interface CCI {
  id?: number; // Strapi usualmente agrega un ID
  rtn: string;
  nombre: string;
  direccion?: string;
  presidente?: string;
  director?: string;
  activa?: boolean; // default: true
  telefonos: string;
  logo?: {
    id: number;
    url: string;
    mime: string;
    size: number;
    name: string;
    width?: number;
    height?: number;
    formats?: any;
  };
  ingresoGenerado?: number;
  isvGenerado?: number; // default: 0
  saldoPendiente?: number; // default: 0
  saldoPagado?: number; // default: 0
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Empresa {
  id?: number; // Agregado automáticamente por Strapi

  rtn: string;           // minLength: 14, maxLength: 14
  nombre: string;
  direccion: string;
  telefonos?: string;
  correo?: string;
  logo?: Media;          // Media de Strapi
  estado?: boolean;      // default: true
  nombreEncargado?: string;

  users_permissions_user: {
    id: number;
    username: string;
    email: string;
    // Puedes agregar más campos si los usas
  };

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Interface genérica para Media de Strapi
 */
export interface Media {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  formats?: any;
}

export interface Factura {
  id?: number;

  noFactura?: number; // biginteger
  fechaLimite?: string; // date
  cai?: string;
  rtnCliente?: string; // default: "00000000000000"
  nombreCliente?: string; // default: "CF"
  codigoNumFactura?: string;

  subtotal: number;
  totalImpuestoQ: number;
  totalImpuestoD?: number;
  totalDescuento?: number;
  totalExento?: number;
  totalExonerado?: number;
  total: number;

  estado?: "PAGADO" | "PENDIENTE" | "CANCELADO"; // default: PAGADO
  infoCancelacion?: string;

  adjunto?: Media;

  noCompraExenta?: string;
  noConstRegExonerado?: string;
  noSAG?: string;

  users_permissions_user?: User;
  empresa?: Empresa;
  sucursal?: Sucursal;

  valorGanancia?: number;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface DetalleFactura {
  id?: number;

  factura: Factura;
  producto: Producto;

  cantidad: number;        // decimal
  isv: number;             // decimal
  precio: number;          // decimal
  descuentoValor?: number; // decimal

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}


export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Empresa {
  id?: number;

  rtn: string;                // minLength: 14, maxLength: 14
  nombre: string;
  direccion: string;
  telefonos?: string;
  correo?: string;

  logo?: Media;

  estado?: boolean;           // default: true
  nombreEncargado?: string;

  users_permissions_user: User;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Sucursal {
  id?: number;

  nombre: string;
  empresa?: Empresa;

  direccion: string;
  telefonos?: string;
  nombreGerente?: string;

  activa?: boolean; // default: true

  config_contable?: ConfigContable;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ConfigContable {
  id?: number;

  fechaLimite: string;          // date
  rangoInicial: number;         // biginteger
  rangoFinal?: number;          // biginteger
  rtn: string;                  // minLength 14, maxLength 14
  cai: string;
  correlativoActual?: number;   // biginteger
  codigoNumFactura: string;

  sucursale?: Sucursal;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface HistoricoConfigContable {
  id?: number;
  configuraciones_contable?: ConfigContable;
  dataAnterior: Record<string, any>;
  dataNueva: Record<string, any>;
}

export interface Producto {
  id?: number;

  codigo: string;
  slug?: string; // uid generado por Strapi
  nombre: string;

  precioCompra: number;
  precioVenta: number;

  activo?: boolean; // default: true
  exento?: boolean; // default: false

  empresa?: Empresa;
  users_permissions_user?: User;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Inventario {
  id?: number;

  producto?: Producto;
  empresa: Empresa;
  sucursal: Sucursal;
  users_permissions_user: User;

  existencia?: number;
  unidadMedida?: string;
  existenciaMinima?: number;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface InventarioMovimiento {
  id?: number;

  producto: Producto;
  empresa: Empresa;
  sucursal: Sucursal;
  users_permissions_user: User;

  cantidad: number; // decimal

  tipoMovimiento: "ENTRADA" | "SALIDA" | "AJUSTE";

  comentario?: string;

  precioCompra?: number; // decimal
  precioVenta?: number;  // decimal

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}


