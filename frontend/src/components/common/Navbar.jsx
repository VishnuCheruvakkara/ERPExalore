import { useEffect, useState } from 'react';
import { FiLogOut, FiClock } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Navbar() {
    const [time, setTime] = useState(new Date());
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        navigate('/login');
        toast.success("Logout successful")

    };

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className="w-full h-14 bg-indigo-1000 border-b border-indigo-1050 flex items-center justify-end px-4 text-white">
            {/* RIGHT SIDE ONLY */}
            <div className="flex items-center gap-6">
                {/* TIME */}
                <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <FiClock className="text-indigo-400  text-sm" />
                    <span>{formattedTime}</span>
                </div>

                {/* USER */}
                <div className="flex items-center gap-2 text-slate-200 text-sm">
                    <HiOutlineUserCircle className="text-lg text-indigo-400" />
                    <span>admin</span>
                </div>

                {/* LOGOUT */}
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-800 hover:bg-indigo-900 text-white text-sm transition cursor-pointer">
                    <FiLogOut />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;
