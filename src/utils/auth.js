const { sign, verify } = require('jsonwebtoken');
const { NotAuthError } = require('./errors');
require('dotenv').config();
const userModel = require('../models/userModel');

const KEY = process.env.SECRET_KEY;
const EXPIRE_TIME = process.env.EXPIRE_TIME;

function createJSONToken(user) {
  return sign({ id: user.id }, KEY, { expiresIn: EXPIRE_TIME });
}

function validateJSONToken(token) {
  return verify(token, KEY);
}
function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

async function checkAuthMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('Missing auth header');
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const jwtToken = req.headers.authorization.split(' ')[1];
  try {
    const jwtPayload = validateJSONToken(jwtToken);
    const user = (await userModel.getUserById(jwtPayload.id))[0];
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    req.user = user;
    next();
  } catch {
    console.log('Error validating auth token');
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

async function checkAuthStaffMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('Missing auth header');
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const jwtToken = req.headers.authorization.split(' ')[1];
  try {
    const jwtPayload = validateJSONToken(jwtToken);
    const user = (await userModel.getUserById(jwtPayload.id))[0];
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (user.role === 'user') {
      console.log('User is not a staff');
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch {
    console.log('Error validating auth token');
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

async function checkAuthAdminMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('Missing auth header');
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const jwtToken = req.headers.authorization.split(' ')[1];
  try {
    const jwtPayload = validateJSONToken(jwtToken);
    const user = (await userModel.getUserById(jwtPayload.id))[0];
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (user.role !== 'admin') {
      console.log('User is not a admin');
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch {
    console.log('Error validating auth token');
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

module.exports = {
  createJSONToken,
  validateJSONToken,
  parseJwt,
  checkAuthMiddleware,
  checkAuthStaffMiddleware,
  checkAuthAdminMiddleware,
};
