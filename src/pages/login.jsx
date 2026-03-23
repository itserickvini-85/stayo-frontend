import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');

        try {
            const resposta = await api.post('/auth/login', { email, senha });
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('hotel', JSON.stringify(resposta.data.hotel));
            navigate('/dashboard');            
        } catch (err) {
            setErro('Email ou senha inválidos');
        } finally {
            setCarregando(false); 
        }
    };

    return (
        <div className="min-h-screen flex" style={{
            background: 'linear-gradient(135deg, #1a3a52 0%, #1e4d7b 50%, #2563eb 100%)'
        }}>
            {/* LADO ESQUERDO - Com logo e texto */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 relative overflow-hidden">
                
                {/* Formas geométricas de fundo (leves) */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300 rounded-full opacity-5 blur-3xl"></div>
                
                {/* Conteúdo */}
                <div className="relative z-10 text-center mx-auto max-w-md">
                    {/* Logo */}
                    <div className="mb-1 flex justify-center animate-fadeIn">
                        <img 
                            src="/logo_stayo_1.svg" 
                            alt="Stay.io Logo" 
                            className="h-60 w-auto"
                        />
                    </div>
                    
                    {/* Texto */}
                    <h2 className="text-5xl font-bold text-white mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        Bem-vindo
                    </h2>
                    <p className="text-blue-100 text-lg mb-6 max-w-sm animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        Guest Experience Platform
                    </p>
                    <p className="text-blue-200 text-sm max-w-sm leading-relaxed animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                        Gerenciamento inteligente de check-in, comunicação e atendimento ao hóspede em tempo real
                    </p>
                </div>
            </div>

            {/* LINHA DIVISÓRIA VERTICAL - Branca */}
            <div className="hidden md:block w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-40"></div>

            {/* LADO DIREITO - Formulário com fundo gradiente */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 min-h-screen">
                <div className="w-full max-w-md">
                    {/* Logo mobile (visível apenas em mobile) */}
                    <div className="md:hidden mb-8 flex justify-center animate-fadeIn">
                        <img 
                            src="/logo_stayo_1.svg" 
                            alt="Stay.io Logo" 
                            className="h-24 w-auto"
                        />
                    </div>

                    <div className="md:hidden mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
                        <p className="text-blue-100 text-sm mt-2">Acesse seu painel de controle</p>
                    </div>

                    {/* Card do Formulário */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        {/* Formulário */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="exemplo@exemplo.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Senha
                                </label>
                                <input 
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {erro && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fadeIn">
                                    {erro}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-600">Lembrar-me</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={carregando}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {carregando ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        {/* Informações sobre o sistema */}
                        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                            <p className="text-xs text-slate-500 mb-2">Stay.io v1.0.0</p>
                            <p className="text-xs text-slate-400 mb-3">© 2026 - Todos os direitos reservados</p>
                            <div className="flex justify-center gap-4">
                                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Política de Privacidade
                                </a>
                                <span className="text-slate-300">•</span>
                                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Termos de Uso
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos de animação */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default Login;