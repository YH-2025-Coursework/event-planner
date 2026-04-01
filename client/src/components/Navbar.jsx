import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '1rem',
        background: '#f4f4f4',
        marginBottom: '20px'
    };

    return (
        <nav style={navStyle}>
            {!isAuthenticated ? (
                <> 
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : (
                <>
                    <Link to="/">Events</Link>
                    {isAdmin && (
                        <Link to="/admin">Manage Events</Link>
                    )}
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit',
                            color: 'crimson'
                        }}
                    >
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
}