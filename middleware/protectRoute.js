import jwt  from "jsonwebtoken";

import User from "../model/user"


const protectRoute = async (req, res, next) => {
    try {
        // const token = req.cookies.jwt
        const token = req.headers["authorization"]
        
        if(!token)return res.status(401).json({message:"Unauthorized"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET)  
        // console.log("user id from decoded",decoded)
        const user = await User.findById(decoded.userId).select("-password")

        // console.log("user form protect rout",user)
        req.user = user

        next()
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log("Authentication Err",error.message)
    }
}

export default protectRoute
