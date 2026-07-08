# Apps de Ordenes Tecnico-Comerciales

Este directorio contiene la implementacion separada del sistema operativo de ordenes:

- `api`: NestJS + Prisma.
- `ordenes-pwa`: React + Vite PWA mobile-first.

El sitio Astro existente queda intacto como sitio publico/comercial.

## Base de datos existente

En tus capturas aparece una base MySQL llamada:

```text
jpxdcegu_app_tecnicos
```

Y ya existen estas tablas:

```text
tb_usuarios
ordenes
```

Campos visibles en `tb_usuarios`:

```text
id
nombre_usuario
nombre_completo
email
email_verificado_en
password
telefono
fecha_nac
remember_token
created_at
updated_at
```

Campos visibles en `ordenes`:

```text
id
usuario_id
numero_orden
estado
subtotal
total
fecha_orden
fecha_entrega
fecha_completado
direccion_entrega
notas
created_at
updated_at
```

Importante: esas tablas sirven como base, pero no cubren todavia todo lo que piden los modulos nuevos: fotos, firmas, links temporales, PDF, estados con prioridad, datos completos del cliente y datos tecnicos.

## Donde van las credenciales

Las credenciales van en:

```text
apps/api/.env
```

Si no existe:

```bash
copy apps\api\.env.example apps\api\.env
```

Para tu MySQL, el formato correcto es:

```env
DATABASE_URL="mysql://USUARIO:CONTRASENA@HOST:3306/jpxdcegu_app_tecnicos"
JWT_ACCESS_SECRET="cambia-esto-access"
JWT_REFRESH_SECRET="cambia-esto-refresh"
PUBLIC_APP_URL="http://localhost:5173"
UPLOAD_DIR="./uploads"
```

Ejemplo local:

```env
DATABASE_URL="mysql://root:tu_password@localhost:3306/jpxdcegu_app_tecnicos"
```

## Decision pendiente para conectar tu DB

Hay dos caminos:

1. Mantener tus tablas actuales y adaptar el API a `tb_usuarios` y `ordenes`.
2. Agregar las tablas/campos nuevos del sistema completo.

Para hacer el camino 1 sin adivinar, se necesita el `CREATE TABLE` completo de `tb_usuarios` y `ordenes`, o capturas donde se vean todas las columnas, constraints e indices.

## PWA

Levantar app:

```bash
npm run dev:pwa
```

Por defecto consume:

```text
http://localhost:3000/api
```

Para cambiarlo, crear `apps/ordenes-pwa/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Verificacion

```bash
npm run build:api
npm run build:pwa
```
