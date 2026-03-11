const express = require('express')
const { createJob, getAllJobs } = require('../controllers/jobController')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',authMiddleware,getAllJobs)
router.post('/',authMiddleware,createJob)

module.exports = router