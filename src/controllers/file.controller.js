import File from '../models/File.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url); // Define __filename
const __dirname = path.dirname(__filename); // Define __dirname


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage }).single('file');


export const uploadFile = async (req, res) => {
    try {
      const { classId } = req.body; // Make sure classId is correctly extracted
      if (!classId) {
        return res.status(400).json({ message: 'Class ID is required' });
      }
  
      const { filename, path: filePath } = req.file;
      const newFile = new File({
        class: classId, // Ensure this field is populated
        filename,
        path: filePath,
      });
  
      await newFile.save();
      
    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};


export const listFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
};


export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(file.path, file.filename, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading file', error: err.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file', error: error.message });
  }
};
