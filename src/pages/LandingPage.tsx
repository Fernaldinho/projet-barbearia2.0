import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarCheck,
  Users,
  Scissors,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  Loader2,
  Menu,
  X
} from 'lucide-react'
import { ROUTES, APP_NAME } from '@/utils/constants'
import { useAuth } from '@/contexts/AuthContext'

const features = [
  {
    icon: CalendarCheck,
    title: 'Agendamento Flexível',
    description: 'Permita que seus clientes agendem 24/7 de forma intuitiva, reduzindo o atrito e aumentando sua agenda.',
  },
  {
    icon: Users,
    title: 'Gestão Inteligente',
    description: 'Mapeie o perfil dos seus clientes. Tenha o histórico detalhado para oferecer um serviço cada vez mais premium.',
  },
  {
    icon: Scissors,
    title: 'Catálogo Dinâmico',
    description: 'Apresente seus serviços com elegância. Precificação clara, duração exata e opções dinâmicas.',
  },
  {
    icon: TrendingUp,
    title: 'Insights Financeiros',
    description: 'Acompanhe seu crescimento com dashboards interativos, análises de comissões e previsão de receita.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'Grátis',
    period: 'para começar',
    features: ['Até 50 clientes na base', 'Gestão de 10 serviços', 'Até 100 agendamentos/mês', 'Suporte via ticket'],
    highlight: false,
    ctaText: 'Começar Agora'
  },
  {
    name: 'Pro',
    price: 'R$ 79',
    period: '/mês',
    features: ['Clientes e serviços ilimitados', 'Agendamentos sem restrições', 'Dashboards financeiros avançados', 'Suporte prioritário 24/7'],
    highlight: true,
    ctaText: 'Assinar o Pro'
  },
  {
    name: 'Enterprise',
    price: 'R$ 149',
    period: '/mês',
    features: ['Todos os recursos Pro', 'Gestão de múltiplas unidades', 'API de integração completa', 'Gerente de sucesso dedicado'],
    highlight: false,
    ctaText: 'Falar com Consultor'
  },
]

export function LandingPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [demoLoading, setDemoLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDemoAccess = async () => {
    setDemoLoading(true)
    try {
      const { error } = await login('demo@barberpro.com', '123456')
      if (!error) {
        navigate(ROUTES.DASHBOARD)
      } else {
        navigate(ROUTES.REGISTER)
      }
    } catch (err) {
      navigate(ROUTES.REGISTER)
    } finally {
      setDemoLoading(false)
    }
  }

  const PrimaryCallToAction = ({ className = '', text }: { className?: string, text?: string }) => {
    if (user) {
      return (
        <Link to={ROUTES.DASHBOARD} className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 ${className}`}>
          {text || 'Acessar Dashboard'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      )
    }
    return (
      <Link to={ROUTES.REGISTER} className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 ${className}`}>
        {text || 'Comece Gratuitamente'}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      {/* Background Ambient Layers (Glassmorphism & Orbs) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[150px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-yellow-400/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPgo8cmVjdCB3aWR0aD0nNCcgaGVpZ2h0PSc0JyBmaWxsPSd0cmFuc3BhcmVudCcvPgo8Y2lyY2xlIGN4PScxJyBjeT0nMScgcj0nMC41JyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpJy8+Cjwvc3ZnPg==')] opacity-40 z-0" />
      </div>

      {/* Navbar with subtle backdrop filter transition */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'py-3 backdrop-blur-xl bg-[#050505]/80 border-b border-white/5 shadow-2xl shadow-black/50' : 'py-5 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-105" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-black" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">{APP_NAME}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 bg-white/[0.03] px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
              Recursos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
              Preços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!user && (
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
                Entrar
              </Link>
            )}
            <PrimaryCallToAction text={user ? 'Painel' : 'Começar grátis'} />
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 animate-in fade-in duration-200">
          <button onClick={() => scrollToSection('features')} className="text-2xl font-bold text-white">Recursos</button>
          <button onClick={() => scrollToSection('pricing')} className="text-2xl font-bold text-white">Preços</button>
          {!user && <Link onClick={() => setMobileMenuOpen(false)} to={ROUTES.LOGIN} className="text-2xl font-bold text-gray-400">Entrar</Link>}
          <div onClick={() => setMobileMenuOpen(false)} className="mt-4">
            <PrimaryCallToAction className="text-lg px-8 py-4" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-amber-400 text-sm font-medium mb-8 shadow-inner shadow-amber-500/5 animate-fade-in group hover:bg-amber-500/20 transition-all cursor-default">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          Revolucione sua barbearia
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-fade-in [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards] max-w-4xl leading-[1.1]">
          A revolução em <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 relative inline-block">
            Gestão de Salões
            {/* Glossy highlight over text */}
            <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent pointer-events-none mix-blend-overlay"></span>
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          O software all-in-one que moderniza seu atendimento, atrai mais clientes e centraliza todo o seu financeiro com a elegância que sua marca merece.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 justify-center animate-fade-in [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
          <PrimaryCallToAction className="text-base px-8 py-4 w-full sm:w-auto" text="Comece a usar hoje" />
          
          <button
            onClick={() => scrollToSection('features')}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-lg"
          >
            Explorar recursos
          </button>
        </div>
        
        {/* Abstract App Preview */}
        <div className="mt-20 w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-2 animate-fade-in [animation-delay:500ms] opacity-0 [animation-fill-mode:forwards] group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 bottom-0 top-1/2 pointer-events-none"></div>
          <div className="rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 relative flex flex-col pt-4">
             {/* Fake Mac Header */}
             <div className="flex items-center gap-2 px-4 pb-4 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
             </div>
             {/* App Preview Image */}
             <div className="relative w-full overflow-hidden flex items-center justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
               <img src="/dashboard-mockup.png" alt="Painel do BarberPro" className="w-full rounded-lg shadow-[0_0_50px_rgba(251,191,36,0.15)] border border-white/5" />
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-amber-500 font-semibold tracking-wide uppercase text-sm mb-3">Poder Supremo</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Elegância em cada detalhe</h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Ferramentas desenhadas em um ecossistema perfeito para não deixar você perder nem um minuto do seu dia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-[100px] group-hover:bg-amber-500/10 transition-colors duration-500 transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                  <feature.icon className="w-7 h-7 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-white">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto p-[1px] rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>
          
          <div className="rounded-[calc(2rem-1px)] bg-[#0A0A0A] p-12 md:p-20 text-center relative z-20 border border-white/5 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-amber-500/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Experimente o Futuro</h2>
              <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                Teste todas as funcionalidades no nosso ambiente live e veja por que milhares de profissionais estão migrando para nossa plataforma.
              </p>
              <button 
                onClick={handleDemoAccess} 
                disabled={demoLoading}
                className="inline-flex items-center justify-center gap-3 bg-white text-black font-semibold text-lg px-8 py-4 rounded-full transition-all hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-wait"
              >
                {demoLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Iniciar Demonstração
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-amber-500 font-semibold tracking-wide uppercase text-sm mb-3">Investimento</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Planos transparentes</h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Feitos para alavancar seu crescimento. Sem taxas escondidas e cancele quando quiser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-[1px] ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-amber-400 to-amber-900/40 shadow-2xl shadow-amber-500/20 md:-translate-y-4 filter' 
                  : 'bg-gradient-to-b from-white/10 to-transparent'
              } transition-transform duration-300 hover:scale-[1.02]`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg z-20">
                  MAIS ESCOLHIDO
                </div>
              )}
              
              <div className={`h-full rounded-[calc(1.5rem-1px)] p-8 flex flex-col ${
                plan.highlight ? 'bg-[#0f0f0f]' : 'bg-[#0a0a0a]'
              }`}>
                <h4 className="text-xl font-semibold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  <span className="text-gray-500 font-medium">{plan.period}</span>
                </div>
                
                <div className="w-full h-px bg-white/10 mb-8"></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-amber-400' : 'text-gray-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5 hover:border-white/10'
                }`}>
                  {plan.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-20 pt-16 pb-8 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">{APP_NAME}</span>
            </div>
            
            <div className="flex flex-wrapjustify-center gap-x-8 gap-y-4">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Recursos</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Preços</button>
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-white transition-colors"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg></a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors"><span className="sr-only">GitHub</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
