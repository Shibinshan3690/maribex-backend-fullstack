
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const cloudinary = require("cloudinary").v2;

// singup user

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
    });
  } catch (error) {
    console.error("Error in signupUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPsswordChek = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPsswordChek)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);
    // console.log( generateTokenAndSetCookie(user._id, res))
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: generateTokenAndSetCookie(user._id, res),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Err in loginuser ", error.message);
  }
};

//Logot User
const logoutUser = async (req, res) => {
  try {
    console.log("logoluted");
    res.cookie("jwt", "", { maxAge: 1 });
    console.log(res.cookie("jwt", "", { maxAge: 1 }));
    res.status(200).json({ message: "User logged out succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Err in logout ", error);
  }
};


const userFollow = async (req, res) => {
  try {
    const logUserId = req.params.id;
    const { userFollowId } = req.body;
    const user = await User.findById(logUserId);
    const userToFollow = await User.findById(userFollowId);

    if (!user || !userToFollow)
    return res.status(404).json({ error: "User not found" });

    const followingUser = user.following.includes(userFollowId);
    if (followingUser) {
      await User.updateOne(
        { _id: logUserId },
        { $pull: { following: userFollowId } }
      );
      await User.updateOne(
        { _id: userFollowId },
        { $pull: { followers: logUserId } }
      );
      return res.status(400).json({ error: "Unfollowing this user" });
    } else {
      user.following.push(userFollowId);
      userToFollow.followers.push(logUserId);
      await user.save();
      await userToFollow.save();

      // const notification = new Notification({
      //   senderUserId: logUserId,
      //   reciveUserId: userFollowId,
      //   type: "follow",
      //   description: `Started following you.`,
      // });
      // await notification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error(error, "userFollow");
    res.status(500).json({ error: "Internal server error" });
  }
};

const userUnfollow = async (req, res) => {
  try {
    const logUserId = req.params.id;
    const { userUnfollowId } = req.body;
    // console.log(logUserId, userUnfollowId, "unfollow");

    const user = await User.findById(logUserId);
    const userToUnfollow = await User.findById(userUnfollowId);
    if (!user || !userToUnfollow)
      return res.status(404).json({ error: "User not found" });

    const followingUser = user.following.includes(userUnfollowId);
    if (followingUser) {
      await User.updateOne(
        { _id: logUserId },
        { $pull: { following: userUnfollowId } }
      );
      await User.updateOne(
        { _id: userUnfollowId },
        { $pull: { followers: logUserId } }
      );

      // await Notification.deleteOne({
      //   senderUserId: logUserId,
      //   reciveUserId: userUnfollowId,
      //   type: "follow"
      // });
      
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      return res.status(400).json({ error: "You are not following this user" });
    }
  } catch (error) {
    console.error(error, "unfollow");
    res.status(500).json({ error: "Internal server error" });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(404).json({ message: "Users Not Fount" });
    res.status(200).json({ Users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in find all users: ", error.message);
  }
};

const getUserProfile=async (req,res)=>{
      try {
      const userId=req.params.id;
      const user=await User.findById(userId);
      
      if(!user)return res.status(404).json({error:'user not found'})
      res.status(200).json({
          message:'successfully fetched user profile',
          user:user
      })
  } catch (error) {
      console.error(error,'get user profile')
      res.status(500).json({error:'internal server errror'})
  }
}




const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {  username, email, bio } = req.body;
    const { profilePic } = req.body;
    

    console.log( username, email, bio);
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You can't Update other user's profile" });

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop(".")[0]
        );
      }
    }

    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    user = await user.save();

    res.status(200).json({ message: "Profile upadated succesfully", user });
  } catch (error) {
    res.status(500).json({ error: error  });
    console.log("Error in updateUser: ", error.message);
  }
};


const getFollowingList = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("following");
    if (!user) return res.status(404).json({ error: "user not found" });
    res.status(200).json({
      message: "successfully fetched following list",
      user,
    });
  } catch (error) {
    console.error(error, "get following");
    res.status(500).json({ error: "internal server error" });
  }
};


module.exports={signupUser,loginUser,logoutUser,userFollow,allUsers,getUserProfile,updateUserProfile,userUnfollow,getFollowingList}