import { Parser } from "json2csv";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (_req, res) => {
  const [totals] = await query(`
    SELECT
      (SELECT COUNT(*) FROM users) totalUsers,
      (SELECT COUNT(*) FROM users WHERE role='recruiter') totalRecruiters,
      (SELECT COUNT(*) FROM users WHERE role='candidate') totalApplicants,
      (SELECT COUNT(*) FROM jobs) jobsPosted,
      (SELECT COUNT(*) FROM applications) applicationsReceived,
      (SELECT COUNT(*) FROM interviews) interviewsScheduled,
      (SELECT COUNT(*) FROM applications WHERE status='under_review') pendingReviews,
      (SELECT COUNT(*) FROM jobs WHERE status='active') activeJobs,
      (SELECT COUNT(*) FROM jobs WHERE status='inactive') inactiveJobs
  `);
  const monthly = await query(`
    SELECT DATE_FORMAT(created_at, '%Y-%m') month, COUNT(*) applications
    FROM applications GROUP BY month ORDER BY month DESC LIMIT 12
  `);
  const activities = await query("SELECT * FROM reports ORDER BY created_at DESC LIMIT 8");
  const notifications = await query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 8");
  res.json({ success: true, totals, monthly: monthly.reverse(), activities, notifications });
});

export const listUsers = asyncHandler(async (req, res) => {
  const role = req.query.role;
  const rows = await query(
    `SELECT id, name, email, role, status, created_at FROM users ${role ? "WHERE role = :role" : ""} ORDER BY created_at DESC`,
    { role }
  );
  res.json({ success: true, data: rows });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  await query("UPDATE users SET status = :status WHERE id = :id", { status: req.body.status, id: req.params.id });
  res.json({ success: true, message: "User status updated" });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await query("DELETE FROM users WHERE id = :id", { id: req.params.id });
  res.json({ success: true, message: "User deleted" });
});

export const approveRecruiter = asyncHandler(async (req, res) => {
  await query("UPDATE recruiters SET approval_status = :status WHERE user_id = :id", { status: req.body.status, id: req.params.id });
  await query("UPDATE users SET status = :userStatus WHERE id = :id", {
    userStatus: req.body.status === "approved" ? "active" : "rejected",
    id: req.params.id
  });
  res.json({ success: true, message: "Recruiter review updated" });
});

export const crudList = (table) =>
  asyncHandler(async (_req, res) => {
    const rows = await query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
    res.json({ success: true, data: rows });
  });

export const crudCreate = (table) =>
  asyncHandler(async (req, res) => {
    const { name, description = null } = req.body;
    const result = await query(`INSERT INTO ${table} (name, description) VALUES (:name, :description)`, { name, description });
    res.status(201).json({ success: true, id: result.insertId });
  });

export const reports = asyncHandler(async (_req, res) => {
  const rows = await query("SELECT * FROM reports ORDER BY created_at DESC");
  res.json({ success: true, data: rows });
});

export const exportCsv = asyncHandler(async (_req, res) => {
  const rows = await query("SELECT id, title, location, status, created_at FROM jobs ORDER BY created_at DESC");
  const parser = new Parser();
  res.header("Content-Type", "text/csv");
  res.attachment("jobs-report.csv");
  res.send(parser.parse(rows));
});

export const exportPdf = asyncHandler(async (_req, res) => {
  const [totals] = await query(`
    SELECT
      (SELECT COUNT(*) FROM users) users,
      (SELECT COUNT(*) FROM jobs) jobs,
      (SELECT COUNT(*) FROM applications) applications,
      (SELECT COUNT(*) FROM interviews) interviews
  `);
  const text = `TalentFlow Hiring Report\\nUsers: ${totals.users}\\nJobs: ${totals.jobs}\\nApplications: ${totals.applications}\\nInterviews: ${totals.interviews}`;
  const stream = `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${text.length + 64}>>stream
BT /F1 18 Tf 72 720 Td (${text.replace(/\n/g, ") Tj T* (")}) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
trailer<</Size 6/Root 1 0 R>>
startxref
0
%%EOF`;
  res.header("Content-Type", "application/pdf");
  res.attachment("talentflow-report.pdf");
  res.send(Buffer.from(stream));
});
