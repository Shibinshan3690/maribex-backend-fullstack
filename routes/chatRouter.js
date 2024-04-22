const express =require("express");
const { createChat, findChatUser, findChat } = require("../controller/chatController");

const router=express.Router()



router.post("/",createChat);
router.get("/:userId",findChatUser);
router.get("/find/:firstId/:secondId",findChat);


module.exports=router