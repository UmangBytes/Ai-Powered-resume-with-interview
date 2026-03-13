const {Schema,model}=require("mongoose")

 const technicalQuestionSchema=new Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"],
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"],
    }
 },{
    _id:false,
    timestamps:true
 })

const behavioralQuestionSchema=new Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"],
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"],
    },
},{
    _id:false,
    timestamps:true
})

const skillGapSchema=new Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"Severity is required"]
    }
},{
    _id:false
})

const preparationPlanSchema= new Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focuse is required"]
    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
})



const interviewReportSchema=new Schema({
    jobDescription:{
        type:String,
        required:[true,"Job description is required"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        
    }
},{
    timestamps:true
});

const interviewReportModel=model("InterviewReport",interviewReportSchema)
module.exports=interviewReportModel