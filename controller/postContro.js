  const Post= require("../model/post");
  const User=require("../model/user")

          const createPost  =async (req,res)=>{
            
          try {      
          const {title ,body,image}=req.body;
          const userId = req.params.id
          console.log("........",userId)
          if(!title && !body && !image){
          return res.status(404).json({error:"title or image must be provided"})
          };
          const newPost =new Post({
          postById:userId,
          title,
          body,
          image
          })
                 await newPost.save();
                 res.status(201).json({
                 message:"post create successfully",
                 post:newPost
          })

        } catch (error) {
          console.log(error)
          res.status(500).json({ error: error.message });
          console.error("Error in create post API:", error);
        }
  }

      const getAllPosts = async (req, res) => {
      try {
      const posts = await Post.find().populate('postById');
      if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
      }
      res.status(200).json({
        message: "Successfully fetched posts",
        posts,
      });
      } catch (error) {
      console.error(error, 'getAllPosts');
      res.status(500).json({
        error: "Internal server error",
        });
        }
        };
    

        const getUserPost = async (req, res) => {
        try {
        const userId = req.params.id;
        const posts = await Post.find({ postById: userId }).populate('postById');
        if (!posts || posts.length === 0) {
        return res.status(404).json({ error: "User posts not found" });
        }
        res.status(200).json({
          message: 'User posts fetched successfully',
          posts: posts
        });
        }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        }
        };
    


const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("postById");
   
    if (!post) {
      return res.status(404).json({ error: 'post is not found' });
    }
    res.status(200).json({
      message: 'successfully fetched post',
      post: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
}
const updatePost=async(req,res)=>{
  try {
      const {title,body,image}=req.body;
      const postId=req.params.id;
      const updatePost= await Post.findByIdAndUpdate(postId,{title,body,image},{new:true});
      if(!updatePost){
          return res.status(404).json({error:'post not found'})
      }
      res.status(200).json({
          message:'post update successfully',
          post:updatePost
      })
  } catch (error) {
      console.error(error,'update product');
      res.status(500).json({error:'internal server error'})
  }
}
const deletePost=async(req,res)=>{
  try {
      const postId=req.params.id;
      const deletepost=await Post.findByIdAndDelete(postId)
      if(!deletepost){
         return res.status(404).json({error:"post is not found"})
      }
      res.status(200).json({
          message:"successfully remove the post"
      })
       
  } catch (error) {
      console.error(error);
      res.status(500).json({error:'internal server error'});
  }
}

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedPost = post.likes.includes(userId);

    if (likedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      await post.save();
      // Create notification
      // const notification = new Notification({
      //   senderUserId: userId,
      //   reciveUserId: post.postById,
      //   postId: postId,
      //   type: "like",
      //   description: `Liked your post.`,
      // });
      // await notification.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error(error, "Error liking/unliking post");
    res.status(500).json({ error: "Internal server error" });
  }
};


const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedPost = post.likes.includes(userId);

    if (!likedPost) {
      return res
        .status(400)
        .json({ error: "Post has not been liked by this user" });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

    // await Notification.deleteOne({
    //   senderUserId: userId,
    //   reciveUserId: post.postById,
    //   postId: postId,
    //   type: "like",
    // });

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error, "Error unliking post");
    res.status(500).json({ error: "Internal server error" });
  }
};


const comments = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ text, userId: userId });
    await post.save();
    return res.status(201).json({
      message: 'Successfully added reply',
      post
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getcomments=async (req,res)=>{
    try {
      const postId=req.params.id;
      const postReply=await Post.findById(postId).populate({
        path: 'comments',
        populate: {
            path: 'userId'
        }
    });
      console.log(postReply);
      if(!postReply)return res.status(404).json({error:"post not found"})

      res.status(200).json({
          message:'successfully fetched post replies',
          postReply
      })
      } catch (error) {
      console.error(error,'error get reply')
      }
} 
       module.exports={createPost,getAllPosts,getUserPost,getPostById
      ,updatePost,deletePost,likePost,comments,getcomments,unlikePost}


  