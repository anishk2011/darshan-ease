const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ApiError } = require("./errorHandler");
const asyncHandler = require("./asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    throw new ApiError(401, "Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.userId).select("-passwordHash");
  if (!user) {
    throw new ApiError(401, "User not found for token");
  }

  req.user = user;
  next();
});

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient role"));
    }

    next();
  };
}

module.exports = {
  requireAuth,
  allowRoles,
};
