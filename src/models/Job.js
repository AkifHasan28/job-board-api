import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company:     { type: String, required: true, trim: true },
    location:    { type: String, required: true, trim: true },
    salary:      { type: Number, min: 0 },
    datePosted:  { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
