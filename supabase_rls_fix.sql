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
-- 11. ÍNDICES PARA PERFORMANCE (Skill: security-rls-performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies (created_by);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users (company_id);
CREATE INDEX IF NOT EXISTS idx_services_company_id ON services (company_id);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON clients (company_id);
CREATE INDEX IF NOT EXISTS idx_appointments_company_id ON appointments (company_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_company_id ON business_hours (company_id);
CREATE INDEX IF NOT EXISTS idx_blocked_times_company_id ON blocked_times (company_id);
CREATE INDEX IF NOT EXISTS idx_staff_company_id ON staff (company_id);

-- ============================================
-- 2. COMPANIES - Políticas Otimizadas
-- ============================================

-- SELECT: Autenticados veem SUA empresa; Anônimos podem ver por slug
CREATE POLICY "companies_select_authenticated" ON companies
  FOR SELECT TO authenticated
  USING (id = (SELECT get_my_company()) OR created_by = (SELECT auth.uid()));

CREATE POLICY "companies_select_anon" ON companies
  FOR SELECT TO anon
  USING (true);

-- INSERT: Apenas autenticados criam empresa
CREATE POLICY "companies_insert" ON companies
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = created_by);

-- UPDATE: Apenas dono/membro da empresa
CREATE POLICY "companies_update" ON companies
  FOR UPDATE TO authenticated
  USING (id = (SELECT get_my_company()) OR created_by = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT get_my_company()) OR created_by = (SELECT auth.uid()));

-- ============================================
-- 3. USERS - Políticas Otimizadas
-- ============================================

-- SELECT: Apenas membros da mesma empresa
CREATE POLICY "users_select" ON users
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()) OR id = (SELECT auth.uid()));

-- INSERT: Apenas o próprio usuário pode criar seu perfil
CREATE POLICY "users_insert" ON users
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- UPDATE: Apenas o próprio perfil
CREATE POLICY "users_update" ON users
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()));

-- ============================================
-- 4. SERVICES - Políticas Otimizadas
-- ============================================

CREATE POLICY "services_select_authenticated" ON services
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "services_select_anon" ON services
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "services_insert" ON services
  FOR INSERT TO authenticated
  WITH CHECK (company_id = (SELECT get_my_company()));

CREATE POLICY "services_update" ON services
  FOR UPDATE TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "services_delete" ON services
  FOR DELETE TO authenticated
  USING (company_id = (SELECT get_my_company()));

-- ============================================
-- 5. CLIENTS - Políticas Otimizadas
-- ============================================

CREATE POLICY "clients_select" ON clients
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "clients_insert_authenticated" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (company_id = (SELECT get_my_company()));

CREATE POLICY "clients_insert_anon" ON clients
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "clients_update" ON clients
  FOR UPDATE TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "clients_delete" ON clients
  FOR DELETE TO authenticated
  USING (company_id = (SELECT get_my_company()));

-- ============================================
-- 6. APPOINTMENTS - Políticas Otimizadas
-- ============================================

CREATE POLICY "appointments_select" ON appointments
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "appointments_insert_authenticated" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (company_id = (SELECT get_my_company()));

CREATE POLICY "appointments_insert_anon" ON appointments
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "appointments_update" ON appointments
  FOR UPDATE TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "appointments_delete" ON appointments
  FOR DELETE TO authenticated
  USING (company_id = (SELECT get_my_company()));

-- ============================================
-- 7. BUSINESS HOURS - Políticas Otimizadas
-- ============================================

CREATE POLICY "business_hours_select_authenticated" ON business_hours
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "business_hours_select_anon" ON business_hours
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "business_hours_insert" ON business_hours
  FOR INSERT TO authenticated
  WITH CHECK (company_id = (SELECT get_my_company()));

CREATE POLICY "business_hours_update" ON business_hours
  FOR UPDATE TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "business_hours_delete" ON business_hours
  FOR DELETE TO authenticated
  USING (company_id = (SELECT get_my_company()));

-- ============================================
-- 8. BLOCKED TIMES - Políticas Otimizadas
-- ============================================

CREATE POLICY "blocked_times_select_authenticated" ON blocked_times
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "blocked_times_select_anon" ON blocked_times
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "blocked_times_insert" ON blocked_times
  FOR INSERT TO authenticated
  WITH CHECK (company_id = (SELECT get_my_company()));

CREATE POLICY "blocked_times_update" ON blocked_times
  FOR UPDATE TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "blocked_times_delete" ON blocked_times
  FOR DELETE TO authenticated
  USING (company_id = (SELECT get_my_company()));

-- ============================================
-- 9. STAFF - Políticas Otimizadas
-- ============================================

ALTER TABLE IF EXISTS staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_select_authenticated" ON staff
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "staff_select_anon" ON staff
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "staff_insert" ON staff
  FOR INSERT TO authenticated
  WITH CHECK (company_id = (SELECT get_my_company()));

CREATE POLICY "staff_update" ON staff
  FOR UPDATE TO authenticated
  USING (company_id = (SELECT get_my_company()));

CREATE POLICY "staff_delete" ON staff
  FOR DELETE TO authenticated
  USING (company_id = (SELECT get_my_company()));

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

 - -   A d i c i o n a d o   v i a   M C P   p a r a   c o r r i g i r   p r o b l e m a   d e   E x c l u i r   C l i e n t e s 
 C R E A T E   P O L I C Y   " c l i e n t s _ d e l e t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " c l i e n t s " 
 F O R   D E L E T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " b l o c k e d _ t i m e s _ i n s e r t _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " b l o c k e d _ t i m e s " 
 F O R   I N S E R T   T O   a u t h e n t i c a t e d 
 W I T H   C H E C K   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " b l o c k e d _ t i m e s _ u p d a t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " b l o c k e d _ t i m e s " 
 F O R   U P D A T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " b l o c k e d _ t i m e s _ d e l e t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " b l o c k e d _ t i m e s " 
 F O R   D E L E T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " b u s i n e s s _ h o u r s _ i n s e r t _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " b u s i n e s s _ h o u r s " 
 F O R   I N S E R T   T O   a u t h e n t i c a t e d 
 W I T H   C H E C K   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " b u s i n e s s _ h o u r s _ u p d a t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " b u s i n e s s _ h o u r s " 
 F O R   U P D A T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " b u s i n e s s _ h o u r s _ d e l e t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " b u s i n e s s _ h o u r s " 
 F O R   D E L E T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " s t a f f _ i n s e r t _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " s t a f f " 
 F O R   I N S E R T   T O   a u t h e n t i c a t e d 
 W I T H   C H E C K   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " s t a f f _ u p d a t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " s t a f f " 
 F O R   U P D A T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " s t a f f _ d e l e t e _ a u t h e n t i c a t e d "   O N   " p u b l i c " . " s t a f f " 
 F O R   D E L E T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( c o m p a n y _ i d   =   ( S E L E C T   g e t _ m y _ c o m p a n y ( )   A S   g e t _ m y _ c o m p a n y ) ) ; 
 
 C R E A T E   P O L I C Y   " u s e r s _ d e l e t e "   O N   " p u b l i c " . " u s e r s " 
 F O R   D E L E T E   T O   a u t h e n t i c a t e d 
 U S I N G   ( i d   =   ( S E L E C T   a u t h . u i d ( ) ) ) ; 
  
 