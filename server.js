const http = require('http');
const os = require('os');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Get the hostname of the server
  const hostname = os.hostname();

  // Send the hostname as the response
  res.end(`Hostname: ${hostname}`);
});

// Listen on port 80
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

