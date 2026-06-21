import API from './axios';

export const generateReport = (studentId) =>
  API.post(`/ai/report/${studentId}`);

export const generateBatchReport = (data) =>
  API.post('/ai/report/batch', data);

export const getReports = (params) =>
  API.get('/ai/reports', { params });

export const getReport = (reportId) =>
  API.get(`/ai/reports/${reportId}`);
