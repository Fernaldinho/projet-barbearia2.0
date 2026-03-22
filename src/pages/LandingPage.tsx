import { Link } from 'react-router-dom'
import { Calendar, BarChart3, Package2, DollarSign, CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-headline { font-family: 'Noto Serif', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-label { font-family: 'Inter', sans-serif; }
        .glass-card { background: rgba(53, 53, 52, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(80, 69, 50, 0.15); }
        .gold-gradient { background: linear-gradient(135deg, #ffe2ab 0%, #ffbf00 100%); }
      `}} />
      <div className="bg-[#131313] text-[#e5e2e1] antialiased min-h-screen font-body selection:bg-[#ffbf00]/30 selection:text-black">
        {/* TopNavBar */}
        <nav className="fixed top-0 w-full z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_0_40px_rgba(229,226,225,0.06)]">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
            <span className="font-headline text-2xl font-bold tracking-tighter text-[#ffbf00]">agendai</span>
            <div className="hidden md:flex items-center space-x-8 font-headline text-sm tracking-widest uppercase">
              <a className="text-[#ffbf00] border-b-2 border-[#ffbf00] pb-1" href="#home">Home</a>
              <a className="text-neutral-400 hover:text-white transition-colors" href="#features">Features</a>
              <a className="text-neutral-400 hover:text-white transition-colors" href="#pricing">Pricing</a>
            </div>
            <Link to={ROUTES.REGISTER} className="gold-gradient text-[#261a00] px-6 py-2 rounded font-medium text-sm tracking-wide uppercase hover:brightness-110 active:scale-95 transition-all duration-200">
                Começar agora
            </Link>
          </div>
        </nav>

        <main id="home">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-30 grayscale contrast-125" alt="Interior de uma barbearia de luxo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfIlN8xfT_O6VPq2XHMDC6jZ4Sx1xlN_Mo_9g2vQ8pxG2gKsKBDi5RimqjpvEsjI7Ieh-iEvFN-WgWY6JuvAN7jVUf-RTJxWtqNusfiL6x1Zc3XqrWKFQYLOuB9S1rFte-LKr9BiR4qUO3hYqBCxeD-zmfKGJWpe483fz_c0W-yaxOJ3vzanzVMDRD3ozGCpPtPI2PFDdYnu1TZxuJWRBgpZY8PefIFKdfVnLyt2h1bY1wYXdgNLKCgnM38tEWv9_iYRo0e31Mf-s"/>
              <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-6 tracking-tight">
                  Eleve o Patamar da sua <span className="text-[#ffe2ab] italic">Barbearia</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-[#d4c5ab] max-w-2xl mb-10 leading-relaxed">
                  A gestão de herança moderna encontra a tecnologia de ponta. Controle agendamentos, finanças e estoque com a precisão de uma lâmina afiada.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={ROUTES.REGISTER} className="gold-gradient text-[#261a00] px-8 py-4 rounded font-bold uppercase tracking-wider text-sm shadow-xl hover:brightness-110 transition-all active:scale-95">
                    Começar grátis
                  </Link>
                  <Link to={ROUTES.DASHBOARD} className="bg-[#353534]/60 backdrop-blur-md border border-[#504532]/30 text-[#ffe2ab] px-8 py-4 rounded font-bold uppercase tracking-wider text-sm hover:bg-[#2a2a2a] transition-all active:scale-95 flex items-center justify-center">
                    Acessar Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Bento Grid */}
          <section id="features" className="py-24 bg-[#0e0e0e] relative">
            <div className="max-w-7xl mx-auto px-8">
              <div className="mb-16">
                <span className="font-label text-[#ffe2ab] tracking-[0.3em] uppercase text-xs block mb-4">A Excelência no Detalhe</span>
                <h2 className="font-headline text-4xl md:text-5xl">Funcionalidades Sob Medida</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Feature 1 */}
                <div className="glass-card p-8 group hover:border-[#ffe2ab]/40 transition-all duration-500 rounded-lg">
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-[#ffe2ab]/10 text-[#ffe2ab] mb-6 group-hover:bg-[#ffe2ab] group-hover:text-[#402d00] transition-colors">
                    <Calendar className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-headline text-xl mb-3">Agendamento Flexível</h3>
                  <p className="font-body text-sm text-[#d4c5ab] leading-relaxed">Sincronização em tempo real e interface intuitiva para seus clientes reservarem em segundos.</p>
                </div>
                {/* Feature 2 */}
                <div className="glass-card p-8 group hover:border-[#ffe2ab]/40 transition-all duration-500 rounded-lg">
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-[#ffe2ab]/10 text-[#ffe2ab] mb-6 group-hover:bg-[#ffe2ab] group-hover:text-[#402d00] transition-colors">
                    <BarChart3 className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-headline text-xl mb-3">Gestão Inteligente</h3>
                  <p className="font-body text-sm text-[#d4c5ab] leading-relaxed">Controle total sobre sua equipe, comissões e performance individual em um único painel.</p>
                </div>
                {/* Feature 3 */}
                <div className="glass-card p-8 group hover:border-[#ffe2ab]/40 transition-all duration-500 rounded-lg">
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-[#ffe2ab]/10 text-[#ffe2ab] mb-6 group-hover:bg-[#ffe2ab] group-hover:text-[#402d00] transition-colors">
                    <Package2 className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-headline text-xl mb-3">Catálogo Dinâmico</h3>
                  <p className="font-body text-sm text-[#d4c5ab] leading-relaxed">Gestão de produtos e serviços com controle automático de estoque e alertas de reposição.</p>
                </div>
                {/* Feature 4 */}
                <div className="glass-card p-8 group hover:border-[#ffe2ab]/40 transition-all duration-500 rounded-lg">
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-[#ffe2ab]/10 text-[#ffe2ab] mb-6 group-hover:bg-[#ffe2ab] group-hover:text-[#402d00] transition-colors">
                    <DollarSign className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-headline text-xl mb-3">Insights Financeiros</h3>
                  <p className="font-body text-sm text-[#d4c5ab] leading-relaxed">Relatórios detalhados de faturamento, custos e lucratividade para decisões precisas.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-24 bg-[#131313] overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div className="max-w-xl">
                  <span className="font-label text-[#e9c349] tracking-[0.3em] uppercase text-xs block mb-4">Investimento</span>
                  <h2 className="font-headline text-4xl md:text-5xl mb-6">Planos que acompanham seu crescimento</h2>
                </div>
                <div className="flex p-1 bg-[#201f1f] rounded gap-1">
                  <button className="px-6 py-2 bg-[#ffe2ab] text-[#402d00] text-xs font-bold uppercase rounded cursor-default">Mensal</button>
                  <button className="px-6 py-2 text-[#d4c5ab] text-xs font-bold uppercase rounded hover:text-[#e5e2e1] transition-colors">Anual</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Starter Plan */}
                <div className="p-10 border border-[#504532]/10 bg-[#1c1b1b] flex flex-col rounded-xl hover:border-[#504532]/30 transition-colors">
                  <span className="font-label text-[#d4c5ab] text-xs tracking-widest uppercase mb-4">Starter</span>
                  <div className="mb-8">
                    <span className="text-4xl font-headline italic">R$ 89</span>
                    <span className="text-[#d4c5ab] font-body text-sm">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Até 2 profissionais
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Agendamento Online
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Gestão de Clientes
                    </li>
                  </ul>
                  <button className="w-full py-4 border border-[#504532] text-[#e5e2e1] font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors rounded">
                    Selecionar
                  </button>
                </div>

                {/* Professional Plan */}
                <div className="p-10 bg-[#2a2a2a] border-2 border-[#ffe2ab] relative flex flex-col shadow-2xl scale-105 z-10 rounded-xl">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient text-[#261a00] px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                    Mais Popular
                  </div>
                  <span className="font-label text-[#ffe2ab] text-xs tracking-widest uppercase mb-4">Professional</span>
                  <div className="mb-8">
                    <span className="text-4xl font-headline italic">R$ 159</span>
                    <span className="text-[#d4c5ab] font-body text-sm">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Até 10 profissionais
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Dashboard Financeiro
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Marketing por SMS/Email
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Gestão de Comissões
                    </li>
                  </ul>
                  <button className="w-full py-4 gold-gradient text-[#261a00] font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all rounded shadow-lg">
                    Começar agora
                  </button>
                </div>

                {/* Elite Plan */}
                <div className="p-10 border border-[#504532]/10 bg-[#1c1b1b] flex flex-col rounded-xl hover:border-[#504532]/30 transition-colors">
                  <span className="font-label text-[#d4c5ab] text-xs tracking-widest uppercase mb-4">Elite</span>
                  <div className="mb-8">
                    <span className="text-4xl font-headline italic">R$ 299</span>
                    <span className="text-[#d4c5ab] font-body text-sm">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Profissionais ilimitados
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Multi-unidades
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> API de Integração
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-[#ffe2ab] w-5 h-5 shrink-0" /> Gerente da conta
                    </li>
                  </ul>
                  <button className="w-full py-4 border border-[#504532] text-[#e5e2e1] font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors rounded">
                    Falar com especialista
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden bg-[#0e0e0e]">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-20 contrast-125 grayscale" alt="Close de navalha" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO9NQc9maAT4Wc1Oo-KpQMVEbxRkbG7TwRj-ltY--25WPI2MzL2xhw2u-qJUEohwtWB6KxxjlvuHzAPvkStwCFhkM9rpeDDIBZPNsf42V4MZo2tP5eD4FO74qnmT1wQ4wYu_QZLssUCA02RuDlmOvUzndoJz5xIbltVtL0ymqN4mEfJeGRVW6qu-kZ1znrp6-6WW13cariuyaG2qkamgUAW08hsaJiz32d6WBfJL-tSmgiTxgIgu_Ock4BfbT9U_yC-00YlScZepw"/>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-8 text-center pt-10">
              <h2 className="font-headline text-4xl md:text-6xl mb-8 leading-tight">Pronto para transformar sua experiência?</h2>
              <p className="font-body text-[#d4c5ab] text-lg mb-10">Junte-se a centenas de barbearias que já modernizaram sua gestão com o agendai.</p>
              <div className="flex justify-center">
                <Link to={ROUTES.REGISTER} className="gold-gradient text-[#261a00] px-12 py-5 rounded-sm font-bold uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(255,191,0,0.2)] hover:scale-105 active:scale-95 transition-transform duration-200">
                  Criar minha conta grátis
                </Link>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] w-full py-16 px-8 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="col-span-1 md:col-span-1">
              <span className="font-headline text-xl text-[#ffbf00] mb-4 block">agendai</span>
              <p className="font-body text-xs tracking-wide text-neutral-500 leading-relaxed max-w-xs">
                Software de gestão para estabelecimentos que valorizam o ritual, a tradição e a tecnologia.
              </p>
            </div>
            <div>
              <h4 className="font-label text-[#e9c349] text-[10px] tracking-[0.3em] uppercase mb-6">Plataforma</h4>
              <ul className="space-y-4 font-body text-xs tracking-wide">
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Agendamento</a></li>
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Financeiro</a></li>
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Estoque</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label text-[#e9c349] text-[10px] tracking-[0.3em] uppercase mb-6">Empresa</h4>
              <ul className="space-y-4 font-body text-xs tracking-wide">
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Sobre Nós</a></li>
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Carreiras</a></li>
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Blog Editorial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label text-[#e9c349] text-[10px] tracking-[0.3em] uppercase mb-6">Suporte</h4>
              <ul className="space-y-4 font-body text-xs tracking-wide">
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Central de Ajuda</a></li>
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Privacidade</a></li>
                <li><a className="text-neutral-500 hover:text-[#ffdfa0] transition-colors" href="#">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-[10px] tracking-wide text-neutral-500">
              © {new Date().getFullYear()} agendai. Built for Efficiency.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
