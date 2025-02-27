const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/bonk").then(()=>{
    console.log("Success")
}).catch((error)=>{
    console.log(error)
})


const UserSchema = mongoose.Schema({
    username : String ,
    password : String,
    privateKey :String,
    publicKey : String
})

const userModel = mongoose.model("users" ,  UserSchema)

module.exports  = {
    userModel
}