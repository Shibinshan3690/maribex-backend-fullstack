const express=require('express')
const { register ,login,refreshToken} = require('../../controller/authController') //import register
const authRouter=express.Router()



authRouter.post("/signup",register)
authRouter.post("/signin",login)//add sign controller
// authRouter.post("/reset-password")
// authRouter.post("/new-password")

authRouter.post("/refresh_token",refreshToken)
authRouter.get("/logout")


module.exports= authRouter