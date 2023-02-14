const mongoose = require("mongoose");
const adSchema = new mongoose.Schema({
    tid:{ type: String, required: true },
    subject:{ type: String, required: true },
    mode:{ type: String, required: true },
    location: {type: String, required: true},
    price: { type: Number}
});
const Ad = mongoose.model("ad",adSchema);
module.exports = Ad;
