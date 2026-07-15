import path from "path";
import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const resumeStorage = multer.diskStorage({
  destination: "uploads/resumes",
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});

const logoStorage = multer.diskStorage({
  destination: "uploads/logos",
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});

function fileFilter(allowedExt) {
  return (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) return cb(new ApiError(400, `Unsupported file type: ${ext}`));
    cb(null, true);
  };
}

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter([".pdf", ".doc", ".docx"])
});

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter([".png", ".jpg", ".jpeg", ".webp"])
});
