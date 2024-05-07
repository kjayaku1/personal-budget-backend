const NotificationRouter = require("express").Router();
const User = require("../models/register.model");
const errorMessages = require("../utils/validationErrMsg");
const { sendNotificationMailer } = require("../services/sendMail");

NotificationRouter.post("/", async (req, res) => {
  try {
    const allUsers = await User.find({ validUser: true }, { email: 1, _id: 0 });
    if (allUsers.length > 0) {
      const allEmails = allUsers.map((user) => user.email);
      // console.log(allEmails);
      //   await sendNotificationMailer({
      //     to: allEmails,
      //   });
      res.status(200).json({ message: "Bulk notification send successfully" });
    } else {
      res.status(400).json({ message: "No emails found" });
    }
  } catch (err) {
    res.status(400).json({ message: errorMessages(error) });
  }
});

module.exports = NotificationRouter;
