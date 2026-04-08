
import apiClient from './client';

export const getEvents = () => apiClient.get('/events');
export const getEvent = (id) => apiClient.get(`/events/${id}`);