const { verify } = require('jsonwebtoken');

const isAuth = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) throw new Error('You need to login.');
  // Based on 'Bearer ksfljrewori384328289398432'
  const token = authorization.split(' ')[1];
  const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
  return userId;
};


//My code
function verifyToken(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send('Unauthorized access.');
	}
	let token = req.headers.authorization.split(' ')[1];
	if (token == 'null') {
		return res.status(401).send('Unauthorized access.');
	}
	let payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
	if (payload) {
		return res.status(401).send('Unauthorized access.');
	}
	req.userId = payload.subject;
	next();
}

module.exports = {
  isAuth,
  verifyToken
};
