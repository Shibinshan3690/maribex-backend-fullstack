
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










module.exports={signupUser,loginUser,logoutUser}