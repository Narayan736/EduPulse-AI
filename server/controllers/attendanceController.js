const supabase = require('../config/supabase');

/**
 * POST /api/attendance/mark
 * Mark attendance for the currently authenticated student.
 * Prevents duplicate entries for the same student on the same day.
 */
const markAttendance = async (req, res, next) => {
  try {
    const { status } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    // Check if attendance already marked today
    const { data: existing, error: checkError } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', req.user._id)
      .gte('date', today)
      .lt('date', tomorrow)
      .limit(1);

    if (checkError) {
      console.error('Supabase check error:', checkError);
      return res.status(500).json({ message: 'Database error checking attendance' });
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'Attendance already marked today' });
    }

    // Insert the attendance record
    const { data: insertedRows, error: insertError } = await supabase
      .from('attendance')
      .insert([
        {
          student_id: req.user._id,
          date: new Date().toISOString(),
          status: status || 'present',
        },
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ message: 'Database error marking attendance' });
    }

    const record = insertedRows[0];

    res.status(201).json({
      record: {
        _id: record.id,
        studentId: record.student_id,
        student: req.user,
        date: record.date,
        status: record.status,
        createdAt: record.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/my
 * Retrieve all attendance records for the currently authenticated student.
 */
const getMyAttendance = async (req, res, next) => {
  try {
    const { data: records, error: fetchError } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', req.user._id)
      .order('date', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ message: 'Database error fetching attendance' });
    }

    // Map Supabase column names to the API response format
    const mapped = records.map(function (record) {
      return {
        _id: record.id,
        studentId: record.student_id,
        date: record.date,
        status: record.status,
        createdAt: record.created_at,
      };
    });

    res.status(200).json({ records: mapped });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/all
 * Retrieve all attendance records (instructor only).
 * Joins the `users` table to include student details.
 */
const getAllAttendance = async (req, res, next) => {
  try {
    const { data: records, error: fetchError } = await supabase
      .from('attendance')
      .select('*, users:student_id(id, name, email, role, enrollment_id, batch)')
      .order('date', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ message: 'Database error fetching attendance' });
    }

    // Map Supabase column names to the API response format
    const mapped = records.map(function (record) {
      var student = record.users;
      return {
        _id: record.id,
        studentId: record.student_id,
        student: student
          ? {
              _id: student.id,
              name: student.name,
              email: student.email,
              role: student.role,
              enrollmentId: student.enrollment_id,
              batch: student.batch,
            }
          : null,
        date: record.date,
        status: record.status,
        createdAt: record.created_at,
      };
    });

    res.status(200).json({ records: mapped });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/attendance/bulk
 * Bulk-mark attendance for multiple students (instructor only).
 * Expects req.body.updates = [{ student: "<user-id>", status: "present"|"absent" }]
 */
const bulkMark = async (req, res, next) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'No attendance updates provided' });
    }

    const rowsToInsert = updates.map(function (u) {
      return {
        student_id: u.student,
        date: new Date().toISOString(),
        status: u.status,
      };
    });

    const { error: insertError } = await supabase
      .from('attendance')
      .insert(rowsToInsert);

    if (insertError) {
      console.error('Supabase bulk insert error:', insertError);
      return res.status(500).json({ message: 'Database error during bulk attendance' });
    }

    res.status(200).json({ message: 'Bulk attendance recorded' });
  } catch (err) {
    next(err);
  }
};

module.exports = { markAttendance, getMyAttendance, getAllAttendance, bulkMark };
