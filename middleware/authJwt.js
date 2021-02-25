const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    if (req.id == decoded.id) {
      req.id = decoded.id;
      console.log("Token is valid");
    }
    
    next();
  });
};
