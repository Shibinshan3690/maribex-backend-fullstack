const express = require('express');
const { signupUser,loginUser,logoutUser } = require('../../controller/authController'); // Import functions from authController
const authRouter = express.Router();

// Define routes
authRouter.post("/signup", signupUser);
authRouter.post("/signin", loginUser);
authRouter.post("/logout",logoutUser);



// authRouter.post("/reset-password");
// authRouter.post("/new-password");

// authRouter.post("/refresh_token", refreshToken);
// authRouter.get("/logout");

module.exports = authRouter;
