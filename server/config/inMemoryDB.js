// In-memory array data store replacing Mongoose

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const db = {
  users: [],
  attendance: [],
  standups: [],
  demos: [],
  aiReports: [],
  generateId
};

module.exports = db;
