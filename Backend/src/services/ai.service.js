const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})



// const geminiSchema = {
//     type: SchemaType.OBJECT,
//     properties: {
//         matchScore: { type: SchemaType.NUMBER },

//         technicalQuestions: {
//             type: SchemaType.ARRAY,
//             items: {
//                 type: SchemaType.OBJECT,
//                 properties: {
//                     question:  { type: SchemaType.STRING },
//                     intention: { type: SchemaType.STRING },
//                     answer:    { type: SchemaType.STRING },
//                 },
//                 required: ["question", "intention", "answer"],
//             },
//         },

//         behavioralQuestions: {
//             type: SchemaType.ARRAY,
//             items: {
//                 type: SchemaType.OBJECT,
//                 properties: {
//                     question:  { type: SchemaType.STRING },
//                     intention: { type: SchemaType.STRING },
//                     answer:    { type: SchemaType.STRING },
//                 },
//                 required: ["question", "intention", "answer"],
//             },
//         },

//         skillGaps: {
//             type: SchemaType.ARRAY,
//             items: {
//                 type: SchemaType.OBJECT,
//                 properties: {
//                     skill:    { type: SchemaType.STRING },
//                     severity: { type: SchemaType.STRING, enum: ["high", "medium", "low"] },
//                 },
//                 required: ["skill", "severity"],
//             },
//         },

//         preparationPlan: {
//             type: SchemaType.ARRAY,
//             items: {
//                 type: SchemaType.OBJECT,
//                 properties: {
//                     day:   { type: SchemaType.NUMBER },
//                     focus: { type: SchemaType.STRING },
//                     tasks: {
//                         type: SchemaType.ARRAY,
//                         items: { type: SchemaType.STRING },
//                     },
//                 },
//                 required: ["day", "focus", "tasks"],
//             },
//         },
//     },
//     required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
// };

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


//     const prompt = `You are an expert technical interviewer and career coach. Analyze the candidate's resume, self-description, and job description to generate a comprehensive interview preparation report.

// Resume: ${resume}
// Self Description: ${selfDescription}
// Job Description: ${jobDescription}

// Generate a structured interview report with the following requirements:

// **MATCH SCORE (matchScore)**
// - A number from 0–100 representing how well the candidate matches the job description.
// - Base it on: overlapping skills, years of experience, project relevance, and any gaps.

// **TECHNICAL QUESTIONS (technicalQuestions)** — Generate exactly 4 questions.
// - Each must have:
//   - "question": A specific, deep technical question directly tied to the tech stack in the JD and resume (not generic).
//   - "intention": Why this question is being asked — what skill or claim on the resume is being probed.
//   - "answer": A detailed model answer describing what a strong candidate SHOULD say, including specific tools, patterns, or methods by name.
// - Questions should increase in complexity and cover different domains (e.g., runtime internals, database, caching, architecture).

// **BEHAVIORAL QUESTIONS (behavioralQuestions)** — Generate exactly 2 questions.
// - Each must have:
//   - "question": A situational or behavioral question tied to specific experience bullets or projects mentioned in the resume.
//   - "intention": The soft skill or work habit being evaluated.
//   - "answer": What a strong STAR-method answer should include, with specific tools or outcomes expected.

// **SKILL GAPS (skillGaps)** — Generate 3–5 gaps.
// - Identify skills mentioned in the JD that are absent or weak on the resume.
// - Each must have:
//   - "skill": The specific technology or concept (e.g., "Message Queues (Kafka/RabbitMQ)").
//   - "severity": One of "high", "medium", or "low" based on how critical it is for the role.

// **PREPARATION PLAN (preparationPlan)** — Generate exactly 7 days.
// - Each day must have:
//   - "day": Day number (1–7).
//   - "focus": A concise theme for the day (e.g., "Node.js Internals & Streams").
//   - "tasks": An array of exactly 2 specific, actionable tasks the candidate should complete that day.
// - Day 1–5 should address skill gaps and weak areas identified from the resume vs JD.
// - Day 6 should focus on Data Structures & Algorithms with LeetCode practice.
// - Day 7 should be a mock interview and project/experience review day.

// Be specific to THIS candidate's resume and THIS job description. Do not generate generic advice.


// CRITICAL FORMATTING RULES:
// - "preparationPlan" must be an array of 7 objects, each with:
//     - "day": a number (1–7)
//     - "focus": a single string topic
//     - "tasks": an array of exactly 2 strings, each being a complete actionable task
// - "skillGaps" must be an array of objects, each with "skill" (string) and "severity" (string).
// - "technicalQuestions" and "behavioralQuestions" must be arrays of objects with "question", "intention", and "answer" keys.
// - Do NOT return flat arrays with alternating key-value strings.

// `;

    const prompt = `You are an expert technical interviewer. Analyze the resume, self-description, and job description below and return a JSON object.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

You MUST return a single valid JSON object. Follow this EXACT structure with no deviations:

{
  "matchScore": <number between 0-100>,

  "technicalQuestions": [
    {
      "question": "<specific technical question>",
      "intention": "<why this question is being asked>",
      "answer": "<what a strong answer should include>"
    }
    // exactly 4 objects like this
  ],

  "behavioralQuestions": [
    {
      "question": "<behavioral question>",
      "intention": "<skill being evaluated>",
      "answer": "<what a strong STAR-method answer includes>"
    }
    // exactly 2 objects like this
  ],

  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "<must be exactly one of: high, medium, low>"
    }
    // 3 to 5 objects like this
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "<topic for the day>",
      "tasks": [
        "<actionable task 1>",
        "<actionable task 2>"
      ]
    }
    // exactly 7 objects, one for each day 1 through 7
  ]
}

STRICT RULES — violating any of these will make the response unusable:
1. Every item in "technicalQuestions" and "behavioralQuestions" MUST be an object with exactly 3 keys: "question", "intention", "answer".
2. Every item in "skillGaps" MUST be an object with exactly 2 keys: "skill", "severity".
3. Every item in "preparationPlan" MUST be an object with exactly 3 keys: "day" (number), "focus" (string), "tasks" (array of 2 strings).
4. "tasks" MUST always be an array of strings — never a plain string, never a flat list.
5. Do NOT flatten any array into alternating key-value strings.
6. Do NOT wrap the response in markdown or code blocks.
7. Return ONLY the raw JSON object. Nothing before it, nothing after it.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        //  model: "gemini-2.5-flash-preview",
        // model:"gemini-2.5-pro",
        // model:"gemini-2.5-flash-preview-05-20",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    console.log("RAW AI TEXT:", response.text); // add this
console.log("report: ", JSON.parse(response.text));
return JSON.parse(response.text)


}


async function generatePdfFromHtml(htmlContent) {
 
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, 
            { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        return pdfBuffer;

}

async function generateResumePdf({resume, selfDescription, jobDescription}) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt=`Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })

    const jsonContent=JSON.parse(response.text);

    const pdfBuffer=await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;

}





module.exports = { 
    generateInterviewReport,
    generateResumePdf
 }