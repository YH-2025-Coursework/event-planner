import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../api/events';
import { Link } from 'react-router-dom'; 
import { getMyRsvps, createRsvp, deleteRsvp } from '../api/rsvps'; 
import { useAuth } from '../context/AuthContext'; 

export default function EventDetailPage() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
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
    if (!isAuthenticated) return; // skip if not logged in
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
        const res = await createRsvp({ eventId: parseInt(id), status: statusMap[status]});
        setMyRsvp(res.data); // save the new RSVP into state
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
        setMyRsvp(null); // clear RSVP from state
    } catch (err) {
        setRsvpError('Failed to cancel RSVP. Please try again.');
    } finally {
        setRsvpLoading(false);
    }
};



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
            <hr />

            {!isAuthenticated ? (
                <p><Link to="/login">Log in to RSVP</Link></p>

            ) : myRsvp ? (
                <div>
                    <p>Your RSVP: <strong>{statusLabel[myRsvp.status] ?? myRsvp.status}</strong></p>
                    <button onClick={handleCancel} disabled={rsvpLoading}>
                        {rsvpLoading ? 'Cancelling...' : 'Cancel RSVP'}
                    </button>
                </div>

            ) : (
                <div>
                    <p>Will you attend?</p>
                    {['Going', 'Maybe', 'NotGoing'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleRsvp(status)}
                            disabled={rsvpLoading}
                        >
                            {rsvpLoading ? '...' : statusLabel[status]}
                        </button>
                    ))}
                </div>
            )}

            {rsvpError && <p style={{ color: 'red' }}>{rsvpError}</p>}
        </div>
    );
}
