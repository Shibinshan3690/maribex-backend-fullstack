const mongoose=require("mongoose")

const messageSchema=new mongoose.Schema({
      ChatUser:{
        type:Array,
        require:true
      },
      message:{
        type:String,
        require:true
      },
      Sender:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
      }
},{time:true})

module.exports=mongoose.model("Message",messageSchema)