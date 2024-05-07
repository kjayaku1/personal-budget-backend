const RegisterRouter = require("express").Router();
const {
  RegisterUser,
} = require("../controllers/register");

RegisterRouter.post("/", RegisterUser);


module.exports = RegisterRouter;
