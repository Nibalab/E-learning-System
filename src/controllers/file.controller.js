import File from '../models/File.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


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
    const { classId } = req.body;
    const { filename, path: filePath } = req.file;

    const newFile = new File({
      class: classId,
      filename,
      path: filePath
    });

    await newFile.save();

    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
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
