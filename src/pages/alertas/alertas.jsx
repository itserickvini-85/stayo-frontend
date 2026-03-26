import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import TopBar from '../../components/TopBar/TopBar';
import api from '../../services/api';

function Alertas() {
    const [alertas, setAlertas] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        buscarAlertas();
    }, []);

    const buscarAlertas = async () => {
        setCarregando(true);
        try {
            const response = await api.get('/alertas');
            setAlertas(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar alertas:', error);
        } finally {
            setCarregando(false);
        }
    };

    const resolverAlerta = async (alertaId) => {
        try {
            await api.put(`/alertas/${alertaId}`, {
                status_alerta: 'resolvido'
            });
            buscarAlertas();
        } catch (error) {
            console.error('Erro ao resolver alerta:', error);
        }
    };

    const alertasFiltrados = alertas.filter(alerta => {
        if (filtro === 'todos') return true;
        if (filtro === 'pendentes') return alerta.status_alerta === 'pendente';
        if (filtro === 'resolvidos') return alerta.status_alerta === 'resolvido';
        if (filtro === 'alta') return alerta.prioridade === 'alta';
        return true;
    });

    const getCorPrioridade = (prioridade) => {
        switch(prioridade) {
            case 'alta': return 'bg-red-100 text-red-700 border-red-300';
            case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'baixa': return 'bg-green-100 text-green-700 border-green-300';
            default: return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    const getCorStatus = (status) => {
        switch(status) {
            case 'resolvido': return 'bg-green-50 border-green-200';
            case 'em_andamento': return 'bg-blue-50 border-blue-200';
            case 'pendente': return 'bg-red-50 border-red-200';
            default: return 'bg-slate-50 border-slate-200';
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
                        <h1 className="text-3xl font-bold text-slate-900">Alertas Operacionais</h1>
                        <p className="text-slate-600 mt-1">Gerenciar alertas e necessidades detectadas</p>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                        {/* Filtros */}
                        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setFiltro('todos')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        filtro === 'todos'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Todos ({alertas.length})
                                </button>
                                <button
                                    onClick={() => setFiltro('pendentes')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        filtro === 'pendentes'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Pendentes ({alertas.filter(a => a.status_alerta === 'pendente').length})
                                </button>
                                <button
                                    onClick={() => setFiltro('alta')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        filtro === 'alta'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                                    }`}
                                >
                                    Alta Prioridade ({alertas.filter(a => a.prioridade === 'alta').length})
                                </button>
                                <button
                                    onClick={() => setFiltro('resolvidos')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        filtro === 'resolvidos'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                                    }`}
                                >
                                    Resolvidos ({alertas.filter(a => a.status_alerta === 'resolvido').length})
                                </button>
                            </div>
                        </div>

                        {/* Lista de Alertas */}
                        {carregando ? (
                            <div className="text-center py-12 text-slate-500">
                                Carregando alertas...
                            </div>
                        ) : alertasFiltrados.length === 0 ? (
                            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                                <p className="text-slate-500">Nenhum alerta encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {alertasFiltrados.map(alerta => (
                                    <div
                                        key={alerta.id}
                                        className={`bg-white rounded-lg border-2 p-6 transition ${getCorStatus(alerta.status_alerta)}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Indicador de Prioridade */}
                                            <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                                                alerta.prioridade === 'alta' ? 'bg-red-500' :
                                                alerta.prioridade === 'media' ? 'bg-yellow-500' :
                                                'bg-green-500'
                                            }`}></div>

                                            {/* Conteúdo */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-900">
                                                            {alerta.tipo}
                                                        </h3>
                                                        <p className="text-slate-600 mt-2">
                                                            {alerta.descricao}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCorPrioridade(alerta.prioridade)}`}>
                                                            {alerta.prioridade}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Detalhes */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase">Responsável</p>
                                                        <p className="font-medium text-slate-900">{alerta.area_responsavel}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase">Status</p>
                                                        <p className="font-medium text-slate-900 capitalize">{alerta.status_alerta}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase">Criado em</p>
                                                        <p className="font-medium text-slate-900">
                                                            {alerta.criado_em ? new Date(alerta.criado_em).toLocaleDateString('pt-BR') : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase">ID Alerta</p>
                                                        <p className="font-medium text-slate-900">#{alerta.id}</p>
                                                    </div>
                                                </div>

                                                {/* Ação */}
                                                {alerta.status_alerta !== 'resolvido' && (
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => resolverAlerta(alerta.id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                                                        >
                                                            Marcar como Resolvido
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Alertas;