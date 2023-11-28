const { sign, verify } = require('jsonwebtoken');
const { NotAuthError } = require('./errors');

const KEY = 'supersecret123';


function createJSONToken(user) {
  return sign(user, KEY, { expiresIn: '1d' });
}

function validateJSONToken(token) {
  return verify(token, KEY);
}
function parseJwt (token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function checkAuthMiddleware(req, res, next) {
  if (req.method === 'OPTIONS'){
    return next();
  }
  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    return res.status(401).json({msg: "Not authenticated."});
  }
  const authFragments = req.headers.authorization.split(' ');
  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return res.status(401).json({msg: "Not authenticated."});
  }
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return res.status(401).json({msg: "Not authenticated."});
  }
  next();
}

function checkAuthAdminMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    return res.status(401).json({msg: "Not authenticated."});
  }
  const authFragments = req.headers.authorization.split(' ');
  let isAdmin = parseJwt(authFragments[1]).isAdmin;
  if (!isAdmin) return res.status(401).json({ msg: "Not authenticated." });
  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return res.status(401).json({msg: "Not authenticated."});
  }
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return res.status(401).json({msg: "Not authenticated."});
  }
  next();
}

module.exports = {
  createJSONToken,
  validateJSONToken,
  parseJwt,
  checkAuthMiddleware,
  checkAuthAdminMiddleware,
};
