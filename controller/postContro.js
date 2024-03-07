  const Post= require("../model/post");
  const User=require("../model/user")

  const createPost  =async (req,res)=>{
    console.log(req.body)
        try {
             
          const {userId,title ,body,image}=req.body;
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
  
  const getUserPost= async(req,res)=>{
    try {
        const userId=req.params.id;
        const posts=await Post.find({postById:userId}).populate('postById');
        if(!posts){
            return res.status(404).json({error:"user post not found" });
        }
        res.status(200).json({
            message:'user post fetched successfully',
            post:posts
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:"internal server error"
        })
    }
}


const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
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



  module.exports={createPost,getAllPosts,getUserPost,getPostById
  ,updatePost}


  