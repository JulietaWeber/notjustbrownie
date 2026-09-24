# notjustbrownie

Sitio web en español para una tienda de brownies artesanales, con catálogo,
carrito y diseño adaptable a celulares y computadoras.

## Desarrollo local

Requiere Node.js 22.13.0 o superior.

```sh
npm ci
npm run dev
```

## Comandos

- `npm run build`: genera la versión de producción.
- `npm run start`: sirve la compilación con Wrangler.
- `npm run lint`: ejecuta el análisis estático.

## Tecnologías

React, TypeScript, Vinext, Vite y Tailwind CSS, con configuración para Cloudflare.

El carrito permite ajustar cantidades y copiar el pedido. El proyecto no incluye
un servicio de pagos ni un backend de inventario.
