import express from 'express';
import fetch from 'node-fetch';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 3000;

const BCV_URL = 'https://www.bcv.org.ve/';

// Create an HTTPS agent to disable SSL verification
const agent = new https.Agent({
  rejectUnauthorized: false, // Disable SSL verification
});

app.get('/api/rate', async (req, res) => {
  try {
    const response = await fetch(BCV_URL, { agent }); // Use the agent here
    const html = await response.text();

    console.log(html); // Log the HTML response for debugging

    // Updated regex to match the new structure
    const regex = /<div class="col-sm-6 col-xs-6 centrado">\s*<strong>\s*([\d.,]+)\s*<\/strong>/;
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