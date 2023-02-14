const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({
    from:{ type: String, required: true },
    to:{ type: String, required: true },
    adi:{ type: String, required: false },
    type:{ type: String, required: true, default: "approval"},
    status: { type: Boolean, required: true, default: false},
});
const Request = mongoose.model("request",requestSchema);
module.exports = Request;
