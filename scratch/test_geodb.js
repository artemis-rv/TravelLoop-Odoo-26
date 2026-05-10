const axios = require('axios');
require('dotenv').config({ path: '../backend/.env' });

async function testGeoDB() {
  const apiKey = process.env.GEODB_API_KEY;
  const apiHost = "wft-geo-db.p.rapidapi.com";
  
  console.log('Testing GeoDB with key:', apiKey?.substring(0, 5) + '...');
  
  try {
    const response = await axios.get(`https://${apiHost}/v1/geo/cities`, {
      params: { namePrefix: 'Goa', limit: 5 },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      },
      timeout: 5000
    });
    console.log('Success! Found:', response.data.data.map(c => c.name).join(', '));
  } catch (err) {
    console.error('Failed:', err.response?.data?.message || err.message);
  }
}

testGeoDB();
