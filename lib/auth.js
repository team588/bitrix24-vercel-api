/**
 * API Key Authentication Helper
 */

export function verifyApiKey(req, res) {
  // Получить API ключ из environment variable
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    res.status(500).json({
      error: 'API_KEY not configured on server'
    });
    return false;
  }

  // Получить API ключ из заголовка запроса
  const providedKey = req.headers['x-api-key'];

  // Проверить наличие ключа
  if (!providedKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required. Please provide X-API-Key header.',
      example: 'curl -H "X-API-Key: your_api_key" https://...'
    });
    return false;
  }

  // Проверить корректность ключа
  if (providedKey !== API_KEY) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
    return false;
  }

  // Ключ корректен
  return true;
}
