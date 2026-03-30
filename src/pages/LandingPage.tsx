import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

export function LandingPage() {
  return (
    <>
      <style>{`
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-label { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .ai-pulse {
          position: relative;
        }
        .ai-pulse::after {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%);
          z-index: -1;
        }
        .cta-glow-bg {
          background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(19, 19, 19, 0) 70%), #1c1a0e;
        }
      `}</style>
      <div className="bg-[#131313] text-[#e5e2e1] font-body antialiased selection:bg-[#fbbf24] selection:text-[#402d00]">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl">
          <div className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fbbf24] text-2xl md:text-3xl">content_cut</span>
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-[#FBBF24] font-headline uppercase">agendai</span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <a className="text-[#FBBF24] font-bold border-b-2 border-[#FBBF24] pb-1 font-headline" href="#">Início</a>
              <a className="text-[#E5E2E1] hover:text-[#FBBF24] transition-colors duration-300 font-headline" href="#recursos">Recursos</a>
              <a className="text-[#E5E2E1] hover:text-[#FBBF24] transition-colors duration-300 font-headline" href="#como-funciona">Como Funciona</a>
              <a className="text-[#E5E2E1] hover:text-[#FBBF24] transition-colors duration-300 font-headline" href="#precos">Preços</a>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Link to={ROUTES.LOGIN} className="text-[#E5E2E1] hover:text-[#fbbf24] border border-[#fbbf24]/20 hover:border-[#fbbf24] px-4 md:px-5 py-2 rounded-full transition-all font-headline font-bold text-sm md:text-base">Entrar</Link>
              <Link to={ROUTES.REGISTER} className="bg-[#fbbf24] text-[#402d00] px-4 md:px-6 py-2 rounded-full font-headline font-bold text-sm md:text-base hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all active:scale-95">Criar Conta</Link>
            </div>
          </div>
          <div className="bg-gradient-to-b from-[#1C1B1B] to-transparent h-px w-full opacity-20"></div>
        </nav>

        <main className="pt-24">
          {/* Hero Section */}
          <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden px-6">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fbbf24]/10 rounded-full blur-[120px]"></div>
            </div>
            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#353534] text-[#fbbf24] text-xs font-bold tracking-[0.2em] mb-8 font-headline uppercase">A Revolução Digital da Barbearia</span>
              <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tighter mb-8 leading-[0.9] text-[#e5e2e1]">
                SUA BARBEARIA NO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe1a7] to-[#fbbf24]">PRÓXIMO NÍVEL</span>
              </h1>
              <p className="text-lg md:text-xl text-[#d3c5ac] max-w-2xl mx-auto mb-12 leading-relaxed font-body">
                Automatize seus agendamentos com inteligência artificial. Reduza faltas em 40% e foque no que você faz de melhor: a arte de transformar visuais.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to={ROUTES.REGISTER} className="w-full sm:w-auto bg-[#fbbf24] text-[#402d00] px-10 py-4 rounded-full font-headline font-bold text-lg hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all text-center">Começar Grátis</Link>
                <Link to="/book/barbearia-demo" className="w-full sm:w-auto border border-[#4f4633]/30 text-[#e5e2e1] px-10 py-4 rounded-full font-headline font-bold text-lg hover:bg-[#1c1b1b] transition-all flex items-center justify-center gap-2">
                  Demonstração
                </Link>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-[#0e0e0e]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-[#fbbf24] text-4xl">check_circle</span>
                  <div className="text-4xl font-headline font-bold text-[#e5e2e1]">Pronto para Uso</div>
                  <div className="text-[#d3c5ac] uppercase tracking-widest text-xs">Acesse e configure agora</div>
                </div>
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-[#fbbf24] text-4xl">speed</span>
                  <div className="text-4xl font-headline font-bold text-[#e5e2e1]">Alta Velocidade</div>
                  <div className="text-[#d3c5ac] uppercase tracking-widest text-xs">Agendamentos em segundos</div>
                </div>
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-[#fbbf24] text-4xl">security</span>
                  <div className="text-4xl font-headline font-bold text-[#e5e2e1]">100% Seguro</div>
                  <div className="text-[#d3c5ac] uppercase tracking-widest text-xs">Seus dados protegidos</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Bento Grid */}
          <section className="py-32 px-6" id="recursos">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4 uppercase">POR QUE ESCOLHER O <span className="text-[#fbbf24]">AGENDAAI</span></h2>
                <p className="text-[#d3c5ac] text-lg font-body">Tudo que sua barbearia precisa para crescer e se profissionalizar</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-xl p-8 hover:border-[#fbbf24]/30 transition-colors group">
                  <div className="w-10 h-10 border border-[#fbbf24]/50 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#fbbf24] text-2xl">calendar_today</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-4 uppercase">AGENDAMENTO ONLINE</h3>
                  <p className="text-[#d3c5ac] text-sm leading-relaxed">Seus clientes agendam 24/7 pelo link exclusivo da sua barbearia.</p>
                </div>
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-xl p-8 hover:border-[#fbbf24]/30 transition-colors group">
                  <div className="w-10 h-10 border border-[#fbbf24]/50 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#fbbf24] text-2xl">bar_chart</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-4 uppercase">DASHBOARD COMPLETO</h3>
                  <p className="text-[#d3c5ac] text-sm leading-relaxed">Acompanhe agendamentos, faturamento e desempenho em tempo real.</p>
                </div>
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-xl p-8 hover:border-[#fbbf24]/30 transition-colors group">
                  <div className="w-10 h-10 border border-[#fbbf24]/50 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#fbbf24] text-2xl">group</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-4 uppercase">GESTÃO DE EQUIPE</h3>
                  <p className="text-[#d3c5ac] text-sm leading-relaxed">Cada barbeiro com seu próprio painel e link de agendamento.</p>
                </div>
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-xl p-8 hover:border-[#fbbf24]/30 transition-colors group">
                  <div className="w-10 h-10 border border-[#fbbf24]/50 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#fbbf24] text-2xl">smartphone</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-4 uppercase">100% RESPONSIVO</h3>
                  <p className="text-[#d3c5ac] text-sm leading-relaxed">Funciona perfeitamente em qualquer dispositivo, celular ou desktop.</p>
                </div>
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-xl p-8 hover:border-[#fbbf24]/30 transition-colors group">
                  <div className="w-10 h-10 border border-[#fbbf24]/50 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#fbbf24] text-2xl">notifications</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-4 uppercase">NOTIFICAÇÕES</h3>
                  <p className="text-[#d3c5ac] text-sm leading-relaxed">Lembretes automáticos para você e seus clientes nunca perderem um horário.</p>
                </div>
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-xl p-8 hover:border-[#fbbf24]/30 transition-colors group">
                  <div className="w-10 h-10 border border-[#fbbf24]/50 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#fbbf24] text-2xl">shield</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-4 uppercase">SEGURO & CONFIÁVEL</h3>
                  <p className="text-[#d3c5ac] text-sm leading-relaxed">Seus dados protegidos com a mais alta tecnologia de segurança.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-32 bg-[#131313]" id="como-funciona">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-6 uppercase">
                  <span className="text-[#e5e2e1]">COMO</span> <span className="text-[#fbbf24]">FUNCIONA</span>
                </h2>
                <p className="text-[#d3c5ac] text-lg max-w-2xl mx-auto font-body">Em apenas 4 passos simples, sua barbearia estará pronta para receber agendamentos online</p>
              </div>
              <div className="relative font-body">
                <div className="absolute top-16 left-0 w-full h-px bg-[#fbbf24]/30 hidden md:block z-0"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 bg-[#2a2a2a] rounded-3xl flex items-center justify-center mb-8 border border-[#4f4633]/10 relative">
                      <span className="material-symbols-outlined text-[#fbbf24] text-4xl">person_add</span>
                    </div>
                    <div className="bg-[#1c1b1b] px-4 py-1 rounded-full mb-6 border border-[#4f4633]/10">
                      <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-widest">Passo 01</span>
                    </div>
                    <h4 className="text-[#e5e2e1] font-headline font-bold mb-3 uppercase tracking-tight">Crie sua Conta</h4>
                    <p className="text-[#d3c5ac] text-sm leading-relaxed px-4">Cadastre-se gratuitamente em menos de 2 minutos.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 bg-[#2a2a2a] rounded-3xl flex items-center justify-center mb-8 border border-[#4f4633]/10 relative">
                      <span className="material-symbols-outlined text-[#fbbf24] text-4xl">settings</span>
                    </div>
                    <div className="bg-[#1c1b1b] px-4 py-1 rounded-full mb-6 border border-[#4f4633]/10">
                      <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-widest">Passo 02</span>
                    </div>
                    <h4 className="text-[#e5e2e1] font-headline font-bold mb-3 uppercase tracking-tight">Configure sua Barbearia</h4>
                    <p className="text-[#d3c5ac] text-sm leading-relaxed px-4">Adicione serviços, barbeiros e horários de funcionamento.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 bg-[#2a2a2a] rounded-3xl flex items-center justify-center mb-8 border border-[#4f4633]/10 relative">
                      <span className="material-symbols-outlined text-[#fbbf24] text-4xl">link</span>
                    </div>
                    <div className="bg-[#1c1b1b] px-4 py-1 rounded-full mb-6 border border-[#4f4633]/10">
                      <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-widest">Passo 03</span>
                    </div>
                    <h4 className="text-[#e5e2e1] font-headline font-bold mb-3 uppercase tracking-tight">Compartilhe o Link</h4>
                    <p className="text-[#d3c5ac] text-sm leading-relaxed px-4">Divulgue o link de agendamento para seus clientes.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 bg-[#2a2a2a] rounded-3xl flex items-center justify-center mb-8 border border-[#4f4633]/10 relative">
                      <span className="material-symbols-outlined text-[#fbbf24] text-4xl">sentiment_satisfied</span>
                    </div>
                    <div className="bg-[#1c1b1b] px-4 py-1 rounded-full mb-6 border border-[#4f4633]/10">
                      <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-widest">Passo 04</span>
                    </div>
                    <h4 className="text-[#e5e2e1] font-headline font-bold mb-3 uppercase tracking-tight">Receba Agendamentos</h4>
                    <p className="text-[#d3c5ac] text-sm leading-relaxed px-4">Clientes agendam online e você gerencia tudo pelo painel.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Plans & Pricing Section */}
          <section className="py-32 bg-[#0E0E0E]" id="precos">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20 font-headline">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
                  <span className="text-[#e5e2e1]">PLANOS &</span> <span className="text-[#fbbf24]">PREÇOS</span>
                </h2>
                <p className="text-[#d3c5ac] text-lg font-body">Escolha o plano ideal para o tamanho da sua barbearia</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch font-body text-sm">
                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-2xl p-10 flex flex-col text-center">
                  <h3 className="text-[#e5e2e1] font-headline font-bold text-2xl mb-2 uppercase">GRÁTIS</h3>
                  <p className="text-[#d3c5ac] text-sm mb-8 italic">Perfeito para começar</p>
                  <div className="mb-10">
                    <span className="text-[#e5e2e1] font-headline font-bold text-4xl">R$ 0</span>
                    <span className="text-[#d3c5ac] text-sm">/mês</span>
                  </div>
                   <ul className="space-y-4 mb-12 text-left">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#fbbf24] text-lg">check</span>
                      <span className="text-[#e5e2e1]">1 serviço cadastrado</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#fbbf24] text-lg">check</span>
                      <span className="text-[#e5e2e1]">Até 2 clientes cadastrados</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#fbbf24] text-lg">check</span>
                      <span className="text-[#e5e2e1]">Até 2 agendamentos por mês</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#fbbf24] text-lg">check</span>
                      <span className="text-[#e5e2e1]">Link de agendamento automático</span>
                    </li>
                  </ul>
                  <Link to={ROUTES.REGISTER} className="mt-auto w-full border border-[#4f4633]/30 text-[#e5e2e1] py-4 rounded-xl font-headline font-bold hover:bg-[#1c1b1b] transition-all text-center">Começar Grátis</Link>
                </div>

                <div className="bg-[#1C1B1B] border-2 border-[#fbbf24] rounded-2xl p-10 flex flex-col text-center relative shadow-[0_0_40px_rgba(251,191,36,0.1)]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fbbf24] text-[#402d00] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    Mais Popular
                  </div>
                  <h3 className="text-[#e5e2e1] font-headline font-bold text-2xl mb-2 uppercase">PRO MENSAL</h3>
                  <p className="text-[#d3c5ac] text-sm mb-8 italic">Para barbearias profissionais</p>
                  <div className="mb-10">
                    <span className="text-[#e5e2e1] font-headline font-bold text-4xl">R$ 37,99</span>
                    <span className="text-[#d3c5ac] text-sm">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-12 text-left">
                    <li className="flex items-center gap-3 text-[#e5e2e1]"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Serviços ilimitados</li>
                    <li className="flex items-center gap-3 text-[#e5e2e1]"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Clientes ilimitados</li>
                    <li className="flex items-center gap-3 text-[#e5e2e1]"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Agendamentos ilimitados</li>
                    <li className="flex items-center gap-3 text-[#e5e2e1]"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Link personalizado</li>
                    <li className="flex items-center gap-3 text-[#e5e2e1]"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Dashboard completo</li>
                  </ul>
                  <Link to={ROUTES.REGISTER} className="mt-auto w-full bg-[#fbbf24] text-[#402d00] py-4 rounded-xl font-headline font-bold hover:shadow-[0_0_30_rgba(251,191,36,0.3)] transition-all text-center uppercase">Assinar Agora</Link>
                </div>

                <div className="bg-[#1C1B1B] border border-[#4f4633]/10 rounded-2xl p-10 flex flex-col text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fbbf24] text-[#402d00] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">star</span>
                    Melhor Valor
                  </div>
                  <h3 className="text-[#e5e2e1] font-headline font-bold text-2xl mb-2 uppercase">PRO SEMESTRAL</h3>
                  <p className="text-[#d3c5ac] text-sm mb-8 italic">Pague 6 meses e economize</p>
                  <div className="mb-10">
                    <span className="text-[#e5e2e1] font-headline font-bold text-4xl">R$ 205,00</span>
                    <p className="text-[#fbbf24] text-[10px] font-black uppercase mt-1">~R$ 34,16/mês</p>
                  </div>
                  <ul className="space-y-4 mb-12 text-left text-[#e5e2e1]">
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Tudo do Plano Mensal</li>
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Economia de 10%</li>
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Prioridade em Suporte</li>
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fbbf24]">check</span> Consultoria de Gestão</li>
                  </ul>
                  <Link to={ROUTES.REGISTER} className="mt-auto w-full border border-[#fbbf24]/30 text-[#e5e2e1] py-4 rounded-xl font-headline font-bold hover:bg-[#fbbf24] hover:text-[#402d00] transition-all text-center uppercase">Assinar Semestral</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-24 px-6 cta-glow-bg">
            <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-[#fbbf24] rounded-lg flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                <span className="material-symbols-outlined text-[#402d00] text-3xl font-bold">content_cut</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight text-white mb-6 uppercase leading-tight">PRONTO PARA TRANSFORMAR <br /> SUA BARBEARIA?</h2>
              <p className="text-[#d3c5ac] text-base md:text-lg mb-12 max-w-2xl mx-auto font-medium font-body">
                Junte-se a centenas de barbearias que já estão crescendo com o agendai. Comece gratuitamente e faça upgrade quando quiser.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to={ROUTES.REGISTER} className="bg-[#fbbf24] text-[#402d00] px-8 py-3.5 rounded-lg font-headline font-bold text-lg hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all flex items-center gap-2">
                  Criar Conta Grátis
                  <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                </Link>
                <Link to={ROUTES.LOGIN} className="bg-[#131313] text-white px-8 py-3.5 rounded-lg font-headline font-bold text-lg border border-white/10 hover:bg-white/5 transition-all">
                  Já tenho uma conta
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#0e0e0e] text-[#e5e2e1] py-16 px-6 border-t border-white/5 font-body">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
              <div className="md:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#fbbf24] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#402d00] text-2xl font-bold">content_cut</span>
                  </div>
                  <span className="text-2xl font-bold tracking-tighter text-white font-headline uppercase">agendai</span>
                </div>
                <p className="text-[#d3c5ac] max-w-xs text-sm leading-relaxed">
                  Sistema de agendamentos inteligente para barbearias modernas.
                </p>
              </div>
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <h4 className="text-white font-headline font-bold text-sm uppercase tracking-widest">Produto</h4>
                  <ul className="space-y-4 text-[#d3c5ac] text-sm font-body">
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#">Benefícios</a></li>
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#como-funciona">Como Funciona</a></li>
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#precos">Planos</a></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-white font-headline font-bold text-sm uppercase tracking-widest">Suporte</h4>
                  <ul className="space-y-4 text-[#d3c5ac] text-sm font-body">
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#">Central de Ajuda</a></li>
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#">Contato</a></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-white font-headline font-bold text-sm uppercase tracking-widest">Legal</h4>
                  <ul className="space-y-4 text-[#d3c5ac] text-sm font-body">
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#">Privacidade</a></li>
                    <li><a className="hover:text-[#fbbf24] transition-colors" href="#">Termos de Uso</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-white/10 mb-8"></div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-[#d3c5ac] text-sm font-body">
                © {new Date().getFullYear()} agendai. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
