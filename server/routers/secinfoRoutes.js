const router = require("express").Router();
const Ad = require("../models/AdModel");
const auth = require("../middleware/authenticate");
const User = require("../models/UserModel");
const Request = require("../models/RequestModel");

router.get("/getuserinfo/:userid", auth, async(req,res)=>{
    const userId = req.params.userid;
    let response = await User.findOne({_id:userId},{passwordHash:0,email:0,teachers:0,ads:0,requests:0});
    response = response.toObject();
    response.students = response.students.length;
    // console.log(response);
    res.json(response);
});

router.get("/getmyinfo", auth, async(req,res)=>{
    const myId = req.user;
    let response = await User.findOne({_id:myId},{passwordHash:0});
    if(response){
        response = response.toObject();
        response.students = response.students.length;
        response.teachers = response.teachers.length;
        response.ads = response.ads.length;
        response.requests = response.requests.length;
        res.json(response);
    }
});


router.get("/getmyrequests",auth, async(req,res)=>{

    let requests = (await User.findOne({_id:req.user},{requests:1})).requests;
    
    let respArr = [];

    for(let i=0; i<requests.length; ++i){
        let obj = {};
        let reqId = requests[i];
        let resp = (await Request.findOne({_id:reqId}));
        if(resp)resp = resp.toObject();
        let adInfo = undefined;
        if(resp.type.toLowerCase() === "approval"){
            adInfo = (await Ad.findOne({_id:resp.adi}));
        }
        let senderInfo = (await User.findOne({_id:resp.from},{passwordHash:0,requests:0,teachers:0,ads:0,students:0})).toObject();
        // console.log(resp,senderInfo);
        obj.senderInfo = senderInfo;
        obj.reqInfo = resp;
        obj.adInfo = adInfo;
        respArr.push(obj);
    }
    // console.log(requests);
    res.json(respArr);
});


router.get("/getmyteachers",auth, async(req,res)=>{

    let teachers = (await User.findOne({_id:req.user},{teachers:1})).teachers;
    
    let respArr = [];

    let obj = {};
    for(let i=0; i<teachers.length; ++i){
        
        let reqId = teachers[i].teacherId;
        let resp = undefined;
        resp = (await User.findOne({_id:reqId},{passwordHash:0,teachers:0,ads:0,requests:0}));
        if(resp) resp = resp.toObject();
        resp.students = resp.students.length;
        obj.teacherDetails = resp;
        obj.subject = teachers[i].subject;
        
        respArr.push(obj);
    }
    // console.log(requests);

    res.json(respArr);
});


router.get("/getmystudents",auth, async(req,res)=>{

    let students = (await User.findOne({_id:req.user},{students:1})).students;

    
    let respArr = [];

    let obj = {};
    for(let i=0; i<students.length; ++i){
        
        let reqId = students[i].studentId;
        let resp = undefined;
        resp = (await User.findOne({_id:reqId},{passwordHash:0,teachers:0,ads:0,requests:0,students:0}));
        if(resp) resp = resp.toObject();
        obj.studentDetails = resp;
        obj.subject = students[i].subject;
        respArr.push(obj);
    }
    // console.log(requests);

    res.json(respArr);
});

router.get("/getmyreq",auth, async (req,res)=>{
    let userId = req.user;
    let reqList = await Request.find({from:userId},{adi:1});
    let resArr = [];
    reqList.map((reqE)=>{
        resArr.push(reqE.adi);
    })
    res.json(resArr);
});


module.exports = router;