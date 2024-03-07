const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; 

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  likes: [{
    type: ObjectId,
    ref: "User"
  }],
  comments: [{
    type: String,
    postedBy: { type: ObjectId, ref: "User" }
  }],
  saved: [{
    savedBy: { type: ObjectId, ref: "User" },
    postId: { type: ObjectId, ref: "Post" }
  }],
  postedBy: {
    type: ObjectId,
    ref: "User"
  },
  postById: {
    type: ObjectId,
    ref: "User"
  }, // This field represents the user who created the post
  pic: {
    type: String,
    ref: "User"
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
