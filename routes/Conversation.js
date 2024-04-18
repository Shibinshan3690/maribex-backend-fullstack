const  router=require("express").Router();
const  Conversation=require("../../backend/model/Conversation");

 //new conv
  
router.post('/', async (req,res)=>{
    const newConversation=new Conversation({
        members:[req.body.serderId, req.body.receiverId],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
          res.status(500).json(err)
    }
});

module.exports=router;