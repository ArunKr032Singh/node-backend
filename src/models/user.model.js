import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    require: true,
    trim: true,
    index:true
  },
  avatar: {
    type: String, // cloudinary url
    require: true,
  },
  coverImage:{
    type :String, // cloudinary url
  },
  watchHistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
  ],
  password:{
    type :String,
    require:[true, 'Password is requires']
  },
  refreshToken:{
    type:String
  }
},{timestamps:true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESh_TOKEN_SECRET,
        {
            expiresIn:REFRESh_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model.apply("User", userSchema);
