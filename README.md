# BOP Asistente Personal

BOP es un backend Laravel para un asistente personal privado. Esta version esta pensada para sacar las respuestas de IA fuera de Vento: Telegram y la futura APK hablan con este backend, y el backend usa una API externa de IA configurada por el propietario.

## Arquitectura

- Laravel 13 como backend/API.
- SQLite por defecto para desarrollo; MySQL o PostgreSQL recomendado para produccion.
- OpenAI-compatible Chat Completions como proveedor de IA.
- Telegram webhook para hablar con BOP desde el celular.
- Endpoints `/api/auth/login`, `/api/bop/history` y `/api/bop/chat` para la app movil React Native/Expo.
- Endpoint legacy `/api/chat` para clientes simples con Bearer token.
- Memoria persistente en tablas propias: usuarios, conversaciones, mensajes y memoria.

## Variables necesarias

Copia `.env.example` a `.env` y configura:

```env
APP_URL=https://tu-dominio.com
BOP_OWNER_NAME=Cristian
BOP_TIMEZONE=America/La_Paz
BOP_APP_TOKEN=crea-un-token-largo-para-la-apk
BOP_MOBILE_EMAIL=correo-autorizado
BOP_MOBILE_PASSWORD_HASH=hash-bcrypt-de-la-clave

OPENAI_API_KEY=tu-api-key-externa
OPENAI_BASE_URL=https://api.openai.com/v1
BOP_AI_MODEL=gpt-4.1-mini

TELEGRAM_BOT_TOKEN=token-de-botfather
TELEGRAM_WEBHOOK_SECRET=crea-un-secreto-largo-para-telegram
```

No subas `.env` a GitHub.

Genera el token y el hash de la clave movil con:

```bash
php artisan bop:mobile-credentials correo@dominio.com
```

El comando pedira la clave privada de forma oculta y mostrara los valores `BOP_APP_TOKEN`, `BOP_MOBILE_EMAIL` y `BOP_MOBILE_PASSWORD_HASH` para pegarlos en `.env`. No guardes la clave privada en texto plano.

Revisa la configuracion sin imprimir secretos con:

```bash
php artisan bop:doctor
```

El comando marca como faltantes `APP_KEY`, credenciales moviles, `OPENAI_API_KEY` y configuracion de Telegram cuando aun no existen. Es normal que falle antes de completar el `.env`.

## Instalacion local

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

En esta maquina de trabajo pueden faltar extensiones PHP. En un servidor real instala las extensiones completas para Laravel, incluyendo `dom/xml`, `curl` y el driver de base de datos que uses: `pdo_sqlite` para desarrollo, `pdo_mysql` para MySQL o `pdo_pgsql` para PostgreSQL.

## Registrar webhook de Telegram

Cuando el proyecto este desplegado con HTTPS:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=$APP_URL/api/telegram/webhook" \
  -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
```

Despues escribe al bot en Telegram. BOP guardara el historial por chat y usara ese contexto para responder.

## API movil

Salud:

```http
GET /api/bop/health
Accept: application/json
```

Devuelve estado publico del backend para que la app confirme conexion antes de login.

Historial:

```http
GET /api/bop/history?conversation_id=mobile-owner
Authorization: Bearer <token>
Accept: application/json
```

Respuesta:

```json
{
  "conversation_id": "mobile-owner",
  "messages": [
    {
      "id": "m-1",
      "role": "user",
      "status": "IDLE",
      "text": "Hola BOP",
      "conversation_id": "mobile-owner"
    }
  ]
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "correo-autorizado",
  "password": "clave-privada"
}
```

Respuesta:

```json
{
  "token": "BOP_APP_TOKEN",
  "user": {
    "id": "mobile-owner",
    "email": "correo-autorizado",
    "name": "Cristian"
  }
}
```

Chat:

```http
POST /api/bop/chat
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "message": "BOP, ayudame con Laravel",
  "user_id": "mobile-owner",
  "conversation_id": "mobile-owner"
}
```

Los endpoints `/api/bop/history` y `/api/bop/chat` usan el middleware `bop.mobile`, que valida el Bearer token contra `BOP_APP_TOKEN` antes de procesar la solicitud.

Respuesta para React Native:

```json
{
  "id": "b-...",
  "role": "bop",
  "status": "IDLE",
  "text": "Texto de BOP",
  "conversation_id": "mobile-owner"
}
```

## API legacy para clientes simples

Endpoint:

```http
POST /api/chat
Authorization: Bearer <BOP_APP_TOKEN>
Content-Type: application/json
```

Body:

```json
{
  "message": "BOP, ayudame con Laravel",
  "user_id": "cristian",
  "conversation_id": "principal"
}
```

Respuesta:

```json
{
  "reply": "Texto de BOP",
  "conversation_id": "principal"
}
```

## Seguridad de produccion

- Usa HTTPS obligatorio.
- Usa `BOP_APP_TOKEN` largo y privado para la APK.
- Usa `TELEGRAM_WEBHOOK_SECRET` para evitar llamadas falsas al webhook.
- No guardes API keys en el repositorio.
- Usa MySQL/PostgreSQL en produccion si el volumen crece.
- Configura logs, backups y monitoreo antes de depender de BOP para tareas importantes.

## Estado actual

Esto es la base de produccion del backend. Para ponerlo en linea falta desplegarlo en un VPS/hosting Laravel, configurar dominio/SSL, poner las claves reales y registrar el webhook de Telegram apuntando al dominio final.

## App movil

La app React Native/Expo compatible esta en:

```text
/workspace/bop-mobile
```

Configura `EXPO_PUBLIC_BOP_API_URL` apuntando a este backend con el sufijo `/api`.

Checklist local recomendado:

```bash
php artisan key:generate
php artisan bop:mobile-credentials correo@dominio.com
php artisan bop:doctor
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

En Android fisico, la app debe usar la IP LAN de esta maquina, no `127.0.0.1`.
