import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRoute from './components/AdminRoute'; // importing the AdminRoute component to use for routes that require admin access

// importing the ProtectedRoute component to use for routes that require authentication
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <Navbar /> {/* it is placed here so it stays at the top */}
            


            <Routes>
                <Route path="/" element={<EventsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/events/:id" element={<EventDetailPage />} />

                <Route element={<AdminRoute />}>
                 {/* Use a simple <div> instead of AdminPage until the page is created */}
                   <Route path="/admin" element={<div>Admin Dashboard Area</div>} />
                </Route>
            

            </Routes>
        </>
    );
}

export default App;