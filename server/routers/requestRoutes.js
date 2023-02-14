const router = require("express").Router();
const Request = require("../models/RequestModel");
const auth = require("../middleware/authenticate");
const User = require("../models/UserModel");
const Ad = require("../models/AdModel");

router.post("/approval", auth, async(req,res)=>{
    try{

        const { to,adi } = req.body; // get sender, reciever, adId(adi)

        // validation
        if( !to || !adi)return res.status(400).json({errorMessage:"Enter All Details"});
        
        const sender = req.user;

        // create new request
        const newRequest = new Request({
            from: sender,
            to: to,
            adi: adi
        });

        const savedRequest = await newRequest.save();

        // add this request to the recievers request list
        let rec = (await User.findOne({_id: to},{requests:1})).requests;
        rec.push(savedRequest._id); // add the current request
        const updatedReciever = await User.updateOne({_id: to},{requests: rec});
        res.send("sent request!!")

    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/approved",auth,async (req,res)=>{
    try{

        // get information about the approved request
        const { reqId } = req.body;

        // validation
        if( !reqId )return res.status(400).json({errorMessage:"Enter All Details"});

        // get the request which is to be approved
        await Request.updateOne({_id:reqId},{status:true});
        let approvedRequest = await Request.findOne({_id:reqId});
        // console.log(approvedRequest);
        const sender = req.user;
        const to = approvedRequest.from;
        // create new approved request and send it to the sender that requested approval
        const newRequest = new Request({
            from: sender,
            to: to,
            adi: approvedRequest.adi,
            status: true,
            type: "approved"
        });



        const savedRequest = await newRequest.save();

        // add this request to the recievers request list
        let rec = (await User.findOne({_id: to},{requests:1})).requests;
        rec.push(savedRequest._id); // add the current request
        let updatedReciever = await User.updateOne({_id: to},{requests: rec});


        // updating senders and recievers teachers and students
        const subject = (await Ad.findOne({_id:approvedRequest.adi})).subject;
        const price = (await Ad.findOne({_id:approvedRequest.adi})).price;
        
        let teachers = (await User.findOne({_id: to},{teachers:1})).teachers;
        
        let updated=false;

        for(let i=0; i<teachers.length; ++i){
            if(teachers[i].teacherId === sender){
                teachers[i].subject.push({subName: subject, price:price});
                updated = true;
                break;
            }
        }
        if(!updated)teachers.push({teacherId: sender, subject:{subName: subject, price:price}});
        updatedReciever = await User.updateOne({_id: to},{teachers: teachers});


        // adding the reciever as the student of the current user
        let students = (await User.findOne({_id: sender},{students:1})).students;
        updated=false;
        for(let i=0; i<students.length; ++i){
            if(students[i].studentId === to){
                students[i].subject.push({subName: subject, price:price});
                updated = true;
                break;
            }
        }
        if(!updated)students.push({studentId:to, subject:{subName: subject, price:price}});
        
        updatedSender = await User.updateOne({_id: sender},{students: students});
        res.send("request approved!");
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});


router.delete("/deletereq/:reqid",auth, async(req,res)=>{
    const  rid  = req.params.reqid; // get the ad id to delete
    // console.log(rid);
    const updatedTeacher  = await User.updateOne({_id:req.user},{$pull:{'requests':rid}}); // remove from the teacher's ad list
    // console.log("updated ",updatedTeacher);
    if(updatedTeacher.modifiedCount !== 0) await Request.deleteOne({_id:rid}); // delete from the ads collection
    res.send("deleted"); // for api check in insomnia
});

module.exports = router;