const { Router, request } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");

userRouter.get("/sign-up", userController.getSignUp);

userRouter.get("/log-out", userController.getLogOut);

userRouter.post("/sign-up", userController.postSignUp);

module.exports = userRouter;