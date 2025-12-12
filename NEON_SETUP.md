# Configuración de Base de Datos Neon

## ✅ Completado

La base de datos ha sido migrada exitosamente a Neon PostgreSQL.

### Credenciales de Prueba

**Admin:**
- Email: `admin@local`
- Password: `Admin123!`

**Manager:**
- Email: `manager@local`  
- Password: `Manager123!`

---

## 🔧 Configuración Actual

### Connection String
```
postgresql://neondb_owner:npg_z4Jliwa9FbVU@ep-super-field-adzojh6g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Variables de Entorno (.env)
```env
DATABASE_URL="postgresql://neondb_owner:npg_z4Jliwa9FbVU@ep-super-field-adzojh6g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

---

## 🚀 Comandos Útiles

### Desarrollo Local
```powershell
# Iniciar servidor en modo desarrollo
npm run start:dev

# API disponible en: http://localhost:3000
# Documentación Swagger: http://localhost:3000/docs
```

### Gestión de Base de Datos

```powershell
# Generar cliente Prisma después de cambios en schema
npm run prisma:generate

# Sincronizar schema con DB (desarrollo)
npx prisma db push

# Ver datos en Prisma Studio
npm run prisma:studio

# Ejecutar seed nuevamente (poblará datos si no existen)
npm run prisma:seed
```

---

## 📦 Despliegue en Producción

### Railway

1. **Variables de entorno necesarias:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_z4Jliwa9FbVU@ep-super-field-adzojh6g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=<genera-un-secreto-seguro>
   NODE_ENV=production
   PORT=3000
   ```

2. **Comandos de despliegue:**
   - Build: `npm run deploy:build`
   - Start: `npm run deploy:start`

### Render

1. **Configurar en render.yaml o en el dashboard:**
   - Agregar `DATABASE_URL` como variable de entorno
   - El `render.yaml` ya está configurado

2. **Los comandos build/start se ejecutan automáticamente**

### Vercel/Netlify (solo frontend Inventia)

El frontend Electron puede apuntar a tu backend desplegado cambiando la URL de la API en:
- `Inventia/js/config.js` - Actualizar `API_URL`

---

## 🔒 Seguridad

### Recomendaciones:

1. **Rotar credenciales de Neon:**
   - Ve a Neon Console → Settings → Reset password
   - Actualiza `DATABASE_URL` en todas partes

2. **Cambiar JWT_SECRET en producción:**
   ```powershell
   # Generar un secreto seguro
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Configurar IP allowlist en Neon:**
   - Neon Console → Settings → Allowed IPs
   - Agregar IPs de tus servicios de despliegue

---

## 📊 Datos Iniciales

El seed crea:
- ✅ 2 usuarios (Admin, Manager)
- ✅ 3 categorías (Electronics, Furniture, Office Supplies)
- ✅ 1 bodega (Main Warehouse)
- ✅ 2 proveedores
- ✅ 2 clientes
- ✅ 5 productos con inventario
- ✅ 6 categorías financieras

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Verifica que la `DATABASE_URL` tenga el formato correcto
- Asegúrate de incluir `?sslmode=require`

### Error: "Relation does not exist"
- Ejecuta: `npx prisma db push`
- O: `npm run prisma:migrate:deploy`

### Servidor no inicia
- Verifica que `.env` existe y tiene `DATABASE_URL`
- Ejecuta: `npm install`
- Ejecuta: `npm run prisma:generate`

---

## 📝 Notas

- Neon usa **connection pooling** automáticamente (sufijo `-pooler` en el host)
- El tier gratuito de Neon tiene límites de:
  - 512 MB de almacenamiento
  - 100 horas de compute por mes
  - Suspensión automática después de 5 minutos de inactividad
- Los datos persisten incluso cuando el compute está suspendido
