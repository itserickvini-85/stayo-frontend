import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '🔔', label: 'Alertas', path: '/alertas' },
        { icon: '📋', label: 'Reservas', path: '/reservas' },
        { icon: '👥', label: 'Hóspedes', path: '/hospedes' },
        { icon: '⚙️', label: 'Configurações', path: '/config' },
        { icon: '📊', label: 'Relatórios', path: '/relatorios' }
    ];

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white min-h-screen transition-all duration-300 flex flex-col`}>
            {/* Header da Sidebar */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                {isOpen && <h2 className="text-lg font-bold">Stay.o</h2>}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-slate-800 rounded transition"
                >
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-blue-600 transition group"
                    >
                        <span className="text-xl">{item.icon}</span>
                        {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer da Sidebar */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-600 transition text-red-400 hover:text-white"
                >
                    <span className="text-xl">🚪</span>
                    {isOpen && <span className="text-sm font-medium">Sair</span>}
                </button>
            </div>
        </div>
    );
}
 
export default Sidebar;