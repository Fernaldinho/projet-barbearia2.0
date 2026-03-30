-- Comando para tornar o usuário 1Admin@gmail.com plano PRO
-- Execute este comando no SQL Editor do seu painel Supabase

UPDATE public.companies 
SET plan = 'pro' 
WHERE email = '1Admin@gmail.com';

-- Verificação (opcional)
SELECT name, slug, email, plan FROM public.companies WHERE email = '1Admin@gmail.com';
