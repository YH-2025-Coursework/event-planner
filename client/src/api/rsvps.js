import apiClient from './client';

export const getMyRsvps = () => apiClient.get('/rsvps/my');
export const createRsvp = (data) => apiClient.post('/rsvps', data);
export const deleteRsvp = (id) => apiClient.delete(`/rsvps/${id}`);