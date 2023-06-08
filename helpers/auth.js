const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

exports.comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

exports.generateToken = (userId, secretKey) => {
  // Payload to be included in the token
  const payload = {
    userId: userId,
  };

  // Options for token generation
  const options = {
    expiresIn: "7d", // Token expiration time
  };

  // Generate the token
  const token = jwt.sign(payload, secretKey, options);

  return token;
};
