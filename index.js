import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const BCV_URL = 'https://www.bcv.org.ve/';

app.get('/api/rate', async (req, res) => {
  try {
    const response = await fetch(BCV_URL);
    const html = await response.text();

    const regex = /Dólar estadounidense<\/strong><\/td>\s*<td[^>]*>([\d,]+)<\/td>/;
    const match = html.match(regex);

    if (!match) throw new Error("No se pudo extraer la tasa BCV");

    const rate = parseFloat(match[1].replace(',', '.'));
    res.json({ rate });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo tasa BCV', details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BCV proxy running on port ${PORT}`);
});