
const  protectRoute = require('../../middleware/protectRout'); 
const  express=require('express');
const  uploadImage = require('../../middleware/imageUpload');
const  postRouter=express.Router();
const  postController=require('../../controller/postContro');
const messageSchema = require('../../model/messageSchema');
postRouter.post("/createpost/:id",uploadImage,(postController.createPost));
postRouter.get("/allpost",postController.getAllPosts);
postRouter.get('/post/:id',(postController.getUserPost));
postRouter.get('/postId/:id',(postController.getPostById));
postRouter.put('/post/:id',(postController.updatePost));
postRouter.delete('/post/:id',(postController.deletePost));
postRouter.post('/post/like/:id',(postController.likePost));
postRouter.post('/post/unlike/:id',(postController.unlikePost));
postRouter.post('/post/comments/:id', postController.comments);
postRouter.get('/post/getcomments/:id',(postController.getcomments));
postRouter.post(`/post/save/:id`,(postController.save));
postRouter.get(`/post/saved/:id`,(postController.getSavedPosts));

postRouter.post("/post/msg", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        if (!from || !to || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMessage = await messageSchema.create({
            message: message,
            ChatUser: [from, to],
            Sender: from
        });

        return res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


postRouter.get("/post/chat/msg/:user1Id/:user2Id", async (req, res) => {
    try {
        const from = req.params.user1Id;
        const to = req.params.user2Id;
      

        const newMessages = await messageSchema.find({
            ChatUser: {
                $all: [from, to],
            } 
        }).sort({ updatedAt:1 });

        const allMessages = newMessages.map((msg) => {
            return {
                myself: msg.Sender.toString() === from,
                message: msg.message
            }
        });

        return res.status(200).json(allMessages);
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports=postRouter