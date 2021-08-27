require("dotenv").config();
const jwt = require("jsonwebtoken");
const RedisDB = require("../database/redis/redis.js");
const responseError = {
    status: 401,
    error: "Invalid Token",
    payload: null
}
let userId;
const verifyToken = (request, response, next) => {

  // Take the token from authorization header
  const bearerHeader = request.headers["authorization"];

  if (!bearerHeader) {
      next(responseError);
  }

  const bearerToken = bearerHeader.split(" ")[1];

  req.token = bearerToken;
  // Verify the token
  jwt.verify(token, process.env.secret_token, (error, decoded) => {
    if (error) {
        next(responseError);
    } else {
      // Append the parameters to the request object
      request.userId = decoded._id;
      request.tokenExp = decoded.exp;
      request.token = token;

      // assign userId to decoded userId to use in redisDB
      userId = decoded._id;
      RedisDB.client.get(token, (err, reply) => {
        if (err) {
            const error = {
                status: 403,
                error: "Invalid Token",
                payload: null
            }
            next(error);
        }
        if (reply.split('-')[0] === userId) {
            request.role = reply.split('-')[1];
          next();
        }
      });
    }
  });
};

module.exports = verifyToken;
