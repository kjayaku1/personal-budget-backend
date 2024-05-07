const jwt = require("jsonwebtoken");
const User = require("../models/register.model");

const secret = process.env.JWT_SECRET || 'qwertyuiopasdfghjklzxcvbnm1234567890';
const refreshSecret = process.env.REFRESH_SECRET || 'poiuytrewqlkjhgfdsa0987654321';

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(422).json({
      message: "No headers provided",
    });
  }

  //Get the token from the authorization bearer
  const token = authorization.replace("Bearer ", "");

  //Verifying the user token for accessing the protected pages
  try {
    let payload = await jwt.verify(token, secret);
    //Payload given at the time of signing in
    const { _id } = payload;
    let user = await User.findById({ _id });
    if (!user || user.userType > 0){
        return res.status(422).json({ message: "You logged as unauthorized user" });
        
    }

    req.userId = user._id;
    next();
  } catch (err) {
    res.status(422).json({ message: "You must be logged in" });
  }
};
