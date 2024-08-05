import Class from '../models/Class.js';

export const createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newClass = new Class({ name, description });
    await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

export const listClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};
