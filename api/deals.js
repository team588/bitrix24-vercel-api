/**
 * Shortcut: Get deals
 * GET /api/deals?filter[STAGE_ID]=C1:NEW
 * POST /api/deals with body: { filter: { ... }, select: [...] }
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const WEBHOOK_URL = process.env.BITRIX24_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: 'BITRIX24_WEBHOOK_URL not configured' });
  }

  let params = {};
  
  if (req.method === 'GET') {
    const filter = {};
    const select = [];
    
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('filter[')) {
        const filterKey = key.match(/filter\[(.+)\]/)[1];
        filter[filterKey] = req.query[key];
      } else if (key.startsWith('select[')) {
        select.push(req.query[key]);
      }
    });
    
    if (Object.keys(filter).length > 0) params.filter = filter;
    if (select.length > 0) params.select = select;
  } else {
    params = req.body || {};
  }

  try {
    const response = await fetch(`${WEBHOOK_URL}crm.deal.list.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
