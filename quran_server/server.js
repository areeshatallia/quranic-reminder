// 1. Server ko import karo
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// 2. App setup
const app = express();
const PORT = 3000;

// 3. CORS allow karo (taake browser block na kare)
app.use(cors());

// 4. API route
app.get('/tafseer/:ayahNumber', async (req, res) => {
  const ayahNumber = req.params.ayahNumber;

  try {
    // Quran Tafseer API ko call karo
    const response = await axios.get(`https://api.quran.com:443/v4/verses/${ayahNumber}/tafsirs`);

    // Data bhej do user ko
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tafseer:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafseer' });
  }
});

// 5. Server run karo
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
