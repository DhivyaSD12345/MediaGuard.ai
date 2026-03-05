const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Deepfake Verification API is running' });
});

// Mock AI Analysis Endpoint
app.post('/api/analyze', upload.single('mediaFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No media file provided.' });
  }

  const { filename, mimetype, size } = req.file;
  console.log(`Analyzing file: ${filename} (${mimetype})`);

  // Simulate AI processing delay (3 seconds)
  setTimeout(() => {
    // Generate mock results
    const isAuthentic = Math.random() > 0.5; // Random result for demo
    const authenticityScore = isAuthentic
      ? Math.floor(Math.random() * (100 - 80) + 80) // 80-100 if authentic
      : Math.floor(Math.random() * (40 - 10) + 10); // 10-40 if fake

    const report = {
      id: Date.now().toString(),
      fileName: filename,
      fileType: mimetype,
      fileSize: size,
      timestamp: new Date().toISOString(),
      analysis: {
        authenticityScore: authenticityScore,
        conclusion: isAuthentic ? 'Likely Authentic' : 'High Probability of Manipulation',
        details: {
          facialArtifacts: isAuthentic ? 'None detected' : 'Inconsistencies detected around the eyes and mouth',
          pixelIrregularities: isAuthentic ? 'Normal distribution' : 'Abnormal compression patterns observed',
          metadataIntegrity: isAuthentic ? 'Intact' : 'Missing EXIF data; possible editing footprint present'
        }
      }
    };

    res.json(report);
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`Verification Server running on http://localhost:${PORT}`);
});
