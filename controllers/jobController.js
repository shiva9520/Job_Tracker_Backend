const Job = require('../models/Job')
const createJob = async (req,res) =>{
    try {
        const { company, position, status, notes } = req.body;
        const job = await Job.create({
            company,
            position,
            status,
            notes,
            user: req.body.user
        })
        res.status(201).json(job)
    } catch (error) {
        res.status(500).json({message: error.message,})
    }
}

const getAllJobs = async (req,res)=>{
    try {
        const user = req.body.user;
        const jobs = await Job.find({user}).sort({createdAt: -1});
        res.status(201).json(jobs)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    createJob,
    getAllJobs
}