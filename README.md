# Bitrix24 API Proxy for Vercel

Простой REST API прокси для Bitrix24, размещенный на Vercel. Позволяет обращаться к Bitrix24 API через HTTP запросы из любого места без необходимости настройки модулей.

## 🚀 Быстрый деплой на Vercel

### Шаг 1: Установить Vercel CLI (если еще не установлен)

```bash
npm install -g vercel
```

### Шаг 2: Войти в Vercel

```bash
vercel login
```

### Шаг 3: Задеплоить проект

```bash
cd /home/ubuntu/bitrix24-vercel-api
vercel
```

Следуйте инструкциям:
- **Set up and deploy?** → Yes
- **Which scope?** → Выберите свой аккаунт
- **Link to existing project?** → No
- **Project name?** → bitrix24-api (или любое другое)
- **Directory?** → ./
- **Override settings?** → No

### Шаг 4: Добавить environment variable

После деплоя добавьте webhook URL:

```bash
vercel env add BITRIX24_WEBHOOK_URL
```

Введите значение:
```
https://portal.2penguins.eu/rest/3/4cltwt2wd42cbi9h/
```

Выберите окружения:
- Production: Yes
- Preview: Yes
- Development: Yes

### Шаг 5: Задеплоить в production

```bash
vercel --prod
```

**Готово!** Ваш API доступен по адресу типа `https://bitrix24-api.vercel.app`

---

## 📖 Использование API

### Главный endpoint

**GET/POST** `/api`

Универсальный endpoint для вызова любого метода Bitrix24 API.

**GET пример:**
```bash
curl "https://your-app.vercel.app/api?method=user.current"
```

**POST пример:**
```bash
curl -X POST https://your-app.vercel.app/api \
  -H "Content-Type: application/json" \
  -d '{
    "method": "crm.lead.list",
    "params": {
      "filter": { "STATUS_ID": "NEW" },
      "select": ["ID", "TITLE", "NAME"]
    }
  }'
```

### Shortcuts (упрощенные endpoints)

#### GET /api/user
Получить текущего пользователя

```bash
curl https://your-app.vercel.app/api/user
```

#### GET /api/tasks
Получить задачи

```bash
# Все задачи
curl https://your-app.vercel.app/api/tasks

# С фильтром (просроченные)
curl "https://your-app.vercel.app/api/tasks?filter[<DEADLINE]=2026-01-05T00:00:00"
```

**POST пример:**
```bash
curl -X POST https://your-app.vercel.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "<DEADLINE": "2026-01-05T00:00:00",
      "!STATUS": [4, 5, 6, 7]
    },
    "select": ["ID", "TITLE", "RESPONSIBLE_ID", "DEADLINE"]
  }'
```

#### GET /api/leads
Получить лиды

```bash
# Все лиды
curl https://your-app.vercel.app/api/leads

# Только новые
curl "https://your-app.vercel.app/api/leads?filter[STATUS_ID]=NEW"
```

#### GET /api/deals
Получить сделки

```bash
# Все сделки
curl https://your-app.vercel.app/api/deals

# С фильтром
curl "https://your-app.vercel.app/api/deals?filter[STAGE_ID]=C1:NEW"
```

---

## 💻 Использование в коде

### JavaScript/Node.js

```javascript
// Получить текущего пользователя
const response = await fetch('https://your-app.vercel.app/api/user');
const data = await response.json();
console.log(data.result);

// Получить просроченные задачи
const tasksResponse = await fetch('https://your-app.vercel.app/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filter: {
      '<DEADLINE': new Date().toISOString(),
      '!STATUS': [4, 5, 6, 7]
    }
  })
});
const tasks = await tasksResponse.json();
console.log(tasks.result.tasks);
```

### Python

```python
import requests

# Получить текущего пользователя
response = requests.get('https://your-app.vercel.app/api/user')
user = response.json()['result']
print(user)

# Получить новые лиды
response = requests.post(
    'https://your-app.vercel.app/api/leads',
    json={'filter': {'STATUS_ID': 'NEW'}}
)
leads = response.json()['result']
print(f"New leads: {len(leads)}")
```

### curl

```bash
# Получить текущего пользователя
curl https://your-app.vercel.app/api/user

# Получить просроченные задачи
curl -X POST https://your-app.vercel.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"filter":{"<DEADLINE":"2026-01-05T00:00:00"}}'
```

---

## 🔧 Локальная разработка

```bash
# Установить Vercel CLI
npm install -g vercel

# Запустить локально
vercel dev
```

API будет доступен на `http://localhost:3000`

---

## 📁 Структура проекта

```
bitrix24-vercel-api/
├── api/
│   ├── index.js    # Главный endpoint (универсальный)
│   ├── user.js     # Shortcut: текущий пользователь
│   ├── tasks.js    # Shortcut: задачи
│   ├── leads.js    # Shortcut: лиды
│   └── deals.js    # Shortcut: сделки
├── package.json
├── vercel.json     # Конфигурация Vercel
└── README.md
```

---

## 🔐 Безопасность

- Webhook URL хранится в environment variables Vercel (зашифрован)
- CORS включен для всех origins (можно ограничить при необходимости)
- Все запросы проходят через HTTPS
- Нет rate limiting (используйте с осторожностью)

---

## ✅ Преимущества

✅ **Не нужно настраивать модули** - просто HTTP запросы  
✅ **Работает из любого языка** - JavaScript, Python, curl, и т.д.  
✅ **Бесплатный хостинг** - Vercel Free tier  
✅ **Автоматический HTTPS** - безопасное соединение  
✅ **Глобальный CDN** - быстрый доступ из любой точки мира  
✅ **Не зависит от sandbox** - работает всегда  

---

## 📚 Документация Bitrix24 API

- [Официальная документация REST API](https://dev.1c-bitrix.ru/rest_help/)
- [CRM методы](https://dev.1c-bitrix.ru/rest_help/crm/index.php)
- [Методы задач](https://dev.1c-bitrix.ru/rest_help/tasks/index.php)

---

**Дата создания:** 2026-01-05  
**Автор:** 2Penguins Team  
**Лицензия:** MIT
