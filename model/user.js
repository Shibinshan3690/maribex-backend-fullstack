const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: "User" // Reference to the same model
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  pic: {
    type: String
  },
  followers: [{
    type: ObjectId,
    ref: "User"
  }],
  following: [{
    type: ObjectId,
    ref: "User"
  }],
  stories: [{
    user: { type: ObjectId, ref: "User" },
    storyPic: String,
    storyData: Date
  }],
  resetToken: String,
  expireToken: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
