import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import TopBar from '../../components/topbar/topbar';
import api from '../../services/api';

function Dashboard() {
    const [abaAtiva, setAbaAtiva] = useState('aguardando');
    const [hostedesChegando, setHostedesChegando] = useState([]);
    const [checkoutAmanha, setCheckoutAmanha] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const hotel = JSON.parse(localStorage.getItem('hotel') || '{}');

    // Puxar dados da API
    useEffect(() => {
        buscarDados();
    }, []);

    const buscarDados = async () => {
        setCarregando(true);
        try {
            // Buscar hóspedes chegando hoje
            const resChegando = await api.get(`/sessoes?hotel_id=${hotel.id}`);
            setHostedesChegando(resChegando.data || []);

            // Buscar check-outs de amanhã
            const resCheckout = await api.get(`/sessoes/checkout-amanha/${hotel.id}`);
            setCheckoutAmanha(resCheckout.data || []);

            // Buscar alertas
            const resAlertas = await api.get('/alertas');
            setAlertas(resAlertas.data || []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col">
                {/* TopBar */}
                <TopBar />

                {/* Conteúdo */}
                <div className="flex-1 overflow-auto">
                    {/* Cabeçalho */}
                    <div className="p-6 bg-white border-b border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                        <p className="text-sm text-slate-500 mt-1">{hotel.nome || 'Hotel'}</p>
                    </div>

                    {/* Abas */}
                    <div className="bg-white border-b border-slate-200">
                        <div className="px-6 flex gap-8">
                            <button
                                onClick={() => setAbaAtiva('aguardando')}
                                className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
                                    abaAtiva === 'aguardando'
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-slate-600 border-transparent hover:text-slate-800'
                                }`}
                            >
                                Aguardando Chegada ({hostedesChegando.length})
                            </button>

                            <button
                                onClick={() => setAbaAtiva('checkout')}
                                className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
                                    abaAtiva === 'checkout'
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-slate-600 border-transparent hover:text-slate-800'
                                }`}
                            >
                                Check-outs Amanhã ({checkoutAmanha.length})
                            </button>

                            <button
                                onClick={() => setAbaAtiva('alertas')}
                                className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
                                    abaAtiva === 'alertas'
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-slate-600 border-transparent hover:text-slate-800'
                                }`}
                            >
                                Alertas Operacionais ({alertas.length})
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo das Abas */}
                    <div className="p-6">
                        {/* ABA 1: AGUARDANDO CHEGADA */}
                        {abaAtiva === 'aguardando' && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Hóspedes Chegando Hoje
                                </h2>

                                {hostedesChegando.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-slate-500">Nenhum hóspede chegando hoje</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {hostedesChegando.map((hospede) => (
                                            <div
                                                key={hospede.id}
                                                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-800">
                                                            {hospede.hospede_nome}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            Reserva: {hospede.numero_reserva}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Telefone: {hospede.hospede_telefone}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Status: {hospede.status_sessao}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                            {hospede.meio_transporte || 'Indefinido'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ABA 2: CHECK-OUTS AMANHÃ */}
                        {abaAtiva === 'checkout' && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Check-outs de Amanhã
                                </h2>

                                {checkoutAmanha.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-slate-500">Nenhum check-out agendado para amanhã</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {checkoutAmanha.map((checkout) => (
                                            <div
                                                key={checkout.id}
                                                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-800">
                                                            {checkout.hospede_nome}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            Quarto: {checkout.quarto_numero || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Reserva: {checkout.numero_reserva}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Horário: {new Date(checkout.checkout_data).toLocaleTimeString('pt-BR')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                                            {checkout.status_sessao}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ABA 3: ALERTAS OPERACIONAIS */}
                        {abaAtiva === 'alertas' && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Alertas Operacionais
                                </h2>

                                {alertas.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-slate-500">Nenhum alerta no momento</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {alertas.map((alerta) => (
                                            <div
                                                key={alerta.id}
                                                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                                            alerta.prioridade === 'alta'
                                                                ? 'bg-red-500'
                                                                : alerta.prioridade === 'media'
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        }`}
                                                    ></div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-800">
                                                            {alerta.tipo}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {alerta.descricao}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            Responsável: {alerta.area_responsavel}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                                                            alerta.status_alerta === 'resolvido'
                                                                ? 'bg-green-100 text-green-700'
                                                                : alerta.status_alerta === 'em_andamento'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {alerta.status_alerta}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;