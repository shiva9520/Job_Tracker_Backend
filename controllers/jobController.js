const Job = require("../models/Job");
const createJob = async (req, res) => {
  try {
    const { company, position, status, notes } = req.body;
    const job = await Job.create({
      company,
      position,
      status,
      notes,
      user: req.body.user,
    });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.status(200).json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let queryObject = {
      user: req.user._id,
    };
    if (status) {
      queryObject.status = status;
    }
    if (search) {
      queryObject.$or = [
        {
          company: { $regex: search, $options: "i" },
          position: { $regex: search, $options: "i" },
        },
      ];
    }

    const skip = (page - 1) * limit;
    const jobs = await Job.find(queryObject)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalJobs = await Job.countDocuments(queryObject);

    res.status(200).json({ totalJobs, page: Number(page), jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOne({
      _id: id,
      user: req.body.user,
    });
    if (!job) {
      return res.status(404).json({ message: "Job Not Found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id.toString() },
      req.body,
      { returnDocument: "after" },
    );

    if (!job) {
      return res.status(404).json({ message: "Job Not Found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.user);
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.body.user,
    });
    console.log("jobbb: ", job);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
};
