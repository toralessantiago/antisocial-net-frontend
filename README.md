# 🌐 UnaHur Anti-Social Net

Red social desarrollada como parte del proyecto integrador de la materia Redes y Operaciones de la Universidad Nacional de Hurlingham.

---

## ✨ Caracteristicas

- 🔐 **Autenticacion de usuarios**: Registro e inicio de sesion con validaciones en tiempo real
- 📰 **Feed de publicaciones**: Visualizacion de posts con imagenes y etiquetas
- ✍️ **Creacion de posts**: Formulario para crear publicaciones con URLs de imagenes y seleccion de etiquetas
- 📄 **Detalle de post**: Vista completa de publicaciones con sus imagenes y comentarios
- 💬 **Sistema de comentarios**: Posibilidad de comentar en las publicaciones
- 👤 **Perfil de usuario**: Seccion protegida para ver y gestionar el perfil
- 🌓 **Tema oscuro/claro**: Toggle para cambiar entre modos de visualizacion
- 🔒 **Rutas protegidas**: Acceso restringido a funcionalidades que requieren autenticacion
- 📱 **Responsive**: Diseno adaptable a diferentes tamanios de pantalla

---

## 🛠️ Tecnologias

### Frontend

- ⚛️ **React** v19.2.7 - Biblioteca para interfaces de usuario
- 📘 **TypeScript** v6.0.2 - JavaScript tipado
- ⚡ **Vite** v8.0.12 - Herramienta de build y desarrollo
- 🗺️ **React Router** v8.0.1 - Enrutamiento SPA
- 🎨 **Bootstrap** v5.3.8 - Framework de estilos CSS
- 📦 **React Bootstrap** v2.10.10 - Componentes Bootstrap para React
- 🎭 **React Icons** v5.6.0 - Iconos SVG
- 💎 **Liquid Glass React** v1.1.1 - Efectos visuales glassmorphism

### Herramientas

- 🔍 **ESLint** - Linting para mantener calidad de codigo
- 🟢 **Node.js** - Runtime de JavaScript

---

## 📡 API

La aplicacion consume una API REST con los siguientes endpoints principales:

### 👥 Usuarios

| Metodo | Endpoint         | Descripcion                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/api/users`     | Obtener todos los usuarios        |
| GET    | `/api/users/:id` | Obtener un usuario por ID         |
| POST   | `/api/users`     | Crear un nuevo usuario (registro) |

### 📝 Posts

| Metodo | Endpoint                | Descripcion                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/posts`            | Obtener todos los posts     |
| GET    | `/api/posts/:id`        | Obtener un post por ID      |
| POST   | `/api/posts`            | Crear una nueva publicacion |
| POST   | `/api/posts/:id/images` | Agregar imagen a un post    |

### 🖼️ Imagenes

| Metodo | Endpoint                   | Descripcion                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/postimages/post/:id` | Obtener imagenes de un post |

### 💭 Comentarios

| Metodo | Endpoint                 | Descripcion                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/api/comments/post/:id` | Obtener comentarios de un post |

### 🏷️ Etiquetas

| Metodo | Endpoint    | Descripcion                 |
| ------ | ----------- | --------------------------- |
| GET    | `/api/tags` | Obtener todas las etiquetas |

## 📁 Estructura del Proyecto

```
src/
├── assets/              # Imagenes y recursos estaticos
├── components/          # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   ├── CommentCard.tsx
│   ├── CommentForm.tsx
│   ├── CommentList.tsx
│   └── ProtectedRoute.tsx
├── context/             # Contextos de React
│   ├── AuthContext.tsx
│   └── UserContext.tsx
├── data/                # Tipos e interfaces
│   ├── Post.ts
│   ├── users.ts
│   ├── comments.ts
│   └── tags.ts
├── pages/               # Paginas principales
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── PostDetail.tsx
│   └── CreatePost.tsx
├── routes/              # Configuracion de rutas
│   └── AppRoutes.tsx
├── services/            # Servicios de API
│   ├── api.ts
│   ├── UsuarioService.ts
│   ├── PostService.ts
│   └── CommentService.ts
├── styles/              # Hojas de estilo CSS
├── App.tsx
└── main.tsx
```

## 🚀 Instalacion y Ejecucion

### Pre-requisitos

- Node.js v18 o superior
- npm o yarn

### Pasos

1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>
```

2️⃣ Instalar dependencias

```bash
npm install
```

3️⃣ Configurar variables de entorno

```bash
# Crear archivo .env
VITE_API_URL=/api
```

4️⃣ Ejecutar en modo desarrollo

```bash
npm run dev
```

5️⃣ Build para produccion

```bash
npm run build
```

## ⚙️ Scripts Disponibles

| Comando           | Descripcion                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Iniciar servidor de desarrollo |
| `npm run build`   | Generar build de produccion    |
| `npm run preview` | Vista previa del build         |
| `npm run lint`    | Ejecutar linter                |

## 👥 Integrantes

- Alaniz, Rocio Abril
- Almirón, Estefanía Abigail
- Movia, Martina Trinidad
- Torales, Santiago

---
