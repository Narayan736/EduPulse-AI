const supabase = require('../config/supabase');

/**
 * POST /api/demos
 * Submit a new demo for the currently authenticated student.
 */
const submitDemo = async (req, res, next) => {
  try {
    const { title, description, repoUrl, deployedUrl } = req.body;

    const { data: insertedRows, error: insertError } = await supabase
      .from('demos')
      .insert([
        {
          student_id: req.user._id,
          title: title,
          description: description,
          repo_url: repoUrl || null,
          deployed_url: deployedUrl || null,
          status: 'submitted',
          score: 0,
          feedback: '',
        },
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ message: 'Database error submitting demo' });
    }

    const demo = insertedRows[0];

    res.status(201).json({
      demo: {
        _id: demo.id,
        studentId: demo.student_id,
        student: req.user,
        title: demo.title,
        description: demo.description,
        repoUrl: demo.repo_url,
        deployedUrl: demo.deployed_url,
        status: demo.status,
        score: demo.score,
        feedback: demo.feedback,
        createdAt: demo.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/demos/my
 * Retrieve all demos submitted by the currently authenticated student.
 */
const getMyDemos = async (req, res, next) => {
  try {
    const { data: demos, error: fetchError } = await supabase
      .from('demos')
      .select('*')
      .eq('student_id', req.user._id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ message: 'Database error fetching demos' });
    }

    const mapped = demos.map(function (d) {
      return {
        _id: d.id,
        studentId: d.student_id,
        title: d.title,
        description: d.description,
        repoUrl: d.repo_url,
        deployedUrl: d.deployed_url,
        status: d.status,
        score: d.score,
        feedback: d.feedback,
        createdAt: d.created_at,
      };
    });

    res.status(200).json({ demos: mapped });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/demos/all
 * Retrieve all demos across all students (instructor only).
 * Joins the `users` table to include student details.
 */
const getAllDemos = async (req, res, next) => {
  try {
    const { data: demos, error: fetchError } = await supabase
      .from('demos')
      .select('*, users:student_id(id, name, email, role, enrollment_id, batch)')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ message: 'Database error fetching demos' });
    }

    const mapped = demos.map(function (d) {
      var student = d.users;
      return {
        _id: d.id,
        studentId: d.student_id,
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
        title: d.title,
        description: d.description,
        repoUrl: d.repo_url,
        deployedUrl: d.deployed_url,
        status: d.status,
        score: d.score,
        feedback: d.feedback,
        createdAt: d.created_at,
      };
    });

    res.status(200).json({ demos: mapped });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/demos/:id/review
 * Instructor reviews a demo — updates status, score, and feedback.
 */
const reviewDemo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, score, feedback } = req.body;

    // Update the demo record in Supabase
    const { data: updatedRows, error: updateError } = await supabase
      .from('demos')
      .update({
        status: status,
        score: score,
        feedback: feedback,
      })
      .eq('id', id)
      .select('*, users:student_id(id, name, email, role, enrollment_id, batch)');

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return res.status(500).json({ message: 'Database error reviewing demo' });
    }

    if (!updatedRows || updatedRows.length === 0) {
      return res.status(404).json({ message: 'Demo not found' });
    }

    const d = updatedRows[0];
    var student = d.users;

    res.status(200).json({
      demo: {
        _id: d.id,
        studentId: d.student_id,
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
        title: d.title,
        description: d.description,
        repoUrl: d.repo_url,
        deployedUrl: d.deployed_url,
        status: d.status,
        score: d.score,
        feedback: d.feedback,
        createdAt: d.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitDemo, getMyDemos, getAllDemos, reviewDemo };
