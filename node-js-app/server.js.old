const http = require('http');
const os = require('os');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Get the hostname of the server (name of the pod)
  const hostname = os.hostname();

  // Get the name of the worker node from the environment variable
  const nodeName = process.env.NODENAME || 'Unknown';

  // Send the hostname and worker node name as the response
  res.end(`Pod Hostname: ${hostname}\nWorker Node: ${nodeName}`);
});

// Listen on port 80
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
