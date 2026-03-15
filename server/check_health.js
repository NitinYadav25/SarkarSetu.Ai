const http = require('http');

http.get('http://localhost:5000/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Server is UP and breathing:');
    console.log(JSON.parse(data));
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('SERVER IS DOWN OR UNREACHABLE:', err.message);
  process.exit(1);
});
