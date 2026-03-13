const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const UserModel = require('../models/user.model');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");

        addDummyData()
        
    } catch (error) {
        console.log("Error while connecting to mongodb:",error);
    }
}

const InterviewReport=require("../models/interviewReport.model")

async function addDummyData() {

    const hashedPassword=await bcrypt.hash("password123",10);

            const dummyUser = await  UserModel.create({
            username:     "Arjun Mehta",
            email:    "arjun.mehta@gmail.com",
            password: hashedPassword,
        });

    const dummyReport=await InterviewReport.create({
                jobDescription: `
                About Joveo
As the global leader in AI-powered, high-performance recruitment marketing, Joveo is transforming talent attraction and recruitment media buying for the world's largest employers, staffing firms, RPOs, and media agencies. The Joveo platform enables businesses to attract, source, engage, and hire the best candidates on time and within budget.

Role Overview:
As a Frontend Intern at Joveo, you'll be an integral part of our engineering team, working on projects that directly impact our user experience.

Responsibilities:
- Collaborate with designers and backend engineers to build user-friendly and responsive web interfaces.
- Develop and maintain clean, well-structured, and efficient frontend code.
- Troubleshoot and fix bugs to ensure optimal application performance.

Requirements:
- Bachelor's degree in computer science or a related technical field.
- Strong understanding of HTML, CSS, and JavaScript.
- Proficiency in at least one popular frontend framework (React, Angular, or Vue.js).
- Familiarity with modern JavaScript concepts (ES6+, TypeScript).
- Experience with version control systems (Git).
                `,
    matchScore: 88,

     resume :`
Name: Arjun Mehta
Email: arjun.mehta@gmail.com
Phone: +91-9876543210
Location: Ahmedabad, Gujarat

EDUCATION
Bachelor of Engineering in Computer Science
Vishwakarma Government Engineering College (VGEC), Ahmedabad
2022 – 2026 | CGPA: 7.8

SKILLS
Languages   : HTML, CSS, JavaScript (ES6+)
Frameworks  : React.js (basic), Bootstrap
Backend     : Node.js, Express.js
Database    : MongoDB
Tools       : Git, GitHub, Postman, VS Code

PROJECTS

1. Expense Tracker (MERN Stack)
   - Built a full-stack expense tracking app with user authentication using JWT.
   - Designed MongoDB schema for categorizing expenses by type and date.
   - Implemented REST APIs using Express.js for CRUD operations.
   - Created a basic React frontend with form handling and local state management.

2. AI Powered Blogging Website
   - Integrated Gemini API to auto-generate blog content based on user-provided keywords.
   - Used Node.js and Express for backend API handling.
   - Stored blog posts and user data in MongoDB.
   - Built a minimal React UI for creating, editing, and viewing blog posts.

EXPERIENCE
Freelance Web Developer (Remote) | 2024 – Present
   - Built and delivered 2 small business websites using HTML, CSS, and JavaScript.
   - Communicated requirements with clients and delivered projects within deadlines.

CERTIFICATIONS
- JavaScript Algorithms and Data Structures – freeCodeCamp (2023)
- Responsive Web Design – freeCodeCamp (2023)

LANGUAGES
- English (Intermediate), Gujarati (Native), Hindi (Fluent)
`,
    technicalQuestions: [
        {
            question: "Explain the Node.js event loop and how it handles asynchronous I/O operations.",
            intention: "To assess the candidate's deep understanding of Node.js internal architecture and non-blocking I/O.",
            answer: "The candidate should explain the different phases of the event loop (timers, pending callbacks, idle/prepare, poll, check, close). They should mention how Libuv handles the thread pool and how the callback queue works with the call stack to ensure performance without blocking the main thread."
        },
        {
            question: "How do you optimize a MongoDB aggregation pipeline for high-volume data?",
            intention: "To test practical experience with database performance and the candidate's claim of reducing response times by 35%.",
            answer: "Focus on using $match as early as possible to reduce the dataset, ensuring fields used in $match and $sort are indexed, and avoiding $unwind if possible as it inflates the document count. Mention the use of 'explain()' to analyze execution plans."
        },
        {
            question: "Can you describe the Cache-Aside pattern and when you would use Redis in a Node.js application?",
            intention: "To evaluate the candidate's understanding of caching strategies, given their basic knowledge of Redis.",
            answer: "The candidate should explain that the application first checks the cache; if data is missing (cache miss), it fetches from the DB, stores it in the cache, and returns it. They should discuss TTL (Time to Live) and cache invalidation strategies to prevent stale data."
        },
        {
            question: "What are the challenges of migrating a monolithic application to a modular service-based architecture?",
            intention: "To explore the candidate's experience with architectural changes and service boundaries.",
            answer: "Discuss data consistency across services, communication overhead (REST vs gRPC), service discovery, and the complexity of managing multiple deployments."
        }
    ],
    behavioralQuestions: [
        {
            question: "Describe a time when you had to optimize a piece of code that was causing production delays. How did you identify the bottleneck?",
            intention: "To evaluate problem-solving skills and the use of monitoring/profiling tools.",
            answer: "The candidate should use the STAR method. They should mention using tools like Chrome DevTools, New Relic, or MongoDB Atlas Profiler, the specific metrics they looked at, and the measurable impact of their fix."
        },
        {
            question: "How do you approach learning a new technology, such as your recent work with the Gemini API?",
            intention: "To assess adaptability and the ability to stay updated with industry trends.",
            answer: "The candidate should describe their process: reading official documentation, building a proof-of-concept, understanding the limitations, and eventually integrating it into a structured project."
        }
    ],
    skillGaps: [
        { skill: "Message Queues (Kafka/RabbitMQ)", severity: "high" },
        { skill: "Advanced Docker & CI/CD Pipelines", severity: "medium" },
        { skill: "Distributed Systems Design", severity: "medium" },
        { skill: "Production-level Redis management", severity: "low" }
    ],
    preparationPlan: [
        { day: 1, focus: "Node.js Internals & Streams", tasks: ["Deep dive into the Event Loop phases and process.nextTick vs setImmediate.", "Practice implementing Node.js Streams for handling large data sets."] },
        { day: 2, focus: "Advanced MongoDB & Indexing", tasks: ["Study Compound Indexes, TTL Indexes, and Text Indexes.", "Practice writing complex Aggregation pipelines and using the .explain('executionStats') method."] },
        { day: 3, focus: "Caching & Redis Strategies", tasks: ["Read about Redis data types beyond strings (Sets, Hashes, Sorted Sets).", "Implement a Redis-based rate limiter or a caching layer for a sample API."] },
        { day: 4, focus: "System Design & Microservices", tasks: ["Study Microservices communication patterns (Synchronous vs Asynchronous).", "Learn about the API Gateway pattern and Circuit Breakers."] },
        { day: 5, focus: "Message Queues & DevOps Basics", tasks: ["Watch introductory tutorials on RabbitMQ or Kafka.", "Dockerize a project and write a simple GitHub Actions workflow for CI."] },
        { day: 6, focus: "Data Structures & Algorithms", tasks: ["Solve 5-10 Medium LeetCode problems focusing on Arrays, Strings, and Hash Maps.", "Review common sorting and searching algorithms."] },
        { day: 7, focus: "Mock Interview & Project Review", tasks: ["Conduct a mock interview focusing on explaining the Real-time Chat Application architecture.", "Prepare concise summaries for all work experience bullets."] }
    ],
        title: "Senior Backend Developer",
        user: dummyUser._id
    })
}
module.exports=connectDB

