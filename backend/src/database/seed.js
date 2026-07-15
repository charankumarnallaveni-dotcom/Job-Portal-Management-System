import fs from "fs/promises";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { pool, query } from "../config/db.js";
import { env } from "../config/env.js";

const schema = await fs.readFile(new URL("./schema.sql", import.meta.url), "utf8");
const bootstrap = await mysql.createConnection({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  multipleStatements: true
});
await bootstrap.query(schema);
await bootstrap.end();

const password = await bcrypt.hash("Password123!", 12);
await query("DELETE FROM reports");
await query("DELETE FROM notifications");
await query("DELETE FROM messages");
await query("DELETE FROM interviews");
await query("DELETE FROM applications");
await query("DELETE FROM bookmarks");
await query("DELETE FROM jobs");
await query("DELETE FROM companies");
await query("DELETE FROM candidates");
await query("DELETE FROM recruiters");
await query("DELETE FROM users");
await query("DELETE FROM categories");
await query("DELETE FROM skills");

const admin = await query("INSERT INTO users (name,email,password_hash,role,status) VALUES ('Avery Admin','admin@talentflow.dev',:password,'admin','active')", { password });
const recruiter = await query("INSERT INTO users (name,email,password_hash,role,status) VALUES ('Riley Recruiter','recruiter@talentflow.dev',:password,'recruiter','active')", { password });
const candidate = await query("INSERT INTO users (name,email,password_hash,role,status) VALUES ('Casey Candidate','candidate@talentflow.dev',:password,'candidate','active')", { password });

await query("INSERT INTO recruiters (user_id, approval_status, title) VALUES (:id, 'approved', 'Senior Technical Recruiter')", { id: recruiter.insertId });
await query("INSERT INTO candidates (user_id, headline, location, summary, github, linkedin, website) VALUES (:id, 'Full Stack Engineer', 'Bengaluru', 'React and Node engineer with product-minded delivery.', 'https://github.com/casey', 'https://linkedin.com/in/casey', 'https://casey.dev')", { id: candidate.insertId });

for (const name of ["Engineering", "Design", "Product", "Data", "Sales"]) {
  await query("INSERT INTO categories (name, description) VALUES (:name, :description)", { name, description: `${name} roles` });
}
for (const name of ["React", "TypeScript", "Node.js", "MySQL", "AWS", "Docker", "Product Strategy"]) {
  await query("INSERT INTO skills (name) VALUES (:name)", { name });
}

const company = await query("INSERT INTO companies (owner_id, name, description, website, employees, industry, headquarters, social_media) VALUES (:owner, 'Northstar Labs', 'Cloud hiring platform team building enterprise workflow systems.', 'https://northstar.example', '501-1000', 'SaaS', 'Seattle', JSON_OBJECT('linkedin','https://linkedin.com/company/northstar'))", { owner: recruiter.insertId });

const job = await query("INSERT INTO jobs (recruiter_id, company_id, category_id, title, description, location, salary_min, salary_max, experience_level, job_type, work_mode, skills, status) VALUES (:recruiter, :company, 1, 'Senior Full Stack Engineer', 'Build scalable SaaS workflows with React, Node.js, and MySQL.', 'Remote', 120000, 170000, 'Senior', 'full_time', 'remote', 'React,TypeScript,Node.js,MySQL,AWS', 'active')", { recruiter: recruiter.insertId, company: company.insertId });

await query("INSERT INTO applications (job_id, candidate_id, cover_letter, status, ats_score) VALUES (:job, :candidate, 'Excited to build high quality hiring software.', 'shortlisted', 88)", { job: job.insertId, candidate: candidate.insertId });
await query("INSERT INTO notifications (user_id, title, body, type) VALUES (:user, 'Application shortlisted', 'Northstar Labs moved your application to shortlisted.', 'application')", { user: candidate.insertId });
await query("INSERT INTO reports (title, body, report_type) VALUES ('Weekly hiring health', 'Applications are up 18% and review SLA is improving.', 'analytics')");

console.log("Seed complete");
console.log("Admin: admin@talentflow.dev / Password123!");
console.log("Recruiter: recruiter@talentflow.dev / Password123!");
console.log("Candidate: candidate@talentflow.dev / Password123!");
await pool.end();
