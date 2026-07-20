import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User } from '@/lib/types'

const LS_USER_KEY = 'freelanceai_user'
const LS_USERS_KEY = 'freelanceai_users'

export async function login(email: string, password: string): Promise<User> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return {
      id: data.user.id,
      email: data.user.email ?? '',
      name: data.user.user_metadata?.name || (data.user.email ?? ''),
    }
  }

  const users: Array<User & { password: string }> = JSON.parse(
    localStorage.getItem(LS_USERS_KEY) || '[]'
  )
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Email o contraseña incorrectos')
  const { password: _, ...safeUser } = user
  localStorage.setItem(LS_USER_KEY, JSON.stringify(safeUser))
  return safeUser
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<User> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    return {
      id: data.user!.id,
      email: data.user!.email ?? '',
      name,
    }
  }

  const users: Array<User & { password: string }> = JSON.parse(
    localStorage.getItem(LS_USERS_KEY) || '[]'
  )
  if (users.find(u => u.email === email)) {
    throw new Error('Este email ya está registrado')
  }

  const newUser: User & { password: string } = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  }
  users.push(newUser)
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users))

  const { password: _, ...safeUser } = newUser
  localStorage.setItem(LS_USER_KEY, JSON.stringify(safeUser))
  return safeUser
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut()
  }
  localStorage.removeItem(LS_USER_KEY)
}

export async function getCurrentUser(): Promise<User | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name || (user.email ?? ''),
    }
  }

  const raw = localStorage.getItem(LS_USER_KEY)
  return raw ? JSON.parse(raw) : null
}
