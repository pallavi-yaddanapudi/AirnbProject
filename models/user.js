const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

userSchema.plugin(passportLocalMongoose); // automatically adds username,password hash salt.

module.exports=mongoose.model("User",userSchema);