const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const register=async (req,res)=>{
    const {name,email,password}=req.body; //extracting the data from request body =>  taking name email password from the registered person
    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"}); // status(400) means bad request
    };

    const existingUser=await User.findOne({email}); //checking if the user exists
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    };

    const hashedPassword=await bcrypt.hash(password, 10); //hashing the password, 10=> salt rounds making it more secure

    const newUser=await User.create({ //save new user in DB
        name,
        email,
        password: hashedPassword
    });

    const token=jwt.sign( // creating JWT token
        {id: newUser._id},  // payload=> data stored inside token
        process.env.JWT_SECRET,  // secret key
        {expiresIn: "7d"} //token validity
    );

    res.status(201).json({  //send the response  also status(200) means created user
        message: "User Registered Successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        },
        token
    });
};

const login=async (req,res)=>{

    const {email, password}=req.body; // extract details
    if(!email || !password){  //check all fields are there
        return res.status(400).json({message: "All fields are required"});
    };

    const user=await User.findOne({email});  //find user by email
    if(!user){  //if user not there, status(400)
        return res.status(400).json({message: "User doesn't exists"});
    };

    const ismatch=await bcrypt.compare(password, user.password);  //check hashed password with password user entered

    if(!ismatch){ //if password not matched return status(400)
        return res.status(400).json({message: "Incorrect Password"});
    };

    const token=jwt.sign(  //again create JWT token valid for 7 days
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    res.status(200).json(  //login successful, send res.status(200)
        {message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
};

const me=async (req,res)=>{  // before here, auth middleware will be called which will check all nevessary token and store user info in req.user
    return res.status(200).json({
        user: req.user
    });

};

module.exports={ register, login, me };