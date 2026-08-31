# BOP Asistente Personal

BOP es un backend Laravel para un asistente personal privado. Esta version esta pensada para sacar las respuestas de IA fuera de Vento: Telegram y la futura APK hablan con este backend, y el backend usa una API externa de IA configurada por el propietario.

## Arquitectura

- Laravel 13 como backend/API.
- SQLite por defecto para desarrollo; MySQL o PostgreSQL recomendado para produccion.
- OpenAI-compatible Chat Completions como proveedor de IA.
- Telegram webhook para hablar con BOP desde el celular.
- Endpoint `/api/chat` para la futura app Android.
- Memoria persistente en tablas propias: usuarios, conversaciones, mensajes y memoria.

## Variables necesarias

Copia `.env.example` a `.env` y configura:

```env
APP_URL=https://tu-dominio.com
BOP_OWNER_NAME=Cristian
BOP_TIMEZONE=America/La_Paz
BOP_APP_TOKEN=crea-un-token-largo-para-la-apk

OPENAI_API_KEY=tu-api-key-externa
OPENAI_BASE_URL=https://api.openai.com/v1
BOP_AI_MODEL=gpt-4.1-mini

TELEGRAM_BOT_TOKEN=token-de-botfather
TELEGRAM_WEBHOOK_SECRET=crea-un-secreto-largo-para-telegram
```

No subas `.env` a GitHub.

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

## API para la APK

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
