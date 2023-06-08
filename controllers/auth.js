const User = require("../models/user.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../helpers/auth.js");

require("dotenv").config();

exports.register = async (req, res) => {
  try {
    // 1. destructure name, email, password from req.body
    const { name, email, password } = req.body;

    // 2. all fields require validation
    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }

    // 3. check if email is taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ error: "Email is taken" });
    }

    // 4. hash password
    const hashedPassword = await hashPassword(password);

    // 5. register user
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();

    // 7. send response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Registration Failed" });
  }
};

exports.login = async (req, res) => {
  try {
    // 1. destructure name, email, password from req.body
    const { email, password } = req.body;
    // 2. all fields require validation
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }
    // 3. check if email is taken
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    // 4. compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Invalid email or password" });
    }
    // 5. create signed jwt
    const token = generateToken(user._id, process.env.JWT_SECRET);

    // 7. send response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Login Failed" });
  }
};
