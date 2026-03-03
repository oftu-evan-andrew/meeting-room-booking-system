import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { Building2, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useMemo } from 'react';
import { Link, replace, useLocation, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../ui/LoadingScreen';

export function Navbar() {
  const { user, initialLoading } = useAppSelector((state) => state.auth);
  
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    setTimeout(() => { 
      dispatch(logout());
    }, 10); 
    dispatch(logout());
  };

  if (initialLoading) {
    return <div className="h-16 border-b border-slate-100 bg-white/50 animate-pulse" />;
  }

  if (!user) {
    return null;
  }

  const links = useMemo(() => [
    { label: 'Rooms', path: '/rooms' },
    ...(user?.role?.toLowerCase() === "superadmin" 
      ? [{ label: 'Admin', path: '/admin', icon: <Shield className="w-3.5 h-3.5" /> }] 
      : []),
  ], [user]);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-nav">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center gap-8">

        <Link to="/rooms" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold text-slate-900 tracking-tight">
            Sync<span className="text-gold-500">Room</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                )}
              >
                {'icon' in link && link.icon}
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-slate-100 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors outline-none group">
              <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-slate-800 leading-tight">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] bg-white rounded-xl border border-slate-100 shadow-modal p-1.5 animate-slide-up"
              align="end" sideOffset={6}
            >
              <div className="px-3 py-2.5 border-b border-slate-50 mb-1">
                <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400">@{user.userName}</p>
              </div>
              <DropdownMenu.Item
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer outline-none transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

      </div>
    </header>
  );
}
