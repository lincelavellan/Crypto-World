import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import axios from "axios"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DIST_DIR = __dirname  // При запуске из dist/server.js это будет dist/

// Логируем для отладки
console.log(`📁 Serving static files from: ${DIST_DIR}`)

// Раздаём все файлы как статические (js, css, images и т.д.)
app.use(express.static(DIST_DIR))

// API proxy для geocoding
app.get('/api/geocode', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`,
      {
        headers: {
          'User-Agent': 'FastingTime/1.0 (Ramadan Prayer Times App)',
          'Accept': 'application/json'
        },
        timeout: 5000
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// API proxy для prayer times
app.get('/api/prayers', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) return res.status(400).json({ error: 'Missing latitude or longitude' });

  try {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`,
      {
        timeout: 5000
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Prayer times error:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// SPA fallback — всегда возвращаем index.html для маршрутов без расширения
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
