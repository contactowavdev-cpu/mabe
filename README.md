# Mabe - Ordenes Tecnicas

Aplicacion operativa para gestionar ordenes tecnicas de Mabe.

Incluye:

- API NestJS para autenticacion, ordenes, estados, fotos, PDFs y firmas.
- PWA React/Vite para tecnicos, administradores, supervisores y enlaces publicos.
- Importacion de PDF de ordenes.
- Generacion de PDF tecnico y PDF de confirmacion del cliente.

## Requisitos

- Node.js 22.12 o superior
- npm
- MySQL/MariaDB

## Instalacion local

```powershell
npm install
```

Crear el archivo:

```text
apps/api/.env
```

Puedes usar `.env.example` como referencia.

## Ejecutar en local

Terminal 1:

```powershell
npm run dev:api
```

Terminal 2:

```powershell
npm run dev:pwa
```

URLs locales:

```text
API: http://localhost:3000/api
PWA: http://localhost:5173
```

## Build

```powershell
npm run build:api
npm run build:pwa
```

## Railway

La API se despliega con el `Dockerfile` de la raiz.

Variables necesarias para la API:

```env
DATABASE_URL="mysql://USUARIO:CONTRASENA@HOST:3306/BASE"
JWT_ACCESS_SECRET="cambia-este-secreto-access"
JWT_REFRESH_SECRET="cambia-este-secreto-refresh"
PUBLIC_APP_URL="https://URL-DE-LA-PWA"
UPLOAD_DIR="/app/uploads"
PORT=3000
```

Healthcheck:

```text
/api/health
```

Para la PWA, crear otro servicio estatico con:

```text
Build command: npm run build:pwa
Output directory: apps/ordenes-pwa/dist
```

Variable de la PWA:

```env
VITE_API_URL="https://URL-DE-LA-API/api"
```
