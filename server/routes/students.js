const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students - Get all students with optional search & filter
router.get('/', async (req, res) => {
  try {
    const { search, department, status, year, sort } = req.query;
    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by year
    if (year && year !== 'All') {
      query.year = year;
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'name') sortOption = { firstName: 1 };
    if (sort === 'gpa-high') sortOption = { gpa: -1 };
    if (sort === 'gpa-low') sortOption = { gpa: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const students = await Student.find(query).sort(sortOption);
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching students' });
  }
});

// GET /api/students/stats - Get statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ status: 'Active' });
    const graduated = await Student.countDocuments({ status: 'Graduated' });
    const inactive = await Student.countDocuments({ status: 'Inactive' });
    const suspended = await Student.countDocuments({ status: 'Suspended' });

    // Average GPA
    const gpaResult = await Student.aggregate([
      { $group: { _id: null, avgGpa: { $avg: '$gpa' } } }
    ]);
    const avgGpa = gpaResult.length > 0 ? Math.round(gpaResult[0].avgGpa * 100) / 100 : 0;

    // Department distribution
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Year distribution
    const yearStats = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        graduated,
        inactive,
        suspended,
        avgGpa,
        departmentStats,
        yearStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching stats' });
  }
});

// GET /api/students/:id - Get single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/students - Create new student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student, message: 'Student added successfully' });
  } catch (error) {
    console.error('Error creating student:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A student with this email already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error while creating student' });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A student with this email already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error while updating student' });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({ success: false, message: 'Server error while deleting student' });
  }
});

module.exports = router;
