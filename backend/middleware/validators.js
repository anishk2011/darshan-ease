const mongoose = require("mongoose");
const { ApiError } = require("./errorHandler");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function requireFields(body, fields) {
  for (const field of fields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      String(body[field]).trim() === ""
    ) {
      throw new ApiError(400, `${field} is required`);
    }
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

module.exports = {
  isValidObjectId,
  requireFields,
  validateEmail,
};
