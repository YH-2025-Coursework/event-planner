import { Link } from 'react-router-dom';

export default function Navbar() {
    const navStyle = {
        display: 'flex',
        gap: '20px',
        padding: '1rem',
        background: '#f4f4f4',
        marginBottom: '20px'
    };

    return (
        <nav style={navStyle}>
            <Link to="/">Events</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            {/* We won't link to Event Details here because that usually needs an ID :) */}
        </nav>
    );
}