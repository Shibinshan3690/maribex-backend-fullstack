const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
} ,
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  pic: {
    type: String,
  },
  stories: [{
    user: { type: Schema.Types.ObjectId, ref: "User" },
    storyPic: String,
    storyData: Date,
  }],
  repliedPosts: {
    type: [Schema.Types.ObjectId],
    ref: "Post",
    default: [],
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;