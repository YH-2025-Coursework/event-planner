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

    return (
        <nav style={{
            background: '#f4f4f4',
            marginBottom: '20px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'stretch',
                height: '48px',
                maxWidth: '720px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                {!isAuthenticated ? (
                    <>
                        <Link className="nav-link" to="/">Events</Link>
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/">Events</Link>
                        {isAdmin && (
                            <Link className="nav-link" to="/admin/events">Manage Events</Link>
                        )}
                        <button className="nav-link" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
