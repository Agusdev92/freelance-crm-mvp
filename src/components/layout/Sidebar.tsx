import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, Users, Target, FileText, Mail, Receipt, LogOut } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts', icon: Users, label: 'Contactos' },
  { to: '/pipeline', icon: Target, label: 'Pipeline' },
  { to: '/proposals', icon: FileText, label: 'Propuestas' },
  { to: '/emails', icon: Mail, label: 'Emails' },
  { to: '/invoices', icon: Receipt, label: 'Facturación' },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-surface-100 border-r border-slate-700/50 flex flex-col fixed h-screen">
      <div className="px-6 py-6 border-b border-slate-700/50">
        <div className="text-xl font-bold">
          Freelance<span className="bg-gradient-to-br from-indigo-500 to-pink-500 bg-clip-text text-transparent">AI</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
            {user ? getInitials(user.name) : '?'}
          </div>
          <span className="text-sm font-medium truncate max-w-[100px]">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
