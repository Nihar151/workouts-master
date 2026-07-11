const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
}, {timestamps:true})

//static signup func

userSchema.statics.signup = async function(username, email, password){

    //validation
    if(!email || !password || !username){
        throw Error("All fields must be filled")
    }
    if(!validator.isEmail(email)){
        throw Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password is not strong enough")
    }
    if(username.length<3){
        throw Error("username should be longer")
    }



    const emailExists = await this.findOne({email})
    const usernameExists = await this.findOne({username})

    if(emailExists){
        throw Error("Email already exists")
    }
    if(usernameExists){
        throw Error("Username already in use")
    }
    

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({username, email, password:hash})
    return user
}

//static login function

userSchema.statics.login = async function(email, password){
    if(!email||!password){
        throw Error("All fields have to be filled")
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error("User does not exist")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error("Incorrect password")
    }
    return user
}

module.exports = mongoose.model("User", userSchema)