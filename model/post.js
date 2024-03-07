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
    text: {
      type: String,
      required: true
    },
    postedBy: {
      type: ObjectId,
      ref: "User"
    }
  }],
  saved: [{
    savedBy: {
      type: ObjectId,
      ref: "User"
    },
    postId: {
      type: ObjectId,
      ref: "Post"
    }
  }],
  postedBy: {
    type: ObjectId,
    ref: "User"
  },
  pic: {  // If this field represents the profile picture of the user who created the post, it should reference the User model, not a string
    type: ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
