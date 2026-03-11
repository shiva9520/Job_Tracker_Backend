const express = require('express')
const { createJob } = require('../controllers/jobController')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware,createJob)

module.exports = router