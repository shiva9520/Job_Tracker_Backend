const express = require('express');
const connectDB = require('./config/db');
const app = express()
const cors = require('cors')
require('dotenv').config();
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const PORT = process.env.PORT; 

connectDB();
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/jobs',jobRoutes)

app.listen(PORT,(err)=>{
    if (err) {
        console.log('Server Error')
    }else{
        console.log(`Server is running on ${PORT}`)
    }
})
