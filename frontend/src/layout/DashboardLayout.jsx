import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import toast from 'react-hot-toast';

function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        navigate('/login');
        toast.success('Logout successful');
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Right Side Content Wrapper */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Extracted Top Navbar */}
                <Navbar handleLogout={handleLogout} />

                {/* Main Routed App View */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
