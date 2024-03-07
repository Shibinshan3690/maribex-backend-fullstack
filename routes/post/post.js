


const express=require('express')
const requireLogin = require('../../middleware/requireLogin')
const uploadImage = require('../../middleware/imageUpload')
const  postRouter=express.Router()
const postController=require('../../controller/postContro')




postRouter.post("/createpost",uploadImage,(postController.createPost))
postRouter.get("/allpost",postController.getAllPosts)
postRouter.get('/post/:id',(postController.getUserPost))
postRouter.get('/postId/:id',(postController.getPostById))
postRouter.put('/post/:id',(postController.updatePost)) 

module.exports=postRouter