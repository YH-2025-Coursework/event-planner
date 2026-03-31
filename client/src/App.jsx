import { useAuth } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
    const { isAuthenticated, role } = useAuth();
    return (
        <>
            <Navbar /> {/* it is placed here so it stays at the top */}
            


            <Routes>
                <Route path="/" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </>
    );
}

export default App;