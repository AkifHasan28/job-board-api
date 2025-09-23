import { Router } from "express";
import Job from "../models/Job.js";
import auth, { requireRole } from "../middleware/auth.js";

const router = Router();

// GET /jobs  -> list all jobs (public)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /jobs -> create a new job (auth required)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newJob = await Job.create({ title, description, company, location, salary });
    res.status(201).json(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /jobs/:id -> get one job by id (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /jobs/:id -> update a job (auth required)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const updated = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Job not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /jobs/:id -> delete a job (admin only)
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted", id: deleted._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
