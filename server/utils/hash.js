const bcrypt = require("bcrypt");

async function hashPassword(plaintextPassword) {
  // Store hash in the database
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plaintextPassword, salt);
    return hashed;
  } catch (err) {
    return err;
  }
}
async function comparePassword(plaintextPassword, hashedPassword) {
  // compare password
  // const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.compare(plaintextPassword, hashedPassword);
  return result;
}

module.exports = { hashPassword, comparePassword };