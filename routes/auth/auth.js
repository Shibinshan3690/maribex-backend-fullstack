const express = require('express');
const { signupUser, loginUser, logoutUser, userFollow,allUsers,getUserProfile } = require('../../controller/authController');
const protectRoute = require('../../middleware/protectRout'); // Use require for CommonJS modules

const authRouter = express.Router();

// Define routes


authRouter.post("/signup", signupUser);
authRouter.post("/signin", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/users", allUsers);
authRouter.get("/getUser/:id",getUserProfile)
authRouter.post('/follow/:id',(userFollow))



authRouter.post("/follow/:id", protectRoute,userFollow);









module.exports = authRouter;
