
import apiClient from './client';

export const getEvents = () => apiClient.get('/events');
export const getEvent = (id) => apiClient.get(`/events/${id}`);

export const getCategories = () => apiClient.get('/categories');

export const createEvent = (data) => apiClient.post('/events', data);
export const updateEvent = (id, data) => apiClient.put(`/events/${id}`, data);
export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);
