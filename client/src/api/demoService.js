import API from './axios';

export const submitDemo = (data) => API.post('/demos', data);
export const getMyDemos = () => API.get('/demos/my');
export const getAllDemos = (params) => API.get('/demos/all', { params });
export const reviewDemo = (id, data) => API.put(`/demos/${id}/review`, data);
