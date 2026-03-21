import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TopBar() {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    // Pega dados do hotel do localStorage
    const hotel = JSON.parse(localStorage.getItem('hotel') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('hotel');
        navigate('/login');
    };

    return (
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
            {/* Lado esquerdo - Info */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
                    <p className="text-xs text-slate-500">{hotel.nome || 'Hotel'}</p>
                </div>
            </div>

            {/* Lado direito - Ações */}
            <div className="flex items-center gap-6">
                {/* Notificações */}
                <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Ajuda */}
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <span className="text-xl">❓</span>
                </button>

                {/* Perfil - Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            👤
                        </div>
                        <span className="text-sm font-medium text-slate-700">Admin</span>
                        <span className="text-slate-500">▼</span>
                    </button>

                    {/* Menu Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                            <div className="p-4 border-b border-slate-200">
                                <p className="text-sm font-medium text-slate-800">Admin</p>
                                <p className="text-xs text-slate-500">admin@hotelstayo.com</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                                ⚙️ Meu Perfil
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                                🔧 Configurações
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 border-t border-slate-200"
                            >
                                🚪 Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 

export default TopBar;