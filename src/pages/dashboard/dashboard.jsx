import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import TopBar from '../../components/TopBar/TopBar';
import api from '../../services/api';

function Dashboard() {
    const [hostedesChegando, setHostedesChegando] = useState([]);
    const [checkoutAmanha, setCheckoutAmanha] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const hotel = JSON.parse(localStorage.getItem('hotel') || '{}');

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
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Reservas Programadas</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">32</p>
                                        <p className="text-xs text-slate-500 mt-2">Total do mês</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">📋</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Hóspedes */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Hóspedes no Hotel</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">58</p>
                                        <p className="text-xs text-slate-500 mt-2">Hospedados agora</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">👥</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Stela */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Fale com a Stela</p>
                                        <p className="text-sm text-slate-700 mt-2">Suporte 24h via WhatsApp</p>
                                        <button className="mt-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition">
                                            Iniciar Chat
                                        </button>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">💬</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO: CHECK-IN HOJE */}
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Check-in Hoje</h2>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {hostedesChegando.length} chegadas
                                </span>
                            </div>

                            <div className="divide-y divide-slate-200">
                                {hostedesChegando.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500">
                                        Nenhum hóspede chegando hoje
                                    </div>
                                ) : (
                                    hostedesChegando.slice(0, 5).map((hospede) => (
                                        <div key={hospede.id} className="p-6 hover:bg-slate-50 transition">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900">{hospede.hospede_nome}</h3>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        Reserva: {hospede.numero_reserva}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                                        {hospede.meio_transporte || 'Indefinido'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {hostedesChegando.length > 5 && (
                                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
                                    <a href="/checkins" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                        Ver todos ({hostedesChegando.length})
                                    </a>
                                </div>
                            )}
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
                                    <div className="p-6 text-center text-slate-500">
                                        Nenhum alerta no momento
                                    </div>
                                ) : (
                                    alertas.slice(0, 5).map((alerta) => (
                                        <div key={alerta.id} className="p-6 hover:bg-slate-50 transition">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                                                    alerta.prioridade === 'alta' ? 'bg-red-500' :
                                                    alerta.prioridade === 'media' ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}></div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900">{alerta.tipo}</h3>
                                                    <p className="text-sm text-slate-600 mt-1">{alerta.descricao}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded text-xs font-medium flex-shrink-0 ${
                                                    alerta.status_alerta === 'resolvido' ? 'bg-green-100 text-green-700' :
                                                    alerta.status_alerta === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {alerta.status_alerta}
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