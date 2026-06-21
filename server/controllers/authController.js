const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/register
 * Create a new user account in Supabase `users` table.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, enrollmentId, batch } = req.body;

    // Check if user already exists
    const { data: existingUsers, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (lookupError) {
      console.error('Supabase lookup error:', lookupError);
      return res.status(500).json({ message: 'Database error during registration' });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into Supabase
    const { data: insertedRows, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: name,
          email: email,
          password: hashedPassword,
          role: role || 'student',
          enrollment_id: enrollmentId || null,
          batch: batch || null,
        },
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ message: 'Database error during registration' });
    }

    const user = insertedRows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentId: user.enrollment_id,
        batch: user.batch,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user with email + password against Supabase `users` table.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Look up the user by email
    const { data: users, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (lookupError) {
      console.error('Supabase lookup error:', lookupError);
      return res.status(500).json({ message: 'Database error during login' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentId: user.enrollment_id,
        batch: user.batch,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user (set by authMiddleware).
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
