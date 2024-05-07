const UserRouter = require("express").Router();
const requireLogin = require("../middleware/requireLogin");
const { GetUserData, EditUserDetails } = require("../controllers/user");

UserRouter.get("/", requireLogin, GetUserData);

UserRouter.post("/edit", requireLogin, EditUserDetails);

module.exports = UserRouter;
