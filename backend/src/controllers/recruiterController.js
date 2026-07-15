import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendInterviewInvitationEmail } from "../services/emailService.js";

export const createCompany = asyncHandler(async (req, res) => {
  const result = await query(
    `INSERT INTO companies (owner_id, name, description, website, employees, industry, headquarters, logo_url)
     VALUES (:ownerId, :name, :description, :website, :employees, :industry, :headquarters, :logoUrl)`,
    { ownerId: req.user.id, logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : null, ...req.body }
  );
  res.status(201).json({ success: true, id: result.insertId });
});

export const myApplications = asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT a.*, u.name candidate_name, u.email candidate_email, j.title job_title, cand.resume_url
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN users u ON u.id = a.candidate_id
     LEFT JOIN candidates cand ON cand.user_id = u.id
     WHERE j.recruiter_id = :recruiterId
     ORDER BY a.created_at DESC`,
    { recruiterId: req.user.id }
  );
  res.json({ success: true, data: rows });
});

export const moveApplication = asyncHandler(async (req, res) => {
  await query("UPDATE applications SET status = :status WHERE id = :id", { status: req.body.status, id: req.params.id });
  res.json({ success: true, message: "Application stage updated" });
});

export const scheduleInterview = asyncHandler(async (req, res) => {
  const result = await query(
    `INSERT INTO interviews (application_id, scheduled_at, mode, location, notes, status)
     VALUES (:applicationId, :scheduledAt, :mode, :location, :notes, 'scheduled')`,
    { applicationId: req.params.applicationId, ...req.body }
  );
  await query("UPDATE applications SET status='interview_scheduled' WHERE id = :applicationId", {
    applicationId: req.params.applicationId
  });
  const candidates = await query(
    `SELECT u.email FROM applications a JOIN users u ON u.id = a.candidate_id WHERE a.id = :applicationId`,
    { applicationId: req.params.applicationId }
  );
  if (candidates[0]) await sendInterviewInvitationEmail(candidates[0], req.body);
  res.status(201).json({ success: true, id: result.insertId });
});

export const analytics = asyncHandler(async (req, res) => {
  const funnel = await query(
    `SELECT a.status, COUNT(*) count FROM applications a JOIN jobs j ON j.id = a.job_id
     WHERE j.recruiter_id = :id GROUP BY a.status`,
    { id: req.user.id }
  );
  const jobs = await query("SELECT status, COUNT(*) count FROM jobs WHERE recruiter_id = :id GROUP BY status", { id: req.user.id });
  res.json({ success: true, funnel, jobs });
});
