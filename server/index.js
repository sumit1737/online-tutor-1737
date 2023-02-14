const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");

// for reading variables from .env file
dotenv.config();


const app = express();
const PORT = 6969;

app.use(cors({
    origin: ["http://127.0.0.1:3001","http://127.0.0.1:3000","http://localhost:3000"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieparser());
app.use(bodyparser.urlencoded({extended:false}));

// start server
app.listen(PORT,()=>{
    console.log("Server started on port "+PORT);
});

// mongodb connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MDB_CONNECT || "mongodb://localhost:27017/siri",{
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err)=>{
        if(err)return console.error(err);
        console.log("Connected to db");
    }
);


// testing basic routing
app.get("/",(req,res)=>{
    res.send("done");
});

app.use("/entry",require("./routers/userRoutes"));// when user registers or logs in
app.use("/advert",require("./routers/adRoutes")); // after logging in when the user wants to create an advert
app.use("/request",require("./routers/requestRoutes")); // after logging in when the user wants to request for info
app.use("/data",require("./routers/secinfoRoutes")); // api endpoints that are accessible only when the user has logged in