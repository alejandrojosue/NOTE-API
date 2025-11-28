# NOTE -- Sistema de Gestión Electrónica

NOTE es un sistema empresarial diseñado para gestionar facturación,
inventarios, sucursales, movimientos contables y control administrativo.
Construido sobre Strapi v5, NOTE permite manejar empresas, sucursales,
productos, ventas y procesos contables de forma moderna, segura y
escalable.

## Características Principales

-   Facturación electrónica con control de CAI, rangos y correlativos.
-   Multiempresa y multisucursal.
-   Control de inventario en tiempo real.
-   Registro automático de movimientos de inventario.
-   Gestión de usuarios con roles y permisos (Users & Permissions).
-   Módulo de productos y catálogo.
-   Tabla `DetalleFactura` para desgloses por línea.
-   API REST completa documentada en Postman (Colección NOTE).

## Tecnologías

-   **Backend:** Strapi v5\
-   **Base de Datos:** PostgreSQL\
-   **Autenticación:** JWT\
-   **Documentación:** Postman + Swagger

## Endpoints Principales

-   `POST /factura/createVenta`\
    Crea una factura completa con detalles, movimientos de inventario y
    actualización de correlativos.

## Estructura del Proyecto

-   `factura` -- Facturas y ventas.
-   `detalle-factura` -- Líneas de detalle por factura.
-   `producto` -- Catálogo de productos.
-   `inventario` -- Existencias por sucursal.
-   `inventario-movimiento` -- Entradas y salidas.
-   `empresa`, `sucursal` -- Organización empresarial.

## Licencia

Propietario del proyecto. No redistribuir sin autorización.
