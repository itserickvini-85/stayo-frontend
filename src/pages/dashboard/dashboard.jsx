import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import TopBar from '../../components/TopBar/TopBar';
import api from '../../services/api';


const statusStyles = {
    resolvido: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    em_andamento: 'bg-blue-100 text-blue-700 border-blue-200',
    pendente: 'bg-amber-100 text-amber-700 border-amber-200',
    alta: 'bg-red-100 text-red-700 border-red-200',
    CHECKED_IN: 'bg-purple-100 text-purple-700 border-purple-200 shadow-sm ring-1 ring-purple-700/10',
    EM_CONTATO: 'bg-blue-100 text-blue-700 border-blue-200',
};

   function useCountUp(target, duration = 2500) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);

    return count;
}


function Dashboard() {
    const [hostedesChegando, setHostedesChegando] = useState([]);
    const [checkoutAmanha, setCheckoutAmanha] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [modalAberto, setmodalAberto] = useState(false)
    const [busca, setbusca] = useState('');
    const [filtroHorario, setFiltroHorario] = useState('todos');
    const [filtroModo, setFiltroModo] = useState('todos');


    const hotel = JSON.parse(localStorage.getItem('hotel') || '{}');
    const reservasCount = useCountUp(32);
    const hospedesCount = useCountUp(58);

    // Logica de filtragem dos dados:

    const HospedesFiltrados = hostedesChegando.filter(h=> {
        const matchesBusca = h.hospede_nome.toLowerCase().includes(busca.toLocaleLowerCase()) || h.numero_reserva.includes(busca);
        const matchesModo = filtroModo === 'todos' || h.meio_transporte?.toLocaleLowerCase() === filtroModo;
        return matchesBusca && matchesModo
    });

    // Contadores animados 
  
    useEffect(() => {
        buscarDados();
    }, []);

    const buscarDados = async () => {
        setCarregando(true);
        try {
            const resChegando = await api.get(`/sessoes?hotel_id=${hotel.id}`);
            setHostedesChegando(resChegando.data || []);

            const resCheckout = await api.get(`/sessoes/checkout-amanha/${hotel.id}`);
            setCheckoutAmanha(resCheckout.data || []);

            const resAlertas = await api.get('/alertas');
            setAlertas(resAlertas.data || []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />

                <div className="flex-1 overflow-auto">
                    {/* Header */}
                    <div className="bg-white border-b border-slate-200 p-6">
                        <h1 className="text-3xl font-bold text-slate-900">Bem-vindo ao Stay.o</h1>
                        <p className="text-slate-600 mt-1">{hotel.nome || 'Hotel'}</p>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="p-6 space-y-6">

                        {/* TOP CARDS */}
                        <div className="grid grid-cols-3 gap-4">

                            {/* Card 1: Reservas */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:scale-105 transition-all duration-300 cursor-default">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Reservas Programadas</p>
                                        <p className="text-4xl font-bold text-slate-900 mt-2">{reservasCount}</p>
                                        <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                            <span>↗ 8.70%</span>
                                            <span className="text-slate-400">nas proximas 24hrs</span>
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">📋</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Hóspedes */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:scale-105 transition-all duration-300 cursor-default">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hóspedes no Hotel</p>
                                        <p className="text-4xl font-bold text-slate-900 mt-2">{hospedesCount}</p> 
                                        <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                            <span>↗ 8.70%</span>
                                            <span className="text-slate-400">Hospedados agora</span>
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">👥</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Stela */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:scale-105 transition-all duration-300 cursor-default">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fale com a Stela</p>
                                        <p className="text-sm text-slate-700 mt-2">Suporte 24h via WhatsApp</p>
                                        <button className="mt-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition">
                                            Iniciar Chat
                                        </button>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">💬</span>
                                    </div>
                                </div>
                            </div>

                        </div>{/* Fim TOP CARDS */}

                        {/* SEÇÃO KANBAN: FLUXO DE CHECK-IN */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* COLUNA 1: PREVISTOS (Aguardando) */}
    <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                CHECK INS - HOJE ({hostedesChegando.length})
            </h2>
        </div>

        <div className="space-y-3">
            {hostedesChegando.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-lg border border-dashed border-slate-300">
                    Nenhum previsto
                </div>
            ) : (
                hostedesChegando.map((hospede) => (
                    <div key={hospede.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                hospede.meio_transporte?.toLowerCase() === 'aviao' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {hospede.meio_transporte || 'Indefinido'}
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">#{hospede.numero_reserva}</p>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-sm">{hospede.hospede_nome}</h3>
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex -space-x-1">
                                {/* Badge de IA ou Status rápido */}
                                <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">
                                    🕒 Check-in 18h
                                </span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-[10px] font-bold">
                                ACESSAR →
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>

    {/* COLUNA 2: EM ATENDIMENTO / TRANSTRITO */}
    <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Em Atendimento pela Stela 🤖
            </h2>
        </div>
        
        {/* Espaço para cards que a recepção "puxaria" ou que a Stela sinalizou que estão chegando */}
        <div className="border-2 border-dashed border-blue-200 rounded-xl h-24 flex items-center justify-center text-center p-4">
            <p className="text-[10px] text-blue-400 font-medium">Hospedes que estão com conversas em andamento pelo Concierge Stela</p>
        </div>
    </div>

    {/* COLUNA 3: FINALIZADOS HOJE */}
    <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Hospedes in house
            </h2>
        </div>
        
        {/* Aqui você filtraria hóspedes que o status no banco já mudou para CHECKED_IN */}
        <div className="bg-white/60 p-3 rounded-lg border border-emerald-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</div>
             <div>
                <p className="text-xs font-bold text-slate-700 underline italic">Exemplo: Maria Silva</p>
                <p className="text-[10px] text-slate-500">Quarto 204</p>
             </div>
        </div>
    </div>

</div>

                        {/* SEÇÃO: ALERTAS OPERACIONAIS */}
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Alertas Operacionais</h2>
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {alertas.length} pendentes
                                </span>
                            </div>
                            <div className="divide-y divide-slate-200">
                                {alertas.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500 italic">
                                        Nenhum alerta no momento. A Stela está monitorando...
                                    </div>
                                ) : (
                                    alertas.slice(0, 5).map((alerta) => (
                                        <div key={alerta.id} className="p-6 hover:bg-slate-50/80 transition-all border-l-4 border-transparent hover:border-blue-500">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-3 h-2 rounded-full mt-2.5 flex-shrink-0 ${
                                                    String(alerta.prioridade).toLowerCase() === 'alta'
                                                        ? 'bg-red-500 animate-pulse'
                                                        : alerta.prioridade === 'media' ? 'bg-yellow-500' : 'bg-emerald-500'
                                                }`}></div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-slate-900">{alerta.tipo}</h3>
                                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1 font-bold">
                                                            ✨ STELA
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{alerta.descricao}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                                                    statusStyles[alerta.status_alerta] || 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                    {alerta.status_alerta.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {alertas.length > 5 && (
                                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
                                    <a href="/alertas" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                        Ver todos ({alertas.length})
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* SEÇÃO: CHECK-OUTS AMANHÃ */}
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Check-outs Amanhã</h2>
                                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {checkoutAmanha.length} saídas
                                </span>
                            </div>
                            <div className="divide-y divide-slate-200">
                                {checkoutAmanha.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500">
                                        Nenhum check-out agendado para amanhã
                                    </div>
                                ) : (
                                    checkoutAmanha.slice(0, 5).map((checkout) => (
                                        <div key={checkout.id} className="p-6 hover:bg-slate-50 transition">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900">{checkout.hospede_nome}</h3>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        Quarto: {checkout.quarto_numero || 'N/A'} | Reserva: {checkout.numero_reserva}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                                        {new Date(checkout.checkout_data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {checkoutAmanha.length > 5 && (
                                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
                                    <a href="/checkouts" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                        Ver todos ({checkoutAmanha.length})
                                    </a>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}



export default Dashboard;