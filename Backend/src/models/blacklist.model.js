const {Schema,model}=require("mongoose")

const blacklistTokenSchema=new Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"]
    }
},{
    timestamps:true,
})

const tokenBlacklistModel=model("blacklistTokens",blacklistTokenSchema)

module.exports=tokenBlacklistModel