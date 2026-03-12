const express = require('express')
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, getJobStats } = require('../controllers/jobController')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',authMiddleware,getAllJobs)
router.get('/stats',authMiddleware,getJobStats)
router.get('/:id',authMiddleware,getJobById)
router.post('/',authMiddleware,createJob)
router.put('/:id',authMiddleware,updateJob)
router.delete('/:id',authMiddleware,deleteJob)
module.exports = router