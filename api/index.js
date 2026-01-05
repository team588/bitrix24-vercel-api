/**
 * Bitrix24 API Proxy - Main Endpoint
 * Hosted on Vercel
 */

import { verifyApiKey } from '../lib/auth.js';

export default async function handler(req, res) {
  // Verify API Key
  if (!verifyApiKey(req, res)) {
    return; // Response already sent by verifyApiKey
  }
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Webhook URL из environment variable
  const WEBHOOK_URL = process.env.BITRIX24_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return res.status(500).json({
      error: 'BITRIX24_WEBHOOK_URL not configured'
    });
  }

  // Получить метод и параметры из запроса
  const { method, params } = req.method === 'GET' ? req.query : req.body;

  if (!method) {
    return res.status(200).json({
      name: 'Bitrix24 API Proxy',
      version: '2.0.0',
      security: 'API Key Required (X-API-Key header)',
      usage: {
        endpoint: '/api',
        methods: ['GET', 'POST'],
        examples: {
          get: '/api?method=user.current',
          post: {
            method: 'crm.lead.list',
            params: { filter: { STATUS_ID: 'NEW' } }
          }
        },
        shortcuts: {
          '/api/user': 'Get current user',
          '/api/tasks': 'Get tasks',
          '/api/leads': 'Get leads',
          '/api/deals': 'Get deals'
        }
      }
    });
  }

  try {
    // Вызвать Bitrix24 API
    const apiUrl = `${WEBHOOK_URL}${method}.json`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });

    const data = await response.json();

    // Вернуть результат
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
