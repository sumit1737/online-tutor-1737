const router = require("express").Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authenticate");


// function to generate token when a new user is created or exisiting one logs in
function genToken(currUser,res){
    // creating a token
    const token = jwt.sign({
        "user": currUser._id, 
    }, process.env.JWT_SECRET);
    
    // send token in http cookie
    res.cookie("teachToken",token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).send({done:true, uid: currUser._id});
}

// invoke this route when a new user is created on the website
router.post("/register",async (req,res)=>{
    try{
        // capturing all the variables from the form
        const { name,email,password,passwordVerify,img,contact,about } = req.body;

        // validation
        if(!email || !name || !password || !img)return res.status(400).json({errorMessage:"Enter All Details"});
        if(password.length < 6)return res.status(400).json({errorMessage:"Password should atleast be 6 characters long"});
        if(password !== passwordVerify)return res.status(400).json({errorMessage:"Repeate the same password"});

        // check if a user of the same email exists
        const exisitingUser = await User.findOne({email: email});
        if(exisitingUser)return res.status(400).json({errorMessage:"Email already taken"});

        // all the information is correct. hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        // saving the user in the database
        const newUser = new User({ //creating user 
            name: name,
            email: email,
            contact: contact,
            passwordHash: passwordHash,
            img: img,
            about: about
        });
        const savedUser = await newUser.save(); // saving the user in the database

        // generate a log in token
        genToken(savedUser,res);
    }catch(err){
        console.log("shitt!! ",err);
        res.status(500).send();
    }
});

router.post("/updateself", auth, async(req,res)=>{
    try{
        // capturing all the variables from the form
        const { name,email,password,passwordVerify,img,about } = req.body;

        const userId = req.user;

        if(password.length < 6)return res.status(400).json({errorMessage:"Password should atleast be 6 characters long"});
        if(password !== passwordVerify)return res.status(400).json({errorMessage:"Repeate the same password"});

        // all the information is correct. hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        // update the user
        if(img)await User.updateOne({_id:userId},{'$set':{name:name, email:email, passwordHash:passwordHash, img:img, about:about}});
        else await User.updateOne({_id:userId},{'$set':{name:name, email:email, passwordHash:passwordHash, about:about}});
        res.json("done");
    }catch(err){
        res.status(500).send();
    }
});

router.post("/login",async (req,res)=>{
    try{
        // capturing all the variables from the form
        const { email,password } = req.body;

        // validation
        if(!email || !password)return res.status(400).json({errorMessage:"Enter All Details"});

        // check if a user of the same email exists
        const exisitingUser = await User.findOne({email: email});
        if(!exisitingUser)return res.status(401).json({errorMessage:"Incorrect email or password"});
        
        // compare the entered password with the saved hash
        const passwordCorrect = await bcrypt.compare(password,exisitingUser.passwordHash);
        // if passowrd is not correct return and error
        if(!passwordCorrect)return res.status(401).json({errorMessage:"Incorrect email or password"});

        // all the information is correct. generate a log in token and log the user in
        genToken(exisitingUser,res);

    }catch(err){
        res.status(500).send();
    }
});

router.get("/logout",(req,res)=>{
    res.cookie("teachToken","",{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0)
    }).send();
});

router.get("/loggedin",async (req,res)=>{
    try{
        const token = req.cookies.teachToken;
        if(!token){
            return res.json({isLoggedIn: false});
        }

        let resp = jwt.verify(token, process.env.JWT_SECRET);
        let currentUser = await User.findOne({_id: resp.user},{passwordHash:0});
        res.json({isLoggedIn: true,  userInfo: currentUser});
        // res.send(true);

    }catch (err){
        res.json({isLoggedIn: false});
    }
});


router.post("/giverating", auth, async (req,res)=>{

    const { rating,tid } = req.body;

    if(rating !== 0){
        let oldRating = (await User.findOne({_id:tid},{rating:1})).rating || 0;
        let studentCount = (await User.findOne({_id:tid},{students:1})).students.length;
        let nRating = (((studentCount-1)*oldRating) + rating)/studentCount;
        await User.updateOne({_id:tid},{$set:{rating:nRating}});
    }

    res.send();
});


module.exports = router;