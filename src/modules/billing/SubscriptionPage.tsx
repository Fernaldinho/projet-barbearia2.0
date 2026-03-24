import { CheckCircle2, Star, ShieldCheck, Zap, Crown, ArrowRight } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'

export function SubscriptionPage() {
  const { company } = useCompany()

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, title: 'Agendamentos Ilimitados', desc: 'Sem travas ou limites mensais' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Relatórios Financeiros', desc: 'Análise completa de lucros e gastos' },
    { icon: <Crown className="w-5 h-5" />, title: 'IA de Prioridade', desc: 'Seus clientes agendam com mais fluidez' },
  ]

  return (
    <div className="animate-fade-in pb-20 space-y-16 mt-8">
      {/* Search Header Style (Consistent) */}
      <div className="flex items-center px-4 lg:px-0 mb-12">
        <div className="relative flex items-center group flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#fbbf24] transition-colors">search</span>
          <input 
            className="w-full bg-[#0e0e0e] border-none py-3.5 pl-12 pr-6 rounded-full text-sm focus:ring-1 focus:ring-[#fbbf24] placeholder:text-zinc-600 transition-all outline-none text-[#E5E2E1]" 
            placeholder="Pesquisar nos planos..." 
            type="text"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Hero Section */}
        <header className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#fbbf24] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Eleve o Nível do seu Negócio</span>
              <h1 className="text-6xl font-headline font-black text-[#E5E2E1] tracking-tighter uppercase leading-none mb-8">
                AgendaAI <span className="text-[#fbbf24]">PRO</span>
              </h1>
              <div className="space-y-6">
                {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="p-2 bg-[#fbbf24]/10 rounded-lg text-[#fbbf24] mt-1">{b.icon}</div>
                        <div>
                            <p className="font-black text-white text-sm uppercase tracking-tighter">{b.title}</p>
                            <p className="text-zinc-500 text-xs font-medium">{b.desc}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#131313] to-transparent z-10"></div>
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQe5SXSxDR04mAagtvJT-0LATw9R2F94QjCfIiTdv2DsFmOgXuxsu2GUKVgtKEjPkVOBbrGZ27UfzR6EXnOkeYAHTeTH5TWbCowpDfO_V-O6-2IjsrGPBFkjMLkdDjDXwkMLFsX-y3akzvCCFQj7lSfCET2LedYFD2WxZ7GujfnFuiNwrp7KK3XEd8EzcLVGyFBfNUYwsRF81Mq72jZKU0mSISsMJ3OFWVF5iDsKwl_-cmoIeXfO_znj12MplyWnc3hWHH0A7UJ1Td" 
                    alt="Barbearia Profissional" 
                    className="w-full h-[400px] object-cover rounded-[3rem] grayscale opacity-40"
                />
            </div>
        </header>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-8">
          
          {/* Plano Mensal */}
          <section className="bg-[#1C1B1B] p-12 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col hover:border-white/10 transition-all group">
            <div className="mb-10 text-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">Assinatura Mensal</span>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">PRO MENSAL</h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-zinc-500 text-sm font-bold uppercase">R$</span>
                <span className="text-5xl font-black text-[#fbbf24]">37,99</span>
                <span className="text-zinc-500 text-xs font-bold uppercase">/ MÊS</span>
              </div>
            </div>

            <div className="space-y-4 mb-12 flex-1">
              {[
                'Acesso completo à plataforma',
                'Suporte especializado 24/7',
                'Backup em nuvem em tempo real'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-[#0e0e0e] rounded-2xl border border-white/[0.02]">
                  <CheckCircle2 className="w-5 h-5 text-[#fbbf24]" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-6 bg-transparent border-2 border-white/5 text-white hover:bg-[#fbbf24] hover:text-[#402D00] hover:border-[#fbbf24] transition-all rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 flex items-center justify-center gap-2 group">
              ASSINAR AGORA
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

          {/* Plano Semestral */}
          <section className="bg-gradient-to-br from-[#1C1B1B] to-[#131313] p-12 rounded-[3rem] border-2 border-[#fbbf24] shadow-2xl flex flex-col relative scale-[1.02] z-10">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#fbbf24] text-[#402D00] px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#fbbf24]/20 animate-pulse">
              MELHOR VALOR
            </div>
            
            <div className="mb-10 text-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">Assinatura Semestral</span>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">PRO SEMESTRAL</h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-zinc-500 text-sm font-bold uppercase">R$</span>
                <span className="text-5xl font-black text-[#fbbf24]">205,00</span>
                <span className="text-zinc-500 text-xs font-bold uppercase">/ 6 MESES</span>
              </div>
              <p className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.2em] mt-3">Economize mais de 10%</p>
            </div>

            <div className="space-y-4 mb-12 flex-1">
              {[
                'Todos os benefícios mensais',
                'Prioridade em novas funcionalidades',
                'Consultoria de gestão trimestral'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-[#0e0e0e] rounded-2xl border border-[#fbbf24]/10">
                  <Star className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" />
                  <span className="text-xs font-bold text-[#E5E2E1] uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-6 bg-[#fbbf24] text-[#402D00] hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#fbbf24]/10 active:scale-95 flex items-center justify-center gap-2 group">
              ASSINAR AGORA
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
                CANCELE A QUALQUER MOMENTO • PAGAMENTO 100% SEGURO
            </p>
        </div>
      </div>
    </div>
  )
}
