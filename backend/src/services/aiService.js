const importantTerms = ["react", "typescript", "node", "express", "mysql", "aws", "docker", "leadership"];

export function calculateAtsScore(resumeText = "", jobSkills = []) {
  const text = resumeText.toLowerCase();
  const skills = jobSkills.length ? jobSkills : importantTerms;
  const matches = skills.filter((skill) => text.includes(String(skill).toLowerCase()));
  const score = Math.min(98, Math.round((matches.length / Math.max(skills.length, 1)) * 100 + 15));
  return { score, matchedSkills: matches, missingSkills: skills.filter((skill) => !matches.includes(skill)) };
}

export function recommendJobs(candidateSkills, jobs) {
  const normalized = candidateSkills.map((skill) => skill.toLowerCase());
  return jobs
    .map((job) => {
      const required = String(job.skills || "").toLowerCase().split(",").map((s) => s.trim());
      const matched = required.filter((skill) => normalized.includes(skill));
      return { ...job, matchPercentage: Math.round((matched.length / Math.max(required.length, 1)) * 100) };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
