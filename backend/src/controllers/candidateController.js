import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recommendJobs } from "../services/aiService.js";

export const profile = asyncHandler(async (req, res) => {
  const rows = await query("SELECT * FROM candidates WHERE user_id = :userId", { userId: req.user.id });
  res.json({ success: true, data: rows[0] || null });
});

export const updateProfile = asyncHandler(async (req, res) => {
  await query(
    `UPDATE candidates SET headline=:headline, location=:location, phone=:phone, summary=:summary, github=:github,
     linkedin=:linkedin, website=:website WHERE user_id=:userId`,
    { userId: req.user.id, ...req.body }
  );
  res.json({ success: true, message: "Profile updated" });
});

export const uploadResumeFile = asyncHandler(async (req, res) => {
  await query("UPDATE candidates SET resume_url = :resumeUrl WHERE user_id = :userId", {
    resumeUrl: `/uploads/resumes/${req.file.filename}`,
    userId: req.user.id
  });
  res.json({ success: true, resumeUrl: `/uploads/resumes/${req.file.filename}` });
});

export const applyJob = asyncHandler(async (req, res) => {
  const result = await query("INSERT INTO applications (job_id, candidate_id, cover_letter, status) VALUES (:jobId, :candidateId, :coverLetter, 'applied')", {
    jobId: req.params.jobId,
    candidateId: req.user.id,
    coverLetter: req.body.coverLetter || ""
  });
  res.status(201).json({ success: true, id: result.insertId });
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  await query("UPDATE applications SET status = 'withdrawn' WHERE id = :id AND candidate_id = :candidateId", {
    id: req.params.id,
    candidateId: req.user.id
  });
  res.json({ success: true, message: "Application withdrawn" });
});

export const applications = asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT a.*, j.title, c.name company_name FROM applications a
     JOIN jobs j ON j.id = a.job_id LEFT JOIN companies c ON c.id = j.company_id
     WHERE a.candidate_id = :candidateId ORDER BY a.created_at DESC`,
    { candidateId: req.user.id }
  );
  res.json({ success: true, data: rows });
});

export const bookmarkJob = asyncHandler(async (req, res) => {
  await query("INSERT IGNORE INTO bookmarks (candidate_id, job_id) VALUES (:candidateId, :jobId)", {
    candidateId: req.user.id,
    jobId: req.params.jobId
  });
  res.status(201).json({ success: true, message: "Job bookmarked" });
});

export const recommendations = asyncHandler(async (req, res) => {
  const skills = await query("SELECT s.name FROM candidate_skills cs JOIN skills s ON s.id = cs.skill_id WHERE cs.candidate_id = :id", { id: req.user.id });
  const jobs = await query("SELECT * FROM jobs WHERE status = 'active'");
  res.json({ success: true, data: recommendJobs(skills.map((s) => s.name), jobs).slice(0, 10) });
});
