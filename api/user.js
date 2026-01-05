/**
 * Shortcut: Get current user
 * GET /api/user
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const WEBHOOK_URL = process.env.BITRIX24_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: 'BITRIX24_WEBHOOK_URL not configured' });
  }

  try {
    const response = await fetch(`${WEBHOOK_URL}user.current.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
