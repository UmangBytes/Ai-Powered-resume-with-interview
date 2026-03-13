const {Router}=require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController,generateResumePdfController } = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter=Router();


interviewRouter.post("/",authUser,upload.single("resume"),generateInterviewReportController)
interviewRouter.get("/report/:interviewId",authUser,getInterviewReportByIdController)
interviewRouter.get("/",authUser,getAllInterviewReportsController)
interviewRouter.post("/resume/pdf/:interviewReportId",authUser,generateResumePdfController)

module.exports=interviewRouter