require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'your_api_key_here';

let cachedSapData = null;

app.use(express.json({ limit: '5mb' }));


// Middleware to check API key
function checkApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Endpoint to update SAP data (called by your internal script) comment added
app.post('/update-sap-data', checkApiKey, (req, res) => {
  // Store only the important part: d.results (array of orders)
  cachedSapData = req.body?.d?.results || req.body;
  console.log('SAP data updated at', new Date());
  res.json({ message: 'Data updated successfully' });
});


// Endpoint to get cached SAP data (Apps Script will call this)
app.get('/sap-data', (req, res) => {
  if (cachedSapData) {
    res.json(cachedSapData);
  } else {
    res.status(404).json({ error: 'No data available yet' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
