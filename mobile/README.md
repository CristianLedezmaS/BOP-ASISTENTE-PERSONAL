# BOP AI Mobile

Aplicacion movil principal de BOP AI.

## Stack

- React Native
- Expo
- TypeScript
- NativeWind
- React Navigation

## Identidad visual

- Negro: `#050505`
- Gris grafito: `#20242A`
- Rojo neon: `#FF1A1A`
- Rojo oscuro: `#8B0000`
- Blanco: `#F5F5F5`
- Plata: `#C7CBD1`

El rojo se usa como acento, no como fondo dominante.

## Estructura

```text
src/api
src/components
src/context
src/data
src/hooks
src/navigation
src/screens
src/theme
src/types
```

## Ejecutar

```bash
cd bop-mobile
npm install
npm run start
```

## Generar APK Android

La app esta preparada para generar un APK instalable con EAS Build:

```bash
cd bop-mobile
npm run typecheck
npm run build:android:preview
```

El perfil `preview` de `eas.json` genera un `.apk` para instalacion manual en Android.

Requisito externo: EAS necesita una cuenta de Expo. En CI o en este entorno se debe configurar `EXPO_TOKEN`; sin ese token, Expo rechaza la build antes de crear el APK.

Build local en este sandbox: no es viable compilar el APK completo aqui porque el almacenamiento disponible permite escribir archivos, pero no ejecutar los binarios Android generados/descargados (`aapt`, JDK portable, wrappers de CLI). La generacion nativa de Android si fue validada en una ruta temporal.

## Configurar API

Por defecto la app funciona en modo local simulado para desarrollo visual.
Para conectarla al backend Laravel real, copia `.env.example` a `.env` y ajusta:

```env
EXPO_PUBLIC_BOP_API_URL=https://tu-dominio.com/api
```

Contratos esperados:

```text
GET /bop/health
POST /auth/login
GET /bop/history
POST /bop/chat
```

Backend Laravel incluido en este workspace:

```text
/workspace/bop-asistente-personal-check
```

Variables necesarias en Laravel:

```text
BOP_APP_TOKEN=token-largo-seguro
BOP_MOBILE_EMAIL=correo-autorizado
BOP_MOBILE_PASSWORD_HASH=hash-generado-con-Hash::make
OPENAI_API_KEY=clave-openai
```

La sesion se guarda con `expo-secure-store`, no en almacenamiento plano.

Para desarrollo local en Android fisico, reemplaza `127.0.0.1` por la IP LAN de la computadora donde corre Laravel, por ejemplo:

```env
EXPO_PUBLIC_BOP_API_URL=http://192.168.1.50:8000/api
```

Antes de probar login real, en Laravel ejecuta:

```bash
php artisan bop:doctor
php artisan route:list --path=api
```

`bop:doctor` no muestra secretos; solo confirma si faltan variables necesarias. Cuando marque todo lo minimo como `[ok]`, levanta Laravel con `php artisan serve --host=0.0.0.0 --port=8000` y abre Expo.

## Verificacion

```bash
npm run typecheck
```

## Modulos iniciales

- Splash screen
- Icono Android y splash assets
- Login con estado de sesion persistido
- Chat principal
- Historial de chat remoto desde Laravel con respaldo local seguro
- Composer con voz, adjuntos y envio
- Panel de permisos con aprobacion/rechazo
- Modelo de riesgos para autonomia controlada
- Cliente HTTP tipado con Bearer token, timeout y manejo de errores

## Estado actual

Esta es una base real de React Native/Expo, no un mockup HTML.

Incluye una capa `src/api/bopApi.ts` que usa API remota cuando existe `EXPO_PUBLIC_BOP_API_URL` y mantiene fallback local para desarrollo. El backend Laravel compatible ya esta en `/workspace/bop-asistente-personal-check`.
