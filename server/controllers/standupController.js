const supabase = require('../config/supabase');

/**
 * POST /api/standups
 * Submit a daily standup for the currently authenticated student.
 * Prevents duplicate entries for the same student on the same day.
 */
const submitStandup = async (req, res, next) => {
  try {
    const { yesterday, today, blockers, mood } = req.body;
    const dateStr = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

    // Check for duplicate standup today
    const { data: existing, error: checkError } = await supabase
      .from('standups')
      .select('id')
      .eq('student_id', req.user._id)
      .gte('date', dateStr)
      .lt('date', tomorrowStr)
      .limit(1);

    if (checkError) {
      console.error('Supabase check error:', checkError);
      return res.status(500).json({ message: 'Database error checking standups' });
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'Standup already submitted today' });
    }

    // Insert the standup record
    const { data: insertedRows, error: insertError } = await supabase
      .from('standups')
      .insert([
        {
          student_id: req.user._id,
          yesterday: yesterday,
          today: today,
          blockers: blockers,
          mood: mood,
          date: new Date().toISOString(),
        },
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ message: 'Database error submitting standup' });
    }

    const standup = insertedRows[0];

    res.status(201).json({
      standup: {
        _id: standup.id,
        studentId: standup.student_id,
        student: req.user,
        yesterday: standup.yesterday,
        today: standup.today,
        blockers: standup.blockers,
        mood: standup.mood,
        date: standup.date,
        createdAt: standup.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/standups/my
 * Retrieve all standups for the currently authenticated student.
 */
const getMyStandups = async (req, res, next) => {
  try {
    const { data: standups, error: fetchError } = await supabase
      .from('standups')
      .select('*')
      .eq('student_id', req.user._id)
      .order('date', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ message: 'Database error fetching standups' });
    }

    const mapped = standups.map(function (s) {
      return {
        _id: s.id,
        studentId: s.student_id,
        yesterday: s.yesterday,
        today: s.today,
        blockers: s.blockers,
        mood: s.mood,
        date: s.date,
        createdAt: s.created_at,
      };
    });

    res.status(200).json({ standups: mapped });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/standups/all
 * Retrieve all standups across all students (instructor only).
 * Joins the `users` table to include student details.
 */
const getAllStandups = async (req, res, next) => {
  try {
    const { data: standups, error: fetchError } = await supabase
      .from('standups')
      .select('*, users:student_id(id, name, email, role, enrollment_id, batch)')
      .order('date', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ message: 'Database error fetching standups' });
    }

    const mapped = standups.map(function (s) {
      var student = s.users;
      return {
        _id: s.id,
        studentId: s.student_id,
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
        yesterday: s.yesterday,
        today: s.today,
        blockers: s.blockers,
        mood: s.mood,
        date: s.date,
        createdAt: s.created_at,
      };
    });

    res.status(200).json({ standups: mapped });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitStandup, getMyStandups, getAllStandups };
