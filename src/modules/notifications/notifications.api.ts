import { supabase } from '@/lib/supabase'

export async function getNotifications(companyId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)

  if (error) throw error
}

export async function markAllAsRead(companyId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('company_id', companyId)
    .eq('read', false)

  if (error) throw error
}

export async function deleteNotification(id: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function clearAllNotifications(companyId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('company_id', companyId)

  if (error) throw error
}
