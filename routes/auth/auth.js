const express = require('express');
const { signupUser, loginUser, logoutUser, userFollow,allUsers,getUserProfile,updateUserProfile,userUnfollow,getFollowingList } = require("../../controller/authController");
const protectRoute = require('../../middleware/protectRout'); // Use require for CommonJS modules
const  uploadImage = require('../../middleware/imageUpload');
const authRouter = express.Router();
const  userController=require("../../routes/auth/auth");
const UploadImage = require('../../middleware/UploadImage');



authRouter.post("/signup", signupUser);
authRouter.post("/signin", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/users", allUsers);
authRouter.get("/getUser/:id",getUserProfile)
authRouter.post("/follow/:id",userFollow)
authRouter.post("/unfollow/:id",userUnfollow)
authRouter.get("/followinglist/:id",getFollowingList)


authRouter.patch('/updateProfile/:id',UploadImage('profilePic'), updateUserProfile)


  










module.exports = authRouter;
