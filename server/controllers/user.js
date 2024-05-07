const User = require("../models/register.model");


let GetUserData = async (req, res) => {
  try {
    let user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "User not registered" });
  }
};

let EditUserDetails = async (req, res) => {
  let { username } = req.body;

  User.findById(req.userId)
    .then(async (user) => {
      if (username) {
        user.username = username;
      }
      user
        .save()
        .then(() => {
          res.status(200).json({ message: "User updated successfully" });
        })
        .catch((error) => {
          res.status(400).json({ message: "User not updated" });
        });
    })
    .catch((error) => {
      res.status(400).json({ message: "User not registered" });
    });
};

module.exports = {
  GetUserData,
  EditUserDetails,
};
