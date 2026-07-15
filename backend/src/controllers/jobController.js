import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listJobs = asyncHandler(async (req, res) => {
  const { q = "", location = "", type = "", remote = "", skill = "", page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const rows = await query(
    `SELECT j.*, c.name company_name, c.logo_url
     FROM jobs j
     LEFT JOIN companies c ON c.id = j.company_id
     WHERE j.title LIKE :q AND j.location LIKE :location
       AND (:type = '' OR j.job_type = :type)
       AND (:remote = '' OR j.work_mode = :remote)
       AND (:skill = '' OR j.skills LIKE :skill)
     ORDER BY j.created_at DESC LIMIT :limit OFFSET :offset`,
    { q: `%${q}%`, location: `%${location}%`, type, remote, skill: `%${skill}%`, limit: Number(limit), offset }
  );
  res.json({ success: true, data: rows, page: Number(page) });
});

export const getJob = asyncHandler(async (req, res) => {
  const rows = await query("SELECT * FROM jobs WHERE id = :id", { id: req.params.id });
  res.json({ success: true, data: rows[0] || null });
});

export const createJob = asyncHandler(async (req, res) => {
  const result = await query(
    `INSERT INTO jobs (recruiter_id, company_id, category_id, title, description, location, salary_min, salary_max, experience_level, job_type, work_mode, skills, status)
     VALUES (:recruiterId, :companyId, :categoryId, :title, :description, :location, :salaryMin, :salaryMax, :experienceLevel, :jobType, :workMode, :skills, 'active')`,
    { recruiterId: req.user.id, ...req.body }
  );
  res.status(201).json({ success: true, id: result.insertId });
});

export const updateJob = asyncHandler(async (req, res) => {
  await query(
    `UPDATE jobs SET title=:title, description=:description, location=:location, salary_min=:salaryMin,
     salary_max=:salaryMax, experience_level=:experienceLevel, job_type=:jobType, work_mode=:workMode, skills=:skills, status=:status
     WHERE id=:id AND recruiter_id=:recruiterId`,
    { id: req.params.id, recruiterId: req.user.id, ...req.body }
  );
  res.json({ success: true, message: "Job updated" });
});

export const deleteJob = asyncHandler(async (req, res) => {
  await query("DELETE FROM jobs WHERE id = :id AND recruiter_id = :recruiterId", { id: req.params.id, recruiterId: req.user.id });
  res.json({ success: true, message: "Job deleted" });
});

export const closeJob = asyncHandler(async (req, res) => {
  await query("UPDATE jobs SET status = 'inactive' WHERE id = :id AND recruiter_id = :recruiterId", {
    id: req.params.id,
    recruiterId: req.user.id
  });
  res.json({ success: true, message: "Job closed" });
});
