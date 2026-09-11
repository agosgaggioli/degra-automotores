# Degra Automotores — Sitio web + Backoffice

Monorepo con:

- **`frontend/`** — Next.js 13 (App Router) + Tailwind. Sitio público + backoffice (`/admin`).
- **`backend/`** — Node.js + Express. API REST que habla con Supabase.
- **`supabase/`** — Esquema SQL de la base de datos y datos de ejemplo.

El frontend **nunca habla directo con Supabase**: todo pasa por el backend, que usa la
Service Role Key de Supabase (nunca se expone al navegador). Esto es más seguro y más
fácil de mantener.

---

## 0. Qué vas a necesitar

- Node.js 18 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)
- (Para producción) una cuenta en [Vercel](https://vercel.com) para el frontend y en
  [Render](https://render.com) o [Railway](https://railway.app) para el backend

---

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) → **New project**.
2. Elegí nombre, contraseña de base de datos y región (Sudamérica si hay disponible).
3. Cuando el proyecto esté listo, andá a **SQL Editor → New query**.
4. Pegá **todo** el contenido de [`supabase/schema.sql`](./supabase/schema.sql) y ejecutalo
   (`RUN`). Esto crea las tablas, los triggers, RLS y los buckets de Storage
   (`vehicles` y `consignments`).
5. (Opcional) Si querés stock de prueba para ver el sitio andando, corré también
   [`supabase/seed.sql`](./supabase/seed.sql).
6. Andá a **Settings → API** y copiá:
   - `Project URL` → esto es `SUPABASE_URL`
   - `service_role` key (⚠️ secreta, no la compartas) → esto es `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Backend (Node.js / Express)

```bash
cd backend
cp .env.example .env
```

Editá `backend/.env` y completá:

```
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
JWT_SECRET=algo-largo-y-aleatorio   # generalo con: openssl rand -hex 32
ADMIN_EMAIL=admin@degraautomotores.com
ADMIN_PASSWORD=UnaClaveSegura123!
```

Instalá dependencias y creá el primer usuario del backoffice:

```bash
npm install
npm run create-admin
```

Levantá el servidor:

```bash
npm run dev
```

Probalo en <http://localhost:4000/api/health> — debería devolver `{"ok": true, ...}`.

### Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login del backoffice |
| GET | `/api/vehicles` | Catálogo público (filtros: `search`, `brand`, `transmission`, `fuel`, `yearMin`, `yearMax`, `page`) |
| GET | `/api/vehicles/:slug` | Detalle público de un vehículo |
| POST | `/api/consignments` | Enviar una consignación (multipart, hasta 5 imágenes) |
| POST | `/api/contact` | Enviar una consulta de contacto |
| GET/POST/PUT/DELETE | `/api/admin/vehicles` | CRUD de vehículos (requiere token) |
| GET/PATCH/DELETE | `/api/admin/consignments` | Gestión de consignaciones (requiere token) |
| GET/PATCH/DELETE | `/api/admin/contact` | Gestión de consultas (requiere token) |
| GET | `/api/admin/stats` | Números para el dashboard (requiere token) |

---

## 3. Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
```

Editá `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Instalá y levantá:

```bash
npm install
npm run dev
```

Abrí <http://localhost:3000>. El catálogo (`/vehiculos`), la ficha de cada auto, el
formulario de `/consignacion` y el de `/contacto` ya están conectados al backend.

### Backoffice

Andá a <http://localhost:3000/admin/login> e ingresá con el email/clave que
configuraste con `npm run create-admin`. Desde ahí podés:

- Ver el dashboard con números generales
- Cargar, editar, publicar/despublicar y borrar vehículos (con fotos)
- Ver y gestionar las consignaciones recibidas (cambiar estado, agregar notas internas)
- Ver y gestionar las consultas de contacto

---

## 4. Desplegar en producción

### Backend → Render (o Railway)

1. Subí este repo a tu GitHub (ver sección 5).
2. En Render: **New → Web Service**, conectá el repo, seteá:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. Cargá las mismas variables de entorno que en `backend/.env` (con tu `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, y `FRONTEND_URL` apuntando a tu dominio
   de Vercel, ej: `https://degraautomotores.vercel.app`).
4. Una vez desplegado, copiá la URL pública (ej: `https://degra-api.onrender.com`).

### Frontend → Vercel

1. En Vercel: **New Project**, importá el repo, seteá el **Root Directory** en `frontend`.
2. Variable de entorno: `NEXT_PUBLIC_API_URL=https://degra-api.onrender.com/api`
   (la URL de tu backend + `/api`).
3. Deploy.

### Crear el admin en producción

Corré una vez (desde tu máquina, apuntando el `.env` a las credenciales de Supabase):

```bash
cd backend
npm run create-admin
```

---

## 5. Subir el código a tu GitHub

Este proyecto ya tiene un repo git local con historial de commits. Para subirlo a tu
cuenta:

```bash
cd dr-automotores          # carpeta raíz del proyecto
git remote add origin https://github.com/TU-USUARIO/dr-automotores.git
git branch -M main
git push -u origin main
```

(Si preferís, podés crear el repo vacío primero en GitHub y después correr esos comandos.)

---

## 6. Estructura del proyecto

```
dr-automotores/
├── frontend/                Next.js — sitio público + /admin (backoffice)
│   ├── app/
│   │   ├── vehiculos/       Catálogo + ficha de vehículo (conectado al backend)
│   │   ├── consignacion/    Formulario público de consignación
│   │   ├── contacto/        Formulario público de contacto
│   │   └── admin/           Backoffice (login + dashboard + CRUD)
│   └── lib/
│       ├── api.ts           Cliente HTTP hacia el backend
│       └── auth-context.tsx Contexto de sesión del backoffice
├── backend/                 API REST (Node.js + Express + Supabase)
│   └── src/
│       ├── routes/          auth, vehicles, consignments, contact, admin
│       ├── controllers/     Lógica de cada recurso
│       ├── middleware/      JWT auth, upload de imágenes (multer), errores
│       └── scripts/         createAdmin.js
└── supabase/
    ├── schema.sql           Tablas, triggers, RLS, buckets de Storage
    └── seed.sql             Datos de ejemplo (opcional)
```

---

## 7. Notas de seguridad

- La `SUPABASE_SERVICE_ROLE_KEY` **solo** va en el backend (`backend/.env`). Nunca la
  pongas en el frontend ni la subas a un repo público sin `.gitignore`.
- Cambiá `JWT_SECRET` y la contraseña del admin antes de ir a producción.
- Las rutas `/api/admin/*` requieren el token que devuelve `/api/auth/login`.
- Los formularios públicos (`/api/consignments`, `/api/contact`) tienen rate limiting
  para evitar spam.
