


const express=require('express')

const uploadImage = require('../../middleware/imageUpload')
const  postRouter=express.Router()
const postController=require('../../controller/postContro')




postRouter.post("/createpost",uploadImage,(postController.createPost))
postRouter.get("/allpost",postController.getAllPosts)
postRouter.get('/post/:id',(postController.getUserPost))
postRouter.get('/postId/:id',(postController.getPostById))
postRouter.put('/post/:id',(postController.updatePost)) 
postRouter.delete('/post/:id',(postController.deletePost))


postRouter.post('/post/like/:id',(postController.likePost))
postRouter.post('/post/unlike/:id',(postController.unlikePost))
postRouter.post('/post/comments/:id', postController.comments);
postRouter.get('/post/getcomments/:id',(postController.getcomments))



module.exports=postRouter