const axios = require('axios');

async function testApi() {
  const url = 'http://localhost:3000/api/proxy/crm-gateway/locations/list';
  const data = {
    page_index: 1,
    page_size: 10,
    search: '',
    filters: {
        status_id: null,
        province_id: null,
        location_type_id: null
    }
  };

  try {
    console.log('Testing URL:', url);
    console.log('Data:', JSON.stringify(data));
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error Message:', error.message);
    }
  }
}

testApi();
