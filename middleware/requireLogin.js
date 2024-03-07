
const jwt=require("jsonwebtoken");
const User=require("../model/user")



const requireLogin  =async(req,res,nex)=>{
       try{
          const token=req.headers.authorization.split(" ")[1];
          if(!token) return res.status(400).json({msg:"Invalid Aouthrisation"})



             const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
             if(!decoded) return res.status(400).json({msg:"Invalid Aouthrisation"})

   const  user= await User.findOne({_id:decoded.id})
   req.user=user
   next()

             
       }  catch(error){
        return res.status(500).json({msg:"Not Authorized token expried, try again"})
    }
}

module.exports =requireLogin