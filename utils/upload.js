// import multer from "multer";

// const upload = multer({ dest: 'uploads' });

// export default upload;

import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get proper directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log(`Storing file in: ${uploadsDir}`);
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    console.log(`Generated filename: ${uniqueFilename}`);
    cb(null, uniqueFilename);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(`Received file: ${file.originalname}, type: ${file.mimetype}`);
    cb(null, true);
  }
});

export default upload;
