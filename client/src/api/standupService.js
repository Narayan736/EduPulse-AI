import API from './axios';

export const submitStandup = (data) => API.post('/standups', data);
export const getMyStandups = (params) => API.get('/standups/my', { params });
export const getAllStandups = (params) => API.get('/standups/all', { params });
