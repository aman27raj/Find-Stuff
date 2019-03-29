var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    category: String,
    description: String,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        fullname: String,
        contact: String,
        address: String
    }
})

module.exports = mongoose.model("Product",productSchema);