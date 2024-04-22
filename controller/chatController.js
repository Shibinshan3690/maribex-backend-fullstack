 
const chatModel=require("../model/chatModel");




 //createChat
 //getChat
 //findChat

 const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
  
    try {
      // Check if a chat already exists between the two users
      const chat = await chatModel.findOne({
        members: { $all: [firstId, secondId] },
      });
  
      if (chat) {
        // If chat exists, return it
        return res.status(200).json(chat);
      } else {
        // If chat doesn't exist, create a new one
        const newChat = new chatModel({
          members: [firstId, secondId],
        });
        const response = await newChat.save();
        return res.status(200).json(response);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  


 const findChatUser= async(req,res)=>{
      userId=req.params.userId;

      try {
         const chats =await chatModel.find({
             members: {$in:[userId]}
         })
         res.status(200).json(chats)
      } catch (error) {
           console.log(error)
           res.status(500).json(error)
      }
 }

 const findChat=async(req,res)=>{
       const {firstId,secondId}=req.params;

       try {
            const chat=await chatModel.findOne({
                  members: {$all:[firstId,secondId]},
            });
            res.status(200).json(chat)
       } catch (error) {
        console.log(error);
        res.status(500).json(error)
        
       }
 }

 module.exports ={createChat,findChatUser,findChat}