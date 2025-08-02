const { NiceLog } = require('../utils/utils');
const path = require('path');
const fs = require('fs');

// Read version from addon config.yaml
function ReadVersionFromAddonConfig() {
  const configFile = 'config.yaml';
  if (fs.existsSync(configFile)) {
    const file = fs.readFileSync(configFile, 'utf8');
    const match = file.match(/version:\s*(.+)/);
    if (match) {
      const version = match[1].replace(/['"]/g, '').trim();
      NiceLog(`Debug ha-utils:  ReadVersionFromAddonConfig() found in ${configFile}: ${version}`);
      return version;
    }
  }
  NiceLog(`Debug ha-utils: Version not found in ${configFile}.`);
  return 'unknown';
}

// find OS version from host OS
function getHostOSVersion() {
  const osVersion = process.platform;
  NiceLog(`Debug ha-utils: Host OS version is ${osVersion}`);
  return osVersion;
}

// find host OS hostname
function getHostOSHostname() {
  const hostname = require('os').hostname();
  NiceLog(`Debug ha-utils: Host OS hostname is ${hostname}`);
  return hostname;
}

// check if host is running in Docker
function isRunningInDocker() {
  const dockerFile = '/.dockerenv';
  if (fs.existsSync(dockerFile)) {
    NiceLog(`Debug ha-utils: Running in Docker environment`);
    return true;
  }
  NiceLog(`Debug ha-utils: Not running in Docker environment`);
  return false;
}

// check if hostname is 9d78eb51-hollistic-todo
function isHostnameHollisticTodo() {
  const hostname = getHostOSHostname();
  if (hostname === '9d78eb51-hollistic-todo') {
    NiceLog(`Debug ha-utils: Hostname is 9d78eb51-hollistic-todo`);
    return true;
  }
  NiceLog(`Debug ha-utils: Hostname is not 9d78eb51-hollistic-todo, but ${hostname}`);
  return false;
}

// function to check if a directory exists
function directoryExists(dirPath) { 
  try {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

function TestDirectoryExists(dirPath) {
  if (directoryExists(dirPath)) {
    NiceLog(`Debug ha-utils: Directory exists: ${dirPath}`);
    return true;
  } else {
    NiceLog(`Debug ha-utils: Directory does not exist: ${dirPath}`);
    return false;
  }
}

// read options.json from /data folder
function getAddonOptions() {
  if (isRunningInDocker() && isHostnameHollisticTodo()) {
    try {
      const optionsFile = path.join('/data', 'options.json');
      if (fs.existsSync(optionsFile)) {
        const file = fs.readFileSync(optionsFile, 'utf8');
        return JSON.parse(file);
      } else {
        NiceLog(`Debug ha-utils: Options file not found at ${optionsFile}. Returning empty object.`);
        return {};
      }
    } catch (error) {
      NiceLog(`Debug ha-utils: Error reading options file: ${error.message}`);
      return {};
    }
  } else {
    NiceLog(`Debug ha-utils: Not running in Docker within Home Assistant, using default options.`);
    return { "admin_user": "localdefaultuser", "admin_password": "localdefaultpassword", "api_token": "localdefaulttoken" };
  }
}

// function to set the environment variable for the API token
function setApiTokenFromOptions() {
  const apiToken = getAddonOptions().api_token;
  process.env.DEBUG_API_TOKEN = apiToken;
  NiceLog(`Debug ha-utils: API token set to: ${apiToken}`);
}

module.exports = {
    directoryExists,
    TestDirectoryExists,
    getAddonOptions,
    getHostOSVersion,
    getHostOSHostname,
    ReadVersionFromAddonConfig,
    isRunningInDocker,
    isHostnameHollisticTodo,
    setApiTokenFromOptions
};