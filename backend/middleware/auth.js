const jwt=require("jsonwebtoken");
const User=require("../models/User");

const auth=async(req, res, next)=>{
    const authHeader=req.headers.authorization; 
    if(!authHeader || !authHeader.startsWith("Bearer ")){  //check header
        return res.status(401).json({message: "Not Authorized"});
    };

    const token=authHeader.split(" ")[1]; //extract actual token

    let decoded; // Verify token
    try{
        decoded=jwt.verify(token, process.env.JWT_SECRET);
    }catch (err){
        return res.status(401).json({message: "Invalid or Expired Token"});
    };

    req.user=await User.findById(decoded.id).select("-password"); //attach user to req

    next();

};

module.exports=auth;