const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');
const session = require('express-session');
const { requireApiToken, requireLogin } = require('./utils/express-session-auth');
const todosRouter = require('./routes/todos-routes');
const debugRouter = require('./routes/debug-routes');
const loginRouter = require('./routes/login-routes');
const hautils = require('./utils/ha-utils');
const userDb = require('./db/user-db');

const port = 3000;
const httpsPort = 3443;

const { NiceLog, ReadVersionFromAddonConfig, CreateServerOptions, GetCurrentDirectory } = require('./utils/utils');
NiceLog('');
NiceLog('Starting Hollistic To-Do App...');

NiceLog('Debug app.js: checking directories...');
hautils.TestDirectoryExists('/config');
hautils.TestDirectoryExists('/ssl');
hautils.TestDirectoryExists('/data');
hautils.TestDirectoryExists('/media');
hautils.TestDirectoryExists('/share');
hautils.TestDirectoryExists('/nonexistingdir');

NiceLog('Debug app.js: read options from /data/options.json ...');
NiceLog(`Debug app.js: ha-utils.getAddonOptions: ${JSON.stringify(hautils.getAddonOptions())}`);
NiceLog(`Dubug app.js: Set API token from options...`);
hautils.setApiTokenFromOptions(); // Set the API token from options
NiceLog(`Debug app.js: ha-utils.getHostOSVersion: ${hautils.getHostOSVersion()}`);
NiceLog(`Debug app.js: ha-utils.getHostOSHostname: ${hautils.getHostOSHostname()}`);
NiceLog(`Debug app.js: ha-utils.isRunningInDocker: ${hautils.isRunningInDocker()}`);
NiceLog(`Debug app.js: ha-utils.isHostnameHollisticTodo: ${hautils.isHostnameHollisticTodo()}`);

const ServerOptions = CreateServerOptions();

NiceLog(`Server options created: ${ServerOptions}`);

// Middleware to serve static files (if needed)
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: ServerOptions.flag_enable_https } // Set to true if using HTTPS
}));



app.use('/login', loginRouter)
app.use('/todos', todosRouter);
app.use('/debug', debugRouter);

app.get('/', requireLogin, (req, res) => {
  NiceLog('Serving landing page');
  res.render('index', { version: ReadVersionFromAddonConfig() });
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