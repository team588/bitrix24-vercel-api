# Bitrix24 API - Защищенный доступ

## 🔐 API защищен API Key авторизацией!

**Production URL:**
```
https://bitrix24-vercel-api-vmxz.vercel.app
```

**API Key:**
```
btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46
```

⚠️ **ВАЖНО:** Храните API ключ в секрете! Не публикуйте его в открытом доступе.

---

## 🚀 Быстрый старт

### Получить текущего пользователя

```bash
curl -H "X-API-Key: btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46" \
  "https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current"
```

**Ответ:**
```json
{
  "result": {
    "ID": "3",
    "NAME": "Alexander",
    "LAST_NAME": "Wirt",
    "EMAIL": "alexanderwirt@gmail.com"
  }
}
```

### Получить просроченные задачи

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46" \
  -d '{
    "method": "tasks.task.list",
    "params": {
      "filter": {
        "<DEADLINE": "2026-01-05T00:00:00"
      },
      "select": ["ID", "TITLE", "DEADLINE"]
    }
  }' \
  "https://bitrix24-vercel-api-vmxz.vercel.app/api"
```

---

## 🔒 Безопасность

### Что защищено:

✅ **Без API ключа** → 401 Unauthorized  
✅ **С неправильным ключом** → 403 Forbidden  
✅ **С правильным ключом** → 200 OK  

### Примеры ошибок:

**Без ключа:**
```bash
$ curl "https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current"

{
  "error": "Unauthorized",
  "message": "API key is required. Please provide X-API-Key header.",
  "example": "curl -H \"X-API-Key: your_api_key\" https://..."
}
```

**С неправильным ключом:**
```bash
$ curl -H "X-API-Key: wrong_key" \
  "https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current"

{
  "error": "Forbidden",
  "message": "Invalid API key"
}
```

---

## 💻 Примеры использования

### JavaScript/Node.js

```javascript
const API_KEY = 'btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46';
const API_URL = 'https://bitrix24-vercel-api-vmxz.vercel.app/api';

// Получить текущего пользователя
async function getCurrentUser() {
  const response = await fetch(`${API_URL}?method=user.current`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  const data = await response.json();
  return data.result;
}

// Получить просроченные задачи
async function getOverdueTasks() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      method: 'tasks.task.list',
      params: {
        filter: {
          '<DEADLINE': new Date().toISOString(),
          '!STATUS': [4, 5, 6, 7]
        },
        select: ['ID', 'TITLE', 'RESPONSIBLE_ID', 'DEADLINE']
      }
    })
  });
  const data = await response.json();
  return data.result.tasks;
}

// Получить новые лиды
async function getNewLeads() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      method: 'crm.lead.list',
      params: {
        filter: { STATUS_ID: 'NEW' },
        select: ['ID', 'TITLE', 'NAME', 'EMAIL', 'PHONE']
      }
    })
  });
  const data = await response.json();
  return data.result;
}

// Использование
const user = await getCurrentUser();
console.log(`Current user: ${user.NAME} ${user.LAST_NAME}`);

const tasks = await getOverdueTasks();
console.log(`Overdue tasks: ${tasks.length}`);

const leads = await getNewLeads();
console.log(`New leads: ${leads.length}`);
```

### Python

```python
import requests
import json
from datetime import datetime

API_KEY = 'btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46'
API_URL = 'https://bitrix24-vercel-api-vmxz.vercel.app/api'

# Заголовки с API ключом
headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
}

# Получить текущего пользователя
def get_current_user():
    response = requests.get(
        f"{API_URL}?method=user.current",
        headers={'X-API-Key': API_KEY}
    )
    return response.json()['result']

# Получить просроченные задачи
def get_overdue_tasks():
    payload = {
        'method': 'tasks.task.list',
        'params': {
            'filter': {
                '<DEADLINE': datetime.now().isoformat(),
                '!STATUS': [4, 5, 6, 7]
            },
            'select': ['ID', 'TITLE', 'RESPONSIBLE_ID', 'DEADLINE']
        }
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()['result']['tasks']

# Получить новые лиды
def get_new_leads():
    payload = {
        'method': 'crm.lead.list',
        'params': {
            'filter': {'STATUS_ID': 'NEW'},
            'select': ['ID', 'TITLE', 'NAME', 'EMAIL', 'PHONE']
        }
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()['result']

# Использование
if __name__ == '__main__':
    user = get_current_user()
    print(f"Current user: {user['NAME']} {user['LAST_NAME']}")
    
    tasks = get_overdue_tasks()
    print(f"Overdue tasks: {len(tasks)}")
    
    leads = get_new_leads()
    print(f"New leads: {len(leads)}")
```

### curl

```bash
# Установить API ключ как переменную
API_KEY="btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46"
API_URL="https://bitrix24-vercel-api-vmxz.vercel.app/api"

# Получить текущего пользователя
curl -H "X-API-Key: $API_KEY" \
  "$API_URL?method=user.current"

# Получить просроченные задачи
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "method": "tasks.task.list",
    "params": {
      "filter": {"<DEADLINE": "2026-01-05T00:00:00"}
    }
  }' \
  "$API_URL"

# Получить новые лиды
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "method": "crm.lead.list",
    "params": {
      "filter": {"STATUS_ID": "NEW"}
    }
  }' \
  "$API_URL"
```

---

## 🔧 Доступные методы Bitrix24 API

Вы можете вызвать **любой** метод из [официальной документации Bitrix24 REST API](https://dev.1c-bitrix.ru/rest_help/).

### Популярные методы:

**Пользователи:**
- `user.current` - текущий пользователь
- `user.get` - получить пользователей

**Задачи:**
- `tasks.task.list` - список задач
- `tasks.task.get` - получить задачу
- `tasks.task.add` - создать задачу
- `tasks.task.update` - обновить задачу

**CRM - Лиды:**
- `crm.lead.list` - список лидов
- `crm.lead.get` - получить лид
- `crm.lead.add` - создать лид
- `crm.lead.update` - обновить лид

**CRM - Сделки:**
- `crm.deal.list` - список сделок
- `crm.deal.get` - получить сделку
- `crm.deal.add` - создать сделку
- `crm.deal.update` - обновить сделку

**CRM - Контакты:**
- `crm.contact.list` - список контактов
- `crm.contact.get` - получить контакт
- `crm.contact.add` - создать контакт

**CRM - Компании:**
- `crm.company.list` - список компаний
- `crm.company.get` - получить компанию

---

## ✅ Преимущества

✅ **Защищен API ключом** - только авторизованные запросы  
✅ **Никакой настройки** - просто HTTP запросы с заголовком  
✅ **Работает из любого языка** - JavaScript, Python, PHP, curl  
✅ **Бесплатный хостинг** - Vercel Free tier  
✅ **Автоматический HTTPS** - безопасное соединение  
✅ **Не зависит от sandbox** - работает 24/7  
✅ **Webhook URL в секретах** - безопасное хранение  

---

## 🔐 Управление безопасностью

### Как изменить API ключ:

1. Сгенерировать новый ключ:
   ```bash
   node -e "console.log('btx24_' + require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Обновить в Vercel:
   - Dashboard → Settings → Environment Variables
   - Изменить значение `API_KEY`
   - Redeploy

3. Обновить во всех клиентах

### Как отозвать доступ:

Просто измените API ключ в Vercel - все старые ключи перестанут работать.

---

## 📚 Документация

- **GitHub:** https://github.com/team588/bitrix24-vercel-api
- **Vercel Dashboard:** https://vercel.com/team-7559s-projects/bitrix24-vercel-api
- **Bitrix24 REST API:** https://dev.1c-bitrix.ru/rest_help/

---

## 🎯 Использование в проектах Manus

В любой задаче проекта "Bitrix24" просто используйте API с ключом:

```javascript
const API_KEY = 'btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46';
const API_URL = 'https://bitrix24-vercel-api-vmxz.vercel.app/api';

const response = await fetch(`${API_URL}?method=user.current`, {
  headers: { 'X-API-Key': API_KEY }
});
const user = await response.json();
```

**Никакого клонирования модулей не требуется!** 🎉

---

**Дата создания:** 2026-01-05  
**Статус:** ✅ Production Ready & Secured  
**URL:** https://bitrix24-vercel-api-vmxz.vercel.app  
**API Key:** btx24_18cec47f86f4ec13bcea2f3f6a692b2a6cbe7e4b61bcd2cb986cdc4e90741e46
