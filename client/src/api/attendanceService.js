import API from './axios';

export const markAttendance = (data) => API.post('/attendance/mark', data);
export const getMyAttendance = (params) => API.get('/attendance/my', { params });
export const getAllAttendance = (params) => API.get('/attendance/all', { params });
export const bulkMarkAttendance = (data) => API.post('/attendance/bulk', data);
