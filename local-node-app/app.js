const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');
const app = express();
const port = 3000;
const httpsPort = 3443;

const { NiceLog, ReadVersionFromAddonConfig, CreateServerOptions, GetCurrentDirectory } = require('./utils');

NiceLog('Starting Local Node App...');

const ServerOptions = CreateServerOptions();

NiceLog(`Server options created: ${ServerOptions}`);

// Middleware to serve static files (if needed)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.get('/', (req, res) => {
  NiceLog('Serving landing page');
  res.render('index', { version: ReadVersionFromAddonConfig() });
});


app.get('/info', (req, res) => {
  NiceLog('Serving info page');
  fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory<a href="/">Back to Home</a></p>');
    }

    res.render('info', { files });
  });
});


app.get('/info2', (req, res) => {
  const configPath = '/config';
  
  fs.readdir(configPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading /config folder<a href="/">Back to Home</a></p>');
    }

    res.render('info', { files });
  });
});

app.get('/info3', (req, res) => {
  const configPath = '/ssl';
  
  fs.readdir(configPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading /ssl folder<br><a href="/">Back to Home</a></p>');
    }

    res.render('info', { files });
  });
});


// Start HTTP server
if (ServerOptions.flag_enable_http) {
  app.listen(port, () => {
    NiceLog(`HTTP server running at http://localhost:${port}`);
  });
} else {
  NiceLog('HTTP server is disabled');
};


if (ServerOptions.flag_enable_https) {
  NiceLog('HTTPS is enabled, starting HTTPS server...');
  
  // Start HTTPS server
  https.createServer(ServerOptions.options, app).listen(httpsPort, () => {
    NiceLog(`HTTPS server running at https://localhost:${httpsPort}`);
  });

} else {
  NiceLog('HTTPS server is disabled');
};