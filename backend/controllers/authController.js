const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { ApiError } = require("../middleware/errorHandler");
const { requireFields, validateEmail } = require("../middleware/validators");

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  requireFields(req.body, ["name", "email", "password"]);

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  if (role && !["USER", "ADMIN", "ORGANIZER"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const existingUser = await User.findOne({ email: String(email).toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || "USER",
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  requireFields(req.body, ["email", "password"]);

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

module.exports = {
  register,
  login,
};
