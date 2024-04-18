const mongoose=require("mongoose");
const express=require("express");
const app=express();
const cors = require('cors');
const bodyParser=require("body-parser");
const authRouter = require("./routes/auth/auth");
const postRouter = require("./routes/post/post");
const conversationRoute=require("./routes/Conversation");
const messageRoute=require("./routes/Message");
mongoose.set('strictQuery',false)

const port=9001;
app.use(cors());
app.use(express.json())
app.use("/api",authRouter) 
app.use("/api",postRouter)
app.use("/api/conversation",conversationRoute)
// app.use("/api/messages",messageRoute)



mongoose.connect("mongodb://localhost:27017/backend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});
mongoose.connection.on('error',(error)=>{
      console.log("errorrrrr")
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());

app.listen(port, ()=>{
  console.log("Server running",port)
})