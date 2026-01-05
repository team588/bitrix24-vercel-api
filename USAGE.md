# Bitrix24 API - Руководство по использованию

## 🎉 API успешно задеплоен и работает!

**Production URL:**
```
https://bitrix24-vercel-api-vmxz.vercel.app
```

---

## 🚀 Быстрый старт

### Получить текущего пользователя

```bash
curl "https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current"
```

**Ответ:**
```json
{
  "result": {
    "ID": "3",
    "NAME": "Alexander",
    "LAST_NAME": "Wirt",
    "EMAIL": "alexanderwirt@gmail.com",
    "ACTIVE": true
  }
}
```

### Получить просроченные задачи

```bash
curl -X POST "https://bitrix24-vercel-api-vmxz.vercel.app/api" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tasks.task.list",
    "params": {
      "filter": {
        "<DEADLINE": "2026-01-05T00:00:00"
      },
      "select": ["ID", "TITLE", "DEADLINE"]
    }
  }'
```

---

## 📖 API Endpoints

### Универсальный endpoint

**POST** `/api`

Вызвать любой метод Bitrix24 REST API.

**Параметры:**
- `method` (string) - название метода Bitrix24 API
- `params` (object) - параметры метода

**Пример:**
```javascript
const response = await fetch('https://bitrix24-vercel-api-vmxz.vercel.app/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    method: 'crm.lead.list',
    params: {
      filter: { STATUS_ID: 'NEW' },
      select: ['ID', 'TITLE', 'NAME', 'EMAIL']
    }
  })
});

const data = await response.json();
console.log(data.result);
```

### GET вариант

**GET** `/api?method=METHOD_NAME`

**Пример:**
```bash
curl "https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current"
```

---

## 💻 Примеры использования

### JavaScript/Node.js

```javascript
// Получить текущего пользователя
async function getCurrentUser() {
  const response = await fetch(
    'https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current'
  );
  const data = await response.json();
  return data.result;
}

// Получить просроченные задачи
async function getOverdueTasks() {
  const response = await fetch(
    'https://bitrix24-vercel-api-vmxz.vercel.app/api',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'tasks.task.list',
        params: {
          filter: {
            '<DEADLINE': new Date().toISOString(),
            '!STATUS': [4, 5, 6, 7] // Не завершенные
          },
          select: ['ID', 'TITLE', 'RESPONSIBLE_ID', 'DEADLINE']
        }
      })
    }
  );
  const data = await response.json();
  return data.result.tasks;
}

// Получить новые лиды
async function getNewLeads() {
  const response = await fetch(
    'https://bitrix24-vercel-api-vmxz.vercel.app/api',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'crm.lead.list',
        params: {
          filter: { STATUS_ID: 'NEW' },
          select: ['ID', 'TITLE', 'NAME', 'EMAIL', 'PHONE']
        }
      })
    }
  );
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

API_URL = 'https://bitrix24-vercel-api-vmxz.vercel.app/api'

# Получить текущего пользователя
def get_current_user():
    response = requests.get(f"{API_URL}?method=user.current")
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
    response = requests.post(API_URL, json=payload)
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
    response = requests.post(API_URL, json=payload)
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
# Получить текущего пользователя
curl "https://bitrix24-vercel-api-vmxz.vercel.app/api?method=user.current"

# Получить просроченные задачи
curl -X POST "https://bitrix24-vercel-api-vmxz.vercel.app/api" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tasks.task.list",
    "params": {
      "filter": {
        "<DEADLINE": "2026-01-05T00:00:00"
      }
    }
  }'

# Получить новые лиды
curl -X POST "https://bitrix24-vercel-api-vmxz.vercel.app/api" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "crm.lead.list",
    "params": {
      "filter": {"STATUS_ID": "NEW"}
    }
  }'

# Получить сделки
curl -X POST "https://bitrix24-vercel-api-vmxz.vercel.app/api" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "crm.deal.list",
    "params": {
      "filter": {"STAGE_ID": "C1:NEW"}
    }
  }'
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

✅ **Никакой настройки** - просто HTTP запросы  
✅ **Работает из любого языка** - JavaScript, Python, PHP, curl  
✅ **Бесплатный хостинг** - Vercel Free tier  
✅ **Автоматический HTTPS** - безопасное соединение  
✅ **Не зависит от sandbox** - работает 24/7  
✅ **Публичный доступ** - можно использовать откуда угодно  
✅ **Webhook URL в секретах** - безопасное хранение  

---

## 🔐 Безопасность

- Webhook URL хранится в environment variables Vercel (зашифрован)
- CORS включен для всех origins
- Все запросы проходят через HTTPS
- API доступен публично (без аутентификации)

⚠️ **Важно:** Не передавайте URL API третьим лицам, так как он дает полный доступ к вашему Bitrix24.

---

## 📚 Документация

- **GitHub:** https://github.com/team588/bitrix24-vercel-api
- **Vercel Dashboard:** https://vercel.com/team-7559s-projects/bitrix24-vercel-api
- **Bitrix24 REST API:** https://dev.1c-bitrix.ru/rest_help/

---

## 🎯 Использование в проектах Manus

В любой задаче проекта "Bitrix24" просто используйте API:

```javascript
// В вашем коде
const API_URL = 'https://bitrix24-vercel-api-vmxz.vercel.app/api';

const response = await fetch(`${API_URL}?method=user.current`);
const user = await response.json();
```

**Никакого клонирования модулей не требуется!** 🎉

---

**Дата создания:** 2026-01-05  
**Статус:** ✅ Production Ready  
**URL:** https://bitrix24-vercel-api-vmxz.vercel.app
