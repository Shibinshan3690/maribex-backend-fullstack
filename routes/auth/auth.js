const express = require('express');
const { signupUser, loginUser, logoutUser, userFollow,allUsers,getUserProfile,updateUserProfile } = require('../../controller/authController');
const protectRoute = require('../../middleware/protectRout'); // Use require for CommonJS modules
const  uploadImage = require('../../middleware/imageUpload');
const authRouter = express.Router();
const  userController=require("../../routes/auth/auth");



authRouter.post("/signup", signupUser);
authRouter.post("/signin", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/users", allUsers);
authRouter.get("/getUser/:id",getUserProfile)
authRouter.post('/follow/:id',userFollow)
// authRouter.patch("/updateProfile/:id",uploadImage,(userController.updateUserProfile))




authRouter.post("/follow/:id", protectRoute,userFollow);









module.exports = authRouter;
