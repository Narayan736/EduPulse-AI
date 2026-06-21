/**
 * Middleware factory: Restrict access to specific roles.
 * Usage: role('instructor') or role('student', 'instructor')
 *
 * Must be used AFTER the `protect` middleware (req.user must exist).
 */
const role = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = { role };
