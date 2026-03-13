const { PDFParse } = require("pdf-parse")
const { generateInterviewReport,generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req,res) {
    // const resumeFile=req.resumeFile

    const resumeContent=await (new PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const {selfDescription,jobDescription}=req.body

    const interviewReportByAi=await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })
    const aiData=interviewReportByAi

    const toObjects = (arr) => (arr || []).filter(item => typeof item === 'object' && item !== null)

     const sanitized = {
        matchScore: aiData.matchScore,
        title: aiData.title,
        technicalQuestions: toObjects(aiData.technicalQuestions),
        behavioralQuestions: toObjects(aiData.behavioralQuestions),
        skillGaps: toObjects(aiData.skillGaps),
        preparationPlan: toObjects(aiData.preparationPlan),
    }

    // Validate required fields exist before hitting Mongoose
    const requiredFields = ['technicalQuestions', 'behavioralQuestions', 'skillGaps', 'preparationPlan']
    for (const field of requiredFields) {
        if (!sanitized[field].length) {
            return res.status(422).json({ message: `AI returned invalid data for: ${field}` })
        }
    }

    const interviewReport=await interviewReportModel.create({
        user:req.user.id,
        resume:resumeContent.text,
        jobDescription,
        ...interviewReportByAi
    })

    return res.status(201).json({
        message:"Interview report generated successfully",
        interviewReport
    })
}

async function getInterviewReportByIdController(req,res) {
    const {interviewId}=req.params
    const interviewReport=await interviewReportModel.findByOne({_id:interviewId,user:req.user.id})
    if(!interviewReport) {
        return res.status(404).json({message:"Interview report not found"})
    }

    return res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res) {
    const interviewReports=await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v")
    
    return res.status(200).json({
        message:"Interview reports fetched successfully",
        interviewReports
    })
}

async function generateResumePdfController(req,res) {

    const {interviewReportId}=req.params

    const  interviewReport=await interviewReportModel.findById({interviewReportId})
    if(!interviewReport) {
        return res.status(404).json({message:"Interview report not found"})
    }

    const {resume,selfDescription,jobDescription}=interviewReport

    const pdfBuffer=await generateResumePdf({
        resume,
        selfDescription,
        jobDescription
    })

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)


}

module.exports={
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}