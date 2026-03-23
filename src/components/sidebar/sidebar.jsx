import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuCascata from "../menu/MenuCascata";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    return ( 
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white min-h-screen transition-all duration-300 flex flex-col`}>
            {/* Header da Sidebar */}
          
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    {isOpen && <img src="/logo_stayo_1.svg" alt="Stay.o" className="h-10 w-auto" />}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 hover:bg-slate-800 rounded transition"
                    >
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>

            {/* Menu Items - Menu Cascata */}
            <nav className="flex-1 p-4">
                {isOpen ? (
                    <MenuCascata />
                ) : (
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-center p-3 hover:bg-slate-800 rounded transition text-slate-300">📊</button>
                        <button className="w-full flex items-center justify-center p-3 hover:bg-slate-800 rounded transition text-slate-300">📋</button>
                        <button className="w-full flex items-center justify-center p-3 hover:bg-slate-800 rounded transition text-slate-300">⚙️</button>
                        <button className="w-full flex items-center justify-center p-3 hover:bg-slate-800 rounded transition text-slate-300">🌙</button>
                        <button className="w-full flex items-center justify-center p-3 hover:bg-slate-800 rounded transition text-slate-300">📞</button>
                    </div>
                )}
            </nav>

            {/* Footer da Sidebar */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('hotel');
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