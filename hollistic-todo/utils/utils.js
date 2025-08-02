const fs = require('fs');
const path = require('path');

/**
 * Logs a message with a timestamp.
 * @param {string} message
 */
function NiceLog(message) {
  const now = new Date();
  const timestamp = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Reads the version from config.yaml.
 * @returns {string}
 */
function ReadVersionFromAddonConfig() {
  const configPath = path.join(__dirname, '../config.yaml');
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const versionMatch = configContent.match(/version:\s*["']?([\d.]+[-]?[a-z]+)["']?/);
    if (versionMatch) {
      return versionMatch[1];
    }
  }
  return 'unknown';
}

/**
 * Creates server options for HTTPS.
 * @returns {{ options: object, flag_enable_https: boolean }}
 */
function CreateServerOptions() {
  let options = {};
  let flag_enable_https = false;
  let flag_enable_http = true; // Default to true unless HTTPS is enabled

  NiceLog('utils/CreateServerOptions called');
  NiceLog(`Checking for SSL certificates... root: ${GetCurrentDirectory()}`);

  if (fs.existsSync('/ssl/privkey.pem') && fs.existsSync('/ssl/fullchain.pem')) {
    NiceLog('Using SSL certificates from /ssl folder');
    options = {
      key: fs.readFileSync('/ssl/privkey.pem'),
      cert: fs.readFileSync('/ssl/fullchain.pem')
    };
    flag_enable_https = true;
    flag_enable_http  = false; 

  } else if (fs.existsSync('/config/key.pem') && fs.existsSync('/config/cert.pem')) {
    NiceLog('Using SSL certificates from /config folder');
    options = {
      key: fs.readFileSync('/config/key.pem'),
      cert: fs.readFileSync('/config/cert.pem')
    };
    flag_enable_https = true;
    flag_enable_http  = false;

  } else if (fs.existsSync(GetCurrentDirectory() + '/config/key.pem') && fs.existsSync(GetCurrentDirectory() + '/config/cert.pem')) {
    NiceLog('Using SSL certificates from local config folder (local node.js test)');
    options = {
      key: fs.readFileSync(GetCurrentDirectory() + '/config/key.pem'),
      cert: fs.readFileSync(GetCurrentDirectory() + '/config/cert.pem')
    };
    flag_enable_https = true;
    flag_enable_http  = true;
    
  } else {
    NiceLog('No SSL certificates found, disabling HTTPS');
    flag_enable_https = false;
    flag_enable_http = true; // Enable HTTP by default if no SSL is found
  };

  return { options, flag_enable_https, flag_enable_http };

}
/** * Gets the current directory of the main module. Mainly used for local testing.
 * This is useful for reading local files in the same directory as the main module.
 * @returns {string}
 * */
function GetCurrentDirectory() {
  return path.dirname(require.main.filename);
}

module.exports = {
  NiceLog,
  CreateServerOptions,
  ReadVersionFromAddonConfig,
  GetCurrentDirectory
};