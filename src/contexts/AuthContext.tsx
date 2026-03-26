import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  register: (email: string, password: string, name: string, companyName: string, phone: string, address: string) => Promise<{ error: Error | null }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const register = async (email: string, password: string, name: string, companyName: string, phone: string, address: string) => {
    // 1. Sign up user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name,
          company_name: companyName
        },
      },
    })

    if (signUpError) return { error: signUpError as Error }
    if (!authData.user) return { error: new Error('Ocorreu um erro na criação da conta.') }

    const user = authData.user

    try {
      // 2. Create Company
      let baseSlug = companyName
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
      
      let finalSlug = baseSlug
      let retryCount = 0
      let success = false
      let company = null

      while (!success && retryCount < 5) {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: companyName,
              slug: finalSlug,
              phone: phone,
              address: address,
              email: email, 
              created_by: user.id
            }
          ])
          .select()
          .single()

        if (!companyError) {
          company = newCompany
          success = true
        } else if (companyError.code === '23505') {
          const randomSuffix = Math.floor(Math.random() * 1000).toString()
          finalSlug = `${baseSlug}-${randomSuffix}`
          retryCount++
        } else {
          throw companyError
        }
      }

      if (!company) throw new Error('Não foi possível configurar sua barbearia.')

      // 3. Create User Profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert([
          {
            id: user.id,
            company_id: (company as any).id,
            name: name,
            email: email,
            role: 'owner',
          }
        ], { onConflict: 'id' })

      if (profileError) throw profileError

      return { error: null }
    } catch (dbError: any) {
      console.error('DB setup error:', dbError)
      return { error: dbError as Error }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error as Error | null }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error as Error | null }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
