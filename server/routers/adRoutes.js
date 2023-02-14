const router = require("express").Router();
const Ad = require("../models/AdModel");
const auth = require("../middleware/authenticate");
const User = require("../models/UserModel");

router.post("/createnewad", auth, async(req,res)=>{
    try{
        // capturing all the variables from the form
        const { subject,mode,price,location } = req.body;

        //user creating the advert
        const teacher = req.user;
        
        console.log("wowowow",teacher);

        // console.log("Hello",teacher);

        // validation
        if(!subject || !mode || !price)return res.status(400).json({errorMessage:"Enter All Details"});

        // creating new Ad
        const newAd = new Ad({
            subject: subject,
            mode: mode,
            price: price,
            tid: teacher,
            location: location
        });
        const savedAd = await newAd.save();

        // adding this Advert to the teachers record
        const teacherAdData = (await User.findOne({_id: teacher},{ads:1})).ads; // get the ads list containg all the pervious ads
        teacherAdData.push(savedAd._id); // add the current advert
        const updatedTeacher = await User.updateOne({_id: teacher},{ads: teacherAdData}); //update the record
        res.send("ad created!!"); // for api check in insomnia

    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});


router.delete("/deletead/:adid",auth, async(req,res)=>{
    const  adi  = req.params.adid; // get the ad id to delete
    console.log(adi);
    const updatedTeacher  = await User.updateOne({_id:req.user},{$pull:{'ads':adi}}); // remove from the teacher's ad list
    console.log("updated ",updatedTeacher);
    if(updatedTeacher.modifiedCount !== 0) await Ad.deleteOne({_id:adi}); // delete from the ads collection
    res.send("deleted"); // for api check in insomnia
});


router.get("/getallads",async (req,res)=>{
    
    let allAds = await Ad.find({});

    for(let i=0; i<allAds.length; ++i){
        let teachData = await  User.findOne({_id:allAds[i].tid});
        let obj = allAds[i].toObject();
        obj.img = teachData.img;
        obj.name = teachData.name;
        obj.rating = teachData.rating;
        allAds[i] = obj;
    }
    res.json(allAds);
});

router.post("/editmyad",auth,async(req,res)=>{
    try{
        // capturing all the variables from the form
        const { subject,mode,price,location,adid } = req.body;
        
        //user creating the advert
        const teacher = req.user;

        // validation
        if(!subject || !mode || !price || !location)return res.status(400).json({errorMessage:"Enter All Details"});
        await Ad.updateOne({_id:adid},{"$set":{subject:subject, mode:mode, price:price, location:location}});
        res.send("edit ad!");

    }catch(error){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/getmyads",auth,async(req,res)=>{

    let myAds = await Ad.find({tid:req.user});
    // console.log(myAds);
    let teachData = await  User.findOne({_id:req.user});
    for(let i=0; i<myAds.length; ++i){
        let obj = myAds[i].toObject();
        obj.img = teachData.img;
        obj.name = teachData.name;
        obj.rating = teachData.rating;
        myAds[i] = obj;
    }
    // console.log(myAds);
    res.json(myAds);

})

module.exports = router;