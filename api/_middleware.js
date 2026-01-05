/**
 * API Key Authentication Middleware
 * Проверяет наличие и корректность API ключа в заголовке X-API-Key
 */

export default async function middleware(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Получить API ключ из environment variable
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: 'API_KEY not configured on server'
    });
  }

  // Получить API ключ из заголовка запроса
  const providedKey = req.headers['x-api-key'];

  // Проверить наличие ключа
  if (!providedKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required. Please provide X-API-Key header.',
      documentation: 'https://github.com/team588/bitrix24-vercel-api#authentication'
    });
  }

  // Проверить корректность ключа
  if (providedKey !== API_KEY) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key',
      documentation: 'https://github.com/team588/bitrix24-vercel-api#authentication'
    });
  }

  // Ключ корректен - продолжить выполнение
  return;
}
