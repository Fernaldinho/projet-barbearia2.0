-- ========================================================
-- CORREÇÃO DE SEGURANÇA: RLS (Row Level Security)
-- ========================================================
-- EXECUTAR ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- Painel: https://supabase.com/dashboard > SQL Editor
-- ========================================================

-- ============================================
-- 1. REMOVER TODAS AS POLÍTICAS ANTIGAS
-- ============================================

-- Companies
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Owners can update their company" ON companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON companies;

-- Users
DROP POLICY IF EXISTS "Tenant access: users" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;

-- Services
DROP POLICY IF EXISTS "Tenant access: services" ON services;

-- Clients
DROP POLICY IF EXISTS "Tenant access: clients" ON clients;

-- Appointments
DROP POLICY IF EXISTS "Tenant access: appointments" ON appointments;

-- Business Hours
DROP POLICY IF EXISTS "Tenant access: business_hours" ON business_hours;

-- Blocked Times
DROP POLICY IF EXISTS "Tenant access: blocked_times" ON blocked_times;

-- Staff (se existir)
DROP POLICY IF EXISTS "Tenant access: staff" ON staff;

-- ============================================
-- 2. COMPANIES - Políticas Corrigidas
-- ============================================

-- SELECT: Autenticados veem SUA empresa; Anônimos podem ver por slug (booking público)
CREATE POLICY "companies_select_authenticated" ON companies
  FOR SELECT TO authenticated
  USING (id = get_my_company() OR created_by = auth.uid());

CREATE POLICY "companies_select_anon" ON companies
  FOR SELECT TO anon
  USING (true);
  -- Nota: Empresas são publicamente "descobríveis" via slug para booking.
  -- Se quiser esconder dados sensíveis, use uma VIEW com campos limitados.

-- INSERT: Apenas autenticados criam empresa (onboarding)
CREATE POLICY "companies_insert" ON companies
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- UPDATE: Apenas dono/membro da empresa
CREATE POLICY "companies_update" ON companies
  FOR UPDATE TO authenticated
  USING (id = get_my_company() OR created_by = auth.uid())
  WITH CHECK (id = get_my_company() OR created_by = auth.uid());

-- DELETE: Ninguém pode deletar empresa pela API
CREATE POLICY "companies_delete" ON companies
  FOR DELETE TO authenticated
  USING (false);

-- ============================================
-- 3. USERS - Políticas Corrigidas
-- ============================================

-- SELECT: Apenas membros da mesma empresa
CREATE POLICY "users_select" ON users
  FOR SELECT TO authenticated
  USING (company_id = get_my_company() OR id = auth.uid());

-- INSERT: Apenas o próprio usuário pode criar seu perfil
CREATE POLICY "users_insert" ON users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- UPDATE: Apenas o próprio perfil
CREATE POLICY "users_update" ON users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- DELETE: Ninguém pela API
CREATE POLICY "users_delete" ON users
  FOR DELETE TO authenticated
  USING (false);

-- ============================================
-- 4. SERVICES - Políticas Corrigidas
-- ============================================

-- SELECT: Autenticados veem da sua empresa; Anônimos veem apenas ativos (booking público)
CREATE POLICY "services_select_authenticated" ON services
  FOR SELECT TO authenticated
  USING (company_id = get_my_company());

CREATE POLICY "services_select_anon" ON services
  FOR SELECT TO anon
  USING (is_active = true);

-- INSERT: Apenas autenticados da mesma empresa
CREATE POLICY "services_insert" ON services
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company());

-- UPDATE: Apenas autenticados da mesma empresa
CREATE POLICY "services_update" ON services
  FOR UPDATE TO authenticated
  USING (company_id = get_my_company());

-- DELETE: Apenas autenticados da mesma empresa
CREATE POLICY "services_delete" ON services
  FOR DELETE TO authenticated
  USING (company_id = get_my_company());

-- ============================================
-- 5. CLIENTS - Políticas Corrigidas
-- ============================================

-- SELECT: Apenas autenticados da mesma empresa
CREATE POLICY "clients_select" ON clients
  FOR SELECT TO authenticated
  USING (company_id = get_my_company());

-- Anônimos NÃO podem ver clientes
-- INSERT: Autenticados da mesma empresa + anônimos podem criar (booking público)
CREATE POLICY "clients_insert_authenticated" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company());

CREATE POLICY "clients_insert_anon" ON clients
  FOR INSERT TO anon
  WITH CHECK (true);
  -- Necessário para booking público onde cliente não-logado fornece dados.
  -- O booking precisa criar o cliente na empresa.

-- UPDATE: Apenas autenticados da mesma empresa
CREATE POLICY "clients_update" ON clients
  FOR UPDATE TO authenticated
  USING (company_id = get_my_company());

-- DELETE: Apenas autenticados da mesma empresa
CREATE POLICY "clients_delete" ON clients
  FOR DELETE TO authenticated
  USING (company_id = get_my_company());

-- ============================================
-- 6. APPOINTMENTS - Políticas Corrigidas
-- ============================================

-- SELECT: Apenas autenticados da mesma empresa
CREATE POLICY "appointments_select" ON appointments
  FOR SELECT TO authenticated
  USING (company_id = get_my_company());

-- Anônimos NÃO podem ver agendamentos

-- INSERT: Autenticados + anônimos (booking público)
CREATE POLICY "appointments_insert_authenticated" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company());

CREATE POLICY "appointments_insert_anon" ON appointments
  FOR INSERT TO anon
  WITH CHECK (true);
  -- Necessário para booking público. Proteção adicional deve ser feita via Edge Function ou captcha.

-- UPDATE: Apenas autenticados da mesma empresa
CREATE POLICY "appointments_update" ON appointments
  FOR UPDATE TO authenticated
  USING (company_id = get_my_company());

-- DELETE: Apenas autenticados da mesma empresa
CREATE POLICY "appointments_delete" ON appointments
  FOR DELETE TO authenticated
  USING (company_id = get_my_company());

-- ============================================
-- 7. BUSINESS HOURS - Políticas Corrigidas
-- ============================================

-- SELECT: Autenticados da empresa + Anônimos (necessário para calcular slots disponíveis no booking)
CREATE POLICY "business_hours_select_authenticated" ON business_hours
  FOR SELECT TO authenticated
  USING (company_id = get_my_company());

CREATE POLICY "business_hours_select_anon" ON business_hours
  FOR SELECT TO anon
  USING (true);

-- INSERT: Apenas autenticados da mesma empresa
CREATE POLICY "business_hours_insert" ON business_hours
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company());

-- UPDATE: Apenas autenticados da mesma empresa
CREATE POLICY "business_hours_update" ON business_hours
  FOR UPDATE TO authenticated
  USING (company_id = get_my_company());

-- DELETE: Apenas autenticados da mesma empresa
CREATE POLICY "business_hours_delete" ON business_hours
  FOR DELETE TO authenticated
  USING (company_id = get_my_company());

-- ============================================
-- 8. BLOCKED TIMES - Políticas Corrigidas
-- ============================================

-- SELECT: Autenticados + Anônimos (necessário para calcular disponibilidade no booking)
CREATE POLICY "blocked_times_select_authenticated" ON blocked_times
  FOR SELECT TO authenticated
  USING (company_id = get_my_company());

CREATE POLICY "blocked_times_select_anon" ON blocked_times
  FOR SELECT TO anon
  USING (true);

-- INSERT: Apenas autenticados da mesma empresa
CREATE POLICY "blocked_times_insert" ON blocked_times
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company());

-- UPDATE: Apenas autenticados da mesma empresa
CREATE POLICY "blocked_times_update" ON blocked_times
  FOR UPDATE TO authenticated
  USING (company_id = get_my_company());

-- DELETE: Apenas autenticados da mesma empresa
CREATE POLICY "blocked_times_delete" ON blocked_times
  FOR DELETE TO authenticated
  USING (company_id = get_my_company());

-- ============================================
-- 9. STAFF - Políticas (se tabela existir)
-- ============================================

-- Habilitar RLS se não estiver habilitado
ALTER TABLE IF EXISTS staff ENABLE ROW LEVEL SECURITY;

-- SELECT: Autenticados da empresa + Anônimos (necessário para booking - seleção de profissional)
CREATE POLICY "staff_select_authenticated" ON staff
  FOR SELECT TO authenticated
  USING (company_id = get_my_company());

CREATE POLICY "staff_select_anon" ON staff
  FOR SELECT TO anon
  USING (active = true);

-- INSERT: Apenas autenticados da mesma empresa
CREATE POLICY "staff_insert" ON staff
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company());

-- UPDATE: Apenas autenticados da mesma empresa
CREATE POLICY "staff_update" ON staff
  FOR UPDATE TO authenticated
  USING (company_id = get_my_company());

-- DELETE: Apenas autenticados da mesma empresa
CREATE POLICY "staff_delete" ON staff
  FOR DELETE TO authenticated
  USING (company_id = get_my_company());

-- ============================================
-- 10. VERIFICAÇÃO FINAL
-- ============================================

-- Confirmar que RLS está ativo em todas as tabelas
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('companies','users','services','clients','appointments','business_hours','blocked_times','staff')
ORDER BY tablename;
