import mongoose, {Schema, Document}from "mongoose"

export interface Message extends Document{
    content : string,
    createdAt: Date
}

export interface User extends Document{
    username : string,
    email :string
    password: string,
    verifyCode: string,
    verifyCodeExpiry : Date, 
    isAcceptingMessage: boolean,
    isVerified : boolean
    messages: Message[],
    createdAt : Date
}

const messageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required: true
    },

    createdAt:{
        type: Date,
        required: true,
    }

})

const userSchema:Schema<User> = new Schema({
    username: {
        type : String,
        required: [true, "username is required"],
        trim : true,
        unique: true
    },
    email: {
        type : String,
        required: [true, "email is required"],
        unique: true,
        // we ca add email validation using regex
        // match : []
    },
    password: {
        type : String,
        required: [true, "password is required"],
    },
    verifyCode: {
        type : String,
        required: [true, "verifyCode is required"],

    },
    verifyCodeExpiry: {
        type : Date,
        required: [true, "verifyCode is required"],
    },

    isVerified:{
        type : Boolean,
        default : false
    },

    isAcceptingMessage: {
        type : Boolean,
        default : true
    },
    messages: [messageSchema],

    createdAt:{
        type : Date
    }
}, {timestamps : true})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default UserModel





