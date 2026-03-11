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

module.exports = {
    createJob
}