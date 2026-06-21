const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

/**
 * Middleware: Protect routes by verifying JWT and loading the user from Supabase.
 * Attaches the user object (without password) to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look up the user in Supabase by their ID from the JWT payload
    const { data: users, error: lookupError } = await supabase
      .from('users')
      .select('id, name, email, role, enrollment_id, batch')
      .eq('id', decoded.id)
      .limit(1);

    if (lookupError) {
      console.error('Supabase user lookup error in auth middleware:', lookupError);
      return res.status(401).json({ message: 'Not authorized — database error' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Not authorized — user not found' });
    }

    const user = users[0];

    // Map Supabase column names to the API format and attach to request
    req.user = {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollmentId: user.enrollment_id,
      batch: user.batch,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — token invalid or expired' });
  }
};

module.exports = { protect };
