import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, Users, Target, FileText, Mail, Receipt, LogOut, X } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts', icon: Users, label: 'Contactos' },
  { to: '/pipeline', icon: Target, label: 'Pipeline' },
  { to: '/proposals', icon: FileText, label: 'Propuestas' },
  { to: '/emails', icon: Mail, label: 'Emails' },
  { to: '/invoices', icon: Receipt, label: 'Facturación' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-surface-100 border-r border-slate-700/50 flex flex-col z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="px-6 py-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="text-xl font-bold">
            Freelance<span className="bg-gradient-to-br from-indigo-500 to-pink-500 bg-clip-text text-transparent">AI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
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
    </>
  )
}
