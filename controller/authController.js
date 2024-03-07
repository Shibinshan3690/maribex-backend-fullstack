const { JsonWebTokenError } = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require("../middleware/token");
const User = require("../model/user");
const bcrypt=require("bcryptjs")



//User registration
exports.register= async(req,res)=>{
   try {     
   const {name,email,password}=req.body;
   if(!email||!password||!name){
   return res.status(422).json({msg:"please add all fields"})
   }
   //Check if  already have the user
   const username= await User.findOne({email})
   if(username)return  res.status(400).json({
     msg:"this email alredy existed"
   })
  //Password hashing using brycpt
   const hashPassword= await bcrypt.hash(password,12)
   //  create new user
   const user = new User    ({
     email,
     password:hashPassword,
     name
   })
   await user.save()
   res.json({msg:"Register succefully"})
    } catch (error) {
        
  return res.status(500).json({
     msg:error.message
  })
    }    
},
  //user Login
  exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(422).json({msg:"Please add all fields"})
        }
        const user = await User.findOne({email})//find user
        if(!user)return res.status(400).json({msg:"This user does not exists"})

        //match password with hashed password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)return res.status(400).json({msg:"Password is Incorrect"})
        const access_token = createAccessToken({id:user._id})
        const refresh_token = createRefreshToken({id:user._id})
        //add cookie
        res.cookie('refreshtoken',refresh_token,{
            httpOnly:true,
            path:'/api/refresh_token',
            maxAge : 30*24*60*60*1000 //30
        })

        res.json({
            msg:'Login Success',
            access_token,
            user:{
                ...user._doc,
                password:''
            }
        })
    }
    catch(err){
        return res.status(400).json({msg:err.message})
    }
}



exports.refreshToken= async(req,res)=>{
    try {
      
      const refresh_token=req.cookies.refreshtoken
      if(refresh_token)  return res.status(400).json({msg:"please login now"})

      jwt.verify(refresh_token,process.env.REFRESH_TOKEN_SECRET,async(err,result)=>{
      if(err) return res.status(400).json({msg:"please login now"})

     //find user 

       const user= await User.findById(result.id).select("-password")
       .populate("_id name pic followers following")
       if(!user) return res.status(400).json({msg:"Tis user does not exists"})

      const acces_token=createAccessToken({id:result.id})

      res.json({
          acces_token,
          user  
      })
   
})
    } catch (error) {
         res.status(500).json({msg:"Something went wrong"})
    }

}

