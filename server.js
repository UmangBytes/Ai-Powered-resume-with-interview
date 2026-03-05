require("dotenv").config({quiet:true});

const app=require('./src/app')
const connectDB=require('./src/config/database')
connectDB()

const PORT=process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log(`Server Running  on PORT:${PORT}`);
})