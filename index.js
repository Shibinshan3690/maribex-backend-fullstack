const mongoose=require("mongoose");
const express=require("express");
const app=express();
const cors = require('cors');
const bodyParser=require("body-parser");
const authRouter = require("./routes/auth/auth");
const postRouter = require("./routes/post/post");
const socket = require("socket.io")

mongoose.set('strictQuery',false)

const port=9001;
app.use(cors());
app.use(express.json())
app.use("/api",authRouter) ;
app.use("/api",postRouter);




const connectDB= async function(){
   try {
    await mongoose.connect(process.env.MONGOURI);
      console.log('db connected successfully')
   } catch (error) {
    console.log(error,'error connecting')
   }
}

connectDB()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());

const server=app.listen(port, ()=>{
  console.log("Server running",port)
});

const io =socket(server,{
    cors:{
        origin:'http://localhost:3000',
        credential:true
    }
})
global.onlineUsers=new Map();
io.on("connection",(socket)=>{
     global.chatsocket=socket;
     socket.on("addUser",(id)=>{
         onlineUsers.set(id, socket.id);
     })

     socket.on("send-msg",(data)=>{
         const sendUserSocket=onlineUsers.get(data.to);
         if(sendUserSocket){
             socket.to(sendUserSocket).emit("msg-receive",data.message)
         }
     })
})