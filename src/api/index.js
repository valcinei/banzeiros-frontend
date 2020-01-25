const axios = require('axios').default;
export default axios.create({
    baseURL: 'http://localhost:1717/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'Vai'}
  });
