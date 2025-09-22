import { Router } from "express";
import Job from "../models/Job.js";

const router = Router();

// GET /jobs  -> list all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// POST /jobs -> create a new job
router.post("/", async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    // basic validation
    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newJob = new Job({ title, description, company, location, salary });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /jobs/:id -> get one job by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // quick guard for invalid ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /jobs/:id -> update a job
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    // allow partial updates, but keep validation
    const updates = req.body;

    const updated = await Job.findByIdAndUpdate(id, updates, {
      new: true,            // return the updated doc
      runValidators: true,  // respect schema rules
    });

    if (!updated) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /jobs/:id -> delete a job
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted", id: deleted._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
