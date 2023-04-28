const { sign } = require('jsonwebtoken');

// Create tokens
// ----------------------------------
const createAccessToken = userId => {
  const token = sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_INTERVAL,
  });
  console.log(token)
  return token;
};

const createRefreshToken = userId => {
  const token = sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_INTERVAL,
  });
  return token;
};

// Send tokens
// ----------------------------------
const sendAccessToken = (res, req, accesstoken) => {
  res.send({
    accesstoken,
    email: req.body.email,
  });
};

const sendRefreshToken = (res, token) => {
  res.cookie('refreshtoken', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};