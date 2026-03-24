-- ========================================================
-- TABELAS PARA FATURAMENTO E WEBHOOK (KIRVANO)
-- ========================================================

-- 1. Table: invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  external_id TEXT, -- ID da fatura no Kirvano
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- paid, pending, cancelled
  description TEXT,
  customer_email TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- 3. RLS Policies para Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- SELECT: Apenas membros da mesma empresa podem ver faturas
CREATE POLICY "invoices_select" ON invoices
  FOR SELECT TO authenticated
  USING (company_id = (SELECT get_my_company()));

-- INSERT/UPDATE/DELETE: Apenas via Service Role (Webhook) ou Admins do sistema se necessário
-- Por padrão, o cliente não insere faturas manualmente.

-- 4. Trigger de Updated At
CREATE TRIGGER update_invoices_modtime BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================================
-- ATUALIZAÇÃO DA TABELA COMPANIES
-- ========================================================

-- Adicionar campo para ID externo do cliente (se necessário)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='companies' AND COLUMN_NAME='external_customer_id') THEN
        ALTER TABLE companies ADD COLUMN external_customer_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='companies' AND COLUMN_NAME='subscription_id') THEN
        ALTER TABLE companies ADD COLUMN subscription_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='companies' AND COLUMN_NAME='subscription_status') THEN
        ALTER TABLE companies ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
    END IF;
END $$;
