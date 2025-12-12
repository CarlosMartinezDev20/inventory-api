# 🚀 Despliegue en Vercel

Guía paso a paso para desplegar el backend de Inventory Management en Vercel con base de datos Neon.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Neon](https://neon.tech) (ya configurada)
- Repositorio Git con el código (GitHub, GitLab o Bitbucket)
- [Vercel CLI](https://vercel.com/docs/cli) instalado (opcional pero recomendado)

## 🔧 Configuración Local

### 1. Instalar Vercel CLI (Opcional)

```powershell
npm install -g vercel
```

### 2. Verificar archivos de configuración

El proyecto ya incluye:
- ✅ `vercel.json` - Configuración de rutas y build
- ✅ `api/index.ts` - Handler serverless para NestJS
- ✅ Script `vercel-build` en `package.json`

## 🌐 Despliegue desde la Interfaz Web de Vercel

### Paso 1: Importar Proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub/GitLab/Bitbucket si no lo has hecho
3. Selecciona el repositorio `inventory-backend`
4. Click en **Import**

### Paso 2: Configurar el Proyecto

En la pantalla de configuración:

**Framework Preset:**
- Selecciona: **Other** (o deja vacío)

**Root Directory:**
- Deja como está: `./` (raíz del proyecto)

**Build and Output Settings:**
- Build Command: `npm run vercel-build`
- Output Directory: `.vercel/output` (automático)
- Install Command: `npm install`

### Paso 3: Configurar Variables de Entorno

Click en **Environment Variables** y añade las siguientes:

#### Variable 1: DATABASE_URL
```
DATABASE_URL
```
**Valor:**
```
postgresql://neondb_owner:npg_z4Jliwa9FbVU@ep-super-field-adzojh6g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Variable 2: JWT_SECRET
```
JWT_SECRET
```
**Valor:**
```
your-super-secret-jwt-key-change-in-production-vercel-2025
```

#### Variable 3: JWT_EXPIRES_IN
```
JWT_EXPIRES_IN
```
**Valor:**
```
7d
```

#### Variable 4: NODE_ENV
```
NODE_ENV
```
**Valor:**
```
production
```

#### Variable 5: PORT (Opcional - Vercel lo maneja automáticamente)
```
PORT
```
**Valor:**
```
3000
```

**⚠️ IMPORTANTE:** Marca todas las variables para **Production**, **Preview** y **Development**

### Paso 4: Desplegar

1. Click en **Deploy**
2. Espera a que termine el build (2-5 minutos)
3. Verás una URL como: `https://inventory-backend-xxx.vercel.app`

## 🔍 Verificar el Despliegue

### Probar la API

1. Abre la URL de tu proyecto
2. Debería mostrar: `{"message":"Inventory Management API is running"}`

3. Prueba Swagger:
   ```
   https://tu-proyecto.vercel.app/docs
   ```

4. Prueba el login:
   ```powershell
   curl -X POST https://tu-proyecto.vercel.app/auth/login `
     -H "Content-Type: application/json" `
     -d '{\"email\":\"admin@local\",\"password\":\"Admin123!\"}'
   ```

## 🔄 Aplicar Migraciones (Primera vez)

Vercel no ejecuta migraciones automáticamente. Tienes dos opciones:

### Opción A: Desde tu máquina local

```powershell
# Ya lo hicimos anteriormente, pero si necesitas ejecutarlo de nuevo:
cd c:\Users\ghost\Desktop\inventory-app\inventory-backend
$env:DATABASE_URL = "postgresql://neondb_owner:npg_z4Jliwa9FbVU@ep-super-field-adzojh6g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
npx prisma db push
npm run prisma:seed
```

### Opción B: Crear un script de migración en Vercel

Puedes crear una función serverless separada para migraciones, pero la Opción A es más simple.

## 📱 Actualizar el Frontend (Inventia)

Actualiza la URL del backend en tu aplicación Electron:

**Archivo:** `Inventia/js/config.js`

```javascript
const API_CONFIG = {
  baseURL: 'https://tu-proyecto.vercel.app', // 👈 Cambia esto
  timeout: 10000
};
```

## 🔄 Despliegues Automáticos

Vercel desplegará automáticamente cuando:
- Hagas `git push` a la rama `main` → Producción
- Crees un Pull Request → Preview deployment

## 📊 Comandos Útiles con Vercel CLI

```powershell
# Iniciar sesión
vercel login

# Desplegar a preview
vercel

# Desplegar a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Listar todos tus proyectos
vercel list

# Abrir el proyecto en el navegador
vercel open
```

## 🐛 Solución de Problemas

### Error: "Module not found"

**Causa:** Falta alguna dependencia

**Solución:**
1. Asegúrate de que `express` esté en `dependencies` (no en `devDependencies`)
2. En tu proyecto local:
   ```powershell
   npm install express --save
   git add package.json
   git commit -m "Add express to dependencies"
   git push
   ```

### Error: "Cannot connect to database"

**Causa:** `DATABASE_URL` incorrecta

**Solución:**
1. Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
2. Verifica que `DATABASE_URL` tenga el valor correcto de Neon
3. Redeploy: **Deployments** → **...** → **Redeploy**

### Error: "Prisma Client not generated"

**Causa:** El script `vercel-build` no se ejecutó

**Solución:**
1. Verifica que `package.json` tenga:
   ```json
   "scripts": {
     "vercel-build": "npx prisma generate && npm run build"
   }
   ```
2. Redeploy desde Vercel dashboard

### Timeout en funciones

**Causa:** Las funciones serverless de Vercel tienen límite de 10s (plan gratuito)

**Solución:**
- Optimiza queries lentas en Prisma
- Considera upgrade a plan Pro (60s timeout)
- Para operaciones largas, usa [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

## 🔐 Seguridad

### Cambiar JWT_SECRET

```powershell
# Generar un secreto fuerte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y actualiza `JWT_SECRET` en Vercel:
1. **Settings** → **Environment Variables**
2. Edita `JWT_SECRET`
3. **Save** → **Redeploy**

## 📈 Monitoreo

### Ver Logs en Tiempo Real

1. Ve a tu proyecto en Vercel
2. Click en **Deployments**
3. Click en el deployment activo
4. Click en **Functions** → **View Logs**

O usa CLI:
```powershell
vercel logs --follow
```

## 🎯 Próximos Pasos

1. ✅ Backend desplegado en Vercel
2. ✅ Base de datos en Neon configurada
3. 🔄 Actualizar frontend Inventia con la nueva URL
4. 🔄 Configurar dominio personalizado (opcional)
5. 🔄 Configurar CI/CD con GitHub Actions (opcional)

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [NestJS Serverless](https://docs.nestjs.com/faq/serverless)
- [Neon Docs](https://neon.tech/docs)
- [Prisma con Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## 🚨 Notas Importantes

1. **Cold Starts:** Las funciones serverless pueden tener "cold starts" (arranque lento la primera vez). Es normal en Vercel.

2. **Límites del Plan Gratuito:**
   - Timeout: 10 segundos
   - Bandwidth: 100GB/mes
   - Invocaciones: 100,000/mes
   
3. **Base de Datos:** Neon también tiene límites en el plan gratuito:
   - 0.5GB storage
   - 1 proyecto
   - Branches activas limitadas

4. **Prisma Client:** Se genera en build time, no en runtime

---

¿Problemas? Revisa los logs en Vercel Dashboard o contacta soporte.
