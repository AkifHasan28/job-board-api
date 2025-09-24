import { Router } from "express";
import Job from "../models/Job.js";
import auth, { requireRole } from "../middleware/auth.js";

const router = Router();

// GET /jobs -> list jobs with search, filters, sorting, pagination (public)
router.get("/", async (req, res) => {
  try {
    const {
      // filters
      location,
      company,
      minSalary,
      maxSalary,
      from,       // ISO date string e.g. 2025-01-01
      to,         // ISO date string
      q,          // text search

      // pagination & sort
      page = 1,
      limit = 10,
      sort = "-createdAt", // "-createdAt", "salary", "-salary", "company"
    } = req.query;

    const filters = {};

    if (location) filters.location = location;
    if (company) filters.company = company;

    // salary range
    if (minSalary || maxSalary) {
      filters.salary = {};
      if (minSalary) filters.salary.$gte = Number(minSalary);
      if (maxSalary) filters.salary.$lte = Number(maxSalary);
    }

    // createdAt range
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    // text search (requires jobSchema.index({...}) in the model)
    let projection;
    let sortObj;

    if (q) {
      filters.$text = { $search: q };
      projection = { score: { $meta: "textScore" } };
      sortObj = { score: { $meta: "textScore" } };
    } else {
      // parse sort string into object
      sortObj = {};
      String(sort)
        .split(",")
        .filter(Boolean)
        .forEach((field) => {
          if (field.startsWith("-")) sortObj[field.slice(1)] = -1;
          else sortObj[field] = 1;
        });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * lim;

    const [total, data] = await Promise.all([
      Job.countDocuments(filters),
      Job.find(filters, projection).sort(sortObj).skip(skip).limit(lim),
    ]);

    res.json({
      page: pageNum,
      limit: lim,
      total,
      totalPages: Math.ceil(total / lim) || 1,
      hasPrev: pageNum > 1,
      hasNext: pageNum * lim < total,
      data,
    });
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
