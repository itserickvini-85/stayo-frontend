import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

function MenuCascata() {
    const [menuAberto, setMenuAberto] = useState({
        operacional: false,
        administrativo: false,
        auditor: false,
    });

    const toggleMenu = (secao) => {
        setMenuAberto(prev => ({
            ...prev,
            [secao]: !prev[secao]
        }));
    };

    return (
        <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded transition text-sm font-medium">
                <span>Dashboard</span>
            </button>

            <button onClick={() => toggleMenu('operacional')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded transition text-sm font-medium">
                <span className="flex-1 text-left">Operacional</span>
                <ChevronRight size={18} className={`transition-transform ${menuAberto.operacional ? 'rotate-90' : 'rotate-0'}`} />
            </button>
            {menuAberto.operacional && (
                <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">
                    <a href="/checkins" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Check-ins</a>
                    <a href="/alertas" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Alertas</a>
                    <a href="/sessoes" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Sessões</a>
                </div>
            )}

            <button onClick={() => toggleMenu('administrativo')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded transition text-sm font-medium">
                <span className="flex-1 text-left">Administrativo</span>
                <ChevronRight size={18} className={`transition-transform ${menuAberto.administrativo ? 'rotate-90' : 'rotate-0'}`} />
            </button>
            {menuAberto.administrativo && (
                <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">
                    <a href="/configuracoes" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Configurações</a>
                    <a href="/admin" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Painel Admin</a>
                    <a href="/relatorios" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Relatórios</a>
                </div>
            )}

            <button onClick={() => toggleMenu('auditor')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded transition text-sm font-medium">
                <span className="flex-1 text-left">Auditor Noturno</span>
                <ChevronRight size={18} className={`transition-transform ${menuAberto.auditor ? 'rotate-90' : 'rotate-0'}`} />
            </button>
            {menuAberto.auditor && (
                <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">
                    <a href="/checkouts" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Check-outs Amanhã</a>
                    <a href="/night-audit" className="block px-4 py-2 text-slate-400 hover:text-slate-100 text-sm">Night Audit</a>
                </div>
            )}

            <button onClick={() => toggleMenu('suporte')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded transition text-sm font-medium">
                <span className="flex-1 text-left">Suporte</span>
                <ChevronRight size={18} className={`transition-transform ${menuAberto.suporte ? 'rotate-90' : 'rotate-0'}`} />
            </button>

        </nav>
    );
}

export default MenuCascata;