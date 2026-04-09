import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, deleteEvent } from '../api/events';
import { Link } from 'react-router-dom';
import { getMyRsvps, createRsvp, deleteRsvp } from '../api/rsvps';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage() {
    const { id } = useParams();
    const { isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myRsvp, setMyRsvp] = useState(null);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpError, setRsvpError] = useState(null);

    useEffect(() => {
        getEvent(id)
            .then(res => setEvent(res.data))
            .catch(err => { console.error(err); setError('Event not found'); })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!isAuthenticated) return;
        getMyRsvps()
            .then(res => {
                const match = res.data.find(r => r.eventId === parseInt(id));
                setMyRsvp(match || null);
            })
            .catch(err => console.error('Failed to fetch RSVPs', err));
    }, [id, isAuthenticated]);

    const statusMap = { Going: 0, Maybe: 1, NotGoing: 2 };
    const statusLabel = { Going: 'Going', Maybe: 'Maybe', NotGoing: 'Not Going' };

    const handleRsvp = async (status) => {
        setRsvpLoading(true);
        setRsvpError(null);
        try {
            const res = await createRsvp({ eventId: parseInt(id), status: statusMap[status] });
            setMyRsvp(res.data);
        } catch (err) {
            setRsvpError('Failed to RSVP. Please try again.');
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleCancel = async () => {
        setRsvpLoading(true);
        setRsvpError(null);
        try {
            await deleteRsvp(myRsvp.id);
            setMyRsvp(null);
        } catch (err) {
            setRsvpError('Failed to cancel RSVP. Please try again.');
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleAdminDelete = async () => {
        if (!confirm('Delete this event?')) return;
        try {
            await deleteEvent(id);
            navigate('/admin/events');
        } catch {
            setError('Failed to delete event');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="page">
            <button className="back-btn" onClick={() => navigate('/')}>Back</button>
            <h1>{event.title}</h1>

            <div className="event-meta">
                <p><span>Location</span>{event.location}</p>
                <p><span>Date</span>{new Date(event.startDate).toLocaleDateString()}</p>
                <p><span>Category</span>{event.categoryName}</p>
                <p><span>Organizer</span>{event.organizerDisplayName}</p>
            </div>

            <p>{event.description}</p>

            <hr style={{ margin: '20px 0' }} />

            {!isAuthenticated ? (
                <p><Link to="/login">Log in to RSVP</Link></p>

            ) : myRsvp ? (
                <div className="rsvp-section">
                    <p>Your RSVP: <strong>{statusLabel[myRsvp.status] ?? myRsvp.status}</strong></p>
                    <div className="btn-group">
                        <button className="btn btn-outline" onClick={handleCancel} disabled={rsvpLoading}>
                            {rsvpLoading ? 'Cancelling...' : 'Cancel RSVP'}
                        </button>
                    </div>
                </div>

            ) : (
                <div className="rsvp-section">
                    <p>Will you attend?</p>
                    <div className="btn-group">
                        {['Going', 'Maybe', 'NotGoing'].map(status => (
                            <button
                                key={status}
                                className="btn btn-outline"
                                onClick={() => handleRsvp(status)}
                                disabled={rsvpLoading}
                            >
                                {rsvpLoading ? '...' : statusLabel[status]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {rsvpError && <p style={{ color: 'red', marginTop: '8px' }}>{rsvpError}</p>}

            {isAdmin && (
                <div className="admin-controls">
                    <div className="btn-group">
                        <Link className="btn btn-outline" to="/admin/events">Edit in Admin Panel</Link>
                        <button className="btn btn-danger" onClick={handleAdminDelete}>Delete Event</button>
                    </div>
                </div>
            )}
        </div>
    );
}
