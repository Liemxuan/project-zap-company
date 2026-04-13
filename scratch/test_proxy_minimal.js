const axios = require('axios');

async function testApi() {
  const url = 'http://localhost:3000/api/proxy/crm-gateway/locations/list';
  const data = {
    page_index: 1,
    page_size: 10,
    search: ''
    // omit filters entirely
  };

  try {
    const response = await axios.post(url, data);
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Error Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
  }
}

testApi();
