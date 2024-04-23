const express=require("express");
const { createMessage, getMessage } = require("../controller/messageControl");


const router=express.Router();

router.post("/",createMessage);
router.get("/:chatId",getMessage)

module.exports=router