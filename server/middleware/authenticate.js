const jwt = require("jsonwebtoken");

// middleware to secure all the paths that need users to be logged in
function auth(req, res, next){
    try{
        const token = req.cookies.teachToken; //get cookie from the request
        if(!token){ // if no cookie found
            return res.status(401).json({errorMessage: "Unautherized User. Please log in."});
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET); // verify the authenticity of the cookie token
        req.user = verified.user; // added the user to the request header
        next(); // move the next function
    }catch (err){
        console.error(err);
        res.status(401).json({errorMessage: "Unautherized User. Please log in."});
    }
}

module.exports = auth;