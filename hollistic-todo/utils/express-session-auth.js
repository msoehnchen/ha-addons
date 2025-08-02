
const express = require('express');
const session = require('express-session');
const { NiceLog, CreateServerOptions } = require('../utils/utils');

// Simple API token middleware
function requireApiToken(req, res, next) {
  const token = req.headers['x-api-token'];
  const validToken = process.env.DEBUG_API_TOKEN || 'your-secret-token'; // Set this in your environment

  if (token === validToken) {
    return next();
  } else {
    return res.status(401).json({ error: 'Unauthorized: Invalid API token / User not authenticated' });
  }
}

// Middleware to require login
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    NiceLog(`debug express-session-auth: session.user = ${req.session.user}`)
    return res.status(401).render('not-logged-in'); 
    //return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
}

module.exports = {
  requireApiToken,
  requireLogin
};