const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    contact:{ type: Number, required: true},
    email:{ type: String, required: true },
    passwordHash:{ type: String, required: true },
    about: {type: String, default:
        "Lorem ipsum dolor s in congue lorem mi nec erat. Etiam id condimentum massa, a eleifend tellus. Duis sit amet vestibulum magna. \n Lorem ipsum dolor s in congue lorem mi nec erat. Etiam id condimentum massa, a eleifend tellus. Duis sit amet vestibulum magna. \n Lorem ipsum dolor s in congue lorem mi nec erat. Etiam id condimentum massa, a eleifend tellus. Duis sit amet vestibulum magna."},
    verified:{ type: Boolean, required: false, default: false },
    rating: { type: Number, default:0},
    img: { type:String, required: false },
    students : [
        {
            studentId: String,
            subject: [{
                subName: {type: String},
                price: {type: Number}
            }]
        }
    ],
    teachers : [
        {
            teacherId: String,
            subject: [{
                subName: {type: String},
                price: {type: Number}
            }]
        }
    ],
    ads: [String],
    requests: [String]
});
const User = mongoose.model("user",userSchema);
module.exports = User;
