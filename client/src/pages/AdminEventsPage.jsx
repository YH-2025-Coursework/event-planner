import { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/events';
import EventForm from '../components/EventForm';

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            const res = await getEvents();
            setEvents(res.data);
        } catch {
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreate = async (data) => {
        setFormLoading(true);
        setError(null);
        try {
            await createEvent(data);
            setShowCreate(false);
            fetchEvents();
        } catch {
            setError('Failed to create event');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        setFormLoading(true);
        setError(null);
        try {
            await updateEvent(editingEvent.id, data);
            setEditingEvent(null);
            fetchEvents();
        } catch {
            setError('Failed to update event');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this event?')) return;
        setDeletingId(id);
        try {
            await deleteEvent(id);
            setEvents(events.filter(e => e.id !== id));
        } catch {
            setError('Failed to delete event');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="page">
            <h1>Admin — Events</h1>

            {loading && <p>Loading events...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={() => { setShowCreate(true); setEditingEvent(null); }}>
                + Create Event
            </button>

            {showCreate && (
                <>
                    <EventForm key="new" onSubmit={handleCreate} loading={formLoading} />
                    <button onClick={() => setShowCreate(false)}>Cancel</button>
                </>
            )}

            {editingEvent && (
                <>
                    <EventForm key={editingEvent.id} initial={editingEvent} onSubmit={handleUpdate} loading={formLoading} />
                    <button onClick={() => setEditingEvent(null)}>Cancel</button>
                </>
            )}

            {events.map(event => (
                <div key={event.id} className="event-card">
                    <h2>{event.title}</h2>
                    <p>{event.location}</p>
                    <button onClick={() => { setEditingEvent(event); setShowCreate(false); }}>Edit</button>
                    <button onClick={() => handleDelete(event.id)} disabled={deletingId === event.id}>
                        {deletingId === event.id ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            ))}
        </div>
    );
}
