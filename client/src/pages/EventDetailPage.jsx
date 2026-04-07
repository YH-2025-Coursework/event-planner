import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../api/events';

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getEvent(id)
            .then(res => setEvent(res.data))
            .catch(() => setError('Event not found'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="page">
            <button className="back-btn" onClick={() => navigate('/')}>Back</button>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <p>{event.location}</p>
            <p>{new Date(event.startDate).toLocaleDateString()}</p>
            <p>{event.categoryName}</p>
            <p>Organizer: {event.organizerDisplayName}</p>
        </div>
    );
}
