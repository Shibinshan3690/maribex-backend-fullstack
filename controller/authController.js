
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");


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
// Follow UnFollow  

const userFollow = async (req, res) => {
  try {
    const logUserId = req.params.id;
    const { userFollowId } = req.body;
    console.log(logUserId, userFollowId, 'dssfsdfsdf');

    // Check if the user ID parameters are valid MongoDB ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(logUserId) || !mongoose.Types.ObjectId.isValid(userFollowId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(logUserId);
    const userToFollow = await User.findById(userFollowId);
    
    // Check if both users exist
    if (!user || !userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is already following the target user
    const followingUser = user.following.includes(userFollowId);

    if (followingUser) {
      // If already following, unfollow the user
      await Promise.all([
        User.updateOne({ _id: logUserId }, { $pull: { following: userFollowId } }),
        User.updateOne({ _id: userFollowId }, { $pull: { followers: logUserId } })
      ]);
      const updatedUser = await User.findById(logUserId);
      const followerCount = updatedUser.followers.length; // Update follower count
      return res.status(200).json({ message: 'User unfollowed successfully', followerCount });
    } else {
      // If not following, follow the user
      user.following.push(userFollowId);
      userToFollow.followers.push(logUserId);
      await Promise.all([
        user.save(),
        userToFollow.save()
      ]);
      const updatedUser = await User.findById(logUserId);
      const followerCount = updatedUser.followers.length; // Update follower count
      return res.status(200).json({ message: 'User followed successfully', followerCount });
    }
  } catch (error) {
    console.error(error, 'follow');
    return res.status(500).json({ error: 'Internal server error' });
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
        console.log("userId",user)
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


module.exports={signupUser,loginUser,logoutUser,userFollow,allUsers,getUserProfile,}