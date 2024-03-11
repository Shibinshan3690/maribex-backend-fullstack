const express = require('express');
const { signupUser, loginUser, logoutUser, folloUnfollowUser,allUsers } = require('../../controller/authController');
const protectRoute = require('../../middleware/protectRout'); // Use require for CommonJS modules

const authRouter = express.Router();

// Define routes


authRouter.post("/signup", signupUser);
authRouter.post("/signin", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/users", allUsers);



authRouter.post("/follow/:id", protectRoute,folloUnfollowUser);









module.exports = authRouter;
