const {Schema,model}=require("mongoose")

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:[true,"Account already exists with this eamil address"],
    },

    password:{
        type:String,
        required:true,
    }
});

const UserModel=model("users",userSchema);

module.exports=userSchema;