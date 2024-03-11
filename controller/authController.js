
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

const folloUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id).populate("following");

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "You can't follow/unfollow yourself!" });

    if (!userModify || !currentUser)
      return res.status(400).json({ message: "User not found" });

    const isFollowing = currentUser.following
      .map((user) => user._id.toString())
      .includes(id);
    console.log("isfollowing: ", currentUser.following);
    if (isFollowing) {
      // unfollow user

      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in folloUnfollowUser: ", error.message);
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




module.exports={signupUser,loginUser,logoutUser,folloUnfollowUser,allUsers}