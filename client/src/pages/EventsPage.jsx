import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/events';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getEvents()
            .then(res => setEvents(res.data))
            .catch(err => { console.error(err); setError('Failed to load events'); })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="page">
            <h1>Events</h1>
            {events.map(event => (
                <div key={event.id} className="event-card">
                    <h2><Link to={`/events/${event.id}`}>{event.title}</Link></h2>
                    <p>{event.location}</p>
                    <p>{new Date(event.startDate).toLocaleDateString()}</p>
                    <p>{event.categoryName}</p>
                </div>
            ))}
        </div>
    );
}
